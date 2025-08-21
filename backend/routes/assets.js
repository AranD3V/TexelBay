// backend/routes/assets.js
const express = require('express');
const router = express.Router();
const { getS3UploadUrl, createAsset, getAssets } = require('../controllers/assetController');
const authMiddleware = require('../middleware/authMiddleware'); // You created this earlier

// @route   GET api/assets
// @desc    Get all assets
router.get('/', getAssets);

// @route   POST api/assets/upload-url
// @desc    Get a pre-signed URL for S3 upload
// @access  Private (only logged-in users can get a URL)
router.post('/upload-url', authMiddleware, getS3UploadUrl);

// @route   POST api/assets
// @desc    Create a new asset
// @access  Private
router.post('/', authMiddleware, createAsset);

module.exports = router;