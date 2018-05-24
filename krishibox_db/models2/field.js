const mongoose = require('mongoose');
const {signup} = require('./signup');
const {weather} = require('./weather');
const {sub_field} = require('./sub_field');

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
        unique: false,
        //unique: true
    },
    weather: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'weather',
        default: null
    }], 
    sub_fields: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'sub_field', 
        default: null
    }]
});
const field = mongoose.model('field',fieldSchema);

module.exports = {field};