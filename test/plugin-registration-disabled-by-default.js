'use strict'

const Lab = require('lab')
const Code = require('code')
const Hapi = require('hapi')

const server = new Hapi.Server()

const lab = (exports.lab = Lab.script())
const { experiment, it, before } = lab

experiment('hapi-geo-locate register plugin disabled by default', () => {
  before(async () => {
    await server.register({
      plugin: require('../lib/index'),
      options: {
        enabledByDefault: false
      }
    })
  })

  it('does not locate a request when plugin is disabled by default', async () => {
    const routeOptions = {
      path: '/no-options',
      method: 'GET',
      handler: request => request.location || ''

    }

    server.route(routeOptions)

    const request = {
      url: routeOptions.path,
      method: routeOptions.method
    }

    const response = await server.inject(request)
    const payload = JSON.parse(response.payload || '{}')

    Code.expect(response.statusCode).to.equal(200)
    Code.expect(Object.keys(payload)).to.be.empty()
  })

  it('locates the request when enabled on a route', async () => {
    const routeOptions = {
      path: '/with-options',
      method: 'GET',
      handler: request => request.location,
      config: {
        plugins: { 'hapi-geo-locate': { enabled: true } }
      }
    }

    server.route(routeOptions)

    const request = {
      url: routeOptions.path,
      method: routeOptions.method
    }

    const response = await server.inject(request)
    const payload = JSON.parse(response.payload || '{}')

    Code.expect(response.statusCode).to.equal(200)
    Code.expect(Object.keys(payload)).to.contain(['ip'])
  })
})
