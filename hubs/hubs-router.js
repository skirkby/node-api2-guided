const express = require('express');
const Hubs = require('./hubs-model.js');

//
// when we create a Router file, we just create a router object from
// express.Router(), and then call the .METHOD() methods on the Router object,
// similar to how we did it with the express() application object before.
//
// the middleware/handlers that we create on the Router object are useless
// unless we "bind" the Router to some URL prefix. This happens with an
// express().use() call. By specifying a url prefix in the .use() call, and
// passing in the Router object, the Router object is then bound to that URL
// prefix, and any HTTP request that begins with that URL prefix will be handled
// by matching middleware in the Rouer object.
//
// THE MAIN REASON we do this is to keep our code clean, concise, modular, and
// well-organized, which aids in expansion/adding new features,
// troubleshooting/debugging, testing, and collaborating with other cosmonauts.
//
const router = express.Router();


router.get('/', (req, res) => {
    console.log(req.query);
    Hubs.find(req.query)
        .then(hubs => {
            // note the "200" response... 2xx responses are "success" responses.
            res.status(200).json(hubs);
        })
        .catch(error => {
            // note the "500" response... 5xx responses are "permanent failure"
            // responses. A permanent failure is a failure on the server side.
            // These are failures that the API user can't do anything about.
            // Rather than an error of "invalid input data", where the API
            // caller can retry the API call with different data and possibly
            // get a different response, 5xx errors indicate a problem on the
            // server side, unrelated to the API call input.
            // 
            // You can learn more about response codes here:
            //     https://restfulapi.net/http-status-codes/
            //     https://www.restapitutorial.com/httpstatuscodes.html 
            // 
            res.status(500).json({
                message: 'Error retrieving the hubs',
            });
        });
});

router.get('/:id', (req, res) => {
    Hubs.findById(req.params.id)
        .then(hub => {
            if (hub) {
                res.status(200).json(hub);
            } else {
                res.status(404).json({ message: 'Hub not found' });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: 'Error retrieving the hub',
            });
        });
});

router.post('/', (req, res) => {
    Hubs.add(req.body)
        .then(hub => {
            res.status(201).json(hub);
        })
        .catch(error => {
            res.status(500).json({
                message: 'Error adding the hub',
            });
        });
});

router.delete('/:id', (req, res) => {
    Hubs.remove(req.params.id)
        .then(count => {
            if (count > 0) {
                res.status(200).json({ message: 'The hub has been nuked' });
            } else {
                res.status(404).json({ message: 'The hub could not be found' });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: 'Error removing the hub',
            });
        });
});

router.put('/:id', (req, res) => {
    const changes = req.body;
    Hubs.update(req.params.id, changes)
        .then(hub => {
            if (hub) {
                res.status(200).json(hub);
            } else {
                res.status(404).json({ message: 'The hub could not be found' });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: 'Error updating the hub',
            });
        });
});

// 
// The URL needed to get to this handler depends on the URL prefix this router
// is bound to, when it is imported by some other module(s). In our case, the
// server.js file imports this Router, and binds it to /api/hubs, /repos, and
// /thing/otherthing. Thus, the following requests will route to this handler:
// 
//      GET /api/hubs/:id/messages
//      GET /repos/:id/messages
//      GET /thing/otherthing/:id/messages
// 
// Decisions about how to name elements of your API URL's should be made
// according to a well-thought-out pattern that is easy to understand,
// consistent, and relevant. There are many different opinions about how REST
// API URL's should be formed. Here are some resources that you might find
// interesting: 
// 
//      https://restfulapi.net/resource-naming/
//      https://nordicapis.com/10-best-practices-for-naming-api-endpoints/
//      https://www.restapitutorial.com/lessons/restfulresourcenaming.html 
// 
// And here are some books that I have read that you might try: 
// 
//      https://amzn.to/2yCBi47 (RESTful Web Services Cookbook)
//      https://amzn.to/2yrWoCl (REST API Design Rulebook)
//      https://amzn.to/35KWfpQ (The REST API Design Handbook)
// 
router.get('/:id/messages', async (req, res) => {
    try {
        const messages = await Hubs.findHubMessages(req.params.id);

        if (messages.length > 0) {
            res.status(200).json(messages);
        } else {
            res.status(404).json({ message: 'No messages for this hub' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error retrieving the messages for this hub',
        });
    }
});

//
// The following syntax uses the "rest operator" : "..." this is NOT related to
// "REST" api's. The "rest" operator in JavaScript basically says, "copy  
// everything from this other object" (in this case, req.body).
//
// This will copy all of the JSON properties in the POST body. After copying all
// existing properties and values, the syntax then overrides the "hub_id"
// property of the req.body object in the POST request with the req.params.id
// (the :id parameter from the URL).
//
// Or, if there isn't a hub_id, it creates it and adds the id.
//
// This is needed because the Hubs.addMessage() method takes a JSON object that
// specifies, the "from" property, the "text" property, *and* the "id" property
// of the hub to save the message to.
//
// Note also that we have used the async..await syntax to define our middleware
// arrow function. Async..await is a simpler syntax for dealing with Promise
// objects. Remember that our DB helper functions each returns a Promise object.
// With async..await syntax, we can design our code more synchronously, and
// manage error handling in a more JavaScript-like manner with try..catch
// blocks. By decorating our arrow function with "async", we are allowed to use
// the "await" command within the function ("async" also guarantees that the
// return value from the function is, itself, a Promise object. There are
// reasons why that is important, but too lengthy to cover here in this format.)
// 
// The "await" command should be used on any method that returns a Promise
// object (which Hubs.addMessage() does - all the DB helpers do). It causes code
// execution to pause on the Promise-returning method until the returned Promise
// either "resolves" or "rejects". It then assigns the Resolved result to the
// constant/variable in the = assignment. 
// 
// If the Promise rejects, then an exception is thrown, causing code flow to
// drop to the catch clause, where the error can be handled (the Reject value is
// passed as a parameter to the catch clause). 
// 
// This is no different than a .then().catch() pattern, but it reads more
// easily, and more like regular JavaScript.
router.post('/:id/messages', async (req, res) => {
    const messageInfo = { ...req.body, hub_id: req.params.id };

    try {
        const message = await Hubs.addMessage(messageInfo);
        res.status(201).json(message);
    } catch (err) {
        console.log(err);
        res.status(500).json({ err });
    }
})

//
// if we don't export our router object, it would not be possible for the server
// module to "requires" it. (I sound like Popeye...)
//
module.exports = router;