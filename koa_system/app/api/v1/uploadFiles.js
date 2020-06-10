const Router = require('koa-router')


const { Auth } = require('../../../middlewares/auth')

const {TaskImgs,Task} = require('../../models/task')
const {UserCoverImgs} = require('../../models/user')
const {ActivityImgs} = require('../../models/activityInfo')
const {GroupInfo,GroupCoverImgs} = require('../../models/groupInfo')
const {UserQuestionImg} = require('../../models/questions')
const {uploadImg} = require('../../../utils/upload')
const router = new Router({
    prefix:"/v1/uploadFiles"
})



router.post('/files',uploadImg,new Auth().m,async(ctx)=>{
  let {type,activity_id} = ctx.request.body
  
  let imgPath = ctx.files.uploadImgUrl
  if(imgPath){
    await ActivityImgs.create({
      type,
      activity_id,
      url:imgPath
  })
  }
  
})

router.post('/video',uploadImg,new Auth().m,async(ctx)=>{
  
  let videoPath = ctx.files.uploadVideo

  ctx.body={videoPath:videoPath}
})

router.post('/avatar',uploadImg,new Auth().m,async ctx=>{
  let avatar = ctx.files.uploadImgUrl
  ctx.body=avatar
})


router.post('/logo',uploadImg,new Auth().m,async ctx=>{
  let groupId = ctx.request.body.groupId
  let logo = ctx.files.uploadImgUrl
  await GroupInfo.update({
    logo:logo
  },{
    where:{
        id:groupId
    }
  })
})


router.post('/userCoverImgs',uploadImg,new Auth().m,async ctx=>{

  let userCoverImg = ctx.files.uploadImgUrl
  await UserCoverImgs.create({
    uid:ctx.auth.uid,
    url:userCoverImg
  })
})

router.post('/groupCoverImgs',uploadImg,new Auth().m,async ctx=>{
  let groupId = ctx.request.body.groupId
  let groupCoverImg = ctx.files.uploadImgUrl
  await GroupCoverImgs.create({
    groupId,
    url:groupCoverImg
  })
})

router.post('/taskImgs',uploadImg,new Auth().m,async ctx=>{
  let taskId = ctx.request.body.taskId
  let taskImg = ctx.files.uploadImgUrl
  await TaskImgs.create({
    taskId,
    url:taskImg
  })
})

router.post('/taskCoverImg',uploadImg,new Auth().m,async ctx=>{
  let taskId = ctx.request.body.taskId
  let taskImg = ctx.files.uploadImgUrl

  await Task.update({
    coverImg:taskImg,
    
  },{
    where:{
      id:taskId
    }
  })
})


router.post('/userQuestionImg',uploadImg,new Auth().m,async ctx=>{
  let url = ctx.files.uploadImgUrl
  let {questionId} = ctx.request.body
  await UserQuestionImg.create({
    questionId,
    url
  })
})



module.exports = router
