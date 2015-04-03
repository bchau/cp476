var http = require('http'),
    fs = require('fs');
 
http.createServer(function (request, response) {
	response.writeHead(200, {'Content-Type': 'text/html'});
	response.setHeader('Access-Control-Allow-Origin','*');
	response.end();

}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');
 


