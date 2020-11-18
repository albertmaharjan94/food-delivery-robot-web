const path = require("path");
const {v4 : uuidv4} = require('uuid')
const fs = require("fs")
const __upload_folder = __basedir + "/uploads/"

uploadOne = async ( {file, folder = null, validExt = null }) => {
    if(file != undefined){
        const valid = checkValidateOne(file, validExt).success;
        
        if(valid != true){
            return { "success" : false, "msg" : "Validation error" }
        }else{
            if(folder) createDirectories(folder);
            
            let _file = await file    
            tmp = readAndWriteFile(_file, folder)
            
            return { "success" : true, "msg" : "File saved", "data" : tmp }
            
        }
    }else{
        return { "success" : false, "msg"  : "Not supported" }
    }
    
}

uploadMany = async ( {file, folder = null, limit = null, validExt = null }) => {
    if(file != undefined){
        const valid = checkValidateMany(file, limit, validExt).success;
        
        if(valid != true){
            return { "success" : false, "msg" : "Validation error" }
        }else{
            if(folder) createDirectories(folder);
            
            if(!Array.isArray(file)){
                
                let _file = await file    
                tmp = readAndWriteFile(_file, folder)
                
                return { "success" : true, "msg" : "File saved", "data" : tmp }
            }else{
                fileNames = [];
                for (i = 0; i < file.length; i++) {
                    let _file = await file[i]
                    
                    tmp = readAndWriteFile(_file, folder)
                    
                    fileNames.push(tmp);
                }
                return { "success" : true, "msg" : "File saved", "data" : fileNames }
            }
        }
    }else{
        return { "success" : false, "msg"  : "Not supported" }
    }
    
}

deleteMany = function(filename, folder){
    
    pathname = folder ? __upload_folder + folder + "/" : __upload_folder;
    
    for(i of filename){
        try {
            if (fs.existsSync(pathname + i)) {
                fs.unlinkSync(pathname+i)
            }
        } catch(err) {
            console.error(err)
        }
    }
    
    return {success: true}
}
deleteOne = function({filename, folder}){
    console.log( filename, folder)
    pathname = folder ? __upload_folder + folder + "/" : __upload_folder;
    console.log(fs.existsSync(pathname + filename))
    try {
        if (fs.existsSync(pathname + filename)) {
            // fs.unlinkSync(pathname + filename)
        }
    } catch(err) {
        console.error(err)
    }
    return {success: true}
    
}

readAndWriteFile = function(file, folder){
    let tmp = `${uuidv4()}${path.extname(file.path)}`;
    // `${__upload_folder}${folder}/+${tmp}` : `${__upload_folder}${tmp}`;
    // let file_path = folder ? __upload_folder + folder + "/" + tmp : __upload_folder + tmp;
    let file_path = folder ?  `${__upload_folder}${folder}/${tmp}` : `${__upload_folder}${tmp}`;
    console.log(file_path);
    fs.readFile(file.path, function(error, data) {
            fs.writeFile(file_path, data, function(error) {
        });
    });
    return tmp;
}

checkValidateMany= ({file, limit= null, validExt= null}) => {
    if(validExt != null && typeof(validExt) != "object"){
        return { "success" : "false", "message" : "Validation error"}
    }else{
        if(limit !=null && file.length > limit){
            return { "success" : "false", "message" : "Validation error" }
        }
        if(validExt != null){
            if(!Array.isArray(file)){
                var ext = []
                ext.push(path.extname(file.path).replace('.', ''))
                ext = ext.filter((x, i, a) => a.indexOf(x) == i)
                var valid = ext.filter(x => !validExt.includes(x)).length == 0;
            }else{
                var ext = []
                for (i = 0; i < file.length; i++) {
                    ext.push(path.extname(file[i].path).replace('.', ''))
                }
                ext = ext.filter((x, i, a) => a.indexOf(x) == i)
                var valid = ext.filter(x => !validExt.includes(x)).length == 0;
            }
            
            return { "success" :  valid }
        }
        return { "success" : true }
    }
}

checkValidateOne= ({file, validExt= null}) => {
    if(validExt != null && typeof(validExt) != "object"){
        return { "success" : "false", "message" : "Validation error"}
    }else{
        if(Array.isArray(file)){
            return { "success" : "false", "message" : "Can only upload one file." }
        }
        if(validExt != null){
            if(!Array.isArray(file)){
                var ext = []
                ext.push(path.extname(file.path).replace('.', ''))
                ext = ext.filter((x, i, a) => a.indexOf(x) == i)
                var valid = ext.filter(x => !validExt.includes(x)).length == 0;
            }
            
            return { "success" :  valid }
        }
        return { "success" : true }
    }
}


function createDirectories(pathname) {
    pathname = pathname.replace(/^\.*\/|\/?[^\/]+\.[a-z]+|\/$/g, ''); 
    
    fs.mkdir(path.resolve(__upload_folder, pathname), { recursive: true }, e => {
        if (e) {
            console.error(e);
        }
     });
 }

module.exports = {
    uploadMany,
    uploadOne,
    deleteMany,
    deleteOne
}

