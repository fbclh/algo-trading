// Import lodash
const _ = require('lodash');

// Import alpaca API
const Alpaca = require('@alpacahq/alpaca-trade-api');

// Import Simple Moving Average from technicalindicators
const SMA = require('technicalindicators').SMA;

// New alpaca object
const alpaca = new Alpaca({
  keyId: process.env.API_KEY,
  secretKey: process.env.SECRET_API_KEY,
  paper: true,
});

let sma20;
let sma50;

// Last order to sell will make the next order a buy order and vice-versa;
let lastOrder = 'SELL';

// Setup SMA 20 and 50
async function initializeAverages() {
  const initialData = await alpaca.getBarsV2('1Min', 'SPY', {
    limit: 50,
    until: new Date(),
  });

  const closeValues = _.map(initialData.SPY, (bar) => bar.c);

  sma20 = new SMA({ period: 20, values: closeValues });
  sma50 = new SMA({ period: 50, values: closeValues });

  console.log(`sma20: ${sma20.getResult()}`);
  console.log(`sma50: ${sma50.getResult()}`);
}

initializeAverages();

// const client = alpaca.websocket;

// client.onConnect(() => {
//   console.log('Connected to client');
//   setTimeout(() => client.disconnect(), 5 * 1000);
// });

const client = alpaca.data_ws;

client.onConnect(() => {
  client.subscribe(['alpacadatav1/AM.SPY']);
  setTimeout(() => client.disconnect(), 6000 * 1000);
});

//

client.onStockAggMin((subject, data) => {
  // const nextValue = data.closePrice;

  // const next20 = sma20.nextValue(nextValue);
  // const next50 = sma50.nextValue(nextValue);

  console.log(`subject: ${subject}`);
  console.log(`data: ${data}`);

  // if (next20 > next50 && lastOrder !== 'BUY') {
  //   alpaca.createOrder({
  //     symbol: 'SPY',
  //     qty: 300,
  //     side: 'buy',
  //     type: 'market',
  //     time_in_force: 'day',
  //   });

  //   lastOrder = 'BUY';
  //   console.log('\nBUY\n');
  // } else if (next20 < next50 && lastOrder !== 'SELL') {
  //   alpaca.createOrder({
  //     symbol: 'SPY',
  //     qty: 300,
  //     side: 'sell',
  //     type: 'market',
  //     time_in_force: 'day',
  //   });

  //   lastOrder = 'SELL';
  //   console.log('\nSELL\n');
  // }
});

client.connect();

//

// Print account information
// async function printAccount() {
//   const account = await alpaca.getAccount();
//   console.log(account);
// }

// printAccount();
