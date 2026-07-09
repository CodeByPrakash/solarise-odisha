const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const documentationCasesRoute = require('./routes/documentationCasesRoute');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/documentation-cases', documentationCasesRoute);

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB connected successfully"))
.catch(e=>console.log(e));

const PORT = 5000;

app.get("/",(req,res)=>{
    res.send("Api is working");
});

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
});