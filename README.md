# recording_meetings_visualization
To run watson_entity_extraction.py: first run this line of code in your terminal: pip install --upgrade watson-developer-cloud
To add functionality to read from MongoDB: pip install pymongo
then run: python watson_entity_extraction.py output.json keywords/entities/both (whichever feature you want to find)
output will appear in output.json

To run bubble.html: start a local server (needed to use AJAX) -- change this line
      http_request.open('GET', 'output.json', true);
Change: output.json to whatever JSON file to read from


Link for circle packing: https://bl.ocks.org/mbostock/7607535

Description: 
The bubble hierarchy is implemented for the visual analysis of meetings. Based off of what is said during the meeting, the Natural Language Understanding API creates keywords and categorizes them. From the grouping of similar words along with the bubble size representing the number of times an idea is mentioned, a hierarchy can be created, which can then show how often a topic comes up during the meeting and the relationships between various ideas in the meeting.
