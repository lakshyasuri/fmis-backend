var mongoose = require('mongoose');

var sowing = mongoose.model('sowing',{
    start: {
        type: Date, 
        default: Date.now(), 
        
    }, 
    status: {
        pending: {
            type: Boolean, 
            default: false
        }, 
        on_going: {
            type: Boolean, 
            default: false,
        }, 
        finished: {
            type: Boolean, 
            default: false
        } 
    },
    end: {
        type: Date, 
        required: true
    }, 
    name: {
        type: String,
        required: true
    }, 
    amount: {
        type: Number,
        required: true
    }, 
    expected_yeild: {
        type: Number,
        required: true 
    }, 
    expected_sp: {
        type: Number,
    }, 
    job_total_cost: {
        type: Number, 
        required: true
    }
    
});
