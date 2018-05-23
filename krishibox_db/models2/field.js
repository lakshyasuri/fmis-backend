const mongoose = require('mongoose');
const signup = require('./signup');
const weather = require('./weather');

const fieldSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true, 
        trim: true
    }, 
    latitude: {
        type: Number, 
        required: true
    },
    longitude: {
        type: Number, 
        required: true
    },
    area: {
        type: Number, 
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'signup',
        unique: true
    },
    weather: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'weather',
        default: null
    }]
});
const field = mongoose.model('field',fieldSchema);

module.exports = {field};