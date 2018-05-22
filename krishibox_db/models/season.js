var mongoose = require('mongoose'); 

var season = mongoose.model('season',{
    start: {
        type: Date, 
        default: Date.now(),
    }, 
    end: {
        type: Date, 
        required: true
    }, 
    field: {
        demarcation: {
            type: String,
            required: true
        }, 
        area: {
            type: Number, 
            required: true
        }, 
        name: {
           type: String,  
        }
    }, 
    crop: {
        type: String, 
        required: true
    }, 
    variety: {
        type: String, 
    }
});