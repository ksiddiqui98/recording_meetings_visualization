var pageCounter = 1;
var btn = document.getElementById("btn");

btn.addEventListener("click", function() {
  var ourRequest = new XMLHttpRequest();
  ourRequest.open('GET', 'js' + pageCounter + '.json');
  ourRequest.onload = function() {
    
    try {
        d3.selectALL("svg >*").remove();
    } catch (error) {};


    var RAWJSON_INFO = JSON.parse(ourRequest.responseText);
    console.log("js"+pageCounter)
    var numParticipants=RAWJSON_INFO[0].users.length;
    console.log(numParticipants);


    var participantSpeak = []; //number of times spoken
    var participantTimeOriginal = [];


    for(var i0=0;i0<RAWJSON_INFO.length;i0++){
        try{
            d3.selectALL("svg >*").remove();
        } catch(err){};
        for(var j=0; j<RAWJSON_INFO[0].users.length;j++){
        participantSpeak.push({key: RAWJSON_INFO[0].users[j], value: 0});
        participantTimeOriginal.push({key: RAWJSON_INFO[0].users[j], value: 0});
        }


        participantSpeak.userID++;

        try{
            participantTimeOriginal.userID+=RAWJSON_INFO[i0].time;
        } catch{
            participantTimeOriginal.userID+=RAWJSON_INFO.time;
        }

        var last_spoke_time_length = RAWJSON_INFO[RAWJSON_INFO.length-1].time;
        var last_line_spoken = RAWJSON_INFO[RAWJSON_INFO.length-1].speech;




        var width = 770;
        var height = 940;
        var diameter = 760;
        // controls the number of nodes
        // will read from Json file
        var participantTimeChanging = [];

        var k
        for(k = 0; k < numParticipants; k++){
            participantSpeak[k] = 0;
            participantTimeOriginal[k] = 0;
            participantTimeChanging[k] = 0;
        }
        // array of circles
        var circleData = [];
        var angle = 0;
        var x = 0;
        var x_1 = [];
        var y = 0;
        var y_1 = [];
        var tooltip = d3.select("body")
                        .append("div")
                        .style("position", "absolute")
                        .style("z-index", "10")
                        .style("visibility", "hidden")
                        .style("color", "white")
                        .style("padding", "8px")
                        .style("background-color", "rgba(0, 0, 0, 0.50)")
                        .style("border-radius", "6px")
                        .style("font", "12px sans-serif")
                        .text("tooltip");
        
        var alpha = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
        //http://bl.ocks.org/jfreyre/b1882159636cc9e1283a
        var colors = d3.scale.linear().domain([1,50])
                            .interpolate(d3.interpolateHcl)
                            .range([d3.rgb("#FFFFFF"), d3.rgb('#191970')])
        // controls radius of circle the nodes are around
        var radius = 200;
        // creates container that the nodes are in with specific attributes
        var svgContainer = d3.select("body")
                            .append("svg")
                            .attr("width", 750)
                            .attr("height", 750)
                            .style("border", "1px solid black");
        // loops through for each participant and creates a node
        // and evenly spaces the nodes around the circle
        // in the future will use location data from Json to place people (Will need to generate relative coordinates in 2D unless the visualization is done in 3D)
        // also need to attach ID to each node
        for(var i = 0; i < numParticipants; i++) 
        {
            // formula from here http://bl.ocks.org/bycoffe/3404776
            angle = (i / (numParticipants/2)) * Math.PI;
            x = (radius * Math.cos(angle)) + (width/2);
            y = (radius * Math.sin(angle)) + (width/2);
            x_1.push( ((radius+8) * Math.cos(angle)) + (width/2) );
            y_1.push( ((radius+8) * Math.sin(angle)) + (width/2) );
            var circle = svgContainer.append("circle")
                                .attr("cx", x)
                                .attr("cy", y)
                                .attr("r", 25)
                                .attr("id", RAWJSON_INFO[0].users[i])
                                .style("stroke", "black")
                                .style("fill",colors(0))
                                .style("outline", "black")
                                .on("mouseover", function(d, id) {
                                    return tooltip.text("Times Spoken: " + parseInt(participantSpeak[id]) + " Total Time: "  + parseInt(participantTimeOriginal[id]) + " seconds")
                                                .style("visibility", "visible");
                                })
                                .on("mousemove", function() {
                                    return tooltip.style("top", (d3.event.pageY-10)+"px")
                                                .style("left",(d3.event.pageX+10)+"px");
                                })
                                .on("mouseout", function() {
                                    return tooltip.style("visibility", "hidden");
                                })
            
            circleData.push(circle);
            var id = parseInt(circleData[i].attr("id"));
            var text = svgContainer.append("text")
                                .attr("x", x)
                                .attr("y", y + 6)
                                .text(alpha[id])
                                .attr("font-family", "san-serif")
                                .attr("font-size", "20px")
                                .attr("fill", "black")
                                .attr("text-anchor", "middle")
                                .on("mouseover", function(d, id) {
                                    return tooltip.text("Times Spoken: " + parseInt(participantSpeak[id]) + " Total Time: " + parseInt(participantTimeOriginal[id]) + " seconds")
                                                .style("visibility", "visible");
                                })
                                .on("mousemove", function() {
                                    return tooltip.style("top", (d3.event.pageY-10)+"px")
                                                .style("left",(d3.event.pageX+10)+"px");
                                })
                                .on("mouseout", function() {
                                    return tooltip.style("visibility", "hidden");
                                })
        }
        // function  highlights circle, expands the radius,
        // changes the color, and shows the transcript
        // make sure to check for collisions
        // could check before expanding and scale down if needed
        // or increase size then check then scale down
        // args: svg container, x val if circle, y val of circle, id,
        // time spoke in seconds, and scaling factor
        // scaling factor currently arbitrarily 10
        function previously(svgC, x_r, y_r, ii, timsec, factor) {
            toString(ii);
            participantSpeak[ii]++;
            var temp= RAWJSON_INFO[0].users[ii];

            console.log(RAWJSON_INFO[0].users)
            console.log(ii)


            circleData[ii].style("fill", colors(participantSpeak.temp));
            // highlights circle with light pink ring to
            // incidate that the person had just spoken
            circleData[ii].style("stroke", "lightpink")
                        .style("stroke-width", "5px");
            // creates the rectangle that the text is shown in
            // TODO: make the size of the textbox dynamic and
            // make sure the text does not go outside of the svgContainer
            svgC.append("rect")
                .attr("x", parseInt(x_r[ii]) + 30 + (1*(factor*timsec/60)))
                .attr("y", parseInt(y_r[ii]) + 30 + (1*(factor*timsec/60)))
                .attr("rx",10)
                .attr("ry",10)
                .attr("id","rect_box")
                .attr("width", 100)
                .attr("height", 30)
                .attr("stroke","black")
                .attr("fill","none")
                .attr("id","rect_box")
                .attr("border", "1px solid black");
            participantTimeOriginal[ii] += timsec;
            var rad = parseInt(circleData[ii].attr("r"));
            // increases on eunit of radius every minute
            // every second then increases 1/60th of a unit
            circleData[ii].attr("r", (rad + 1*(factor*timsec/60)));
            // adds the text "in" the textbox
            svgC.append("text")
                .attr("x",parseInt(x_r[ii]) + 35 + (1*(factor*timsec/60)))
                .attr("y",parseInt(y_r[ii]) + 50 + (1*(factor*timsec/60)))
                .attr("id","text_box")
                .text("hello");
            // check for intersection and if two circles are intersecting
            // will resize so there is no intersection
            if(checkIntersecting()) {
                scaleDown(participantTimeOriginal, circleData, factor);
            }
        }
        // function removes the textbox and transcript
        // as well as the highlighted ring
        function removePrev(svgC, iii) {
            svgC.select("#rect_box").remove();
            svgC.select("#text_box").remove();
            data[iii].style("stroke", "black");
            data[iii].style("stroke-width", "1px");
        }
        function scaleDown(originalData,circles, fac) {
            var newData = [];
            var minData = d3.min(originalData);
            var maxData = d3.max(originalData);
            for(var iv = 0; iv < originalData.length; iv++) {
                newData[iv] = originalData[iv] * .5;
                circles[iv].attr("r", (25 + 1*(fac*newData[iv]/60)));
            }

            participantTimeChanging = newData;
        }
        // http://www.inkfood.com/collision-detection-with-svg/
        function checkIntersecting() {
            for(var i = 0; i < numParticipants; i++) {
                for(var j = 0; j < numParticipants; j++) {
                    if(i == j) { continue; }
                    var bounding1 = document.getElementById(i).getBoundingClientRect();
                    var bounding2 = document.getElementById(j).getBoundingClientRect();
                    if(!(bounding2.left > bounding1.right || 
                        bounding2.right < bounding1.left || 
                        bounding2.top > bounding1.bottom ||
                        bounding2.bottom < bounding1.top)) {
                        return true;
                    }
                }
            } 
            return false;
        }
    }
    
  };

  ourRequest.onerror = function() {
    console.log("Connection error");
  };

  ourRequest.send();
  pageCounter++;
  if (pageCounter > 9) {
    btn.classList.add("hide-me");
  }
});
