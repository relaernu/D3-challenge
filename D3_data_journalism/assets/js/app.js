// @TODO: YOUR CODE HERE!
// var promise = d3.csv("/assets/data/data.csv").then(function(d) {
//     return d;
// });

// define axes column name <-> label 
var axisDefs = {
    // x asix
    x: {
        poverty: "In Poverty (%)",
        ageMoe: "Age (Median)",
        incomeMoe: "Household Income (Median)"
    },
    // y asix
    y : {
    healthcare: "Lacks Healthcare (%)",
    smokes: "Smokes (%)",
    obesity: "Obeses (%)"
    }
}

// prepare axes choices
var xAxisNames = ["poverty", "ageMoe", "incomeMoe"];
var yAxisNames = ["healthcare", "smokes", "obesity"];

// define current x and y axis
var currentX = xAxisNames[0];
var currentY = yAxisNames[0];

// initial load 
function init() {
    resize();
}

function changeSelection(xAxisName, yAxisName) {
    if (xAxisName !== currentX) {
        currentX = xAxisName;
    }
    if (yAxisName !== currentY) {
        currentY = yAxisName;
    }
}

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
        left: 80,
        bottom: 60,
        right: 40
    };

    // calc chart rect
    var chartHeight = svgHeight - margin.top - margin.bottom;
    var chartWidth = svgWidth - margin.left - margin.right;

    // create svg area
    var svg = d3.select("#scatter")
        .append("svg")
        .attr("height", svgHeight)
        .attr("width", svgWidth);

    // add group tag and make offset
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // load data and draw
    d3.csv("/assets/data/data.csv").then(function(data) {

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
                  .call(xAxis);
        
        // draw y axis
        chartGroup.append("g")
                  .call(yAxis);

        // draw data point
        var circlesGroup = chartGroup.selectAll("circle")
                                     .data(data)
                                     .enter()
                                     .append("circle")
                                     .attr("cx", d => xScale(d[currentX]))
                                     .attr("cy", d => yScale(d[currentY]))
                                     .attr("r", 20)
                                     .attr("fill", "blue")
                                     .attr("opacity", ".5");

        // Create group for x-axis labels
        var labelsGroup = chartGroup.append("g")
                                    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);
        
        labelsGroup.selectAll("text")
                   .data()

    });
}

// create scales for x Axis
function xScaleFunc(width, data) {
    var xLinearScale = d3.scaleLinear()
        .domain([
            d3.min(data, d => d[currentX]),
            d3.max(data, d => d[currentX])
        ])
        .range([0, width]);
    return xLinearScale;
}

// create scales for y Axis
function yScaleFunc(height, data) {
    var yLinearScale = d3.scaleLinear()
        .domain([
            d3.min(data, d => d[currentY]),
            d3.max(data, d => d[currentY])
        ])
        .range([height, 0]);
    return yLinearScale;
}

// render circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
  }

init();

d3.select(window).on("resize", resize);