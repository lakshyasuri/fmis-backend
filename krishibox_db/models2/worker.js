const mongoose = require('mongoose');
const {sub_field} = require('./sub_field');
const {signup} = require('./signup');

const workerSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true, 
        trim: true
    }, 
    number: {
        type: Number,
        required: true
    }, 
    address: {
        type: String, 
        trim: true
    }, 
    aadhar: {
        type: Number, 
        unique: true
    },
    assigned_status: {
        type: Boolean, 
        default: false
    },
    assigned_to_field: {
        type: mongoose.Schema.Types.ObjectId, 
        default: null, 
        ref: 'sub_field'
    }, 
    farmer: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'signup'
    }

}); 

const worker = mongoose.model('worker',workerSchema);

module.exports = {worker};