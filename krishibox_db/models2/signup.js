const mongoose = require('mongoose');
const field = require('./field');
const machine = require('./machine');

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
    }, 
    machines: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'machine', 
            default: null
        }
    ]

});

const signup = mongoose.model('signup',signupSchema);
module.exports = {signup};