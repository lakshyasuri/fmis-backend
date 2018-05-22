var mongoose = require('mongoose'); 

var resources = mongoose.model('resources', {
    field_details: {
        latitude: {
            type: Number, 
            required: true,
        }, 
        longitude: {
            type: Number, 
            required: true
        }, 
        area: {
            type: Number, 
            required: true
        }, 
        draw_feature: 
        {
            type: String,
            required: true 
        }, 
        weather: {
            temperature: [Number],
            humidity: [Number],
            general: {
                type: String,
            }
        },
    }, 
    machine_details: {
        name: {
            type: String, 
            trim: true, 
            //required: true
        }, 
        imageID: {
            type: Number, 
            //required: true 
        }, 
        manufacturer: {
            type: String, 
            trim: true, 
            //required: true
        }, 
        model: {
            type: String, 
            trim: true, 
        }, 
        year: {
            type: Number
        }, 
        quantity: {
            type: Number, 
        }, 
        status: {
            type: String,
        }, 

    }, 
    people: {
        name: {
            type: String
        }, 
        number: {
            type: Number, 
            //minlength: 10, 
            unique: true
        }, 
        address: {
            type: String, 
        }, 
        aadhar_card: {
            type: Number
        }

    }, 
    inventory: {
        name: {
            type: String, 
            required: true
        }, 
        type: {
            type: String, 
            required: true, 

        }, 
        quantity: {
            num: {
                type: Number, 
                required: true, 
            }, 
            unit: {
                type: String, 
                 required: true, 
            }
            
        }, 
        cost: {
            type: Number, 
            required: true
        }, 
        manufacturer: {
            type: String, 
            trim: true, 
        }
    }

});

module.exports = {resources};