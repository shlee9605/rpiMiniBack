const Sequelize = require('sequelize');

module.exports = class Key extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            key: {
                type: Sequelize.STRING(10),
                allowNull: false,
            },
            photoURL1:{
                type: Sequelize.STRING,
                allowNull: true,
            },
            photoURL2:{
                type: Sequelize.STRING,
                allowNull: true,
            },
            photoURL3:{
                type: Sequelize.STRING,
                allowNull: true,
            },
            photoURL4:{
                type: Sequelize.STRING,
                allowNull: true,
            },
            winlose:{
                type: Sequelize.BOOLEAN,
                allowNull: true,
            },
            userid:{
                type: Sequelize.STRING(20),
                allowNull: true,
            },
        },{
            sequelize,
            timestamps: false,
            modelName: 'Key',
            tableName:'keys',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
}