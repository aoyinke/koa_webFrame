
const { Sequelize, Model } = require('sequelize')
const sequelize = require('../../core/db')

class GetActivityInfo extends Model {
    
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