require('../db/mongoose');

const Task = require('../models/tasks');

//62f604401236783e8e3ddf94


// Task.findByIdAndRemove("62f604401236783e8e3ddf94").then((task) => {
//     console.log(task);
//     return Task.countDocuments({ isCompleted: false });
// }).then((res) => {
//     console.log(res);
// }).catch((e) => {
//     console.log(e);
// })


const deleteByIdAndCount = async (taskId) => {
    const task = await Task.findByIdAndRemove(taskId);
    const count = await Task.countDocuments({ isCompleted: false });
    return count;
}


deleteByIdAndCount("62f6167830576a8e8cd59d75").then((count) => {
    console.log(count);
}).catch((e) => {
    console.log(e);
})