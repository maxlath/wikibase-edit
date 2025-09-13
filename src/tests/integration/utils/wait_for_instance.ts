import config from 'config'
import { yellow, grey } from 'tiny-chalk'
import { customFetch } from '#lib/request/fetch'
import { wait } from '#tests/integration/utils/utils'

const { instance } = config

export function waitForInstance () {
  const check = async () => {
    return customFetch(instance, { timeout: 2000 })
    .catch(err => {
      console.warn(yellow(`waiting for instance at ${instance}`, grey(err.code)))
      return wait(1000).then(check)
    })
  }

  return check()
}
