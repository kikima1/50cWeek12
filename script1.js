"use strict"
/*const circle = d3.select("circle");
circle.attr("r", 1000);
circle.attr("cx", 250);
circle.attr("cy", 230);*/

// alternative syntax via chaining
//circle.attr("r", 100).attr("cx", 200).attr("cy", 230);

// set css styles
circle.style("stroke-width", 2);

// add, remove css classes
circle.classed("highlight", true);

// set inner text
d3.select("text").text("Hello");
d3.select("div").html(`<strong>Hello</strong>`);
