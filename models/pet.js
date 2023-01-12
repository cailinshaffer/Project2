'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class pet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //parent in 1:M
      models.pet.hasMany(models.comment)
      models.pet.belongsToMany(models.user, {through:"users_pets"})
    }
  }
  pet.init({
    petId: DataTypes.INTEGER,
    type: DataTypes.STRING,
    age: DataTypes.INTEGER,
    breed: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'pet',
  });
  return pet;
};