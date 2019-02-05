# Consumer of the API
POC for Consumer driven contract testing - Consumer/client implementation

The pact tests are copied over to the POC Provider project and tested within it's unit tests.

Provider project: https://github.com/mrmgreen/consumer-contract-testing-provider

## Pact Broker
For the Pact broker I am using the Pact docker image https://hub.docker.com/r/dius/pact-broker

The Pact broker depends on a Postgres instance. There is a docker compose within the Pact broker repo that spins up pact and Postgres: https://github.com/DiUS/pact_broker-docker#running-with-docker-compose.

After `docker-compose up` command. You can run curl localhost to interact with the broker.

Add Consumer contract to broker:

``` shell
curl -X PUT -H "Content-Type: application/json" \
-d @<consumer contract json file> \
http://localhost/pacts/provider/<provider>/consumer/consumer/version/<consumer version>
```

## Is it safe to deploy
Run `yarn can-i-deploy:consumer`

This will query the broker and exit 1 or 0 depending on the result. It also provides a table as std out with details from the broker.

## Creating a stub from the pacts
There are several [different ways](https://docs.pact.io/getting_started/stubs). I have chosen to use docker as it offers the most flexibility in a CI pipeline.

``` javascript
docker pull pactfoundation/pact-stub-server
docker run -t -p 8080:8080 -v "$(pwd)/pacts/:/app/pacts" pactfoundation/pact-stub-server -p 8080 -d pacts
```

To test the stub is up:

``` shell
curl -v "http://localhost:8080/products" -H "Accept: application/json" -H "x-proposition: tv" -H "x-provider: tv" -H "x-territory: gb"
```


