from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
import os
import logging
from flask_migrate import Migrate
import pandas as pd
spec_df = pd.read_excel('concrete_specs_all_states_clean.xlsx')


app = Flask(__name__)

# Configure database URI
# app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')  # This will fetch the DATABASE_URL from environment variables
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
# app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://cshub_user:VHHbz2TW8DZrBAagdtY1hyqApWq0qKs4@dpg-cvl7t6c9c44c73fbhs7g-a.oregon-postgres.render.com/cshub'
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://neondb_owner:npg_FgPf4SYL8xNt@ep-holy-truth-a4umlkhs-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"

# app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')


app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database
db = SQLAlchemy(app)

migrate = Migrate(app, db)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class Data(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    design_PSI = db.Column(db.Integer, nullable=False)
    SCM_pct = db.Column(db.Float, nullable=False)
    CM_mass = db.Column(db.Float, nullable=False)
    mixture_co2e_total = db.Column(db.Float, nullable=False)
    test_PSI = db.Column(db.Float, nullable=True)  # Allow NULL values

    def __init__(self, design_PSI, SCM_pct, CM_mass, mixture_co2e_total, test_PSI):
        self.design_PSI = design_PSI
        self.SCM_pct = SCM_pct
        self.CM_mass = CM_mass
        self.mixture_co2e_total = mixture_co2e_total
        self.test_PSI = test_PSI

    def as_dict(self):
        return {
            'id': self.id,
            'design_PSI': self.design_PSI,
            'SCM_pct': self.SCM_pct,
            'CM_mass (kg/cy)': self.CM_mass,
            'mixture_co2e_total (kg CO2eq/cy)': self.mixture_co2e_total,
            'test_PSI': self.test_PSI
        }

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/filter', methods=['POST'])
def filter_data():
    try:
        req_data = request.json
        # logger.info(f"Received filter request: {req_data}")

        if not req_data:
            logger.error("Invalid input: No JSON data received")
            return jsonify({'error': 'Invalid input'}), 400

        min_strength = req_data.get('min_strength')
        max_strength = req_data.get('max_strength')
        min_scm_pct = req_data.get('min_scm_pct')
        max_scm_pct = req_data.get('max_scm_pct')
        min_cm_mass = req_data.get('min_cm_mass')
        max_cm_mass = req_data.get('max_cm_mass')

        # Start building the query
        query = Data.query.filter(Data.test_PSI.isnot(None))  # Exclude rows where test_PSI is NULL

        # Apply filters
        if min_strength is not None:
            query = query.filter(Data.design_PSI >= min_strength)
        if max_strength is not None:
            query = query.filter(Data.design_PSI <= max_strength)
        if min_scm_pct is not None:
            query = query.filter(Data.SCM_pct >= min_scm_pct)
        if max_scm_pct is not None:
            query = query.filter(Data.SCM_pct <= max_scm_pct)
        if min_cm_mass is not None:
            query = query.filter(Data.CM_mass >= min_cm_mass)
        if max_cm_mass is not None:
            query = query.filter(Data.CM_mass <= max_cm_mass)

        # logger.info(f"Query after filters: {str(query)}")

        # Execute the query
        filtered_data = query.order_by(Data.mixture_co2e_total.asc()).all()

        response = {
            'column_order': ['design_PSI', 'SCM_pct', 'CM_mass (kg/cy)', 'mixture_co2e_total (kg CO2eq/cy)', 'test_PSI'],
            'data': [data.as_dict() for data in filtered_data]
        }

        # Log the results for debugging
        # logger.info(f"Filtered Data: {response['data']}")

        return jsonify(response)

    except KeyError as e:
        logger.error(f"KeyError in filter_data: {e}")
        return jsonify({'error': 'Invalid input parameters'}), 400

    except Exception as e:
        logger.error(f"Error in filter_data: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500


@app.route('/plot', methods=['POST'])
def plot_data():
    try:
        req_data = request.json
        if not req_data:
            logger.error("Invalid input: No JSON data received")
            return jsonify({'error': 'Invalid input'}), 400

        min_strength = req_data.get('min_strength')
        max_strength = req_data.get('max_strength')
        min_scm_pct = req_data.get('min_scm_pct')
        max_scm_pct = req_data.get('max_scm_pct')
        min_cm_mass = req_data.get('min_cm_mass')
        max_cm_mass = req_data.get('max_cm_mass')

        # Initial query with filters
        query = Data.query.filter(Data.test_PSI.isnot(None))  # Exclude rows where test_PSI is NULL

        if min_strength is not None:
            query = query.filter(Data.design_PSI >= min_strength)
        if max_strength is not None:
            query = query.filter(Data.design_PSI <= max_strength)
        if min_scm_pct is not None:
            query = query.filter(Data.SCM_pct >= min_scm_pct)
        if max_scm_pct is not None:
            query = query.filter(Data.SCM_pct <= max_scm_pct)
        if min_cm_mass is not None:
            query = query.filter(Data.CM_mass >= min_cm_mass)
        if max_cm_mass is not None:
            query = query.filter(Data.CM_mass <= max_cm_mass)

        filtered_data = query.all()

        # Calculate the 5th quantile threshold for GHG emissions
        ghg_emissions = sorted([data.mixture_co2e_total for data in filtered_data])
        fifth_quantile_index = max(0, int(len(ghg_emissions) * 0.05) - 1)  # Index for the 5th quantile
        fifth_quantile_threshold = ghg_emissions[fifth_quantile_index]

        # Filter products within the 5th quantile and find the one with the lowest GHG emission
        filtered_for_quantile = [data for data in filtered_data if data.mixture_co2e_total >= fifth_quantile_threshold]
        lowest_ghg_product = min(filtered_for_quantile, key=lambda x: x.mixture_co2e_total)

        full_data = Data.query.all()

        response = {
            'full_data': [data.as_dict() for data in full_data],
            'filtered_data': [data.as_dict() for data in filtered_data],
            'lowest_ghg_product': lowest_ghg_product.as_dict()
        }
        return jsonify(response)

    except KeyError as e:
        logger.error(f"KeyError in plot_data: {e}")
        return jsonify({'error': str(e)}), 400

    except Exception as e:
        logger.error(f"Error in plot_data: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500


@app.route('/boxplots', methods=['POST'])
def get_top10_box_plots():
    try:
        req_data = request.json
        # logger.info(f"Received top10boxplot request: {req_data}")

        if not req_data or 'design_PSI' not in req_data:
            logger.error("Invalid input: No JSON data received or missing 'design_PSI'")
            return jsonify({'error': 'Invalid input'}), 400

        design_PSI = req_data['design_PSI']

        min_strength = req_data.get('min_strength')
        max_strength = req_data.get('max_strength')
        min_scm_pct = req_data.get('min_scm_pct')
        max_scm_pct = req_data.get('max_scm_pct')
        min_cm_mass = req_data.get('min_cm_mass')
        max_cm_mass = req_data.get('max_cm_mass')

        query = Data.query.filter(Data.test_PSI.isnot(None))  # Add filter to exclude rows where test_PSI is NULL

        if min_strength is not None:
            query = query.filter(Data.design_PSI >= min_strength)
        if max_strength is not None:
            query = query.filter(Data.design_PSI <= max_strength)
        if min_scm_pct is not None:
            query = query.filter(Data.SCM_pct >= min_scm_pct)
        if max_scm_pct is not None:
            query = query.filter(Data.SCM_pct <= max_scm_pct)
        if min_cm_mass is not None:
            query = query.filter(Data.CM_mass >= min_cm_mass)
        if max_cm_mass is not None:
            query = query.filter(Data.CM_mass <= max_cm_mass)

        query = query.filter_by(design_PSI=design_PSI) \
                    #  .order_by(Data.mixture_co2e_total.asc()) \
                    #  .limit(10)

        filtered_data = query.all()

        # Extract SCM_pct values
        scm_pct_values = [data.SCM_pct for data in filtered_data]
        cm_mass_values = [data.CM_mass for data in filtered_data]
        # ghg_values = [data.mixture_co2e_total for data in filtered_data]
        test_psi_values = [data.test_PSI for data in filtered_data]

        response = {
            'design_PSI': design_PSI,
            'scm_pct_values': scm_pct_values,
            'cm_mass_values': cm_mass_values,
            # 'ghg_values': ghg_values,
            'test_psi_values': test_psi_values
        }

        return jsonify(response)

    except KeyError as e:
        logger.error(f"KeyError in get_top10_box_plots: {e}")
        return jsonify({'error': 'Invalid input parameters'}), 400

    except Exception as e:
        logger.error(f"Error in get_top10_box_plots: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500


@app.route('/filterDesignPSI', methods=['POST'])
def filter_designPSI_data():
    try:
        req_data = request.json
        # logger.info(f"Received filter request: {req_data}")

        if not req_data:
            logger.error("Invalid input: No JSON data received")
            return jsonify({'error': 'Invalid input'}), 400

        design_PSI = req_data['design_PSI']
        
        min_strength = req_data.get('min_strength')
        max_strength = req_data.get('max_strength')
        min_scm_pct = req_data.get('min_scm_pct')
        max_scm_pct = req_data.get('max_scm_pct')
        min_cm_mass = req_data.get('min_cm_mass')
        max_cm_mass = req_data.get('max_cm_mass')

        # query = Data.query
        query = Data.query.filter(Data.test_PSI.isnot(None))  # Add filter to exclude rows where test_PSI is NULL

        if min_strength is not None:
            query = query.filter(Data.design_PSI >= min_strength)
        if max_strength is not None:
            query = query.filter(Data.design_PSI <= max_strength)
        if min_scm_pct is not None:
            query = query.filter(Data.SCM_pct >= min_scm_pct)
        if max_scm_pct is not None:
            query = query.filter(Data.SCM_pct <= max_scm_pct)
        if min_cm_mass is not None:
            query = query.filter(Data.CM_mass >= min_cm_mass)
        if max_cm_mass is not None:
            query = query.filter(Data.CM_mass <= max_cm_mass)

        query = query.filter_by(design_PSI=design_PSI) \
                     .order_by(Data.mixture_co2e_total.asc()) \
                     .limit(10)
        
        filtered_data = query.all()

        response = {
            'column_order': ['design_PSI', 'SCM_pct', 'CM_mass (kg/cy)', 'mixture_co2e_total (kg CO2eq/cy)', 'test_PSI'],
            'data': [data.as_dict() for data in filtered_data]
        }
        return jsonify(response)

    except KeyError as e:
        logger.error(f"KeyError in filter_data: {e}")
        return jsonify({'error': 'Invalid input parameters'}), 400

    except Exception as e:
        logger.error(f"Error in filter_data: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500

@app.route('/get_state_specs', methods=['POST'])
def get_state_specs():
    data = request.get_json()
    state = data.get('state')

    if not state:
        return jsonify({'error': 'No state provided'}), 400

    row = spec_df[spec_df['States'] == state]

    if row.empty:
        return jsonify({'error': 'State not found'}), 404

    row = row.iloc[0]

    return jsonify({
        'min_cm_mass': row['Min CM mass (lbs/cy)'] if not pd.isna(row['Min CM mass (lbs/cy)']) else 0,
        'max_wb': row['Max w/b'] if not pd.isna(row['Max w/b']) else None,
        'max_fly_ash': row['Max fly ash'] if not pd.isna(row['Max fly ash']) else None,
        'max_slag': row['Max slag'] if not pd.isna(row['Max slag']) else None,
        'max_silica_fume': row['Max silica fume'] if not pd.isna(row['Max silica fume']) else None,
        'max_natural_pozzolan': row['Max pozzolan'] if not pd.isna(row['Max pozzolan']) else None,
        'max_all_scm': row['Max all SCM'] if not pd.isna(row['Max all SCM']) else None
    })


if __name__ == '__main__':
    app.run(port=3000, debug=True)  # Flask server will run on http://localhost:3000