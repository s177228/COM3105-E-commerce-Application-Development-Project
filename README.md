# COM3105-E-commerce-Application-Development-Project

## Cybersell

This is a node.js application for e-commerce.

## Mainly Used module
```
Node.js
express
mongoose
socket.io
ejs
```

## How to use it
* Install it with
```
npm install
yarn install
```
* change the file name of .env.template
```
cp .env.template .env
```
* if you not running mongodb locally you may need change the path of mongodb in .env file
```
vim .env / nano .env
mongoURL = 'mongodb://YOUR_PATH:27017/DB_NAME'
```

## Function
- [x] Fake google ads.
- [x] user login/ register/ logout system
- [x] sell (upload) product
- [x] view product detail
- [x] talk with seller
- [x] manage (delete) the products
- [x] products status on manage page
- [ ] sold button for seller in inbox