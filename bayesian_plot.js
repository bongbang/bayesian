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

function setAttributes(el, attrs) {
	for (var key in attrs) {
		el.setAttribute(key, attrs[key]);
	}
}

var svgns = 'http://www.w3.org/2000/svg';

var svgFrame = (function() {
	var svgFrame = document.createElementNS(svgns,'svg');
	svgFrame.setAttribute('width', width + margin.left + margin.right);
	svgFrame.setAttribute('height', height + margin.top + margin.bottom);
	var svgCSS = document.createElementNS(svgns,'style');
	svgCSS.textContent =
		'.vertical-drag-bar {cursor: ns-resize; pointer-events:all; fill:none}' +
		'.horizontal-drag-bar {cursor: col-resize; pointer-events:all; visibility:hidden}' +
		'.horizontal-drag-bar:hover {visibility:visible}' +
		'.drag_frame {stroke: yellow; stroke-width: 10px; fill:none; opacity:0.5}';
	svgFrame.appendChild(svgCSS);
	return svgFrame;
})();


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
	vDragLine = document.createElementNS(svgns, 'rect'),
	uDragLine = document.createElementNS(svgns, 'rect');


truPos.setAttribute('fill', '#D00');
falNeg.setAttribute('fill', '#F99');
falPos.setAttribute('fill', '#070');
truNeg.setAttribute('fill', '#BFB');


var multiplier = width/100,
	sU = U*multiplier,
	sV = V*multiplier,
	sR = R*multiplier;

var barWidth = 10;

function plotConPos() {
	var topLimit = width - sV;

	setAttributes(vDragLine, {
		'y': topLimit,
		'width': sR,
		'height': width
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
	var negWidth = width - sR;
	setAttributes(falPos, {
		'x': sR,
		'y': sU,
		'height': width - sU,
		'width': negWidth
	});

	setAttributes(uDragBar, {
		'x': sR,
		'y': width + sU - barWidth/2,
		'height': barWidth,
		'width': negWidth
	});

	setAttributes(truNeg, {
		'x': sR,
		'y': width,
		'height': sU,
		'width': negWidth
	});

	setAttributes(uDragLine, {
		'x': sR,
		'y': sU,
		'width': negWidth,
		'height': width
	});
}

plotConPos();
plotConNeg();
plotRDragBar();

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

[uDragLine,vDragLine].forEach(function(e) {
	setAttributes(e, {
		'class': 'drag_frame',
		'visibility': 'hidden'
	});
});


var startY = 0, startHeight = 0, target;
// vDragBar.onmousedown = initVerticalResize;
// uDragBar.onmousedown = initVerticalResize;

function initVerticalResize(e) {
	target = e.target.getAttribute('id');
	startY = e.clientY;
	startHeight = (target === 'v-drag') ? sV : sU;
	window.addEventListener('mousemove', doVerticalResize, false);
	window.addEventListener('mouseup', stopResize, false);
	
	e.target.removeEventListener('mouseleave', unfocusFrame);
}

function doVerticalResize(e) {
	// var targetID = target.getAttribute('id');
	var down = target === 'u-drag' ? 1 : -1,
		cursorDistance = down*(e.clientY - startY),
		newHeight = Math.min(Math.max(startHeight + cursorDistance, 0), width);
	// console.log('cursorD: ' +cursorDistance + ', startHeight: ' +startHeight);
	if (target === 'v-drag') {
		sV = newHeight;
		plotConPos();
	} else {
		sU = newHeight;
		plotConNeg();
	}
	plotRDragBar();
}

function unfocusFrame(e) {
	e.target.parentElement.firstChild.setAttribute('visibility','hidden');
}

[uDragBar, vDragBar].forEach(function(element) {
	element.addEventListener('mouseover', function() {
		element.parentElement.firstChild.setAttribute('visibility','visible');
	}, false);
	element.addEventListener('mouseleave', unfocusFrame , false);
	element.addEventListener('mousedown', initVerticalResize, false);
});

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
	var targetElement = document.getElementById(target);
	targetElement.addEventListener('mouseleave', unfocusFrame, false);
	if (targetElement.parentElement.querySelector(':hover') !== targetElement) {
		targetElement.parentElement.firstChild.setAttribute('visibility','hidden');
	}
}

(function() {
	var vDrag = document.createElementNS(svgns, 'g'),
		uDrag = document.createElementNS(svgns, 'g');
	[vDragLine, vDragBar].forEach(function(e) {
		vDrag.appendChild(e);
	});

	[uDragLine, uDragBar].forEach(function(e) {
		uDrag.appendChild(e);
	});

	[truPos, falPos, truNeg, falNeg,
		vDrag, uDrag, rDragBar].forEach(function(e) {
	svg.appendChild(e);
	});
})();
document.body.appendChild(svgFrame);

