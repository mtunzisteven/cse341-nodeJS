const fs = require('fs');

const requestHandler = (req, res) =>{

    const url = req.url;
    const method = req.method;

    if(url === '/'){

        res.write('<html><head><title>Enter User</title></head>');
        res.write('<html><body>');
        res.write('<h1>Users App</h1><form action="/create-users" method="POST"><input type="text" name="message" ><input type="submit" value="submit" ></form>'); 
        res.write('</body></html>'); 

        // quit function using return
        return res.end();

    }

    if(url === '/create-users' && method === "POST"){

        // the full data will be held by this array
        const body = [];

        req.on('data', (chunk) => {
            // load each chunk to body
            body.push(chunk);
        });

        // listen for end of streaming
        return req.on('end', () => {
            // take the whole parsed body and buffer it(put it together)
            const parsedBody = Buffer.concat(body).toString(); // we expect text.
            const message = parsedBody.split("=")[1]; // message = responseMessage. This results in what we want input name was set as message
            console.log(message);

            // redirection
            res.statusCode = 302; // http status eg. 401, 200... 302 for redirection
            res.setHeader('Location', '/users'); //goes back to root page
            return res.end();

        });
    }

    if(url === '/users'){

        res.setHeader('Content-Type', 'text/html'); 
        res.write('<html>');
        res.write('<head><title>Users List</title></head>');
        res.write('<body><h1>Users App</h1>');
        res.write('<ul><li>User 1</li></ul>');
        res.write('<ul><li>User 2</li></ul>');
        res.write('<ul><li>User 3</li></ul>');
        res.write('<ul><li>User 4</li></ul></body>');
        res.write('</html>');

        // quit function using return
        return res.end();
    }



}

// export routes handler
exports.handler = requestHandler;
