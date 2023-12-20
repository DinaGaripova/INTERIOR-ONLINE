const multer = require('multer')
const express = require('express');
const fs = require('fs')
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images')
  },
  filename: (req, file, cb) => {
    cb(null, (Date.now() + Math.random() * 10e17).toString() + '.jpg')
  }
})

const upload = multer({ storage: storage }).single('file')

router.post('/upload', (req, res) => {
    upload(req, res, (err) => {
      if (err) {
        res.sendStatus(500);
      }
      res.json(req.file);
      // console.log(req.file);
      // fs.readFile('public/images/images.json', function (err, data) {
      //   let json = JSON.parse(data)
      //   console.log(data);
      //   let path = req.file.path
      //   let date = new Date().toLocaleDateString('ru-ca')
      //   json.push(`path: ${path} 
      //         data: ${date}`)
      
      //   fs.writeFileSync('public/images/images.json', JSON.stringify(json))
      // })
    });
});

router.get('/', (req, res) => { 
  let infos = [];

  fs.readdirSync("public/images/").forEach((file) => {
    let info = fs.statSync(`public/images/${file}`),
      timestamp = info.ctime.getTime(),
      date = info.ctime.toLocaleDateString(),
      time = info.ctime.toLocaleTimeString()
    
    infos.push({path: file, timestamp: timestamp, date: date, time: time})
  })

  res.json(infos)
})

module.exports = router;