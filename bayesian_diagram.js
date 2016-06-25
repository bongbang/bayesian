"use strict";
var margin = {top: 20, right: 75, bottom: 20, left: 70},
    width = 300,
    height = width*2;

var V =	92.5, // Sensitivity
  U = 98.6, // Specificity
  R = 0.65, // White female 25-29
  R_young = 1.87, // WF 18-24
  R_black = 10.49; // BF 18-24

function PPV(V,U,R) {
	return V*R*100/(V*R + (100-U)*(100-R));
}
var frames = [
	{V:0, U:100, R:0, text:
	"Let the square represent <strong>white American women aged 25&ndash;29</strong>."},
	{V:0, U:100, R:R, text:
	"The red portion represents those infected with <strong>chlamydia</strong>.<br/><br/>" +
	"Let’s see what happens if we subject the entire demographic to <em>mandatory screening</em>."},
	{V:V, U:100, R:R, text:
	"Given the test’s <strong>sensitivity</strong>, " +V+ "% of the infected group can be expected to test positive, as shown in deep red."},
	{V:V, U:U, R:R, text:
	"And given the test’s <strong>specificity</strong>, 100 &minus; " +U+
		" = " +(100-U).toFixed(1)+ "% of the <em>healthy</em> group can also be expected to test positive, as shown in deep green."},
	{V:V, U:U, R:R, text:
	"Among the positive testers (looking like half a plus sign), <strong>true positives</strong> (red) make up only " +PPV(V,U,R).toFixed(0)+
	"%, which means that <strong>false positives</strong> (green) are as high as " +(100 - PPV(V,U,R)).toFixed(0)+ "%!" },
	{V:V, U:U, R:R, text:
	"This surprising result is due to the low <strong>prevalence rate</strong>.<br/><br/>" +
	"To illustrate, let’s do the same analysis on a demographic with a higher prevalence of chlamydia."},
	{V:V, U:U, R:R_young, text:
	"Change the age group to <strong>18&ndash;24</strong> (still white American women), " +
	"and false positives drop to " +(100 - PPV(V,U,R_young)).toFixed(0)+ "% thanks to higher prevalence."},
	{V:V, U:U, R:R_black, text:
	"Change the racial group to <strong>black</strong> on top of that, and false positives are down to " +(100 - PPV(V,U,R_black)).toFixed(0)+ "%.<br/><br/>" +
	"Even here, the net is still cast too wide. In real life, there is no mandatory screening for chlamydia. " + 
	"You get tested only if you have symptoms or risk factors such as having an infected partner."},
	{V:V, U:U, R:50, text:
	"If, say, half of this suspect group have chlamydia, then a positive result is highly dispositive. " +
	"Expected false positives are only " +(100 - PPV(V,U,50)).toFixed(0)+ 
	"%, or a positive prediction value (PPV) of " +PPV(V,U,50).toFixed(0)+ "%!<br/><br/>" +
	"<strong>Moral of the story:</strong> Testing works well if and only if you know when to use it."}
];

var fontShiftDuration = 500,
		rectDuration = 1000,
		textDuration = 500,
		interDelay = 500;

var scale = d3.scale.linear()
  .domain([0,100])
  .range([0,width]);

var container = d3.select('body').append('div')
	.attr('id', 'container')
	.style('position', 'relative')
	.style('margin', 0)
	.style('padding', 0);

var svg = container.append('svg')
	.attr('xmlns', 'http://www.w3.org/2000/svg')
	.attr('xmln:xlink', 'http://www.w3.org/1999/xlink')
  .style('border', '1px solid black')
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)

  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var offset = {top: 20, bottom: 10};
var textbox = container.append('div')
	.attr('id', 'textbox')
	.style('position', 'absolute')
	.style('box-sizing', 'border-box')
	.style('top', margin.top + offset.top + 'px')
	.style('left', width/2 + margin.left + 'px')
	.style('width', width/2 + 'px')
	.style('height', width - offset.top - offset.bottom + 'px')
	.style('padding', '10px 0 0 8px')
	.style('margin', 0);

var defs = svg.append('defs');
defs.append('clipPath')
	.attr('id', 'positive_clip')
	.append('rect')
	.attr('class', 'fal_neg');
defs.append('clipPath')
	.attr('id', 'negative_clip')
	.append('rect')
	.attr('class', 'tru_neg');

var posImage = svg.append('image')
			.attr('clip-path', 'url(#positive_clip)'),
		negImage = svg.append('image')
			.attr('clip-path', 'url(#negative_clip)');
svg.selectAll('image')
	.attr('xlink:href', 'friends_bw.jpg')
	.attr('width', width)
	.attr('height', width);

var truPos = svg.append('rect'),
	falNeg = svg.append('rect')
		.attr('class', 'fal_neg'),
	falPos = svg.append('rect'),
	truNeg = svg.append('rect')
		.attr('class', 'tru_neg')
		.attr('fill', '#CCC'),

	rLabel = svg.append('text')
		.text(frames[0].R)
		.style('opacity', 0),

  vLabel = svg.append('text')
		.text(frames[0].V)
		.style('opacity', 0),

  uLabel = svg.append('text')
		.text(frames[0].U)
		.style('opacity', 0);


function plot(i, advance, delay) {
  var frame = frames[i],
		sU = scale(frame.U),
		sV = scale(frame.V),
		sR = scale(frame.R),

		noTestColor = '#CCC',
		posColor = '#D00',
		negColor = '#070'
		;

	var testNegOn = (i !== 4);

	function imageSwitch(selection) {
		selection
		.style('opacity', testNegOn ? 1 : 0)
		.attr('xlink:href', function(){
			if (i === 6) { return 'girls_bw.jpg';
			} else if (i === 7) { return 'tlc_bw.jpg';
			} else if (i === 8) { return 'kardashian_bw.jpg';
			} else { return 'friends_bw.jpg';}
		});
	}

	posImage.transition().delay(delay).duration(rectDuration)
		.attr('y', width - sV)
		.call(imageSwitch);
  truPos.transition().delay(delay).duration(rectDuration)
    .attr('y', width - sV)
    .attr('height', sV)
    .attr('width', sR)
    .attr('fill', posColor);

  svg.selectAll('.fal_neg').transition().delay(delay).duration(rectDuration)
    .attr('y', width)
    .attr('height', width - sV)
    .attr('width', sR)
    .attr('fill', '#F99') // previously #FAA
		.style('opacity', testNegOn ? 0.7 : 0);

	negImage.transition().delay(delay).duration(rectDuration)
		.attr('y', sU)
		.call(imageSwitch);
  falPos.transition().delay(delay).duration(rectDuration)
    .attr('x', sR)
    .attr('y', sU)
    .attr('height', width - sU)
    .attr('width', width - sR)
    .attr('fill', negColor);

	svg.selectAll('.tru_neg').transition().delay(delay).duration(rectDuration)
		.attr('x', sR)
		.attr('y', width)
		.attr('height', sU)
		.attr('width', width - sR)
		.attr('fill',  i === 0 ? noTestColor:'#BFB')
		.style('opacity', testNegOn ? 0.6 : 0);

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
		.tween('text', runNumber(rLabel,frames[i].R, [7,8].indexOf(i) !== -1 ? 1 : 2))
		;

	vLabel.transition().delay(delay).duration(rectDuration)
		.attr('y', width - sV/2) .attr('x', -10)
		.attr('text-anchor', 'end')
		.attr('alignment-baseline', 'middle')
		.tween('text', runNumber(vLabel, frames[i].V, 1))
		;

	uLabel.transition().delay(delay).duration(rectDuration)
		.attr('x', width + 10)
		.attr('y', width + sU/2)
		.attr('text-anchor', 'start')
		.attr('alignment-baseline', 'middle')
		.tween('text', runNumber(uLabel, frames[i].U, 1))
		;
	return delay + rectDuration;
}

rLabel.on = false;
vLabel.on = false;
uLabel.on = false;
rLabel.strong = false;
vLabel.strong = false;
uLabel.strong = false;

function labelsPrep(i, advance, delay) {
	// delay += interDelay;
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

	var rToggled = labelSwitch(rLabel,[1,4,5],[1,5,6,7,8]);
	var vToggled = labelSwitch(vLabel,[2,4,5],[2]);
	var uToggled = labelSwitch(uLabel,[3,4,5],[3]);

	return rToggled || vToggled || uToggled ?
		fontShiftDuration + delay : 0;
}

function textEnter(delay) {
	textbox.transition().duration(textDuration).delay(delay)
		.style('opacity', 1);
}

var i = 0;
plot(i,1,0);
textbox.html(frames[i].text);

d3.selectAll("div button").data([-1, 1]).on('click', function(d) {
	i = i+d;
	if (i >= frames.length) {i = 0;
	}
	else if (i < 0) {
		i = frames.length-1;
	}

	textbox.transition().duration(textDuration)
		.style('opacity', 0)
		.each('end', function() {
			textbox.html(frames[i].text);

			var labelTotal, rectTotal, innerTotal;
		// label must transition first if advancing, second otherwise.
			if ((d === 1 && i !== 0) || (d === -1 && i === frames.length-1)) {
				labelTotal = labelsPrep(i,d,interDelay);
				innerTotal = plot(i,d, labelTotal);
			} else {
				rectTotal = plot(i,d, interDelay);
				innerTotal = labelsPrep(i,d, rectTotal);
			}
			textEnter(innerTotal + textDuration);
		});

});
