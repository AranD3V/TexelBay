// backend/controllers/assetController.js
const Asset = require('../models/Asset');
const { generateUploadUrl } = require('../utils/s3');

// Controller to get a pre-signed URL
exports.getS3UploadUrl = async (req, res) => {
  try {
    const { fileName, fileType } = req.body;
    if (!fileName || !fileType) {
      return res.status(400).json({ msg: 'fileName and fileType are required' });
    }
    const { signedUrl, fileKey } = await generateUploadUrl(fileName, fileType);
    res.json({ signedUrl, fileKey });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Controller to create the asset record in the database
exports.createAsset = async (req, res) => {
  const { title, description, price, assetFileKey, tags } = req.body;

  try {
    const newAsset = new Asset({
      title,
      description,
      price,
      assetFileKey,
      tags,
      creator: req.user.id // This comes from the auth middleware
    });

    const asset = await newAsset.save();
    res.json(asset);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Controller to get all assets
exports.getAssets = async (req, res) => {
  try {
    const assets = await Asset.find().populate('creator', 'name').sort({ createdAt: -1 });
    res.json(assets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};