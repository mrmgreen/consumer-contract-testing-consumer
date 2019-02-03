# Consumer of the API
POC for Consumer driven contract testing - Consumer/client implementation

The pact tests are copied over to the POC Provider project and tested within it's unit tests.

Provider project: https://github.com/mrmgreen/consumer-contract-testing-provider

## Pact Broker
For the Pact broker I am using the Pact docker image https://hub.docker.com/r/dius/pact-broker
This depends on a Postgres DB. I am using the docker Postgres https://hub.docker.com/_/postgres
