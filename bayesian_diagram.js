"use strict";
var margin = {top: 20, right: 60, bottom: 20, left: 70},
    width = 300,
    height = width*2;

var V =	92.5, // Sensitivity
  U = 98.6, // Specificity
  R = 0.65, // White female 25-29
  R_young = 1.87, // WF 20-24
  R_black = 10.49; // BF 20-24

var frames = [
	{V:0, U:100, R:0},
	{V:0, U:100, R:R},
	{V:V, U:100, R:R},
	{V:V, U:U, R:R},
	{V:V, U:U, R:R_young},
	{V:V, U:U, R:R_black},
];

var fontShiftDuration = 500,
		rectDuration = 1000
			;

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

function plot(i, delay) {
  var frame = frames[i],
		sU = scale(frame.U),
		sV = scale(frame.V),
		sR = scale(frame.R),

		posNoTestColor = '#000',
		negNoTestColor = '#CCC',
		conPosNoTest = [1],
		conNegNoTest = [0,1,2]
		;


	// function delay() {
	// 	return rLabelFontShift() || vLabelFontShift() || uLabelFontShift() ?
	// 		fontShiftDuration : 0;
	// }

	// var delay = 0;
  truPos.transition().delay(delay)
		.duration(rectDuration)
    .attr('y', width - sV)
    .attr('height', sV)
    .attr('width', sR)
    // .attr('fill', i ? '#C00': negNoTestColor);
    .attr('fill', conPosNoTest.indexOf(i) + 1 ? posNoTestColor:'#C00');

  falNeg.transition().delay(delay)
		.duration(rectDuration)
    .attr('y', width)
    .attr('height', width - sV)
    .attr('width', sR)
    // .attr('fill', i ? '#FAA': negNoTestColor);
    .attr('fill', conPosNoTest.indexOf(i) + 1 ? posNoTestColor:'#FAA');

  falPos.transition().delay(delay).duration(rectDuration)
    .attr('x', sR)
    .attr('y', sU)
    .attr('height', width - sU)
    .attr('width', width - sR)
    .attr('fill', conNegNoTest.indexOf(i) + 1 ? negNoTestColor:'#060');

	truNeg.transition().delay(delay).duration(rectDuration)
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

  rLabel.transition().delay(delay).duration(rectDuration)
    .attr('x', sR/2)
    .attr('y', width - sV - 5)
    .attr('text-anchor', 'middle')
		.tween('text', runNumber(rLabel,frames[i].R, 2))
		;

	vLabel.transition().delay(delay)
			.duration(rectDuration)
			.attr('y', width - sV/2 + 7) .attr('x', -10)
			.attr('text-anchor', 'end')
			.tween('text', runNumber(vLabel, frames[i].V, 1))
			;

	uLabel.transition().delay(delay).duration(rectDuration)
		.attr('x', width + 10)
		.attr('y', width + sU/2)
		.attr('text-anchor', 'start')
		.tween('text', runNumber(uLabel, frames[i].U, 1))
		;

}

var rSwitch = false,
		vSwitch = false,
		uSwitch = false;
function labelSwitch(i, advance, delay) {
	var lastFrame = frames.length-1;

	function rLabelFontShift() {
		if (advance === 1) {
			return [0,1].indexOf(i) !== -1;
		} else {
			return [0,lastFrame].indexOf(i) !== -1;
		}
	}

	function vLabelFontShift() {
		if (advance === 1) {
			return [0,2].indexOf(i) !== -1;
		} else {
			return [1,lastFrame].indexOf(i) !== -1;
		}
	}

	function uLabelFontShift() {
		if (advance === 1) {
			return [0,3].indexOf(i) !== -1;
		} else {
			return [2,lastFrame].indexOf(i) !==-1;
		}
	}

	if (rLabelFontShift()) {
		rSwitch = !rSwitch;
		rLabel.transition().delay(delay)
			.duration(fontShiftDuration)
		// .style('font-weight', [1,4,5,6].indexOf(i) !== -1 ? 700 : 400)
			.style('opacity', rSwitch ? 1 : 0)
		;
	}

	if (vLabelFontShift()) {
		vSwitch = !vSwitch;
		vLabel.transition().delay(delay)
			.duration(fontShiftDuration)
			// .style('font-weight', i === 2 ? 700 : 400)
			.style('opacity', vSwitch ? 1 : 0);
	}


	if (uLabelFontShift()) {
		uSwitch = !uSwitch;
		uLabel.transition().delay(delay)
			.duration(fontShiftDuration)
			// .style('font-weight', i === 2 ? 700 : 400)
			.style('opacity', uSwitch ? 1 : 0);
	}

	return rLabelFontShift() || vLabelFontShift() || uLabelFontShift() ?
		500 : 0;
}

plot(0,0);
var i = 0;
d3.selectAll("div button").data([-1, 1]).on('click', function(d) {
	i = i+d;
	if (i >= frames.length) {i = 0;
	}
	else if (i < 0) {
		i = frames.length-1;
	}

	if ((d === 1 && i !== 0) || (d === -1 && i === frames.length-1)) {
		var rectDelay = labelSwitch(i,d,0);
		plot(i,rectDelay);
	} else {
		plot(i, 0);
		labelSwitch(i,d, rectDuration);
	}
});
