# CHANGELOG
*versions follow [SemVer](http://semver.org)*

## 7.2.0 - 2024-11-04
* Add support for [Extended Date/Time Format](https://github.com/ProfessionalWiki/WikibaseEdtf), thank to [@larjohn's PR](https://github.com/maxlath/wikibase-edit/pull/84)

## 7.1.0 - 2024-08-11
* [`claim.move`](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#move-claim): added capacity to update the moved claim mainsnak value

## 7.0.0 - 2024-03-11
**BREAKING CHANGE**: This minimal NodeJS version is now `>= v18.0.0` (to be able to use the standard `fetch` function)
  ⚠️ This change was later reverted in `v7.2.3` to recover the possibility to use a custom http request agent
* Add `config.credentials.browserSession` flag, to let `fetch` use credentials available in the browser as session cookies.

## 6.0.0 - 2023-07-16
**BREAKING CHANGE**: `wikibase-edit` now uses the [ES module](https://nodejs.org/api/esm.html) syntax. This also requires to bump the minimal NodeJS version to `>= v14.0.0`.
* Add support for `entity.statements` as an alias for `entity.claims`, to support Wikibase-ish instances such as https://commons.wikimedia.org. See https://phabricator.wikimedia.org/T149410 for more on this oddity.

## 5.3.0 - 2022-11-01
* Add [`badge.add`](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#add-badges) function
* Add [`badge.remove`](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#remove-badges) function

## 5.2.0 - 2022-10-30
* Add [`sitelink.set`](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#sitelink) function
* [`entity.edit`](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#edit-entity): allow to set sitelinks badges

## 5.1.0 - 2022-05-03
* [`label.set`](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#set-label)/[`label.set`](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#set-description): allow to remove a term by passing an empty string as value

## 5.0.0 - 2022-05-03
**BREAKING CHANGE**: updated NodeJS minimal version `>= v10.0.0`

## 4.16.0 - 2022-01-10
* Added [claim reconciliation modes](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#reconciliation)

## 4.15.0 - 2021-11-05
* Added support for the `localMedia` datatype (defined by [Extension:Wikibase_Local_Media](https://www.mediawiki.org/wiki/Extension:Wikibase_Local_Media))

## 4.14.0 - 2021-06-01
* Added a `wgScriptPath` parameter to the [general config](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#general-config)

## 4.13.0 - 2021-04-03
* [`maxlag` parameter](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#maxlag): allow to disable for interactive tasks.

## 4.12.0 - 2021-04-03
* Quantity snaks: add support for `lowerBound` and `upperBound`

## 4.11.0 - 2020-12-14
* Allow to pass a `baserevid`

## 4.10.0 - 2020-12-02
* [`entity.edit`](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#edit-entity): allow to add aliases without removing the existing ones

## 4.9.0 - 2020-12-01
* [`entity.edit`](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#edit-entity): allow to remove labels, descriptions, or aliases in a given language by passing null

## 4.8.0 - 2020-10-07
* [`claim.move`](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#move-claim): added capacity to [move claims between properties of different datatypes](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#move-claims-between-properties-of-different-datatypes)
* [`claim.qualifier`](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#move-claim): added capacity to [move qualifiers between properties of different datatypes](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#move-qualifiers-between-properties-of-different-datatypes)

## 4.7.0 - 2020-08-07
* Added support for [custom calendars](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#calendar)

## 4.6.0 - 2020-07-19
* [`claim.update`](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#update-claim): added possibility to set the claim rank
* [`claim.create`](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#create-claim): added possibility to set the claim rank, add qualifiers and references
* [`entity.edit`](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#edit-entity): allow to remove a sitelink by passing null

## 4.5.0 - 2020-07-07
* [`reference.set`](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#set-reference):
  * Added a snaks object interface to be able to set a whole reference record at once. The previous property/value interface is now deprecated.
  * Added the possibility to update an existing reference by specifying its current `hash`

## 4.4.0 - 2020-06-09
* Added [`qualifier.move`](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#move-qualifier)
* [`claim.move`](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#move-claim): added [property claims mode](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#move-all-claims-from-an-entity-property)

## 4.3.0 - 2020-05-17
* Added [`claim.move`](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#move-claim)

## 4.2.0 - 2020-04-08
* Added tags support
* Added anonymous mode support

## 4.1.0 - 2019-12-15
* Added [`getAuthData`](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#get-auth-data) function

## 4.0.0 - 2019-12-13
**Breaking Changes**: started using async/await internally, so `wikibase-edit` now requires NodeJS `>= v7.6.0`. If you are locked on an older version of NodeJS, you are thus advised to stay on `wikibase-edit@3`

## 3.2.0 - 2019-08-17
* Added [`entity.merge`](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#entity-merge) function
* Added [`maxlag` parameter support](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#maxlag)

## 3.1.0 - 2019-08-17
* Added [`entity.delete`](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#entity-delete) function

## 3.0.0 - 2019-08-17

**Breaking Changes**:
  * Renamed the module `wikidata-edit` -> `wikibase-edit`
  * Functions now expect a unique parameter object:
    * ex: `claim.add(id, language, value)` should now be written `claim.add({ id, language, value })`
  * Aligning functions names to their associated Wikibase API actions, consequently breaking several functions:
    * `claim.add` => `claim.create`
    * `qualifier.add` => `qualifier.set`
    * `reference.add` => `reference.set`
  * config:
    * `instance` is now a required parameter (not defaulting to wikidata.org anymore)
    * credentials (username/password or oauth) are now expected to be found in a `credentials` object (see [config documentation](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#config))
  * removed per-function initialization: it was meant to allow passing a different config object at every call (typically for different oauth sets of keys), which is now made possible by [passing a config object after the function parameters](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#per-request-config)
  * removed function `claim.exists`
  * removed `claim.add` claim existance check (no more `allowDuplicates` flag)

**Deprecated**:
  * `wikibaseInstance` config parameter: renamed `instance` for consistency with other WikibaseJS modules

**Added features**:
  * [`entity.create` now support creating properties!](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#create-property)
  * properties datatypes list is now generated by requesting the Wikibase instance specified in config: no more hard coded properties, no more coupling to wikidata.org!

## 2.9.0 - 2019-05-17
* [`entity.edit`](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#edit-entity): allow to remove labels, descriptions, aliases, claims, or sitelinks

## 2.8.0 - 2019-01-07
* [`entity.edit`](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#edit-entity)|[`entity.create`](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#create-entity): add support for special snaktypes
* [`entity.edit`](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#edit-entity)|[`entity.create`](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#create-entity): add support for special ranks

## 2.7.0 - 2018-10-02
* [`claim.add`](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#add-claim): added an `allowDuplicates` flag to force add when a claim with the same value already exists

## 2.6.0 - 2018-08-22
* [`claim.update`](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#update-claim) can now also [accepts a claim GUID](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#find-claim-to-update-by-claim-guid), instead of an entity id, a property, and a value

## 2.5.0 - 2018-08-22
* Added support for `globecoordinate` claims to [`claim.update`](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#update-claim)

## 2.4.0 - 2018-08-07
* Added support for `somevalue` and `novalue` [claims](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#add-claim) and [qualifiers](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#add-qualifier)

## 2.3.0 - 2018-05-16
* Added support for [globe-coordinate](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#add-claim), thank to [Davide Allavena](https://github.com/DavideAllavena)'s PR

## 2.2.0 - 2018-05-07
* Added [edit summaries](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#edit-summary)

## 2.1.0 - 2018-03-03
* Added support for [more time precisions](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#add-claim), thank to [Riccardo Magliocchetti](https://github.com/xrmx)'s PR

## 2.0.0 - 2017-11-01
* BREAKING CHANGE: [`reference.add`](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#add-reference) now expects an explicit reference property
* BREAKING CHANGE: [`claim.add`](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#add-claim) now can't be passed a reference: the reference needs to be added separately
* BREAKING CHANGE: quantity claims with a unit can't be passed as an array of the shape `[ amount, unit ]` anymore, and should instead be passed as an object `{ amount, unit }`
* BREAKING CHANGE: monolingual text can't be passed as an array of the shape `[ text, language ]` anymore, and should instead be passed as an object `{ text, language }`
* Added [`reference.remove`](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#remove-reference)
* [`alias.add`](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#add-alias): time claims now accept month and day precisions
* Added [`qualifier.add`](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#add-qualifier)
* Added [`qualifier.update`](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#update-qualifier)
* Added [`qualifier.remove`](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#remove-qualifier)
* [`entity.edit`](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#edit-entity)|[`entity.create`](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#create-entity): added support for qualifiers and references

## 1.9.0 - 2017-10-13
* Added [bot edits](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#bot-edits) support

## 1.8.0 - 2017-09-11
* Added [`alias.add`](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#add-alias)
* Added [`alias.remove`](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#remove-alias)
* Added [`alias.set`](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#set-alias)

## 1.7.0 - 2017-05-27
* Added [`claim.update`](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#update-claim)

## 1.6.0 - 2017-05-22
* Allow [`per-function initialization`](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#per-function-initialization)

## 1.5.0 - 2017-05-22
* Added [`OAuth support`](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#config)

## 1.4.0 - 2017-05-14
* Added [`description.set`](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#set-description)

## 1.3.0 - 2017-04-01
* Added [`claim.remove`](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#remove-claim)

## 1.2.0 - 2017-02-20
* Added [`entity.create`](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#set-label)
* Added [`entity.edit`](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#set-label)

## 1.1.0 - 2017-02-20
* Added [`label.set`](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#set-label)
* Added [`reference.add`](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#add-reference)

## 1.0.0 - 2017-02-19
* Added [`claim.add`](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#add-claim)
* Added [`claim.exist`](https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#check-if-claim-exists)
