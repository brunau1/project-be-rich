const fs = require('fs')

const dataToSave = []

async function cleanCrawledData() {
    const raffles = require('./data.json')
    for (let i = 1; i < 61; i++) {
        const current = {
            number: i,
            columns: [0, 0, 0, 0, 0, 0],
            totalAppear: 0,
            isTheMostFrequent: false,
            mostFrequentColumn: null
        }
        for (const raffle of raffles) {
            const pos = raffle.raffle.indexOf(i)
            if (pos != -1) {
                current.columns[pos] += 1
                current.totalAppear += 1
            }
        }
        let bigger = 0
        for (const num of current.columns)
            if (num > bigger)
                bigger = num

        current.mostFrequentColumn = current.columns.indexOf(bigger)
        dataToSave.push(current)
    }
    fs.writeFileSync('analized-data.json', JSON.stringify(dataToSave, null, 2))
}

async function generateNewRaffles() {
    const numbers = require('./analized-data.json')

    const mostFrequentOfEachColumn = []
    const lessFrequentOfEachColumn = []
    const mediumFrequentOfEachColumn = []
    const mostFrequentNumbers = []
    const lessFrequentNumbers = []
    const mediumFrequentNumbers = []


    getTheBiggerAndSmallerOfTheColumns(numbers, mostFrequentOfEachColumn,
        lessFrequentOfEachColumn)
    getTheMediumOfEachColumns(numbers, mediumFrequentOfEachColumn,
        mostFrequentOfEachColumn, lessFrequentOfEachColumn)
    getMostAndLessFrequentNumbers(numbers, mostFrequentNumbers, lessFrequentNumbers)
    // getMediumFrequentNumbers(numbers, mediumFrequentNumbers, mostFrequentNumbers, lessFrequentNumbers)

    console.log('aposta: ', mostFrequentOfEachColumn)
    console.log('aposta: ', lessFrequentOfEachColumn)
    console.log('aposta: ', mediumFrequentOfEachColumn)
    console.log('aposta: ', mostFrequentNumbers)
    console.log('aposta: ', lessFrequentNumbers)
}

function getTheBiggerAndSmallerOfTheColumns(data, most, less) {
    const bigger = {
        number: 0,
        value: 0
    }
    const smaller = {
        number: 0,
        value: 0
    }
    for (let column = 0; column < 6; column++) {
        for (const item of data) {
            if (item.columns[column] != 0) {
                if (bigger.value == 0) {
                    bigger.number = item.number
                    bigger.value = item.columns[column]
                }
                if (smaller.value == 0) {
                    smaller.number = item.number
                    smaller.value = item.columns[column]
                }
                if (item.columns[column] > bigger.value) {
                    bigger.number = item.number
                    bigger.value = item.columns[column]
                }
                if (item.columns[column] < smaller.value) {
                    smaller.number = item.number
                    smaller.value = item.columns[column]
                }
            }
        }
        most[column] = bigger.number
        less[column] = smaller.number

        bigger.value = 0
        smaller.value = 0
    }
}

// function getMediumFrequentNumbers(data, array, most, less) {
//     for (let column = 0; column < 6; column++) {
//         let value, bigger, smaller
//         for (const item of data) {
//             if (item.number == most[column])
//                 bigger = item.totalAppear
//             else if (item.number == less[column])
//                 smaller = item.totalAppear
//         }
//         value = parseInt((bigger + smaller) / 2)
//         for (const item of data)
//             array[column] = item.totalAppear <= value + 2 &&
//                 item.totalAppear >= value - 2 ? item.number : array[column]
//     }
// }

function getTheMediumOfEachColumns(data, array, most, less) {
    for (let column = 0; column < 6; column++) {
        let value, bigger, smaller
        for (const item of data) {
            if (item.number == most[column])
                bigger = item.columns[column]
            else if (item.number == less[column])
                smaller = item.columns[column]
        }
        value = parseInt((bigger + smaller) / 2)
        for (const item of data)
            array[column] = item.columns[column] <= value + 5 &&
                item.columns[column] >= value - 5 ? item.number : array[column]
    }
}

function getMostAndLessFrequentNumbers(data, most, less) {
    let currentLess = []
    let currentMost = []
    for (let column = 0; column < 6; column++) {
        if (!most[column])
            most[column] = data[0].totalAppear
        if (!less[column])
            less[column] = data[0].totalAppear
        for (const item of data) {
            if (column == 0) {
                if (most[column] < item.totalAppear) {
                    most[column] = item.totalAppear
                    currentMost[column] = item.number
                }
                if (less[column] > item.totalAppear) {
                    less[column] = item.totalAppear
                    currentLess[column] = item.number
                }
            }
            else {
                if (most[column] < item.totalAppear && item.totalAppear < most[column - 1]) {
                    most[column] = item.totalAppear
                    currentMost[column] = item.number
                }
                if (less[column] > item.totalAppear && item.totalAppear > less[column - 1]) {
                    less[column] = item.totalAppear
                    currentLess[column] = item.number
                }
            }
        }
    }
    for (let column = 0; column < 6; column++) {
        most[column] = currentMost[column]
        less[column] = currentLess[column]
    }
}

function generateAleatoryRaffle() {
    console.log('aposta: ', getRandom(1, 60), getRandom(1, 60), getRandom(1, 60),
        getRandom(1, 60), getRandom(1, 60), getRandom(1, 60))
}

function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = { cleanCrawledData, generateNewRaffles, generateAleatoryRaffle }