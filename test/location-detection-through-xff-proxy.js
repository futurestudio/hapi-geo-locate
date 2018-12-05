'use strict'

const Lab = require('lab')
const Code = require('code')
const Hapi = require('hapi')

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

  it('proxies a request through a single, empty proxy header', async () => {
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
    const payload = JSON.parse(response.payload || '{}')

    Code.expect(response.statusCode).to.equal(200)
    Code.expect(Object.keys(payload)).to.contain(['ip'])
    Code.expect(payload.ip).to.equal('127.0.0.1')
  })

  it('proxies a request through a single proxy header', async () => {
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
    const payload = JSON.parse(response.payload || '{}')

    Code.expect(response.statusCode).to.equal(200)
    Code.expect(Object.keys(payload)).to.contain(['ip'])
    Code.expect(Object.keys(payload)).to.contain(['hostname'])
    Code.expect(payload.ip).to.equal('8.8.8.8')
  })

  it('proxies a request through multiple proxies', async () => {
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
    const payload = JSON.parse(response.payload || '{}')

    Code.expect(response.statusCode).to.equal(200)
    Code.expect(payload.ip).to.exist()
    Code.expect(payload.ip).to.equal('8.8.8.8')
    Code.expect(payload.city).to.exist()
  })
})
