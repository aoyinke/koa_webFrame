
const { Sequelize, Model } = require('sequelize')
const sequelize = require('../../core/db')


class Need extends Model{

    static async getNeedList(currentPage,category){
        let offset = (currentPage - 1) * 10;
        let needs = await Need.findAndCountAll({
            offset:offset,
            limit:10,
            raw:true,
            where:{
                category
            }
        })
        return needs.rows
    }

    

}



Need.init({
    uid:{type:Sequelize.INTEGER},
    content:Sequelize.STRING,
    logo:Sequelize.STRING,
    nickName:Sequelize.STRING,
    fav_nums:{type:Sequelize.INTEGER,defaultValue:0},
    category:Sequelize.STRING
},{ sequelize, tableName: 'need' })

class Supply extends Model{
    
}

module.exports = {
    Need
}