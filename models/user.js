const Sequelize=require('sequelize');

module.exports = class User extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            userid: {
                type: Sequelize.STRING(20),
                allowNull: false,
                unique: true,
            },
            password:{
                type: Sequelize.STRING(100),
                allowNull: true,
            },
        },{
            sequelize,
            timestamps: false,
            modelName: 'User',
            tableName:'users',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
}