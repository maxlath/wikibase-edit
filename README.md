# wikibase-edit
Edit [Wikibase](https://wikiba.se) from [NodeJS](https://nodejs.org). That can be [Wikidata](https://www.wikidata.org) or whatever Wikibase instance you have.

This project has received a [Wikimedia Project Grant](https://meta.wikimedia.org/wiki/Grants:Project/WikidataJS).

<div align="center">
  <a href="https://wikiba.se"><img height="150" src="https://raw.githubusercontent.com/maxlath/wikibase-sdk/main/assets/wikibase.png" alt="wikibase"></a>
  <!-- yeay hacky margin \o/ -->
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <a href="https://wikidata.org"><img src="https://raw.githubusercontent.com/maxlath/wikibase-sdk/main/assets/wikidata.jpg" alt="wikidata"></a>
</div>

[![NPM](https://nodei.co/npm/wikibase-edit.png?stars&downloads&downloadRank)](https://npmjs.com/package/wikibase-edit/)

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node](https://img.shields.io/badge/node-%3E=%20v7.6.0-brightgreen.svg)](http://nodejs.org)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

[Download stats](https://npm-stat.com/charts.html?package=wikibase-edit)

## Summary
- [Changelog](CHANGELOG.md)
- [Install](#install)
- [How-To](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md)
- [Development setup](https://github.com/maxlath/wikibase-edit/blob/main/docs/development_setup.md)
- [Contributing](#contributing)
- [See Also](#see-also)
- [You may also like](#you-may-also-like)
- [License](#license)

## Changelog
See [CHANGELOG.md](CHANGELOG.md) for version info

## Install
```sh
npm install wikibase-edit
```

Since `v6.0.0`, `wikibase-edit` uses the [ES module](https://nodejs.org/api/esm.html) syntax. If you would like to use CommonJS instead, you can install the latest version before that change:
```sh
npm install wikibase-edit@v5
```

## How-To
See [How-to](docs/how_to.md) doc

## Development
See [Development](docs/development.md) doc

## Contributing

Code contributions and propositions are very welcome, here are some design constraints you should be aware of:
* `wikibase-edit` focuses on exposing Wikibase write operations. Features about getting and parsing data should rather go to [`wikibase-sdk`](https://github.com/maxlath/wikibase-sdk)

## See Also
* [wikibase-sdk](https://github.com/maxlath/wikibase-sdk): a javascript tool suite to query and work with any Wikibase data, heavily used by wikibase-edit and wikibase-cli
* [wikibase-cli](https://github.com/maxlath/wikibase-cli): The friendly command-line interface to Wikibase
* [wikibase-dump-filter](https://npmjs.com/package/wikibase-dump-filter): Filter and format a newline-delimited JSON stream of Wikibase entities
* [wikidata-subset-search-engine](https://github.com/inventaire/entities-search-engine/tree/wikidata-subset-search-engine): Tools to setup an ElasticSearch instance fed with subsets of Wikidata
* [wikidata-taxonomy](https://github.com/nichtich/wikidata-taxonomy): Command-line tool to extract taxonomies from Wikidata
* [Other Wikidata external tools](https://www.wikidata.org/wiki/Wikidata:Tools/External_tools)

## You may also like

[![inventaire banner](https://inventaire.io/public/images/inventaire-brittanystevens-13947832357-CC-BY-lighter-blue-4-banner-500px.png)](https://inventaire.io)

Do you know [Inventaire](https://inventaire.io/)? It's a web app to share books with your friends, built on top of Wikidata! And its [libre software](http://github.com/inventaire/inventaire) too.

## License
[MIT](LICENSE.md)
