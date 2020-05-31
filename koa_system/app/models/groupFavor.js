
const { Sequelize, Model } = require('sequelize')
const sequelize = require('../../core/db')

const {GroupInfo} = require('../models/groupInfo')

class GroupFavor extends Model{
    
    static async likeGroup(groupId,uid){
        const favor = await GroupFavor.findOne({
            where:{
                groupId,
                uid
            }
        })
        if(favor){
            throw new global.errs.LikeError()
        }
        return sequelize.transaction(async t=>{
            await GroupFavor.create({
                groupId,
                uid
            },{transaction:t})
            const group = await GroupInfo.findOne({
                where:{
                    id:groupId
                }
            })
            await group.increment('fav_nums',{
                by:1,
                transaction:t
            })
        })
    }

    static async dislikeGroup(groupId,uid){
        const favor = await GroupFavor.findOne({
            where:{
                groupId,
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
            const group = await GroupInfo.findOne({
                where:{
                    id:groupId
                }
            })
            await group.decrement('fav_nums',{
                by:1,
                transaction:t
            })
        })
    }

}


GroupFavor.init({
    uid:Sequelize.INTEGER,
    groupId:Sequelize.INTEGER,
    status:{type:Sequelize.INTEGER,defaultValue:0}
}, { sequelize, tableName: 'groupFavor' })


module.exports = {
    GroupFavor
}