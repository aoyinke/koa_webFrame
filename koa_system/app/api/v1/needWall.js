const Router = require('koa-router')

const {Auth} = require('../../../middlewares/auth')
const {success} = require('../../lib/helper')
const {Need} = require('../../models/need')
const router = new Router({
    prefix:"/v1/needWall"
})


router.get('/needList',new Auth().m,async ctx=>{
    let {currentPage,category} = ctx.request.query
    let needList = await Need.getNeedList(currentPage,category)
    ctx.body = needList
})


router.post('/addNeed',new Auth().m,async ctx=>{
    let needInfo = ctx.request.body
    await Need.create({
        uid:ctx.auth.uid,
        ...needInfo
    })
    success("添加需求成功~")
})

router.post('/deleteNeed',new Auth().m,async ctx=>{
    let {needId} = ctx.request.body
    await Need.destroy({
        where:{
            id:needId
        },
        force:true
    })
    success("删除需求成功~")
})

router.post('/changeNeed',new Auth().m,async ctx=>{
    let {needId,category,content} = ctx.request.body
    await Need.update({
        category,
        content
    },{
        where:{
            id:needId
        }
    })
    success("更改需求成功~")
})


module.exports = router