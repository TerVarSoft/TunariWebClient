'use strict';

/**
 * @ngdoc directive
 * @name clientApp.directive:prodQuantityChart
 * @description
 * # prodQuantity
 */
angular.module('tunariApp')
  .directive('productQuantityChart', ["ProductInfo", function (ProductInfo) {

  	var margin = {top: 70, right: 10, bottom: 100, left: 60};
		var	height = height = 400 - margin.top - margin.bottom;
		var spaceBetweenBars = 10;	

    return {
      restrict: 'E',
      scope: {
      	titleText: '=',
  	    data: '=',
  	    barsColor: '='
      },
      link: function postLink(scope, element, attrs) {
      		
  			var width = $("#chart").width() - margin.left - margin.right;

			$(window).resize(function() {
				var newWidth = $("#chart").width() - margin.left - margin.right;
				if(newWidth>0 && width!= newWidth){
			  		width = newWidth;					
			  		repaint(scope.data); 
				}				
			});

			var vis = d3.select(element[0])
                .append("svg")
                .attr("class", "svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
   			
                
            scope.$watch('data', function (newVal, oldVal) {     
            	repaint(newVal);    
            });

            var repaint = function(dataSet) {

				vis.selectAll('*').remove();

                if (!dataSet) {
                    return;
                }

				var dataLength = dataSet.length;
				var barWidth = width/dataLength;
				var maxValue = _.max(_.map(dataSet, 'quantity'));

                d3.select(element[0]).select("svg").attr("width", width + margin.left + margin.right);

                // Title
                vis.append("text")
			        .attr("x", (60))             
			        .attr("y", 0 - (margin.top / 2))
			        .attr("text-anchor", "middle")  
			        .style("font-size", "32px") 
			        .style("text-decoration", "underline")  
			        .text(scope.titleText);

	        	// Y Axis Label
			  	vis.append("text")
			      .attr("transform", "rotate(-90)")
			      .attr("y", - margin.left)
			      .attr("x", - (height/2))
			      .attr("dy", "1em")
			      .style("font-size", "15px") 
			      .style("text-anchor", "middle")
			      .text("Cantidad en el Depósito");

		        // Axis
                var xScale = d3.scale.ordinal()
                	.domain(dataSet.map(function(d) { return d.name; }))
				    .rangeBands([0, width]);

				var yScale = d3.scale.linear()
				    .domain([0, maxValue])
				    .range([height, 0]);

			    var xAxis = d3.svg.axis()
				    .scale(xScale)
				    .orient("bottom")
				    .innerTickSize(-height)
				    .tickPadding(10);
				
				var yAxis = d3.svg.axis()
				    .scale(yScale)
				    .orient("left")
				    .innerTickSize(-width)
				    .tickPadding(10);

			    vis.append("g")
					.attr("class", "x axis")					
					.attr("transform", "translate(0," + height + ")")
					.call(xAxis)
						.selectAll("text")  
					     .style("text-anchor", "end")
					     .attr("dx", "-.8em")
					     .attr("dy", ".15em")
					     .attr("transform", "rotate(-65)");

				vis.append("g")
					.attr("class", "y axis")
					.call(yAxis);

				// Real Quantities at the top of the bars
			    vis.selectAll("text.bar")
				  .data(dataSet)
				  .enter().append("text")
				  .attr("class", "bar")
				  .attr("text-anchor", "middle")
				  .attr("x", function(d) { return xScale(d.name) + (width/dataLength)/2 })
				  .attr("y", height-5)
				  .text(function(d) { return d.quantity; })
				  .transition()
				  .delay(function(d, i) { return i * 100; })
				  .attr("y", function(d){return yScale(d.quantity) - 10});	
				  	
			    // Tooltips
			    // Different position for the first bar because it is 
			    // not displayed nice in small screens
                var tip = d3.tip()
				  .attr('class', 'card tooltip')
				  .offset(function(d,i) {
					  if(i == 0 && dataSet.length>1) return [0, 0]
					  return [0, -40]
				     })
				  .direction('w')
				  tip.direction(function(d,i) {
					  if(i == 0 && dataSet.length>1) return 'e'
					  return 'w'
				     }
				  )
				  .html(function(d) {
						var productImg = ProductInfo.getProductImageUrl(d, "-L");
						return 	"<div class='card-image'>" +
												"<img class='tooltip-img' src='" + productImg + "'>" +
										"</div>" +
										"<div clas='card-content'>" +
												"<p class='truncate card-title grey-text text-darken-4'>" + d.name + "</p>" +
												"<p>" + d.quantity + " Unidades</p>" +
										"</div>";
				  });

				vis.call(tip);  
				
                // Bars
                var bars = vis.selectAll("g.bar")
	                .data(dataSet)
	                .enter().append("g")
	                .style("fill", scope.barsColor)
	                .style("fill-opacity", 0.7)
	                .style("stroke","black")
	                .style("stroke-width", 3)
	                .attr("class", "bar")
	                .attr("transform", function(d, i) {
	                    return "translate(" + (i * barWidth + spaceBetweenBars/2) + ",0)";
	                })
	                .on('mouseover', tip.show)
      				.on('mouseout', tip.hide);

                bars.append("rect")
	                .attr("width", barWidth - spaceBetweenBars)
	                .attr("x", 0)
	                .attr("y", height)
	                .attr("rx", 5)
	                .attr("height", 0)
	                .transition()
	                .delay(function(d, i) { return i * 100; })
	                .attr("y", function(d){return yScale(d.quantity)})
	                .attr("height", function(d){return d.quantity*height/maxValue});
            } //resize
      } // link  
    }; // return
}]); //directive
