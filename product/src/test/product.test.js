const chai = require("chai");
const chaiHttp = require("chai-http");
const App = require("../app");
const expect = chai.expect;
require("dotenv").config();

chai.use(chaiHttp);


describe("Products", () => {
  let app;

  before(async () => {
    app = new App();
    await Promise.all([app.connectDB(), app.setupMessageBroker()])

    const authBase = process.env.AUTH_SERVICE || "http://auth:3000";

    // Ensure test user exists on auth service (ignore if already created)
    try {
      await chai
        .request(authBase)
        .post('/register')
        .send({ username: process.env.LOGIN_TEST_USER || 'testuser', password: process.env.LOGIN_TEST_PASSWORD || 'password' });
    } catch (e) {
      // ignore registration failures (e.g. username already taken)
    }

    // Authenticate with the auth microservice to get a token
    const authRes = await chai
      .request(authBase)
      .post('/login')
      .send({ username: process.env.LOGIN_TEST_USER || 'testuser', password: process.env.LOGIN_TEST_PASSWORD || 'password' });

    authToken = authRes.body.token;
    console.log('AUTH TOKEN:', authToken);
    app.start();
  });

  after(async () => {
    await app.disconnectDB();
    app.stop();
  });

  describe("POST /products", () => {
    it("should create a new product", async () => {
      const product = {
        name: "Product 1",
        description: "Description of Product 1",
        price: 10,
      };
      const res = await chai
        .request(app.app)
        .post("/api/products")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
            name: "Product 1",
            price: 10,
            description: "Description of Product 1"
          });

      expect(res).to.have.status(201);
      expect(res.body).to.have.property("_id");
      expect(res.body).to.have.property("name", product.name);
      expect(res.body).to.have.property("description", product.description);
      expect(res.body).to.have.property("price", product.price);
    });

    it("should return an error if name is missing", async () => {
      const product = {
        description: "Description of Product 1",
        price: 10.99,
      };
      const res = await chai
        .request(app.app)
        .post("/api/products")
        .set("Authorization", `Bearer ${authToken}`)
        .send(product);

      expect(res).to.have.status(400);
    });
  });
});

