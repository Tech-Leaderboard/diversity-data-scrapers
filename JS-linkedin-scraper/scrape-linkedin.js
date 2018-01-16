const request = require('request')
  , cheerio = require('cheerio')
  , Promise = require('bluebird')
  , Nightmare = require('nightmare')
  , RateLimiter = require('limiter').RateLimiter
  , EventEmitter = require('events')
  , util = require('util')
  , { csvFormat } = require('d3-dsv')
  , const { readFileSync, writeFileSync } = require('fs');


// Faking Human Delays
const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
}
 
browser
    .init()
    // do stuff
    .pause(getRandomInt(2000, 5000))
    // do more stuff