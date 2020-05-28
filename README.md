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

## Updating the MaxMind IP Database
In order to update the maxmind database, all you need to do is rebuild the docker image, or run `yarn install --force` if running it locally.

## Building the Docker image
To build the docker image, you must pass the MaxMind License Key in as an arg, like so:
```bash
$ docker build -t $YOUR_IMAGE --build-arg MAXMIND_LICENSE_KEY=<YOUR LICENSE KEY> .
```

## Running the api server in Kubernetes
In order to run the api server in Kubernetes, you need to build the docker image as described above. You will also need Helm 3 and a working Kubernetes cluster.

If running on Docker for Mac, simply enable the built-in Kubernetes cluster, and run the following helm command:
```bash
helm upgrade --install country-whitelist chart/ --set deployment.image=$YOUR_IMAGE --set deployment.imagePullPolicy=Never
```

If running on an external Kubernetes cluster, you will need to push the docker image to a registry, and reference in the same helm command:
```bash
helm upgrade --install country-whitelist chart/ --set deployment.image=gcr.io/$YOUR_PROJECT/$YOUR_IMAGE
```