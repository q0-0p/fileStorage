const mongoose = require('mongoose');

var fileModel = mongoose.model('file',
    {
        //if necessary, add validation:
        //ex: required: true, minlength:1, trim:true, default:false, default:null
        name            :           { type: String },
        fileLocation    :           { type: String },
        ext             :           { type: String }
    });


module.exports = {fileModel};