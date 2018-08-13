# recording_meetings_visualization
To run watson_entity_extraction.py: first run this line of code in your terminal: pip install --upgrade watson-developer-cloud
To add functionality to read from MongoDB: pip install pymongo
then run: python watson_entity_extraction.py output.json keywords/entities/both (whichever feature you want to find)
output will appear in output.json

To run bubble.html: start a local server (needed to use AJAX) -- change this line
      http_request.open('GET', 'output.json', true);
Change: output.json to whatever JSON file to read from


Link for circle packing: https://bl.ocks.org/mbostock/7607535
