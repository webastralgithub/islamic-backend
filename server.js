const express = require('express')
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const AuthRoute = require('./routes/auth');
const AdminRoute = require('./routes/admin_routes');
const tranport = require('./transports/transport.js');
var cors = require('cors')
dotenv.config();
mongoose.connect(process.env.DB_CONNECTION,
{ useNewUrlParser: true,useFindAndModify: false,useUnifiedTopology: true },
()=>console.log('connected to db'));

app.use(cors())

app.use(express.json());
app.use('/api/admin',AdminRoute);
app.use('/api/user',AuthRoute);
app.use(express.static('uploads'));


app.listen(8004,()=>console.log("server is working"))
