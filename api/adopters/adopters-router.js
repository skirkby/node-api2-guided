const express = require('express');
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

const Adopter = require('./adopters-model.js');

// ADOPTERS ENDPOINTS
router.get('/', (req, res) => {
    Adopter.find(req.query)
        .then(adopters => {
            // note the "200" response... 2xx responses are "success" responses.
            res.status(200).json(adopters);
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
            console.log(error);
            res.status(500).json({
                message: 'Error retrieving the adopters',
            });
        });
});

router.get('/:id', (req, res) => {
    Adopter.findById(req.params.id)
        .then(adopter => {
            if (adopter) {
                res.status(200).json(adopter);
            } else {
                res.status(404).json({ message: 'Adopter not found' });
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: 'Error retrieving the adopter',
            });
        });
});

// 
// The URL needed to get to this handler depends on the URL prefix this router
// is bound to, when it is imported by some other module(s). In our case, the
// server.js file imports this Router, and binds it to /api/adopters, and
// /i/love/dogs. Thus, the following requests will route to this handler:
// 
//      GET /api/adopters/:id/messages
//      GET /i/love/dogs/:id/messages
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
router.get('/:id/dogs', (req, res) => {
    Adopter.findDogs(req.params.id)
        .then(dogs => {
            if (dogs.length > 0) {
                res.status(200).json(dogs);
            } else {
                res.status(404).json({ message: 'No dogs for this adopter' });
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: 'Error retrieving the dogs for this adopter',
            });
        });
});

router.get('/:id/dogs', async (req, res) => {
    try {
        const dogs = await Adopter.findDogs(req.params.id);
        if (dogs.length > 0) {
            res.status(200).json(dogs);
        } else {
            res.status(404).json({ message: 'No dogs for this adopter' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error retrieving the dogs for this adopter', });
    }
});

router.post('/', (req, res) => {
    Adopter.add(req.body)
        .then(adopter => {
            res.status(201).json(adopter);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: 'Error adding the adopter',
            });
        });
});

router.delete('/:id', (req, res) => {
    Adopter.remove(req.params.id)
        .then(count => {
            if (count > 0) {
                res.status(200).json({ message: 'The adopter has been nuked' });
            } else {
                res.status(404).json({ message: 'The adopter could not be found' });
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: 'Error removing the adopter',
            });
        });
});

router.put('/:id', (req, res) => {
    const changes = req.body;
    Adopter.update(req.params.id, changes)
        .then(adopter => {
            if (adopter) {
                res.status(200).json(adopter);
            } else {
                res.status(404).json({ message: 'The adopter could not be found' });
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: 'Error updating the adopter',
            });
        });
});

//
// if we don't export our router object, it would not be possible for the server
// module to "require" it.
//
module.exports = router;