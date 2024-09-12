const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "images",
    format: async (req, file) => "png",
    public_id: (req, file) => {
      const ext = file.mimetype.split("/")[1];
      const fileName = `user-${Date.now()}.${ext}`;
      return fileName;
    },
  },
});

const fileFilter = (req, file, cb) => {
  // Accept image files only
  if (!file.mimetype.startsWith("image")) {
    return cb(new Error("Only images are allowed!"), false);
  }
  cb(null, true);
};


const cloudinaryFileUploader = multer({ storage: storage, fileFilter }).single(
  "image"
);

module.exports = {
  cloudinaryFileUploader,
};
