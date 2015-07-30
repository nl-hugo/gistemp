/**
 * gistemp.js
 * 
 * Visualizes NASA's GISTEMP data. 
 * 
 * Adapted from Mike Bostock's Multi-Series Line Chart: http://bl.ocks.org/mbostock/3884955
 *
 * @author: Hugo Janssen
 * @date:   7/30/2015
 */
"use strict";

function gistemp(elt, w, h) {

	var margin = {top: 25, right: 40, bottom: 50, left: 100},
		width = w - margin.left - margin.right,
		height = h - margin.top - margin.bottom;
	
	var x = d3.time.scale()
		.range([0, width]);
	
	var y = d3.scale.linear();

	var numberFormat = d3.format(",.2f");

	// hard coded colors to highlight anomalies 
	var color = d3.scale.ordinal().range(["#56564A","#56564A","#56564A","#56564A","#AE017E","#7A0177","#56564A","#56564A"]);
	
	var xAxis = d3.svg.axis()
		.scale(x)
		.ticks(d3.time.years, 10)
		.orient("bottom");
		
	var line = d3.svg.line()
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
		});
		
		color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Year" && key !== "year" 
			&& key !== "Glob" 
			&& key !== "NHem" 
			&& key !== "SHem" 
			&& key !== "24N-90N"
			&& key !== "90S-24S"
			&& key !== "24S-24N"; 
		}));
		
		var temperatures = color.domain().map(function(name) {
			return {
				name: name,
				values: data.map(function(d) {
					return {date: d.year, temperature: +d[name] / data[0][name] - 1}; // index 1880 = 0
				})
			};
		});
		
		x.domain(d3.extent(data, function(d) { return d.year; }));
		y.domain([
			d3.min(temperatures, function(c) { return d3.min(c.values, function(v) { return v.temperature; }); }),
			d3.max(temperatures, function(c) { return d3.max(c.values, function(v) { return v.temperature; }); })
		]).range([height / temperatures.length, 0]);
		
		// append x-axis to the chart
		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);
		
		// y-axis title left
		svg.append("text")
			.attr("x", -1 *  margin.left / 2)
			.text("Region");
	  
		// y-axis title right
		svg.append("text")
			.attr("x", width + margin.right)
			.attr("text-anchor", "end")
			.text("Index (1880 = 0 ℃)");
			
		// create small multiple for each region
		var region = svg.selectAll(".region")
			.data(temperatures)
		.enter().append("g")
			.attr("class", "region")			
			.attr("transform", function(d,i) { return "translate(0," + (i * height / temperatures.length) + ")" });

		region.append("path")
			.attr("class", "line")
			.attr("d", function(d) { return line(d.values); })
			.style("stroke", function(d) { return color(d.name); });

		// label the region
		region.append("text")
			.datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
			.attr("transform", "translate(0, " + height / temperatures.length / 3 + ")")
			.attr("x", -1 *  margin.left / 2)
			.attr("dy", ".35em")
			.style("fill", function(d) { return color(d.name); })
			.text(function(d) { return d.name; });	
		
		// display the last value
		region.append("text")
			.datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
			.attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")"; })
			.attr("x", margin.right)
			.attr("text-anchor", "end")
			.attr("dy", ".35em")
			.style("fill", function(d) { return color(d.name); })
			.text(function(d) { return numberFormat(d.value.temperature); });	
			
		// highlight the last value
	 	region.append("circle")
			.datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
			.attr("cx", function(d) { return x(d.value.date); })
			.attr("cy", function(d) { return y(d.value.temperature); })
			.attr("r", 2.0)
			.style("fill", function(d) { return color(d.name); });
	});
}