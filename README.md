# Zendesk Sell App in Zapier 

[Zendesk Sell App](https://zapier.com/apps/zendesk-sell/integrations/) is an application written 
for Zapier Platform which utilizes Zendesk Sell [Public API](https://developers.getbase.com/) for building
Zap workflows. Zendesk Sell App exposes mutliple triggers, actions and searches to allow users build
integrations between different applications on their own. 
Zapier combines Triggers (like `New Lead`) and Actions (like `Create Note`) to perform an action 
in one app when a trigger occurs in another app.

### What is Zendesk Sell?

[Zendesk Sell](https://getbase.com/) (formerly Base) is a sales automation tool to enhance productivity, 
processes, and pipeline visibility for sales teams.

### What is Zapier and how integration works?

[Zapier](https://zapier.com/) is a tool that allows you to connect the apps you use every day in order to automate tasks and save time. 
You can connect any of 1,400+ integrated apps together to make your own automations.
Check [this guide](https://zapier.com/learn/getting-started-guide/) to better understand how Zapier works and how the 
building blocks like `trigger`, `action`, `zap` are used below.

## Getting Started

### Requirements

Zendesk Sell App requires [Node.js](https://nodejs.org/en/) `v8.10.0` (this is the version of Node which is used in Zapier infrastructure). 
You can develop using any version of Node you'd like, but your eventual code must be compatible with `v8.10.0`.
You can simply download proper node environment using [nvm](https://github.com/creationix/nvm). 
Additionally, [yarn](https://yarnpkg.com/en/) is used as a package manager so it has to be installed before going further.

```bash
git clone git@github.com:fstech/zapier-base-app.git && cd zapier-base-app/
nvm use && yarn install
```

You are ready to install [Zapier Platform CLI](https://github.com/zapier/zapier-platform-cli) which is your gateway 
to creating applications in Zapier platform and connecting your Zapier account.

```bash
# Install the Zapier Platform CLI globally
yarn global add zapier-platform-cli

# Authorize Zapier to use your account's credentials
zapier login
```

Now it's time to [connect](https://github.com/zapier/zapier-platform-cli#quick-setup-guide) your local copy of 
Zendesk Sell App to Zapier platform.
```bash
# Link your working directory with existing CLI application
zapier link

# or register new one in Zapier platform
zapier register "Zendesk Sell App"
```
Details about `zapier` command and its features can be found [here](https://zapier.github.io/zapier-platform-cli/cli.html).

### Running tests

Zendesk Sell App is written using [TypeScript](https://www.typescriptlang.org/) which requires code to be compiled before being validated or pushed to Zapier Platform. 
I recommend using predefined commands from `package.json` which always perform compilation (e.g. before uploading or running tests), 
this makes sure tests are being run on your current version.

If you want to build it on your own you can use:
```bash
# Compiles application on demand
yarn run build 

# Starts ts compiler in watch mode
yarn run build-dev  
```

The project has [TSLint](https://palantir.github.io/tslint/) rules defined in `tslint.json` file 
so you can simply validate and fix your code using:
```bash
yarn run lint-fix 
```

You can run all tests using the command shown below. The Runner will perform [Zapier Validation](https://zapier.github.io/zapier-platform-cli/cli.html#validate) 
to check if project is semantically correct (triggers/actions/searches are properly configured and attached to application) 
and then start executing unit tests with [jest](https://jestjs.io/). (`zapier-test` will perform TypeScript compilation for you)
```bash
yarn run zapier-test
```

### Deployments

If you tests are passing and the codebase validation succeeds, we can move forward to the deployment

Zapier Apps become "immutable" after deployment which means that if we want to introduce 
changes we have to do it in a new version, deploy the application and then migrate users to new version if everything works. 
If this is your first deployment of Zendesk Sell App please check if OAuth2 is properly set up and
environment [variables are set](#setting-up-oauth2). Detailed descriptions of Zapier deployments can be found [here](https://zapier.github.io/zapier-platform-cli/#deploying-an-app-version).

Let's assume that the current version of application is `1.0.0`, we made some **backward compatible** changes 
and want to deploy them to the Zapier Platform to make them available for all users 
(if changes are not backward compatible you cannot migrate users to the new version, because it would corrupt their Zaps). 
This is how it looks like step by step: 
* Replace `version` entry in [package.json](/package.json) with next minor version `1.0.1`
* Run tests and push application `yarn run zapier-test && yarn run zapier-push`, at this point Application is published, 
but all users are still using previous version
* Migrate test account to run tests and manually double check if everything works `zapier migrate 1.0.0 1.0.1 --username=testuser@example.com` 
* If application is public you have to [promote it first](https://zapier.github.io/zapier-platform-cli/#promoting-an-app-version) 
`zapier promote 1.0.1`
* Migrate all the users to the newer version `zapier migrate 1.0.0 1.0.1 100%`

All commands in one place:
```bash
export CURRENT_VERSION=1.0.0
export NEXT_VERSION=1.0.1

yarn run zapier-test && yarn run zapier-push
zapier migrate $CURRENT_VERSION $NEXT_VERSION --username=testuser@example.com
zapier promote $NEXT_VERSION
zapier migrate $CURRENT_VERSION $NEXT_VERSION 100%
``` 

### Project structure

The `index.ts` is Zapier's entry point to the application, you can find declarations of all triggers, 
actions and searches there, which means that all operations defined there (unless they are `hidden: true`) 
will be visible to users and can be used while creating Zap flows. Actions, triggers and searches
are stored per resource type (e.g. all operations related to deal can be found in `deal/` directory), 
to make them more distinguishable actions has `.action.ts` suffix, triggers `.trigger.ts` and so on.
```plain
$ tree .
.
├── README.md
├── CHANGELOG.md
├── index.js
├── package.json
├── src
│    ├── auth
│    ├── common 
│    ├── contact
│    ├── deal
│    ├── lead
│    ├── notesTasks
│    ├── products
│    ├── users
│    ├── utils
│    ├── index.ts
│    └── ...
├── build
│   └── build.zip
├── lib
│   └── ...
└── node_modules
```

Description of main directories in repository:
* `src` - sources and tests of all items that are present at runtime
    * `auth` - [OAuth2 configuration](https://zapier.github.io/zapier-platform-cli/#oauth2) 
    for [Zendesk Sell Public API](https://developers.getbase.com/docs/rest/articles/oauth2/introduction)
    * `common` - logic responsible for handling resources used in multiple places (e.g. `custom fields`, `industry`, `tags` etc).
    Also contains helpers for fetching and saving resources using Zendesk Sell Public API
    * `contact`, `deal`, `lead`, `notesTasks`, `products` - triggers, actions and searches related to specific resources
    * `utils` - helper utils for handling API requests, extracting data from envelopes, parsing errors, mocking Zapier Platform objects within tests etc.
    * `index.ts` - Zendesk Sell App entry point
* `lib` - contains ES5 files generateD by TypeScript compiler
* `build` - contains zips generateD by Zapier Platform CLI which will be uploaded during `yarn zapier-push`
  
## Setting up OAuth2

Zendesk Sell App uses 3-legged OAuth2 flow which requires developer application to be defined on Zendesk Sell side. 
Details on how OAuth2 is implemented can be found [here](/src/auth/authentication.ts).
In case of any problems with OAuth2, please verify if **Redirect URL**, **ClientId** and **ClientSecret** values are correct.

### Create a developer application in Zendesk Sell
First, we need to set up developer application in Zendesk Sell to enable OAuth2 flow for application. 

Login to your [Zendesk Sell account](https://app.futuresimple.com/sales) and then go to: 
**Settings** -> **OAuth2** -> **Developer Apps** (or use [this link](https://app.futuresimple.com/settings/oauth/apps))
and create a new developer application 
![Developer Apps](https://monosnap.com/image/z2IX5SJZz6BsagB6fWSEdOD81nWYHH.png)

Inputs:
* website - `https://zapier.com`
* redirect url - see below
* terms of service - `https://zapier.com/terms/`
* logo - `https://zapier.com/brand/assets/images/logos/zapier-logo.png`

#### How to get Redirect URI to my Zapier Application? 
RedirectUrl is generated immediately after uploading application into Zapier Platform (`yarn run zapier-push`), you can obtain it by typing:
```zapier describe --format=json | grep 'Redirect URI'```

### Push OAuth2 configuration via ENV 
After creating Developer App on Zendesk Sell side you will get `client_id` and `client_secret` which have to be passed to Zapier application to allow authorization using OAuth2

```bash
zapier env <application_version> CLIENT_ID <value from devloper app>
zapier env <application_version> CLIENT_SECRET <value from devloper app>
```

## Contributors

* Mateusz Sękara ([mateusz-sekara](https://github.com/mateusz-sekara))
* Radosław Przebieglec ([rprzebieglec](https://github.com/rprzebieglec))

## License

Copyright 2019 Zendesk

Licensed under the [Apache License, Version 2.0](LICENSE)