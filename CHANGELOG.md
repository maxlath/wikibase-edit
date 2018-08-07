# CHANGELOG
*versions follow [SemVer](http://semver.org)*

## 2.4.0 - 2018-08-07
* Added support for `somevalue` and `novalue` [claims](https://github.com/maxlath/wikidata-edit/blob/master/docs/how_to.md#add-claim) and [qualifiers](https://github.com/maxlath/wikidata-edit/blob/master/docs/how_to.md#add-qualifier)

## 2.3.0 - 2018-05-16
* Added support for [globe-coordinate](https://github.com/maxlath/wikidata-edit/blob/master/docs/how_to.md#add-claim), thank to [Davide Allavena](https://github.com/DavideAllavena)'s PR

## 2.2.0 - 2018-05-07
* Added [edit summaries](https://github.com/maxlath/wikidata-edit/blob/master/docs/how_to.md#edit-summary)

## 2.1.0 - 2018-03-03
* Added support for [more time precisions](https://github.com/maxlath/wikidata-edit/blob/master/docs/how_to.md#add-claim), thank to [Riccardo Magliocchetti](https://github.com/xrmx)'s PR

## 2.0.0 - 2017-11-01
* BREAKING CHANGE: [`reference.add`](https://github.com/maxlath/wikidata-edit/blob/master/docs/how_to.md#add-reference) now expects an explicit reference property
* BREAKING CHANGE: [`claim.add`](https://github.com/maxlath/wikidata-edit/blob/master/docs/how_to.md#add-claim) now can't be passed a reference: the reference needs to be added separately
* BREAKING CHANGE: quantity claims with a unit can't be passed as an array of the shape `[ amount, unit ]` anymore, and should instead be passed as an object `{ amount, unit }`
* BREAKING CHANGE: monolingual text can't be passed as an array of the shape `[ text, language ]` anymore, and should instead be passed as an object `{ text, language }`
* Added [`reference.remove`](https://github.com/maxlath/wikidata-edit/blob/master/docs/how_to.md#remove-reference)
* [`alias.add`](https://github.com/maxlath/wikidata-edit/blob/master/docs/how_to.md#add-alias): time claims now accept month and day precisions
* Added [`qualifier.add`](https://github.com/maxlath/wikidata-edit/blob/master/docs/how_to.md#add-qualifier)
* Added [`qualifier.update`](https://github.com/maxlath/wikidata-edit/blob/master/docs/how_to.md#update-qualifier)
* Added [`qualifier.remove`](https://github.com/maxlath/wikidata-edit/blob/master/docs/how_to.md#remove-qualifier)
* [`entity.edit`](https://github.com/maxlath/wikidata-edit/blob/master/docs/how_to.md#edit-entity)|[`entity.create`](https://github.com/maxlath/wikidata-edit/blob/master/docs/how_to.md#create-entity): added support for qualifiers and references

## 1.9.0 - 2017-10-13
* Added [bot edits](https://github.com/maxlath/wikidata-edit/blob/master/docs/how_to.md#bot-edits) support

## 1.8.0 - 2017-09-11
* Added [`alias.add`](https://github.com/maxlath/wikidata-edit/blob/master/docs/how_to.md#add-alias)
* Added [`alias.remove`](https://github.com/maxlath/wikidata-edit/blob/master/docs/how_to.md#remove-alias)
* Added [`alias.set`](https://github.com/maxlath/wikidata-edit/blob/master/docs/how_to.md#set-alias)

## 1.7.0 - 2017-05-27
* Added [`claim.update`](https://github.com/maxlath/wikidata-edit/blob/master/docs/how_to.md#update-claim)

## 1.6.0 - 2017-05-22
* Allow [`per-function initialization`](https://github.com/maxlath/wikidata-edit/blob/master/docs/how_to.md#per-function-initialization)

## 1.5.0 - 2017-05-22
* Added [`OAuth support`](https://github.com/maxlath/wikidata-edit/blob/master/docs/how_to.md#config)

## 1.4.0 - 2017-05-14
* Added [`description.set`](https://github.com/maxlath/wikidata-edit/blob/master/docs/how_to.md#set-description)

## 1.3.0 - 2017-04-01
* Added [`claim.remove`](https://github.com/maxlath/wikidata-edit/blob/master/docs/how_to.md#remove-claim)

## 1.2.0 - 2017-02-20
* Added [`entity.create`](https://github.com/maxlath/wikidata-edit/blob/master/docs/how_to.md#set-label)
* Added [`entity.edit`](https://github.com/maxlath/wikidata-edit/blob/master/docs/how_to.md#set-label)

## 1.1.0 - 2017-02-20
* Added [`label.set`](https://github.com/maxlath/wikidata-edit/blob/master/docs/how_to.md#set-label)
* Added [`reference.add`](https://github.com/maxlath/wikidata-edit/blob/master/docs/how_to.md#add-reference)

## 1.0.0 - 2017-02-19
* Added [`claim.add`](https://github.com/maxlath/wikidata-edit/blob/master/docs/how_to.md#add-claim)
* Added [`claim.exist`](https://github.com/maxlath/wikidata-edit/blob/master/docs/how_to.md#check-if-claim-exists)
