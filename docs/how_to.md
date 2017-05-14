# How-To

## Summary

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Config](#config)
  - [Custom Wikibase instance](#custom-wikibase-instance)
- [API](#api)
  - [Label](#label)
    - [set label](#set-label)
  - [Claim](#claim)
    - [add claim](#add-claim)
    - [check if claim exists](#check-if-claim-exists)
    - [remove claim](#remove-claim)
  - [Reference](#reference)
    - [add reference](#add-reference)
  - [Entity](#entity)
    - [edit](#edit)
    - [create](#create)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

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

### Custom Wikibase instance

If you use a custom Wikibase instance, additionnally to passing the `wikibaseInstance` option (see above), make sure to re-fetch properties from the associated SPARQL endpoint. Otherwise, you will be stuck with [wikidata.org hard coded properties](https://github.com/maxlath/wikidata-edit/blob/ae13c6d5923edd3c092f25ee76fa141e7777aad0/lib/properties/properties.js).
```sh
cd project_folder/node_modules/wikidata-edit
# Make sure wikidata-cli is installed (especially if you installed wikidata-edit in production mode)
npm install wikidata-cli
export SPARQL_ENDPOINT='https://query.mywikibase.instance/sparql'; npm run update-properties
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

### Description
#### set description
```js
// Add the description 'description du Bac à sable bulgroz' to the Sandbox entity (Q4115189) in French
wdEdit.description.set('Q4115189', 'fr', 'description du Bac à sable bulgroz')
```

### Claim
#### add claim
```js
// Add the Twitter username (P2002) 'bulgroz' to the Sandbox entity (Q4115189)
// Will fail if the claim already exists
wdEdit.claim.add('Q4115189', 'P2002', 'bulgroz')

```
Special cases:
```js
// Monolingualtext property
wdEdit.claim.add('Q4115189', 'P1476', [ 'bulgroz', 'it' ])

// Time property: only year precision is supported yet (PR welcome!)
wdEdit.claim.add('Q4115189', 'P569', '1802')

// Quantity:
// pass a single value for a count without a specific unit
wdEdit.claim.add('Q4115189', 'P1106', 9000)
// pass an array for a value with a specific unit. Example here to specify minutes (Q7727)
wdEdit.claim.add('Q4115189', 'P2097', [ 9000, 'Q7727' ] )
```

#### check if claim exists
```js
// Does the Sandbox entity (Q4115189) already have the Twitter username (P2002) 'bulgroz'?
wdEdit.claim.exists('Q4115189', 'P2002', 'bulgroz')
.then(boolean => )
```

#### remove claim
```js
// remove one claim
const claimGuid = 'Q4115189$E66DBC80-CCC1-4899-90D4-510C9922A04F'
wdEdit.claim.remove(claimGuid)

// remove several claims
const claimGuids = [ 'Q4115189$BB467A9A-9123-4D0C-A87A-B7BF7ACD6477', 'Q4115189$D2CC0D8C-187C-40CD-8CF3-F6AAFE1496F4' ]
wdEdit.claim.remove(claimGuids)
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
    P1775: [ 'Q3576110', 'Q12206942' ],
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
    P1775: [ 'Q3576110', 'Q12206942' ],
    P2002: 'bulgroz'
  }
})
```
