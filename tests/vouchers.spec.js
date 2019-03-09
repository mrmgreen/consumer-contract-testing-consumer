import path from 'path';
import { expect } from 'chai';
import { Pact } from '@pact-foundation/pact';
import { getVouchers, addVoucher } from '../apis/vouchers';

describe("The voucher API", () => {

  const provider = new Pact({
    port: 8992,
    log: path.resolve(process.cwd(), "logs", "mockserver-vouchers-integration.log"),
    logLevel: 'error',
    dir: path.resolve(process.cwd(), "pacts"),
    spec: 2,
    consumer: "MyConsumer",
    provider: "VoucherManager",
    pactfileWriteMode: "overwrite"
  });

  // Setup the provider
  before(() => provider.setup());

  // Write Pact when all tests have finshed
  after(() => provider.finalize());

  // Verify with Pact, and reset expectations
  afterEach(() => provider.verify());

  describe("GET /voucher with a valid voucher", () => {
    const validVoucherId = 1235;
    
    before(async () => {
      const interaction = {
        state: "I have a voucher with a matching id",
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
          body: { promotionId: validVoucherId, primaryProductId: 9999 }
        }
      };
      await provider.addInteraction(interaction);
    });

    it("returns the voucher data", async () => {
        const result = await getVouchers(validVoucherId);
        expect(result.data).to.eql({ promotionId: validVoucherId, primaryProductId: 9999 });
    });
  });

  describe("GET /voucher with an invalid voucher", () => {
    const invalidVoucherId = 4567;
    before(async () => {
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
      await provider.addInteraction(interaction);
    });

    it("returns a 404", async () => {
      let result;
      try {
        result = await getVouchers(invalidVoucherId);
      } catch (e) {
        expect(e.response.status).to.eql(404);
      }
      expect(result).to.eql(undefined);
    });
  });

  describe("POST /voucher with a voucher code and action ADD", () => {
    const voucherDetails = { code: "MYENTSVOUCHER", action : "ADD" };
    
    before(async () => {
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
      await provider.addInteraction(interaction);
    });

    const EXPECTED_BODY = { voucherId: 6789 };

    it("returns a 201 and the voucherId", async () => {
      const result = await addVoucher(voucherDetails);
      expect(result.data).to.eql(EXPECTED_BODY);
    });
  });
});
