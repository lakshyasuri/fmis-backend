const mongoose = require('mongoose');

const peopleSchema = new mongoose.Schema({
    name: {
        type: String, 
        trim: true, 
        required: true
    }, 
    number: {
        type: Number, 
    }, 
    address: {
        type: String, 
        trim : true
    }, 
    aadhar: {
        type: Number, 
        unique: true,
    }, 
    assigned_to_field: 
}); 

const people = mongoose.model('people',peopleSchema);

module