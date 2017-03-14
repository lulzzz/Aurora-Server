var express = require('express');
var passport=require("passport")
var LocalStrategy = require('passport-local').Strategy;
var db=require("../utils/db.js");
var router = express.Router();
var objects_controller=require("../app/objects_controller");
var users_controller=require("../app/users_controller");
var Strategy = require('passport-http-bearer').Strategy;

passport.use(new Strategy(
  function(token, done) {
    db.users
    .query({token:token}, {one:true})
    .then((user)=>{
      if(user==undefined){done(null, false)}
      done(null, user)
    })
  }
));
var use_auth=passport.authenticate('bearer', { session: false });

router.post("/api/v1/users", users_controller.createUser);
router.post("/api/v1/users/login", users_controller.login);

//register node from Aurora Things - use mqtt instead???
router.get("/api/v1/nodes/register/:code", objects_controller.registerNode);

//needs token authentication
router.get("/api/v1/state", use_auth, users_controller.getUser)
router.post("/api/v1/nodes", use_auth, objects_controller.generateNode);
router.get("/api/v1/nodes/:node/", use_auth, objects_controller.getStatusInfo);
router.post("/api/v1/nodes/:node/", use_auth, objects_controller.setStatusInfo);

module.exports = router;