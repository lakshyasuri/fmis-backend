var mongoose = require('mongoose');

var signup = mongoose.model('signup',{
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
    }
}); 

module.exports = {signup};