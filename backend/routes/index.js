var express = require('express');
var router = express.Router();

const cUser = require("../controllers/user");

/////////////////// Our additions
router.post("/login", cUser.login);
router.post("/user/create", cUser.create);
/////////////////// End of our additions

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
