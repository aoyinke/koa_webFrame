require('module-alias/register')
const Koa = require('koa')
const koaBody = require('koa-body')
const path = require('path')
const static = require('koa-static')
const catchError = require('./middlewares/exception')
const InitManager = require('./core/init')

require('@models/user')
require('@models/activityInfo')
require('@models/comment')
require('@models/groupInfo')
require('@models/getActivityInfo')

const app = new Koa()
app.use(catchError)

app.use(koaBody({
    multipart:true,
    formidable:{
        keepExtensions: true,    // 保持文件的后缀
        maxFieldsSize:2 * 1024 * 1024, // 文件上传大小
        onFileBegin:(name,file) => { // 文件上传前的设置
          console.log(`name: ${name}`);
          console.log(file);
        },
        onError:(err,context)=>{
            console.log(err,context)
        }
      }
    
}))
app.use(static(path.join(__dirname)))


InitManager.initCore(app)

app.listen(3000)