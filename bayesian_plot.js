"use strict";
// requestAnimationFrame polyfill
if(!Date.now)Date.now=function(){return(new Date).getTime()};(function(){var n=["webkit","moz"];for(var e=0;e<n.length&&!window.requestAnimationFrame;++e){var i=n[e];window.requestAnimationFrame=window[i+"RequestAnimationFrame"];window.cancelAnimationFrame=window[i+"CancelAnimationFrame"]||window[i+"CancelRequestAnimationFrame"]}if(/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent)||!window.requestAnimationFrame||!window.cancelAnimationFrame){var a=0;window.requestAnimationFrame=function(n){var e=Date.now();var i=Math.max(a+16,e);return setTimeout(function(){n(a=i)},i-e)};window.cancelAnimationFrame=clearTimeout}})();
// end polyfill
//
var margin = {top: 20, right: 80, bottom: 10, left: 70},
    width = 300,
    height = width*2;

var V =	92.5, // Sensitivity
  U = 98.6, // Specificity
  R = 0.65; // Chlamydia prevalence of white American female 25-29

var svgns = 'http://www.w3.org/2000/svg';

var svgFrame = document.createElementNS(svgns,'svg');
svgFrame.setAttribute('width', width + margin.left + margin.right);
svgFrame.setAttribute('height', height + margin.top + margin.bottom);

var svgCSS = document.createElementNS(svgns,'style');
svgCSS.textContent =
	'.vertical-drag-bar {cursor: ns-resize; pointer-events:all; fill:none}' +
	'.horizontal-drag-bar {cursor: col-resize; pointer-events:all; visibility:hidden}' +
	'.horizontal-drag-bar:hover {visibility:visible}';
svgFrame.appendChild(svgCSS);

var svg = document.createElementNS(svgns, 'g');
svg.setAttribute(
		'transform','translate(' + margin.left + ',' + margin.top + ')');
svgFrame.appendChild(svg);

var truPos = document.createElementNS(svgns,'rect'),
	falNeg = document.createElementNS(svgns,'rect'),
	falPos = document.createElementNS(svgns,'rect'),
	truNeg = document.createElementNS(svgns,'rect'),
	vDragBar = document.createElementNS(svgns,'rect'),
	uDragBar = document.createElementNS(svgns,'rect'),
	rDragBar = document.createElementNS(svgns,'rect'),
	vDragLine = document.createElementNS(svgns, 'line'),
	uDragLine = document.createElementNS(svgns, 'line');


truPos.setAttribute('fill', '#D00');
falNeg.setAttribute('fill', '#F99');
falPos.setAttribute('fill', '#070');
truNeg.setAttribute('fill', '#BFB');

function setAttributes(el, attrs) {
	for (var key in attrs) {
		el.setAttribute(key, attrs[key]);
	}
}

var multiplier = width/100,
	sU = U*multiplier,
	sV = V*multiplier,
	sR = R*multiplier;

var barWidth = 10;

function plotConPos() {
	var topLimit = width - sV;

	setAttributes(vDragLine, {
		'y1': topLimit,
		'x2': sR,
		'y2': topLimit
	});

	setAttributes(truPos, {
		'y': topLimit,
		'height': sV,
		'width': sR
	});

	setAttributes(vDragBar, {
		'y': topLimit - barWidth/2,
		'height': barWidth,
		'width': sR
	});

	setAttributes(falNeg, {
		'y': width,
		'height': topLimit,
		'width': sR
	});
}

function plotRDragBar() {
	var topPosition = Math.min(width - sV, sU),
		topDistance = width - topPosition,
		bottomDistance = Math.max(width - sV, sU),
		halfBar = barWidth/2;
	setAttributes(rDragBar, {
		'x': sR - halfBar,
		'y': topPosition + halfBar,
		'height': topDistance + bottomDistance - barWidth,
		'width': barWidth,
		'fill': 'yellow',
		'opacity': 0.5
	});
}

function plotConNeg() {
	setAttributes(falPos, {
		'x': sR,
		'y': sU,
		'height': width - sU,
		'width': width - sR
	});

	setAttributes(uDragBar, {
		'x': sR,
		'y': width + sU - barWidth/2,
		'height': barWidth,
		'width': width - sR
	});

	setAttributes(truNeg, {
		'x': sR,
		'y': width,
		'height': sU,
		'width': width - sR
	});

	setAttributes(uDragLine, {
		'x1': sR,
		'y1': width + sU,
		'x2': width,
		'y2': width + sU
	});
}

plotConPos();
plotConNeg();
plotRDragBar();
[vDragLine, truPos, vDragBar, falPos,
	truNeg, uDragBar, falNeg, uDragLine,
	rDragBar].forEach(function(e) {
	svg.appendChild(e);
});

setAttributes(uDragBar, {
	'id': 'u-drag',
	'class': 'vertical-drag-bar'
});

setAttributes(vDragBar, {
	'id': 'v-drag',
	'class': 'vertical-drag-bar'
});

setAttributes(rDragBar, {
	'class': 'horizontal-drag-bar'
});

setAttributes(uDragLine, {
	'stroke': 'green',
});

vDragLine.setAttribute('stroke', 'orange');

var startY = 0, startHeight = 0, target;
vDragBar.onmousedown = initVerticalResize;
uDragBar.onmousedown = initVerticalResize;

function initVerticalResize(e) {
	target = e.target.getAttribute('id');
	startY = e.clientY;
	startHeight = (target === 'v-drag') ? sV : sU;
	window.addEventListener('mousemove', doVerticalResize, false);
	window.addEventListener('mouseup', stopResize, false);
};

function doVerticalResize(e) {
	var down = target === 'u-drag' ? 1 : -1,
		cursorDistance = down*(e.clientY - startY),
		newHeight = Math.min(Math.max(startHeight + cursorDistance, 0), width);
	if (target === 'v-drag') {
		sV = newHeight;
		plotConPos();
	} else {
		sU = newHeight;
		plotConNeg();
	}
	plotRDragBar();
}

var startX = 0, startR = 0;
rDragBar.onmousedown = function(e) {
	startX = e.clientX;
	startR = sR;
	window.addEventListener('mousemove', doHorizontalResize, false);
	window.addEventListener('mouseup', stopResize, false);
};

function doHorizontalResize(e) {
	var cursorDistance = e.clientX - startX;
	sR = Math.min(Math.max(startR + cursorDistance, 0), width);
	plotConPos();
	plotConNeg();
	plotRDragBar();
}

function stopResize() {
	window.removeEventListener('mousemove', doVerticalResize, false);
	window.removeEventListener('mousemove', doHorizontalResize, false);
	window.removeEventListener('mouseup', stopResize, false);
}


document.body.appendChild(svgFrame);

