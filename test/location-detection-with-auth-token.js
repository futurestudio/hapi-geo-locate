'use strict'

const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const Hapi = require('@hapi/hapi')

const server = new Hapi.Server()

const { expect } = Code
const { experiment, it, before } = (exports.lab = Lab.script())

experiment('hapi-geo-locate uses an API auth token', () => {
  before(async () => {
    await server.register({
      plugin: require('../lib/index'),
      options: {
        authToken: 'invalid-ipinfo-api-token'
      }
    })
  })

  it('fails with invalid token', { timeout: 10000 }, async () => {
    server.route({
      path: '/with-invalid-token',
      method: 'GET',
      config: {
        handler: request => request.location
      }
    })

    const request = {
      method: 'GET',
      url: '/with-invalid-token'
    }

    const response = await server.inject(request)
    expect(response.result.error).to.exist()
  })
})
