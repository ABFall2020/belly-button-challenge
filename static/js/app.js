// URL Data
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json"

// Display plots
function init() {

    // dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    // Fetch JSON data and console log it
    d3.json(url).then((data) => {
        console.log(`Data: ${data}`);

        // array of id names
        let names = data.names;

        // Iterate through names Array
        names.forEach((name) => {
            // Append each name as an option to the drop down menu
            // This is adding each name to the html file as an option element with value = a name in the names array
            dropdownMenu.append("option").text(name).property("value", name);
        });

        // Assign first name to name variable
        let name = names[0];

        // Call the functions to make demographic panel, bar chart, and bubble chart
        demo(name);
        bar(name);
        bubble(name);
        gauge(name);
    });
}

// demographics panel
function demo(selectedValue) {
    // Fetch JSON data and console log it
    d3.json(url).then((data) => {
        console.log(`Data: ${data}`);

        // array of metadata objects
        let metadata = data.metadata;
        
        // Filter data where id = selected value after converting types 
        // (bc meta.id is in integer format and selectValue from is in string format)
        let filteredData = metadata.filter((meta) => meta.id == selectedValue);
      
        // Assign first object to obj variable
        let obj = filteredData[0]
        
        // Clear child elements in div with id sample-metadata
        d3.select("#sample-metadata").html("");
  
        // This returns an array of a given object's own enumerable property [key, value]
        let entries = Object.entries(obj);
        
        // Iterate through entries array
        // Add a h5 child element for each key-value pair to the div with id sample-metadata
        entries.forEach(([key,value]) => {
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });

        // Log entries Array
        console.log(entries);
    });
  }
  

// bar chart
function bar(selectedValue) {
    // Fetch JSON data and console log it
    d3.json(url).then((data) => {
        console.log(`Data: ${data}`);

        // array of sample objects
        let samples = data.samples;

        // Filter data where id = selected value 
        let filteredData = samples.filter((sample) => sample.id === selectedValue);

        // Assign first object to obj variable
        let obj = filteredData[0];
        
        // Trace data for the horizontal bar chart
        let trace = [{
            // Slice the top 10 otus
            x: obj.sample_values.slice(0,10).reverse(),
            y: obj.otu_ids.slice(0,10).map((otu_id) => `OTU ${otu_id}`).reverse(),
            text: obj.otu_labels.slice(0,10).reverse(),
            type: "bar",
            marker: {
                color: "blue"
            },
            orientation: "h"
        }];
        
        // Use Plotly to plot data in bar chart
        Plotly.newPlot("bar", trace);
    });
}
  
// bubble chart
function bubble(selectedValue) {
    // Fetch JSON data and console log it
    d3.json(url).then((data) => {

        // array of sample objects
        let samples = data.samples;
    
        // Filter data where id = selected value 
        let filteredData = samples.filter((sample) => sample.id === selectedValue);
    
        // Assign first object to obj variable
        let obj = filteredData[0];
        
        // Trace data for the bubble chart
        let trace = [{
            x: obj.otu_ids,
            y: obj.sample_values,
            text: obj.otu_labels,
            mode: "markers",
            marker: {
                size: obj.sample_values,
                color: obj.otu_ids,
                colorscale: "Earth"
            }
        }];
    
        // Apply the x-axis lengend to the layout
        let layout = {
            xaxis: {title: "OTU ID"}
        };
    
        // Use Plotly to plot data in a bubble chart
        Plotly.newPlot("bubble", trace, layout);
    });
}

// gauge chart 
function gauge(selectedValue) {
    // Fetch JSON data and console log it 
    d3.json(url).then((data) => {
        // array of metadata objects
        let metadata = data.metadata;
        
        // Filter data where id = selected value after converting their types 
        // (bc meta.id is in integer format and selectValue from is in string format)
        let filteredData = metadata.filter((meta) => meta.id == selectedValue);
      
        // Assign first object to obj variable
        let obj = filteredData[0]

        // Trace data for the gauge chart
        let trace = [{
            domain: { x: [0, 1], y: [0, 1] },
            value: obj.wfreq,
            title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week", font: {size: 24}},
            type: "indicator", 
            mode: "gauge+number",
            gauge: {
                axis: {range: [null, 10]}, 
                bar: {color: "blue"},
                steps: [
                    { range: [0, 1], color: "rgb(233,245,248)" },
                    { range: [1, 2], color: "rgb(218,237,244)" },
                    { range: [2, 3], color: "rgb(203,230,239)" },
                    { range: [3, 4], color: "rgb(188,223,235)" },
                    { range: [4, 5], color: "rgb(173,216,230)" },
                    { range: [5, 6], color: "rgb(158,209,225)" },
                    { range: [6, 7], color: "rgb(143,202,221)" },
                    { range: [7, 8], color: "rgb(128,195,216)" },
                    { range: [8, 9], color: "rgb(113,187,212)" },
                    { range: [9, 10], color: "rgb(98,180,207)" }
                ]
            }
        }];

         // Use Plotly to plot the data in a gauge chart
         Plotly.newPlot("gauge", trace);
    });
}

// Toggle to new plots when option changed
function optionChanged(selectedValue) {
    demo(selectedValue);
    bar(selectedValue);
    bubble(selectedValue);
    gauge(selectedValue)
}

init();
