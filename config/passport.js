const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const User = require('../models/User')



module.exports = function(passport){

    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
    //    callbackURL: '/oauth2/redirect/google',
        // scope: [ 'profile' ]
        // clientURL:'http://localhost:3000/auth/google/redirect',

    },
    async(accesToken, refreshToken, profile, done)=>{
        console.log(profile)
        const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            image: profile.photos[0].value

        }
        try {
            
            let user = await User.findOne({googleId: profile.id})

            if(user){
                done(null, user)
            }
            else{
                user = await User.create(newUser)
                done(null, user)
            }
        } catch (error) {
            
        }
    }
    ))

    passport.serializeUser((user, done) => {
        done(null, user.id)
      })
    
      passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => done(err, user))
      })


}