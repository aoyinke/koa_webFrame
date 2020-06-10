
const { Sequelize, Model,Op } = require('sequelize')
const sequelize = require('../../core/db')
const {User} = require('./user')

class Need extends Model{

    static async getNeedList(currentPage,category){
        let type = ''
        let userInfo
        category = parseInt(category)
        switch(category){
            case 100:
                type="众投活动"
                break
            case 101:
                type="梦想成真"
                break
            case 102:
                type="技能需求"
                break
        }
        let offset = (currentPage - 1) * 10;
        
        let needs = await Need.findAndCountAll({
            offset:offset,
            limit:10,
            raw:true,
            where:{
                category:type
            }
        })
        if(needs.rows.length){
            let uids = needs.rows.map(need=>need.uid)
            let users = await User.findOne({
                where:{
                    id: {
                        [Op.in]: uids
                    },
                },
                raw:true,
                attributes:['avatar','nickName','college','id']
            })
            needs = needs.rows.map(item=>{
                if(Array.isArray(users)){
                    userInfo = users.find(user=> user.id === item.uid)
                }else{
                    userInfo = users
                }
                
                return Object.assign(item,{userInfo:userInfo})
            })
        }
        
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