module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define('Order', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        total_amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "Pending",
        },
        shipping_address: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    return Order;
}