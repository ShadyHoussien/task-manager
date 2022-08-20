const express = require('express');
const User = require('../models/users');
const auth = require('../middleware/auth')
const router = new express.Router();

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
})

router.patch('/users/me',auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidUpdate = updates.every((item) => allowedUpdates.includes(item));

    if (!isValidUpdate) {
        return res.status(400).send({
            error: 'invalid updates'
        });
    }

    try {
        const user = req.user;

        updates.forEach(update => {
            user[update] = req.body[update];
        });

        await user.save();

        //dont use it if you want to run middlewares because it bypass it 
        //const user = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true }); 
        res.send(user);
    } catch (error) {
        res.status(400).send(error);
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove();
        res.send(req.user);
    } catch (error) {
        res.status(500).send(error);
    }
})

router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        const token = await user.generateAuthToken();

        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();

        res.send({ user, token });

    } catch (error) {
        res.status(400).send();
    }
});

router.post('/users/logout', auth, async (req, res) => {
    try {
        const user = req.user;
        const reqToken = req.token;

        user.tokens = user.tokens.filter(token => token.token !== reqToken);
        await user.save();

        res.send();
    } catch (error) {
        res.status(500).send();
    }
});

router.post('/users/logoutall', auth, async (req, res) => {
    try {
        const user = req.user;
        user.tokens = [];
        await user.save();

        res.send();
    } catch (error) {
        res.status(500).send();
    }
});

module.exports = router;