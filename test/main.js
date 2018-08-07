var ourRequest = new XMLHttpRequest();
ourRequest.open('GET','cool-file.js' )
ourRequest.onload = function(){
var test_data = JSON.parse(ourRequest.responseText);

// arbitrarily sets width, height, and diameter


////////// TODO: Concrete method to read in data

//////////////////////////////////////////////////////////////////////////
// test_data
// Assumption the data is sorted in time! That is, ID 0 happens before ID 1 and so on

// var test_data = [
// {users:["0","1","2","3","4","5"], speech:"this is a test",time:2,userID:0},
// {users:["0","1","2","3","4","5"], speech:"This is a test but this needs to be something long",time:5,userID:1},
// {users:["0","1","2","3","4","5"], speech:"The test string is a good thing to use for development",time:6,userID:2},
// {users:["0","1","2","3","4","5"], speech:"A complex sentence is a sentence that contains an independent clause and one or more dependent clauses. An independent clause can stand alone as a sentence, but a dependent clause even though it has a subject and a verb cannot stand alone.",time:10,userID:1},
// {users:["0","1","2","3","4","5"], speech:"JavaScript also defines two trivial data types, null and undefined, each of which defines only a single value. In addition to these primitive data types, JavaScript supports a composite data type known as object. We will cover objects in detail in a separate chapter. Note − JavaScript does not make a distinction between integer values and floating-point values. All numbers in JavaScript are represented as floating-point values. JavaScript represents numbers using the 64-bit floating-point format defined by the IEEE 754 standard.",time:15,userID:1},
// {users:["0","1","2","3","4","5"], speech:"Now, imagine the challenge for Facebook. Facebook deals with enormous amount of text data on a daily basis in the form of status updates, comments etc. And it is all the more important for Facebook to utilise this text data to ",time:4,userID:3},
// {users:["0","1","2","3","4","5"], speech:"This library has gained a lot of traction in the NLP community and is a possible substitution to the gensim ",time:2,userID:4},
// {users:["0","1","2","3","4","5"], speech:"low magnitude. But FastText can produce vectors better than random by breaking the above word in chunks and using the vectors for those chunks to create a final vector for the word. In this particular",time:3,userID:5},
// {users:["0","1","2","3","4","5"], speech:"Words in their natural form cannot be used for any Machine Learning task in general. One way to use the words is to transform these words into some representations that capture some attributes of the word. It is analogous",time:3,userID:5}
// ];        
//////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////
/// TODO: (Not applicable to live data) After reading in data from various files, incorporate in all files into a single variable with all correlated speech and corresponding user ID's (including labeling which user says what and assigning a user id for every user and collecting it all into a variable as seen above), will depend on how we read the data, person by person? that is data comes in one person at a time? or multiple entries of people?

// For now assuming implementing for one person at a time, that is, records of two people kept, the one who is speaking and the one who was previously speaking. The number of people is assumed to be known. The other data like the times someone spoke is accumulated though.

// NOTE: Assuming no new users suddenly join in, focusing on getting a simple functionality working

var width = 770;
var height = 940;
var diameter = 760;
// controls the number of nodes
// will read from Json file
var numParticipants = 6;
var participantSpeak = [];
var participantTime = [];
var y = 0;
for(y = 0; y < numParticipants;y++ )
{
participantTime[y] = 0;
}
var default_scale = d3.scaleQuantize().domain([0, 20]).range(['white', 'blue']);
var timeSpoken = test_data.map(tra => tra.time);
var time_acc = timeSpoken.slice();    
for(ui = 1; ui < timeSpoken.length; ui++) {time_acc[ui] = time_acc[ui-1] + time_acc[ui]};      //
var UID = test_data.map(tra => tra.userID);

var contsignal = true;

var currentSpeaker = [];
var previousSpeaker = [];

// Although we can determine the number of times someone spoke from the test data we have, we are assuming that we will be using live data in the end, hence also assuming that we don't have that information at this point

// var common_scale = d3.scaleQuantize().domain([0, 50]).range(['white','blue']);
var k, i;
for(k = 0; k < numParticipants; k++){
participantSpeak[k] = 0;
}
// array of circles
var circleData = [];
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
var itr = 0;
var alpha = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
//http://bl.ocks.org/jfreyre/b1882159636cc9e1283a
var colors = d3.scaleLinear().domain([1,50])
.interpolate(d3.interpolateHcl)
.range([d3.rgb("#FFFFFF"), d3.rgb('#191970')])
// controls radius of circle the nodes are around
var radius = 150;
// creates container that the nodes are in with specific attributes
var svgContainer = d3.select("body")
.append("svg")
.attr("width", 750)
.attr("height", 750)
.style("border", "1px solid black");
initial_draw(svgContainer,numParticipants,circleData);

//   var timeline = d3.sliderHorizontal()
//     .min(0)
//     .max(parseInt(timeSpoken.reduce(reduction)))
//     .step(1)
//     .width(300)
//     .on('onchange', slider_value => {
//       d3.select("p#time_value").text(slider_value);
//     });
//   var g = d3.select("div#time_line").append("svg")
//     .attr("width", 500)
//     .attr("height", 100)
//     .append("g")
//     .attr("transform", "translate(10,10)");
//   g.call(timeline);


//currently(0,timeSpoken[0],100,parseInt(circleData[0].attr("r")));
// currently(i,timesec,ret,rad); 
// start infinite loop here to update display over and over again
var pad = 3;        // to display properly

setTimeout(function() { do_curr(0);},0) 
setTimeout(function() { do_curr(1);},(time_acc[0] + pad)*1000) 
setTimeout(function() { do_curr(2);},(time_acc[1] + 2*pad)*1000) 
setTimeout(function() { do_curr(3);},(time_acc[2] + 3*pad)*1000) 
setTimeout(function() { do_curr(4);},(time_acc[3] + 4*pad)*1000) 
setTimeout(function() { do_curr(5);},(time_acc[4] + 5*pad)*1000) 
setTimeout(function() { do_curr(6);},(time_acc[5] + 6*pad)*1000) 
setTimeout(function() { do_curr(7);},(time_acc[6] + 7*pad)*1000) 
setTimeout(function() { do_curr(8);},(time_acc[7] + 8*pad)*1000)
console.log(100);
previously_remove();

svgContainer.select("#rect_box").remove();
svgContainer.select("#text_box").remove(); 


//       var varlar = false;
//       var prevdata,currdata;
//       var im = 0;
//       for(im = 0; im < test_data.length; im++)
//         {
//       setTimeout(function() { do_curr(im);},timeSpoken[im]*1000)  

//         }


//           function keydownHandler(e) {
//     }
// }

function do_curr(im)
{

var H = UID[im];
currently(H,timeSpoken[im],100,parseInt(circleData[H].attr("r")));

if(im != 0) // on the first iteration, do not display previous speaker
{
var K = UID[im-1];
previously_remove();
previously(circleData[K].attr("cx"),circleData[K].attr("cy"),K);
}
if(im >= 2)
{
var KL = UID[im-2];
console.log(KL);
circleData[KL].style("stroke", "black").style("stroke-width", "1px");
}

}

function initial_draw(svgContainer,numParticipants,circleData)
{

// loops through for each participant and creates a node
// and evenly spaces the nodes around the circle
// in the future will use location data from Json to place people (Will need to generate relative coordinates in 2D unless the visualization is done in 3D)
// also need to attach ID to each node

for(i = 0; i < numParticipants; i++) 
{
// formula from here http://bl.ocks.org/bycoffe/3404776
var angle = 0;
var x = 0;
var x_1 = [];
var y = 0;
var y_1 = [];
angle = (i / (numParticipants/2)) * Math.PI;
x = (radius * Math.cos(angle)) + (width/2);
y = (radius * Math.sin(angle)) + (width/2);
x_1.push( ((radius+8) * Math.cos(angle)) + (width/2) );
y_1.push( ((radius+8) * Math.sin(angle)) + (width/2) );
var circle = svgContainer.append("circle")
.attr("cx", x)
.attr("cy", y)
.attr("r", 25)
.attr("id", i)
.style("stroke", "black")
.style("fill",colors(0))
.style("padding", 2)
.on("mouseover", function(d, id) {
return tooltip.text("Times Spoken: " + parseInt(participantSpeak[id]) + " Total Time: "  + parseInt(participantTime[i]))
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
return tooltip.text("Times Spoken: " + parseInt(participantSpeak[id]) + " Total Time: " + parseInt(participantTime[i]))
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
}

// function will be passed the id of the person currently speaking
// and highlight them

function currently(i,timesec,ret,rad) {

participantSpeak[i]++;
participantTime[i]+= timesec;

circleData[i]
.style("stroke","red")
.style("stroke-width", "5px");

// increase one unit of radius every minute
// every second then increases 1/60th of a unit, slow progression
// assuming all individual conversation snippets do not exceed 15-20 seconds??
var newrad = (rad + 1*(ret*timesec/60) );
console.log(default_scale(participantSpeak[i]));

circleData[i].transition()
.style("fill",colors(participantTime[i]))
.attr("r",newrad)
.duration(timesec*1000)
.on("end",function() {
d3.select(this)
.transition()
.style("stroke-width",null)
.style("stroke","black");
});

// display previously spoken text here?
}

// function will be passed the id of the person who
// just spoke and highlight them
// will also darken the color of the circle by 1 shade

// Anyone who may have spoken previously will have their transcript 
// displayed next to them in a text box

function previously(x_r,y_r,i) // ,sti) 
{
circleData[i].style("stroke", "lightpink")
.style("stroke-width", "5px");
// data[i].style("fill", colors[5]);

//        var ls = sti.length;
// TODO: After succesfully obtaining transcript data, get character count
// and determine width of the rectangle on basis of that
// Center text on rectangle

svgContainer.append("rect")
.attr("x", parseInt(x_r) + 30)
.attr("y", parseInt(y_r) + 30)
.attr("rx",10)
.attr("ry",10)
.attr("id","rect_box")
.attr("width", 100)
.attr("height", 30)
.attr("stroke","black")
.attr("fill","none")
.attr("id","rect_box")
.attr("border", "1px solid black");


svgContainer.append("text")
.attr("x",parseInt(x_r) + 35)
.attr("y",parseInt(y_r) + 50)
.attr("id","text_box")
.text(test_data[i].speech);



}

// Remove the text box for use with other transcript elements 
function previously_remove()
{
svgContainer.select("#rect_box").remove();
svgContainer.select("#text_box").remove();    
}
// function will be passed the amount of time someone spoke in seconds
// and change the size of the node proportionally to the amount
// of time
// function will also be passed id of person who spoke


function emp()
{
console.log("setTimeout()");
}

function reduction(val,ele)
{return val+ele;}

}
ourRequest.send();