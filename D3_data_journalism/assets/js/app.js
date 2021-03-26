// @TODO: YOUR CODE HERE!
d3.csv("/assets/data/data.csv").then(function(data) {
    init(data);
});
// initial load 
function init(data) {
    // get current window rect
    resize(data);
}

function resize(data) {

    // empty area
    var svg = d3.select("#scatter").select("svg");
    if (!svg.empty()) {
        svg.remove();
    }

    // get current window rect
    var svgHeight = window.innerHeight;
    var svgWidth = window.innerWidth;

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
        .attr("height", chartHeight)
        .attr("width", chartWidth);

    // add group tag and make offset
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
}

d3.select(window).on("resize", resize);