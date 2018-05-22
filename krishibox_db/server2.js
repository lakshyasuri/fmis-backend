const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');

const {mongoose} = require('./models2/mongoose');
const {signup} = require('./models2/signup');
const {field} = require('./models2/field');
const {weather} = require('./models2/weather');
const {machine} = require('./models2/machine');

const {ObjectID} = require('mongodb');

const app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(logger('dev'));

app.post('/new/signup',(request,response)=>{
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

app.get('/new/signup',(request,response)=>{
    signup.find().populate({
        path: 'field machines', 
        select: '_id name area weather',
        populate: {
            path: 'weather', 
            select: '_id temp humidity general'
        }
    }).then((result)=>{
        if(result.length==0)
        {
            return response.status(404).send('no record found');
        }
        response.send(result);
    },(e)=>{
        response.status(400).send(e);
    });
});

app.get('/new/signup/:id',(request,response)=>{
    var id = request.params.id;
    if(!ObjectID.isValid(id))
    {
        return response.status(400).send('ID not valid');
    }

    signup.findById(id).populate({
        path: 'field', 
        select: '_id name area weather', 
        populate: {
            path: 'weather', 
            select: '_id temp humidity general'
        }
    }).then((result)=>{
        if(!result)
        {
            return response.status(404).send('no record found');
        }
        response.send(result);
    },(e)=>{
        response.status(400).send(e);
    });
});

app.delete('/new/signup/:id',(request,response)=>{
    var id = request.params.id;
    if(!ObjectID.isValid(id))
    {
        return response.status(400).send('ID not valid');
    }

    signup.findByIdAndRemove(id).then((result)=>{
        if(!result)
        {
            return response.status(404).send('no record found');
        }
        response.send(result);
    },(e)=>{
        response.status(400).send(e);
    });

});

app.patch('/new/signup/:id',(request,response)=>{
    var id = request.params.id;
    var body = _.pick(request.body,['name','number']);

    if(!ObjectID.isValid(id))
    {
        return response.status(400).send('ID not valid');
    }

    signup.findByIdAndUpdate(id,
        {$set:body},{new: true}).populate('field').then((result)=>{
        if(!result)
        {
            return response.status(404).send('no record found');
        }
        response.send(result);
    },(e)=>{
        response.status(400).send(e);
    });
});

//---------------------------- FIELD -------------------------------

app.post('/new/field/:id',(request,response)=>{
    var id = request.params.id;
    var reference;
    var flag = 0;
    var field_id;

    signup.findById(id).then((result)=>{
        if(!result)
        {
            return response.status(404).send('no record found, hence cant post');
        }
        reference = result._id;
        var Field = new field({
            name: request.body.name, 
            latitude: request.body.latitude, 
            longitude: request.body.longitude,
            area: request.body.area,
            owner: reference
        });
        
        Field.save().then((result)=>{
            response.send(result);
            field_id = result._id;
            signup.findByIdAndUpdate(reference,{
                field: field_id
            }).then((res)=>{
                 if(!res)
                 {
                     return response.send('no signup found');
                 }
                console.log(res);
            },(err)=>{
                response.send(e);
            });
        },(e)=>{
            response.status(400).send(e)
        });
        //console.log(field_id);
    },(e)=>{
        response.status(400).send(e);
    });
});

app.get('/new/field',(request,response)=>{
    field.find().populate({
        path: 'owner weather', 
        select: 'name number temp min max humidity general'
    }).then((result)=>{
        if(result.length==0)
        {
            return response.status(404).send('no record found');
        }
        response.send(result)
    },(e)=>{
        response.status(400).send(e);
    });
});

app.get('/new/field/:id',(request,response)=>{
    var id = request.params.id;
    var field_id;
    if(!ObjectID.isValid(id))
    {
        return response.status(400).send('ID not valid')
    }

    field.findById(id).populate({
        path: 'owner weather', 
        select: 'name number temp min max humidity general'
    }).then((result)=>{
        if(!result)
        {
            return response.status(404).send('no record found');
        }
        response.send(result);
    },(e)=>{
        response.status(400).send(e);
    });

    /* signup.find({number: id}).then((result)=>{
        if(result.length==0)
        {
            return response.status(404).send("no record found (signup)");
        }
        field_id = result[0].field;
        
        field.findById(field_id).populate({
        path: 'owner weather'
        }).then((result)=>{
            if(result.length == 0)
            {
                return response.status(404).send('no record found (field)');
            }

            response.send(result);

        },(e)=>{
            response.status(400).send(e)
        });
    },(e)=>{
        response.status(400).send(e);
    }); */
});

app.patch('/new/field/:id',(request,response)=>{
    var id = request.params.id;
    var body = _.pick(request.body,['name','latitude','longitude','area']);

    if(!ObjectID.isValid(id))
    {
        return response.status(400).send('ID not valid')
    }

    /* signup.find({
        number: id
    }).then((result)=>{
        if(result.length==0)
        {
            return response.status(404).send('no record found');
        }

        field_id = result[0].field; */
        

        field.findByIdAndUpdate(id,{$set: body},{new: true}).populate({
            path: 'owner weather', 
        select: 'name number temp min max humidity general'
        }).then((result)=>{
            if(result.length==0)
            {
                return response.status(404).send('no record found');
            }
            
            response.send(result);
        },(e)=>{
            response.status(400).send(e);
        });
    }/* ,(e)=>{
        response.status(400).send(e);
    
    // });

    
} */);

app.delete('/new/field/:id',(request,response)=>{
    var id = request.params.id;

    if(!ObjectID.isValid(id))
    {
        return response.status(400).send('ID not valid')
    }

    /* signup.find({number:id}).then((result)=>{
        if(result.length==0)
        {
            return response.status(404).send('no record found (signup)');
        }
        field_id = result[0].field; */

        field.findByIdAndRemove(id).then((result)=>{
            if(!result)
            {
                return response.status(404).send('no record found');
            }
            response.send(result);
        },(e)=>{
            response.status(400).send(e)
        });
    }/* ,(e)=>{
        response.status(400).send(e);
    // });
} */);

//----------------------WEATHER-------------------------------------

app.post('/new/weather/:id',(request,response)=>{
    var field_id = request.params.id;
    var farmer_id;

    if(!ObjectID.isValid(field_id))
    {
        return response.status(400).send('ID not valid');
    }

    field.findById(field_id).then((result)=>{
        if(!result)
        {
            return response.status(404).send('no record found (field)');
        }

        farmer_id = result.owner;

        var Weather = new weather({
            temp : request.body.temp,
            min : request.body.min, 
            max : request.body.max, 
            humidity : request.body.humidity,
            general : request.body.general, 
            field : field_id,
            farmer : farmer_id
        });

        Weather.save().then((result)=>{
            response.send(result);
            field.findByIdAndUpdate(field_id,{
                weather: result._id
            },{new: true}).populate({
                path: 'owner weather'
            }).then((result)=>{
                console.log(result);
            },(e)=>{
                response.status(400).send(e);
            });

        },(e)=>{
            response.status(400).send(e);
        });

    },(e)=>{
        response.status(400).send(e);
    });
});

app.get('/new/weather',(request,response)=>{
    weather.find().populate({
        path: 'field farmer',
        select: 'name area name number'
    }).then((result)=>{
        if(result.length==0)
        {
            return response.status(404).send('no record found');
        }
        response.send(result);
    },(e)=>{
        response.status(400).send(e);
    });
});

app.get('/new/weather/:id',(request,response)=>{
    var id = request.params.id;

    if(!ObjectID.isValid(id))
    {
        return repsonse.status(400).send('Id entered not valid');
    }

    weather.findById(id).populate({
        path: 'field farmer',
        select: 'name area name number'
    }).then((result)=>{
        if(!result)
        {
            return response.status(404).send('no record found');
        }
        response.send(result);
    },(e)=>{
        response.status(400).send(e);
    });
});

app.delete('/new/weather/:id',(request,response)=>{
    var id = request.params.id;
    if(!ObjectID.isValid(id))
    {
        return repsonse.status(400).send('Id entered not valid');
    }

    weather.findByIdAndRemove(id).then((result)=>{
        if(!result)
        {
            return response.status(404).send('no record found');
        }
        response.send(result);
    },(e)=>{
        response.status(400).send(e);
    });
});

app.patch('/new/weather/:id',(request,response)=>{
    var id = request.params.id;
    var body = _.pick(request.body,['temp','min','max','humidity','general']);
    if(!ObjectID.isValid(id))
    {
        return repsonse.status(400).send('Id entered not valid');
    }

    weather.findByIdAndUpdate(id,{$set: body},{new: true}).populate({
        path: 'field farmer',
        select: 'name area name number'
    }).then((result)=>{
        if(!result)
        {
            return response.status(404).send('no record found');
        }
        response.send(result);
    },(e)=>{
        response.status(400).send(e);
    });
});

//---------------------------- MACHINE-----------------------------

app.post('/new/machine/:id',(request,response)=>{
    var farmer_id = request.params.id;
    if(!ObjectID.isValid(farmer_id))
    {
        return response.status(400).send('ID not valid');
    }

    var Machine = new machine({
        name: request.body.name, 
        imageID: request.body.imageID, 
        manufacturer: request.body.manufacturer, 
        model: request.body.model, 
        year: request.body.year, 
        quantity: request.body.quantity, 
        status: request.body.status, 
        farmer: farmer_id
    });

    Machine.save().then((result)=>{
        response.send(result);

        signup.findByIdAndUpdate(farmer_id,{
            $push:{machines: result._id}
        },{new: true}).then((result)=>{
            if(!result)
            {
                return response.status(404).send('no record found (signup)');
            }
    
        },(e)=>{
            response.status(400).send(e);
        });
    },(e)=>{
        response.status(400).send(e)
    });



});

app.get('/new/machine',(request,response)=>{
    machine.find().populate({
        path: 'farmer', 
        select: 'name number', 
        populate: {
            path: 'field', 
            select: 'name area'
        }
    }).then((result)=>{
        if(result.length==0)
        {
            return response.status(404).send('no record found');
        }
        response.send(result);
    },(e)=>{
        response.status(400).send(e);
    });
});

app.get('/new/machine/:id',(request,response)=>{
    var id = request.params.id; 
    if(!ObjectID.isValid(id))
    {
        return response.status(400).send('ID not valid');
    }

    machine.findById(id).populate({
        path: 'farmer', 
        select: 'name number', 
        populate: {
            path: 'field', 
            select: 'name area'
        }
    }).then((result)=>{
        if(!result)
        {
            return response.status(404).send('no record found');
        }
        response.send(result);
    },(e)=>{
        response.status(400).send(e);
    });
});

app.delete('/new/machine/:id',(request,response)=>{
    var id = request.params.id; 
    if(!ObjectID.isValid(id))
    {
        return response.status(400).send('ID not valid');
    }

    machine.findByIdAndRemove(id).populate({
        path: 'farmer', 
        select: 'name number', 
        populate: {
            path: 'field', 
            select: 'name area'
        }
    }).then((result)=>{
        if(!result)
        {
            return response.status(404).send('no record found');
        }
        response.send(result);
    },(e)=>{
        response.status(400).send(e);
    });
});

app.patch('/new/machine/:id',(request,response)=>{
    var id = request.params.id; 
    var body = _.pick(request.body,['name','imageID','manufacturer','model','year','quantity','status']);

    if(!ObjectID.isValid(id))
    {
        return response.status(400).send('ID not valid');
    }

    machine.findByIdAndUpdate(id,{$set: body},{new: true}).populate({
        path: 'farmer', 
        select: 'name number', 
        populate: {
            path: 'field', 
            select: 'name area'
        }
    }).then((result)=>{
        if(!result)
        {
            return response.status(404).send('no record found');
        }
        response.send(result);
    },(e)=>{
        response.status(400).send(e);
    });
});

//------------------------






app.listen(port,()=>{
    console.log(`started on port ${port}`);
});
