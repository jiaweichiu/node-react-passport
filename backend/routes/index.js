var express = require('express');
var router = express.Router();

const cUser = require("../controllers/user");

/////////////////// Our additions
// TODO: Make this RESTful.
router.post('/user/login', cUser.login);
router.post('/user/get', cUser.get);
router.post('/user/create', cUser.create);
router.post('/user/remove', cUser.remove);
router.post('/user/update', cUser.update);
/////////////////// End of our additions

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
