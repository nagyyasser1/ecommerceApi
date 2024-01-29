module.exports = (sequelize, DataTypes) => {
    const Size = sequelize.define('Size', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    });

    return Size;
}