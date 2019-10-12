'use strict'

const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const Hapi = require('@hapi/hapi')

const server = new Hapi.Server()

const lab = (exports.lab = Lab.script())
const { experiment, it, before } = lab

experiment('hapi-geo-locate detect client location with proxied request (x-forwarded-for header)', () => {
  before(async () => {
    await server.register({
      plugin: require('../lib/index'),
      options: {
        enabledByDefault: true
      }
    })
  })

  it('proxies a request through a single, empty proxy header', { timeout: 10000 }, async () => {
    const routeOptions = {
      path: '/no-proxy',
      method: 'GET',
      handler: request => request.location
    }

    server.route(routeOptions)

    const request = {
      url: routeOptions.path,
      method: routeOptions.method,
      headers: { 'x-forwarded-for': '' }
    }

    const response = await server.inject(request)
    Code.expect(response.statusCode).to.equal(200)
    Code.expect(response.result.ip).to.equal('127.0.0.1')
  })

  it('proxies a request through a single proxy header', { timeout: 10000 }, async () => {
    const routeOptions = {
      path: '/single-proxy',
      method: 'GET',
      handler: request => request.location

    }

    server.route(routeOptions)

    const request = {
      url: routeOptions.path,
      method: routeOptions.method,
      headers: { 'x-forwarded-for': '8.8.8.8' }
    }

    const response = await server.inject(request)
    Code.expect(response.statusCode).to.equal(200)
    Code.expect(response.result.ip).to.equal('8.8.8.8')
    Code.expect(Object.keys(response.result)).to.contain(['hostname'])
  })

  it('proxies a request through multiple proxies', { timeout: 10000 }, async () => {
    const routeOptions = {
      path: '/multiple-proxies',
      method: 'GET',
      handler: request => request.location

    }

    server.route(routeOptions)

    const request = {
      url: routeOptions.path,
      method: routeOptions.method,
      headers: { 'x-forwarded-for': '8.8.8.8, 4.4.4.4, 1.1.1.1' }
    }

    const response = await server.inject(request)
    Code.expect(response.statusCode).to.equal(200)
    Code.expect(response.result.ip).to.exist()
    Code.expect(response.result.ip).to.equal('8.8.8.8')
    Code.expect(response.result.city).to.exist()
  })
})
