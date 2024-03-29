$(function () {
		
		var margin = {top: 20, right: 20, bottom: 30, left: 40},
		width = 960 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;
		
		

		
		var graphData = function (data) {
			 
			$("#graph_container").empty();
			
			// setup x 
			var xValue = function(d) { return d.time;}, // data -> value
			xScale = d3.scale.linear().range([0, width]), // value -> display
			xMap = function(d) { return xScale(xValue(d));}, // data -> display
			xAxis = d3.svg.axis().scale(xScale).orient("bottom");
			
			// setup y
			var yValue = function(d) { return d.rating;}, // data -> value
			yScale = d3.scale.linear().range([height, 0]), // value -> display
			yMap = function(d) { return yScale(yValue(d));}, // data -> display
			yAxis = d3.svg.axis().scale(yScale).orient("left");
			
			// setup fill color
			//var cValue = function(d) { return d.Manufacturer;},
			//color = d3.scale.category10();
			
			// add the graph canvas to the body of the webpage
			var svg = d3.select("#graph_container").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
			
			// add the tooltip area to the webpage
			//var tooltip = d3.select("body").append("div")
			//.attr("class", "tooltip")
			//.style("opacity", 0);
			
			// load data
			//d3.csv("cereal.csv", function(error, data) {
			
			// change string (from CSV) into number format
			//data.forEach(function(d) {
			//d.Calories = +d.Calories;
			//d["Protein (g)"] = +d["Protein (g)"];
			//    console.log(d);
			//});
			
			// don't want dots overlapping axis, so add in buffer to data domain
			xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
			yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);
			
			// x-axis
			svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis)
			.append("text")
			.attr("class", "label")
			.attr("x", width)
			.attr("y", -6)
			.style("text-anchor", "end")
			.text("Loan amount");
			
			// y-axis
			svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)
			.append("text")
			.attr("class", "label")
			.attr("transform", "rotate(-90)")
			.attr("y", 6)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text("Interest Rate");
			
			// draw dots
			svg.selectAll(".dot")
			.data(data)
			.enter().append("circle")
			.attr("class", "dot")
			.attr("r", 3.5)
			.attr("cx", xMap)
			.attr("cy", yMap);
			//.style("fill", function(d) { return color(cValue(d));}) 
			
			// draw legend
		};
		

		var graphTable = function (data) {
			 
		$("#table_container").empty();
		$("#table_container").append("hello");
		};
		
	var productstuff = function (data) {
		$("#prod-des").empty();	
	    $("#prod-des").append("Recommendation: ")
		$("#prod-des").append(data['recommendation'] + "<br>")
	    $("#prod-des").append("Prediction: ")
		$("#prod-des").append(data['prediction'] + "<br>")
	    $("#prod-des").append("Default probability: ")
		$("#prod-des").append(data['probability'] + "<br>")
	};
	
	var factorstuff = function (data) {
		$("#factor-des").empty();
	    $("#factor-des").append("Factors: <br>")
	    $("#factor-des").append("Interest: ")
		$("#factor-des").append(data['interest'] + " %" + "<br>")
	    $("#factor-des").append("Sift score: ")
		$("#factor-des").append(data['sift_score'] + "<br>")
	    $("#factor-des").append("Length of tr_about: ")
		$("#factor-des").append(data['tr_about'] + "<br>")
	};

	var loaninfostuff = function (data) {
		$("#loaninfo-des").empty();	
	    $("#loaninfo-des").append("Additional loan info: <br>")
	    $("#loaninfo-des").append("Borrower Id: ")
	    $("#loaninfo-des").append("Reason for loan: ")
	    $("#loaninfo-des").append("Etc: ")
	    //$("#loaninfo-des").append("Length of loan: ")
		//$("#loaninfo-des").append("???")
	};
	

	var imagestuff = function() {
		$("#image-des").empty();	
		path = "static/images/foo.jpg";
		$('<img id="theImg"  src="'+ path + '"/>').load(function() {
      $(this).appendTo("#image-des");
    });	
	};
		
		$("#fetch_product_button").click(function() {
			var product = $("#product").val();
			d3.json("/product/json/"+product, function(error, data) { 
				productstuff(data);
				factorstuff(data);
				imagestuff();
				loaninfostuff(data);
				//graphTable(data);
				//graphData(data.reviews);
			}); 
		});
});