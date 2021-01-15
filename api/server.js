
const express = require('express');

//
// Dividing our API app up into different "router" files allows us to keep it
// organized, in light of the fact that we will likely end up with dozens, if
// not hundreds (or in some cases, thousands!) of endpoints. In our small
// example here, we only have a few, but we demonstrate how to create separate
// "router" objects and modules to allow us to keep all of the code and other
// configuration settings for different parts of our API separate.
//
// The main express() "application" has a "router" built into it. So when we
// call "server.get('/api/adopters', (req, res) => {...})", we are adding a GET
// /api/adopters "route handler" to the server's default router object.
//
// In ExpressJS, we can create *additional* routers, and *bind* them to specific
// "root URL's". ExpressJS will route requests that are addressed to the "bound"
// root URL to the corresponding router.
//
// In this server file, we "require" our router modules, which each export an
// express.Router() object. These objects are "bound" to a root URL using the
// router.use() method. See below.
//
// Note that we can have as many routers as we need. A typical project will have
// multiple routers. In the lecture, we only created one. But our data model has
// a method that could be called from a route handler that should be in a
// different router. Remember, also, that the structure of your code will follow
// the structure of your API, and the structure of your API will typically
// follow the structure of your data.
//
// If you look at our data model (in ./api/adopters/adopters-model.js), you will see a
// method called "findDogs()", which searches the adopters table, joined with
// the dogs table. It would make sense to have a router for all API endpoints that
// deal with "adopters", and *another* router for all API endpoints that deal with
// "dogs". 
//
// In our case, we can deal with dogs *within* adopters (i.e.
// /api/adopters/:id/dogs), but we can also deal with dogs directly, if we
// have a unique message ID (/api/dogs/:id). If we know the ID of a dog,
// we could get it without needing to reference its adopter at all, for editing it,
// retrieving it, and deleting it. 
//
// Note that a Router() object is actually a middleware function, taking the
// same (req, res) parameters that any middleware function takes. It also has
// its own middleware stack within it, and will process the request to hand it
// off to the next middleware handler from the Router's stack that matches the
// METHOD and /path.
//
const AdoptersRouter = require('./adopters/adopters-router.js');
const DogsRouter = require('./dogs/dogs-router.js');

// 
// Here we create our server object, which we will "configure" by adding
// routers, default route handlers, and other middleware to it, and then export
// it (so we can "start" it in index.js with the server.listen() call...)
//
const server = express();

//
// This is the JSON parser middleware. Adding it directly to the express() app
// (a.k.a. "server") makes it "global". It will apply to all HTTP requests,
// regardless of what what router will ultimately handle it. This is because we
// are adding this middleware directly to the express() app, rather than to a
// specific router. If we wanted to have certain middleware apply only to
// requests handled by a specific router, we could call router.use() in the
// router module to add it. But here, we are adding it to the express() app, so
// it is global (applies to ALL HTTP requests).
//
server.use(express.json());

//
// Here, we "bind" our router objects to specific "URL prefixes" (a.k.a. "root
// URL's").
//
// When requests come in, Express() will look in its middleware list for any
// middleware that is bound to a URL prefix that matches the request URL. When a
// Router is bound to a URL prefix that matches the request URL, the request is
// given to the Router. It will then strip the prefix from the request URL, and
// work to match the remainder of the path to any route handlers within the
// Router that match.
//
// So, GET /api/adopters/ will be handled by the GET "/" handler in the AdoptersRouter
// object, because the AdoptersRouter object is bound to /api/adopters, and /api/adopters
// will be stripped from the request URL (leaving only "/"). Likewise, DELETE
// /api/adopters/:id will cause Express() to route the request to the AdoptersRouter,
// which will try to match on DELETE /:id.
//
// As shown in the lecture, we can bind the same router object to multiple URL
// roots. There are limited use cases where you would do this, but it
// demonstrates how the binding works. Each of the URL prefix bindings below
// will direct matching incoming requests to the same Router middleware, so that
// "GET /api/adopters" and "GET /i/love/dogs" both will be routed to the AdoptersRouter
// object, and will invoke the "GET /" route handler within that Router.
//
// The Router determines which middleware handler within the Router to give the
// request to based on the METHOD, and the remainder of the path (the portion of
// the URL that isn't stripped, that comes after the URL prefix to which the
// Router is bound.)
//
// HTTP requests addressed to all three of the following URL prefixes will
// return the same results, because they are all bound to the same Router
// middleware object/function.
//
server.use('/api/adopters', AdoptersRouter);
server.use('/i/love/dogs', AdoptersRouter);

// NOTE that there are two functions that are similar:
//      .all()
//      .use()
// 
// They can be used to accomplish the same thing, but there are some important
// differences between them. Notably, .all() registers middleware to be executed
// on all METHODS, as if the handler had been registered on the METHOD. In other
// words, server.all('/api/adopters', (req, res) => {...}) acts like there was
// a call to server.get('/api/adopters', (req, res) => {...}), and a call to
// server.post('/api/adopters', (req, res) => {...}), and so on. 
// 
// .use() is typically used to register middleware that is meant to be run
// before PATH/METHOD matching begins in the router. 
// 
// They are similar, and can be used to accomplish some of the same things. A
// call to .all('*', func) is the same as a call to .use('/', func); 

//
// Here, we also bind our DogsRouter middleware to a URL prefix...
//
server.use('/api/dogs', DogsRouter);

//
// This middleware handler is not bound to a URL prefix, because it is added to
// the "default" router in the Express() app (a constant called "server" in our
// instance here.)
//
// Thus, this handler will match "GET /" requests.
//
server.get('/', (req, res) => {
  console.log(req.query);
  res.send(`
      <h2>Lambda Animal Shelter API</h2>
      <p>Welcome to the Lambda Animal Shelter API</p>
    `);
});


// 
// be sure to export our server!
//
module.exports = server;