const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    speechId: Number,
    allText: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Speech'
    }]
}, { collection: 'user1' });

const User = mongoose.model('User', userSchema);
module.exports = User;