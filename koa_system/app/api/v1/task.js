const Router = require('koa-router')

const {Auth} = require('../../../middlewares/auth')
const {success} = require('../../lib/helper')
const {Task,TaskImgs,TaskMessages} = require('../../models/task')
const router = new Router({
    prefix:"/v1/task"
})


router.post('/uploadTaskMessage',new Auth().m,async ctx=>{
    let messageInfo= ctx.request.body
    await TaskMessages.create({
        ...messageInfo,
        uid:ctx.auth.uid
    })
    success("上传进度成功")
})


router.post('/addCheckNums',new Auth().m,async ctx=>{
    let {taskId,groupId} = ctx.request.body
    let task = await Task.findOne({
        where:{
            groupId,
            id:taskId
        }
    })
    await task.increment('click_nums',{
        by:1,
    })
    success("阅读成功")
})

router.get('/getLatestMessage',new Auth().m,async ctx=>{
    let {groupId} = ctx.request.query
    let info = await TaskMessages.getLatestMessage(groupId)
    ctx.body = info
})

router.get('/getTaskMessages',new Auth().m,async ctx=>{
    let {taskId,groupId} = ctx.request.query
    let messageList = await TaskMessages.getGroupMessage(groupId,taskId)
    ctx.body = messageList
})

router.get('/getTaskInfo',new Auth().m,async ctx=>{
    let {taskId} = ctx.request.query
    let taskInfo = await Task.getTaskInfo(taskId)
    ctx.body = taskInfo
})

router.post('/deleteCoverImg',new Auth().m,async (ctx)=>{
    let {taskId,url} = ctx.request.body
    await TaskImgs.deleteTaskImg(taskId,url)
})

router.get('/taskList',new Auth().m,async ctx=>{
    let {groupId,belongActivity} = ctx.request.query
    let taskList = await Task.getTaskList(groupId,belongActivity)
    ctx.body = taskList
})


router.post('/addTask',new Auth().m,async ctx=>{
    let taskInfo = ctx.request.body
    let task = await Task.addTask(taskInfo,ctx.auth.uid)
    ctx.body = task
    
})

router.post('/deleteTask',new Auth().m,async ctx=>{
    let {taskId} = ctx.request.body
    await Task.deleteTask(taskId)
    success("删除任务成功~")
})

router.post('/changeTask',new Auth().m,async ctx=>{
    let taskInfo = ctx.request.body
    await Task.update({
        ...taskInfo
    },{
        where:{
            id:taskInfo.taskId
        }
    })
    
})


module.exports = router