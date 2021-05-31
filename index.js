require('dotenv').config()
const crawler = require('./src/crawler')
const handler = require('./src/handler')

async function start() {
    await crawler.extract(process.env.BASE_DATA_URI)
    await handler.cleanCrawledData()
    await handler.generateNewRaffles()
    await handler.generateAleatoryRaffle()
}

start().then()