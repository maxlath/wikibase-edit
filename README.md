# Wikidata Edit
Edit [Wikidata](https://wikidata.org) from [NodeJS](https://nodejs.org)

Status: still many things to implement. [Your help is welcome](#contributing)

## Summary
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


  - [Install](#install)
  - [Config](#config)
  - [Claim](#claim)
    - [Add](#add)
    - [Exists](#exists)
  - [Development](#development)
  - [Contributing](#contributing)
  - [See Also](#see-also)
    - [wikidata-sdk](#wikidata-sdk)
    - [wikidata-cli](#wikidata-cli)
    - [wikidata-filter](#wikidata-filter)
    - [wikidata-taxonomy](#wikidata-taxonomy)
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
  userAgent: 'my-project-name/v3.2.5 (https://project.website)',
  wikibaseInstance: 'https://wb.me' // Defaults to https://www.wikidata.org
  verbose: true // Defaults to false
}
const wdEdit = require('wikidata-edit')(config)
```

## Claim
### Add
```js
// Add the Twitter username (P2002) 'bulgroz' to the Sandbox entity (Q4115189)
// Will fail if the claim already exists
wdEdit.claim.add('Q4115189', 'P2002', 'bulgroz')
```
### Exists
```js
// Does the Sandbox entity (Q4115189) already have the Twitter username (P2002) 'bulgroz'?
wdEdit.claim.exists('Q4115189', 'P2002', 'bulgroz')
// => Boolean
```

## Development

To run the tests, make sure to create a `config/local.js` overriding `config/default.js` with your Wikidata username and password

## Contributing

Code contributions and propositions are very welcome, here are some design constraints you should be aware of:
* `wikidata-edit` focuses on exposing Wikidata write operations. Features about getting and parsing data should rather go to [`wikidata-sdk`](https://github.com/maxlath/wikidata-sdk)

## See Also

### [wikidata-sdk](https://github.com/maxlath/wikidata-sdk)
a javascript tool suite to query and work with wikidata data, heavily used by wikidata-cli

### [wikidata-cli](https://github.com/maxlath/wikidata-cli)
The command-line interface to Wikidata

### [wikidata-filter](https://github.com/maxlath/wikidata-filter)
A command-line tool to filter a Wikidata dump by claim

### [wikidata-taxonomy](https://github.com/nichtich/wikidata-taxonomy)
Command-line tool to extract taxonomies from Wikidata

# License
[MIT](LICENSE.md)
