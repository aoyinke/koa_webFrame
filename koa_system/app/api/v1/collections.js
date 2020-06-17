const Router = require('koa-router')

const {Auth} = require('../../../middlewares/auth')
const {success} = require('../../lib/helper')
const {GroupInfo,Applicant,GroupCoverImgs} = require('../../models/groupInfo')
const {Collections} = require('../../models/collections')
const router = new Router({
    prefix:"/v1/collection"
})

router.post('/publishCollections', new Auth().m,async (ctx)=>{
    let collectionInfo = ctx.request.body
    let collection = await Collections.create({
        ...collectionInfo
    })
    ctx.body = collection

})

router.get('/getCollections', new Auth().m,async (ctx)=>{
    let {type,groupId} = ctx.request.query
    let collectionList = await Collections.getColleciton(type,groupId)
    ctx.body = collectionList

})

module.exports = router