#!/usr/bin/env node
'use strict'
const Express = require('express');

const App = function() {};
App.expressStaticRoutes = [
    {path: '/js/', serverPath: '/dist/js'},
    {path: '/', serverPath: '/dist/html/'},
];
App.prototype.server = Express();
App.prototype.run = function() {
    const server = this.server;
    App.expressStaticRoutes.forEach(function(route) {
        server.use(route.path, Express.static(__dirname + route.serverPath));
    });
    server.listen(3000);
    console.log('Listening on 3000 port ...');
};
module.exports = App;

const app = new App();
app.run();
