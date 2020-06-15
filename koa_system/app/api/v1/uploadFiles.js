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
  
  if(imgPath.length){
    let tmp = imgPath.map(img=>{
      return {type,activity_id,url:img}
    })
    await ActivityImgs.bulkCreate(tmp)
  }
  
})

router.post('/video',uploadImg,new Auth().m,async(ctx)=>{
  
  let videoPath = ctx.files.uploadVideo

  ctx.body={videoPath:videoPath}
})

router.post('/avatar',uploadImg,new Auth().m,async ctx=>{
  let avatar = ctx.files.uploadImgUrl
  ctx.body=avatar[0]
})


router.post('/logo',uploadImg,new Auth().m,async ctx=>{
  let groupId = ctx.request.body.groupId
  let logo = ctx.files.uploadImgUrl
  await GroupInfo.update({
    logo:logo[0]
  },{
    where:{
        id:groupId
    }
  })
})


router.post('/userCoverImgs',uploadImg,new Auth().m,async ctx=>{

  let userCoverImg = ctx.files.uploadImgUrl
  userCoverImg = userCoverImg.map(item=>{
    return {uid:ctx.auth.uid,url:item}
  })
  await UserCoverImgs.bulkCreate(userCoverImg)
})

router.post('/groupCoverImgs',uploadImg,new Auth().m,async ctx=>{
  let groupId = ctx.request.body.groupId
  let groupCoverImg = ctx.files.uploadImgUrl
  groupCoverImg = groupCoverImg.map(item=>{
    return {groupId,url:item}
  })
  await GroupCoverImgs.bulkCreate(groupCoverImg)
})

router.post('/taskImgs',uploadImg,new Auth().m,async ctx=>{
  let taskId = ctx.request.body.taskId
  let taskImg = ctx.files.uploadImgUrl

  taskImg = taskImg.map(item=>{
    return {taskId,url:item}
  })
  await TaskImgs.bulkCreate(taskImg)
})

router.post('/taskCoverImg',uploadImg,new Auth().m,async ctx=>{
  let taskId = ctx.request.body.taskId
  let taskImg = ctx.files.uploadImgUrl

  await Task.update({
    coverImg:taskImg[0],
    
  },{
    where:{
      id:taskId
    }
  })
})


router.post('/userQuestionImg',uploadImg,new Auth().m,async ctx=>{
  let url = ctx.files.uploadImgUrl
  let {questionId} = ctx.request.body
  url = url.map(item=>{
    return {questionId,url:item}
  })
  await UserQuestionImg.bulkCreate(url)
})



module.exports = router
