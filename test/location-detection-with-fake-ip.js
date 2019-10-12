'use strict'

const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const Hapi = require('@hapi/hapi')

const server = new Hapi.Server()

const lab = (exports.lab = Lab.script())
const { experiment, it, before } = lab
const { expect } = Code

experiment('hapi-geo-locate detect client location with fake IP address', () => {
  before(async () => {
    await server.register({
      plugin: require('../lib/index')
    })
  })

  it('works with a fake IP address', { timeout: 10000 }, async () => {
    const routeOptions = {
      path: '/with-fake-ip',
      method: 'GET',
      config: {
        handler: request => request.location,
        plugins: {
          'hapi-geo-locate': {
            fakeIP: '8.8.8.8'
          }
        }
      }
    }

    server.route(routeOptions)

    const request = {
      url: routeOptions.path,
      method: routeOptions.method
    }

    const response = await server.inject(request)
    expect(response.statusCode).to.equal(200)
    expect(response.result.ip).to.equal('8.8.8.8')
    expect(Object.keys(response.result)).to.contain(['hostname'])
  })

  it('works without a fake IP address', { timeout: 10000 }, async () => {
    const routeOptions = {
      path: '/with-empty-fake-ip',
      method: 'GET',
      config: {
        handler: request => request.location,
        plugins: {
          'hapi-geo-locate': { fakeIP: '' }
        }
      }
    }

    server.route(routeOptions)

    const request = {
      url: routeOptions.path,
      method: routeOptions.method
    }

    const response = await server.inject(request)
    expect(response.statusCode).to.equal(200)
    expect(response.result.ip).to.equal('127.0.0.1')
  })
})
