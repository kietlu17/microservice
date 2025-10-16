const express = require("express");
const httpProxy = require("http-proxy");
const config = require("./config");

const proxy = httpProxy.createProxyServer();
const app = express();

// Route requests to the auth service
app.use("/auth", (req, res) => {
  proxy.web(req, res, { target: config.auth_service });
});

// Route requests to the product service
app.use("/products", (req, res) => {
  proxy.web(req, res, { target: config.product_service });
});

// Route requests to the order service
app.use("/orders", (req, res) => {
  proxy.web(req, res, { target: config.order_service });
});

// Start the server
const port = config.port;
app.listen(port, () => {
  console.log(`API Gateway listening on port ${port}`);
});
