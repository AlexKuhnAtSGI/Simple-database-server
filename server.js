//simple server listens on the provided port and responds with requested pages

// load modules
var http = require('http');
var fs = require('fs');
var mime = require('mime-types');
const ROOT = "./public_html";


// create http server
var server = http.createServer(handleRequest);
server.listen(2406);
console.log('Server listening on port 2406');
var url = require('url');

// handler for incoming requests
function handleRequest(req, res) {
    //process the request
	//NOTE: YOU MAY GET FORMATTING ERRORS ON SOME OF THE INDENTING, MY NOTEPAD++ SHOWS IT AS NORMAL BUT EMACS SAYS THERE ARE EXTRA TABS
	//code still runs
    console.log("Request for: "+req.url);
    var filename = ROOT + req.url;
    var urlObj = url.parse(req.url, true);

    
    var code = 200;
    var data = "";

    if(req.method == 'GET' && urlObj.pathname == ("/allHeroes")){
	//this kind of request is only given on inital page load: this provides the database html with what it needs to populate its heroMenu
		console.log("Populating menu");
		data = JSON.stringify(fs.readdirSync("allHeroes"));
    }
    else if (req.method == 'GET' && urlObj.href.indexOf("/hero?") > -1){
	//this request is gotten whenever the view button is clicked; it sends the hero's data to the client
		console.log("Acquiring data: " + urlObj.query.name.replace('_', ' '));
		var aQuery = "./allHeroes/" + urlObj.query.name + ".json";
		if (fs.existsSync(aQuery)) {
			data = fs.readFileSync(aQuery);
			res.writeHead(code, {'content-type': mime.lookup(filename)||'application/json'});
			res.end(data);
		}
		else{
			console.log("File not found");
		}
    }
    else if (urlObj.href.indexOf("/hero?") > -1){
	var aQuery = "./allHeroes/" + urlObj.query.name + ".json";
	if (fs.existsSync(aQuery)) {
	    data = fs.readFileSync(aQuery);
	    res.writeHead(code, {'content-type': mime.lookup(filename)||'application/json'});
	    res.end(data);
	}
	else{
	    console.log("File not found");
	    code = 404;
	    data = fs.readFileSync(ROOT+"/404.html");
	}
    }
    else if(fs.existsSync(filename)){
	var stats = fs.statSync(filename);
	if(stats.isDirectory()){
	    filename += "/index.html";
	}
	data = getFileContents(filename);
	code = 200;
	

    }
    else{
	console.log("File not found");
	code = 404;
	data = fs.readFileSync(ROOT+"/404.html");
    }
    // content header
    res.writeHead(code, {'content-type': mime.lookup(filename)||'text/html'});
    // write message and signal communication is complete
    res.end(data);
}

//read a file and returns its contents
function getFileContents(filename){
    
    var contents;
    
    //handle good requests
    console.log("Getting file");
    contents = fs.readFileSync(filename);
    return contents;
}
