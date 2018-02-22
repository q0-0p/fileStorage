const http = require('http');
const formidable = require('formidable');
const fs = require('fs');
const express = require('express');
const path = require('path');
const hbs = require('handlebars');
const port = process.env.PORT || 3000;
const consolidate = require('consolidate');
const util = require('util');


var app = express();

var folders = [];
var folders = fs.readdirSync('./files/');
app.engine('html', consolidate.handlebars);



var folders = [];
folders = fs.readdirSync('./files/');
var files = []


app.use(express.static('../files'));



app.get('/', (req, res) => {
  folders = fs.readdirSync('./files/');
  //display home page
  var folderListHTML = '';
  //display list of folders 
  folders.forEach((folderName) => {
    folderListHTML += '<li><a href="/' + folderName + '">' + folderName + '</a></li>';
  })

  res.render('index.html', { listOfFolders: folderListHTML });

})
//get rid of favicon get
function ignoreFavicon(req, res, next) {
  if (req.originalUrl === '/favicon.ico') {
    res.status(204).json({ nope: true });
  } else {
    next();
  }
}
app.use(ignoreFavicon);



var fileList = [];



app.get('/:folder', (req, res, next) => {
  console.log('HERE - FOLDER - ');

  var folderUsed = req.params.folder;


  var folderListHTML = '';
  folders = fs.readdirSync('./files/');
  folders.forEach((folderName) => {
    folderListHTML += '<li><a href="/' + folderName + '">' + folderName + '</a></li>';
  })
  var fileListHTML = '';

  //log the folder used, make sure it matches
  console.log(folders[folders.indexOf(folderUsed)]);


  //read the correct directory, get all the files in it. If it doesn't exist, run download the file
  fs.readdir('./files/' + folderUsed, (err, files) => {
    //TODO: fix if the file has no extension/extension wasn't able to be found
    if (err) {
      res.send(404);
      return console.log("Unable to find extension - added to other " + err);
    }

    files.forEach((file) => {

      fileList.push(file);

    })
    //populate the ul with the correct files
    fileList.forEach((file) => {
      //var decodedFile = encodeURI(file);
      fileListHTML += '<li id="' + file + '">' + '<a download href="../files/' + folderUsed + '/' + file + '" >' + file + " " + '</a><i id="' + file + '" class="far fa-trash-alt" style="cursor:pointer" onclick="confirm(\'Are you sure you want to delete this file?\')"></i></li>';
    })

    res.render('files.html', { folderName: req.params.folder, listOfFolders: folderListHTML, listOfFiles: fileListHTML });

  })
  //reset the files for new page
  fileList = [];


});




//post method:
//check if folder exists ( by checking the extension of the fil inputted), if so , put the file in that folder
// if the folder doesnt exist, create it
app.post('/upload', (req, res, next) => {

  //use formidable for files/forms
  var form = new formidable.IncomingForm();
  //console.log(form);
  //date to be used for the file name addition, so as to keep the files unique
  var today = new Date();
  var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date + ' ' + time;
  //console.log(dateTime);

  form.parse(req, (err, fields, files) => {
    // console.log(files);
    // console.log(fields);
    var oldpath = files.filetoupload.path;

    var fileExtension = path.extname(files.filetoupload.name);
    //console.log(fileExtension);
    var dirExists = fs.existsSync('./files/' + fileExtension.substring(1));

    var allFolders = [];

    //check if a folder with the extension is available
    if (!dirExists) {

      fs.mkdirSync('./files/' + fileExtension.substring(1));


    }
    if (dirExists && fileExtension === '') {
      
      if (!fs.existsSync('./files/other')) {
          fs.mkdirSync('./files/other');
      }
      var newpath = './files/' + 'other' + '/' + dateTime.toString() + " " + files.filetoupload.name;

      fs.rename(oldpath, newpath, (err) => {
        if (err) throw err;
        res.write('<div>File uploaded into ' + 'other' + '!</div>' + '<br>');
        res.write('<a href="/"><input type="button" value="Add another file"></a>');
        res.end();
      });
    return;
      //fs.mkdirSync('./files/' + fileExtension.substring(1));
    }
    var newpath = './files/' + fileExtension.substring(1) + '/' + dateTime.toString() + " " + files.filetoupload.name;

    fs.rename(oldpath, newpath, (err) => {
      if (err) throw err;
      res.write('<div>File uploaded into ' + fileExtension.substring(1) + '!</div>' + '<br>');
      res.write('<a href="/"><input type="button" value="Add another file"></a>');
      res.end();
    });
  });

})


//server port?
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
