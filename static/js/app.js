function bellySamples(id) {
    //Pull in samples.json data (for Bar Chart)
        d3.json("samples.json").then (bellysample =>{
           //populate arrays and gather top 10 values
            console.log(bellysample)
            var otuIDs = bellysample.samples[0].otu_ids;
            console.log(otuIDs)
            var sampleValues =  bellysample.samples[0].sample_values.slice(0,10).reverse();
            console.log(sampleValues)
            var otuLabels =  bellysample.samples[0].otu_labels.slice(0,10);
            console.log (otuLabels)

        // Save Top 10 OTU ids in decending order. 
            var OTU_top = ( bellysample.samples[0].otu_ids.slice(0, 10)).reverse();
            var OTU_id = OTU_top.map(d => "OTU " + d); // Map OTU IDs for plot
            console.log(`OTU IDS: ${OTU_id}`)

         // Save Top 10 labels for plot
            var top10Labels =  bellysample.samples[0].otu_labels.slice(0,10);
            console.log(`OTU_labels: ${top10Labels}`)
            var trace = {
                x: sampleValues, // number of samples
                y: OTU_id,  // id of OTU sample
                text: top10Labels,
                marker: 
                    {color: 'blue'},
                    type:"bar",
                    orientation: "h"
            };
            var barData = [trace];
    
           
            var barLayout = {  // Bar chart layout
                title: "Top 10 OTUs",
                yaxis:{tickmode:"linear"},
                margin: {
                    l: 100,
                    r: 100,
                    t: 100,
                    b: 30
                }
            };
        Plotly.newPlot("bar", barData, barLayout); // Part 1: create the bar chart



            // Part 2: The bubble chart
            var trace1 = {
                x: bellysample.samples[0].otu_ids,
                y: bellysample.samples[0].sample_values,
                mode: "markers",
                marker: {
                    size: bellysample.samples[0].sample_values,
                    color: bellysample.samples[0].otu_ids
                },
                text:  bellysample.samples[0].otu_labels
    
            };
    
            var bubbleLayout = { // Bubble chart layout
                xaxis:{title: "OTU IDs"},
                height: 600,
                width: 1000
            };
    
            // Part 2: Variable to store bubble chart data 
            var bubbleData = [trace1];
    
      
        Plotly.newPlot("bubble", bubbleData, bubbleLayout); // Part 2: Bubble Plot
        });
    }  

    
    function bellyBubbleData(id) {  // Pull in data for bubble chart
        d3.json("samples.json").then((data)=> {
            var metadata = data.metadata;
            console.log(metadata)
    
          // Metadata by ID filter
           var result = metadata.filter(meta => meta.id.toString() === id)[0];
           var demographicInfo = d3.select("#sample-metadata"); // tag to populate
           demographicInfo.html("");  // clear before populating
            Object.entries(result).forEach((key) => {    // append data to page
                demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
            });
        });
    }

    // Function for changing on selection (from html)
    function optionChanged(id) {
        bellySamples(id);
        bellyBubbleData(id);
    }
    
    // Initial screen display
    function init() {
         
        var dropdown = d3.select("#selDataset"); // dropdown selection
    
        
        d3.json("samples.json").then((data)=> { // pull json data 
            console.log(data)
    
           
            data.names.forEach(function(name) { //dropdown id
                dropdown.append("option").text(name).property("value");
            });
    
            // pass data to Plotly funcitons for charts
            bellySamples(data.names[0]);
            bellyBubbleData(data.names[0]);
        });
    }
    
    init(); // call initial screen population