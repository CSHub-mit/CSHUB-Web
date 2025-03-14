from app import app, db  # Import Flask app instance and SQLAlchemy db instance
from app import Data  # Import your SQLAlchemy model(s) here
import pandas as pd

def populate_data():
    # Read data from Excel file
    df = pd.read_excel('data.xlsx')

    # Handle NA values in 'test_PSI' column (example: replacing NA with None)
    # df['test_PSI'].fillna(None, inplace=True)

    # Iterate through data and add to database
    with app.app_context():
        db.create_all()

        for index, row in df.iterrows():
            data = Data(
                design_PSI=row['design_PSI'],
                SCM_pct=row['SCM_pct'],
                CM_mass=row['CM_mass'],
                mixture_co2e_total=row['mixture co2e total'],
                test_PSI=row['test_PSI'] if pd.notna(row['test_PSI']) else None  # Handle NA values appropriately
            )
            db.session.add(data)

        # Commit changes to the database
        db.session.commit()

if __name__ == '__main__':
    populate_data()

