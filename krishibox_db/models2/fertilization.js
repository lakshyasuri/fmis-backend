const mongoose = require('mongoose');
const {signup} = require('./signup');
const {sub_field} = require('./sub_field');
const {season} = require('./season');
const {job} = require('./job');

const fertilizationSchema = new mongoose.Schema({
    start_date: {
        type: Date, 
        default: Date.now(),
    }, 
    status: {
        type: String, 
        default: "pending"
    }, 
    end_date: {
        type: Date, 
        required: true,
    }, 
    name: {
        type: String, 
        required: true,
    }, 
    quantity: {
        type: Number, 
        required: true
    }, 
    unit: {
        type: String, 
    }, 
    job: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'job'
    },
    total_cost: {
        type: Number, 
        //required: true
    }, 
    crop: {
        type: String,
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

const fertilization = mongoose.model('fertilization',fertilizationSchema);
module.exports = {fertilization};
