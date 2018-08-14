import sys

from pymongo import MongoClient
import json
from watson_developer_cloud import NaturalLanguageUnderstandingV1
from watson_developer_cloud.natural_language_understanding_v1 \
    import Features, KeywordsOptions, CategoriesOptions, ConceptsOptions, EntitiesOptions

outputFile = sys.argv[1]
featureType = sys.argv[2]
scoreThreshold = .5                                 # determine relevance of word
relevanceThreshold = .6                             # determine relevance of category

# credentials to access API
natural_language_understanding = NaturalLanguageUnderstandingV1(
    username="63a8e859-3e1a-49b9-87e9-49da3f47c68e",
    password="oQWwNPacKhRD",
    version="2018-03-16"
)


def getKeywords(data):                              # get keywords from data
    response = natural_language_understanding.analyze(
        text=data,
        features=Features(
            keywords=KeywordsOptions(
                sentiment=False,
                emotion=False)
        )
    )

    keywords = []
    for keyword in response['keywords']:            # add keywords to array if they are relevant
        if keyword['relevance'] > relevanceThreshold:
            keywords.append(keyword['text'])

    categories = dict()
    for key in keywords:                            # loop through keywords and get categories of each keyword
        category = natural_language_understanding.analyze(
            text=key,
            features=Features(
                categories=CategoriesOptions()
            ),
            language='en'
        )


        cat = category['categories']                # categories of k

        cats = []
        for c in cat:
            if c['score'] > scoreThreshold:
                cats.append(c['label'])             # get label of categories and add to array of categories if
                                                    # category is relevant

        categories[key] = cats                      # pair the categories with the current keyword

    return categories

def getConcepts(data):                              # get concepts from data
    response = natural_language_understanding.analyze(
        text=data,
        features=Features(
            concepts=ConceptsOptions()
        )
    )
    concepts = []
    for concept in response['concepts']:            # add concept to array if they are relevant
        if concept['relevance'] > .5:
            concepts.append(concept['text'])

    categories = dict()
    for con in concepts:                            # loop through categories and get categories of each concept
        category = natural_language_understanding.analyze(
            text=con,
            features=Features(
                categories=CategoriesOptions()
            ),
            language='en'
        )

        cat = category['categories']                # categories of current concept

        cats = []
        for c in cat:
            if c['score'] > scoreThreshold:
                cats.append(c['label'])             # get label of categories and add to array of categories if
                                                    # category is relevant

        categories[con] = cats                      # pair the categories with the current concept

    return categories

def getEntities(data):                              # get entities from data
    response = natural_language_understanding.analyze(
        text=data,
        features=Features(
            entities=EntitiesOptions()
        )
    )

    entities = dict()
    for entity in response['entities']:             # create dict of entities
        if entity['relevance'] > relevanceThreshold:

            types = []                              # types = list that contains the type, subtypes, and categories of the entity
            types.append(entity['type'])
            name = entity['text']                   # set key of entities dict to text

            category = natural_language_understanding.analyze(
                text=name,
                features=Features(
                    categories=CategoriesOptions()
                ),
                language='en'
            )
            cat = category['categories']

            if entity.get('disambiguation') is not None:            # check if the entity has a disambiguation value
                for s in (entity['disambiguation'])['subtype']:     # add subtypes to types list
                    types.append(s)

            cats = []
            for c in cat:
                if c['score'] > scoreThreshold:
                    cats.append(c['label'])                         # get label of categories

            for t in cats:
                types.append(t)
            entities[name] = types                                  # set values to types list
    categories = entities
    return categories

def feature(data):
    results = dict()
    if featureType == "keywords":
        results = getKeywords(data)

    elif featureType == "concepts":
        results = getConcepts(data)

    elif featureType == "entities":
        results = getEntities(data)

    elif featureType == 'both':                     #combine both keywords and entities into one data structure
        results = getKeywords(data)
        entityResults = getEntities(data)

        for name,types in entityResults.items():
            if results.get(name) is None:
                results[name] = types
            else:
                for t in types:
                    results[name].append(t)
    return results

# client = MongoClient('mongodb://128.113.21.81:27017')
# db = client.SurvivalOnMoon
# speech = db.speech
# text = ''
#
# for s in speech.find():
#     text += s['text']


# read in text file
with open('transcript_text.txt', 'r') as myfile:
    text=myfile.read()
    myfile.close()

results = feature(text)                     # run NLU API and find features of text

out_file = open("output.json", 'w')         # open file to write in


vis_json = {}
vis_json['name'] = 'hierarchy'
vis_json['children'] = []

final_json = {}
final_json["name"] = "hierarchy"
final_json["children"] = []

#parse results by getting rid of '/'and creating list out of each category and its subcategories
def parse_categories(s):
    if s[0] == '/':
        data = s.split("/")
        data = data[1:]
    else:
        data= s.split("/")
    return data

# add 'name' and 'children' to each word and its respective category/subcategory
# create hierarchy
def add_tags(d):
    for key in d:
        temp_json = {}
        temp_json["keyword"] = key
        temp_json["categories"] = []
        for cat in d[key]:
            cat_data = parse_categories(cat)
            temp_json["categories"].append(cat_data)
        vis_json["children"].append(temp_json)

# convert vis_json into appropriate json code for front-end to read
def convert_json(d):
    # loop through all of the keywords
    for key in d["children"]:
        for cat in key["categories"]:
            # case in which key has no categories
            if key["categories"] == []:
                obj = {
                    "name": key["keyword"],
                    "size": 1,
                    "ids": []
                }
                final_json["children"].append(obj)
            else:
                con_json = {}
                con_json["name"] = cat[0]
                con_json["children"] = []
                if len(cat) == 1:
                    obj = {
                        "name": key["keyword"],
                        "size": 1,
                        "ids": []
                    }
                    # adds new object to children the appends
                    # to the overall visualization json
                    con_json["children"].append(obj)
                    final_json["children"].append(con_json)
                else:
                    temp_json = {}
                    multi_level(temp_json, key, cat, 0)
                    # append to vis_json
                    final_json["children"].append(temp_json)
    out_file.write(json.dumps(final_json, indent=2))


# create hierarchy for keys with more than one category/subcategory
def multi_level(json, key, cats, i):
    json["name"] = cats[i]
    json["children"] = []
    if i < len(cats) - 1:
        tmp = {}
        json["children"].append(tmp)
    if i == len(cats) - 1:
        obj = {
                "name": key["keyword"],
                "size": 1,
                "ids": []
            }
        json["children"].append(obj)
        exit
    else:
        multi_level(tmp, key, cats, i+1)

add_tags(results)
convert_json(vis_json)

