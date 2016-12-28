# hapi-geo-locate
A hapi plugin to geo locate requests by IP and provide `request.location` in your route handlers. The plugin uses [ipinfo.io](http://ipinfo.io/) for the IP geo location.

[![Build Status](https://travis-ci.org/fs-opensource/hapi-geo-locate.svg?branch=master)](https://travis-ci.org/fs-opensource/hapi-geo-locate)

[![NSP Status](https://nodesecurity.io/orgs/future-studio/projects/41f5cf32-7bb6-43c9-9677-84c2c635de43/badge)](https://nodesecurity.io/orgs/future-studio/projects/41f5cf32-7bb6-43c9-9677-84c2c635de43)


## Requirements
The plugin is written in ES2016, please use **Node.js v4 or later**.


## Installation
Add `hapi-geo-locate` as a dependency to your project:

```bash
npm i -S hapi-geo-locate
# you’re using NPM shortcuts to (i)nstall and (-S)ave the module as a dependency
```


## Usage
The most straight forward way to register the `hapi-geo-locate` plugin: 

```js
server.register(require('hapi-geo-locate'), (err) => {
    if (err) {
        // handle plugin registration error
    }
    
    // went smooth like chocolate :)
})

// Within your route handler functions, you can access the location like this
server.route({
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
        const location = request.location
        // use client location
        
        reply(request.location)
    }
})
```


## Plugin Registration Options
The following plugin options allow you to customize the default behavior of `hapi-geo-locate`:

- **enabledByDefault**: `(boolean)`, default: `true` — by default, the plugin geo locates the request by IP on every request

```js
server.register({
    require('hapi-geo-locate'),
    options: {
        enabledByDefault: true
    }
}, (err) => {
    // …
})

// Within your route handler functions, you can access the location like this
server.route({
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
        const location = request.location // will be undefined
        reply(location)
    }
})
```


## Plugin Route Handler Options
The following plugin options allow you to customize the behavior of `hapi-geo-locate` on individual route handlers:

- **enabled**: `(boolean)` — tells the plugin to enable (`true`) or disable (`false`) geo location for the request by IP

The plugin configuration can be customized using the `hapiGeoLocation` (plugin name in camelCase) key:

```js
server.register({
    require('hapi-geo-locate'),
    options: {
        enabledByDefault: true
    }
}, (err) => {
    // …
})

// Within your route handler functions, you can access the location like this
server.route({
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
        const location = request.location
        // use the location
        
        reply(location)
    },
    config: {
        plugins: {
            hapiGeoLocate: {
                enabled: true
            }
        }
    }
})
```


## Supported Proxies
Running your application behind a (reverse) proxy like nginx, the client’s IP address gets reset to localhost. You can pass the actual request IP to your app using a header. 

The current version supports the following proxies:

- **nginx:** using the `x-forwarded-for` header field

Proxied IP addresses are prefered over the address found in `request.info.remoteAddress`! There’s currently no option to change that behavior. If you need to self-select the prefered method to determine the client IP, please let me know so I can add this feature or even better: create a pull request :)


## Feature Requests
Do you miss a feature? Please don’t hesitate to [create an issue](https://github.com/fs-opensource/hapi-geo-locate/issues) with a short description of your desired addition to this plugin.


## Links & Resources

- [hapi tutorial series](https://futurestud.io/tutorials/hapi-get-your-server-up-and-running)


## Contributing

1.  Create a fork
2.  Create your feature branch: `git checkout -b my-feature`
3.  Commit your changes: `git commit -am 'Add some feature'`
4.  Push to the branch: `git push origin my-new-feature`
5.  Submit a pull request 🚀


## License

MIT © [Future Studio](https://futurestud.io)

---

> [futurestud.io](https://futurestud.io) &nbsp;&middot;&nbsp;
> GitHub [@fs-opensource](https://github.com/fs-opensource/) &nbsp;&middot;&nbsp;
> Twitter [@futurestud_io](https://twitter.com/futurestud_io)
