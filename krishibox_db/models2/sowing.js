const mongoose = require('mongoose');

const {season} = require('./season');
const {sub_field} = require('./sub_field');
const sowingSchema = new mongoose.Schema({
    start_date: {
        type: Date, 
        default: Date.now(),
    }, 
    status: {
        type: String, 
        default: "pending"
    }, 
    end_date: {
        type: Date
    }, 
    season: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'season',
    },
    sub_field: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'sub_field'
    },
    amount_sown: {
        type: Number, 
        required: true,
    }, 
    sown_unit: {
        type: String, 
        required: true,
    }, 
    expected_yield: {
        type: Number, 
        required: true, 
    }, 
    yield_unit: {
        type: String, 
        required: true
    }, 
    job_done_by: {
        type: String, 
    }, 
    job_duration: {
        type: Number, 
    }, 
    duration_unit: {
        type: String, 
        default: "hours"
    },
    total_cost: {
        type: Number, 
        required: true,
    }

});

const sowing = mongoose.model('sowing',sowingSchema);
module.exports = {sowing};