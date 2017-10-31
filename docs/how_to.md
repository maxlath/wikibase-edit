# How-To

## Summary

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Config](#config)
  - [Per-function initialization](#per-function-initialization)
  - [Custom Wikibase instance](#custom-wikibase-instance)
  - [Bot edits](#bot-edits)
- [API](#api)
  - [Label](#label)
    - [set label](#set-label)
  - [Description](#description)
    - [set description](#set-description)
  - [Alias](#alias)
    - [add aliases](#add-aliases)
    - [remove aliases](#remove-aliases)
    - [set aliases](#set-aliases)
  - [Claim](#claim)
    - [add claim](#add-claim)
    - [check if claim exists](#check-if-claim-exists)
    - [update claim](#update-claim)
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
  // One authorization mean is required

  // either a username and password
  username: 'my-wikidata-username',
  password: 'my-wikidata-password',

  // or OAuth tokens
  oauth: {
    // Obtained at registration
    // https://www.mediawiki.org/wiki/OAuth/For_Developers#Registration
    consumer_key: 'your-consumer-token',
    consumer_secret: 'your-secret-token',
    // Obtained when the user authorized your service
    // see https://www.mediawiki.org/wiki/OAuth/For_Developers#Authorization
    token: 'a-user-token',
    token_secret: 'a-secret-token'
  }

  // Optional
  verbose: true, // Default: false
  wikibaseInstance: 'https://mywikibase.instance/w/api.php', // Default: https://www.wikidata.org/w/api.php
  userAgent: 'my-project-name/v3.2.5 (https://project.website)' // Default: `wikidata-edit/${pkg.version} (https://github.com/maxlath/wikidata-edit)`
}
const wdEdit = require('wikidata-edit')(config)
```

:warning: If you are going for the OAuth setup, beware of the doc [footnotes](https://www.mediawiki.org/wiki/OAuth/For_Developers#Notes): make sure to use the right URLs before loosing hours at a `invalid signature` error message. You may use this [working implementation](https://github.com/inventaire/inventaire/blob/3dbec5706f414f3359d2437f9e2ca59d9b6b0687/server/controllers/auth/wikidata_oauth.coffee) as reference.

### Per-function initialization
If you want to use [thos functions](#API) with a different config everytime (which is likely if you are using OAuth), you may prefer to initialize only the functions you need when you need it, to avoid creating all the functions everytime.

So instead of
```js
const wdEdit = require('wikidata-edit')(config)
wdEdit.label.set('Q4115189', 'fr', 'Bac à sable bulgroz')
```
you could do
```js
const setLabel = require('wikidata-edit')(config, 'label/set')
setLabel('Q4115189', 'fr', 'Bac à sable bulgroz')
```
It will then initialize only this function and the libs it depends on.

### Custom Wikibase instance

If you use a custom Wikibase instance, additionnally to passing the `wikibaseInstance` option (see above), make sure to re-fetch properties from the associated SPARQL endpoint. Otherwise, you will be stuck with [wikidata.org hard coded properties](https://github.com/maxlath/wikidata-edit/blob/ae13c6d5923edd3c092f25ee76fa141e7777aad0/lib/properties/properties.js).
```sh
cd project_folder/node_modules/wikidata-edit
# Make sure wikidata-cli is installed (especially if you installed wikidata-edit in production mode)
npm install wikidata-cli
export SPARQL_ENDPOINT='https://query.mywikibase.instance/sparql'; npm run update-properties
```

### Bot edits
You can mark your edits as made by a [bot account](https://www.wikidata.org/wiki/Wikidata:Bots) by setting `bot=true` in the config object:
```js
const wdEdit = require('wikidata-edit')({ username: 'mybotname', password: 'mybotpassword', bot: true })
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

### Alias
#### add aliases
```js
// Add the alias 'foo' to the Sandbox entity (Q4115189) in French
wdEdit.alias.add('Q4115189', 'fr', 'foo')
// Add the aliases 'foo' and 'bar'
wdEdit.alias.add('Q4115189', 'fr', [ 'foo', 'bar' ])
```

#### remove aliases
```js
// Remove the alias 'foo' to the Sandbox entity (Q4115189) in French
wdEdit.alias.remove('Q4115189', 'fr', 'foo')
// Remove the aliases 'foo' and 'bar'
wdEdit.alias.remove('Q4115189', 'fr', [ 'foo', 'bar' ])
```

#### set aliases
```js
// Replace the current list of aliases in French on Sandbox entity (Q4115189) by 'foo'
wdEdit.alias.set('Q4115189', 'fr', 'foo')
// Replace the current list of aliases by 'foo' and 'bar'
// Set the aliases 'foo' and 'bar'
wdEdit.alias.set('Q4115189', 'fr', [ 'foo', 'bar' ])
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

// Time property: only year, month, and day precision are supported yet (PR welcome!)
wdEdit.claim.add('Q4115189', 'P569', '1802')
wdEdit.claim.add('Q4115189', 'P569', '1802-02')
wdEdit.claim.add('Q4115189', 'P569', '1802-02-26')

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

#### update claim
A function to change the value of an existing claim without having to remove it and while keeping its references and qualifiers.
```js
wdEdit.claim.update('Q4115189', 'P2002', 'initial-value', 'new-value')
```
It will return a rejected promise if several claims with the same value already exist.

#### remove claim
```js
// remove one claim
const claimGuid = 'Q4115189$E66DBC80-CCC1-4899-90D4-510C9922A04F'
wdEdit.claim.remove(claimGuid)

// remove several claims
const claimGuids = [ 'Q4115189$BB467A9A-9123-4D0C-A87A-B7BF7ACD6477', 'Q4115189$D2CC0D8C-187C-40CD-8CF3-F6AAFE1496F4' ]
wdEdit.claim.remove(claimGuids)
```

### Qualifier

#### add qualifier

```js
const claimGuid = 'Q4115189$E66DBC80-CCC1-4899-90D4-510C9922A04F'
// entity qualifier
wdEdit.qualifier.add(guid, 'P155', 'Q4115189')

// string qualifier
wdEdit.qualifier.add(guid, 'P1545', '123')

// time qualifier
wdEdit.qualifier.add(guid, 'P580', '1802-02-26')

// quantity qualifier
wdEdit.qualifier.add(guid, 'P2130', 123)

// monolingualtext qualifier
wdEdit.qualifier.add(guid, 'P3132', [ "les sanglots long des violons de l'automne", 'fr' ])
```

#### update qualifier

```js
const claimGuid = 'Q4115189$E66DBC80-CCC1-4899-90D4-510C9922A04F'
const property = 'P155'
const oldValue = 'Q4115189'
const newValue = 'Q4115190'
wdEdit.qualifier.update(guid, property, oldValue, newValue)
```

#### remove qualifier

```js
const claimGuid = 'Q4115189$E66DBC80-CCC1-4899-90D4-510C9922A04F'
// qualifierHash can be either a single hash string or an array of reference hash strings
const qualifierHash = '239ef1c81ef0c24611d6d7c294d07036e82c4666'
wdEdit.reference.remove(claimGuid, qualifierHash)
```

### Reference

#### add reference

```js
const claimGuid = 'Q4115189$E66DBC80-CCC1-4899-90D4-510C9922A04F'
// reference url (P854) is 'https://example.org/rise-and-fall-of-the-holy-sand-box'
wdEdit.reference.add(claimGuid, 'P854', 'https://example.org/rise-and-fall-of-the-holy-sand-box')
```

```js
const claimGuid = 'Q4115189$E66DBC80-CCC1-4899-90D4-510C9922A04F'
// imported from (P143) the French Wikipedia 'Q8447'
wdEdit.reference.add(claimGuid, 'P143', 'Q8447')
```

#### remove reference
```js
const claimGuid = 'Q4115189$E66DBC80-CCC1-4899-90D4-510C9922A04F'
// referenceHash can be either a single hash string or an array of reference hash strings
const referenceHash = '239ef1c81ef0c24611d6d7c294d07036e82c4666'
wdEdit.reference.remove(claimGuid, referenceHash)
```

### Entity

#### edit
Edit an entity. Labels and descriptions will be set even if there are existing values for the given languages. Claims will be added to the entity existing claims, without checking for duplicates.
```js
wdEdit.entity.edit({
  // Required
  id: 'Q4115189',
  // Optional but one of labels, descriptions, claims, or sitelinks must be set
  labels: { en: 'a new label in English', fr: 'un nouveau label en français' },
  descriptions: { en: 'a new description', fr: 'une nouvelle description' },
  claims: {
    P1775: [ 'Q3576110', 'Q12206942' ],
    P2002: 'bulgroz'
  },
  sitelinks: {
    frwiki: 'eviv bulgroz'
    eswikisource: 'aviv sal bulgroz',
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
