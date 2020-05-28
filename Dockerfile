FROM node:14-alpine as build

ARG MAXMIND_LICENSE_KEY
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . ./
RUN yarn build

# Remove Developer dependencies to decrease final image size.
# https://github.com/yarnpkg/yarn/issues/696
# yarn install --production --ignore-scripts --prefer-offline == npm prune --production 
RUN yarn install --production --ignore-scripts --prefer-offline

FROM node:14-alpine

WORKDIR /app
CMD yarn start:prod
EXPOSE 3000
USER 1000

COPY --from=build /app /app