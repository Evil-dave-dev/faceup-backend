var express = require("express");
var router = express.Router();
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const uniqid = require("uniqid");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post("/upload", async (req, res) => {
  const photoPath = `/tmp/${uniqid()}.jpg`;
  const resultMove = await req.files.photoFromFront.mv(photoPath);
  res.json({ result: true, file: req.files.photoFromFront });

  if (!resultMove) {
    const resultCloudinary = await cloudinary.uploader.upload(
      req.files.photoFromFront
    );
    fs.unlinkSync(photoPath);
    res.json({ result: true, url: resultCloudinary.secure_url });
  } else {
    res.json({ result: false, error: resultMove });
  }
});

module.exports = router;
