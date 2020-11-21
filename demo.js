//Require node modules
const http = require("http");
const url = require("url");
const fs = require("fs");

//connection settings
const port = process.env.port || 3000;

//create server
const server = http.createServer((request, response) => {
  let pathname = url.parse(request.url, true).pathname;

  if (pathname === "/project_files/script.js") {
    response.end();
    return false;
  }
  if (pathname === "/favicon.ico") {
    response.end();
    return false;
  }
  if (pathname === "/project_files/style.css") {
    response.end();
    return false;
  }

  let data = fs.readFileSync("./static/project_files/index.html", "utf-8");

  //print data to the webpage
  response.statusCode = 200;
  response.write(data);
  return response.end();
});

//listen to client requests on the specific port, the port should be available
server.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
