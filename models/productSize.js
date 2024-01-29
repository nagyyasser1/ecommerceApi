module.exports = (sequelize, DataTypes) => {
    const ProductSize = sequelize.define('ProductSize', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    });

    return ProductSize;
}