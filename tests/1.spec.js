const path = require('path')
const chai = require('chai');
const expect = chai.expect;
const { Pact } = require('@pact-foundation/pact')
const { getMeDogs } = require('../main');

describe("The Dog API", () => {
  const port = 8991;

  const provider = new Pact({
    port: port,
    log: path.resolve(process.cwd(), "logs", "mockserver-integration.log"),
    dir: path.resolve(process.cwd(), "pacts"),
    spec: 2,
    consumer: "MyConsumer",
    provider: "MyProvider",
    pactfileWriteMode: "merge"
  });

  const EXPECTED_BODY = [
    {
      dog: 1
    },
    {
      dog: 2
    }
  ];

  // Setup the provider
  before(() => provider.setup());

  // Write Pact when all tests done
  after(() => provider.finalize());

  // verify with Pact, and reset expectations
  afterEach(() => provider.verify());

  describe("get /dogs", () => {
    before(done => {
      const interaction = {
        state: "i have a list of dogs",
        uponReceiving: "a request for all dogs",
        withRequest: {
          method: "GET",
          path: "/dogs",
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

    it("returns the correct response", done => {
      getMeDogs().then(response => {
        expect(response.data).to.eql(EXPECTED_BODY);
        done();
      }, done);
    });
  });
});
