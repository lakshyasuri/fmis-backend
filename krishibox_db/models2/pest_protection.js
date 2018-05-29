const mongoose = require('mongoose');
const {signup} = require('./signup');
const {season} = require('./season');
const {sub_field} = require('./sub_field');

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
    job_done_by: {
        type: String, 
        trim: true
    }, 
    job_duration: {
        type: Number, 
    }, 
    duration_unit: {
        type: String, 
        default: 'hours'
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