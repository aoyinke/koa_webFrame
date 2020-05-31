

const {
    Op
} = require('sequelize')

const {
    Activity,
    GroupDynamic,
    Answer,
    Knowledge,
    ActivityImgs,
    ActivityVideos
} = require('./activityInfo')
const {GroupInfo} = require('../models/groupInfo')
const {GetActivityInfo} = require('./getActivityInfo')
const {Comment} = require('./comment')
const {User} = require('./user')
class Community {
    constructor(art_id, type,category) {
        this.art_id = art_id
        this.type = type
        this.category = category
    }

    static async getData(activity_id,type){
        let res = []
        const finder = {where:{id:activity_id}}
        switch (type){
            case 100:
                res = await Activity.findOne(finder)
                break
            case 200:
                res = await GroupDynamic.findOne(finder)
                break
            case 300:
                res = await Answer.findOne(finder)
            case 400:
                res = await Knowledge.findOne(finder)
                break
            default:
                break
        }
        return res
    }
    static async getInfoList(currentPage,category){
        let communityList = await GetActivityInfo.findAll({
            raw:true
        })

        let communityObj = {
            100:[],
            200:[],
            300:[],
            400:[]
        }

        for(let communityInfo of communityList){
            communityObj[communityInfo.type].push(communityInfo.activity_id)
        }
        const communities = []
        for(let key in communityObj){
            const ids = communityObj[key]
            if(ids.length == 0){
                continue
            }

            key = parseInt(key)
            communities.push(await Community._getListByType(ids,key,currentPage,category))
        }
        
        return communities[0]

        // return flatten(communities)
    }
    

    static async saveActivityInfo(activity_id,type,uid){

        await GetActivityInfo.create({
            activity_id,
            type,
            uid
        })
        
    }

    static async saveActivityInfoToOther(activity,uid){

        let res = []
        let newtype = parseInt(activity.type)
        let creator = {
            ...activity,
            uid
        }
        switch (newtype){
            case 100:
                res = await Activity.create(creator)
                break
            case 200:
                res = await GroupDynamic.create(creator)
                break
            case 300:
                res = await Answer.create(creator)
            case 400:
                res = await Knowledge.create(creator)
                break
            default:
                break

            
        }
        return res  
    }

    static async getCommunity(type,currentPage,category){
        let community = {}
        
        switch(parseInt(type)){
            case 100:
                community = Activity;
                break;
            case 200:
                community = GroupDynamic
                break;
            case 300:
                community = Answer
                break;
            case 400:
                community = Knowledge
        }
        let offset = (currentPage - 1) * 10;
        let dataList = await community.findAndCountAll({
            
            //offet去掉前多少个数据
            offset,
            //limit每页数据数量
            limit: 10,
            raw:true,
            where:{
                category
            }
            
        }).then(res => {
            let result = {};
            result.data = res.rows;
            result.total = res.count;
            return result;
        }).then(async res=> {
            
            let infoList = []
            if(res.data.length){
                for(let i of res.data){
                    let res = await Community._findOtherInfo(i.groupId,i.id,i)
                    infoList.push(res)
                }
            }
            
            
            return infoList
        })

        return dataList
    }

    static async _getListByType(ids, type,currentPage,category) {
        let offset = (currentPage - 1) * 10;
        let info = []
        let key = ""
        let communities = []
        const finder = {
            //offet去掉前多少个数据
            offset,
            //limit每页数据数量
            limit: 10,
            where: {
                id: {
                    [Op.in]: ids
                },
                category
            },
            raw:true

        }
        switch (type) {
            case 100:
                communities = await Activity.findAndCountAll(finder)
                info = await Community._addOtherInfo(communities.rows)
                key = "activities"
                break
            case 200:
                communities = await GroupDynamic.findAndCountAll(finder)
                info = await Community._addOtherInfo(communities.rows)
                key = "dynamic"
                break
            case 300:
                break
            case 400:
                communities = await Knowledge.findAndCountAll(finder)
                info = await Community._addOtherInfo(communities.rows)
                key = "knowledge"
                break
            default:
                break
        }
        console.log(info)
        return {[key]:info}
    }

    static async _addOtherInfo(communities){
        let info = []

        for(let data in communities){
            info.push(await Community._findOtherInfo(communities[data].groupId,communities[data].id,communities[data]))

        }
        return info
    }
    
    static async _findOtherInfo(groupId,activity_id,data){
        let res = data
        let groupInfo = await GroupInfo.findOne({
            where:{
                id:groupId
            },
            raw:true,
            attributes:['id','logo','tags','college','groupName','category']
        })
        let imgs = await ActivityImgs.findAll({
            where:{
                activity_id:activity_id,
            },
            raw:true,
            attributes:['url']
        })
        let videoSrc = await ActivityVideos.findOne({
            where:{
                activity_id
            },
            raw:true,
            attributes:['url']
        })
        let comments = await Comment.getComment(activity_id)
        let info = []
        for(let i in comments){
            let commentor = await User.findOne({
                where:{
                    id:comments[i].uid
                },
                raw:true,
                attributes:['nickName','avatar']
    
            })
            info.push(Object.assign(comments[i],commentor))
        }
        comments = info
        
        if(res){
            res.comments = comments
            res.videoSrc = videoSrc
            res.groupInfo = groupInfo
            res.imgs = imgs
        }
        
        return res
        
    }
}

module.exports = {
    Community
}
