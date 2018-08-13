import sys

from pymongo import MongoClient
import json
from watson_developer_cloud import NaturalLanguageUnderstandingV1
from watson_developer_cloud.natural_language_understanding_v1 \
    import Features, KeywordsOptions, CategoriesOptions, ConceptsOptions, EntitiesOptions

outputFile = sys.argv[1]
featureType = sys.argv[2]
scoreThreshold = .5
relevanceThreshold = .6


natural_language_understanding = NaturalLanguageUnderstandingV1(
    username="63a8e859-3e1a-49b9-87e9-49da3f47c68e",
    password="oQWwNPacKhRD",
    version="2018-03-16"
)

def getKeywords(data):
    response = natural_language_understanding.analyze(
        text=data,
        features=Features(
            keywords=KeywordsOptions(
                sentiment=False,
                emotion=False)
        )
    )

    keywords = []
    for keyword in response['keywords']:  # create array of keywords
        if keyword['relevance'] > relevanceThreshold:
            keywords.append(keyword['text'])

    categories = dict()
    for key in keywords:
        category = natural_language_understanding.analyze(
            text=key,
            features=Features(
                categories=CategoriesOptions()
            ),
            language='en'
        )

        cat = category['categories']  # categories of k

        cats = []
        for c in cat:
            if c['score'] > scoreThreshold:
                cats.append(c['label'])  # get label of categories
        categories[key] = cats  # pair the categories with the current keyword

    return categories

def getConcepts(data):
    response = natural_language_understanding.analyze(
        text=data,
        features=Features(
            concepts=ConceptsOptions()
        )
    )
    concepts = []
    for concept in response['concepts']:  # create array of concepts
        if concept['relevance'] > .5:
            concepts.append(concept['text'])
    categories = dict()
    for con in concepts:
        category = natural_language_understanding.analyze(
            text=con,
            features=Features(
                categories=CategoriesOptions()
            ),
            language='en'
        )

        cat = category['categories']  # categories of current concept

        cats = []
        for c in cat:
            if c['score'] > scoreThreshold:
                cats.append(c['label'])  # get label of categories
        categories[con] = cats  # pair all of the categories to the current concept

    return categories

def getEntities(data):
    response = natural_language_understanding.analyze(
        text=data,
        features=Features(
            entities=EntitiesOptions()
        )
    )

    entities = dict()
    for entity in response['entities']:  # create dict of entities
        if entity['relevance'] > relevanceThreshold:

            types = []  # types = list that contains the type, subtypes, and categories of the entity
            types.append(entity['type'])
            name = entity['text']  # set key of entities dict to text

            category = natural_language_understanding.analyze(
                text=name,
                features=Features(
                    categories=CategoriesOptions()
                ),
                language='en'
            )
            cat = category['categories']

            if entity.get('disambiguation') is not None:  # check if the entity has a disambiguation value
                for s in (entity['disambiguation'])['subtype']:  # add subtypes to types list
                    types.append(s)

            cats = []
            for c in cat:
                if c['score'] > scoreThreshold:
                    cats.append(c['label'])  # get label of categories

            for t in cats:
                types.append(t)
            entities[name] = types  # set values to types list
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

    elif featureType == 'both':
        results = getKeywords(data)
        entityResults = getEntities(data)

        for name,types in entityResults.items():
            if results.get(name) is None:
                results[name] = types
            else:
                for t in types:
                    results[name].append(t)
    return results

def splitGroups(group):
    if len(group) == 1:
        return {group[0]: []}
    else:
        g = group.pop(0)
        return {g: splitGroups(group)}



def hierarchy(results):
    categories = dict()
    groups = []
    for names, types in results.items():
        types.append(names)
        groups = '/'.join(types)
        groups= groups.replace('/', '', 1)
        groups = groups.split('/')

        if len(groups) == 1:
            categories[groups[0]]= []
        else:
            g = groups.pop(0)
            categories[g]= splitGroups(groups)
    return categories





# client = MongoClient('mongodb://128.113.21.81:27017')
# db = client.SurvivalOnMoon
# speech = db.speech
# text = ''
#
# for s in speech.find():
#     text += s['text']
# print(text)

with open('transcript_text.txt', 'r') as myfile:
    text=myfile.read()
    myfile.close()

results = feature(text)
results = hierarchy(results)

vis_json = {}
vis_json['name'] = 'hierarchy'
vis_json['children'] = []

def tags(results):
    temp ={}
    for key, values in results.items():
        if not values:
            obj= {
                'name': key,
                'size': values
            }
            vis_json['children'].append(obj)
        else:
            print('help')

tags(results)
out_file = open("output.json", 'w')
out_file.write(json.dumps(vis_json, indent=2))

