const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Speech = require('../models/speech');

router.get('/', (req, res, next) => {
    Speech.find()
        .populate('speaker', '_id')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                speeches: docs.map(doc => {
                    return {
                        speechId: doc.speechId,
                        coord: doc.coord,
                        text: doc.text,
                        duration: doc.duration,
                        speaker: doc.speaker
                    };
                })
            });
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

});

module.exports = router;