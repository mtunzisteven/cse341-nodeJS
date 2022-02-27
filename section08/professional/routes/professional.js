const express = require('express');

const proffessionalRoutes = require('../controllers/professional');

const router = express.Router();

//GET /professional
router.get('/', proffessionalRoutes.getPosts);

module.exports = router;