const mongoose = require('mongoose');

const signup = require('./signup');

const inventorySchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true, 
        trim: true
    }, 
    type: {
        type: String, 
        required: true, 
        trim: true
    }, 
    quantity: {
        type: Number, 
        required: true, 
    }, 
    unit: {
        type: String, 
        default: "kg"
    }, 
    manufacturer: {
        type: String, 
        trim: true
    }, 
    invoice: {
        type: Number, 
        default: null, 
    }, 
    purchase_date: {
        type: Date, 
        default: null
    }, 
    farmer: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'signup'
    }
});

const inventory = mongoose.model('inventory',inventorySchema);
module.exports = {inventory};