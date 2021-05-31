module.exports = {
    toIntArray: (array) => {
        const result = []
        array.map(item => {
            result.push(parseInt(item))
        })
        return result
    }
}
