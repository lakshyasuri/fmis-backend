const {ObjectID} = require('mongodb');

const {mongoose} = require('./models/mongoose');
const {signup} = require('./models/signup');

var id = '5afbd42b1150991644a5c822';

if(!ObjectID.isValid(id)){
    console.log('id not valid');
}
/* signup.find({
    _id: id
}).then((signups)=>{
    console.log('users', signups);
},(e)=>{
    console.log(e.message);
}); */

signup.findById(id).then((signups)=>{
    console.log('users ', signups);
},(e)=>{
    console.log(e.message);
});

