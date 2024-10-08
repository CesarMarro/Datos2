module.exports = (sequelize, DataTypes) => {
  const Dares = sequelize.define("Dares", {
    dare: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    timeLimit: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  Dares.associate = (models) => {
    Dares.belongsToMany(models.Tags, { through: "DareTags" });
    Dares.hasMany(models.Posts, {
      foreignKey: "DareId",
      onDelete: "CASCADE",
    });
  };

  return Dares;
};
