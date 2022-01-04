const http = require('http');
const fs = require('fs');

// request listener function I defined that must take 
// two args. One to accept and read the request data 
// and another to respond to that request.
//function reqListener(req, res){}

// create server function calls listener without braces
// options: 
//                  http.createServer(function(req, res){});  
//                  http.createServer((req, res) => {}); recommended by me
//                  http.createServer(reqListener);

// we must store server in as var so we can use it later.
// Here we are registering the event to handle requests
// and response using the event loop
const server = http.createServer((req, res) => {

    // get the url of the request and store in constant
    const url = req.url;

    // get the method of the request and store in constant
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

});

// use server by listening for incoming requests
// it takes args host and port
server.listen(3000);