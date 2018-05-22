var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/KrishiBox2');

var signup = mongoose.model('signup',{
    name: {
        type: String,
    },
    number: {
        type: Number,
    }
});

var newSignup = new signup({});
newSignup.save();