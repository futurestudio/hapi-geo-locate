# Changelog

## Version 1.1.2 (2017-03-24)
- add project badges for TravisCI, Snyk and NSP (both checking for dependency vulerabilities), NPM
- `fix` wrong import code in README
- `add` 2017 to license

## Version 1.1.1 (2017-02-12)
- change extension point from `onPreHandler` to `onPreAuth` to determine the location before validation
- improve tests for proxied requests and check explicitly for correct client IP address

## Version 1.1.0 (2017-02-01)
- detect client IP if request goes through multiple proxies ([thank you Anton!](https://futurestud.io/tutorials/hapi-geo-locate-hapi-plugin-for-client-geo-location-by-future-studio#comment-3092108774))
- add changelog to keep track of changes during releases

## Version 1.0.0 (2016-12-27)
- provide client location at `request.location` in route handler
- option to have the plugin `enabledByDefault`
- detect client IP from `request.info.remoteAddress`
- detect client IP through `x-forwared-for` header
