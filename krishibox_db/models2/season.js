const mongoose = require('mongoose');
const {sub_field} = require('./signup');

const seasonSchema = new mongoose.Schema({
    name: {
        type: String, 
        trim: true, 
        required: true
    }, 
    start_date: {
        type: Date, 
        required: true
    }, 
    end_date: {
        type: Date, 
        required: true
    }, 
    sub_field: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'sub_field'
    }, 
    crop: {
        type: String, 
        required: true
    }, 
    finished: {
        type: Boolean, 
    }
}); 

const season = mongoose.model('season', seasonSchema);
module.exports = {season};