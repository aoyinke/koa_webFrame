const fs = require('fs');
const path = require('path');
const dateFormat = require('./dateFormat.js')
const upload= {
        PUBLIC:"public/",
        UPLOAD: '/upload',
        IMAGE: '/image/',
        FILE: '/file/',
        MAXFILESIZE: 200 * 1024 * 1024, //上传文件大小
    }
const videoTail = ['mp4']
// 创建文件目录
const mkdirFile = (path) => {
    if(!fs.existsSync(path)){
        fs.mkdirSync(path, { recursive: true }, err => {
            console.error("文件上传失败")
            return
        });
    }
    
}
//保存文件
const saveFile = async (file, path) => {
    //创建可读流
    let reader  = fs.createReadStream(file)
    const newLocal = fs.createWriteStream(path);
    let upStream = newLocal;
    reader.pipe(upStream);
    return path
    
}

/**
 * 文件上传
 * ps 生成文件名为 SKD_日期
 *     文件路径根据年月分存放
 */
const uploadImg = async (ctx,next) => {
    var time = Date.parse(new Date())
    let date = dateFormat.dateFormat(time, 'yyyyMMddhhmmss');
    let file = ctx.request.files.file;
    let uploadVideo = ""
    let uploadImgUrl = ""
    let fileName = 'SKD_'+ upload.UPLOAD + upload.IMAGE //上传保存目录
    let fileYear = date.substring(4, 8) + '/' +
        date.substring(8, 10);
    let tail = file.name == 'blob' ? 'png' : file.name.split('.').pop()
    if(tail == 'mp4'){
        let videoName = 'SKD_' + upload.UPLOAD + upload.FILE
        let fileYearVideo = date.substring(4, 8) + '/' +
        date.substring(8, 10);
        let videoPath = path.join(videoName,fileYearVideo,date + '.' + tail)
        mkdirFile(videoName + fileYearVideo)
        uploadVideo = await saveFile(file.path, videoPath)
        uploadVideo = uploadVideo.split('\\').reduce((accumulator,currentValue)=>{
            return accumulator + '/' + currentValue
        })
        
    }else{
        let filePath = path.join(fileName, fileYear, date + '.' + tail); //根据时间拼接好文件名称
        mkdirFile(fileName + fileYear) //创建文件目录
            //创建文件目录
        uploadImgUrl = await saveFile(file.path, filePath)
        uploadImgUrl = uploadImgUrl.split('\\').reduce((accumulator,currentValue)=>{
              return accumulator + '/' + currentValue
        })
    }
   
            
         
    
    ctx.files = {uploadVideo:uploadVideo,uploadImgUrl:uploadImgUrl}
    next()
}

module.exports = {
    uploadImg
};