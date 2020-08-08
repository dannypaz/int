# Scuff

### Before you begin

1. Install docker + docker-compose

### Getting Started

To run the full project and tests (to verify functionlity), run the following commands:

```
make
make test
```

### Dev Environment

The following command will copy the `.env-local` file to `.env` on the root directory and then start our docker-compose stack.

```
make dev
```

Once the server has started you can then run the tests to check if its functional:
```
make test
```

You can then navigate to http://localhost:8080/<your-valid-route>

### Routes

Per specification:

| METHOD | ROUTE | PARAMS |
| ---- | ---- | ---- |
| GET | /accounts?accountId=????? | can add as many `accountId` query params as you want |
| POST | /transactions | An array of Transaction Commands (please see reference)

### Insights

1. Used makefile so you dont have to install node on your machine
2. Used docker-compose so you dont have to install node on your machine
3. Versioned API
    - can be found at localhost:8080/ or localhost:8080/v1

The way I start was looking through the full document first and making notes for anything that would be a "gotcha". I then mapped out what the interfaces would look like for transactions, started thinking about input validations and overall project structure.

Easiest thing for me to do when first developing an MVP is creating service tests that will hit the apis via http with the expected request. This allows a simple in + out testing structure. Between having service tests + the typing w/ typescript, we can get decent coverage for an MVP. I could have unit tested the logic for processing each transaction command type, but this was mostly covered in the service tests.

I intentionally logged the `accountId` so that we can have an idea of what is going on during the tests however, if this was a production system, an accountId in the logs would be a nono. We'd either want to provide an "account id mask" or use an internal id that maps to the actual account id.

I created a `reset` endpoint so that you do not have to restart the server on test runs. This allows us to have a clean testing environment. Ideally we'd like to have a persistent store for these records instead.

Overall I enjoyed the take home project and hope you enjoy reviewing it,

** Danny Pazuchowski

### Enhancements

- Add TLS to endpoints
- Add authentication/authorization
- Add persistent store for transactions (mongodb for webscale, postgresql... etc...)
- Transaction Batching (each request will be its own batch so we can log and replay if needed)
- Archiving of transactions so we can replay them incase of network/host/db failures
