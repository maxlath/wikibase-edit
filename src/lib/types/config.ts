import type { AbsoluteUrl } from './common'
import type { PropertiesDatatypes } from '../properties/fetch_properties_datatypes'

interface UsernameAndPassword {
  username: string
  password: string
}

interface OAuthCredentials {
  oauth: {
    consumer_key: string
    consumer_secret: string
    token: string
    token_secret: string
  }
}

export interface GeneralConfig {
  /**
   * A Wikibase instance
   * @example https://www.wikidata.org
   */
  instance: AbsoluteUrl

  /**
   * The instance script path, used to find the API endpoint
   * @default "/w"
   */
  wgScriptPath?: string

  /**
   * One authorization mean is required (unless in anonymous mode)
   * Either a username and password, or OAuth tokens.
   *
   * You may generate a dedicated password with tailored rights on the wikibase instance /wiki/Special:BotPasswords
   */
  credentials?: UsernameAndPassword | OAuthCredentials

  /**
   * Flag to activate the 'anonymous' mode
   * which actually isn't anonymous as it signs with your IP
   * @default false
   */
  anonymous?: boolean

  /**
   * A string to describe the edit
   * See https://meta.wikimedia.org/wiki/Help:Edit_summary
   * @exampe 'some edit summary common to all the edits'
   */
  summary?: string

  /**
   * A string that will appended to the config summary
   * This can be useful, for instance, when making a batch of edits with different requests having different summaries, but a common batch identifier
   */
  summarySuffix?: string

  /**
   * See https://www.mediawiki.org/wiki/Manual:Tags
   */
  tags?: string[]

  /**
   * @default `wikidata-edit/${version} (https://github.com/maxlath/wikidata-edit)`
   */
  userAgent?: string

  /**
   * See https://www.mediawiki.org/wiki/Manual:Bots
   * @default false
   */
  bot?: boolean

  /**
   * See https://www.mediawiki.org/wiki/Manual:Maxlag_parameter
   * @default 5
   */
  maxlag?: number
}

export interface RequestConfig extends GeneralConfig {
  baserevid?: number
}

export interface SerializedConfig extends RequestConfig {
  _validatedAndEnriched?: boolean
  instanceApiEndpoint: AbsoluteUrl
  properties: PropertiesDatatypes
}
