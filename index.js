//
// if you're happy and you know it...
//
const server = require('./server.js');

//
//
// we moved the code that creates the express server, and put it in server.js.
// In this file, we just "require" it, then start the server listening.
//
// we moved all of our route handlers and other middleware to "router" files.
//
// this helps us to organize our code better, allowing for easier expansion and
// troubleshooting, and collaborating with other developers.
//
//
server.listen(4000, () => {
  console.log('\n*** Server Running on http://localhost:4000 ***\n');
});