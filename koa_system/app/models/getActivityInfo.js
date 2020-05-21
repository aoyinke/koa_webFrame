
const { Sequelize, Model } = require('sequelize')
const sequelize = require('../../core/db')


class GetActivityInfo extends Model {
    
    static async getAllactivity(activity_id,type){
        let activities = await GetActivityInfo.findAll()
        for(let activity of activities){
            console.log(activity)
            // if(activity.groupId){

            // }
        }
    }
}


GetActivityInfo.init({
    uid:{type:Sequelize.INTEGER},
    activity_id: Sequelize.INTEGER,
    type:Sequelize.INTEGER,
    status:{type:Sequelize.INTEGER,defaultValue:0}
}, { sequelize, tableName: 'getactivityInfo' })


module.exports = {
    GetActivityInfo
}