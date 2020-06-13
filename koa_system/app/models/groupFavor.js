
const { Sequelize, Model } = require('sequelize')
const sequelize = require('../../core/db')


class GroupFavor extends Model{
    
    static async userLikeIt(groupId, uid) {
        const favor = await GroupFavor.findOne({
            where: {
                groupId,
                uid
            }
        })
        return favor ? true : false
    }

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
           let {GroupInfo} = require('./groupInfo')
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
            let {GroupInfo} = require('./groupInfo')
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
}, { sequelize, tableName: 'groupFavor' })


module.exports = {
    GroupFavor
}