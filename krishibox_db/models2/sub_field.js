const mongoose = require('mongoose'); 
const {signup} = require('./signup');
const {field} = require('./field');
const {worker} = require('./worker');

const subFieldSchema = new mongoose.Schema({
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
    field: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'field' 
    }, 
    worker_history: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'worker'
        }
    ]
});

const sub_field = mongoose.model('sub_field',subFieldSchema);
module.exports  = {sub_field};