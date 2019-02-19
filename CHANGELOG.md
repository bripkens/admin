# Changelog

## 1.4.1
 - Upgrade `handlebars` and `hbs` dependencies to address security issues.

## 1.4.0
 - Remove unused `ajv` dependency.
 - Use `get-logger` for easy log configuration.

## 1.3.0
 - Add supporting infrastructure for simple live metric presentation.

## 1.2.0
 - Allow `null` and `undefined` to be passed as plugins such that plugins can easily be enabled / disabled using plain JavaScript mechanisms.
 - Ensure that static assets can always be loaded.

## 1.1.0
 - Support a URL parameter called `json` which will translate the HTTP `Accept` header to `Accept: application/json` for easier integration into tools, e.g. Consul.

## 1.0.2
 - HTTP bind address and port cannot be changed.

## 1.0.1
 - Styles and scripts cannot be loaded.

## 1.0.0
 - Initial release
