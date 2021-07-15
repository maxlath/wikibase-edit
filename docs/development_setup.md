# Development setup

Development setup is mostly about getting confortable with [automated tests](https://en.wikipedia.org/wiki/Test_automation): it's nice to add new features, it's better to know that those features won't be broken or removed by mistake. This can be done by adding automated tests: those tests will be run before publishing any new version to guarantee that the new version doesn't introduce any regression.

## Summary

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Install tests dependencies](#install-tests-dependencies)
- [Unit tests](#unit-tests)
  - [Run a single unit test file](#run-a-single-unit-test-file)
  - [Run all the unit tests](#run-all-the-unit-tests)
- [Integration tests](#integration-tests)
  - [Setup a test Wikibase instance](#setup-a-test-wikibase-instance)
    - [Use test.wikidata.org](#use-testwikidataorg)
    - [Install a local Wikibase with Docker](#install-a-local-wikibase-with-docker)
  - [Run a single integration test file](#run-a-single-integration-test-file)
  - [Run all the integration tests](#run-all-the-integration-tests)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install tests dependencies
```sh
npm install
```
This will install the dependencies we need to run tests, especially:
* [mocha](https://mochajs.org/): the executable to which we pass test files, and that defines the following global functions used in test files: `describe`, `it`, `beforeEach`, etc
* [should.js](https://shouldjs.github.io/): a lib to easily make assertions and throw errors when those assertions aren't true:
```js
(12).should.be.above(10) // will not throw
(12).should.be.below(10) // will throw and thus make the test fail
```

## Unit tests
[Unit tests](https://en.wikipedia.org/wiki/Unit_testing) are used to test a single function at once, and can be run without any other setup.

### Run a single unit test file
```sh
./node_modules/.bin/mocha ./tests/unit/parse_instance.js
```
Just try to run it, you can't break anything! And then try to modify the function it tests, `lib/parse_instance.js`, and see how that makes the tests fail.

To run only one test in that file, replace `it(` by `it.only(`

### Run all the unit tests
```sh
npm run test:unit
```

## Integration tests
[Integration tests](https://en.wikipedia.org/wiki/Integration_testing) are used to check that the function produce the desired behaviour on a Wikibase instance. We thus need to have a Wikibase instance at hand to run our functions against, thus the more elaborated setup.

### Setup a test Wikibase instance

Create a `./config/local.js` file overriding values in `./config/default.js` with your credentials on the Wikibase instance you want to use: either [test.wikidata.org](https://test.wikidata.org) or your own local Wikibase.

#### Use [test.wikidata.org](https://test.wikidata.org)
That's the easiest option.

**Pros**:
  * zero setup
**Cons**:
  * tests are slowed down by network latency
  * doesn't work when you're offline/on a bad connection

Tests should pass as any user can create properties on that instance. That's probably the easiest setup to get started.

#### Install a local Wikibase with Docker

```sh
git clone https://github.com/wmde/wikibase-docker
cd wikibase-docker
docker-compose up -d wikibase
```

See [`Docker documentation`](https://docs.docker.com/compose/install/)

### Run a single integration test file
```sh
./node_modules/.bin/mocha ./tests/integration/label/set.js
```
To run only one test in that file, replace `it(` by `it.only(`

### Run all the integration tests
```sh
npm run test:integration
```
