const Adopter = require('./adopters-model.js');

// 
// There is a well-known "design pattern" for creating web applications or any
// application with a user interface that interacts with back-end resources. It
// is called "MVC" - an acronym for "Model - View - Controller". You can read
// about it here:
//
//      https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller
//
// for more info on design patterns in general, see:
//
//      https://en.wikipedia.org/wiki/Software_design_pattern
//
// In Express applications, there is a common pattern (though not an cononical
// "design pattern") that is based on MVC. It involves defining:
// 
//      * a "model" (a code layer, or modules collection, that manages 
//        interaction with your data source), 
//      * a "view" (the "interface" of your API - the definition of the URL
//        endpoints, and the mapping of them to functions), 
//      * and a "controller" (modules that contain the processing logic on the 
//        requests and responses)). 
// 
// Applying the MVC pattern to Express applications gives you this: 
// 
//      MODEL = modules that provide access to your data source
//      VIEW = modules that define the URI's - typically Router files
//      CONTROLLER = modules that contain the functionality executed for URI's
// 
// You will see this in many tutorials, and sample Express projects on the
// Internet. It's a useful pattern if you end up having dozens or hundreds of
// endpoints in your Router files - it helps keep the Router files clean,
// readable, and easy to maintain. It also helps with versioning - updated
// functions can reside in "controller-v2.js" modules, etc., and can be mounted
// to router objects as needed. 
// 
// This file is a controller module. Here, some of the middleware functions for
// some of the adopters endpoints are defined and exported. The adopters-router
// module can import this controller and use it to cleanly map these middleware
// functions to specific URL's using Router().METHOD() calls. See the
// adopters-router.js module for examples of using a controller, and defining
// middleware in-line. 
// 

module.exports = {
    // GET /
    getAdopters: async function (req, res) {
        try {
            const adopters = await Adopter.find(req.query);
            // note the "200" response... 2xx responses are "success" responses.
            res.status(200).json(adopters);
        } catch (err) {
            console.log(err);
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
                message: 'Error retrieving the adopters',
            });
        }
    },

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

    // GET /:id
    getAdopterById: async function (req, res) {
        try {
            const adopter = await Adopter.findById(req.params.id);
            if (adopter) {
                res.status(200).json(adopter);
            } else {
                res.status(404).json({ message: "invalid id" });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: 'Error retrieving the adopters',
            });
        }
    },

    // GET /:id/dogs
    getAdopterDogs: async function (req, res) {
        try {
            const dogs = await Adopter.findDogs(req.params.id);
            res.status(200).json(dogs);
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: 'Error retrieving the adopters',
            });
        }
    },


    // the following controller methods have not been defined... try taking
    // in-line middleware function definitions from the router module and moving
    // them here ... your router module will thank you. :)

    // POST /
    postAdopter: function (req, res) {
        res.status(400).json({ implemented: false });
    },

    // DELETE /:id
    deleteAdopterById: function (req, res) {
        res.status(400).json({ implemented: false });
    },

    // PUT /:id
    putAdopterById: function (req, res) {
        res.status(400).json({ implemented: false });
    }
}

