import { yellow, grey } from 'chalk'
import { instance } from 'config'
import fetch from '#lib/request/fetch'
import { wait } from '#tests/integration/utils/utils'

export function waitForInstance () {
  const check = async () => {
    return fetch(instance, { timeout: 2000 })
    .catch(err => {
      console.warn(yellow(`waiting for instance at ${instance}`, grey(err.code)))
      return wait(1000).then(check)
    })
  }

  return check()
}
