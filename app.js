const updateInteractions = require('./triggerInteractionsUpdate').updateInteractions
const cron = require('node-cron');

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.EA_PORT || 7070

cron.schedule('* * * * * *', function() { //every second
  // cron.schedule('0 0 * * Monday', function() { // every Monday
  console.log('running a task every second');
  updateInteractions();

});

app.listen(port, () => console.log(`Listening on port ${port}!`))
