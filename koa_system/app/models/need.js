
const { Sequelize, Model,Op } = require('sequelize')
const sequelize = require('../../core/db')
const {User} = require('./user')
const {NeedFavor} = require('./favor')
class Need extends Model{

    static async findNeed(needId,category){
        let needInfo = await Need.findOne({
            where:{
                id:needId,
                category
            }
        })
        return needInfo
    }

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
            let tmp = []
            let res = {}
            for(let i = 0;i<needs.rows.length;i++){
                let {uid,id,category} = needs.rows[i]
                if(Array.isArray(users)){
                    userInfo = users.find(user=> user.id === uid)
                }else{
                    userInfo = users
                }
                let fav_status = await NeedFavor.userLikeIt(id,category,uid)
                res = Object.assign(needs.rows[i],{userInfo:userInfo,fav_status})
                tmp.push(res)
            }
            needs = tmp
             
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