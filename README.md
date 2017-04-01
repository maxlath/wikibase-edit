# Wikidata Edit
Edit [Wikidata](https://wikidata.org) from [NodeJS](https://nodejs.org)

Status: still many things to implement. [Your help is welcome](#contributing)

[![wikidata](https://raw.githubusercontent.com/maxlath/wikidata-sdk/master/assets/wikidata.jpg)](https://wikidata.org)

[![NPM](https://nodei.co/npm/wikidata-edit.png?stars&downloads&downloadRank)](https://npmjs.com/package/wikidata-edit/) [![NPM](https://nodei.co/npm-dl/wikidata-edit.png?months=6&height=3)](https://npmjs.com/package/wikidata-edit/)

## Summary
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Install](#install)
- [How-To](#how-to)
- [Development](#development)
- [Contributing](#contributing)
- [Donate](#donate)
- [See Also](#see-also)
- [You may also like](#you-may-also-like)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install
```sh
npm install --save wikidata-edit
```

## How-To
see [How-to](docs/how_to.md) doc

## Development

To run the tests, make sure to create a `config/local.js` overriding `config/default.js` with your Wikidata username and password

## Contributing

Code contributions and propositions are very welcome, here are some design constraints you should be aware of:
* `wikidata-edit` focuses on exposing Wikidata write operations. Features about getting and parsing data should rather go to [`wikidata-sdk`](https://github.com/maxlath/wikidata-sdk)

## Donate

We are developing and maintaining tools to work with Wikidata from NodeJS, the browser, or simply the command line, with quality and ease of use at heart. Any donation will be interpreted as a "please keep going, your work is very much needed and awesome. PS: love". [Donate](https://liberapay.com/WikidataJS)

## See Also
* [wikidata-sdk](https://github.com/maxlath/wikidata-sdk): a javascript tool suite to query and work with wikidata data, heavily used by wikidata-cli
* [wikidata-cli](https://github.com/maxlath/wikidata-cli): The command-line interface to Wikidata
* [wikidata-filter](https://github.com/maxlath/wikidata-filter): A command-line tool to filter a Wikidata dump by claim
* [wikidata-subset-search-engine](https://github.com/inventaire/wikidata-subset-search-engine): Tools to setup an ElasticSearch instance fed with subsets of Wikidata
* [wikidata-taxonomy](https://github.com/nichtich/wikidata-taxonomy): Command-line tool to extract taxonomies from Wikidata
* [Other Wikidata external tools](https://www.wikidata.org/wiki/Wikidata:Tools/External_tools):

## You may also like

[![inventaire banner](https://inventaire.io/public/images/inventaire-brittanystevens-13947832357-CC-BY-lighter-blue-4-banner-500px.png)](https://inventaire.io)

Do you know [inventaire.io](https://inventaire.io/)? It's a web app to share books with your friends, built on top of Wikidata! And its [libre software](http://github.com/inventaire/inventaire) too.

## License
[MIT](LICENSE.md)
