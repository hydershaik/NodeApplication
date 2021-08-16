const express = require('express');
const debug = require('debug')('app:sessionRouter');
const { MongoClient, ObjectId } = require('mongodb');
const passport = require('passport');
const authRouter = express.Router();

authRouter.route('/signUp').post((req, res) => {
    const {username, password} = req.body;
    const url = 'mongodb+srv://dbUser:Abcd$123@globolmantics.0vevc.mongodb.net?retryWrites=true&w=majority';
    const dbName = 'globomantics';

    (async function(){
        let client;
        try {
            client = await MongoClient.connect(url);
            const user = {username, password};
            const db = client.db(dbName);
            const results = await db.collection('users').insertOne(user);
            debug(results);
            req.login(results.ops[0], ()=>{
                res.redirect('/auth/profile');
            });
        } catch (error) {
            debug(error);
        }
        client.close();
    }())
    
});

authRouter.route('/signIn').get((req, res)=> {
    res.render('signin');
}).post(passport.authenticate('local', {
    successRedirect: '/auth/profile',
    failureMessage:'/'
}));


authRouter.route('/profile').get((req, res)=>{
    res.json(req.user);
});


module.exports = authRouter;