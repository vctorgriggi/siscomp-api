const multerS3 = require("multer-s3");
const crypto = require("crypto");
const multer = require("multer");
const path = require("path");

const s3 = require("../config/aws");

const filter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png"];

  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error("Invalid file type");
    error.code = "INVALID_FILE_TYPE";
    return cb(error, false);
  }

  cb(null, true);
};

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    key: (req, file, cb) => {
      const randomImageName = crypto.randomBytes(32).toString("hex");
      const s3FileName = `${randomImageName}${path.extname(file.originalname)}`;
      cb(null, `siscomp/uploads/${s3FileName}`);
    },
  }),
  limits: {
    fileSize: 1 * 1024 * 1024, // 1 mb
  },
  fileFilter: filter,
});

module.exports = upload;
