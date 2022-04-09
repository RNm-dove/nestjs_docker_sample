## BuildKitを使うとマルチステージビルドはスキップされる。

###############
#    base     #
###############
# 本番のベース。ここではosの必須ライブラリ以外は何もいれない。
FROM node:14.19-alpine3.15 as base

ENV LANG=ja_JP.UTF-8
ENV HOME=/home/node
ENV APP_HOME="$HOME/nestjs_docker_sample"

WORKDIR $APP_HOME

# port 番号
EXPOSE 3000

# global install curlはapiテストように入れた。
# gitはjestのwatchモードに必要
RUN apk upgrade --no-cache && \
    apk add --update --no-cache \
    postgresql-client curl git

# https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md#global-npm-dependencies
# npmのグローバル設定
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

COPY package*.json ./

RUN chown -R node:node .

USER node

RUN echo "WORKDIR is $WORKDIR . HOME is $HOME . LANG is $LANG ." && npm config list

###############
#     dev     #
###############
# docker-composeでコードを共有する前提
# このステージでnpm ciしても、結局マウント時にホスト側のnode_modulesで塗りつぶされてしまう。
FROM base as dev
ENV NODE_ENV=development

RUN npm i -g @nestjs/cli
RUN npm i -g prisma

###############
#     test    #
###############
# docker-composeでnode_modules以外のコードを共有する前提。
# docker-composeのprebuild-testに対応。
FROM dev as test
ENV NODE_ENV=test

RUN npm ci

###############
#    build    #
###############
# ソースコードをビルドする。
# ビルド時にテストファイルを除外しているので、テストはビルド前に行う。
FROM test as build

COPY --chown=node . .

RUN npm run build

###############
#    prod     #
###############
# ターゲットを指定しなければデフォルトで実行される
# dependenciesのみインストールされている
FROM base as prod
ENV NODE_ENV=production

# 設定ファイル系
COPY --from=build /$APP_HOME/dist /$APP_HOME/.dockerignore ./

RUN npm ci --only=production \
    && npm cache clean --force

CMD ["node", "src/main.js"]
