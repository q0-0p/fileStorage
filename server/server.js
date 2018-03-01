const express = require('express');
const bodyParser = require('body-parser');



const {mongoose} = require('./db/mongoose');
const {fileModel} = require('./models/file');

var app = express();

app.use(bodyParser.json());
//app.use(express.static('../files'));

app.post('/file', (req,res)=> {
    var file = new fileModel({
        name: req.body.name
      
    });

    file.save().then((doc)=>{
        res.send(doc);
    }, (e)=>{
        res.status(400).send(e);
    });
});


//GET /files/e12jioje12







app.listen(3000, () =>{
    console.log('Started on port 3000');
});