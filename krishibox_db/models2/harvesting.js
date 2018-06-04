const mongoose = require('mongoose');
const {signup} = require('./signup');
const {season} = require('./season');
const {sub_field} = require('./sub_field');

const harvestingSchema = new mongoose.Schema({
    start_date: {
        type: Date, 
        default: Date.now()
    }, 
    status: {
        type: String, 
        trim: true, 
        default: 'pending'
    }, 
    end_date: {
        type: Date, 
        required: true
    },
    harvested_quantity: {
        type: Number, 
        required: true
    }, 
    unit: {
        type: String, 
        default: 'Kg', 
        trim: true
    }, 
    job: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'job', 
        default: null
    },
    total_cost: {
        type: Number, 
        required: true
    }, 
    crop: {
        type: String, 
        trim: true
    }, 
    season: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'season'
    }, 
    farmer: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'signup'
    }, 
    sub_field: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'sub_field'
    }

});

const harvesting = mongoose.model('harvesting',harvestingSchema);
module.exports = {harvesting};