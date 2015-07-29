/**
 * gistemp.js
 * 
 * Visualizes NASA's GISTEMP data. 
 * 
 * Adapted from Mike Bostock's Multi-Series Line Chart: http://bl.ocks.org/mbostock/3884955
 *
 * @author: Hugo Janssen
 * @date:   7/29/2015
 */
"use strict";

function gistemp(elt, w, h) {

	var margin = {top: 25, right: 50, bottom: 50, left: 50},
		width = w - margin.left - margin.right,
		height = h - margin.top - margin.bottom;
	
	var x = d3.time.scale()
		.range([0, width]);
	
	var y = d3.scale.linear()
		.range([height, 0]);

	var color = d3.scale.ordinal()
		.range(["#CCCCCC","#386CB0", "#F0027F"]); // Colorbrewer 6-class Accent
	
	var xAxis = d3.svg.axis()
		.scale(x)
		.ticks(d3.time.years, 10)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");
		
	var line = d3.svg.line()
		.interpolate("basis")
		.x(function(d) { return x(d.date); })
		.y(function(d) { return y(d.temperature); });
		
	var svg = d3.select(elt).append("svg")
		.style("width", width + margin.left + margin.right)
		.style("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	d3.csv("./data/ExcelFormattedGISTEMPData2CSV.csv", function(error, data) {
		if (error) throw error;

		data.forEach(function(d){
			d.year = new Date(+d.Year, 0, 1);
			d.Global = 0;
			d.Northern = +d.Glob - +d.NHem;
			d.Southern = +d.Glob - +d.SHem;
		});
		
		color.domain(d3.keys(data[0]).filter(function(key) { return key == "Global" || key === "Northern" || key === "Southern"; }));
		
		var temperatures = color.domain().map(function(name) {
			return {
				name: name,
				values: data.map(function(d) {
					return {date: d.year, temperature: +d[name]};
				})
			};
		});
		
		x.domain(d3.extent(data, function(d) { return d.year; }));
		y.domain([
			d3.min(temperatures, function(c) { return d3.min(c.values, function(v) { return v.temperature; }); }),
			d3.max(temperatures, function(c) { return d3.max(c.values, function(v) { return v.temperature; }); })
		]);
		
		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);
	  
		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)
		.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 6)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text("Temperature (℃)");
		
		var location = svg.selectAll(".location")
			.data(temperatures)
		.enter().append("g")
			.attr("class", "location");

		location.append("path")
			.attr("class", "line")
			.attr("d", function(d) { return line(d.values); })
			.style("stroke", function(d) { return color(d.name); });

		location.append("text")
			.datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
			.attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")"; })
			.attr("x", 3)
			.attr("dy", ".35em")
			.text(function(d) { return d.name; });	
	});
}