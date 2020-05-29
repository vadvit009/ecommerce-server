const app = require('express').Router();
const multer = require('multer');
const fs = require('fs');
const path = 'public/assets/products/';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (fs.existsSync(path + req.params.id)) { null }
    else fs.mkdirSync(path + req.params.id)
    cb(null, (path + req.params.id))
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage }).single('file');

app.post('/product/:lang/:id/upload', (req, res) => {

  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err)
    } else if (err) {
      return res.status(500).json(err)
    }
    return res.status(200).send(req.file)
  })
})

module.exports = app;