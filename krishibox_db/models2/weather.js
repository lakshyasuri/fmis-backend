const mongoose = require('mongoose');

const {field} = require('./field');
const {signup} = require('./signup');

const weatherSchema = new mongoose.Schema({
    temp : {
        type: Number, 
        required: true
    }, 
    min: {
        type: Number, 
        default: null
    }, 
    max: {
        type: Number, 
        default: null
    }, 
    humidity: {
        type: Number, 
        required: true
    }, 
    general: {
        type: String
    }, 

    field: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'field'
    }, 
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'signup',
    }
});

const weather = mongoose.model('weather',weatherSchema);
module.exports = {weather};