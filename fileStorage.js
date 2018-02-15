const http = require('http');
const formidable = require('formidable');
const fs = require('fs');
const express = require('express');
const path = require('path');
const port = process.env.PORT || 3000;
const consolidate = require('consolidate');



var app = express();

app.engine('html', consolidate.handlebars);



var folders = [];
var folders = fs.readdirSync('./files/');

app.get('/', (req, res) => {
   res.sendFile('index.html');
  console.log('HERE - /');


})

app.get('/:folder', (req, res, next) => {
  console.log('HERE - FOLDER - ', req.params.folder);


  res.render('index.html', {folderName: req.params.folder});
});

app.post('/', function(req, res) {
  res.send('File: ' + req.body.filetoupload);
})


app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});

