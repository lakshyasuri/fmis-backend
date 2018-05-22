const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');

const {mongoose} = require('./models/mongoose');
const {signup} = require('./models/signup');
const {ObjectID} = require('mongodb');

const {irrigation} = require('./models/irrigation');
const {resources} = require('./models/resources');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(logger('dev'));

app.post('/signup',(request,response)=>{
    if(request.body.number.toString().length<10 || isNaN(request.body.number))
        return response.status(400).send('number format not valid');
    var SignUp = new signup({
        name: request.body.name,
         number: request.body.number

    });
    SignUp.save().then((doc)=>{
        response.send(JSON.stringify(doc,undefined,2));
    },(err)=>{
        response.status(400).send(err);
    });
});

app.get('/signup',(request,response)=>{
    signup.find().then((doc)=>{
        response.send({doc});
    }, (e)=>{
        response.status(400).send(e);

    })
});

app.get('/signup/:id',(request,response)=>{
    var Num = request.params.id;
    //console.log(String(Num));
    if(Num.toString().length<10 || isNaN(Num))
    return response.status(400).send('enter a valid number ');

    signup.find({
        number: Num
    }).then((signup)=>{
        if(!signup)
        {
            return response.status(404).send('no record found');
        }
        response.send({signup});
    },(e)=>{
        response.status(400).send(e);
    });

   /*  if(!ObjectID.isValid(id)){
        return response.status(404).send();
    }

    signup.findById(id).then((signup)=>{
        if(!signup){
            return response.status(404).send();
        }
        response.send({signup});
    },(e)=>{
        response.status(400).send();
    }); */

    
});

app.delete('/signup/:id',(request,response)=>{
    var Num = request.params.id;
    if(Num.toString().length<10 || isNaN(Num))
        return response.status(400).send('enter a valid number ');

    signup.findOneAndRemove({
        number: Num
    }).then((user)=>{
        if(!user)
            return response.status(404).send();
        response.send(user);

    },(e)=>{
        response.status(400).send();
    });
    
});

app.patch('/signup/:id',(request,response)=>{
    var Num = request.params.id;
    var body = _.pick(request.body, ['name','number']);

    if(Num.toString().length<10 || isNaN(Num))
        return response.status(400).send('enter a valid number ');

    signup.findOneAndUpdate({
        number: Num
    }, {
        $set: body
    },{
        new: true
    }).then((user)=>{
        if(!user)
        {
            return response.status(404).send('record not found');
        }
        response.send(user);
    },(e)=>{
        response.status(400).send(e);
    })
    
    

});


// ------------IRRIGATION-------------------------------------------

app.post('/irrigation',(request,response)=>{

    
    //console.log(request.job_done_by.toString().trim());
    // if(request.body.job_done_by!="people" || request.body.job_done_by!="machine")
    // {
    //     return response.status(404).send("job_done_by can only be either people or machine");
    // }
    // if(request.body.job_duration.unit.trim()!="hours" || request.body.job_duration.unit.trim()!="days")
    // {
    //     return response.status(404).send("the unit of job_duration can only be either hours or days");
    // }
    if(request.body.job_done_by)
    {
        var jobDoneBy = request.body.job_done_by.toString().trim();
        if(jobDoneBy!='machine' && jobDoneBy!='people')
        {
            return response.status(400).send("job_done_by can only be either people or machine");

        }
    }
    var unit = request.body.job_duration.unit.toString().trim();
    if(unit!='hours' && unit!='days')
    {
        return response.status(400).send("the unit of job_duration can only be either hours or days");
    }
    
    var end_date = new Date(+request.body.end);
    var Irrigation = new irrigation({
        start: new Date(+request.body.start), 
        status: request.body.status, 
        end: end_date, 
        water_source: request.body.water_source,
        quantity: request.body.quantity,
        job_done_by: request.body.job_done_by, 
        job_duration: request.body.job_duration, 
        job_total_cost: request.body.job_total_cost
        
    });
    Irrigation.save().then((result)=>{
        response.send(JSON.stringify(result,undefined,2));
    },(e)=>{
        response.status(400).send(e);
    });
});

app.get('/irrigation',(request,response)=>{
    irrigation.find().then((result)=>{
        if(result.length==0)
        {
            response.status(404).send('no record found');
        }
        response.send({result});
    },(e)=>{
        response.status(400).send(e);
    });
});

app.get('/irrigation/:id',(request,response)=>{
    var id = request.params.id;
    if(!ObjectID.isValid(id))
    {
        return response.status(400).send('id is not valid');
    }
    irrigation.findById(id).then((result)=>{
        if(!result)
        {
            response.status(404).send('no record found');
        }
        response.send(result);
    },(e)=>{
        response.status(400).send(e);
    });

});

app.delete('/irrigation/:id',(request,response)=>{
    var id = request.params.id;

    if(!ObjectID.isValid(id))
        return response.status(400).send('id is not valid');
    irrigation.findByIdAndRemove(id).then((result)=>{
        if(!result)
        {
            return response.status(404).send('no record found');
        }
        response.send(result);
    },(e)=>{
        response.status(400).send(e);
    });
});

app.patch('/irrigation/:id',(request,response)=>{
    var id = request.params.id;
    var body = _.pick(request.body,['start','status','end','water_source','quantity','job_done_by','job_duration','job_total_cost'])

    if(!ObjectID.isValid(id))
        return response.status(400).send('id is not valid');
    
    if(body.job_done_by)
    {
        if(body.job_done_by.toString().trim()!='machine' && body.job_done_by.toString().trim()!='people')
        {
            return response.status(404).send('job_done_by can be either machine or people');
        }
        
    }
    if(body.job_duration)
    {
        if(body.job_duration.unit.toString().trim()!='hours' && body.job_duration.unit.toString().trim()!='days')
        {
            return response.status(404).send('the unit of job_duration can either be hours or days ')
        }
    }

    

    irrigation.findByIdAndUpdate(id,{
        $set : body
    },{new: true}).then((result)=>{
        if(!result)
        {
            return response.status(404).send('record not found');
        }
        response.send(result);
    },(e)=>{
        esponse.status(400).send(e); 
    });
});

//------------------------RESOURCES-----------------------------------

app.post('/resources',(request,response)=>{
    
    if(request.body.people)
    {
        if(request.body.people.number)
        {
            var number = request.body.people.number;
            if(number.toString().length<10)
                return response.status(400).send('phone number not valid');
        }

        if(request.body.people.aadhar_card)
        {
            var num = request.body.people.aadhar_card;
            if(num.toString().length<12)
                return response.status(400).send('aadhar card number not valid');
        }
    }
    var resource = new resources({
        field_details: request.body.field_details, 
        machine_details: request.body.machine_details,
        people: request.body.people, 
        inventory: request.body.inventory, 

    });
    resource.save().then((result)=>{
        response.send(result);
    },(e)=>{
        response.status(400).send(e);
    });
    
});

app.get('/resources',(request,response)=>{
    resources.find().then((result)=>{
        if(result.length==0)
            return response.status(404).send('no record found');
        response.send(result);
    },(e)=>{
        response.status(400).send(e);
    });
});

app.get('/resources/:id',(request,response)=>{
    var id = request.params.id; 
    if(!ObjectID.isValid(id))
        response.status(400).send('id not valid');
    
    resources.findById(id).then((result)=>{
        if(!result)
            response.status(404).send('no record found');
        response.send(result);
    },(e)=>{
        response.status(400).send(e);
    });
    
});

app.delete('/resources/:id',(request,response)=>{
    var id = request.params.id;
    if(!ObjectID.isValid(id))
        response.status(400).send('id not valid');
    
        resources.findByIdAndRemove(id).then((result)=>{
            if(!result)
            {
                return response.status(404).send('no record found');
            }
            response.send(result);
        },(e)=>{
            response.status(400).send(e);
        });
    
});

app.put('/resources/:id',(request,response)=>{
    var id = request.params.id;
    if(!ObjectID.isValid(id))
    {
        response.status(400).send('id not valid');
    }
    var body = _.pick(request.body,['field_details','machine_details','people','inventory',])
    if(body.people)
    {
        if(body.people.number)
        {
            var number = request.body.people.number;
            if(number.toString().length<10)
                return response.status(400).send('phone number not valid');
        }

        if(body.people.aadhar_card)
        {
            var num = request.body.people.aadhar_card;
            if(num.toString().length<12)
                return response.status(400).send('aadhar card number not valid');
        }
    } 
    

    resources.findByIdAndUpdate(id,{$set:body},
        {new: true,
        setDefaultsOnInsert: true}).then((result)=>{
            if(!result)
            {
                return response.status(404).send('no record found');
            }
            
        
            response.send(result);
        },(e)=>{
            response.status(400).send(e);
        });
});

//---------------------SOWING------------------------------------------



app.listen(port,()=>{
    console.log(`started on port ${port}`);
});

module.exports = {app};
