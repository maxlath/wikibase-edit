# Wikidata Edit
Edit [Wikidata](https://wikidata.org) from [NodeJS](https://nodejs.org)

Status: still many things to implement. [Your help is welcome](#contributing)

[![wikidata](https://raw.githubusercontent.com/maxlath/wikidata-sdk/master/assets/wikidata.jpg)](https://wikidata.org)

[![NPM](https://nodei.co/npm/wikidata-edit.png?stars&downloads&downloadRank)](https://npmjs.com/package/wikidata-edit/) [![NPM](https://nodei.co/npm-dl/wikidata-edit.png?months=6&height=3)](https://npmjs.com/package/wikidata-edit/)

## Summary
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Install](#install)
- [Config](#config)
- [API](#api)
  - [Label](#label)
    - [set label](#set-label)
  - [Claim](#claim)
    - [add claim](#add-claim)
    - [check if claim exists](#check-if-claim-exists)
  - [Reference](#reference)
    - [add reference](#add-reference)
  - [Entity](#entity)
    - [edit](#edit)
    - [create](#create)
- [Development](#development)
- [Contributing](#contributing)
- [Donate](#donate)
- [See Also](#see-also)
  - [wikidata-sdk](#wikidata-sdk)
  - [wikidata-cli](#wikidata-cli)
  - [wikidata-filter](#wikidata-filter)
  - [wikidata-subset-search-engine](#wikidata-subset-search-engine)
  - [wikidata-taxonomy](#wikidata-taxonomy)
  - [Other Wikidata external tools](#other-wikidata-external-tools)
- [You may also like](#you-may-also-like)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install
```sh
npm install --save wikidata-edit
```

## Config
```js
const config = {
  // Required
  username: 'my-wikidata-username',
  password: 'my-wikidata-password',

  // Optional
  verbose: true, // Default: false
  wikibaseInstance: 'https://mywikibase.instance/w/api.php', // Default: https://www.wikidata.org/w/api.php
  userAgent: 'my-project-name/v3.2.5 (https://project.website)' // Default: `wikidata-edit/${pkg.version} (https://github.com/maxlath/wikidata-edit)`
}
const wdEdit = require('wikidata-edit')(config)
```

## API

All functions return promises.
See also [Wikidata API documentation](https://www.wikidata.org/w/api.php).

### Label
#### set label
```js
// Add the label 'Bac à sable bulgroz' to the Sandbox entity (Q4115189) in French
wdEdit.label.set('Q4115189', 'fr', 'Bac à sable bulgroz')
```

### Claim
#### add claim
```js
// Add the Twitter username (P2002) 'bulgroz' to the Sandbox entity (Q4115189)
// Will fail if the claim already exists
wdEdit.claim.add('Q4115189', 'P2002', 'bulgroz')
```
#### check if claim exists
```js
// Does the Sandbox entity (Q4115189) already have the Twitter username (P2002) 'bulgroz'?
wdEdit.claim.exists('Q4115189', 'P2002', 'bulgroz')
.then(boolean => )
```

### Reference

#### add reference

```js
const claimGuid = 'Q4115189$E66DBC80-CCC1-4899-90D4-510C9922A04F'
const referenceUrl = 'https://example.org/rise-and-box-of-the-holy-sand-box'
wdEdit.reference.add(claimGuid, referenceUrl)
```

### Entity

#### edit
Edit an entity. Labels and descriptions will be set even if there are existing values for the given languages. Claims will be added to the entity existing claims, without checking for duplicates.
```js
wdEdit.entity.edit({
  // Required
  id: 'Q4115189',
  // Optional but one of labels, descriptions, or claims must be set
  labels: { en: 'a new label in English', fr: 'un nouveau label en français' },
  descriptions: { en: 'a new description', fr: 'une nouvelle description' },
  claims: {
    P1775: [ 'Q3576110', 'Q12206942' ]
    P2002: 'bulgroz'
  }
})
```

#### create
Create an entity from scratch.
```js
wdEdit.entity.create({
  labels: { en: 'a label', fr: 'un label' },
  descriptions: { en: 'a new description', fr: 'une nouvelle description' },
  claims: {
    P1775: [ 'Q3576110', 'Q12206942' ]
    P2002: 'bulgroz'
  }
})
```

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
