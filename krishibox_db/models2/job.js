const mongoose = require('mongoose');
const {signup} = require('./signup');
/* const {sowing} = require('./sowing');
const {harvesting} = require('./harvesting');
const {fertilization} = require('./fertilization');
const {irrigation} = require('./irrigation');
const {weed_protection} = require('./weed_protection');
const {pest_protection} = require('./pest_protection');
 */
const jobSchema = new mongoose.Schema({
    job_by: {
        type: String, 
        required: true, 
        trim: true
    }, 
    name: {
        type: String, 
        required: true, 
        trim: true
    }, 
    start_date: {
        type: Date, 
        default: Date.now()
    }, 
    end_date: {
        type: Date, 
        required: true
    }, 
    duration: {
        type: Number, 
        required: true
    }, 
    duration_unit: {
        type: String, 
        default: 'hours'
    },
    total_cost: {
        type: Number, 
        required: true,
    }, 
    activity: {
        type: mongoose.Schema.Types.ObjectId,
    }, 
    farmer: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'signup'
    }


});

const job = mongoose.model('job',jobSchema);
module.exports = {job};
