const express = require('express');
const router = express.Router();
const { registerUser, authUser, getUserProfile, getOwnersInArea } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', registerUser);
router.post('/login', authUser);
router.get('/profile', protect, getUserProfile);
router.get('/owners/:area', protect, getOwnersInArea);

module.exports = router;
