const express = require('express')
var cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json());

const port = 5000
const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/SDS"
mongoose.connect(mongoURI, () => {
    console.log("DB Connected successfully")
})


app.use('/auth', require('./auth'))

app.listen(port, () => {
    console.log(`Server Spinning on port:${port}`)
})
