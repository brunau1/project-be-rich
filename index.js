require('dotenv').config()
const crawler = require('./crawler')
const handler = require('./handler')

async function start() {
    await crawler.extract(process.env.BASE_DATA_URI)
    await handler.cleanCrawledData()
    await handler.generateNewRaffles()
    await handler.generateAleatoryRaffle()
}

start().then()