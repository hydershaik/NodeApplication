const express = require('express');
const debug = require('debug')('app:sessionRouter');
const { MongoClient, ObjectId } = require('mongodb');
const speakerService = require('../services/speakerService');

const sessions = require('../data/sessions.json');

const sessionRouter = express.Router();
sessionRouter.use((req, res, next)=> {
    if(req.user){
        next();
    }else{
        res.redirect('/auth/signin');
    }
});

sessionRouter.route('/')
.get((req, res) => {
    const url = 'mongodb+srv://dbUser:Abcd$123@globolmantics.0vevc.mongodb.net?retryWrites=true&w=majority';
    const dbName = 'globomantics';
    (async function mongo(){
        let client;
        try {
            client = await MongoClient.connect(url);
            debug('Connected to the Mongo DB');

            const db = client.db(dbName);

            const sessions = await db.collection('sessions').find().toArray();
            res.render('sessions', {
                sessions
            })
        } catch (error) {
            debug(error.stack)
        }
        client.close();
    }())
   
});
sessionRouter.route('/:id')
.get((req, res) => {
    const id = req.params.id;
    const url = 'mongodb+srv://dbUser:Abcd$123@globolmantics.0vevc.mongodb.net?retryWrites=true&w=majority';
    const dbName = 'globomantics';
    (async function mongo(){
        let client;
        try {
            client = await MongoClient.connect(url);
            debug('Connected to the Mongo DB');

            const db = client.db(dbName);

            const session = await db.collection('sessions').findOne({_id:new ObjectId(id)});
            const speaker = await speakerService.getSpeakerById(session.speakers[0].id);
            session.speaker = speaker.data;
            res.render('session', {
                session
            });
        } catch (error) {
            debug(error.stack)
        }
    }())
    
});

module.exports = sessionRouter;