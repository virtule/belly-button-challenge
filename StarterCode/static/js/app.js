//Place url in variable
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

//Fetch JSON
d3.json(url).then(function(data) {
    console.log(data);
});

// Setup initial menu
function init() {
    // Select drop down menu
    let menu = d3.select("#selDataset");
    //Fetch JSON
    d3.json(url).then((data) => {
        //Set names
        let names = data.names;
        //Loop through names and append to menu
        names.forEach((id) => {
            console.log(id);
            menu.append("option")
            .text(id)
            .property("value");
        });
        //Set first sample
        let sampleOne = names[0];
        console.log(sampleOne);
        //Run sample through functions
        buildDemograph(sampleOne);
        buildBarChart(sampleOne);
        buildBubbleChart(sampleOne);
    });
};

// Create demographic info
function buildDemograph(sample) {
    //Fetch JSON
    d3.json(url).then((data) => {
        //Set metadata
        let metadata = data.metadata;
        // Create filter by matching sample id
        let value = metadata.filter((result) => result.id == sample);
        console.log(value)
        //Set first from filtered value
        let valueData = value[0];
        // Clear out previous
        d3.select("#sample-metadata").html("");
        Object.entries(valueData).forEach(([key,value]) => {
            console.log(key,value);
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });
};

// Build bar chart
function buildBarChart(sample) {
    d3.json(url).then((data) => {
        let sampleData = data.samples;
        let valueFilter = sampleData.filter(result => result.id === sample);
        let valueData = valueFilter[0];
        let otuIds = valueData.otu_ids;
        let otuLabels = valueData.otu_labels;
        let sampleValues = valueData.sample_values;
        // Log data to console
        console.log(otuIds,otuLabels,sampleValues);
        // Display in reverse order
        let yticks = otuIds.slice(0,10).map(id => `OTU ${id}`).reverse();
        let labels = otuLabels.slice(0,10).reverse();
        let xticks = sampleValues.slice(0,10).reverse();
        // Create trace data
        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"
        };
        // Create layout
        let layout = {
            title: "Top 10 OTUs Present"
        };
        // Create plot
        Plotly.newPlot("bar", [trace], layout)
    });
};

// Build bubble chart
function buildBubbleChart(sample) {
    d3.json(url).then((data) => {
        let samples = data.samples;
        let value = samples.filter(result => result.id == sample);
        let valueData = value[0];
        // Create trace data
        let trace1 = {
            x: valueData.otu_ids,
            y: valueData.sample_values,
            text: valueData.otu_labels,
            mode: "markers",
            marker: {
                size: valueData.sample_values,
                color: valueData.otu_ids,
            }
        };
        // Create layout
        let layout = {
            title: "Bacteria Per Sample",
            xaxis: {title: "OTU ID"},
        };
        // Create plot
        Plotly.newPlot("bubble", [trace1], layout)
    });
};

// Create handler for changing targets
function optionChanged(ID){
    buildDemograph(ID);
    buildBarChart(ID);
    buildBubbleChart(ID);

};


// Call function
init();