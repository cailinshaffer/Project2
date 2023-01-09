'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class pets extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //parent in 1:M
      models.pets.hasMany(models.comment)
    }
  }
  pets.init({
    type: DataTypes.STRING,
    age: DataTypes.INTEGER,
    breed: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'pets',
  });
  return pets;
};