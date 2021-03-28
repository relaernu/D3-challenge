// @TODO: YOUR CODE HERE!
// var promise = d3.csv("/assets/data/data.csv").then(function(d) {
//     return d;
// });

var suffix = {
    poverty: "%",
    age: "",
    income: "",
    healthcare: "%",
    smokes: "%",
    obesity: "%"
}

var prefix = {
    poverty: "",
    age: "",
    income: "$",
    healthcare: "",
    smokes: "",
    obesity: ""
}

// define axes column name <-> label 
var axisDefs = {
    // x asix
    poverty: "In Poverty (%)",
    age: "Age (Median)",
    income: "Household Income (Median)",
    // y asix
    healthcare: "Lacks Healthcare (%)",
    smokes: "Smokes (%)",
    obesity: "Obeses (%)"
}

// prepare axes choices
var xAxisNames = ["poverty", "age", "income"];
var yAxisNames = ["healthcare", "smokes", "obesity"];

// define current x and y axis
var currentX = xAxisNames[0];
var currentY = yAxisNames[0];

// initial load 
function init() {
    resize();
}

// function changeSelection(xAxisName, yAxisName) {
//     if (xAxisName !== currentX) {
//         currentX = xAxisName;
//     }
//     if (yAxisName !== currentY) {
//         currentY = yAxisName;
//     }
// }

function resize() {
    // empty area
    var svg = d3.select("#scatter").select("svg");
    if (!svg.empty()) {
        svg.remove();
    }

    // get the empty space between header and footer
    var svgHeight = window.innerHeight - $("#header").outerHeight() - $("#footer").outerHeight() - 20;

    // get the div column width as svg width
    var svgWidth = $("#scatterCol").outerWidth();

    // console.log(svgWidth);
    // console.log(svgHeight);

    // define margins
    var margin = {
        top: 40,
        left: 100,
        bottom: 85,
        right: 40
    };

    // calc chart rect
    var chartHeight = svgHeight - margin.top - margin.bottom;
    var chartWidth = svgWidth - margin.left - margin.right;

    // create svg area
    var svg = d3.select("#scatter")
        .append("svg")
        .attr("height", svgHeight)
        .attr("width", svgWidth)
        .classed("chart", true);

    // add group tag and make offset
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // load data and draw
    d3.csv("./assets/data/data.csv").then(function(data) {

        data.forEach(function(d){
            d[currentX] = +d[currentX];
            d[currentY] = +d[currentY];
        })

        // prepare axes
        var xScale = xScaleFunc(chartWidth, data);
        var yScale = yScaleFunc(chartHeight, data);

        var xAxis = d3.axisBottom(xScale);
        var yAxis = d3.axisLeft(yScale);

        // draw x axis
        chartGroup.append("g")
                  .attr("transform", `translate(0, ${chartHeight})`)
                  .transition()
                  .duration(1000)
                  .call(xAxis);
        
        // draw y axis
        chartGroup.append("g")
                  .transition()
                  .duration(1000)
                  .call(yAxis);

        
        var radius = 16;
        
        // put text in circle

        var statesGroup = chartGroup.append("g");

        var circles = statesGroup.selectAll("circle")
                                     .data(data)
                                     .enter()
                                     .append("circle")
                                     .attr("value", d => d.abbr)
                                     .classed("stateCircle", true);
        
        var texts = statesGroup.selectAll("text")
                                     .data(data)
                                     .enter()
                                     .append("text")
                                     .attr("value", d => d.abbr)
                                     .classed("stateText text-monospace text-primary", true)
                                     .style("font-size", radius)
                                     .text(d => d.abbr);

        texts.transition()
             .duration(1000)
             .attr("x", d => xScale(d[currentX]))
             .attr("y", d => yScale(d[currentY]) + (radius-4)/2);

        circles.transition()
               .duration(1000)
               .attr("cx", d => xScale(d[currentX]))
               .attr("cy", d => yScale(d[currentY]))
               .attr("r", radius);

        // *************************** create tips **************************
        var toolTip = d3.tip()
                        .attr("class", "d3-tip")
                        .offset([-10, 0])
                        .html(function (d) {
                            return (`${d.state}<br>
                                     ${currentX}: ${prefix[currentX]}${d[currentX]}${suffix[currentX]}<br>
                                     ${currentY}: ${prefix[currentY]}${d[currentY]}${suffix[currentY]}`);
                        });

        statesGroup.call(toolTip);
        
        circles.on("mouseover", function(data) {
            toolTip.show(data);
            })
            .on("mouseout", function(data) {
                    toolTip.hide(data);
            });

        // add tooltip to the text so don't need to be cursor on the edge of the circle to show tips
        // texts.call(toolTip);
        texts.on("mouseover", function(data) {
            var value = d3.select(this).attr("value");
            statesGroup.selectAll("circle")
                       .filter(function() {
                            return d3.select(this).attr("value") == value;
                       })
                       .dispatch("mouseover");

        })
        .on("mouseout", function(data) {
            var value = d3.select(this).attr("value");
            statesGroup.selectAll("circle")
                       .filter(function() {
                            return d3.select(this).attr("value") == value;
                       })
                       .dispatch("mouseout");
        });

        // *************************** create labels ************************
        // create x axis labels
        var xLabels = chartGroup.append("g")
                                .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);
        
        xLabels.selectAll("text")
                   .data(xAxisNames)
                   .enter()
                   .append("text")
                   .attr("x", 0)
                   .attr("y", (d, i) => i * 20 + 20)
                   .attr("value", d => d)
                   .classed("inactive aText", true)
                   .text(d => axisDefs[d]);

        // set current acitve label
        xLabels.selectAll("text")
                   .filter(function() {
                        return d3.select(this).attr("value") == currentX; 
                   })
                   .classed("inactive", false)
                   .classed("active", true);
        
        // create y axis labels
        var yLabels = chartGroup.append("g")
                                .attr("transform", `translate(-20, ${chartHeight /2}) rotate(-90)`);
        
        yLabels.selectAll("text")
               .data(yAxisNames)
               .enter()
               .append("text")
               .attr("x", 0)
               .attr("y", (d, i) => -20 - i * 20)
               .attr("value", d => d)
               .classed("inactive aText", true)
               .text(d => axisDefs[d]);
        
        // yLabels.transition()
        //        .duration(1000)
        //        .attr("x", 0)
        //        .attr("y", (d, i) => -20 - i * 20)
        //        .attr("value", d => d)
        //        .classed("inactive aText", true)
        //        .text(d => axisDefs[d]);
        
        // set current active label
        yLabels.selectAll("text")
               .filter(function() {
                    return d3.select(this).attr("value") == currentY; 
               })
               .classed("inactive", false)
               .classed("active", true);
        
        // add click event for both axes' labels
        xLabels.selectAll("text")
               .on("click", function() {
                   var value = d3.select(this).attr("value");
                   if (value === currentX) {
                       return;
                   }
                   else {
                       currentX = value;
                       resize();
                   }
               });
        
        yLabels.selectAll("text")
               .on("click", function() {
                   var value = d3.select(this).attr("value");
                   if (value === currentY) {
                       return;
                   }
                   else {
                       currentY = value;
                       resize();
                   }
               });
        
    });
}

// create scales for x Axis
function xScaleFunc(width, data) {

    // get x scale
    var min = d3.min(data, d => d[currentX]);
    var max = d3.max(data, d => d[currentX]);
    var xLinearScale = d3.scaleLinear()
                         .domain([min, max])
                         .range([0, width]);

    // padding 50px 
    var left = xLinearScale.invert(-50);
    var right = xLinearScale.invert(width + 50);

    // reset scale with padding
    xLinearScale = d3.scaleLinear()
                         .domain([left, right])
                         .range([0, width]);

    return xLinearScale;
}

// create scales for y Axis
function yScaleFunc(height, data) {

    // get y scale
    var min = d3.min(data, d => d[currentY]);
    var max = d3.max(data, d => d[currentY]);
    var yLinearScale = d3.scaleLinear()
                         .domain([min, max])
                         .range([height, 0]);

    // padding 50px
    var top = yLinearScale.invert(height + 50);
    var bottom = yLinearScale.invert(-50);

    // reset scale with padding
    yLinearScale = d3.scaleLinear()
                     .domain([top, bottom])
                     .range([height, 0]);


    return yLinearScale;
}

init();

d3.select(window).on("resize", resize);