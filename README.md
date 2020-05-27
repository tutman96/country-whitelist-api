## Installation

You need to signup for a _free_ Maxmind account to get a license key. Go to https://www.maxmind.com/en/geolite2/signup, obtain your key and put it in the MAXMIND_LICENSE_KEY into a .env file.

```bash
# .env
MAXMIND_LICENSE_KEY={YOUR MAXMIND LICENSE KEY}
```
Then run `export $(cat .env)` to source the environment variables into your current bash session.

Finally, run `yarn install`

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```