## Kiến trúc tổng quan

Hệ thống sử dụng một API Gateway để gom các service (auth, product, order) và làm proxy cho các domain tương ứng. Các service giao tiếp nội bộ qua RabbitMQ (AMQP) để giảm tải cho các REST call tới MongoDB.

- API Gateway: exposes một endpoint duy nhất cho client.
- Auth service: đăng ký/đăng nhập, cấp JWT.
- Product service: quản lý sản phẩm, publish thông tin tới queue `orders` khi có giao dịch.
- Order service: nhận message từ queue `orders`, xử lý đơn hàng và publish lại vào queue `products` để product service có thể trả chi tiết order.
- RabbitMQ: hai queue chính là `orders` và `products`.

Hình minh họa kiến trúc (xem trong thư mục `api_test`):

![docker](/api_test/docker.png)

## Cấu trúc microservice

Mỗi microservice trong dự án theo cảm hứng từ Clean Architecture (mạch module, loose coupling). Thư mục chính:

- `api-gateway/` — API gateway
- `auth/` — authentication microservice
- `product/` — product microservice
- `order/` — order microservice
- `utils/` — helper chung
- `api_test/` — ảnh chụp màn hình các API tests (đính kèm dưới README)

Ví dụ một số ảnh test API:

Register user:
![register](/api_test/register.png)

Login:
![login](/api_test/login.png)

Tạo product / Lấy product:
![post_product](/api_test/post_product.png)
![get_product](/api_test/get_product.png)

Mua hàng / giao dịch:
![buy_product](/api_test/buy_product.png)
![buy_products](/api_test/buy_products.png)

## Tech stack

- Node.js + Express
- MongoDB (mỗi service có DB riêng)
- RabbitMQ (AMQP)
- Docker + docker-compose
- Mocha, Chai (unit/integration tests)

## Các biến môi trường (ví dụ .env)

Các service đọc các biến môi trường sau (tạo file `.env` tương ứng trong thư mục `auth`, `order`, `product`, `api-gateway` hoặc đặt trong môi trường chạy Docker):

- Auth service (`auth/.env`):

```
MONGODB_AUTH_URI=mongodb://user:pass@host:27017/auth
JWT_SECRET=your_jwt_secret
PORT=3001
```

- Product service (`product/.env`):

```
MONGODB_PRODUCT_URI=mongodb://user:pass@host:27017/product
RABBITMQ_URI=amqp://user:pass@rabbitmq-host
RABBITMQ_QUEUE_ORDERS=orders
RABBITMQ_QUEUE_PRODUCTS=products
JWT_SECRET=your_jwt_secret
PORT=3002
```

- Order service (`order/.env`):

```
MONGODB_ORDER_URI=mongodb://user:pass@host:27017/order
RABBITMQ_URI=amqp://user:pass@rabbitmq-host
RABBITMQ_QUEUE_ORDERS=orders
RABBITMQ_QUEUE_PRODUCTS=products
PORT=3004
```

- API Gateway (`api-gateway/.env`):

```
AUTH_SERVICE=http://localhost:3001
PRODUCT_SERVICE=http://localhost:3002
ORDER_SERVICE=http://localhost:3004
PORT=3003
```

Lưu ý: repo hiện tại không có file `env.example`, các ví dụ trên được rút ra từ `src/config.js` mỗi service.

## Chạy project

1) Trên Docker (khuyến nghị để mô phỏng môi trường microservice):

- Tạo file `.env` trong từng thư mục `auth/`, `product/`, `order/`, `api-gateway/` theo phần "Các biến môi trường" ở trên.
- Xây dựng image: `docker-compose build`
- Chạy: `docker-compose up`

Sau khi chạy xong, API Gateway lắng nghe ở `http://localhost:3003` (hoặc port bạn cấu hình trong `.env`).

2) Trên localhost (phát triển nhanh, không dùng Docker):

- Tạo `.env` trong từng service như ở trên.
- Cài phụ thuộc: vào từng thư mục `auth/`, `product/`, `order/`, `api-gateway/` chạy `npm install`.
- Khởi chạy từng service: vào mỗi thư mục trên chạy `npm start`.

Sau đó test API qua `http://localhost:3003`.

## Tests

- Một số test mẫu nằm trong `product/src/test/product.test.js` và `auth/src/test/authController.test.js`.
- Chạy test từng service: vào thư mục service, chạy `npm test`.





