'use strict';

const Hapi = require('hapi');
// for server static
const inert = require('inert');
// for templates views 
const vision = require('vision');
// my template engine
const Etpl = require('etpl-wrap');
const etpl = new Etpl();

const server = new Hapi.Server();
// console.log(etpl, etpl.compile)
let etplView = {
    compile: etpl.compile
}
server.connection({
    port: 3333,
    host:'0.0.0.0'
});

server.register(vision, err => {
    if (err) throw err;
    server.views({
        engines: {
            html: etpl
        },
        relativeTo: __dirname,
        path: './templates'
    });
    server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply.view('index', {content: '传入 content哇哈哈'});
    }
});
})


server.route({
    method: 'GET',
    path:'/{name}',
    handler: function (request, reply) {
        reply(`Hello, ${encodeURIComponent(request.params.name)}`)
    }
})

server.register(inert, err => {
    if (err) throw err;
    server.route({
        method:'GET',
        path: '/static/{params*}',
        handler: {
            directory: {
                path: 'static'
            }
        }
    })
})

server.start((err) => {
    if (err) throw err;
    console.log(`Hapi server running at : ${server.info.uri}`)
});