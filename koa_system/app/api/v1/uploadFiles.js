const Router = require('koa-router')


const { Auth } = require('../../../middlewares/auth')

const {Task,TaskImgs} = require('../../models/task')
const {UserCoverImgs} = require('../../models/user')
const {ActivityImgs,ActivityVideos} = require('../../models/activityInfo')
const {GroupInfo} = require('../../models/groupInfo')

const {uploadImg} = require('../../../utils/upload')
const router = new Router({
    prefix:"/v1/uploadFiles"
})



router.post('/files',uploadImg,new Auth().m,async(ctx)=>{
  let {type,activity_id} = ctx.request.body
  
  let videoPath = ctx.files.uploadVideo
  let imgPath = ctx.files.uploadImgUrl
  if(imgPath){
    await ActivityImgs.create({
      type,
      activity_id,
      url:imgPath
  })
  }
  if(videoPath){
    await ActivityVideos.create({
      type,
      activity_id,
      url:videoPath
    })
  }
  ctx.body={imgPath:imgPath,videoPath:videoPath}
  
})


router.post('/avatar',uploadImg,new Auth().m,async ctx=>{
  let avatar = ctx.files.uploadImgUrl
  ctx.body=avatar
})

module.exports = router


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


router.post('/taskImgs',uploadImg,new Auth().m,async ctx=>{
  let taskId = ctx.request.body.taskId
  let taskImg = ctx.files.uploadImgUrl
  await TaskImgs.create({
    taskId,
    url:taskImg
  })
})

