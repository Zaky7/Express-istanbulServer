const cov = require('istanbul-middleware');
const express = require('express');
const app = express();
var http = require('http');
var fs = require('fs');

app.use('/coverage', cov.createHandler()); // mount istanbul middleware here

app.listen(6969);  //Specify the port.

console.log("Open express server at : localhost:6969/coverage");
//Sending Post
function PostCode(codestring) {
    // since files are in Json Format, no need to stringify them.
        //var post_data = querystring.stringify(codestring);
    
    var post_data = codestring;
    // An object of options to indicate where to post to
    var post_options = {
        host: 'localhost',
        port: '6969',
        path: '/coverage/client',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(post_data)
        }
    };


    // Set up the request
    var post_req = http.request(post_options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            console.log('Response: ' + chunk);
        });
    });

    // post the data
    post_req.write(post_data);
    post_req.end();

}


// This is an async file read     
fs.readFile('coverageReport/coverage-final.json', 'utf-8', function(err, data) {
    if (err) {

        console.log("FATAL An error occurred trying to read in the file: " + err);
        process.exit(-2);
    }
    // Make sure there's data before we post it
    if (data) {
        PostCode(data);
    } else {
        console.log("No data to post");
        process.exit(-1);
    }

});