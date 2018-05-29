const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');

const {mongoose} = require('./models2/mongoose');
const {signup} = require('./models2/signup');
const {field} = require('./models2/field');
const {weather} = require('./models2/weather');
const {machine} = require('./models2/machine');
const {inventory} = require('./models2/inventory');
const {sub_field} = require('./models2/sub_field');
const {worker} = require('./models2/worker');
const {season} = require('./models2/season');
const {sowing} = require('./models2/sowing');
const {irrigation} = require('./models2/irrigation');

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
        path: 'field machines inventory', 
        select: '_id name area weather name manufacturer model year quantity status name type quantity unit',
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
        path: 'field machines inventory', 
        select: '_id name area weather name manufacturer model year quantity status name type quantity unit', 
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
    if(!ObjectID.isValid(id))
    {
        return response.status(400).send('ID not valid');
    }

    signup.findById(id).then((result)=>{
        if(!result)
        {
            return response.status(404).send('no user found');
        }
        var Field = new field({
            name: request.body.name, 
            latitude: request.body.latitude, 
            longitude: request.body.longitude,
            area: request.body.area,
            owner: id
        });
        
        Field.save().then((result)=>{
            response.send(result);
            signup.findByIdAndUpdate(id,{
                field: result._id
            }).then((res)=>{
                 if(!res)
                 {
                     return response.send('no signup found');
                 }
                console.log(res);
            },(err)=>{
                response.status(400).send(e);
            });
        },(e)=>{
            response.status(400).send(e)
        });
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
            field.findByIdAndUpdate(field_id,{$push:{
                weather: result._id}
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

app.get('/new/weather/:field_id',(request,response)=>{
    var id = request.params.field_id;

    if(!ObjectID.isValid(id))
    {
        return repsonse.status(400).send('Id entered not valid');
    }

    field.findById(id).then((result)=>{
        if(!result)
        {
            return response.status(404).send('no field found');
        }

        weather.find({
            field: id
        }).populate({
            path: 'field farmer',
            select: 'name area name number'
        }).then((result)=>{
            if(result.length == 0)
            {
                return response.status(404).send('no record found');
            }
            response.send(result);
        },(e)=>{
            response.status(400).send(e);
        });
    },(e)=>{
        response.status(400).send(e);
    })

    
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

    signup.findById(id).then((result)=>{
        if(!result)
        {
            return response.status(404).send('no user found');
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
    },(e)=>{
        response.status(400).send(e);
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

app.get('/new/machine/:farmer_id',(request,response)=>{
    var id = request.params.farmer_id; 
    if(!ObjectID.isValid(id))
    {
        return response.status(400).send('ID not valid');
    }

    signup.findById(id).then((result)=>{
        if(!result)
        {
            return response.status(404).send('no user found');
        }

        machine.find({
            farmer: id
        }).populate({
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

//----------------------------INVENTORY-----------------------------

app.post('/new/inventory/:id',(request,response)=>{
    var farmer_id = request.params.id; 
    if(!ObjectID.isValid(farmer_id))
    {
        return response.status(400).send('ID not valid');
    }

    signup.findById(id).then((result)=>{
        if(!result)
        {
            return response.status(404).send('no user found');
        }

        var body = request.body;
    var Inventory = new inventory({
        name: body.name, 
        type: body.type, 
        quantity: body.quantity, 
        unit: body.unit, 
        manufacturer: body.manufacturer, 
        invoice: body.invoice, 
        purchase_date: new Date(+body.purchase_date),
        farmer: farmer_id
    });

    Inventory.save().then((result)=>{
        response.send(result);

        signup.findByIdAndUpdate(farmer_id,{$push: {inventory: result._id}},{
            new: true
        }).then((result)=>{
            if(!result)
            {
                return response.status(404).send('no record found (signup)');
            }
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

app.get('/new/inventory',(request,response)=>{
    inventory.find().populate({
        path: 'farmer', 
        select: 'name number field', 
        populate: {
            path: 'field', 
            select: 'name area weather'
        }, 
        populate: {
            path: 'weather',
            select: 'temp humidty general'
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

app.get('/new/inventory/:farmer_id',(request,response)=>{
    var id = request.params.farmer_id; 
    if(!ObjectID.isValid(id))
    {
        return response.status(400).send('ID not valid');
    }

    signup.findById(id).then((result)=>{
        if(!result)
        {
            return response.status(404).send('no user found');
        }

        inventory.find({
            farmer: id
        }).populate({
            path: 'farmer', 
            select: 'name number field', 
            populate: {
                path: 'field', 
                select: 'name area weather'
            }, 
            populate: {
                path: 'weather',
                select: 'temp humidty general'
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
    },(e)=>{
        response.status(400).send(e);
    });
    
});

app.delete('/new/inventory/:id',(request,response)=>{
    var id = request.params.id; 
    if(!ObjectID.isValid(id))
    {
        return response.status(400).send('ID not valid');
    }

    inventory.findByIdAndRemove(id).then((result)=>{
        if(!result)
        {
            return response.status(404).send('no record found');
        }
        response.send(result);
    },(e)=>{
        response.status(400).send(e);
    });
});

app.patch('/new/inventory/:id',(request,response)=>{
    var id = request.params.id;
    var body = _.pick(request.body,['name','type', 'quantity','unit','manufacturer','invoice','purchase_date','farmer']);

    if(!ObjectID.isValid(id))
    {
        return response.status(400).send('ID not valid');
    }

    inventory.findByIdAndUpdate(id,{$set: body},{new: true}).populate({
        path: 'farmer', 
        select: 'name number field', 
        populate: {
            path: 'field', 
            select: 'name area weather'
        }, 
        populate: {
            path: 'weather',
            select: 'temp humidty general'
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

//---------------------------SUB_FIELD---------------------------------------

app.post('/new/sub_field/:id',(request,response)=>{
    var id = request.params.id; 
    if(!ObjectID.isValid(id))
    {
        return response.status(400).send('ID not valid');
    }

    field.findById(id).then((result)=>{
        if(!result)
        {
            return response.status(404).send('no record found (field)');
        }

        var subField = new sub_field({
            name : request.body.name, 
            latitude : request.body.latitude, 
            longitude: request.body.longitude, 
            area: request.body.area,
            field: id
        });

        subField.save().then((result)=>{
            response.send(result);

            field.findByIdAndUpdate(id,{$push:{sub_fields: result._id}},{
                new: true
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

app.get('/new/sub_field',(request,response)=>{
    sub_field.find().populate({
        path: 'field', 
        select: 'name area owner weather'
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

app.get('/new/singleSub_field/:id',(request,response)=>{
    var id = request.params.id;
    if(!ObjectID.isValid(id))
    {
        return response.status(400).send('ID not valid');
    }

    sub_field.findById(id).populate({
        path: 'field', 
        select: 'name area owner weather'
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

app.get('/new/sub_field/:field_id',(request,response)=>{
    var id = request.params.field_id; 
    if(!ObjectID.isValid(id))
    {
        return response.status(400).send('ID not valid');
    }

    field.findById(id).then((result)=>{
        if(!result)
        {
            return response.status(404).send('no field found');
        }

        
    sub_field.findById(id).populate({
        path: 'field', 
        select: 'name area owner weather'
    }).then((result)=>{
        if(!result)
        {
            return response.status(404).send('no record found');
        }
        response.send(result);
    },(e)=>{
        response.status(400).send(e);
    });
    },(e)=>{
        response.status(400).send(e);
    });
});

app.delete('/new/sub_field/:id',(request,response)=>{
    var id = request.params.id; 
    if(!ObjectID.isValid(id))
    {
        return response.status(400).send('ID not valid');
    }

    sub_field.findByIdAndRemove(id).then((result)=>{
        if(!result)
        {
            return response.status(404).send('no record found');
        }
        
        response.send(result);
    },(e)=>{
        response.status(400).send(e);
    });
});

app.patch('/new/sub_field/:id',(request,response)=>{
    var id = request.params.id; 
    var body = _.pick(request.body,['name','katitude','longitude','area']);
    if(!ObjectID.isValid(id))
    {
        return response.status(400).send('ID not valid');
    }

    sub_field.findByIdAndUpdate(id,{$set: body},{new: true}).populate({
        path: 'field', 
        select: 'name area owner weather'
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

//-------------------------------------WORKER-------------------------

app.post('/new/worker/:Sub_field/:farmer_id',(request,response)=>{
    var id = request.params.Sub_field;
    var farmer_id = request.params.farmer_id;
    if(!ObjectID.isValid(id))
    {
        return response.status(400).send('ID not valid');
    }

    sub_field.findById(id).then((result)=>{
        if(!result)
        {
            return response.status(404).send('no record found (sub_field)');
        }

        var Worker = new worker({
            name: request.body.name, 
            number: request.body.number, 
            address: request.body.address, 
            aadhar: request.body.aadhar, 
            assigned_status: request.body.assigned_status, 
            assigned_to_field: id, 
            farmer: farmer_id
        });

        Worker.save().then((result)=>{
            response.send(result);

            sub_field.findByIdAndUpdate(id,{$push:{
                worker_history: result._id
            }},{new: true}).then((result)=>{
                console.log(result);
            },(e)=>{
                response.status(400).send(e);
            });

            signup.findByIdAndUpdate(farmer_id,{$push:{
                workers: result._id
            }}).then((e)=>{
                response.status(400).send(e);
            })
        },(e)=>{
            response.status(400).send(e);
        });

    },(e)=>{
        response.status(400).send(e);
    });
});

app.get('/new/worker',(request,response)=>{
    worker.find().populate({
        path: 'assigned_to_field farmer', 
        select: 'name area field worker_history name number workers',
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

app.get('/new/worker/:id',(request,response)=>{
    var id = request.params.id; 
    if(!ObjectID.isValid(id))
    {
        return response.status(400).send('ID not valid');
    }

    worker.findById(id).populate({
        path: 'assigned_to_field farmer', 
        select: 'name area field worker_history name number workers'
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

app.get('/new/worker/:farmer_id',(request,response)=>{
    var id = request.params.farmer_id; 
    if(!ObjectID.isValid(id))
    {
        return response.status(400).send('ID not valid');
    }

    signup.findById(id).then((result)=>{
        if(!result)
        {
            return response.status(404).send('no user found');
        }

        worker.find({
            farmer: id
        }).populate({
            path: 'assigned_to_field farmer', 
            select: 'name area field worker_history name number workers'
        }).then((result)=>{
            if(!result)
            {
                return response.status(404).send('no record found');
            }
            response.send(result);
        },(e)=>{
            response.status(400).send(e);
        }); 
    },(e)=>{
        response.status(400).send(e);
    });
});

app.delete('/new/singleWorker/:id',(request,response)=>{
    var id = request.params.id; 
    if(!ObjectID.isValid(id))
    {
        return response.status(400).send('ID not valid');
    }

    worker.findByIdAndRemove(id).then((result)=>{
        if(!result)
        {
            return response.status(404).send('no record found');
        }
        response.send(result);
    },(e)=>{
        response.status(400).send(e);
    });
});

app.patch('/new/worker/:id',(request,response)=>{
    var id = request.params.id; 
    var body = _.pick(request.body,['name','number','address','aadhar','assigned_status','assigned_to_field']);
    if(!ObjectID.isValid(id))
    {
        return response.status(400).send('ID not valid');
    }

    if(typeof request.body.assigned_status!='undefined')
    {
        if(request.body.assigned_status == false)
        {
            body.assigned_to_field = null;
        }
    }

    worker.findByIdAndUpdate(id,{$set:body},{new: true}).populate({
        path: 'assigned_to_field farmer', 
        select: 'name area field worker_history name number workers'
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

//---------------------SEASON--------------------------------------

app.post('/new/season/:Sub_field/:farmer_id',(request,response)=>{
    var sub_field_id = request.params.Sub_field; 
    var farmer_id = request.params.farmer_id;
    if(!ObjectID.isValid(sub_field_id))
    {
        return response.status(400).send('ID not valid');
    }

    sub_field.findById(sub_field_id).then((result)=>{
        if(!result)
        {
            return response.status(404).send('no sub field found');
        }
        
        inventory.find({
            name: request.body.crop, 
            type: 'food grain', 
            farmer: farmer_id
        }).then((result)=>{

            if(result.length==0)
            {
                return response.status(404).send('not present in inventory. Please refill the inventory')
            }

            var Season = new season({
                name: request.body.name, 
                start_date: new Date(+request.body.start_date),
                end_date: new Date(+request.body.end_date),
                sub_field: sub_field_id, 
                crop: request.body.crop, 
                finished: request.body.finished, 
                farmer: farmer_id
            }); 

            Season.save().then((result)=>{
                response.send(result);
            },(e)=>{
                response.status(400).send(e);
            })
        },(e)=>{
            response.status(400).send(e);
        });

    

    },(e)=>{
        response.status(400).send(e);
    });
});

app.get('/new/season',(request,response)=>{
    season.find().populate({
        path: 'sub_field', 
        select: 'name area field worker history', 
        populate: {
            path: 'field', 
            select: 'name area owner'
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

app.get('/new/singleSeason/:id',(request,response)=>{
    var id = request.params.id; 
    if(!ObjectID.isValid(id))
    {
        return response.status(400).send('ID not valid');
    }

    season.findById(id).populate({
        path: 'sub_field', 
        select: 'name area field worker history', 
        populate: {
            path: 'field', 
            select: 'name area owner'
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

app.get('/new/season/:farmer_id',(request,rsponse)=>{
    var id = request.params.farmer_id;
    if(!ObjectID.isValid(id))
    {
        return response.status(400).send('ID not valid')
    }
    
    signup.findById(id).then((result)=>{
        if(!result)
        {
            return response.status(404).send('no farmer found');
        }

        season.find({
            farmer: id
        }).populate({
            path: 'sub_field', 
            select: 'name area field worker history', 
            populate: {
                path: 'field', 
                select: 'name area owner'
            }  
        }).then((result)=>{
            if(result.length == 0)
            {
                return response.status(404).send('no season found');
            }
            response.send(result);
        },(e)=>{
            response.status(400).send(e);
        });
    },(e)=>{
        response.status(400).send(e);
    });
});

app.delete('/new/season/:id',(request,response)=>{
    var id = request.params.id;
    if(!ObjectID.isValid(id))
    {
        return response.status(400).send('ID not valid');
    }

    season.findByIdAndRemove(id).then((result)=>{
        if(!result)
        {
            return response.status(404).send('no record foudnd');
        }
        response.send(result);
    },(e)=>{
        response.status(400).send(e);
    });
});

app.patch('/new/season/:id/:farmer_id',(request,response)=>{
    var id = request.params.id; 
    var farmer_id = request.params.farmer_id;
    var body = _.pick(request.body,['name','start_date','end_date','crop','finished']); 
    if(!ObjectID.isValid(id))
    {
        return response.status(400).send('ID not valid');
    }

    if(body.crop)
    {
        inventory.find({
            name: body.crop, 
            type: 'food grain', 
            farmer: farmer_id
        }).then((result)=>{
            if(result.length == 0)
            {
                return response.status(404).send('not present in the inventory. please refill');
            }
            season.findByIdAndUpdate(id,{$set: body},{new : true}).populate({
                path: 'sub_field', 
                select: 'name area field worker history', 
                populate: {
                    path: 'field', 
                    select: 'name area owner'
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
        },(e)=>{
            response.status(400).send(e);
        });
    }
    else{
    season.findByIdAndUpdate(id,{$set: body},{new : true}).populate({
        path: 'sub_field', 
        select: 'name area field worker history', 
        populate: {
            path: 'field', 
            select: 'name area owner'
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
    }
});

//----------------------------SOWING--------------------------------------------------------------------------------------------------------------------------

app.post('/new/sowing/:id/:farmer_id',(request,response)=>{
    var id = request.params.id; 
    var farmer_id = request.params.farmer_id;
    if(!ObjectID.isValid(id))
    {
        return response.status(400).send('ID not valid');
    }

    season.findById(id).then((result)=>{
        if(!result)
        {
            return response.status(404).send('no season found');
        }

        var sub_field_id = result.sub_field;
        var crop = result.crop;
        inventory.find({
            name: result.crop, 
            type: 'food grain', 
            farmer: farmer_id
        }).then((result)=>{
            //console.log(result[0].quantity);
            if(result.length==0)
            {
                return response.status(404).send('food grain not present in the inventory. please refill')
            }

            if(result[0].quantity < request.body.amount_sown)
            {
                return response.status(400).send(`not enough ${result[0].name} in the inventory. Amount present is ${result[0].quantity}`);
            }

            var Sowing = new sowing({
                start_date: request.body.start_date, 
                status: request.body.status, 
                end_date: request.body.end_date, 
                season: id, 
                sub_field: sub_field_id, 
                crop: crop,
                amount_sown: request.body.amount_sown, 
                sown_unit: request.body.sown_unit, 
                expected_yield: request.body.expected_yield,
                yield_unit: request.body.yield_unit, 
                job_done_by: request.body.job_done_by, 
                job_duration: request.body.job_duration, 
                duration_unit: request.body.duration_unit, 
                total_cost: request.body.total_cost, 
                farmer: farmer_id, 
            });
            var new_quantity = result[0].quantity - request.body.amount_sown;
            inventory.update({
                name: result[0].name, 
                type: 'food grain', 
                farmer: farmer_id
            },{$set:{quantity: new_quantity}},{new: true}).then((result)=>{
                console.log(result);
            },(e)=>{
                 response.status(400).send(e);
            });

            Sowing.save().then((result)=>{

                response.send(result);
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

app.get('/new/sowing',(request,response)=>{
    sowing.find().populate({
        path: 'season sub_field', 
        select: 'name start_date end_date crop finished name area'
    }).then((result)=>{
        if(result.length == 0)
        {
            return response.status(404).send('no sowing activity found');
        }
        response.send(result);
    },(e)=>{
        response.status(400).send(e);
    });
});

app.get('/new/sowing/:farmer_id',(request,response)=>{
    var id = request.params.farmer_id; 
    if(!ObjectID.isValid(id))
    {
        return response.status(400).send('ID not valid');
    }

    signup.findById(id).then((result)=>{
        if(!result)
        {
            return response.status(404).send('no farmer found');
        }

        sowing.find({
            farmer: id
        }).populate({
            path: 'season sub_field', 
            select: 'name start_date end_date crop finished name area'  
        }).then((result)=>{
            if(result.length==0)
            {
                return response.status(404).send('no sowing activity found');
            }
            response.send(result);
        },(e)=>{
            response.status(400).send(e);
        });
    },(e)=>{
        response.status(400).send(e);
    });
});

app.get('/new/singleSowing/:id/',(request,response)=>{
    var id = request.params.id;
    if(!ObjectID.isValid(id))
    {
        return response.status(400).send('ID not valid');
    }

    sowing.findById(id).populate({
        path: 'season sub_field', 
        select: 'name start_date end_date crop finished name area'  
    }).then((result)=>{
        if(!result)
        {
            return response.status(404).send('no sowing activity found');
        }
        response.send(result);
    },(e)=>{
        response.status(400).send(e);
    });
});

app.delete('/new/sowing/:id',(request,response)=>{
    var id = request.params.id;
    if(!ObjectID.isValid(id))
    {
        return response.status(400).send('ID not valid');
    }

    sowing.findByIdAndRemove(id).then((result)=>{
        if(!result)
        {
            return response.status(404).send('no sowing activity found');
        }
        response.send(result);
        console.log(result.amount_sown);
        inventory.update({
            farmer: result.farmer, 
            name: result.crop, 
            type: 'food grain'
        },{$inc: {quantity: result.amount_sown}},{new: true}).then((result)=>{
            if(result.length == 0)
            {
                return response.status(404).send('no inventory record found');
            }
        },(e)=>{
            response.status(400).send(e);
        });
    },(e)=>{
        response.status(400).send(e);
    });

});

app.patch('/new/sowing/:id',(request,response)=>{
    var id = request.params.id;
    var body = _.pick(request.body,['start_date','status','end_date','amount_sown','sown_unit','expected_yield','yield_unit','job_done_by','job_duration','duration_unit','total_cost']);

    if(!ObjectID.isValid(id))
    {
        return response.status(400).send('ID not valid');
    }

    if(request.body.amount_sown)
    {
        //console.log('heyzzzz')

        sowing.findById(id).then((result)=>{
            if(!result)
            {
                return response.status(404).send('no sowing activity found');
            }
            var net_quantity = result.amount_sown - body.amount_sown;
            console.log(net_quantity);
            inventory.find({
                farmer: result.farmer, 
                name: result.crop, 
                type: 'food grain'
            }).then((result)=>{
                if(result.length == 0)
                {
                    return response.status(404).send('no inventory item found')
                }
                console.log(result[0].quantity + net_quantity);
                if(result[0].quantity + net_quantity < 0)
                {
                    return response.status(400).send('not enough quantity in the inventory, please refill!!');
                }
                inventory.update({
                    farmer: result[0].farmer, 
                    name: result[0].name, 
                    type: 'food grain'  
                },{$inc: {quantity: net_quantity}},{new: true}).then((result)=>{
                    if(!result)
                    {
                        //return response.status(404).send('hellozzz');
                        console.log('HELLOOO');
                    }
                },(e)=>{
                    response.status(400).send(e);
                });
                sowing.findByIdAndUpdate(id,{$set: body},{new: true}).populate({
                    path: 'season sub_field', 
                    select: 'name start_date end_date crop finished name area'
                }).then((result)=>{
                    response.send(result);
                },(e)=>{
                    response.status(400).send(e);
                });
            },(e)=>{
                response.status(400).send(e);
            });

        },(e)=>{
            response.status(400).send(e);
        });
    }
    else
    {
        sowing.findByIdAndUpdate(id,{$set: body},{new: true}).populate(
            {
                path: 'season sub_field', 
                select: 'name start_date end_date crop finished name area'
            }).then((result)=>{
                if(!result)
                {
                    return response.status(404).send('no sowing activity found');
                }
                response.send(result);
            },(e)=>{
                response.status(400).send(e);
            });
    }

     
});

//-----------------------IRRIGATION-----------------------------------

app.post('/new/irrigation/:season_id',(request,response)=>{
    var season_id = request.params.season_id; 
    //var farmer_id = request.params.farmer_id;

    if(!ObjectID.isValid(season_id))/*  && !ObjectID.isValid(farmer_id) */
    {
        return response.status(400).send('ID not valid');
    }

    season.findById(season_id).then((result)=>{
        if(!result)
        {
            return response.status(404).send('no season found');
        }

        var sub_field_id = result.sub_field; 
        var farmer_id = result.farmer; 
        var season_crop = result.crop;

        var Irrigation = new irrigation({
            start_date: request.body.start_date, 
            status: request.body.status, 
            end_date: request.body.end_date, 
            water_source: request.body.water_source, 
            quantity: request.body.quantity, 
            job_dobe_by: request.job_dobe_by, 
            job_duration : request.body.job_duration, 
            duration_unit: request.body.duration_unit, 
            total_cost: request.body.total_cost, 
            crop: season_crop,
            farmer: farmer_id, 
            sub_field: sub_field_id, 
            season: season_id
        });

        Irrigation.save().then((result)=>{
            response.send(result);
        },(e)=>{
            response.status(400).send(e);
        });
    },(e)=>{
        response.status(400).send(e);
    });
});

app.get('/new/irrigation',(request,response)=>{
    irrigation.find().populate({
        path: 'season sub_field', 
        select: 'name start_date end_date crop finished name area'
    }).then((result)=>{
        if(result.length == 0)
        {
            return response.status(404).send('no irrigation activity found');
        }
        response.send(result);
    },(e)=>{
        response.status(400).send(e);
    });
});

app.get('/new/irrigation/:farmer_id',(request,response)=>{
    var id = request.params.farmer_id; 
    if(!ObjectID.isValid(id))
    {
        return response.status(400).send('ID not valid');
    }

    signup.findById(id).then((result)=>{
        if(!result)
        {
            return response.status(404).send('no farmer found');
        }

        irrigation.find({
            farmer: id
        }).populate({
            path: 'season sub_field', 
            select: 'name start_date end_date crop finished name area' 
        }).then((result)=>{
            if(result.length == 0)
            {
                return response.status(404).send('no irrigation activity found');
            }

            response.send(result);
        },(e)=>{
            response.status(400).send(e);
        });
    },(e)=>{
        response.status(400).send(e);
    });
});

app.get('/new/singleIrrigation/:id',(request,response)=>{
    var id = request.params.id; 
    if(!ObjectID.isValid(id))
    {
        return response.status(400).send('ID not valid');
    }

    irrigation.findById(id).populate({
        path: 'season sub_field', 
        select: 'name start_date end_date crop finished name area'
    }).then((result)=>{
        if(!result)
        {
            return response.status(404).send('no irrigation activity found');
        }
        response.send(result);
    },(e)=>{
        response.status(400).send(e);
    });
});

app.delete('/new/irrigation/:id',(request,response)=>{
    var id = request.params.id; 
    if(!ObjectID.isValid(id))
    {
        return response.status(400).send('ID not valid');
    }

    irrigation.findByIdAndRemove(id).then((result)=>{
        if(!result)
        {
            return response.status(404).send('no irrigation activity found');
        }
        response.send(result);
    },(e)=>{
        response.status(400).send(e);
    });
});

app.patch('/new/irrigation/:id',(request,response)=>{
    var id = request.params.id; 
    var body =  _.pick(request.body,['start_date','status','end_date','water_source','quantity','job_done_by','job_duration','duration_unit','total_cost']);

    if(!ObjectID.isValid(id))
    {
        return response.status(400).send('ID not valid');
    }

    irrigation.findByIdAndUpdate(id,{$set: body},{new: true}).populate({
        path: 'season sub_field', 
        select: 'name start_date end_date crop finished name area'
    }).then((result)=>{
        if(!result)
        {
            return response.status(404).send('no irrigation activity found');
        }

        response.send(result);
        
    },(e)=>{
        response.status(400).send(e);
    });
});




app.listen(port,()=>{
    console.log(`started on port ${port}`);
});
