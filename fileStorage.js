const http = require('http');
const formidable = require('formidable');
const fs = require('fs');
const express = require('express');
const path = require('path');
const hbs = require('handlebars');
const port = process.env.PORT || 3000;
const consolidate = require('consolidate');



var app = express();

var folders = [];
var folders = fs.readdirSync('./files/');

app.engine('html', consolidate.handlebars);



var folders = [];
folders = fs.readdirSync('./files/');
var files = []

// function generateList(extension) {
//   var ul = document.getElementById("folderList");
//   var li = document.createElement("li");
//   li.appendChild(document.createTextNode(extension));
//   li.setAttribute("id", extension); // added line
//   ul.appendChild(li);
//   alert(li.id);
// }



app.get('/upload', (req, res) => {

  res.render('upload.html');





  console.log('HERE - upload /');

})



app.get('/', (req, res) => {
  var folderListHTML = '';
  folders.forEach((folderName) => {
    folderListHTML += '<li><a href="/' + folderName + '">' + folderName + '</a></li>';
  })



  res.render('index.html', { listOfFolders: folderListHTML });




})

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


  console.log(folders[folders.indexOf(folderUsed)]);

  fs.readdir('./files/' + folderUsed, (err, files) => {
    if (err) {
      return console.log("reeeeeeeeeeeeee" + err);
    }
    files.forEach((file) => {

      fileList.push(file);

    })
  }
  )


  fileList.forEach((file) => {
    fileListHTML += '<li id="' + file + '">' + file + '</li>';
  })
  res.render('files.html', { folderName: req.params.folder, listOfFolders: folderListHTML, listOfFiles: fileListHTML });
  fileList = [];


});






app.post('/upload', (req, res, next) => {



  // var form = new formidable.IncomingForm();


  //date to be used for the file name addition
  var today = new Date();
  var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date + ' ' + time;


  // form.parse(req , function (err, fields, files) {

  //   var oldpath = files.filetoupload.path;
  //   var fileExtension = path.extname(files.filetoupload.name);


  //   var dirExists = fs.existsSync('./files/' + fileExtension.substring(1));
  //   var allFolders = [];

  //   //check if a folder with the extension is available
  //   if (!dirExists) {
  //     fs.mkdirSync('./files/' + fileExtension.substring(1));

  //   }
  //   var newpath = './files/' + fileExtension.substring(1) + '/' + dateTime.toString() + " " + files.filetoupload.name;

  //   fs.rename(oldpath, newpath, function (err) {
  //     if (err) throw err;
  //     res.write('<div>File uploaded into ' + fileExtension.substring(1) + '</div>' + '<br>');
  //     res.write('<a href="/"><input type="button" value="Add another file"></a>');
  //     res.end();
  //   });
  // });


  // form.on('fileBegin', function (name, file) {
  //   file.path = __dirname + '/uploads/' + file.name;
  // });

  // form.on('file', function (name, file) {
  //   console.log('Uploaded ' + file.name);
  // });
  // console.log(req);
  //   res.sendFile(__dirname);

  res.render('upload.html');
})


app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});

