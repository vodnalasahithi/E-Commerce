import multer from "multer";
import path from "path";
import fs from "fs";

const UPLOAD_DIR = "public/uploads";

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },

  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);

    cb(null, `product-${uniqueSuffix}${extension}`);
  },
});

const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (file.mimetype.startsWith("image/") || ALLOWED_EXTENSIONS.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB limit for file
    files: 10,
  },
});

export const uploadSingle = upload.single("image");

export const uploadMultiple = upload.array("images", 10);

export const getFileURL = (req, filename) => {
  const protocol = req.protocol; // http https
  const host = req.get("host"); // localhost:3000 or myapp.com
  const url = `${protocol}://${host}/public/uploads/${filename}`;
  return url;
};

export const handleUploadError = (error, req, res, next) => {
  if (err instanceof multer.MulterError) {
    switch (error.code) {
      case "LIMIT_FILE_SIZE":
        return res.status(400).json({
          success: false,
          message: req.t("fileSizeLimit5MB"),
        });
      case "LIMIT_FILE_COUNT":
        return res.status(400).json({
          success: false,
          message: req.t("fileCountLimit10Files"),
        });
      case "LIMIT_UNEXPECTED_FILE":
        return res.status(400).json({
          success: false,
          message: req.t("unexpectedFile"),
        });

      default:
        return res.status(400).json({
          success: false,
          message: req.t("uploadError"),
        });
    }
  } else if (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
  next(err);
};
