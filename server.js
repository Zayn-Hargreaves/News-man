const express = require('express')
const app = express()
const dotenv = require('dotenv')
const cors = require('cors')
const path = require('path')
const helmet = require("helmet")
const compression = require("compression")
dotenv.config()


require("./dbs/association")();


// Cấu hình CORS cho môi trường phát triển và sản xuất
if (process.env.mode === 'production') {
    app.use(cors())
} else {
    app.use(cors({
        origin: ["http://localhost:5173", "http://localhost:3000"]
    }))
}
app.use(express.json())
app.use(express.urlencoded({ extended: true })); 
app.use(helmet())
app.use(compression())
app.use("/api/v1/admin", require("./routes/admin/index"))
app.use("/api/v1", require("./routes/client"))
app.get('/', (req, res) => console.log(req.body))

const port = process.env.port


app.listen(port, () => console.log(`Server is running on port ${port}!`))
