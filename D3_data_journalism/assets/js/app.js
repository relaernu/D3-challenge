// @TODO: YOUR CODE HERE!
// var promise = d3.csv("/assets/data/data.csv").then(function(d) {
//     return d;
// });

// define axes column name <-> label 
var axisDefs = {
    // x asix
    poverty: "In Poverty (%)",
    ageMoe: "Age (Median)",
    incomeMoe: "Household Income (Median)",
    // y asix
    healthcare: "Lacks Healthcare (%)",
    smokes: "Smokes (%)",
    obesity: "Obeses (%)"
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

function resize() {
    // empty area
    var svg = d3.select("#scatter").select("svg");
    if (!svg.empty()) {
        svg.remove();
    }

    // get current window rect
    var svgHeight = window.innerHeight;
    var svgWidth = window.innerWidth;
    // var svgHeight = window.innerHeight;
    // var svgWidth = document.getElementById("scatter").width;

    console.log(svgWidth);
    // define margins
    var margin = {
        top: 20,
        left: 40,
        bottom: 20,
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

        // prepare axes
        var xAxis = d3.axisBottom(xScale(chartWidth, data, currentX));
        var yAxis = d3.axisLeft(yScale(chartHeight, data, currentY));

        // draw x axis
        chartGroup.append("g")
                  .attr("transform", `translate(0, ${chartHeight})`)
                  .call(xAxis);
                
        chartGroup.append("g")
                  .call(yAxis);
    });
}

// create scales for x Axis
function xScale(width, data, xAxisName) {
    var xLinearScale = d3.scaleLinear()
        .domain([
            d3.min(data, d => d[xAxisName]),
            d3.max(data, d => d[xAxisName])
        ])
        .range([0, width]);
    return xLinearScale;
}

// create scales for y Axis
function yScale(height, data, yAxisName) {
    var yLinearScale = d3.scaleLinear()
        .domain([
            d3.min(data, d => d[yAxisName]),
            d3.max(data, d => d[yAxisName])
        ])
        .range([height, 0]);
    return yLinearScale;
}

init(xAxisNames[0], yAxisNames[0]);

d3.select(window).on("resize", resize);