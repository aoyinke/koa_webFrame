const Router = require('koa-router')

const path = require('path')
const fs = require('fs');
const { Auth } = require('../../../middlewares/auth')
const {success} = require('../../lib/helper')
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