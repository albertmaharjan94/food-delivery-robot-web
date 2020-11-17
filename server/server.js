console.log('[Initial] : Booting react app.. | SUCCESS')
const os = require("os");
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const formData = require("express-form-data");
const path = require('path');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const uri = process.env.DB_URI;
const domain = process.env.URL;
mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });

const connection = mongoose.connection;
connection.once('open', () => {
    console.log(`[Initial] : Connection to MONGODB | SUCCESS`)
})

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const options = {
    uploadDir: os.tmpdir(),
    autoClean: true
};

// parse data with connect-multiparty. 
app.use(formData.parse(options));
// delete from the request all empty files (size == 0)
app.use(formData.format());
// change the file objects to fs.ReadStream 
app.use(formData.stream());
// union the body and the files
app.use(formData.union());


// routers
const router = require('./routes/index');
console.log(`[Initial] : Configuring routes | SUCCESS`)

app.use('/', router);
app.use(express.static('./uploads/'));

app.listen(port, () =>{
    console.log(`[Initial] : Server started as port : ${port} | SUCCESS`)
    console.log(`[Initial] : Hosting at ${domain}:${port} | SUCCESS`)
})