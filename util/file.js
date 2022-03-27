const fs = require('fs');

const deleteFile = (filePath) => {

    // unlink deletes file at the end of the file path provided
    fs.unlink(filePath, (err)=>{

        if(err){
            throw err;
        }

    });
    
}

exports.deleteFile = deleteFile;