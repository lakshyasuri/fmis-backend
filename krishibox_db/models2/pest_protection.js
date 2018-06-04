const mongoose = require('mongoose');
const {signup} = require('./signup');
const {season} = require('./season');
const {sub_field} = require('./sub_field');
const {job} = require('./job')

const pest_protectionSchema = new mongoose.Schema({
    start_date: {
        type: Date, 
        default: Date.now()
    }, 
    status: {
        type: String, 
        default: 'pending', 
        trim: true
    }, 
    end_date: {
        type: Date, 
        required: true
    }, 
    name: {
        type: String, 
        required: true, 
        trim: true
    }, 
    quantity: {
        type: Number, 
        required: true
    }, 
    unit: {
        type: String, 
        trim: true
    }, 
    job: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'job', 
        default: null
    }, 
    total_cost: {
        type: Number
    }, 
    crop: {
        type: String
    }, 
    farmer: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'signup'
    }, 
    season: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'season'
    }, 
    sub_field: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'sub_field'
    }
});

const pest_protection = mongoose.model('pest_protection',pest_protectionSchema);
module.exports = {pest_protection};