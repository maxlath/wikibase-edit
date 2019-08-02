// A function to quickly fail when a test gets an undesired positive answer
const undesiredRes = done => res => {
  console.warn(res, 'undesired positive res')
  done(new Error('.then function was expected not to be called'))
}

const delay = delayMs => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, delayMs)
  })
}

module.exports = { undesiredRes, delay }
