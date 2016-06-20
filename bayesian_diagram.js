"use strict";
var margin = {top: 20, right: 60, bottom: 20, left: 70},
    width = 300,
    height = width*2;

var V =	92.5, // Sensitivity
  U = 98.6, // Specificity
  R = 0.65,
  R_young = 1.87,
  R_black = 10.49;

var frames = [
	{V:0, U:100, R:0},
	{V:0, U:100, R:R},
	{V:V, U:100, R:R},
	{V:V, U:U, R:R},
	{V:V, U:U, R:R_young},
	{V:V, U:U, R:R_black},
];

var scale = d3.scale.linear()
  .domain([0,100])
  .range([0,width]);

var svg = d3.select('body').append('svg')
  .style('border', '1px solid black')
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)

  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var truPos = svg.append('rect'),
	falNeg = svg.append('rect'),
	falPos = svg.append('rect'),
	truNeg = svg.append('rect'),

	rLabel = svg.append('text')
		.text(frames[0].R)
		.style('opacity', 0),

  vLabel = svg.append('text')
		.text(frames[0].V)
		.style('opacity', 0),

  uLabel = svg.append('text')
		.text(frames[0].U)
		.style('opacity', 0);

svg.selectAll('rect').attr('fill','#CCC');

function plot(i, advance) {
  var frame = frames[i],
		sU = scale(frame.U),
		sV = scale(frame.V),
		sR = scale(frame.R),

		posNoTestColor = '#000',
		negNoTestColor = '#CCC',
		conPosNoTest = [1],
		conNegNoTest = [0,1,2],

		myDuration = 1000;
	var fontShiftDuration = 500;

	function rLabelFontShift() {
		return [0,1,2,4].indexOf(i) !== -1;
	}

	function vLabelFontShift() {
		if (advance) {
			return [2,3].indexOf(i) !== -1;
		} else {
			return [1,2].indexOf(i) !== -1;
		}
	}

	function uLabelFontShift() {
		return [3,4].indexOf(i) !== -1;
	}

	function rectDelay() {
		return rLabelFontShift() || vLabelFontShift() || uLabelFontShift() ?
			fontShiftDuration : 0;
	}

  truPos.transition().delay(rectDelay)
		.duration(myDuration)
    .attr('y', width - sV)
    .attr('height', sV)
    .attr('width', sR)
    // .attr('fill', i ? '#C00': negNoTestColor);
    .attr('fill', conPosNoTest.indexOf(i) + 1 ? posNoTestColor:'#C00');

  falNeg.transition().delay(rectDelay)
		.duration(myDuration)
    .attr('y', width)
    .attr('height', width - sV)
    .attr('width', sR)
    // .attr('fill', i ? '#FAA': negNoTestColor);
    .attr('fill', conPosNoTest.indexOf(i) + 1 ? posNoTestColor:'#FAA');

  falPos.transition().delay(rectDelay).duration(myDuration)
    .attr('x', sR)
    .attr('y', sU)
    .attr('height', width - sU)
    .attr('width', width - sR)
    .attr('fill', conNegNoTest.indexOf(i) + 1 ? negNoTestColor:'#060');

	truNeg.transition().delay(rectDelay).duration(myDuration)
		.attr('x', sR)
		.attr('y', width)
		.attr('height', sU)
		.attr('width', width - sR)
		.attr('fill',  conNegNoTest.indexOf(i) + 1 ? negNoTestColor:'#AFA');

	function runNumber(that, end, decimal) {
		return function() {
			var n = d3.interpolateNumber(that.text().replace(/%/g, ""), end);
			return function(t) {d3.select(this).text(n(t).toFixed(decimal)+'%');};
		};
	}

  // function runNumber2(selection) {
		// selection
			// .tween('text', function() {
		  // var n = d3.interpolateNumber(selection.text().replace(/%/g, ""), 0);
			// return function(t) {d3.select(this).text(n(t).toFixed(1)+'%');};
		// });
  // }

	// function rStyles(selection) {
	// 	selection
	// 		.style('opacity', i == 0 ? 0 : 1)
	// 		.style('font-weight', [1].indexOf(i) !== -1 ? 700 : 400)
	// ;}


  rLabel.transition()
		.duration(rLabelFontShift() ? fontShiftDuration : 0)
		.style('font-weight', [1,4,5,6].indexOf(i) !== -1 ? 700 : 400)
		.style('opacity', i === 0 ? 0 : 1)

		.transition().duration(myDuration)
    .attr('x', sR/2)
    .attr('y', width - sV - 5)
    .attr('text-anchor', 'middle')
		.tween('text', runNumber(rLabel,frames[i].R, 2))
		;

	if (vLabelFontShift()) {
		vLabel.transition()
			.duration(fontShiftDuration)
			.style('font-weight', i === 2 ? 700 : 400)
			.style('opacity', [0,1].indexOf(i) !== -1 ? 0 : 1);
	}

	vLabel.transition().delay(vLabelFontShift() ? fontShiftDuration : myDuration)
			.duration(myDuration)
			.attr('y', width - sV/2 + 7) .attr('x', -10)
			.attr('text-anchor', 'end')
			.tween('text', runNumber(vLabel, frames[i].V, 1))
			;

	uLabel.transition()
		.duration(uLabelFontShift() ? fontShiftDuration : 0)
		.style('font-weight', i === 3 ? 700 : 400)
		.style('opacity', [0,1,2].indexOf(i) !== -1 ? 0 : 1)

		.transition().duration(myDuration)
		.attr('x', width + 10)
		.attr('y', width + sU/2)
		.attr('text-anchor', 'start')
		.tween('text', runNumber(uLabel, frames[i].U, 1))
		;

}

plot(0,1);
var i = 0;
d3.selectAll("div button").data([-1, 1]).on('click', function(d) {
	i = i+d;
	if (i >= frames.length) {i = 0;
		// d = -1;
	}
	else if (i < 0) {i = frames.length-1;}
	plot(i,d);
});
