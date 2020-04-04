function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    console.log(result);
    var PANEL = d3.select("#sample-metadata");
    PANEL.html("");
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(key.toUpperCase() + ': ' + value);
    });
  });
}
function buildCharts(sample) {
  d3.json("samples.json").then((data) => {
    var sampledata = data.samples;
  
    var sampleArray = sampledata.filter(sampleObj => sampleObj.id === sample);
    
    var finalsample = sampleArray[0];
       const otu_ids = finalsample.otu_ids;
       const otu_labels = finalsample.otu_labels;
       const sample_values = finalsample.sample_values;

       console.log("Check the correct sample value");
       console.log(sample_values);
      //Building Bubble chart
      var bubbleData = [{
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: 'Earth'
        }
      }];      

      var bubbleLayout = {
        margin: { t: 0 },
        hovermode: 'closest',
        xaxis: {title: 'OTU ID'},
        yaxis: {title: "SAMPLE SIZE"}
      };

      Plotly.plot('bubble', bubbleData, bubbleLayout);
  //Building Bar chart
  // Slice the entire array to get the first 10 samples. 
   new_sample_values = sample_values.slice(0, 10);
   new_otu_ids = otu_ids.slice(0,10);
   new_otu_labels = otu_labels.slice(0,10);
  
 // Trace for the bar chart
  var trace = {
    x: new_sample_values.reverse(),
    y: new_otu_ids.map(otu_id => "OTU " + otu_id.toString()).reverse(),
    text: new_otu_labels.reverse(),
    type: "bar",
    orientation: "h"
  };

// data
var data = [trace];

// Apply the group bar mode to the layout
var layout = {
  title: "Belly Button Bar Chart",
  //xaxis: { title: "SAMPLE SIZE"},
  yaxis: { title: "OTU ID"}
  };
// Render the plot to the div tag with id "bar"
Plotly.newPlot("bar", data, layout);
  });
}

function init() {
  var selector = d3.select("#selDataset");

  d3.json("samples.json").then((data) => {
    //console.log(data);
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
  // Use the first sample from the list to build the initial plots
  const firstSample = sampleNames[0];
  buildCharts(firstSample);
  buildMetadata(firstSample);
  })
}
function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
}

init();