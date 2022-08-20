require('../db/mongoose');

const User = require('../models/users');

//62f60ac63fb07ccefdb8c793


// User.findByIdAndUpdate("62f60ac63fb07ccefdb8c793", { age: 1 }).then((user) => {
//     console.log(user);
//     return User.countDocuments({ age: 1 });
// }).then((res) => {
//     console.log(res);
// }).catch((e) => {
//     console.log(e);
// })


const updateAgeAndCount = async (userId, age) => {
    const user = await User.findByIdAndUpdate(userId, { age: age });
    const count = await User.countDocuments({ age: age });
    return count;
}

updateAgeAndCount("62f60ac63fb07ccefdb8c793", 2).then((count) => {
    console.log(count);
}).catch((e) => {
    console.log(e);
})