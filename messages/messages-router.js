
//
// see hubs-router.js for some riveting reading about Router objects and
// modules, cosmonauts, and Popeye.
//

const express = require('express');

//
// Note that we only have one data model, and the one method that deals with the
// "messages" table in our database is in the same data model as all of the
// methods that deal with the "hubs" table. So we need to "require()" it here.
// That way, our route handler will be able to access the database.
//
const Hubs = require('../hubs/hubs-model.js');

//
// Like with the hubs router, we simply create a router object, configure it
// with route handlers and other middleware, and export it at the end.
//
const router = express.Router();

//
// This route handler is for dealing with a message directly, based on its ID,
// without having to reference the hub that it is in.
//
// So, instead of "GET /api/hubs/1/messages/123", we can just do "GET
// /messages/123". This only works because every message record has a unique ID,
// no matter what hub it is in. In other words, if /api/hubs/1/messages/123
// exists, you will never see /api/hubs/2/messages/123, because message ID 123
// already exists, and is unique throughout the database, in all hubs.
// 
// Therefore, we can deal with messages directly, without referencing the hub
// they are in.
//
// If we were to refactor the app and really build out the API, we would likely
// have a messages-specific data model, rather than having our messages DB
// methods mixed in with the hubs DB methods...
//
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    console.log(id);

    try {
        const message = await Hubs.findMessageById(id);
        console.log(message);
        if (message) {
            res.status(200).json(message);
        } else {
            res.status(404).json({ success: false, message: 'invalid message id' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err });
    }
});

//
// A more complete "messages" API would include a PUT and a DELETE handler,
// allowing you to modify a message, or delete it.
//
// Our data model doesn't have methods for updating or deleting "messages"
// records, so we can't create the API endpoints yet. We will learn later in the
// course how to create data models.
//

//
// Be sure to export our router!
//
module.exports = router;

