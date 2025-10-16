require("dotenv").config();

module.exports = {
  mongoURI: process.env.MONGODB_PRODUCT_URI ,
  rabbitMQURI: process.env.RABBITMQ_URI,
  rabbitMQQueueOrder:  process.env.RABBITMQ_QUEUE_ORDERS,
  rabbitMQQueueProduct:  process.env.RABBITMQ_QUEUE_PRODUCTS,
  port: process.env.PORT,
  jwt_key: process.env.JWT_SECRET
};
