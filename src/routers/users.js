const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/users');
const auth = require('../middleware/auth');
const emailSender = require('../emails/email-sender');
const router = new express.Router();

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'));
        }
        return cb(undefined, true);
    }
});


//CRUDS
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
})

router.patch('/users/me', auth, async (req, res) => {
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
        emailSender.sendTextEmail(req.user.email,"Task manager cancellation",`Sorry to see you go ${req.user.name}`);
    } catch (error) {
        res.status(500).send(error);
    }
})

router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        const token = await user.generateAuthToken();
        await user.save();
        emailSender.sendTextEmail(user.email,"Task manager welcome",`Welcome ${user.name} to task manager app created by shady`);
        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
});


//login-logout
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

//Profile picture
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
}, (error, req, res, next) => {
    res.status(404).send({ error: error.message });
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || !user.avatar) {
            throw new Error();
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar);
    } catch (error) {
        res.status(404).send();
    }
})

module.exports = router;