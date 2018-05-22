var Mongoose = require('mongoose');


var irrigation = Mongoose.model('irrigation',{
    start: {
        type: Date, 
        default: Date.now()
    }, 
    status: {
        pending: {
            type: Boolean, 
            default: false,
        }, 
        on_going: {
            type: Boolean, 
            default: false
        }, 
        finished: {
            type: Boolean, 
            default: false,     
        }
    }, 
    end: {
        type: Date, 
        required: true,
    }, 
    water_source: {
        type: String, 
        trim: true, 
        default: "water tank"
    }, 
    quantity: {
        type: Number, 
        required: true
    }, 
    job_done_by: {
        type: String, 
        default: "machine"
    }, 
    job_duration: {
        num: {
            type: Number, 
            required: true,
        }, 
        unit: {
            type: String, 
            required: true,
        }
    }, 
    job_total_cost: {
        type: Number, 
    }
}); 

module.exports = {irrigation};


