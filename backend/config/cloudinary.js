const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dpo929jiu",
  api_key: "447948744458468",
  api_secret: "*********************************"
});

module.exports = cloudinary;