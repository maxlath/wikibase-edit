# How-To

## Summary

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Config](#config)
  - [General config](#general-config)
  - [Per-request config](#per-request-config)
  - [Bot](#bot)
  - [Maxlag](#maxlag)
  - [OAuth setup tip](#oauth-setup-tip)
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
    - [create claim](#create-claim)
    - [update claim](#update-claim)
      - [find claim to update by value](#find-claim-to-update-by-value)
      - [find claim to update by claim GUID](#find-claim-to-update-by-claim-guid)
    - [remove claim](#remove-claim)
  - [Qualifier](#qualifier)
    - [set qualifier](#set-qualifier)
    - [update qualifier](#update-qualifier)
    - [remove qualifier](#remove-qualifier)
  - [Reference](#reference)
    - [set reference](#set-reference)
    - [remove reference](#remove-reference)
  - [Entity](#entity)
    - [edit entity](#edit-entity)
      - [incremental mode](#incremental-mode)
      - [reset mode](#reset-mode)
    - [create entity](#create-entity)
      - [create item](#create-item)
      - [create property](#create-property)
    - [merge entity](#merge-entity)
      - [merge item](#merge-item)
      - [merge property](#merge-property)
    - [delete entity](#delete-entity)
      - [delete item](#delete-item)
      - [delete property](#delete-property)
  - [get auth data](#get-auth-data)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Config

### General config
If all your edits are made on the same Wikibase instance with the same credentials, simply pass it all at initialization
```js
const generalConfig = {
  // A Wikibase instance is required
  instance: 'https://www.wikidata.org',

  // One authorization mean is required
  credentials: {
    // either a username and password
    username: 'my-wikidata-username',
    password: 'my-wikidata-password',

    // OR OAuth tokens
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
  },

  // Optional
  // See https://meta.wikimedia.org/wiki/Help:Edit_summary
  // Default: empty
  summary: 'some edit summary common to all the edits',

  // See https://www.mediawiki.org/wiki/Manual:Tags
  // Default: on Wikidata [ 'WikibaseJS-edit' ], empty for other Wikibase instances
  tags: [ 'Some general tag' ],

  // Default: `wikidata-edit/${pkg.version} (https://github.com/maxlath/wikidata-edit)`
  userAgent: 'my-project-name/v3.2.5 (https://project.website)',

  // See https://www.mediawiki.org/wiki/Manual:Bots
  // Default: false
  bot: true,

  // See https://www.mediawiki.org/wiki/Manual:Maxlag_parameter
  // Default: 5
  maxlag: 2
}

const wbEdit = require('wikibase-edit')(generalConfig)
wbEdit.label.set({ id, language, value })
```

So if you have a local Wikibase instance installed via [`wikibase-docker`](https://github.com/wmde/wikibase-docker) with the default settings, that would look something like:
```js
const generalConfig = {
  instance: 'http://localhost:8181',
  credentials: {
    username: 'WikibaseAdmin',
    password: 'WikibaseDockerAdminPass'
  }
}

const wbEdit = require('wikibase-edit')(generalConfig)
```

### Per-request config
If you make requests to different Wikibase instances or with different credentials (typically when using different users OAuth keys), you can pass those specific configuration parameter per function call:
```js
const generalConfig = { userAgent }
const wbEdit = require('wikibase-edit')(generalConfig)
const requestConfig = {
  instance: 'https://project-915215.wikibase.farm',
  credentials: {
    // Either a username and password
    username,
    password,
    // OR
    oauth
  },

  // See https://www.mediawiki.org/wiki/Manual:Bots
  // Default: false
  bot: true,

  // See https://meta.wikimedia.org/wiki/Help:Edit_summary
  // Default: empty
  summary: 'some request specific edit summary',

  // See https://www.mediawiki.org/wiki/Manual:Tags
  // Default: on Wikidata [ 'WikibaseJS-edit' ], empty for other Wikibase instances
  tags: [ 'Some edit specific tag' ],

  // See https://www.mediawiki.org/wiki/Manual:Maxlag_parameter
  // Default: 5
  maxlag: 5
}
wbEdit.label.set({ id, language, value }, requestConfig)
```

Rules:
* All parameters can either be set in `generalConfig` or `requestConfig`, except `userAgent` which can only be set in `generalConfig`
* Credentials must not be defined on both `generalConfig` and `requestConfig`

### Bot
The `bot` flag will mark your edits as made by a [bot account](https://www.wikidata.org/wiki/Wikidata:Bots)

### Maxlag
See [`maxlag` parameter documentation](https://www.mediawiki.org/wiki/Manual:Maxlag_parameter). If the Wikibase server returns a `maxlag` error, the request will automatically be re-executed after the amount of seconds recommended by the Wikibase server via the `Retry-After` header. This automatic retry can be disabled by setting `autoRetry` to `false` in the general config or the request config.

### OAuth setup tip
:warning: If you are going for the OAuth setup, beware of the doc [footnotes](https://www.mediawiki.org/wiki/OAuth/For_Developers#Notes): make sure to use the right URLs before loosing hours at a `invalid signature` error message. You may use this [working implementation](https://github.com/inventaire/inventaire/blob/3dbec57/server/controllers/auth/wikidata_oauth.coffee) as reference.

## API

All functions return promises.
See also [Wikidata API documentation](https://www.wikidata.org/w/api.php).

### Label
#### set label
```js
wbEdit.label.set({
  id: 'Q4115189',
  language: 'fr',
  value: 'Bac à sable bulgroz'
})
```

### Description
#### set description
```js
wbEdit.description.set({
  id: 'Q4115189',
  language: 'fr',
  value: 'description du Bac à sable bulgroz'
})
```

### Alias
#### add aliases
```js
// Add one alias
wbEdit.alias.add({
  id: 'Q4115189',
  language: 'fr',
  value: 'foo'
})
// Add several aliases
wbEdit.alias.add({
  id: 'Q4115189',
  language: 'fr',
  value: [ 'foo', 'bar' ]
})
```

#### remove aliases
```js
// Remove one alias
wbEdit.alias.remove({
  id: 'Q4115189',
  language: 'fr',
  value: 'foo'
})
// Remove several aliases
wbEdit.alias.remove({
  id: 'Q4115189',
  language: 'fr',
  value: [ 'foo', 'bar' ]
})
```

#### set aliases
```js
// Replace the current list of aliases in French on Q4115189 by 'foo'
wbEdit.alias.set({
  id: 'Q4115189',
  language: 'fr',
  value: 'foo'
})
// Replace the current list of aliases in French on Q4115189 by 'foo' and 'bar'
wbEdit.alias.set({
  id: 'Q4115189',
  language: 'fr',
  value: [ 'foo', 'bar']
})
```

### Claim
#### create claim
```js
wbEdit.claim.create({
  id: 'Q4115189',
  property: 'P2002',
  value: 'bulgroz'
})
```

Special cases:
```js
// Monolingualtext property
wbEdit.claim.create({
  id: 'Q4115189',
  property: 'P1476',
  value: { text: 'bulgroz', language: 'it' }
})

// Quantity with a unit
// Example here with the unit 'minute' (Q7727)
wbEdit.claim.create({
  id: 'Q4115189',
  property: 'P1106',
  value: { amount: 9001, unit: 'Q7727' }
})

// Time property
// day, with implicit precision
wbEdit.claim.create({
  id: 'Q4115189',
  property: 'P569',
  value: '1802-02-26'
})

// day, with explicit precision
// cf https://www.wikidata.org/wiki/Help:Dates#Precision
wbEdit.claim.create({
  id: 'Q4115189',
  property: 'P569',
  value: { time: '1802-02-26', precision: 11 }
})

// month
wbEdit.claim.create({
  id: 'Q4115189',
  property: 'P569',
  value: '1802-02'
})

wbEdit.claim.create({
  id: 'Q4115189',
  property: 'P569',
  value: { time: '1802-02', precision: 10 }
})

// year
wbEdit.claim.create({
  id: 'Q4115189',
  property: 'P569',
  value: '1802'
})

wbEdit.claim.create({
  id: 'Q4115189',
  property: 'P569',
  value: { time: '1802', precision: 9 }
})

// decade
wbEdit.claim.create({
  id: 'Q4115189',
  property: 'P569',
  value: { time: '1800', precision: 8 }
})

// century
wbEdit.claim.create({
  id: 'Q4115189',
  property: 'P569',
  value: { time: '1800', precision: 7 }
})

// millennium
wbEdit.claim.create({
  id: 'Q4115189',
  property: 'P569',
  value: { time: '1000', precision: 6 }
})

// ten thousand years
wbEdit.claim.create({
  id: 'Q4115189',
  property: 'P569',
  value: { time: '-50000', precision: 5 }
})

// hundred thousand years
wbEdit.claim.create({
  id: 'Q4115189',
  property: 'P569',
  value: { time: '-100000', precision: 4 }
})

// million years
wbEdit.claim.create({
  id: 'Q4115189',
  property: 'P569',
  value: { time: '-1000000', precision: 3 }
})

// billion years
wbEdit.claim.create({
  id: 'Q4115189',
  property: 'P569',
  value: { time: '-13000000000', precision: 0 }
})

// Quantity:
// pass a single value for a count without a specific unit
wbEdit.claim.create({
  id: 'Q4115189',
  property: 'P1106',
  value: 9000
})

// pass an object for a value with a specific unit. Example here to specify minutes (Q7727)
wbEdit.claim.create({
  id: 'Q4115189',
  property: 'P2097',
  value: { amount: 9000, unit: 'Q7727' }
})

// Globe Coordinate:
// Here with a precision of an arcsecond
wbEdit.claim.create({
  id: 'Q4115189',
  property: 'P626',
  value: { latitude: 45.758, longitude: 4.84138, precision: 1 / 360 }
})

// somevalue:
wbEdit.claim.create({
  id: 'Q4115189',
  property: 'P19',
  value: { snaktype: 'somevalue' }
})

// novalue:
wbEdit.claim.create({
  id: 'Q4115189',
  property: 'P27',
  value: { snaktype: 'novalue' }
})

```

#### update claim
A function to change the value of an existing claim without having to remove it and while keeping its references and qualifiers.

##### find claim to update by value
```js
wbEdit.claim.update({
  id: 'Q4115189',
  property: 'P2002',
  oldValue: 'initial-value',
  newValue: 'new-value'
})
```
It will return a rejected promise if several claims with the same value already exist.

It can also be used for rich values such as `globecoordinate` claims:
```js
const oldValue = { latitude: 18.65, longitude: 226.2, precision: 0.01, globe: "http://www.wikidata.org/entity/Q111" }
const newValue = { latitude: 18.65, longitude: 226.2, precision: 0.01, globe: "http://www.wikidata.org/entity/Q313" }
wbEdit.claim.update({
  id: 'Q4115189',
  property: 'P2002',
  oldValue,
  newValue
})
```

##### find claim to update by claim GUID
Instead of passing the old value, you can pass the claim GUID
```js
const claimGuid = 'Q4115189$E66DBC80-CCC1-4899-90D4-510C9922A04F'
wbEdit.claim.update({
  guid: claimGuid,
  newValue: 'new-value'
})
```

#### remove claim
```js
// remove one claim
const claimGuid = 'Q4115189$E66DBC80-CCC1-4899-90D4-510C9922A04F'
wbEdit.claim.remove({ guid: claimGuid })

// remove several claims on the same entity
const claimGuids = [
  'Q4115189$BB467A9A-9123-4D0C-A87A-B7BF7ACD6477',
  'Q4115189$D2CC0D8C-187C-40CD-8CF3-F6AAFE1496F4'
]
wbEdit.claim.remove({ guid: claimGuids })
```

### Qualifier

#### set qualifier

```js
const claimGuid = 'Q4115189$E66DBC80-CCC1-4899-90D4-510C9922A04F'

// entity qualifier
wbEdit.qualifier.set({
  guid: claimGuid,
  property: 'P155',
  value: 'Q4115189'
})

// string qualifier
wbEdit.qualifier.set({
  guid: claimGuid,
  property: 'P1545',
  value: '123'
})

// time qualifier
wbEdit.qualifier.set({
  guid: claimGuid,
  property: 'P580',
  value: '1802-02-26'
})
wbEdit.qualifier.set({
  guid: claimGuid,
  property: 'P580',
  value: { time: '1802-02-26', precision: 11 }
})

// quantity qualifier
wbEdit.qualifier.set({
  guid: claimGuid,
  property: 'P2130',
  value: 13
})

// quantity qualifier with a unit
wbEdit.qualifier.set({
  guid: claimGuid,
  property: 'P2130',
  value: { amount: 123, unit: 'Q4916' }
})

// monolingualtext qualifier
wbEdit.qualifier.set({
  guid: claimGuid,
  property: 'P3132',
  value: { text : "les sanglots long des violons de l'automne", language: 'fr' }
})

// somevalue
wbEdit.qualifier.set({
  guid: claimGuid,
  property: 'P3132',
  value: { snaktype : 'somevalue' }
})

// novalue
wbEdit.qualifier.set({
  guid: claimGuid,
  property: 'P3132',
  value: { snaktype : 'novalue' }
})
```

#### update qualifier

```js
wbEdit.qualifier.update({
  guid: 'Q4115189$E66DBC80-CCC1-4899-90D4-510C9922A04F',
  property: 'P155',
  oldValue: 'Q4115189',
  newValue: 'Q4115190'
})

// somevalue
wbEdit.qualifier.update({
  guid,
  property,
  oldValue,
  newValue: { snaktype : 'somevalue' }
})
// novalue
wbEdit.qualifier.update({
  guid,
  property,
  oldValue,
  newValue: { snaktype : 'novalue' }
})
```

#### remove qualifier

```js
const claimGuid = 'Q4115189$E66DBC80-CCC1-4899-90D4-510C9922A04F'
// qualifierHash can be either a single hash string or an array of reference hash strings
const qualifierHash = '239ef1c81ef0c24611d6d7c294d07036e82c4666'
wbEdit.reference.remove({
  guid: claimGuid,
  hash: qualifierHash
})
```

### Reference

#### set reference

```js
const claimGuid = 'Q4115189$E66DBC80-CCC1-4899-90D4-510C9922A04F'
// reference url (P854) is 'https://example.org/rise-and-fall-of-the-holy-sand-box'
wbEdit.reference.set({
  guid: claimGuid,
  property: 'P854',
  value: 'https://example.org/rise-and-fall-of-the-holy-sand-box'
})
```

```js
const claimGuid = 'Q4115189$E66DBC80-CCC1-4899-90D4-510C9922A04F'
// imported from (P143) the French Wikipedia 'Q8447'
wbEdit.reference.set({
  guid: claimGuid,
  property: 'P143',
  value: 'Q8447'
})
// imported from (P143) we don't know where
wbEdit.reference.set({
  guid: claimGuid,
  property: 'P143',
  value: { snaktype : 'somevalue' }
})
```

#### remove reference
```js
const claimGuid = 'Q4115189$E66DBC80-CCC1-4899-90D4-510C9922A04F'
// referenceHash can be either a single hash string or an array of reference hash strings
const referenceHash = '239ef1c81ef0c24611d6d7c294d07036e82c4666'
wbEdit.reference.remove({
  guid: claimGuid,
  hash: referenceHash
})
```

### Entity

#### edit entity
Make many edits on an entity at once.

##### incremental mode
By default, every label, description, claim, or sitelink that isn't included in the passed object will stay untouched: only those with a `remove` flag will be removed. Beware that this isn't true for qualifiers and references, which can be removed by just being omitted (see P1114 example below).

```js
wbEdit.entity.edit({
  // Required
  id: 'Q4115189',
  // All the rest is optional but one of labels, descriptions, aliases, claims, or sitelinks must be set
  labels: {
    // Set a label
    en: 'a new label in English',
    // Remove a label
    fr: { value: 'le label en français', remove: true }
  },
  descriptions: {
    // Set a description
    en: 'a new description',
    // Remove a description
    fr: { value: 'la description en français', remove: true }
  },
  aliases: {
    // Pass aliases as an array
    en: [ 'foo', 'bar' ],
    // Or a single value
    de: 'buzz',
    // Remove an alias
    fr: { value: 'bla', remove: true }
    // Add some aliases and remove others
    es: [
      // Will be added
      'ola',
      // Will be removed
      { value: 'alo', remove: true }
    ]
  },
  claims: {
    // Pass values as an array
    P1775: [ 'Q3576110', 'Q12206942' ],
    // Or a single value
    P2002: 'bulgroz',
    // Or a rich value object
    P2093: { text: 'Author Authorson', language: 'en' },
    // Or even an array of mixed simple values and rich object values
    P1106: [ 42, { amount: 9001, unit: 'Q7727' } ]
    // Add statements with special snaktypes ('novalue' or 'somevalue')
    P626: { snaktype: 'somevalue' }
    // or special rank (Default: 'normal'. Possible values: 'preferred' or 'deprecated')
    P6089: { rank: 'preferred', value: 123 }
    // Add qualifiers and references to value objects
    P369: [
      // Qualifier values can also be passed in those different forms
      {
        value: 'Q5111731',
        qualifiers: {
          P580: '1789-08-04'
          P1416: [ 'Q13406268', 'Q32844021' ],
          P1106: { amount: 9001, unit: 'Q7727' }
        }
      },
      // References can be passed as a single record group
      { value: 'Q2622004', references: { P143: 'Q8447' } },
      // or as multiple records
      {
        value: 'Q2622009',
        references: [
          { P855: 'https://example.org', P143: 'Q8447' },
          { P855: 'https://example2.org', P143: 'Q8447' }
        ]
      }
    ],
    P1114: [
      // Edit an existing claim
      // /!\ Beware that while editing an existing claim,
      //     anything omitted (rank, qualifiers, or references) will be omitted!!
      { id: 'Q4115189$BC5F4F72-5B49-4991-AB0F-5CC8D4AAB99A', value: 123 }
      // Remove an existing claim
      { id: 'Q4115189$afc56f6c-4e91-c89d-e287-d5691aeb063a', remove: true }
    ]
  },
  sitelinks: {
    // Set a sitelink
    frwiki: 'eviv bulgroz'
    // Remove a sitelink
    eswikisource: { value: 'aviv sal bulgroz', remove: true },
  }
})
```

##### reset mode
If the entity you are editing requires a big cleanup, instead of adding a `remove` flag to all the elements that needs to be removed, you can set the `clear` flag to `true`, which will **delete all the entity data** before adding the specified data:
```js
// Remove ALL the labels, descriptions, aliases, claims, and sitelinks, and set the English label to 'Sandbox'
wbEdit.entity.edit({
  id: 'Q4115189',
  clear: true,
  labels: {
    en: 'Sandbox'
  }
})
```

#### create entity
##### create item
Create an [item](https://www.wikidata.org/wiki/Wikidata:Glossary#Item) from scratch.
The item data follow the same rules as [`wbEdit.entity.edit`](#edit-entity), simply without the `id`

```js
wbEdit.entity.create({
  type: 'item',
  labels,
  descriptions,
  aliases,
  claims,
  sitelinks
})
.then(res => {
  const { entity } = res
  console.log('created item id', entity.id)
})
```

##### create property
Creating a [property](https://www.wikidata.org/wiki/Wikidata:Glossary#Property) is just like creating an item, but with a `type=property` and a `datatype`

```js
wbEdit.entity.create({
  type: 'property',
  datatype: 'string',
  labels,
  descriptions,
  aliases,
  claims
})
.then(res => {
  const { entity } = res
  console.log('created property id', entity.id)
})
```

#### merge entity
##### merge item
```js
// Merge Q1 into Q2, turning Q1 into a redirection
wbEdit.entity.merge({ from: 'Q1', to: 'Q2' })
```

##### merge property
Wikibase doesn't allow to merge properties

#### delete entity
##### delete item
```js
wbEdit.entity.delete({ id: 'Q1' })
```

##### delete property
```js
wbEdit.entity.delete({ id: 'P1' })
```

### get auth data
All the functions above handle authentification for you, but you can also access the auth data, that is session cookies and the currently valid [csrf token](https://www.mediawiki.org/wiki/Manual:Edit_token), using the `getAuthData` function.
```js
wbEdit.getAuthData()
.then(({ cookie, token }) => {
  // Do some custom stuffs
})
```
It can also be used as a way to validate credentials:
```js
require('wikibase-edit')({ instance, credentials }).getAuthData()
.then(onValidCredentials)
.catch(onInvalidCredentials)
```
