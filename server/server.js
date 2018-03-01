const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const hbs = require('handlebars');
const path = require('path');
const formidable = require('formidable');
const consolidate = require('consolidate');

const { mongoose } = require('./db/mongoose');
const { fileModel } = require('./models/file');
const { folderModel } = require('./models/folder');

var app = express();
var folders = [];
if(!fs.existsSync('./files/')){
fs.mkdirSync('./files/');}
var folders = fs.readdirSync('./files/');
app.engine('html', consolidate.handlebars);


var folders = [];
folders = fs.readdirSync('./files/');
var files = []


app.use(bodyParser.json());
app.use(express.static('../files'));


app.get('/', (req, res) => {

    var fold = folderModel.find().then((folders)=>{
    var filesExists=fs.existsSync('./files/')
        console.log(folders);

    
    if(filesExists)
    {
    //display home page
    var folderListHTML = '';
    //display list of folders 
    
        folders.forEach((folderName) => {
        folderListHTML += '<li><a href="/' + folderName.name + '">' + folderName.name + '</a></li>'; })
    }
    
    else{
        fs.mkdirSync('./files/');
    }
    res.render('index.html', { listOfFolders: folderListHTML });


    },(e)=>{
        res.status(400).send(e);
    });
    

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


    var folderUsed = req.params.folder;

    var filesExists=fs.existsSync('./files/')
    var folderListHTML = '';
    if(filesExists)
    folders = fs.readdirSync('./files/');
    else{
        fs.mkdirSync('./files/');
    }
    folders.forEach((folderName) => {
        folderListHTML += '<li><a href="/' + folderName + '">' + folderName + '</a></li>';
    })
    var fileListHTML = '';

    //log the folder used, make sure it matches
    //console.log(folders[folders.indexOf(folderUsed)]);


    //read the correct directory, get all the files in it. If it doesn't exist, run download the file
    fs.readdir('./files/' + folderUsed, (err, files) => {

        if (err) {
            res.sendStatus(404);
            return console.log("Unable to find extension - added to other " + err);
        }

        files.forEach((f) => {

            fileList.push(f);

        })
        //populate the ul with the correct files
        fileList.forEach((f) => {
            //var decodedFile = encodeURI(file);<a href="../delete/files/' + folderUsed + '/' + file + ' "></a>
            fileListHTML += '<li id="' + f + '">' + '<a download href="../files/' + folderUsed + '/' + f + '" >' + f + " " + '</a><i onclick="deleteFile(this.id)" id="../delete/files/' + folderUsed + '/' + f + '" class="far fa-trash-alt" style="cursor:pointer"  ></i></li>';
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
    var file = new fileModel();
    var dbFolder = new folderModel();


    //date to be used for the file name addition, so as to keep the files unique
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + ' ' + time;

    file.set({ fileUploadDate: dateTime });


    form.parse(req, (err, fields, files) => {

        var oldpath = files.filetoupload.path;

        file.set({ name: files.filetoupload.name });
        file.set({ fileLocation: oldpath });

        var fileExtension = path.extname(files.filetoupload.name);

        if( fileExtension.substring(1)===''){
            dbFolder.set({name: 'other'});
        }
        else{
            dbFolder.set({name : fileExtension.substring(1)});
            dbFolder.save().then((doc) => {
                console.log(`Folder ${doc.name} Created in database!`);
            }, (e) => {
                console.log('Folder already exists, new one not created');
            });
        }


        file.set({ ext: fileExtension });

        var dirExists = fs.existsSync('./files/' + fileExtension.substring(1));

        var allFolders = [];

        //check if a folder with the extension is available
        if (!dirExists) {

            fs.mkdirSync('./files/' + fileExtension.substring(1));


        }
        //check if the file used has no extension - for some reason dirExists is true when extension is "", because it checks only for /files/
        if (dirExists && fileExtension === '') {

            //check if other folder exists, if it doesnt make it
            if (!fs.existsSync('./files/other')) {
                fs.mkdirSync('./files/other');
            }
            //upload file to page "/files/other"
            var newpath = './files/other/' + dateTime.toString() + " " + files.filetoupload.name;
            file.set({ fileDestination: newpath });
            
            file.save().then((doc) => {
                console.log(`File ${doc.name} Uploaded !`);
            }, (e) => {
                res.status(400).send(e);
            });

            fs.rename(oldpath, newpath, (err) => {
                if (err) throw err;
                res.write('<div>File uploaded into other!</div><br>');
                res.write('<a href="/"><input type="button" value="Add another file"></a>');

                res.end();
            });
            return;

        }
        var newpath = './files/' + fileExtension.substring(1) + '/' + dateTime.toString() + " " + files.filetoupload.name;
        file.set({ fileDestination: newpath });
        file.save().then((doc) => {
            console.log(`File ${doc.name} Uploaded !`);
        }, (e) => {
            res.status(400).send(e);
        });
        fs.rename(oldpath, newpath, (err) => {
            if (err) throw err;
            res.write('<div>File uploaded into ' + fileExtension.substring(1) + '!</div>' + '<br>');
            res.write('<a href="/"><input type="button" value="Add another file"></a>');
            res.end();
        });
    });

})




//GET /files/e12jioje12







app.listen(3000, () => {
    console.log('Started on port 3000');
});