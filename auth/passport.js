var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var Student = require('../Models/Student')
var Mentor = require('../Models/Mentor')
var auth = require('../auth/auth')
var jwt = require('jsonwebtoken')

passport.use(new GitHubStrategy({
    clientID: process.env.Client_ID,
    clientSecret: process.env.Client_Secret,
    callbackURL: "https://resource-library-alt.herokuapp.com/api/v1/users/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    if(profile.username == 'reettik97'|| profile.username == 'itzsunny'){
      Mentor.findOne({username: profile.username}, (error, mentor) => {
        if(mentor == null){
          Mentor.create({ username: profile.username,
            email:profile._json.email,
            password: 'password'
           }, (error,mentor) => {
            jwt.sign({ userID: mentor.id, email: mentor.email, isMentor: mentor.isMentor},
              process.env.SECRET,(err,token) => {
                if(err) return next(err)
                res.json({success:true, token})
                return cb(error,token)
              } )
           })}
           else {
                // req.user = mentor
                return cb(error,mentor)
           }
      })
    }
    else{
    Student.findOne({username: profile.username},((err, student) => {
      if(student === null){
        Student.create({ username: profile.username,
          email:profile._json.email,
          password:'password'
         }, (error, student) => {
          jwt.sign({ userID: student.id, email: student.email, isMentor: student.isMentor},
            process.env.SECRET,(err,token) => {
              if(err) return next(err)
              res.json({success:true, token})
              return cb(error,token)
            } )
           return cb(error, student)
         })
      }
      else {
        return cb(err,student)
      }
    }))
  }
  }
));