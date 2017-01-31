# Changelog

## Version 1.1.0 (2017-xx-xx)
- detect client IP if request goes through multiple proxies ([thank you Anton!](https://futurestud.io/tutorials/hapi-geo-locate-hapi-plugin-for-client-geo-location-by-future-studio#comment-3092108774))  
- add changelog to keep track of changes during releases

## Version 1.0.0 (2016-12-27)
- provide client location at `request.location` in route handler
- option to have the plugin `enabledByDefault`
- detect client IP from `request.info.remoteAddress`
- detect client IP through `x-forwared-for` header
