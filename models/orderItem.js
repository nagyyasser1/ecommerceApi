module.exports = (sequelize, DataTypes) => {
    const OrderItem = sequelize.define('OrderItem', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        subtotal: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
    })

    return OrderItem;
}