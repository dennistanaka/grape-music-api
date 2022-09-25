'use strict'

const express = require('express')
const bodyParser = require('body-parser')

// Constants
const PORT = 3000
const HOST = '0.0.0.0'

// App
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.json({ message: 'Hello World' })
})

app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`)
