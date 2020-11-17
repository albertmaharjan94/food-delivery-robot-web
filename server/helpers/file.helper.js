const path = require("path");
const {v4 : uuidv4} = require('uuid')
const fs = require("fs")


uploadFiles = async ( {file, folder = null, limit = null, validExt = null }) => {
    if(file != undefined){
        const valid = checkValidate(file, limit, validExt).success;
        
        if(valid != true){
            return { "success" : false, "msg" : "Validation error" }
        }else{
            if(folder) createDirectories("/uploads/" + folder);
            fileNames = [];
            for (i = 0; i < file.length; i++) {
                let _file = await file[i]
                
                tmp = readAndWriteFile(_file, folder)
                console.log(tmp);
                fileNames.push(tmp);
            }
            return { "success" : true, "msg" : "File saved", "data" : fileNames }
        }
    }else{
        return { "success" : false, "msg"  : "Not supported" }
    }
    
}

readAndWriteFile = function(file, folder){
    let tmp = `${uuidv4()}${path.extname(file.path)}`;
    let file_path = folder ? "./uploads/" + folder + "/" + tmp : "./uploads/" + tmp;
    fs.readFile(file.path, function(error, data) {
            fs.writeFile(file_path, data, function(error) {
        });
    });
    return tmp;
}

checkValidate= ({file, limit= null, validExt= null}) => {
    if(validExt != null && typeof(validExt) != "object"){
        return { "success" : "false", "message" : "Validation error"}
    }else{
        if(limit !=null && file.length > limit){
            return { "success" : "false", "message" : "Validation error" }
        }
        if(validExt != null){
            var ext = []
            for (i = 0; i < file.length; i++) {
                ext.push(path.extname(file[i].path).replace('.', ''))
            }
            ext = ext.filter((x, i, a) => a.indexOf(x) == i)
            console.log(ext, validExt);
            var valid = ext.filter(x => !validExt.includes(x)).length == 0;
            
            return { "success" :  valid }
        }
        return { "success" : true }
    }
}


function createDirectories(pathname) {
    const __dirname =  path.resolve();
    pathname = pathname.replace(/^\.*\/|\/?[^\/]+\.[a-z]+|\/$/g, ''); 
    fs.mkdir(path.resolve(__dirname, pathname), { recursive: true }, e => {
        if (e) {
            console.error(e);
        }
     });
 }

module.exports = {
    uploadFiles
}

