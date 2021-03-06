import path from 'path';
import { expect } from 'chai';
import { Pact } from '@pact-foundation/pact';
import { getProducts, getProduct } from '../apis/products';

describe("The product API", () => {
  const port = 8993;

  const provider = new Pact({
    port: port,
    log: path.resolve(process.cwd(), "logs", "mockserver-products-integration.log"),
    logLevel: 'error',
    dir: path.resolve(process.cwd(), "pacts"),
    spec: 2,
    consumer: "MyConsumer",
    provider: "ProductsManager",
    pactfileWriteMode: "overwrite"
  });

  // Setup the provider
  before(() => provider.setup());

  // Write Pact when all tests finished
  after(() => provider.finalize());

  // Verify with Pact, and reset expectations
  afterEach(() => provider.verify());

  describe("GET /products", () => {
    const EXPECTED_BODY = {
      products: [{
        available: true,
        business_id: 'C_3P0',
        category: "ENTERTAINMENT",
        price: '15',
        static_id: "ENTERTAINMENT_SUBSCRIPTION"
      }]
    };
    before(async () => {
      const interaction = {
        uponReceiving: "a request for the product catalogue",
        withRequest: {
          method: "GET",
          path: `/products`,
          headers: { 'Accept': 'application/json', 'x-proposition': 'tv', 'x-provider': 'tv', 'x-territory': 'gb' }
        },
        willRespondWith: {
          status: 200,
          headers: {
            "Content-Type": "application/json; charset=utf-8"
          },
          body: EXPECTED_BODY
        }
      };
      await provider.addInteraction(interaction);
    });

    it("returns the product catalogue", async () => {
      const results = await getProducts();
      expect(results.data).to.eql(EXPECTED_BODY);
    });
  });

  describe("GET /product with a valid product id", () => {
    const validProductId = 'C_3P0';
    const EXPECTED_BODY = {
      available: true,
      business_id: validProductId,
      category: "ENTERTAINMENT",
      price: '15',
      static_id: "ENTERTAINMENT_SUBSCRIPTION"
    };
    before(async () => {
      const interaction = {
        state: "i have a product with the product id",
        uponReceiving: "a request for a product",
        withRequest: {
          method: "GET",
          path: `/product/${validProductId}`,
          headers: { 'Accept': 'application/json', 'x-proposition': 'tv', 'x-provider': 'tv', 'x-territory': 'gb' }
        },
        willRespondWith: {
          status: 200,
          headers: {
            "Content-Type": "application/json; charset=utf-8"
          },
          body: EXPECTED_BODY
        }
      };
      await provider.addInteraction(interaction);
    });

    it("returns the product data", async () => {
      const results = await getProduct(validProductId)
      expect(results.data).to.eql(EXPECTED_BODY);
    });
  });

  describe("GET /product with an invalid product id", () => {
    const invalidProductId = 'notValid';

    before(async () => {
      const interaction = {
        state: "i do not have a product with the product id",
        uponReceiving: "a request for a product",
        withRequest: {
          method: "GET",
          path: `/product/${invalidProductId}`,
          headers: { 'Accept': 'application/json', 'x-proposition': 'tv', 'x-provider': 'tv', 'x-territory': 'gb' }
        },
        willRespondWith: {
          status: 404
        }
      };
      await provider.addInteraction(interaction);
    });

    it("returns a 404", async () => {
      let results;
      try {
        results = await getProduct(invalidProductId)
      } catch (e) {
        expect(e.response.status).to.eql(404);
      }
      expect(results).to.eql(undefined);
    });
  });
});
