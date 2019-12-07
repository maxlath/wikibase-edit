const fetch = require( 'cross-fetch' )
const { delay } = require('../utils')
const OAuth       = require( 'oauth-1.0a' )
const CryptoJS    = require( 'crypto-js' )
const querystring = require( 'querystring' )

module.exports = (verb, params, autoRetry = true) => {

  // prepare OAuth, if set
  var oauth;
  if( params.oauth ) {
    oauth = OAuth({
      consumer: {
        key:    params.oauth.consumer_key,
        secret: params.oauth.consumer_secret,
      },
      signature_method: 'HMAC-SHA1',
      hash_function:    (base_string, key) => CryptoJS.enc.Base64.stringify( CryptoJS.HmacSHA1( base_string, key ) )
    });
  }

  var attempts = 0
  const tryRequest = () => {
    var res;
   
    // collect all parameters for request
    const reqParams = Object.assign(
      {},
      params,
      {
        method: verb || 'get',
      }
    );

    // OAuth
    if( oauth ) {

      // build signature
      const sig =  oauth.authorize({
        url:    reqParams.url,
        method: reqParams.method,
        data:   Object.assign( {}, reqParams.body ), // needs body still as object for signing
      }, {
        secret: params.oauth.token_secret,
        key: params.oauth.token 
      });

      // add to headers
      reqParams.headers = Object.assign(
        {} 
        , reqParams.headers
        , oauth.toHeader( sig )
      );

    }

    // serialize body, if present
    if( (reqParams.method.toUpperCase() == 'POST') && reqParams.body ) {
      reqParams.body = querystring.stringify( params.body );
      reqParams.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }

    // run the query
    return fetch( params.url, reqParams )
    .then( (r) => {
      // keep a link to the response for possible error messages
      res = r;
      return res.json();
    })
    .then(body => {
      if (body.error != null) {
        throw requestError(res, body)
      } else {
        return body
      }
    })
    .catch(err => {
      if (autoRetry === false || ++attempts > 5) throw err
      if (err.name === 'maxlag' || err.name === 'TimeoutError') {
        const delaySeconds = getRetryDelay(err.headers)
        console.warn('[wikibase-edit warn]', verb.toUpperCase(), params.url, err.message, `retrying in ${delaySeconds}s`)
        return delay(delaySeconds * 1000).then(tryRequest)
      } else {
        throw err
      }
    })
  }

  return tryRequest()
}

const requestError = function (res, body) {
  const { code, info } = body.error || {}
  const err = new Error(`${code}: ${info}`)
  err.name = code
  err.statusCode = res.statusCode
  err.statusMessage = res.statusMessage
  err.headers = res.headers
  err.body = body
  err.url = res.url
  return err
}

const getRetryDelay = headers => {
  const retryAfterSeconds = headers['retry-after']
  if (/^\d+$/.test(retryAfterSeconds)) return parseInt(retryAfterSeconds)
  else return 2
}
