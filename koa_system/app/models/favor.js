
const { Sequelize, Model } = require('sequelize')
const sequelize = require('../../core/db')

const {Community} = require('../models/community')

class Favor extends Model{

    static async userLikeIt(activity_id, type, uid) {
        const favor = await Favor.findOne({
            where: {
                activity_id,
                uid,
                type,
            }
        })
        return favor ? true : false
    }

    static async likeActivity(activity_id,type,uid){
        const favor = await Favor.findOne({
            where:{
                activity_id,
                type,
                uid
            }
        })
        if(favor){
            throw new global.errs.LikeError()
        }
        return sequelize.transaction(async t=>{
            await Favor.create({
                activity_id,
                type,
                uid
            },{transaction:t})
            const activity = await Community.getData(activity_id,type)
            await activity.increment('fav_nums',{
                by:1,
                transaction:t
            })
        })
    }

    static async dislikeActivity(activity_id,type,uid){
        const favor = await Favor.findOne({
            where:{
                activity_id,
                type,
                uid
            }
            
        })
        if(!favor){
            throw new global.errs.DislikeError()
        }
        return sequelize.transaction(async t=>{
            await favor.destroy({
                force:true,
                transaction:t
            })
            const activity = await Community.getData(activity_id,type)
            await activity.decrement('fav_nums',{
                by:1,
                transaction:t
            })
        })
    }

}


Favor.init({
    uid:Sequelize.INTEGER,
    activity_id:Sequelize.INTEGER,
    type:Sequelize.INTEGER,
}, { sequelize, tableName: 'favor' })


module.exports = {
    Favor
}