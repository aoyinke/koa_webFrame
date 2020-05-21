const {
    flatten
} = require('lodash')

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
    static async getInfoList(activityInfoList){
        let activityInfoObj = {
            100:[],
            200:[],
            300:[],
            400:[]
        }

        for(let activityInfo of activityInfoList){
            activityInfoObj[activityInfo.type].push(activityInfo.activity_id)
        }
        const activities = []
        for(let key of activityInfoObj){
            const ids = activityInfoObj[ley]
            if(ids == 0){
                continue
            }

            key = parseInt(key)
            activities.push()
        }
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

    static async _findDb(type){
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
    }

    static async findActivity(currentPage){
        let offset = (currentPage - 1) * 10;
        let dataList = await Activity.findAndCountAll({
            
            //offet去掉前多少个数据
            offset,
            //limit每页数据数量
            limit: 10,
            raw:true,
            group:'category'
            
        }).then(res => {
            let result = {};
            result.data = res.rows;
            result.total = res.count;
            return result;
        }).then(async res=> {
            
            let infoList = []
            if(res.data.length){
                for(let i of res.data){
                    let res = await Community._findOtherInfo(i.groupId,i.id)
                    i.comments = res.comments
                    i.videoSrc = res.videoSrc
                    i.groupInfo = res.groupInfo
                    i.imgs = res.imgs
                    infoList.push(i)
                }
            }
            
            
            return infoList
        })

        return dataList
    }

    static async findDynamic(currentPage){
        let offset = (currentPage - 1) * 10;
        let dataList = await GroupDynamic.findAndCountAll({
            
            //offet去掉前多少个数据
            offset,
            //limit每页数据数量
            limit: 10,
            raw:true
        }).then(res => {
            let result = {};
            result.data = res.rows;
            result.total = res.count;
            return result;
        }).then(async res=> {
            
            let infoList = []
            if(res.data.length){
                for(let i of res.data){
                    let comments = await Comment.getComment(i.id)
                    i.comments = comments
                    infoList.push(i)
                }
            }
            
            
            return infoList
        })

        return dataList
    }

    static async findAnswer(currentPage){
        let offset = (currentPage - 1) * 10;
        let dataList = await Answer.findAndCountAll({
            
            //offet去掉前多少个数据
            offset,
            //limit每页数据数量
            limit: 10,
            raw:true
        }).then(res => {
            let result = {};
            result.data = res.rows;
            result.total = res.count;
            return result;
        }).then(async res=> {
            
            let infoList = []
            if(res.data.length){
                for(let i of res.data){
                    let comments = await Comment.getComment(i.id)
                    i.comments = comments
                    infoList.push(i)
                }
            }
            
            
            return infoList
        })

        return dataList
    }

    static async findKnowledge(currentPage){
        let offset = (currentPage - 1) * 10;
        let dataList = await Knowledge.findAndCountAll({
            
            //offet去掉前多少个数据
            offset,
            //limit每页数据数量
            limit: 10,
            raw:true
        }).then(res => {
            let result = {};
            result.data = res.rows;
            result.total = res.count;
            return result;
        }).then(async res=> {
            
            let infoList = []
            if(res.data.length){
                for(let i of res.data){
                    let comments = await Comment.getComment(i.id)
                    i.comments = comments
                    infoList.push(i)
                }
            }
            
            
            return infoList
        })

        return dataList
    }
    

    static async _findOtherInfo(groupId,activity_id){
        let groupInfo = await GroupInfo.findOne({
            where:{
                id:groupId
            },
            raw:true,
            attributes:['id','logo','tags','college','groupName']
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
        return {comments,groupInfo,imgs,videoSrc:videoSrc}
        
    }
}

module.exports = {
    Community
}
