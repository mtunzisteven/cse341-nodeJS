const fs = require('fs');

const requestHandler = (req, res) =>{

    const url = req.url;
    const method = req.method;

    if(url === '/'){

        res.write('<html><head><title>Enter Information</title></head>'); 
        res.write('<html><body><form action="/message" method="POST"><input type="text" name="message" ><input type="submit" value="submit" ></form>'); 
        res.write('</body></html>'); 

        // quit function using return
        return res.end();

    }

    if(url === '/message' && method === "POST"){

        // the full data will be held by this array
        const body = [];

        req.on('data', (chunk) => {
            // show each chunk
            console.log(chunk);
            // load each chunk to body
            body.push(chunk);
        });

        // listen for end of streaming
        return req.on('end', () => {
            // take the whole parsed body and buffer it(put it together)
            const parsedBody = Buffer.concat(body).toString(); // we expect text.
            const message = parsedBody.split("=")[1]; // message = responseMessage. This results in what we want input name was set as message
            console.log(parsedBody);
            fs.writeFile('message.txt', message, err =>{

                // redirection
                res.statusCode = 302; // http status eg. 401, 200... 302 for redirection
                res.setHeader('Location', '/'); //goes back to root page
                return res.end();

            }); // writeFile asyncronous: prefered for big files. body code of arrow fn executed once done
        });
    }

    res.setHeader('Content-Type', 'text/html'); 
    res.write('<html>');
    res.write('<head><title>My First Page</title></head>');
    res.write('<body><h1>Hello from my Node.JS</h1></body>');
    res.write('</html>');
    res.end();

}

// ways to export our request handler

// module.exports = requestHandler;

// for multiple: module.exports = {
    // handler: requestHandler,
    // txt: some text
// }

// other option

// module.exports.handler = requestHandler;
// module.exports.txt = some text;

// best and shortcut way below:
exports.handler = requestHandler;
