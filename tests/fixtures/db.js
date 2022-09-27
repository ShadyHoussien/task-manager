const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/users')
const Task = require('../../src/models/tasks')



const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'Mike',
    email: 'mike@example.com',
    password: 'Shady@123',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: 'Shady',
    email: 'shady@example.com',
    password: 'Shady@123',
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }]
}

const taskOne = {
    _id : new mongoose.Types.ObjectId(),
    description : "First task",
    isCompleted : false,
    owner : userOne._id
}

const taskTwo = {
    _id : new mongoose.Types.ObjectId(),
    description : "Second task",
    isCompleted : true,
    owner : userOne._id
}

const taskThree = {
    _id : new mongoose.Types.ObjectId(),
    description : "Thired task",
    isCompleted : true,
    owner : userTwo._id
}

const setupDatabase = async () => {
    await User.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await Task.deleteMany()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()



}

module.exports = {
    userOneId,
    userOne,
    userTwo,
    userTwoId,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase
}