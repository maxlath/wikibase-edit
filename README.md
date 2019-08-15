# Wikidata Edit
Edit [Wikidata](https://wikidata.org) from [NodeJS](https://nodejs.org)

This project is [funded by a Wikimedia Project Grant](https://meta.wikimedia.org/wiki/Grants:Project/WikidataJS).

<div align="center">
  <a href="https://wikiba.se"><img height="150" src="https://raw.githubusercontent.com/maxlath/wikibase-sdk/master/assets/wikibase.png" alt="wikibase"></a>
  <!-- yeay hacky margin \o/ -->
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <a href="https://wikidata.org"><img src="https://raw.githubusercontent.com/maxlath/wikibase-sdk/master/assets/wikidata.jpg" alt="wikidata"></a>
</div>

[![NPM](https://nodei.co/npm/wikibase-sdk.png?stars&downloads&downloadRank)](https://npmjs.com/package/wikibase-edit/)

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node](https://img.shields.io/badge/node-%3E=%20v6.4.0-brightgreen.svg)](http://nodejs.org)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

## Summary

- [Install](#install)
- [How-To](https://github.com/maxlath/wikidata-edit/blob/master/docs/how_to.md)
- [Development](#development)
- [Contributing](#contributing)
- [Donate](#donate)
- [See Also](#see-also)
- [You may also like](#you-may-also-like)
- [License](#license)

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
* [Other Wikidata external tools](https://www.wikidata.org/wiki/Wikidata:Tools/External_tools)

## You may also like

[![inventaire banner](https://inventaire.io/public/images/inventaire-brittanystevens-13947832357-CC-BY-lighter-blue-4-banner-500px.png)](https://inventaire.io)

Do you know [inventaire.io](https://inventaire.io/)? It's a web app to share books with your friends, built on top of Wikidata! And its [libre software](http://github.com/inventaire/inventaire) too.

## License
[MIT](LICENSE.md)
