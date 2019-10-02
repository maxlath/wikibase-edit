const { yellow } = require('chalk')

// A function to quickly fail when a test gets an undesired positive answer
const undesiredRes = done => res => {
  console.warn(yellow('undesired positive res:'), res)
  done(new Error('.then function was expected not to be called'))
}

const delay = delayMs => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, delayMs)
  })
}

module.exports = { undesiredRes, delay }
