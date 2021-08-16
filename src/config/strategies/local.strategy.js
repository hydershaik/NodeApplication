const passport = require('passport');
const { MongoClient } = require('mongodb');

const {Strategy} = require('passport-local');
const debug = require('debug')('app:localStrategy');

module.exports = function localStragy(){
    passport.use(
        new Strategy({
            usernameField: 'username',
            passwordField: 'password'
        }, (username, password, done) => {
            const url = 'mongodb+srv://dbUser:Abcd$123@globolmantics.0vevc.mongodb.net?retryWrites=true&w=majority';
            const dbName = 'globomantics';
        
            (async function validateUser(){
                let client;
                try {
                    client = await MongoClient.connect(url);
                    const db = client.db(dbName);
                    const user = await db.collection('users').findOne({username});
                    debug(user);
                    if(user && user.password == password){
                        done(null, user);
                    }else{
                        done(null, false);
                    }
                } catch (error) {
                    done(error, false);
                }
                client.close();
            }())

            const user = {username, password, name: 'Hyder'}
            done(null, user);
        })
    );
}