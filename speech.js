const mongoose = require('mongoose');

const speechSchema = mongoose.Schema({
    speechId: Number,
    start: Number,
    end: Number,
    location: [Number],
    //speaker: {
    //    type: mongoose.Schema.Types.ObjectId,
    //    ref: 'User'
    //},
    text: String
},
{ collection: 'speech' });

speechSchema.virtual('duration').get(function () {
    return this.end - this.start;
});

speechSchema.virtual('speaker', {
    ref: 'User',
    localField: 'speechId',
    foreignField: 'speechId',
    justOne: true
});

speechSchema.virtual('coord').get(function () {
    var coord = [];
    coord[coord.length]=this.location[0];
    coord[coord.length] = this.location[2];
    return coord;
});

const Speech = mongoose.model('Speech', speechSchema);
module.exports = Speech;