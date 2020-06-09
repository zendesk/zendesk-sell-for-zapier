## 1.0.19

* Added explanation to `Resource Id` field in Tasks and Notes 

## 1.0.18

* Fixing implicit conversion between Person and Company when for instance Person is passed to Update Company action
* Bumping `zapier-platform-core` to recent version (9.2.0)

## 1.0.17

* Fixing internal warnings related to output types

## 1.0.16

* Bumping other dependencies

## 1.0.15

* Bumping `node` to recent version from 12.x branch
* Bumping `zapier-platform-core` to recent version supporting new node

## 1.0.14

* Support for 429 responses from Public API (Rate Limiting) - App will not break while trying to parse response

## 1.0.13

* `zapier-platform-core` bumped to newer version `8.3.0`

## 1.0.12

* `zapier-platform-core` bumped to newer version `7.6.1`
* Improvements in Readme and some internal refactoring

## 1.0.11

* Minor changes in Public API for Custom Fields reflected on Zapier side

## 1.0.10

* Support for Products in Catalog (search or create, create action, update action and trigger for new products). [API reference](https://developers.getbase.com/docs/rest/reference/products)
* Minor fixes and improvements in the codebase
* `zapier-platform-core` dependency bumped up to `7.6.0`
* Better support for API errors - messages returned to the user when API call fails will be more meaningful (e.g. description of invalid fields)

## 1.0.9

* Improvements and fixes for date and datetime custom fields

## 1.0.8

* Added missing sample data to triggers

## 1.0.7

* Added triggers: `New Contact`, `Updated Lead`, `Updated Contact`, `Updated Deal`
* Added searches: `Find Lead/Deal Source`, `Find Deal Stage`
* Added actions: `Update Person`, `Update Company`, `Update Deal`

## 1.0.6

Initial release to public. Integration home page: https://zapier.com/apps/zendesk-sell
