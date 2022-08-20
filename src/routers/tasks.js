const express = require('express');
const Task = require('../models/tasks');
const auth = require('../middleware/auth')
const router = new express.Router();

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=0
// GET /tasks?sortBy=CreatedAt:asc
router.get('/tasks', auth, async (req, res) => {
    const match = {
        owner: req.user._id 
    }
    const sort = {}

    if (req.query.completed) {
        match.isCompleted = req.query.completed === 'true';
    }
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }


    try {
        const tasks = await Task.find(match).setOptions({
            skip : parseInt(req.query.skip),
            limit : parseInt(req.query.limit),
            sort
        });
        // await req.user.populate({
        //     path: 'tasks',
        //     match
        // }).execPopulate()

        res.status(200).send(tasks)
    } catch (error) {
        res.status(500).send(error);
        console.log(error);
    }
})

router.get('/tasks/:id', auth, async (req, res) => {

    try {
        const _id = req.params.id;
        const task = await Task.findOne({ _id, owner: req.user._id });

        if (!task) {
            return res.status(404).send();
        }
        res.send(task)
    } catch (error) {
        res.status(500).send("Invalid Id");
    }
})

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });
    try {
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'isCompleted'];
    const isValidUpdate = updates.every((item) => allowedUpdates.includes(item));

    if (!isValidUpdate) {
        return res.status(400).send({
            error: 'invalid updates'
        });
    }

    try {
        const _id = req.params.id;
        const task = await Task.findOne({ _id, owner: req.user._id });

        if (!task) {
            return res.status(404).send();
        }

        updates.forEach(update => {
            task[update] = req.body[update];
        });

        task.save();
        res.send(task);
    } catch (error) {
        res.status(400).send(error);
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const _id = req.params.id;
        const deletedTask = await Task.findOneAndRemove({ _id, owner: req.user._id });

        if (!deletedTask) {
            return res.status(404).send('Task not found');
        }

        return res.send(deletedTask);
    } catch (error) {
        res.status(500).send(error);
    }
})

module.exports = router;