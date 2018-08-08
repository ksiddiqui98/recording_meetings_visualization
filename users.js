const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/user');

router.get('/', (req, res, next) => {
    User.find({})
        .exec()
        .then(docs => {
            res.status(200).json({
                message: 'GET all users'
            });
            //.then(docs => {
            //    res.status(200).json({
            //        count: docs.length,
            //        users: docs.map(doc => {
            //            return {
            //                _id: doc._id,
            //                speechId: doc.speechId
            //            };
            //        })
            //    });
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

});

router.post('/', (req, res, next) => {
    res.send('POST');
});

router.put('/', (req, res, next) => {
    res.send('PUT');
});

router.delete('/', (req, res, next) => {
    res.send('DELETE');
});

router.get('/:id', (req, res, next) => {
    User.findById(req.params.id)
        .exec()
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    message: 'User not found'
                });
            }
            res.status(200).json({
                _id: user._id,
                speechId: user.speechId,
                start: user.start,
                end: user.end,
                location: user.location,
                text: user.text,
                timeTalked: user.end - user.start
            });
        }).catch (err => {
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;