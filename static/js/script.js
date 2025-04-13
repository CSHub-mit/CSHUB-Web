plot_toggle = 0; //To plot all the datapoints (grey) for just the first time
plot_design2_first=0; //To trigger plotting traces for design 2 (the first time)

/////////////////////////////----DESIGN 1---/////////////////////////////////////
unitMultiplier = 1; //For cm mass, to allow for unit conversions

///////////////////////Defines checkboxes///////////////////////////////////////
const strengthCheckbox = document.getElementById('strength-checkbox');
const scmCheckbox = document.getElementById('scm-checkbox');
const cmCheckbox = document.getElementById('cm-checkbox');

/////////////////////////////----DESIGN 2---/////////////////////////////////////
unitMultiplier_D2 = 1; //For cm mass, to allow for unit conversions (D2)

///////////////////////Defines checkboxes///////////////////////////////////////
const strengthCheckbox_D2 = document.getElementById('strength-checkbox-D2');
const scmCheckbox_D2 = document.getElementById('scm-checkbox-D2');
const cmCheckbox_D2 = document.getElementById('cm-checkbox-D2');

//////////////////////////////----------------DESIGN 1-----------------------////////////////////////////
///////When the status of the checkboxes change, toggle slider (usable vs unusable) + filter data//////////
strengthCheckbox.addEventListener('change', function () {
    toggleStrengthSlider();
    filterData();
});
scmCheckbox.addEventListener('change', function () {
    toggleScmSlider();
    filterData();
});
cmCheckbox.addEventListener('change', function () {
    toggleCmSlider();
    filterData();
});

//////////////////////////////----------------DESIGN 2-----------------------////////////////////////////
///////When the status of the checkboxes change, toggle slider (usable vs unusable) + filter data//////////
strengthCheckbox_D2.addEventListener('change', function () {
    toggleStrengthSlider_D2();
    filterData_D2();
});
scmCheckbox_D2.addEventListener('change', function () {
    toggleScmSlider_D2();
    filterData_D2();
});
cmCheckbox_D2.addEventListener('change', function () {
    toggleCmSlider_D2();
    filterData_D2();
});

////////////Construct requests to API endpoints (min/max values to filter for); without design psi///////
//////////////////////--------------------DESIGN 1----------------------////////////////////////////
// function createRequestBody() {
//     /**
//      * This function creates a request body for Design 1 to be sent to various endpoints later on.
//      * The information included in this request body includes the minimum and maximum values on each
//      * dual ended slider related to D1 and does not include design psi.
//      * If the respective sliders' checkbox is unchecked, the min and max is instead set as null.
//      */
//     let minStrength, maxStrength;
//     if (strengthCheckbox.checked) {
//         minStrength = parseFloat(slider.noUiSlider.get()[0]); //reads the value of corresponding slider
//         maxStrength = parseFloat(slider.noUiSlider.get()[1]);
//     } else {
//         minStrength = null;
//         maxStrength = null;
//     }

//     let minScmPct, maxScmPct;
//     if (scmCheckbox.checked) {
//         minScmPct = parseFloat(scm_slider.noUiSlider.get()[0]);
//         maxScmPct = parseFloat(scm_slider.noUiSlider.get()[1]);
//     } else {
//         minScmPct = null;
//         maxScmPct = null;
//     }

//     let minCmMass, maxCmMass;
//     if (cmCheckbox.checked) {
//         minCmMass = parseFloat(cm_slider.noUiSlider.get()[0] * unitMultiplier);
//         maxCmMass = parseFloat(cm_slider.noUiSlider.get()[1] * unitMultiplier);
//     } else {
//         minCmMass = null;
//         maxCmMass = null;
//     }

//     return {
//         min_strength: minStrength,
//         max_strength: maxStrength,
//         min_scm_pct: minScmPct,
//         max_scm_pct: maxScmPct,
//         min_cm_mass: minCmMass,
//         max_cm_mass: maxCmMass
//     };
// }
function createRequestBody() {
    /**
     * This function creates a request body for Design 1 to be sent to various endpoints later on.
     * It includes min and max values for the sliders, converting CM mass to kg/cy if necessary.
     */
    let minStrength, maxStrength;
    if (strengthCheckbox.checked) {
        minStrength = parseFloat(slider.noUiSlider.get()[0]);
        maxStrength = parseFloat(slider.noUiSlider.get()[1]);
    } else {
        minStrength = null;
        maxStrength = null;
    }

    let minScmPct, maxScmPct;
    if (scmCheckbox.checked) {
        minScmPct = parseFloat(scm_slider.noUiSlider.get()[0]);
        maxScmPct = parseFloat(scm_slider.noUiSlider.get()[1]);
    } else {
        minScmPct = null;
        maxScmPct = null;
    }

    let minCmMass, maxCmMass;
    if (cmCheckbox.checked) {
        // 🔁 Get the current unit directly from the dropdown
        const selectedUnit = document.getElementById('CM-mass-units').value;
        const conversionFactor = parseFloat(selectedUnit);  // e.g., 1 for kg, 0.453592 for lbs

        minCmMass = parseFloat(cm_slider.noUiSlider.get()[0]) * conversionFactor;
        maxCmMass = parseFloat(cm_slider.noUiSlider.get()[1]) * conversionFactor;
    } else {
        minCmMass = null;
        maxCmMass = null;
    }

    return {
        min_strength: minStrength,
        max_strength: maxStrength,
        min_scm_pct: minScmPct,
        max_scm_pct: maxScmPct,
        min_cm_mass: minCmMass,
        max_cm_mass: maxCmMass
    };
}


//////////////////////--------------------DESIGN 2----------------------////////////////////////////
function createRequestBody_D2() {
    /**
     * Creates request body for Design 2 (without design psi) using Design 2's sliders
     */
    let minStrength_D2, maxStrength_D2;
    if (strengthCheckbox_D2.checked) {
        minStrength_D2 = parseFloat(slider_D2.noUiSlider.get()[0]);
        maxStrength_D2 = parseFloat(slider_D2.noUiSlider.get()[1]);
    } else {
        minStrength_D2 = null;
        maxStrength_D2 = null;
    }

    let minScmPct_D2, maxScmPct_D2;
    if (scmCheckbox_D2.checked) {
        minScmPct_D2 = parseFloat(scm_slider_D2.noUiSlider.get()[0]);
        maxScmPct_D2 = parseFloat(scm_slider_D2.noUiSlider.get()[1]);
    } else {
        minScmPct_D2 = null;
        maxScmPct_D2 = null;
    }

    let minCmMass_D2, maxCmMass_D2;
    if (cmCheckbox_D2.checked) {
        minCmMass_D2 = parseFloat(cm_slider_D2.noUiSlider.get()[0] * unitMultiplier_D2);
        maxCmMass_D2 = parseFloat(cm_slider_D2.noUiSlider.get()[1] * unitMultiplier_D2);
    } else {
        minCmMass_D2 = null;
        maxCmMass_D2 = null;
    }

    return {
        min_strength: minStrength_D2,
        max_strength: maxStrength_D2,
        min_scm_pct: minScmPct_D2,
        max_scm_pct: maxScmPct_D2,
        min_cm_mass: minCmMass_D2,
        max_cm_mass: maxCmMass_D2
    };
}

///////////////////////////////////LOADING BARS//////////////////////////////////////////////
/////////////////////--------------------DESIGN 1--------------------/////////////////////////////
function showLoadingBar() { //For filtering
    document.getElementById('loading-bar').style.display = 'block';
    document.getElementById('loading-bar-percentage').style.display = 'block';
    const progressBar = document.getElementById('loading-bar-progress');
    const percentageText = document.getElementById('loading-bar-percentage');
    let width = 0;
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            hideLoadingBar(); // Hide after 100%
        } else {
            width++;
            progressBar.style.width = width + '%';
            percentageText.textContent = width + '%';
        }
    }, 30); // Update every 30ms
}

function hideLoadingBar() {
    document.getElementById('loading-bar').style.display = 'none';
    document.getElementById('loading-bar-percentage').style.display = 'none';
}

function showLoadingBar2() { //For plotting
    document.getElementById('loading-bar2').style.display = 'block';
    document.getElementById('loading-bar-percentage2').style.display = 'block';
    const progressBar = document.getElementById('loading-bar-progress2');
    const percentageText = document.getElementById('loading-bar-percentage2');
    let width = 0;
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);

        } else {
            width++;
            progressBar.style.width = width + '%';
            percentageText.textContent = width + '%';
        }
    }, 30); // Update every 30ms
}

function hideLoadingBar2() {
    document.getElementById('loading-bar2').style.display = 'none';
    document.getElementById('loading-bar-percentage2').style.display = 'none';
}

/////////////////////--------------------DESIGN 2--------------------/////////////////////////////
function showLoadingBar_D2() { //For filtering
    document.getElementById('loading-bar-D2').style.display = 'block';
    document.getElementById('loading-bar-percentage-D2').style.display = 'block';
    // statusText.textContent = '1. Analyzing data...';
    const progressBar = document.getElementById('loading-bar-progress-D2');
    const percentageText = document.getElementById('loading-bar-percentage-D2');
    let width = 0;
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            hideLoadingBar(); // Hide after 100%
        } else {
            width++;
            progressBar.style.width = width + '%';
            percentageText.textContent = width + '%';
        }
    }, 30); // Update every 30ms
}

function hideLoadingBar_D2() {
    document.getElementById('loading-bar-D2').style.display = 'none';
    document.getElementById('loading-bar-percentage-D2').style.display = 'none';
}

function showLoadingBar2_D2() { //For plotting
    document.getElementById('loading-bar2-D2').style.display = 'block';
    document.getElementById('loading-bar-percentage2-D2').style.display = 'block';
    const progressBar = document.getElementById('loading-bar-progress2-D2');
    const percentageText = document.getElementById('loading-bar-percentage2-D2');
    let width = 0;
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);

        } else {
            width++;
            progressBar.style.width = width + '%';
            percentageText.textContent = width + '%';
        }
    }, 30); // Update every 30ms
}

function hideLoadingBar2_D2() {
    document.getElementById('loading-bar2-D2').style.display = 'none';
    document.getElementById('loading-bar-percentage2-D2').style.display = 'none';
}

////////////////////////////////FILTERING DATA TO PLOT/////////////////////////////////////////
/////////////////////----------------DESIGN 1---------------------/////////////////////////
function filterData() {
    /**
     * Filters data based on D1's request body (min and max of the sliders) and then triggers functions to:
     * 1) update D1's tables
     * 2) plot scatterplot for D1
     * 3) construct the 3 box plots
     * 4) filter for D2 if this is the first time the function is running (website just loaded)
     */
    showLoadingBar();

    const requestBody=createRequestBody();

    console.log('Sending filter request:', requestBody);

    fetch('/filter', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    })
    .then(response => response.json())
    .then(response => {
        hideLoadingBar();
        if (response.error) {
            console.error('Error:', response.error);
            alert('Error: ' + response.error);
        } else {
            window.data = response.data;
            window.columnOrder = response.column_order;
            if (window.data.length === 0) {
                document.getElementById('no-results-message').style.display = 'block';
                removeTracesByName(['Filtered Products D1', '5th quantile GHG Prod D1']);
                document.getElementById('no-results-message-table1').style.display = 'block';
                document.getElementById('top-results').style.display = 'none';
                GHGremoveTracesByName('D1');

            } else {
                document.getElementById('no-results-message').style.display = 'none';
                document.getElementById('plotDiv').style.display = 'block';
                document.getElementById('ghg-box-plot').style.display = 'block';
                
                updateTable();
                plotData();
                constructBoxPlot();
                plotGHGBoxPlot();
                if (plot_design2_first==0){ //first time filtering + plotting D2
                    setTimeout(function(){
                        filterData_D2();
                   },1000); //delay is in milliseconds 
                    plot_design2_first=1; //toggle off
                }
            }
        }
    })
    .catch(error => {
        console.error('Error fetching filtered data:', error);
        hideLoadingBar();
    });
}

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

const debouncedFilterData = debounce(filterData, 3000);

/////////////////////----------------DESIGN 2---------------------/////////////////////////
function filterData_D2() {
    /**
     * Filtering for Design 2 and triggers functions to 
     * 1) update D2's table
     * 2) construct/update the 3 box plots
     * 3) update the scatterplot for D2
     * 4) plot overall GHG box plots for D1 and D2
     */
    showLoadingBar_D2();

    const requestBody=createRequestBody_D2();

    console.log('Sending filter request:', requestBody);

    fetch('/filter', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    })
    .then(response => response.json())
    .then(response => {
        hideLoadingBar_D2();
        if (response.error) {
            console.error('Error:', response.error);
            alert('Error: ' + response.error);
        } else {
            window.data = response.data;
            window.columnOrder = response.column_order;
            if (window.data.length === 0) {
                document.getElementById('no-results-message').style.display = 'block';
                removeTracesByName(['Filtered Products D2', '5th quantile GHG Prod D2'])
                document.getElementById('no-results-message-table2').style.display = 'block';
                document.getElementById('top-results-D2').style.display = 'none';
                GHGremoveTracesByName('D2');
            } else {
                document.getElementById('no-results-message').style.display = 'none';
                document.getElementById('plotDiv').style.display = 'block';
                document.getElementById('ghg-box-plot').style.display = 'block';
                updateTable_D2();
                constructBoxPlot();
                plotData_D2();
                plotGHGBoxPlot();
            }
        }
    })
    .catch(error => {
        console.error('Error fetching filtered data:', error);
        hideLoadingBar_D2();
    });
}

const debouncedFilterData_D2 = debounce(filterData_D2, 3000);

//////////////////////////////////////////////////////////////////////////////////////
const layout = {
    xaxis: {
        title: {
            text: 'test_PSI',
            font: {
                family: 'Arial, sans-serif',
                size: 18
            }
        },
        tickfont: {
            family: 'Arial, sans-serif',
            size: 14
        }
    },
    yaxis: {
        title: {
            text: 'mixture_co2e_total (kg CO2eq/cy)',
            font: {
                family: 'Arial, sans-serif',
                size: 18
            }
        },
        tickfont: {
            family: 'Arial, sans-serif',
            size: 14
        }
    },
    showlegend: true,
    margin: {
        l: 80, 
        r: 10,
        t: 20, 
        b: 80  
    }
};

function removeTracesByName(traceNames) { //removes traces on the scatter plot by name
    // Get the current data from the plot
    Plotly.d3.select('#plotDiv').each(function() {
        const plot = this;
        const currentData = plot.data;

        // Filter out traces that match any of the names to be removed
        const updatedData = currentData.filter(trace => !traceNames.includes(trace.name));

        // Update the plot with the remaining traces
        Plotly.react('plotDiv', updatedData, layout);
    });
}

function GHGremoveTracesByName(traceNames) { //remove ghg box plot traces by name
    // Get the current data from the plot
    Plotly.d3.select('#ghg-box-plot').each(function() {
        const plot = this;
        const currentData = plot.data;

        // Filter out traces that match any of the names to be removed
        const updatedData = currentData.filter(trace => !traceNames.includes(trace.name));

        // Define the layout again with boxmode and spacing
        const layout = {
            yaxis: { title: 'GHG Emissions (kg CO2eq/cy)' },
            boxmode: 'group',      // Maintain the box grouping
            boxgap: 0.5,           // Ensure consistent gap between boxes
            boxgroupgap: 0.5       // Ensure consistent gap between groups of boxes
        };

        // Update the plot with the remaining traces and layout
        Plotly.react('ghg-box-plot', updatedData, layout);
        applyDarkModeIfNeeded('ghg-box-plot');
    });
}


///////////////////////CREATING SCATTER PLOT BASED ON FILTERED POINTS//////////////////////////
//////////////////////------------------DESIGN 1--------------------/////////////////////////
function plotData() {
    /**
     * Plots the filtered D1 data 
     * a) If this is the first time plotting (dictated by the toggle), CREATE a Plotly plot and 
     * plot all three traces including the full data points (in grey)
     * b) Else, as toggle is now off, "UPDATE" plot only trace 2 (filtered pts) and trace 3 
     * (lowest 5th quantile GHG pt) by 1) removing the old trace 2 and trace 3, 
     *                                 2) adding the new trace 2 and trace 3 from the filtered data
     */

    showLoadingBar2();

    const requestBody=createRequestBody();

    fetch('/plot', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    })
    .then(response => response.json())
    .then(data => {
        hideLoadingBar2();
        
        if (plot_toggle==0){
            const fullData = data.full_data;
            const filteredData = data.filtered_data;

            const lowestGhgProduct = data.lowest_ghg_product;

            const fullDataX = fullData.map(item => item['test_PSI']);
            const fullDataY = fullData.map(item => item['mixture_co2e_total (kg CO2eq/cy)']);

            const filteredDataX = filteredData.map(item => item['test_PSI']);
            const filteredDataY = filteredData.map(item => item['mixture_co2e_total (kg CO2eq/cy)']);

            const lowestGhgX = [lowestGhgProduct['test_PSI']];
            const lowestGhgY = [lowestGhgProduct['mixture_co2e_total (kg CO2eq/cy)']];

            const trace1 = {
                x: fullDataX,
                y: fullDataY,
                mode: 'markers',
                type: 'scatter',
                name: 'All Products',
                marker: { size: 8, color: '#A0AEC0', opacity: 0.1 },
                hoverinfo: 'none'
            };

            const trace2 = {
                x: filteredDataX,
                y: filteredDataY,
                mode: 'markers',
                type: 'scatter',
                name: 'Filtered Products D1',
                marker: { size: 8, color: 'blue', opacity: 0.1 },
                hoverinfo: 'none'
            };

            const trace3 = {
                x: lowestGhgX,
                y: lowestGhgY,
                mode: 'markers',
                type: 'scatter',
                name: '5th quantile GHG Prod D1',
                marker: { size: 12, color: 'blue', symbol:'star' }
            };

            const dataToPlot = [trace1, trace2, trace3];

            Plotly.newPlot('plotDiv', dataToPlot, layout, {responsive: true});
            plot_toggle=1; //toggle off
        } else{

            const filteredData = data.filtered_data;

        const lowestGhgProduct = data.lowest_ghg_product;

        const filteredDataX = filteredData.map(item => item['test_PSI']);
        const filteredDataY = filteredData.map(item => item['mixture_co2e_total (kg CO2eq/cy)']);

        const lowestGhgX = [lowestGhgProduct['test_PSI']];
        const lowestGhgY = [lowestGhgProduct['mixture_co2e_total (kg CO2eq/cy)']];

        const trace2 = {
            x: filteredDataX,
            y: filteredDataY,
            mode: 'markers',
            type: 'scatter',
            name: 'Filtered Products D1',
            marker: { size: 8, color: 'blue', opacity: 0.1 },
            hoverinfo: 'none'
        };

        const trace3 = {
            x: lowestGhgX,
            y: lowestGhgY,
            mode: 'markers',
            type: 'scatter',
            name: '5th quantile GHG Prod D1',
            marker: { size: 12, color: 'blue', symbol:'star' }
        };

        const dataToPlot = [trace2, trace3];
        
        removeTracesByName(['Filtered Products D1', '5th quantile GHG Prod D1']);
        Plotly.addTraces('plotDiv', dataToPlot);
    }
    })
    .catch(error => {
        console.error('Error fetching plot data:', error);
        hideLoadingBar2();
    });
}

//////////////////////------------------DESIGN 2--------------------/////////////////////////
function plotData_D2() {
    /**
     * "UPDATES" the scatter plot by removing traces 2 and 3 for D2 and then adding the new traces 
     * from the filtered data
     */
    showLoadingBar2_D2();

    const requestBody_D2=createRequestBody_D2();

    fetch('/plot', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody_D2),
    })
    .then(response => response.json())
    .then(data => {
        hideLoadingBar2_D2();

        const filteredData = data.filtered_data;

        const lowestGhgProduct = data.lowest_ghg_product;

        const filteredDataX_D2 = filteredData.map(item => item['test_PSI']);
        const filteredDataY_D2 = filteredData.map(item => item['mixture_co2e_total (kg CO2eq/cy)']);

        const lowestGhgX_D2 = [lowestGhgProduct['test_PSI']];
        const lowestGhgY_D2 = [lowestGhgProduct['mixture_co2e_total (kg CO2eq/cy)']];

        const trace2_D2 = {
            x: filteredDataX_D2,
            y: filteredDataY_D2,
            mode: 'markers',
            type: 'scatter',
            name: 'Filtered Products D2',
            marker: { size: 8, color: 'red', opacity: 0.1 },  
            // made changes here 
            hoverinfo: 'none'
        };

        const trace3_D2 = {
            x: lowestGhgX_D2,
            y: lowestGhgY_D2,
            mode: 'markers',
            type: 'scatter',
            name: '5th quantile GHG Prod D2',
            marker: { size: 12, color: 'red', symbol: 'star' }
            // made changes 
        };

        const dataToPlot_D2 = [trace2_D2, trace3_D2];
        removeTracesByName(['Filtered Products D2', '5th quantile GHG Prod D2']);
        Plotly.addTraces('plotDiv', dataToPlot_D2);
    })
    .catch(error => {
        console.error('Error fetching plot data:', error);
        hideLoadingBar2_D2();
    });
}

///////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////SLIDERS AND INPUT BOXES, Trigger Filtering/////////////////////////
////////////////---------------------DESIGN 1----------------------////////////////////////
// Initialize the SCM_pct slider
var scm_slider = document.getElementById('scm-container');

noUiSlider.create(scm_slider, {
    connect: true,
    start: [0, 0.3],
    range: {
        'min': 0,
        'max': 1
    },
    pips: {
        mode: 'positions',
        values: [0, 30],
        density: 100,
        format: {
            to: function (value) {
                return value === 0 ? '0' : '0.3';
            }
        }
    },
    step: 0.01,
    tooltips: false,
    format: {
        to: function (value) {
            return Number(value);
        },
        from: function (value) {
            return Number(value);
        }
    }
});

var scm_inputMin = document.getElementById('min-scm-pct');
var scm_inputMax = document.getElementById('max-scm-pct');

// Update the span (min and max boxes) elements with the slider values
scm_slider.noUiSlider.on('update', function (values, handle) {
    var value = values[handle];
    if (handle) {
        scm_inputMax.value = value;
    } else {
        scm_inputMin.value = value;
    }
});

scm_inputMin.addEventListener('change', function () { //if input min box changed, adjusts slider and filter
    scm_slider.noUiSlider.set([this.value, null]);
    debouncedFilterData();
});

scm_inputMax.addEventListener('change', function () { //if input max box changed, adjusts slider and filter
    scm_slider.noUiSlider.set([null, this.value]);
    debouncedFilterData();
});

scm_slider.noUiSlider.on('change', function () { //if slider changed, filter
    debouncedFilterData();
});

// Initialize the STRENGTH slider
var slider = document.getElementById('strength-container');

noUiSlider.create(slider, {
    start: [0, 10000],
    connect: true,
    start: [4000, 4000],
    range: {
        'min': 0,
        'max': 10000
    },
    pips: {
        mode: 'values',
        values: [4000],
    },
    step: 1000,
    tooltips: false,
    format: {
        to: function (value) {
            return Number(value);
        },
        from: function (value) {
            return Number(value);
        }
    }
});

var inputMin = document.getElementById('min-strength');
var inputMax = document.getElementById('max-strength');

// Update the span elements with the slider values
slider.noUiSlider.on('update', function (values, handle) {
    var value = values[handle];
    if (handle) {
        inputMax.value = value;
    } else {
        inputMin.value = value;
    }
});

inputMin.addEventListener('change', function () { //if input min box changed, adjusts slider and filter
    slider.noUiSlider.set([this.value, null]);
    debouncedFilterData();
});

inputMax.addEventListener('change', function () { //if input max box changed, adjusts slider and filter
    slider.noUiSlider.set([null, this.value]);
    debouncedFilterData();
});

slider.noUiSlider.on('change', function () { //if slider changed, filter
    debouncedFilterData();
});


// Initialize the CM mass slider
var cm_slider = document.getElementById('cm-container');
const unitSelect = document.getElementById('CM-mass-units');
// const rangeDisplay = document.getElementById('range-display');

//For default units:
const initialMin = 100;
const initialMax = 600;
const initMinStart = 300;

//creates the slider with default units
noUiSlider.create(cm_slider, {
    start: [initMinStart, initialMax],
    connect: true,
    range: {
        'min': initialMin,
        'max': initialMax,
    },
    pips: {
        mode: 'values',
        values: [initMinStart],
    },
    step: 0.01,
    tooltips: false,
    format: {
        to: function (value) {
            return Math.round((value)*100)/100;
        },
        from: function (value) {
            return Math.round((value)*100)/100;
        }
    }
});

unitSelect.addEventListener('change', function () { //Once the selected unit from the dropdown menu changes:
    //The value attached to the selected option is the conversion factor
    unitMultiplier = parseFloat(this.value);
    //The below operations performs the unit conversion and rounds to 2 decimal places:
    const newMin = Math.round((initialMin / unitMultiplier)*100)/100; 
    const newMax = Math.round((initialMax / unitMultiplier)*100)/100;
    const newInitMinStart = Math.round((initMinStart / unitMultiplier)*100)/100;

    //update the slider with new values based on the selected unit
    cm_slider.noUiSlider.updateOptions({
        range: {
            'min': newMin,
            'max': newMax
        },
        start: [newInitMinStart, newMax],
        pips: {
            mode: 'values',
            values: [newInitMinStart],
        },
        step: 0.01,
        tooltips: false,
        format: {
            to: function (value) {
                return Math.round((value)*100)/100;
            },
            from: function (value) {
                return Math.round((value)*100)/100;
            }
        }
    });
});

var cm_inputMin = document.getElementById('min-cm-mass');
var cm_inputMax = document.getElementById('max-cm-mass');

//Once slider changes, update the min and max input box values
cm_slider.noUiSlider.on('update', function (values, handle) {
    var value = Math.round((values[handle])*100)/100;
    if (handle) {
        cm_inputMax.value = value;
    } else {
        cm_inputMin.value = value;
    }
});

cm_inputMin.addEventListener('change', function () { //if input min box changed, adjusts slider and filter
    cm_slider.noUiSlider.set([this.value, null]);
    debouncedFilterData();
});

cm_inputMax.addEventListener('change', function () { //if input max box changed, adjusts slider and filter
    cm_slider.noUiSlider.set([null, this.value]);
    debouncedFilterData();
});

cm_slider.noUiSlider.on('change', function () { //if slider changed, filter
    debouncedFilterData();
});

///////////////////////////////////////////////////////////////////////////////////////////////

////////////////---------------------DESIGN 2----------------------////////////////////////
// Initialize the SCM_pct slider
var scm_slider_D2 = document.getElementById('scm-container-D2');

noUiSlider.create(scm_slider_D2, {
    connect: true,
    start: [0, 0.3],
    range: {
        'min': 0,
        'max': 1
    },
    pips: {
        mode: 'positions',
        values: [0, 30],
        density: 100,
        format: {
            to: function (value) {
                return value === 0 ? '0' : '0.3';
            }
        }
    },
    step: 0.01,
    tooltips: false,
    format: {
        to: function (value) {
            return Number(value);
        },
        from: function (value) {
            return Number(value);
        }
    }
});

var scm_inputMin_D2 = document.getElementById('min-scm-pct-D2');
var scm_inputMax_D2 = document.getElementById('max-scm-pct-D2');

// Update the span elements with the slider values
scm_slider_D2.noUiSlider.on('update', function (values, handle) {
    var value = values[handle];
    if (handle) {
        scm_inputMax_D2.value = value;
    } else {
        scm_inputMin_D2.value = value;
    }
});

scm_inputMin_D2.addEventListener('change', function () { //if input min box changed, adjusts slider and filter
    scm_slider_D2.noUiSlider.set([this.value, null]);
    debouncedFilterData_D2(); 
});

scm_inputMax_D2.addEventListener('change', function () { //if input max box changed, adjusts slider and filter
    scm_slider_D2.noUiSlider.set([null, this.value]);
    debouncedFilterData_D2();
});

scm_slider_D2.noUiSlider.on('change', function () { //if slider changed, filter
    debouncedFilterData_D2();
});

// Initialize the STRENGTH slider
var slider_D2 = document.getElementById('strength-container-D2');

noUiSlider.create(slider_D2, {
    start: [0, 10000],
    connect: true,
    start: [4000, 4000],
    range: {
        'min': 0,
        'max': 10000
    },
    pips: {
        mode: 'values',
        values: [4000],
    },
    step: 1000,
    tooltips: false,
    format: {
        to: function (value) {
            return Number(value);
        },
        from: function (value) {
            return Number(value);
        }
    }
});

var inputMin_D2 = document.getElementById('min-strength-D2');
var inputMax_D2 = document.getElementById('max-strength-D2');

// Update the span elements with the slider values
slider_D2.noUiSlider.on('update', function (values, handle) {
    var value = values[handle];
    if (handle) {
        inputMax_D2.value = value;
    } else {
        inputMin_D2.value = value;
    }
});

inputMin_D2.addEventListener('change', function () { //if input min box changed, adjusts slider and filter
    slider_D2.noUiSlider.set([this.value, null]);
    debouncedFilterData_D2();
});

inputMax_D2.addEventListener('change', function () { //if input max box changed, adjusts slider and filter
    slider_D2.noUiSlider.set([null, this.value]);
    debouncedFilterData_D2();
});

slider_D2.noUiSlider.on('change', function () { //if slider changed, filter
    debouncedFilterData_D2();
});


// Initialize the CM mass slider
var cm_slider_D2 = document.getElementById('cm-container-D2');
const unitSelect_D2 = document.getElementById('CM-mass-units-D2');
// const rangeDisplay = document.getElementById('range-display');

//For default units:
const initialMin_D2 = 100;
const initialMax_D2 = 600;
const initMinStart_D2 = 300;

//slider created with initial unit
noUiSlider.create(cm_slider_D2, {
    start: [initMinStart_D2, initialMax_D2],
    connect: true,
    range: {
        'min': initialMin_D2,
        'max': initialMax_D2,
    },
    pips: {
        mode: 'values',
        values: [initMinStart_D2],
    },
    step: 0.01,
    tooltips: false,
    format: {
        to: function (value) {
            return Math.round((value)*100)/100;
        },
        from: function (value) {
            return Math.round((value)*100)/100;
        }
    }
});

unitSelect_D2.addEventListener('change', function () { //Once the selected unit from the dropdown menu changes:
    unitMultiplier_D2 = parseFloat(this.value);
    //unit conversion
    const newMin = Math.round((initialMin_D2 / unitMultiplier_D2)*100)/100;
    const newMax = Math.round((initialMax_D2 / unitMultiplier_D2)*100)/100;
    const newInitMinStart = Math.round((initMinStart_D2 / unitMultiplier_D2)*100)/100;

    //updates slider with values based on chosen unit
    cm_slider_D2.noUiSlider.updateOptions({
        range: {
            'min': newMin,
            'max': newMax
        },
        start: [newInitMinStart, newMax],
        pips: {
            mode: 'values',
            values: [newInitMinStart],
        },
        step: 0.01,
        tooltips: false,
        format: {
            to: function (value) {
                return Math.round((value)*100)/100;
            },
            from: function (value) {
                return Math.round((value)*100)/100;
            }
        }
    });
});

var cm_inputMin_D2 = document.getElementById('min-cm-mass-D2');
var cm_inputMax_D2 = document.getElementById('max-cm-mass-D2');

cm_slider_D2.noUiSlider.on('update', function (values, handle) { //updates min/max input boxes with slider values
    var value = Math.round((values[handle])*100)/100;
    if (handle) {
        cm_inputMax_D2.value = value;
    } else {
        cm_inputMin_D2.value = value;
    }
});

cm_inputMin_D2.addEventListener('change', function () { //if input min box changed, adjusts slider and filter
    cm_slider_D2.noUiSlider.set([this.value, null]);
    debouncedFilterData_D2();
});

cm_inputMax_D2.addEventListener('change', function () { //if input max box changed, adjusts slider and filter
    cm_slider_D2.noUiSlider.set([null, this.value]);
    debouncedFilterData_D2();
});

cm_slider_D2.noUiSlider.on('change', function () { //if slider changed, filter
    debouncedFilterData_D2();
});


///////////////////////////////////////////BOX PLOTS/////////////////////////////////////////////////

////////////////----------------------DESIGN 1-------------------------/////////////////////////////
async function boxPlotFiltering(designPsiValue) { 
    //Returns design psi specific values for scm pct, cm mass, and test psi

    let minStrength, maxStrength;
    if (strengthCheckbox.checked) {
        minStrength = parseFloat(slider.noUiSlider.get()[0]);
        maxStrength = parseFloat(slider.noUiSlider.get()[1]);
    } else {
        minStrength = null;
        maxStrength = null;
    }
    let minScmPct, maxScmPct;
    if (scmCheckbox.checked) {
        minScmPct = parseFloat(scm_slider.noUiSlider.get()[0]);
        maxScmPct = parseFloat(scm_slider.noUiSlider.get()[1]);
    } else {
        minScmPct = null;
        maxScmPct = null;
    }
    let minCmMass, maxCmMass;
    if (cmCheckbox.checked) {
        minCmMass = parseFloat(cm_slider.noUiSlider.get()[0] * unitMultiplier);
        maxCmMass = parseFloat(cm_slider.noUiSlider.get()[1] * unitMultiplier);
    } else {
        minCmMass = null;
        maxCmMass = null;
    }

    const requestBody = {
        min_strength: minStrength,
        max_strength: maxStrength,
        min_scm_pct: minScmPct,
        max_scm_pct: maxScmPct,
        min_cm_mass: minCmMass,
        max_cm_mass: maxCmMass,
        design_PSI: designPsiValue,
    };
    try {
        const response = await fetch('/boxplots', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // body: JSON.stringify({ design_PSI: designPsiValue })
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();

        if (data.error) {
            document.getElementById('results').innerText = `Error: ${data.error}`;
            return [[], [], [], []]; // Return empty arrays in case of error
        } else {
            const scmPctValues = data.scm_pct_values;
            const cmMassValues = data.cm_mass_values;
            const testPsiValues = data.test_psi_values;
            return [designPsiValue, scmPctValues, cmMassValues, testPsiValues];
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('results').innerText = `Error: ${error}`;
        return [[], [], [], []]; // Return empty arrays in case of error
    }
}

////////////////----------------------DESIGN 2-------------------------/////////////////////////////
async function boxPlotFiltering_D2(designPsiValue) { 
    //Returns design psi specific values for scm pct, cm mass, and test psi

    let minStrength_D2, maxStrength_D2;
    if (strengthCheckbox_D2.checked) {
        minStrength_D2 = parseFloat(slider_D2.noUiSlider.get()[0]);
        maxStrength_D2 = parseFloat(slider_D2.noUiSlider.get()[1]);
    } else {
        minStrength_D2 = null;
        maxStrength_D2 = null;
    }
    let minScmPct_D2, maxScmPct_D2;
    if (scmCheckbox_D2.checked) {
        minScmPct_D2 = parseFloat(scm_slider_D2.noUiSlider.get()[0]);
        maxScmPct_D2 = parseFloat(scm_slider_D2.noUiSlider.get()[1]);
    } else {
        minScmPct_D2 = null;
        maxScmPct_D2 = null;
    }
    let minCmMass_D2, maxCmMass_D2;
    if (cmCheckbox_D2.checked) {
        minCmMass_D2 = parseFloat(cm_slider_D2.noUiSlider.get()[0] * unitMultiplier_D2);
        maxCmMass_D2 = parseFloat(cm_slider_D2.noUiSlider.get()[1] * unitMultiplier_D2);
    } else {
        minCmMass_D2 = null;
        maxCmMass_D2 = null;
    }

    const requestBody = {
        min_strength: minStrength_D2,
        max_strength: maxStrength_D2,
        min_scm_pct: minScmPct_D2,
        max_scm_pct: maxScmPct_D2,
        min_cm_mass: minCmMass_D2,
        max_cm_mass: maxCmMass_D2,
        design_PSI: designPsiValue,
    };
    try {
        const response = await fetch('/boxplots', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // body: JSON.stringify({ design_PSI: designPsiValue })
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();

        if (data.error) {
            document.getElementById('results').innerText = `Error: ${data.error}`;
            return [[], [], [], []]; // Return empty arrays in case of error
        } else {
            const scmPctValues = data.scm_pct_values;
            const cmMassValues = data.cm_mass_values;
            const testPsiValues = data.test_psi_values;
            return [designPsiValue, scmPctValues, cmMassValues, testPsiValues];
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('results').innerText = `Error: ${error}`;
        return [[], [], [], []]; // Return empty arrays in case of error
    }
}

function boxPlot(allDesignPsiList1, SCM_pctData1, CM_massData1, test_PSIData1, allDesignPsiList2, SCM_pctData2, CM_massData2, test_PSIData2) {
    /**
     * Input variables: data for both D1 and D2's scm, cm, and testpsi.
     * Actually creates the box plot graphs.
     * Populates them with design 1's box plots in blue and design 
     * 2's box plots in orange
     */
    // Plot IDs
    const plotIDs = ['box-plot', 'box-plot1', 'box-plot3'];

    const [scmBoxPlot, cmBoxPlot, testpsiBoxPlot] = plotIDs;

    // Data mappings for both designs
    const dataMappings = [
        {
            id: scmBoxPlot,
            data1: SCM_pctData1,
            data2: SCM_pctData2,
            title: 'SCM_pct',
            allDesignPsiList1: allDesignPsiList1,
            allDesignPsiList2: allDesignPsiList2
        },
        {
            id: cmBoxPlot,
            data1: CM_massData1,
            data2: CM_massData2,
            title: 'CM_mass',
            allDesignPsiList1: allDesignPsiList1,
            allDesignPsiList2: allDesignPsiList2
        },
        {
            id: testpsiBoxPlot,
            data1: test_PSIData1,
            data2: test_PSIData2,
            title: 'Test psi',
            allDesignPsiList1: allDesignPsiList1,
            allDesignPsiList2: allDesignPsiList2
        }
    ];

    // Function to generate plot data
    const generatePlotData = (data1, data2, allDesignPsiList1, allDesignPsiList2) => {
        const plotData1 = allDesignPsiList1.map(designPsi => ({
            y: data1[designPsi],
            type: 'box',
            name: `D1: ${designPsi}`,
            showlegend: false,
            marker: { color: 'blue' } // Custom color for Design 1
        }));

        const plotData2 = allDesignPsiList2.map(designPsi => ({
            y: data2[designPsi],
            type: 'box',
            name: `D2: ${designPsi}`,
            showlegend: false,
            marker: { color: 'red' } // Custom color for Design 2 made changes
        }));

        return plotData1.concat(plotData2);
    };

    // Plot all data, separating by design psi from design psi list on the x-axis
    dataMappings.forEach(({ id, data1, data2, title, allDesignPsiList1, allDesignPsiList2 }) => {
        const combinedData = generatePlotData(data1, data2, allDesignPsiList1, allDesignPsiList2);

        Plotly.newPlot(id, combinedData, {
            title: title,
            xaxis: {
                title: 'Design PSI',
            },
            yaxis: { title: title },
            height: 300,
            margin: {
                l: 60,  
                r: 30,  
                t: 80,  
                b: 80   
            }
        }, {responsive: true});

        applyDarkModeIfNeeded(id);
    });
}

async function constructBoxPlot() { 
    /**
     * Collects data to construct box plots (waits for design psi list and scm, cm, testpsi data for both D1 and D2)
     * Then, feeds design psi lists to populate design psi dropdown
     * Then, feeds all collected information into boxPlot (which then actually makes the boxplots)
     */
    // Prepare design 1 data
    let allDesignPsiList1 = await getAllDesignPsiList(1);
    let [SCM_pctData1, CM_massData1, test_PSIData1] = await getDesignData(1, allDesignPsiList1);

    // Prepare design 2 data
    let allDesignPsiList2 = await getAllDesignPsiList(2);
    let [SCM_pctData2, CM_massData2, test_PSIData2] = await getDesignData(2, allDesignPsiList2);

    populateDesignPsiDropdown(1, allDesignPsiList1);
    populateDesignPsiDropdown(2, allDesignPsiList2);

    // Plot combined data
    boxPlot(allDesignPsiList1, SCM_pctData1, CM_massData1, test_PSIData1, allDesignPsiList2, SCM_pctData2, CM_massData2, test_PSIData2);
}

// Helper function to get all design PSIs
async function getAllDesignPsiList(designNum) {
    let inputMinValue, inputMaxValue;

    if (designNum === 1) {
        if (strengthCheckbox.checked) {
            inputMinValue = parseFloat(inputMin.value);
            inputMaxValue = parseFloat(inputMax.value);
        } else {
            inputMinValue = 1000;
            inputMaxValue = 10000;
        }
    } else if (designNum === 2) {
        if (strengthCheckbox_D2.checked) {
            inputMinValue = parseFloat(inputMin_D2.value);
            inputMaxValue = parseFloat(inputMax_D2.value);
        } else {
            inputMinValue = 1000;
            inputMaxValue = 10000;
        }
    }

    let tempDesignPsi = inputMinValue;
    let allDesignPsiList = [];

    while (tempDesignPsi <= inputMaxValue) {
        allDesignPsiList.push(tempDesignPsi);
        tempDesignPsi += 500; //designpsi list constructed with increments of 500
    }

    return allDesignPsiList;
}

// Helper function to retrieve data for each design
async function getDesignData(designNum, allDesignPsiList) {
    const promises = allDesignPsiList.map(async (designPsi) => {
        if (designNum === 1) { //wait for functions to filter data for box plots for D1
            return await boxPlotFiltering(designPsi);
        } else { //for D2
            return await boxPlotFiltering_D2(designPsi);
        }
    });

    const results = await Promise.all(promises);

    const SCM_pctData = {};
    const CM_massData = {};
    const test_PSIData = {};

    results.forEach(result => {
        SCM_pctData[result[0]] = result[1];
        CM_massData[result[0]] = result[2];
        test_PSIData[result[0]] = result[3];
    });

    return [SCM_pctData, CM_massData, test_PSIData];
}


/////////////////////////////////TABLE FOR DESIGN PSI'S GHG VALUES/////////////////////////////////////
function populateDesignPsiDropdown(designNum, allDesignPsiList) {
    let designPsiSelect;
    if (designNum==1){
        designPsiSelect = document.getElementById('design-psi-select');
    } else if (designNum==2){
        designPsiSelect= document.getElementById('design-psi-select-D2');
    }
    designPsiSelect.innerHTML = '<option value="all">All</option>'; // Reset with "all" option

    allDesignPsiList.forEach(psi => {
        const option = document.createElement('option');
        option.value = psi;
        option.textContent = psi;
        designPsiSelect.appendChild(option);
    });
}

function populateTopResults(designNum, numberOfTopProducts) {
    let top_res;

    if (designNum === 1) {
        top_res = 'top-results';
        no_res_msg = 'no-results-message-table1';
    } else if (designNum === 2) {
        top_res = 'top-results-D2';
        no_res_msg = 'no-results-message-table2'; // Ensure this ID exists in your HTML
    }

    const sortedData = window.data.slice().sort((a, b) => a['mixture_co2e_total'] - b['mixture_co2e_total']);
    const topResults = sortedData.slice(0, numberOfTopProducts);

    const topResultsTable = document.getElementById(top_res);

    topResultsTable.innerHTML = ''; // Clear previous results

    const headingRow = document.createElement('tr');
        window.columnOrder.forEach(key => {
            const th = document.createElement('th');
            th.textContent = key;
            headingRow.appendChild(th);
        });
        topResultsTable.appendChild(headingRow);

        topResults.forEach(row => {
            const tr = document.createElement('tr');
            window.columnOrder.forEach(key => {
                const td = document.createElement('td');
                td.textContent = row[key];
                tr.appendChild(td);
            });
            topResultsTable.appendChild(tr);
        });
}

/////////////////////////////-------------------DESIGN 1----------------///////////////////////////
document.getElementById('top-products').addEventListener('change', updateTable);
document.getElementById('design-psi-select').addEventListener('change', () => {
    console.log('Dropdown changed:', document.getElementById('design-psi-select').value);
    updateTable();
});

async function updateTable() { //Update Table based on selected design psi and the # of products to show
    const selectedPsi = document.getElementById('design-psi-select').value;
    const numberOfTopProducts = parseInt(document.getElementById('top-products').value);

    if (selectedPsi === 'all') {
        await showTopNProducts(numberOfTopProducts); //All design psi
    } else {
        await showTopNProductsForPsi(selectedPsi, numberOfTopProducts); //One specific design psi
    }
}

async function showTopNProducts(numberOfTopProducts) { //All design psi
    //filters data for all design psi, then triggers function to populate results
    const requestBody=createRequestBody();

    try {
        const response = await fetch('/filter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();
        hideLoadingBar();

        if (data.error) {
            console.error('Error:', data.error);
            alert('Error: ' + data.error);
            return;
        }

        window.data = data.data;
        window.columnOrder = data.column_order;
        console.log('Data for selected PSI:', data);

        if (window.data.length === 0) {
            document.getElementById('no-results-message-table1').style.display = 'block';
            document.getElementById('top-results').style.display = 'none';
        } else {
            document.getElementById('no-results-message-table1').style.display = 'none';
            document.getElementById('top-results').style.display = 'block';
            populateTopResults(1, numberOfTopProducts);
        }
    } catch (error) {
        console.error('Error fetching filtered data:', error);
        hideLoadingBar();
    }
}

async function showTopNProductsForPsi(designPsiValue, numberOfTopProducts) { //One specific design psi
    //filters data for specific design psi, then triggers function to populate results
    let minStrength, maxStrength;
    if (strengthCheckbox.checked) {
        minStrength = parseFloat(slider.noUiSlider.get()[0]);
        maxStrength = parseFloat(slider.noUiSlider.get()[1]);
    } else {
        minStrength = null;
        maxStrength = null;
    }
    let minScmPct, maxScmPct;
    if (scmCheckbox.checked) {
        minScmPct = parseFloat(scm_slider.noUiSlider.get()[0]);
        maxScmPct = parseFloat(scm_slider.noUiSlider.get()[1]);
    } else {
        minScmPct = null;
        maxScmPct = null;
    }
    let minCmMass, maxCmMass;
    if (cmCheckbox.checked) {
        minCmMass = parseFloat(cm_slider.noUiSlider.get()[0] * unitMultiplier);
        maxCmMass = parseFloat(cm_slider.noUiSlider.get()[1] * unitMultiplier);
    } else {
        minCmMass = null;
        maxCmMass = null;
    }

    const requestBody = {
        min_strength: minStrength,
        max_strength: maxStrength,
        min_scm_pct: minScmPct,
        max_scm_pct: maxScmPct,
        min_cm_mass: minCmMass,
        max_cm_mass: maxCmMass,
        design_PSI: designPsiValue,
    };

    try {
        const response = await fetch('/filterDesignPSI', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();
        hideLoadingBar();

        if (data.error) {
            console.error('Error:', data.error);
            alert('Error: ' + data.error);
            return;
        }

        window.data = data.data;
        window.columnOrder = data.column_order;

        if (window.data.length === 0) {
            document.getElementById('no-results-message-table1').style.display = 'block';
            document.getElementById('top-results').style.display = 'none';
        } else {
            document.getElementById('no-results-message-table1').style.display = 'none';
            document.getElementById('top-results').style.display = 'block';
            populateTopResults(1, numberOfTopProducts);
        }
    } catch (error) {
        console.error('Error fetching filtered data:', error);
        hideLoadingBar();
    }
}

/////////////////////////////-------------------DESIGN 2----------------///////////////////////////
document.getElementById('top-products-D2').addEventListener('change', updateTable_D2);
document.getElementById('design-psi-select-D2').addEventListener('change', () => {
    console.log('Dropdown changed:', document.getElementById('design-psi-select-D2').value);
    updateTable_D2();
});


async function updateTable_D2() { //Update Table based on selected design psi and the # of products to show
    const selectedPsi = document.getElementById('design-psi-select-D2').value;
    const numberOfTopProducts = parseInt(document.getElementById('top-products-D2').value);

    if (selectedPsi === 'all') {
        await showTopNProducts_D2(numberOfTopProducts); //All design psi
    } else {
        await showTopNProductsForPsi_D2(selectedPsi, numberOfTopProducts); //One specific design psi
    }
}

async function showTopNProducts_D2(numberOfTopProducts) {
    //filter for all design psi, then trigger function to populate table
    const requestBody=createRequestBody_D2();

    try {
        const response = await fetch('/filter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();
        hideLoadingBar_D2();

        if (data.error) {
            console.error('Error:', data.error);
            alert('Error: ' + data.error);
            return;
        }

        window.data = data.data;
        window.columnOrder = data.column_order;
        console.log('Data for selected PSI:', data);

        if (window.data.length === 0) {
            document.getElementById('no-results-message-table2').style.display = 'block';
            document.getElementById('top-results-D2').style.display = 'none';
        } else {
            document.getElementById('no-results-message-table2').style.display = 'none';
            document.getElementById('top-results-D2').style.display = 'block';
            populateTopResults(2, numberOfTopProducts);
        }
    } catch (error) {
        console.error('Error fetching filtered data:', error);
        hideLoadingBar_D2();
    }
}

async function showTopNProductsForPsi_D2(designPsiValue, numberOfTopProducts) {
    //filter for one design psi, then trigger function to populate table
    let minStrength_D2, maxStrength_D2;
    if (strengthCheckbox_D2.checked) {
        minStrength_D2 = parseFloat(slider_D2.noUiSlider.get()[0]);
        maxStrength_D2 = parseFloat(slider_D2.noUiSlider.get()[1]);
    } else {
        minStrength_D2 = null;
        maxStrength_D2 = null;
    }
    let minScmPct_D2, maxScmPct_D2;
    if (scmCheckbox_D2.checked) {
        minScmPct_D2 = parseFloat(scm_slider_D2.noUiSlider.get()[0]);
        maxScmPct_D2 = parseFloat(scm_slider_D2.noUiSlider.get()[1]);
    } else {
        minScmPct_D2 = null;
        maxScmPct_D2 = null;
    }
    let minCmMass_D2, maxCmMass_D2;
    if (cmCheckbox_D2.checked) {
        minCmMass_D2 = parseFloat(cm_slider_D2.noUiSlider.get()[0] * unitMultiplier_D2);
        maxCmMass_D2 = parseFloat(cm_slider_D2.noUiSlider.get()[1] * unitMultiplier_D2);
    } else {
        minCmMass_D2 = null;
        maxCmMass_D2 = null;
    }

    const requestBody = {
        min_strength: minStrength_D2,
        max_strength: maxStrength_D2,
        min_scm_pct: minScmPct_D2,
        max_scm_pct: maxScmPct_D2,
        min_cm_mass: minCmMass_D2,
        max_cm_mass: maxCmMass_D2,
        design_PSI: designPsiValue,
    };

    try {
        const response = await fetch('/filterDesignPSI', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();
        hideLoadingBar_D2();

        if (data.error) {
            console.error('Error:', data.error);
            alert('Error: ' + data.error);
            return;
        }

        window.data = data.data;
        window.columnOrder = data.column_order;

        if (window.data.length === 0) {
            document.getElementById('no-results-message-table2').style.display = 'block';
            document.getElementById('top-results-D2').style.display = 'none';
        } else {
            document.getElementById('no-results-message-table2').style.display = 'none';
            document.getElementById('top-results-D2').style.display = 'block';
            populateTopResults(2, numberOfTopProducts);
        }
    } catch (error) {
        console.error('Error fetching filtered data:', error);
        hideLoadingBar_D2();
    }
}

///////////////////////////// Toggling sliders in and out ////////////////////////////////////////
function toggleSlider(checkboxId, specItemClass, sliderContainerId, minInputId, maxInputId, newTextboxContainerId1, newTextboxContainerId2) {
    /**    
     * hides original min/max text boxes and shows "NA" boxes, also toggles on and off disableable items based on whether or not the checkbox is checked
     */
    const isEnabled = document.getElementById(checkboxId).checked;
    const specItem = document.getElementById(checkboxId).closest(specItemClass);
    const sliderElement = document.getElementById(sliderContainerId);
    const slider = sliderElement.noUiSlider;
    const minInput = document.getElementById(minInputId);
    const maxInput = document.getElementById(maxInputId);
    const newTextboxContainer = document.getElementById(newTextboxContainerId1);
    const newTextboxContainer2 = document.getElementById(newTextboxContainerId2);

    // Always ensure the checkbox itself remains enabled
    document.getElementById(checkboxId).disabled = false;

    if (isEnabled) {
        specItem.classList.remove('disabled');
        specItem.querySelectorAll('.disableable').forEach(el => {
            el.disabled = false;
            el.style.backgroundColor = ''; // Remove background color change if any
        });
        sliderElement.removeAttribute('disabled');
        minInput.value = slider.get()[0];
        maxInput.value = slider.get()[1];
        minInput.style.display = 'block';
        maxInput.style.display = 'block';
        newTextboxContainer.style.display = 'none';
        newTextboxContainer2.style.display = 'none';
        slider.updateOptions({
            tooltips: [false, false],
            behaviour: 'tap-drag',
        });
    } else {
        specItem.classList.add('disabled');
        specItem.querySelectorAll('.disableable').forEach(el => {
            el.disabled = true;
            el.style.backgroundColor = '#e0e0e0'; // Change background to indicate disabled state
        });
        sliderElement.setAttribute('disabled', 'true');
        newTextboxContainer.style.display = 'block';
        newTextboxContainer2.style.display = 'block';
        minInput.style.display = 'none';
        maxInput.style.display = 'none';
        slider.updateOptions({
            tooltips: [false, false],
            behaviour: 'none',
        });
    }
}

//////////////////////-------------------DESIGN 1-------------------///////////////////////////////
function toggleStrengthSlider() {
    toggleSlider(
        'strength-checkbox',
        '.spec-item',
        'strength-container',
        'min-strength',
        'max-strength',
        'newTextboxContainer',
        'newTextboxContainer2'
    );
}

function toggleScmSlider() {
    toggleSlider(
        'scm-checkbox',
        '.spec-item',
        'scm-container',
        'min-scm-pct',
        'max-scm-pct',
        'newTextboxContainer3',
        'newTextboxContainer4'
    );
}

function toggleCmSlider() {
    toggleSlider(
        'cm-checkbox',
        '.spec-item',
        'cm-container',
        'min-cm-mass',
        'max-cm-mass',
        'newTextboxContainer5',
        'newTextboxContainer6'
    );
}

//////////////////////-------------------DESIGN 2-------------------///////////////////////////////
function toggleStrengthSlider_D2() {
    toggleSlider(
        'strength-checkbox-D2',
        '.spec-item',
        'strength-container-D2',
        'min-strength-D2',
        'max-strength-D2',
        'newTextboxContainer-D2',
        'newTextboxContainer2-D2'
    );
}

function toggleScmSlider_D2() {
    toggleSlider(
        'scm-checkbox-D2',
        '.spec-item',
        'scm-container-D2',
        'min-scm-pct-D2',
        'max-scm-pct-D2',
        'newTextboxContainer3-D2',
        'newTextboxContainer4-D2'
    );
}

function toggleCmSlider_D2() {
    toggleSlider(
        'cm-checkbox-D2',
        '.spec-item',
        'cm-container-D2',
        'min-cm-mass-D2',
        'max-cm-mass-D2',
        'newTextboxContainer5-D2',
        'newTextboxContainer6-D2'
    );
}
//////////////////////////////////////////OVERALL GHG PLOT//////////////////////////////////////////////
async function fetchFilteredData(designNumber) { //filters data for overall ghg plots
    if (designNumber==1){
        requestBody=createRequestBody();
    } else if (designNumber==2){
        requestBody=createRequestBody_D2();
    }
    console.log('Sending filter request:', requestBody);

    const response = await fetch('/filter', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    })
    
    return response.json();
}

async function plotGHGBoxPlot() {
    /**
     * Creates the plot for overall GHG boxplots
     */
    const design1Data = await fetchFilteredData(1);
    const design2Data = await fetchFilteredData(2);

    const design1GhgEmissions = design1Data.data.map(item => item['mixture_co2e_total (kg CO2eq/cy)']);
    const design2GhgEmissions = design2Data.data.map(item => item['mixture_co2e_total (kg CO2eq/cy)']);

    // Create traces for each design
    const trace1 = {
        y: design1GhgEmissions,
        type: 'box',
        name: 'D1',
        marker: { color: 'blue' }
    };

    const trace2 = {
        y: design2GhgEmissions,
        type: 'box',
        name: 'D2',
        marker: { color: 'red' }
        // made changes
    };

    // Combine traces
    const data = [trace1, trace2];

    // Define layout with boxmode and box spacing to ensure fixed box width
    let layout = {
        title: 'GHG Emissions for Design 1 and Design 2',
        yaxis: { title: 'GHG Emissions (kg CO2eq/cy)' },
    };
    if (data.length==1){
        layout = {
            yaxis: { title: 'GHG Emissions (kg CO2eq/cy)' },
            boxmode: 'group',      // Maintain the box grouping
            boxgap: 0.5,           // Ensure consistent gap between boxes
            boxgroupgap: 0.5       // Ensure consistent gap between groups of boxes
        };
    }

    // Plot the box plot
    Plotly.newPlot('ghg-box-plot', data, layout, {responsive: true});
    applyDarkModeIfNeeded('ghg-box-plot');
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////--------------DARK MODE----------------//////////////////////////////////////
function getDarkModeLayout() {
    return {
        plot_bgcolor: '#1e1e1e', // Dark background for the plot area
        paper_bgcolor: '#1e1e1e', // Dark background for the paper area
        font: { color: '#ffffff' }, // White font color
    };
}

function getLightModeLayout() {
    return {
        plot_bgcolor: '#ffffff', // Light background for the plot area
        paper_bgcolor: '#ffffff', // Light background for the paper area
        font: { color: '#000000' }, // Black font color
        
    };
}

//Toggles website elements to dark mode
const toggleSwitch = document.getElementById('dark-mode-toggle');
const body = document.body;
const elementsToToggle = document.querySelectorAll('.specifications, .ghg-emissions-graph, .lowest-ghg, .spec-item label, .lowest-ghg table tr, .lowest-ghg table th, input[type="number"], .slider-container .noUi-connect, .slider-container .noUi-handle, .slider-container, header, .boxplot-section, .overall-ghg-container');

toggleSwitch.addEventListener('change', () => {
    const isDarkMode = body.classList.toggle('dark-mode');

    elementsToToggle.forEach(element => {
        element.classList.toggle('dark-mode', isDarkMode);
    });

    // Update Plotly plots with the appropriate layout
    const layout = isDarkMode ? getDarkModeLayout() : getLightModeLayout();
    Plotly.d3.selectAll('div[id^="box-plot"], div[id^="ghg-box-plot"], div[id^="plotDiv"]').each(function() {
        const plotId = this.id;
        Plotly.relayout(plotId, layout);
    });
});

function applyDarkModeIfNeeded(plotId) {
    /**
     * Used to apply dark mode after a new plot is created within dark mode
     */
    if (document.body.classList.contains('dark-mode')) {
        const darkModeLayout = getDarkModeLayout();
        Plotly.relayout(plotId, darkModeLayout);
    }
}

///////////////////////////////START BY FILTERING DATA//////////////////////////////////

document.addEventListener('DOMContentLoaded', function() {
    filterData();
});

//dropdown excel

document.getElementById('state-dropdown').addEventListener('change', function () {
    const selectedState = this.value;
    const selectedSCMType = document.getElementById('scm-type-select').value;

    fetch('/get_state_specs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ state: selectedState })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error('Error:', data.error);
            return;
        }

        // Extract values with fallbacks
        const minCM = data.min_cm_mass ?? 0;
        const maxCM = 800; // Default max CM unless you want to use another column
        const maxAllSCM = data.max_all_scm ?? 1;
        // Convert lbs from Excel to kg since your database is in kg/cy

        // // CHANGES IN CONVERSION
        // const minCM_lbs = data.min_cm_mass ?? 0;
        // const minCM = minCM_lbs * 0.453592;  // conversion to kg
        // const maxCM = 800;  // keep this or adjust if needed
        // const maxAllSCM = data.max_all_scm ?? 1;



        // Pick correct SCM type value
        const maxSCMByType = {
            "fly_ash": data.max_fly_ash,
            "slag": data.max_slag,
            "silica_fume": data.max_silica_fume,
            "natural_pozzolan": data.max_natural_pozzolan,
            "all scm": data.max_all_scm
        }[selectedSCMType] ?? maxAllSCM;
        
      

        // -------- Update CM Slider --------
        cm_slider.noUiSlider.updateOptions({
            range: {
                min: minCM,
                max: maxCM
            },
            start: [minCM, maxCM]
        });
        document.getElementById('min-cm-mass').value = minCM;
        document.getElementById('max-cm-mass').value = maxCM;

        // -------- Update SCM Slider --------
        scm_slider.noUiSlider.updateOptions({
            range: {
                min: 0,
                max: maxSCMByType
            },
            start: [0, maxSCMByType]
        });
        document.getElementById('min-scm-pct').value = 0;
        document.getElementById('max-scm-pct').value = maxSCMByType;

      
        

        // Filter with new values
        debouncedFilterData();
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });
});

// When SCM type is changed, re-trigger the state logic
document.getElementById('scm-type-select').addEventListener('change', () => {
    document.getElementById('state-dropdown').dispatchEvent(new Event('change'));
});
