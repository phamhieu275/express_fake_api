const express = require('express'),
    fs = require('fs'),
    readline = require('readline'),
    once = require('events'),
    urlLib = require('url')

const app = express()

const errorFile = 'data/error.json'
const fileData = 'data/data.csv'

async function findData(param) {
    const fileStream = fs.createReadStream(fileData)

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    })

    let jsonPath = errorFile

    for await (const line of rl) {
        const data = line.split(',')

        if (data[0] == param) {
            jsonPath = data[1]
            break
        }
    }

    return JSON.parse(fs.readFileSync(jsonPath))
}

app.get('/search', async (req, res) => {
    var param = urlLib.parse(req.url).query
    var jsonPath = await findData(param)
    return res.json(jsonPath)
})
app.listen(3000, () => console.log('App listening on port 3000!'))
