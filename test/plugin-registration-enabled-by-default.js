'use strict'

const Lab = require('lab')
const Code = require('code')
const Hapi = require('hapi')

const server = new Hapi.Server()

const lab = (exports.lab = Lab.script())
const experiment = lab.experiment
const test = lab.test

experiment('hapi-geo-locate register plugin', () => {
  lab.before(async () => {
    await server.register({
      plugin: require('../lib/index'),
      options: {
        enabledByDefault: true
      }
    })
  })

  test('test if the plugin works without route options', async () => {
    const routeOptions = {
      path: '/no-options',
      method: 'GET',
      handler: (request, h) => {
        return request.location
      }
    }

    server.route(routeOptions)

    const options = {
      url: routeOptions.path,
      method: routeOptions.method
    }

    const response = await server.inject(options)
    const payload = JSON.parse(response.payload || '{}')

    Code.expect(response.statusCode).to.equal(200)
    Code.expect(Object.keys(payload)).to.contain(['ip'])
  })

  test('test if the plugin disables when activating plugin config on route', async () => {
    const routeOptions = {
      path: '/with-options',
      method: 'GET',
      handler: (request, h) => {
        return h.response(request.location)
      },
      config: {
        plugins: {
          'hapi-geo-locate': {
            enabled: false
          }
        }
      }
    }

    server.route(routeOptions)

    const options = {
      url: routeOptions.path,
      method: routeOptions.method
    }

    const response = await server.inject(options)
    const payload = JSON.parse(response.payload || '{}')

    Code.expect(response.statusCode).to.equal(200)
    Code.expect(Object.keys(payload)).to.be.empty()
  })
})
