const wdk = require('wikidata-sdk')

// The difference in builders are due to the different expectations of Wikidata API

const singleClaimBuilders = {
  string: (str) => `"${str}"`,
  claim: (Q) => {
    const id = wdk.getNumericId(Q)
    return `{"entity-type":"item","numeric-id":${id}}`
  },
  time: (year) => JSON.stringify(getYearTimeObject(year)),
  // Property type specific builders
  monolingualtext: (valueArray) => {
    const [ text, language ] = valueArray
    return JSON.stringify({ text, language })
  },
  quantity: (quantity, unit = '1') => {
    if (quantity instanceof Array) {
      [ quantity, unit ] = quantity
      if (wdk.isItemId(unit)) unit = `http://www.wikidata.org/entity/${unit}`
    }
    return JSON.stringify({ amount: buildAmount(quantity), unit })
  }
}

const entityEditBuilders = {
  string: (pid, string) => statementBase(pid, 'string', string),
  claim: (pid, qid) => {
    const id = wdk.getNumericId(qid)
    return statementBase(pid, 'wikibase-entityid', {
      'entity-type': 'item',
      'numeric-id': parseInt(id)
    })
  },
  monolingualtext: (pid, valueObj) => {
    return statementBase(pid, 'monolingualtext', valueObj)
  },
  time: (pid, year) => statementBase(pid, 'time', getYearTimeObject(year)),
  quantity: (pid, num) => {
    return statementBase(pid, 'quantity', {
      lowerBound: `+${num}`,
      upperBound: `+${num}`,
      unit: '1',
      amount: buildAmount(num)
    })
  }
}

const buildAmount = (num) => {
  if (num === 0) return '0'
  return num > 0 ? `+${num}` : `-${num}`
}

const getYearTimeObject = (year) => {
  return {
    time: `+${year}-00-00T00:00:00Z`,
    timezone: 0,
    before: 0,
    after: 0,
    precision: 9,
    calendarmodel: 'http://www.wikidata.org/entity/Q1985727'
  }
}

const statementBase = (pid, type, value) => {
  return {
    rank: 'normal',
    type: 'statement',
    mainsnak: {
      datavalue: {
        type: type,
        value: value
      },
      property: pid,
      snaktype: 'value'
    }
  }
}

module.exports = { singleClaimBuilders, entityEditBuilders }
