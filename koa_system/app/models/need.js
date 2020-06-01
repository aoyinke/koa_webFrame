
const { Sequelize, Model } = require('sequelize')
const sequelize = require('../../core/db')
const {User} = require('./user')

class Need extends Model{

    static async getNeedList(currentPage,category,uid){
        let type = ''
        category = parseInt(category)
        switch(category){
            case 100:
                type="众投活动"
                break
            case 101:
                type="大佬赞助"
                break
            case 102:
                type="技能需求"
                break
        }
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
                category:type
            }
        })
        needs = needs.rows.map(item=>{
            return Object.assign(item,{userInfo:userInfo})
        })
        return needs
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