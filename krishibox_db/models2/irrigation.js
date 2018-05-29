const mongoose = require('mongoose');
const {signup} = require('./signup');
const {sub_field} = require('./sub_field');
const {season} = require('./season');

const irrigationSchema = new mongoose.Schema({
    start_date: {
        type: Date, 
        default: Date.now()
    }, 
    status: {
        type: String, 
        default: "pending"
    }, 
    end_date: {
        type: Date, 
        required: true,
    }, 
    water_source: {
        type: String, 
        default: "tank", 
    }, 
    quantity: {
        type: Number, 
        required: true,
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
         required: true
     }, 
     crop: {
         type: String
     },
     farmer: {
         type: mongoose.Schema.Types.ObjectId, 
         ref: 'signup'
     }, 
     sub_field: {
         type: mongoose.Schema.Types.ObjectId, 
         ref: 'sub_field'
     }, 
     season: {
         type: mongoose.Schema.Types.ObjectId, 
         ref: 'season'
     }
}); 

const irrigation = mongoose.model('irrigation',irrigationSchema);
module.exports = {irrigation};