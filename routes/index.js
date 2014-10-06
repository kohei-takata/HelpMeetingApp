var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/', function(req, res) {
  res.render('index', { myName: req.body.myName, 
                        roomName: req.body.roomName
                      });
});

module.exports = router;
