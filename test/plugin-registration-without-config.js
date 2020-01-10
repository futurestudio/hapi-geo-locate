'use strict'

const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const Hapi = require('@hapi/hapi')

const server = new Hapi.Server()

const lab = (exports.lab = Lab.script())
const { experiment, it, before } = lab

experiment('hapi-geo-locate register plugin without config', () => {
  before(async () => {
    server.register({
      plugin: require('../lib/index')
    })
  })

  it('works without any options', { timeout: 10000 }, async () => {
    const routeOptions = {
      path: '/no-options',
      method: 'GET',
      handler: request => request.location
    }

    server.route(routeOptions)

    const request = {
      url: routeOptions.path,
      method: routeOptions.method
    }

    const response = await server.inject(request)
    Code.expect(response.statusCode).to.equal(200)
    Code.expect(Object.keys(response.result)).to.contain(['ip'])
  })

  it('disables the plugin on a route', { timeout: 10000 }, async () => {
    const routeOptions = {
      path: '/with-options',
      method: 'GET',
      handler: request => request.location || 'no-location',
      config: {
        plugins: { 'hapi-geo-locate': { enabled: false } }
      }
    }

    server.route(routeOptions)

    const request = {
      url: routeOptions.path,
      method: routeOptions.method
    }

    const response = await server.inject(request)
    Code.expect(response.statusCode).to.equal(200)
    Code.expect(response.result).to.equal('no-location')
  })
})
