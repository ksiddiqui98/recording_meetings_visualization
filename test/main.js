var ourRequest = new XMLHttpRequest();
ourRequest.open('GET', 'people.json')
ourRequest.onload = function(){
	var people=JSON.parse(ourRequest.responseText);
	
	var BIG_radius = Math.floor((people.length/8)+1)*100

	var unit =2*Math.PI/people.length

	var center_svg=4*BIG_radius/2

	var svg = d3.select("body").append("svg")
	  .attr("width", 4*BIG_radius)
	  .attr("height", 4*BIG_radius);

	console.log("width of svg", 4*BIG_radius)
	console.log("radius of inner circle", BIG_radius)

	var every_circle = []; //id, cx, cy, radius, color, stroke color,stroke size

	for (i=0; i<people.length; i++){
	  
	  every_circle.push([people[i],BIG_radius*Math.cos(unit*i)+center_svg,
						 BIG_radius*Math.sin(unit*i)+center_svg,20])
	}
	for (i=0; i<people.length; i++){
	console.log(every_circle[i]);
	}
	//create function to regraph
	//for loop for constant graphing
	//learn to take in json info
	//learn format for json file

	function regraph_it(){
	  d3.selectAll("svg > *").remove()
	  for (i=0; i<people.length; i++){
		  d3.select("svg").append("circle")
		.attr("cx",BIG_radius*Math.cos(unit*i)+center_svg)
		.attr("cy",BIG_radius*Math.sin(unit*i)+center_svg)
		.attr("r",20);
	  }
	}

	regraph_it()
};
ourRequest.send();