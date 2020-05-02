require('module-alias/register')
const Koa = require('koa')
const koaBody = require('koa-body')
const path = require('path')
const castchError = require('./middlewares/exception')
const InitManager = require('./core/init')
const static = require('koa-static')

require('@models/user')
require('@models/activityInfo')
require('@models/comment')
require('@models/groupInfo')
require('@models/getActivityInfo')

const app = new Koa()
app.use(castchError)

app.use(static(path.join(__dirname,'public')))
app.use(koaBody({
    multipart:true,
    formidable:{
        uploadDir:path.join(__dirname,'/public/img'),
        keepExtensions:true
    }
}))


InitManager.initCore(app)

app.listen(3000)