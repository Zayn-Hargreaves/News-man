const express = require('express')
const app = express()
const dotenv = require('dotenv')
const body_parser = require('body-parser')
const cors = require('cors')
const path = require('path')

dotenv.config()

app.use(body_parser.json())

require("./dbs/association")();


// Cấu hình CORS cho môi trường phát triển và sản xuất
if (process.env.mode === 'production') {
    app.use(cors())
} else {
    app.use(cors({
        origin: ["http://localhost:5173", "http://localhost:3000"]
    }))
}
app.get('/', (req, res) => res.send('Hello World!'))

const port = process.env.port


app.listen(port, () => console.log(`Server is running on port ${port}!`))
