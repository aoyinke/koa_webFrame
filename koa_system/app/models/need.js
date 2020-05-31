
const { Sequelize, Model } = require('sequelize')
const sequelize = require('../../core/db')
const {User} = require('./user')

class Need extends Model{

    static async getNeedList(currentPage,category,uid){
        let offset = (currentPage - 1) * 10;
        let userInfo = await User.findOne({
            where:{
                id:uid
            },
            raw:true,
            attributes:['avatar','nickName','college']
        })
        let needs = await Need.findAndCountAll({
            offset:offset,
            limit:10,
            raw:true,
            where:{
                category
            }
        })
        needs.rows.forEach(item=>{
            item.userInfo =userInfo
        })
        return needs.rows
    }

    

}



Need.init({
    uid:{type:Sequelize.INTEGER},
    content:Sequelize.STRING,
    fav_nums:{type:Sequelize.INTEGER,defaultValue:0},
    category:Sequelize.STRING,
    title:Sequelize.STRING
},{ sequelize, tableName: 'need' })

class Supply extends Model{
    
}

module.exports = {
    Need
}