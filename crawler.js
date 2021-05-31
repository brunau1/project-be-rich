const fetch = require("node-fetch")
const cheerio = require("cheerio")
const utils = require('./utils')
const fs = require('fs')

const selector = "body > main > div:nth-child(2) > div > div > div:nth-child(2)"
const separators = { 0: 'A lista abaixo mostra, o concurso, a data do sorteio e os números sorteados!', 1: 'Se você quiser fazer' }

async function extract(url) {
    console.log("crawling", url)

    const response = await fetch(url)
    const html = await response.text()
    const $ = cheerio.load(html)
    const content = $(selector).text()

    const textInParts = content.split(separators[0])[1].split(separators[1])[0].split(' ')
    const dataToSave = []

    let hasMoreResults = true
    let itsTheLast = false
    let currentRaffle = []
    while (hasMoreResults) {
        if (textInParts[10].length == 6) {
            currentRaffle = textInParts.splice(0, 10)
            currentRaffle.push(textInParts[0].substring(0, 2))
            textInParts[0] = textInParts[0].substring(2, 6)
        }
        else currentRaffle = textInParts.splice(0, 11)
        const raffle = {
            code: currentRaffle[0],
            date: currentRaffle[2],
            raffle: utils.toIntArray(currentRaffle.slice(5, 11))
        }
        dataToSave.push(raffle)
        hasMoreResults = !!itsTheLast ? false : true
        itsTheLast = textInParts.length <= 11 && textInParts.length > 0
    }
    fs.writeFileSync('data.json', JSON.stringify(dataToSave, null, 2))
}

module.exports = { extract }