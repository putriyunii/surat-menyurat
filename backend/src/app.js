const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const path = require('path')
const migration = require('./models/migration')
const router = require('./routes/routes')


const app = express()
const port = 3000

app.use(cors())
migration()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use("/api", router)

app.use("/files", express.static(path.join(__dirname, "files")));


app.listen(port, () => {
    console.log(`jalan di port ${port}`)
})