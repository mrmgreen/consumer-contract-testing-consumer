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
  afterEach(() => { console.log('afterEach'); return provider.verify();})

  describe("GET /voucher with a valid voucher", () => {
    const validVoucherId = 1234;
    const EXPECTED_BODY = {
      promotionId: validVoucherId,
      primaryProductId: 9999
    
    };
    before(() => {
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
            "Content-Type": "application/json; charset=utf-8"
          },
          body: EXPECTED_BODY
        }
      };
      return provider.addInteraction(interaction).then(() =>{});
    });

    it("returns the voucher data", () => {
      return getVouchers(validVoucherId)
      .then(response => {
        expect(response.data).to.eql(EXPECTED_BODY);
      })
      .catch((e) => expect(true).to.be(false))
    });
  });

  describe("GET /voucher with an invalid voucher", () => {
    const invalidVoucherId = 4567;
    before(() => {
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
          status: 404
        }
      };
      return provider.addInteraction(interaction).then(() => {});
    });

    it("returns a 404", () => {
      return getVouchers(invalidVoucherId)
      .then()
      .catch((e) => { 
        expect(e.response.status).to.eql(404);
      });
    });
  });

  describe("POST /voucher with a voucher", () => {
    const voucherDetails = { code: "MYENTSVOUCHER", action : "ADD" };
    before(() => {
      const interaction = {
        uponReceiving: "a request to create a voucher",
        withRequest: {
          method: "POST",
          path: `/vouchers`,
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "x-skyott-platform": "PC",
            "x-skyott-territory": "JC",
            "x-skyott-provider": "MOCK",
            "x-skyott-proposition": "MOCK",
            "x-SkyId-Token": "01-valid_user"
          },
          body: voucherDetails
        },
        willRespondWith: {
          status: 201,
          headers: {
            "Content-Type": "application/json; charset=utf-8"
          },
          body: {
            voucherId: 6789
          }
        }
      };
      return provider.addInteraction(interaction).then(() => {});
    });
    const EXPECTED_BODY = { voucherId: 6789 };
    it("returns a 201 and the voucherId", () => {
      return addVoucher(voucherDetails)
      .then(response => {
        expect(response.data).to.eql(EXPECTED_BODY);
        console.log('POST SUCCESS');
      })
      .catch(e => { console.log('error is...', e);})
    });
  });
});
