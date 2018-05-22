const mongoose = require('mongoose');

const signup = require('./signup');

const machineSchema = new mongoose.Schema({
    name: {
        type: String, 
        trim: true, 
        //required: true
    }, 
    imageID: {
        type: Number, 
        //required: true 
    }, 
    manufacturer: {
        type: String, 
        trim: true, 
        //required: true
    }, 
    model: {
        type: String, 
        trim: true, 
    }, 
    year: {
        type: Number
    }, 
    quantity: {
        type: Number, 
    }, 
    status: {
        type: String,
    },

    farmer : {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'signup'
    }
});

const machine = mongoose.model('machine',machineSchema);
module.exports = {machine};