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
// call "server.get('/api/hubs', (req, res) => {...})", we are adding a GET
// /api/hubs "route handler" to the server's default router object.
//
// In ExpressJS, we can create *additional* routers, and *bind* them to specific
// "root URL's". ExpressJS will route requests that are addressed to the root
// URL to the corresponding router.
//
// In this server file, we "require" our router modules, which each export an
// express.router() object. These objects are "bound" to a root URL using the
// router.use() method. See below.
//
// Note that we can have as many routers as we need. A typical project will have
// multiple routers. In the lecture, we only created one. But our data model has
// a method that could be called from a route handler that should be in a
// different router. Remember, also, that the structure of your code will follow
// the structure of your API, and the structure of your API will typically
// follow the structure of your data.
//
// If you look at our data model (in ./hubs/hubs-model.js), you will see a
// method called "findMessageById()", which searches a database table called
// "messages". It would make sense to have a router for all API endpoints that
// deal with "hubs", and *another* router for all API endpoints that deal with
// "messages". 
//
// In our case, we can deal with messages *within* hubs (i.e.
// /api/hubs/:id/messages), but we can also deal with messages directly, if we
// have a unique message ID (/api/messages/:id). If we know the ID of a message,
// we can get it without needing to reference its hub at all, for editing it,
// retrieving it, and deleting it. (For creating messages, we HAVE to reference
// the hub, because the system needs to know what hub to create it for.)
//
// We didn't do it in the lecture, but I've created another router for
// "/api/messages", and it is referenced below, along with the hubs router that
// we created in class.
//
const hubsRouter = require('./hubs/hubs-router.js');
const messagesRouter = require('./messages/messages-router.js');

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
// Here, we "bind" our router objects to specific "root url's".
//
// This means that express() will look in the corresponding router object for
// middleware/handlers for HTTP requests on URL's that begin with the specified
// URL root.
//
// So, GET /api/hubs/ will be handled by the GET "/" handler in the hubsRouter
// object, because the hubsRouter object is bound to /api/hubs. Likewise, DELETE
// /api/hubs/:id will cause express() to look in the hubsRouter for a handler
// for DELETE /:id.
//
// As shown in the lecture, we can bind the same router object to multiple url
// roots. This is not typically something you will do, but it demonstrates how
// the binding works. Each of the URL root bindings below will direct incoming
// requests to the same route handlers, so that "GET /api/hubs" and "GET /repos"
// both will resolve to the hubsRouter object, and will invoke the "GET /" route
// handler within that router.
//
// Express determines which router handler within the router to call based on
// the METHOD, and the "subroute" (the portion of the URL that comes after the
// URL root where the router is bound.)
// 
// HTTP requests addressed to all three of the following URL roots will return
// the same results, because they are all bound to the same router object.
//
server.use('/api/hubs', hubsRouter);
server.use('/repos', hubsRouter);
server.use('/thing/otherthing', hubsRouter);
//
// Here, we also bind our messagesRouter to a root URL...
//
server.use('/api/messages', messagesRouter);

//
// This router handler is not bound to a URL root, because it is added to the
// "default" router in the express() app ("server" in our instance here.)
//
// Thus, this handler will match "GET /".
//
server.get('/', (req, res) => {
    res.send(`
      <h2>Lambda Hubs API</h>
      <p>Welcome to the Lambda Hubs API</p>
    `);
});


// 
// be sure to export our server!
//
module.exports = server;