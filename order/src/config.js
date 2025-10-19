require('dotenv').config();

module.exports = {
    mongoURI: process.env.MONGODB_ORDER_URI,
    rabbitMQURI: process.env.RABBITMQ_URI,
    rabbitMQQueueOrder:  process.env.RABBITMQ_QUEUE_ORDERS,
    rabbitMQQueueProduct:  process.env.RABBITMQ_QUEUE_PRODUCTS,
    port: process.env.PORT_ORDER
};
  