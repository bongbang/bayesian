var margin_value = 0;
var margin = {top: 20, right: 30, bottom: 20, left: 70},
    width = 300,
    height = width*2;

var V =	92.5, // Sensitivity
  U = 98.6, // Specificity
  R = 0.65,
  R_young = 1.87,
  R_black = 10.49;

var frames = [
  {V:50, U:50, R:0},
  {V:50, U:50, R:R},
  {V:V, U:50, R:R},
  {V:V, U:U, R:R},
  {V:V, U:U, R:R_young},
  {V:V, U:U, R:R_black},
];

// 1.87%
// 0.65%

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

	rLabel = svg.append('text'),
  vLabel = svg.append('text');

svg.selectAll('rect').attr('fill','#CCC');

function plot(i) {
  var frame = frames[i],
		sU = scale(frame.U),
		sV = scale(frame.V),
		sR = scale(frame.R),

		posNoTestColor = '#000',
		negNoTestColor = '#CCC',
		conPosNoTest = [1],
		conNegNoTest = [0,1,2]
			
		myDuration = 2000;

	// d3.selectAll('svg').transition().duration(10000);

	function labelClass (hideFrames, strongFrames) {
		if (hideFrames.indexOf(i) >= 0) {
			return 'hide';
		} else if (strongFrames.indexOf(i) >= 0) {
			return 'emphasized';
		} else {
			return null;
		}
	}

  truPos.transition().duration(myDuration)
    .attr('y', width - sV)
    .attr('height', sV)
    .attr('width', sR)
    // .attr('fill', i ? '#C00': negNoTestColor);
    .attr('fill', conPosNoTest.indexOf(i) + 1 ? posNoTestColor:'#C00');

  falNeg.transition().duration(myDuration)
    .attr('y', width)
    .attr('height', width - sV)
    .attr('width', sR)
    // .attr('fill', i ? '#FAA': negNoTestColor);
    .attr('fill', conPosNoTest.indexOf(i) + 1 ? posNoTestColor:'#FAA');

  falPos.transition().duration(myDuration)
    .attr('x', sR)
    .attr('y', sU)
    .attr('height', width - sU)
    .attr('width', width - sR)
    .attr('fill', conNegNoTest.indexOf(i) + 1 ? negNoTestColor:'#060');

  truNeg.transition().duration(myDuration)
    .attr('x', sR)
    .attr('y', width)
    .attr('height', sU)
    .attr('width', width - sR)
    .attr('fill',  conNegNoTest.indexOf(i) + 1 ? negNoTestColor:'#AFA');

	// function runNumber(start, end, decimal) {
	// 	d3.select(this).tween('text', function() {
	// 		var n = d3.interpolateNumber(start, end);
	// 		return function(t) {d3.select(this).text(n(t).toFixed(decimal)+'%');};
	function runNumber(start, end, decimal) {
		return function() {
			var n = d3.interpolateNumber(start, end);
			return function(t) {d3.select(this).text(n(t).toFixed(decimal)+'%');};
		};
	}
	// 	});
	// }
	
  rLabel.transition().duration(myDuration)
    .attr('x', sR/2)
    .attr('y', width - sV - 5)
    .attr('text-anchor', 'middle')
    // .attr('class', function() {
    //   if (i === 0) return 'hide';
    //   else if (i === 1) return 'emphasized';
    //   else return null;
    // })
		.attr('class', labelClass([0],[1,4,5]))
    .text(frames[i].R.toPrecision(2)+'%');

  vLabel.transition().duration(myDuration)
		.attr('y', width - sV/2) .attr('x', -10)
		.attr('text-anchor', 'end')
		.attr('class', labelClass([0,1],[2]))
		.tween('text', runNumber(0, frames[i].V, 1));
	//
		// .call(runNumber(0, frames[i].V, 1))
		// .tween('text', runNumber(0, frames[i].V, 1));
		//
		// below works
		// .tween('text', function() {
		// 	var n = d3.interpolateNumber(0, frames[i].V);
		// 	return function(t) {d3.select(this).text(n(t).toFixed(1)+'%');};
		// });
}

plot(0);
//
// ===== old
var i = 0;
d3.selectAll("div button").data([-1, 1]).on('click', function(d) {
  i = i+d;
  if (i >= frames.length) {i = 0}
  else if (i < 0) {i = frames.length-1}
  plot(i);
});
