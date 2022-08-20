const express = require('express');
require('./db/mongoose')
const taskRouter = require('./routers/tasks');
const userRouter = require('./routers/users')

const app = express();
const port = process.env.port || 3000;


// app.use((req, res, next) => {
//     if (req.method === 'GET') {
//         res.send('Get requests are disabled')
//     } else {
//         next();
//     }
// })

// app.use((req, res, next) => {
//     res.status(503).send('Site under maintainance');
// })



app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
    console.log(`server is listinig on port ${port}`)
});




const myFunc = async () => {
}

myFunc();