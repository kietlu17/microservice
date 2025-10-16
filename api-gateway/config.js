require("dotenv").config();

module.exports = {
    auth_service : process.env.AUTH_SERVICE,
    order_service : process.env.ORDER_SERVICE,
    product_service : process.env.PRODUCT_SERVICE,
    port : process.env.PORT
};