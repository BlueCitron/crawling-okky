'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    content: DataTypes.TEXT,
    writer: DataTypes.STRING,
    created_at: DataTypes.DATE
  }, {
    underscored: true,
    createdAt: false,
    updatedAt: false,
  });
  Comment.associate = function(models) {
    // associations can be defined here
    Comment.belongsTo(models.Post);
  };
  return Comment;
};