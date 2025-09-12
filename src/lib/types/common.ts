import type { RevisionId } from 'wikibase-sdk'

export type AbsoluteUrl = `http${string}`

export type BaseRevId = RevisionId | number

export type MaxLag = number

export type Tags = string[]
