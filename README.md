This repo is part of a proof of concept into Consumer Driven Contract Tests. The project consists of a javascript Consumer, a Node Provider and a Pact Broker.

The project uses Pact as the CDC framework.

The Consumer tests spin up a Pact stubbed Provider to interact with the Consumer. Interactions, between the Provider and Consumer, form the basis of the Pact file, which is a Json file created once the tests are complete. 

These Pacts, of which there will be one per provider are then published to the Broker.

When the Provider tests are run, they will pull the Pact files from the Broker and verify the contracts against the Provider application.

Once the Provider tests are complete, the Provider will update the Broker with the results.

Accompanying Provider project: https://github.com/mrmgreen/consumer-contract-testing-provider

# Consumer of the API
POC for Consumer driven contract testing - Consumer/client implementation

## Pact Broker
For the Pact broker I am using the Pact docker image https://hub.docker.com/r/dius/pact-broker

The Pact broker depends on a Postgres instance. There is a docker compose within the Pact broker repo that spins up pact and Postgres: https://github.com/DiUS/pact_broker-docker#running-with-docker-compose.

After `docker-compose up` command. You can run curl localhost to interact with the broker.

## Publish pacts
Run `yarn publishPacts`

## Is it safe to deploy
Used in CI/CD pipepline to safely deploy the Consumer. The command below queries the Broker to see if the Provider has successfully verified the Consumer contract.

Run `yarn can-i-deploy:consumer`

This will query the broker and exit 1 or 0 depending on the result. It also provides a table as std out with details from the broker.

## Creating a stub from the pacts
Pact stubs are useful for e2e tests. They are created from the pact files.

There are several [different ways](https://docs.pact.io/getting_started/stubs). I have chosen to use docker as it offers the most flexibility in a CI pipeline.

``` javascript
docker pull pactfoundation/pact-stub-server
docker run -t -p 8080:8080 -v "$(pwd)/pacts/:/app/pacts" pactfoundation/pact-stub-server -p 8080 -d pacts
```

To test the stub is up:

``` shell
curl -v "http://localhost:8080/products" -H "Accept: application/json" -H "x-proposition: tv" -H "x-provider: tv" -H "x-territory: gb"
```


