const passport = require("passport");
const User = require('../model/user');

var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser(function(user, next) {
    process.nextTick(function() {
      return next(null, user.id);
    });
  });
  
passport.deserializeUser(function(id, next) {
    // db.get('SELECT * FROM users WHERE id = ?', [ id ], function(err, user) {
    //     if (err) { return next(err); }
    //     return next(null, user);
    // });
    User.findById(id, function(err, user){
        return next(null, user);
    })
});

passport.use(new GoogleStrategy({
    clientID: "212633783521-f10bh7nu512h37iv4nc5v858m9fpl6p8.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:4001/auth/google/callback"

    },
    (accessToken, refreshToken, profile, next)=>{
        //callback
        // console.log('MY PROFILE', profile);
        console.log("MY PROFILE", profile._json.email);
        User.findOne({email: profile._json.email})
            .then(async (user)=>{
                if(user){
                    console.log("User already exists in DB", user);
                    //cookieToken()
                    next(null, user);
                    
                }else{
                    await User.create({
                        name: profile.displayName,
                        googleId: profile.id,
                        email: profile._json.email
                    });
                    // .then((user)=>{
                    //     console.log("New User", user);
                    //     //cookieToken()
                        next(null, user);
                    // })
                    //   .catch(err=>console.log(err));
                }
            });

        // next();
    }
    )
);