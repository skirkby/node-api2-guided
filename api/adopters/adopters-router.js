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
const Adopter = require('./adopters-model');
// using a "controller" module can help organize your code even further. 
// It's a pattern that you will see in the wild often. See the following 
// controller module for more notes.
const Controller = require('./adopters-controller.js');

// ADOPTERS ENDPOINTS

//----------------------------------------------------------------------------//
// Note that you can always define the middleware handler in-line for any
// METHOD/path combination, like most of them in this Router file. 
// But a common practice you will see in the wild is the use of 
// "controller" modules. 
// 
// Don't be fooled by the word "controller" ... they don't actually "control" 
// anything. They are just modules that contain the function definitions for 
// your middleware handlers. Those middleware handlers are then exported from 
// the controller module, so you can use them here in your Router. 
// 
// This would be useful if you had dozens or hundreds of API endpoints that
// belong in this router. It helps keep the router manageable. 
// 
// For this handler, and a few others, I demonstrate how the controller could
// work. See below. You will find the implementation of the middleware handlers
// in the controller module (imported above using "require()").
//----------------------------------------------------------------------------//

router.get('/', Controller.getAdopters);
router.get('/:id', Controller.getAdopterById);
router.get('/:id/dogs', Controller.getAdopterDogs);

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

// 
// The URL needed to get to this handler depends on the URL prefix this router
// is bound to, when it is imported by some other module(s). In our case, the
// server.js file imports this Router, and binds it to /api/adopters, and
// /i/love/dogs. Thus, the following requests will route to this handler:
// 
//      DELETE /api/adopters/:id
//      DELETE /i/love/dogs/:id
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


module.exports = router;