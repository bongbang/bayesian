"use strict";
var margin = {top: 20, right: 70, bottom: 20, left: 70},
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

  truPos.transition().delay(delay).duration(rectDuration)
    .attr('y', width - sV)
    .attr('height', sV)
    .attr('width', sR)
    // .attr('fill', i ? '#C00': negNoTestColor);
    .attr('fill', conPosNoTest.indexOf(i) + 1 ? posNoTestColor:'#C00');

  falNeg.transition().delay(delay).duration(rectDuration)
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

rLabel.on = false;
vLabel.on = false;
uLabel.on = false;
rLabel.strong = false;
vLabel.strong = false;
uLabel.strong = false;

function labelsPrep(i, advance, delay) {
	var lastFrame = frames.length-1;

	function labelSwitch(label,onToggle,strongFrames) {
		var toggled, onToggled, strongToggled;

		function onSwitch(toggleFrames) {
			if (advance === 1) {
				toggleFrames.push(0);
			} else {
				toggleFrames = toggleFrames.map(function(x) {return x-1;});
				toggleFrames.push(lastFrame);
			}
			return toggleFrames.indexOf(i) !== -1;
		}

		function strongSwitch(strongFrames) {
			var oldStrong = label.strong;
			if (strongFrames.indexOf(i) !== -1) {
				label.strong = true;
			} else {
				label.strong = false;
			}
			return oldStrong !== label.strong;
		}

		if (onSwitch(onToggle)) {
			label.on = !label.on;
			onToggled = true;
		}

		strongToggled = strongSwitch(strongFrames);

		toggled = onToggled || strongToggled;

		if (toggled) {
			label.transition().delay(delay)
			.duration(fontShiftDuration)
			.attr('font-weight', label.strong ? 700 : 400)
			.attr('font-size', label.strong ? '1.4em' : '1em')
			.style('opacity', label.on ? 1 : 0);
		}

		return toggled;
	}
	
	var rToggled = labelSwitch(rLabel,[1],[1,5,6]);
	var vToggled = labelSwitch(vLabel,[2],[2]);
	var uToggled = labelSwitch(uLabel,[3],[3]);

	return rToggled || vToggled || uToggled ?
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
		var rectDelay = labelsPrep(i,d,0);
		plot(i,rectDelay);
	} else {
		plot(i, 0);
		labelsPrep(i,d, rectDuration);
	}
});
