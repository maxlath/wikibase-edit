# Development setup

## Summary

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Use test.wikidata.org](#use-testwikidataorg)
- [Install a local Wikibase with Docker](#install-a-local-wikibase-with-docker)
- [Config](#config)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Use [test.wikidata.org](https://test.wikidata.org)

**Pros**:
  * zero setup
**Cons**:
  * tests are slowed down by network latency
  * doesn't work when you're offline/on a bad connection

Tests should pass as any user can create properties on that instance. That's probably the easiest setup to get started.

## Install a local Wikibase with Docker

```sh
git clone https://github.com/wmde/wikibase-docker
cd wikibase-docker
docker-compose up -d wikibase
```

see [`Docker documentation`](https://docs.docker.com/compose/install/)

## Config

To run the tests, make sure to create a `config/local.js` overriding `config/default.js` with your Wikibase credentials
