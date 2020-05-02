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
    Knowledge
} = require('./activityInfo')

const {GetActivityInfo} = require('./getActivityInfo')
const {Comment} = require('../models/comment')

class Community {
    constructor(art_id, type,category) {
        this.art_id = art_id
        this.type = type
        this.category = category
    }

    static async GetActivityInfo(activity_id,currentPage){
        let offset = (currentPage - 1) * 10;
        let activityInfoObj = {
            100:[],
            200:[],
            300:[],
            400:[]
        }
        let data1 = await this._findOwnDb(offset,Activity)
        let data2 = await this._findOwnDb(offset,GroupDynamic)
        let data3 = await this._findOwnDb(offset,Answer)
        let data4 = await this._findOwnDb(offset,Knowledge)
        
        return [].concat(data1,data2,data3,data4)
    }
    static async saveActivityInfo(activity_id,type,uid){

        await GetActivityInfo.create({
            activity_id,
            type,
            uid
        })
        
    }

    static async saveActivityInfoToOther(type,content,title,groupId,category){

        let res = []
        let newtype = parseInt(type)
        switch (newtype){
            case 100:
                res = await Activity.create({
                    content,
                    title,
                    groupId,
                    category
                })
                break
            case 200:
                res = await GroupDynamic.create({
                    content,
                    title,
                    groupId,
                    category
                })
                break
            case 300:
                res = await Answer.create({
                    content,
                    title,
                    groupId,
                    category
                })
            case 400:
                res = await Knowledge.create({
                    content,
                    title,
                    groupId,
                    category
                })
                
                break
            default:
                break

            
        }
        return res  
    }

    static async _findOwnDb(offset,db){
        let dataList = await db.findAndCountAll({
            
            //offet去掉前多少个数据
            offset,
            //limit每页数据数量
            limit: 10
        }).then(res => {
            let result = {};
            result.data = res.rows;
            result.total = res.count;
            return result;
        })

        return dataList
    }
    

    
}

module.exports = {
    Community
}
