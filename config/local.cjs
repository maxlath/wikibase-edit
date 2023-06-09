module.exports = {
  instance: 'http://localhost:8181',
  credentials: {
    oauth: {
      consumer_key: '7bc33647478f215844e82a1ca3e91fd7',
      consumer_secret: 'f3bec9695f04c98a7b437a9e58e396ff4abb93de',
      token: '40f64185a8108b127cc4f21d00175ad0',
      token_secret: '1757420b6a16b2d4a0fd34dee050eb6f603de787',
    }
  },

  credentialsAlt: {
    username: 'WikibaseAdmin',
    password: 'WikibaseDockerAdminPass',
    // oauth: null
    // password: 'test_pwd@cq29uo9d4q1df56tq573bbd9ja97332g'
  },

  secondUserCredentials: {
    username: 'Lnwev',
    password: 'vHuLL_AkPSdgoYL*LU1=Us-LlEwMLY5Y'
  },

  // /!\ TESTS REQUIRING ENTITY DELETION WILL FAIL ON test.wikidata.org
  //     AS IT REQUIRES EXTRA PRIVILEGES
  // instance: 'https://test.wikidata.org',
  // credentials: {
  //   oauth: {
  //     consumer_key: 'cd4cbe38901003712654f1a284da16b6',
  //     consumer_secret: '913f78ff9d2c715613b71d012115f05acec3e173',
  //     token: 'fe7eb84d59e964a39d3a023da6a04c0c',
  //     token_secret: '0961e72de9478a08c63dde04c62c4d6b61092d00',
  //   }
  // },
  // credentialsAlt: {
  //   username: 'Maxlath_tests',
  //   password: 'MJ188QwTnm=P;lVnPS_&g!s_&YbKGCDu',
  // },

  // credentialsAlt: {
  //   username: 'Maxlath',
  //   password: 'RéeEuùà:Q;2MamMu0Xvu8Lé6K4rfXkjD',
  // },

  // instance: 'https://www.wikidata.org',
  // sparqlEndpoint: 'https://query.wikidata.org',
  // maxlag: 20,
}
