'use strict';
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    title: DataTypes.STRING,
    writer: DataTypes.STRING,
    content: DataTypes.TEXT,
    url: DataTypes.STRING,
    created_at: DataTypes.DATE,
  }, {
    underscored: true,
    createdAt: false,
    updatedAt: false,
    tableName: 'post_okky',
  });
  Post.associate = function(models) {
    // associations can be defined here
    Post.hasMany(models.Comment);
  };
  return Post;
};