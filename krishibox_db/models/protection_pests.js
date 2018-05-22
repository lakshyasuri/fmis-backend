var mongoose = require('mongoose');

var protection_pests = mongoose.model('protection_pests', {
    start: {
        type: Date, 
        default: Date.now(),

    }, 
    status: {
        pending: {
            type: Boolean, 
            default: true,
        }, 
        on_going: {
            type: Boolean, 
            default: false
        }, 
        finished: {
            type: Boolean, 
            default: false
        }
        
        
    }, 
    end: {
        type: Date, 
        required: true, 
    }, 
    name: {
        type: String, 
    }, 
    quantity_used: {
        type: Number, 
        required: true
    }, 
    job_done_by: {
        type: String, 
        required: true, 
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
    activity_cost: {
        resource: {
            type: String, 
        }, 
        cost: {
            type: Number, 
        }
    }
});