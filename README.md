<!--
/*
 * Thanks for downloading this project, if you have any ideas, tweaks, etc...
 * fork the repository and create a Pull Request.
 */
-->

<p align="center">
  <img 
    width="200px" 
    height="80%" 
    src="https://media.giphy.com/media/VWnIHI4rK8b9CvMNub/giphy.gif" 
    alt="Sales BOT to WhatsApp @eduardoc7"
    title="Sales BOT to WhatsApp @eduardoc7"
  /></a>
</p>

<h3 align="center">Sales Bot to WhatsApp - NodeJS TypeScript</h3>

<p align="center">
  <img alt="GitHub count language" src="https://img.shields.io/github/languages/count/eduardoc7/bubblebot" />
  <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/eduardoc7/bubblebot" />
  <img alt="GitHub repo size" src="https://img.shields.io/github/repo-size/eduardoc7/bubblebot" />
  <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/eduardoc7/bubblebot" />
</p>

## 📖 Presentation:
A Whatsapp bot that automates your sales without having to leave Whatsapp in an innovative way, allowing you to manage an order from its creation to delivery. Using [Redis](https://redis.io/) for order cache management to make it simple and fast.
This application is a Client that simulates the connection to WhatsApp Web through **Puppeteer**, instantiating the connection in real time. 

 <a href="https://buymeacoffee.com/eduardocorg" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a>

---

## 🧰 Features:
 - [X] Pix Payments
 - [X] Integration with Mercado Pago API
 - [X] Orders status notification
 - [X] Order management commands
 - [X] Save order in database
 - [X] Load order for group management on Whatsapp
 - [X] Create orders by cart from whatsapp
 - [X] Create orders by API
 - [X] Create orders reports by a only command

---

## 🤖 Commands Avaliable:
 - [X] **#ok**: To confirm the order generated by the Whatsapp cart
 - [X] **#duvidas**: To get help with the bot
 - [X] **#bot**: To get info about bubble bot creation
 - [X] **#car**: To get a video that's help with shopping car generation
 - [X] **#ver**: To get a info about your order active
 - [X] **#cancela**: To cancel the active order
 - [X] **#ajuda**: To call an attendant and talk to a human
 - [X] **#encerra**: Admin command. To done the attendance.
 - [X] **#atualiza**: Admin command. To update a order status manually.
 - [X] **#pedidos**: Admin command. To generate a report of all orders generated.
 - [X] **#mostra**: Admin command. To load all orders from the database for a view group on Whatsapp.
 - [X] **#pay**: Admin command. To update a payment status from order manually.
 - [X] **#pix**: Admin command. To generate a new pix payment to a order manually.

---

## 🛠 Install and build:

```bash
# Download project
$ git clone git@github.com:eduardoc7/bubblebot.git

# Install TypeScript Global
$ npm i -g typescript

# Install dependencies
$ yarn install or npm install

```
## ▶ Running:

```bash
# Configuration .env
$ cp .env.example .env

# Start the app
$ yarn dev or npm run dev

# Test the app
$ yarn test or npm run test

# Build the app to deploy
$ yarn build or npm run build
```

<small>If you get an error with the Puppeteer dependency, use: `sudo npm install -g puppeteer --unsafe-perm=true`<br/>
After configuration, it is necessary to link the application to your WhatsApp, for that, just scan the QR Code on your terminal.
</small>

---

## Disclaimer

This project is not affiliated with, associated with, authorized, endorsed by, or in any way officially connected with WhatsApp or any of its subsidiaries or affiliates. The official WhatsApp website can be found at https://whatsapp.com. "WhatsApp" as well as related names, brands, emblems and images are trademarks of their respective owners.

## Thanks and Credits

- [@pedroslopez](https://github.com/pedroslopez)

## Info to contact

- [LinkedIn](https://www.linkedin.com/in/eduardo-cordeiro-ba5278195/)
- eduardo.cordeiro1@outlook.com

## License

Copyright © 2022 [Eduardo Cordeiro](https://github.com/eduardoc7).<br />
This project is [MIT](https://github.com/eduardoc7/bubblebot/blob/master/LICENSE) licensed.
