const express = require('express');
require('./db/mongoose')
const taskRouter = require('./routers/tasks');
const userRouter = require('./routers/users')

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);


module.exports = app;