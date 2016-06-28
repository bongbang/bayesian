"use strict";
var margin = {top: 20, right: 75, bottom: 20, left: 70},
    width = 300,
    height = width*2;

var V =	92.5, // Sensitivity
  U = 98.6, // Specificity
  R = 0.65, // Chlamydia prevalence of white American female 25-29
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
	.style('font', "400 14px 'Helvetica Neue', Helvetica, Arial, sans-serif")
	.style('margin', 0)
	.style('padding', 0);

container.append('svg')
  .style('border', '1px solid #CCC')
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)

	.append('style')
	.text('g.button:hover use {fill: #000;}');

var svg = container.select('svg').append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var offset = {top: 20, bottom: 10}; // textbox tweak
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

// svg icons from flaticon, must attribute
defs.append('symbol')
	.attr('id','backward')
	.attr('viewBox', "0 0 477.175 477.175")
	.append('path')
	.attr('d',"M145.188,238.575l215.5-215.5c5.3-5.3,5.3-13.8,0-19.1s-13.8-5.3-19.1,0l-225.1,225.1c-5.3,5.3-5.3,13.8,0,19.1l225.1,225 c2.6,2.6,6.1,4,9.5,4s6.9-1.3,9.5-4c5.3-5.3,5.3-13.8,0-19.1L145.188,238.575z");

defs.append('symbol')
	.attr('id','forward')
	.attr('viewBox', "0 0 477.175 477.175")
	.append('path')
	.attr('d',"M360.731,229.075l-225.1-225.1c-5.3-5.3-13.8-5.3-19.1,0s-5.3,13.8,0,19.1l215.5,215.5l-215.5,215.5 c-5.3,5.3-5.3,13.8,0,19.1c2.6,2.6,6.1,4,9.5,4c3.4,0,6.9-1.3,9.5-4l225.1-225.1C365.931,242.875,365.931,234.275,360.731,229.075z ");

defs.append('symbol')
	.attr('id','repeat')
	.attr('viewBox', "0 0 489.711 489.711")
	.append('path')
	.attr('d',"M112.156,97.111c72.3-65.4,180.5-66.4,253.8-6.7l-58.1,2.2c-7.5,0.3-13.3,6.5-13,14c0.3,7.3,6.3,13,13.5,13 c0.2,0,0.3,0,0.5,0l89.2-3.3c7.3-0.3,13-6.2,13-13.5v-1c0-0.2,0-0.3,0-0.5v-0.1l0,0l-3.3-88.2c-0.3-7.5-6.6-13.3-14-13 c-7.5,0.3-13.3,6.5-13,14l2.1,55.3c-36.3-29.7-81-46.9-128.8-49.3c-59.2-3-116.1,17.3-160,57.1c-60.4,54.7-86,137.9-66.8,217.1 c1.5,6.2,7,10.3,13.1,10.3c1.1,0,2.1-0.1,3.2-0.4c7.2-1.8,11.7-9.1,9.9-16.3C36.656,218.211,59.056,145.111,112.156,97.111z");

var buttonsPlace = svg.append('g')
	.attr('transform', 'translate(' + width + ', ' + -margin.top + ')');

var buttonWidth = 20;
var buttons = buttonsPlace.selectAll('g.button')
	.data([-1, 1])
	.enter()
	.append('g')
	.attr('transform', function(d,i) {
		return 'translate(' + i*buttonWidth + ',0)';
	})
	.attr('class', 'button')
	.style('cursor', 'pointer');

	// .on('mouseover', function() {
	// 	d3.select(this).select('use')
	// 	.attr('fill', '#000');
	// 	d3.select(this).select('rect')
	// 	.attr('fill', '#DDD');
	// })
	// .on('mouseout', function() {
	// 	d3.select(this).select('use')
	// 	.attr('fill',iconColor);
	// 	d3.select(this).select('rect')
	// 	.attr('fill', 'none');
	// })
	// ;

buttons.append('rect')
	.attr('width', buttonWidth)
	.attr('height', buttonWidth)
	.attr('fill', 'transparent');

var iconColor = '#CCC';
buttons.append('use')
	.attr('xlink:href', function(d,i) {
		return (i === 0) ? '#backward' : '#forward';
	})
	.attr('width', buttonWidth)
	.attr('height', buttonWidth)
	.attr('fill',iconColor)
	.attr('x', 0)
	.attr('y', 0);

// PLOTTING
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
		.attr('opacity', 0),

  vLabel = svg.append('text')
		.text(frames[0].V)
		.attr('opacity', 0),

  uLabel = svg.append('text')
		.text(frames[0].U)
		.attr('opacity', 0);

function plot(i, advance, delay) { // Plotting workhorse
  var frame = frames[i],
		sU = scale(frame.U),
		sV = scale(frame.V),
		sR = scale(frame.R),

		noTestColor = '#CCC',
		posColor = '#D00',
		negColor = '#070'
		;

	var testNegOn = (i !== 4); // Shows positive only on Frame 4

	function imageSwitch(selection) {
		selection
		.attr('opacity', testNegOn ? 1 : 0)
		.attr('xlink:href', function(){
			if (i === 6) { return 'girls_bw.jpg';
			} else if (i === 7) { return 'tlc_bw.jpg';
			} else if (i === 8) { return 'kardashian_bw.jpg';
			} else { return 'friends_bw.jpg';}
		});
	}

	// Condition Positive (Left) side of plot
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
		.attr('opacity', testNegOn ? 0.7 : 0);

	// Condition Negative (Right) side of plot
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
		.attr('opacity', testNegOn ? 0.6 : 0);

	// Labels
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
		.tween('text', runNumber(rLabel,frames[i].R, [7,8].indexOf(i) !== -1 ? 1 : 2));

	vLabel.transition().delay(delay).duration(rectDuration)
		.attr('y', width - sV/2) .attr('x', -10)
		.attr('text-anchor', 'end')
		.attr('alignment-baseline', 'middle')
		.tween('text', runNumber(vLabel, frames[i].V, 1));

	uLabel.transition().delay(delay).duration(rectDuration)
		.attr('x', width + 10)
		.attr('y', width + sU/2)
		.attr('text-anchor', 'start')
		.attr('alignment-baseline', 'middle')
		.tween('text', runNumber(uLabel, frames[i].U, 1))
		;
	return delay + rectDuration;
}

// Where labels need to appear/disappear before or after plot transition
rLabel.on = false;
vLabel.on = false;
uLabel.on = false;
rLabel.strong = false;
vLabel.strong = false;
uLabel.strong = false;

function labelsPrep(i, advance, delay) {
	var lastFrame = frames.length-1;

	function labelSwitch(label,onToggle,strongFrames) { // should be taken outside; No need for calling every change of frame
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
			.attr('opacity', label.on ? 1 : 0);
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

// PLOTTING STARTS (w/ function calls)
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
