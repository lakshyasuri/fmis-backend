const mongoose = require('mongoose');
const field = require('./field');

const  signupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, 
        trim: true
    }, 
    number: {
        type: Number, 
        // minlength: 10, 
        unique: true, 
        required: true
    },
    field: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'field',
        default: null
    } 

});

const signup = mongoose.model('signup',signupSchema);
module.exports = {signup};