const path = require('path')
const chai = require('chai');
const expect = chai.expect;
const { Pact } = require('@pact-foundation/pact')
const { getVouchers, addVoucher } = require('../apis/vouchers');

describe("The voucher API", () => {
  const port = 8992;

  const provider = new Pact({
    port: port,
    log: path.resolve(process.cwd(), "logs", "mockserver-integration.log"),
    logLevel: 'error',
    dir: path.resolve(process.cwd(), "pacts"),
    spec: 2,
    consumer: "MyConsumer",
    provider: "VoucherManager",
    pactfileWriteMode: "overwrite"
  });

  // Setup the provider
  before(() => provider.setup());

  // Write Pact when all tests done
  after(() => provider.finalize());

  // verify with Pact, and reset expectations
  afterEach(() => provider.verify());

  describe("GET /voucher with a valid voucher", () => {
    const validVoucherId = 1234;
    const EXPECTED_BODY = {
      promotionId: validVoucherId,
      primaryProductId: 9999
    
    };
    before(done => {
      const interaction = {
        state: "i have a voucher with a matching id",
        uponReceiving: "a request for a voucher",
        withRequest: {
          method: "GET",
          path: `/vouchers/${validVoucherId}`,
          headers: {
            Accept: "application/json"
          }
        },
        willRespondWith: {
          status: 200,
          headers: {
            "Content-Type": "application/json"
          },
          body: EXPECTED_BODY
        }
      };
      provider.addInteraction(interaction).then(() => {
        done();
      });
    });

    it("returns the voucher data", done => {
      getVouchers(validVoucherId).then(response => {
        expect(response.data).to.eql(EXPECTED_BODY);
        done();
      }, done);
    });
  });

  describe("GET /voucher with an invalid voucher", () => {
    const invalidVoucherId = 4567;
    before(done => {
      const interaction = {
        state: "i have NO voucher with a matching id",
        uponReceiving: "a request for a voucher",
        withRequest: {
          method: "GET",
          path: `/vouchers/${invalidVoucherId}`,
          headers: {
            Accept: "application/json"
          }
        },
        willRespondWith: {
          status: 404,
          headers: {
            "Content-Type": "application/json"
          }
        }
      };
      provider.addInteraction(interaction).then(() => {
        done();
      });
    });

    it("returns a 404", done => {
      getVouchers(invalidVoucherId)
      .then()
      .catch((e) => { 
        expect(e.response.status).to.eql(404);
        done();
      });
    });
  });

  describe("POST /voucher with a voucher", () => {
    const voucherDetails = [{code:"MYENTSVOUCHER", action:"ADD"}];
    before(done => {
      const interaction = {
        uponReceiving: "a request to create a voucher",
        withRequest: {
          method: "POST",
          path: `/vouchers`,
          headers: {
            "Accept": "application/json",
            "x-skyott-platform": "PC",
            "x-skyott-territory": "JC",
            "x-skyott-provider": "MOCK",
            "x-skyott-proposition": "MOCK",
            "x-SkyId-Token": "01-valid_user"
          },
          body: JSON.stringify(voucherDetails)
        },
        willRespondWith: {
          status: 201,
          headers: {
            "Content-Type": "application/json"
          },
          body: {
            voucherId: 6789
          }
        }
      };
      provider.addInteraction(interaction).then(() => {
        done();
      });
    });
    const EXPECTED_BODY = { voucherId: 6789 };
    it("returns a 201 and the voucherId", done => {
      console.log('1 =', JSON.stringify(voucherDetails));
      addVoucher(voucherDetails).then(response => {
        expect(response.data).to.eql(EXPECTED_BODY);
        done();
      }, done);
    });
  });
});
