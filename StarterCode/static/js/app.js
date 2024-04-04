//Place url in variable
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

//Fetch JSON
d3.json(url).then(function(data) {
    console.log(data);
});

function init() {
    let menu = d3.select("#selDataset");
    d3.json(url).then((data) => {
        let names = data.names;
        names.forEach((id) => {
            console.log(id);
            menu.append("option")
            .text(id)
            .property("value",id);
        });
        let sample_one = names[0];
        console.log(sample_one);
        buildMetadata(sample_one);
        buildBarChart(sample_one);
        buildBubbleChart(sample_one);
    });
};

function buildMetadata(sample) {
    d3.json(url).then((data) => {
        let metadata = data.metadata;
        let value = metadata.filter(result => result.id == sample);
        console.log(value)
        let valueData = value[0];
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
        let samepleValues = valueData.sample_values;
        // Log data to console
        console.log(otuIds,otuLabels,samepleValues);
        // Display in reverse order
        let yticks = otuIds.slice(0,10).map(id => `OTU ${id}`).reverse();
        let labels = otuLabels.slice(0,10).reverse();
        let xticks = sampleValues.slice(0,10).reverse();
        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"
        };
        let layout = {
            title: "Top 10 OTUs Present"
        };
        Plotly.newPlot("bar", [trace], layout)
    });
};

function buildBubbleChart(sample) {
    d3.json(url).then((data) => {
        let sampleInfo = data.samples;
        let value = sampleInfo.filter(result => result.id == sample);
        let valueData = value[0];
        let otuIds = valueData.otu_ids;
        let otuLabels = valueData.otu_labels;
        let sampleValues = valueData.sample_values;
        console.log(otuIds,otuLabels,sampleValues);
        let trace1 = {
            x: otuIds,
            y: sampleValues,
            text: otuLabels,
            mode: "markers",
            marker: {
                size: sampleValues,
                color: otuIds,
            }
        };
        let layout = {
            title: "Bacteria Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
        };
        Plotly.newPlot("bubble", [trace1], layout)
    });
};

function optionChanged(value) { 
    console.log(value); 
    buildMetadata(value);
    buildBarChart(value);
    buildBubbleChart(value);
    buildGaugeChart(value);
};

init();