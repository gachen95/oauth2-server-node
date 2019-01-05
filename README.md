# Introduction

There are two good open source libraries [node-oauth2-server](https://github.com/oauthjs/node-oauth2-server) and [oauth2orize](https://github.com/jaredhanson/oauth2orize) for nodejs [oauth2](https://www.oauth.com/).

This is an example that uses [node-oauth2-server](https://github.com/oauthjs/node-oauth2-server)(version 3.0.1) with Mongoose and Express.

# Prerequisites
- Linux or Mac OS. I tested it in **ubuntu 18.0.4 LTS**.
- Ubuntu needs to install make and g++ for bcrypt. 
  ```sh
  $ sudo apt-get update
  $ sudo apt-get install make
  $ sudo apt-get install g++
  ```
- Node
  - install node. I used [n](https://github.com/tj/n) to install and manage node.js versions
    ```sh
    $ curl -L https://git.io/n-install | bash
    $ n 10.13.0
    $ node -v
    v10.13.0
    $ npm -v
    6.4.1
    ```
  - install [yarn](https://yarnpkg.com/lang/en/docs/migrating-from-npm/). Migrating from npm to yarn.
    ```sh
    $ npm install -g yarn
    $ yarn -v
    1.12.3    
    ```  
- Mongodb
  - Add MongoDB Package repository Key to Ubuntu
    ```sh
    $ sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2930ADAE8CAF5059EE73BB4B58712A2291FA4AD5
    ```
  - Add MongoDB Package repository to Ubuntu
    ```sh
    $ echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.6 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.6.list
    ```
  - Install MongoDB on Ubuntu 18.04
    ```sh
    $ sudo apt update
    $ sudo apt install -y mongodb-org
    ```
  - Manage MongoDB
    ```sh
    $ sudo systemctl stop mongod.service
    $ sudo systemctl start mongod.service
    $ sudo systemctl enable mongod.service
    $ sudo systemctl status mongod
    ```


# Running

## download source code

```sh
$ git clone https://github.com/gachen95/oauth2-server-node
```

## Install Dependencies

```sh
$ cd oauth2-server-node
$ yarn install
```

## seed data

```sh
$ node seed.js
```

## run 

```sh
$ npm start
```

## configure mongo db url and server url
All the configure files are in folder config.   
By default, it uses development.json. If you want to change it, just set **NODE_ENV**.

## Obtaining a token

To obtain a token you should POST to `http://localhost:3000/oauth/token`.

For eample, use **curl** command to obtain a token 

-  **client_id and client_secret are in request body**

```sh
$ curl http://localhost:3000/oauth/token \
 -d "grant_type=password" \
 -d "username=gachen95@example.com" \
 -d "password=test" \
 -d "client_id=application" \
 -d "client_secret=secret"

 % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   378  100   272  100   106   1581    616 --:--:-- --:--:-- --:--:--  2197
{
  "accessToken":"0f2cc3b4c0fc9e7d3ea9be0303dae73bc81e4b5f",
  "accessTokenExpiresAt":"2019-01-03T22:15:37.875Z",
  "refreshToken":"4fd941935d7957166b5f4aad9465765ce2a52f11",
  "refreshTokenExpiresAt":"2019-01-17T21:15:37.878Z",
  "client":
    {
      "id":"application"
    },
  "user":
    {
      "id":"gachen95"
    }
}

```

-  **client_id and client_secret are in request headers**
   - **Authorization**: `"Basic " + clientId:clientSecret base64'd`
     - (for example, to use `application:secret`, you should send `Basic YXBwbGljYXRpb246c2VjcmV0`)
    - **Content-Type**: `application/x-www-form-urlencoded`
```sh
$ curl http://localhost:3000/oauth/token \
 -d "grant_type=password" \
 -d "username=gachen95@example.com" \
 -d "password=test" \
 -H "Authorization: Basic YXBwbGljYXRpb246c2VjcmV0" \
 -H "Content-Type: application/x-www-form-urlencoded"

  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   335  100   272  100    63   2893    670 --:--:-- --:--:-- --:--:--  3563
{
  "accessToken":"3c0a8aba9c9d634641376491963c2141178efa5f",
  "accessTokenExpiresAt":"2019-01-03T22:18:36.887Z",
  "refreshToken":"02e438c90d02a1713f1c73a10c4cc40d8ddfdb42",
  "refreshTokenExpiresAt":"2019-01-17T21:18:36.887Z",
  "client":
    {
      "id":"application"
    },
  "user":
    {
      "id":"gachen95"
    }
}

```

## With refresh_token grant

- **Authorization**: `"Basic " + clientId:clientSecret base64'd`

```sh
$ curl http://localhost:3000/oauth/token \
	-d "grant_type=refresh_token" \
	-d "refresh_token=02e438c90d02a1713f1c73a10c4cc40d8ddfdb42" \
	-H "Authorization: Basic YXBwbGljYXRpb246c2VjcmV0" \
	-H "Content-Type: application/x-www-form-urlencoded"

  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   351  100   272  100    79   5787   1680 --:--:-- --:--:-- --:--:--  7468
{
  "accessToken":"033b0721c946be2ab9e969acd12c6675e101b421",
  "accessTokenExpiresAt":"2019-01-03T22:20:48.453Z",
  "refreshToken":"1eb0d9334658c1a6215e8d1a8d18b838126b0e3a",
  "refreshTokenExpiresAt":"2019-01-17T21:20:48.453Z",
  "client":{"id":"application"},
  "user":{"id":"gachen95"}
}

```

## Using the token

- **Authorization**: `"Bearer " + access_token`
  
```sh
$ curl http://localhost:3000/oauth/verify \
	-H "Authorization: Bearer 033b0721c946be2ab9e969acd12c6675e101b421"

  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100    96  100    96    0     0   2042      0 --:--:-- --:--:-- --:--:--  2042
{
  "active":true,
  "client_id":"application",
  "username":"gachen95",
  "exp":"2019-01-03T22:20:48.453Z"
}

```


# Reference

- [OAuth2 Server Example](https://github.com/mekentosj/oauth2-example)
- [node-oauth2-server example](https://github.com/pedroetb/node-oauth2-server-example)
- [node-oauth2-server with MongoDB example](https://github.com/pedroetb/node-oauth2-server-mongo-example)
