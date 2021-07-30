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
{ useNewUrlParser: true },
()=>console.log('connected to db'));



app.use(express.json());
app.use('/api/admin',AdminRoute);
app.use('/api/user',AuthRoute);
app.use(cors())



app.listen(8000,()=>console.log("server is working"))