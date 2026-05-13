const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

router.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!password || password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters.' });
        }
        if (!email || !email.includes('@')) {
            return res.status(400).json({ error: 'Invalid email address.' });
        }
        if (!/^[a-zA-ZæøåÆØÅ\s\-']+$/.test(name)) {
            return res.status(400).json({ error: 'Name can only contain letters, spaces, and hyphens.' });
        }

        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
        const passwordHash = `${salt}:${hash}`;
        const user = await User.create({ email, passwordHash, name });
        res.status(201).json({ message: 'User created' });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ error: 'An account with this email already exists.' });
        }
        res.status(400).json({ error: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const [salt, storedHash] = user.passwordHash.split(':');
        const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
        const valid = hash === storedHash;

        if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ userId: user._id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: "7h" });
        res.json({ token });
    } catch {
        res.status(500).json({ error: "Couldn't log in" });
    }
});

router.get('/user', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('email name');
        res.json(user);
    } catch {
        res.status(500).json({ error: "Failed to get user" });
    }
});

router.get("/favorites", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        res.json(user?.favorites || []);
    } catch {
        res.status(500).json({ error: "Failed to fetch favorites" });
    }
});


router.post('/favorites/:id', authMiddleware, async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user.userId, { $addToSet: { favorites: req.params.id } });
        res.json({ message: 'Added' });
    } catch {
        res.status(500).json({ error: "Failed to add favorites" });
    }
});

router.delete('/favorites/:id', authMiddleware, async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user.userId, { $pull: { favorites: req.params.id } });
        res.json({ message: 'Removed' });
    } catch {
        res.status(500).json({ error: "Failed to remove from favorites" });
    }
});

module.exports = router;
