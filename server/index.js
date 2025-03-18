require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
app.use(morgan('dev'))
app.use(express.json())
const PORT = process.env.PORT
const {
    client
} = require('./db')

const init = async () => {
    console.log('Connecting with database...')
    await client.connect()
    console.log('Database connected!')
    app.listen(PORT, () => {
        console.log('Server is listening to', PORT)
    })

}
init()