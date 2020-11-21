//require node modules
const url = require("url");
const path = require("path");
const fs = require("fs");

//file imports
const buildBreadcrumb = require("./breadcrumb.js");
const buildMainContent = require("./mainContent.js");
const getMimeType = require("./getMimeType.js");

//static base bath: location of your static folder
const staticBasePath = path.join(__dirname, "..", "/static");

//respond to a request
//Following is function passed to createServer used to creater the server
const respond = (request, response) => {
  //before working with the pathname, you need to decode it

  let pathname = url.parse(request.url, true).pathname;
  // if favicon.ico stop
  // if (pathname === "/project_files/script.js") {
  //   response.end();
  //   return false;
  // }
  if (pathname === "/favicon.ico") {
    return false;
  }
  // if (pathname === "/project_files/style.css") {
  //   response.end();
  //   return false;
  // }

  pathname = decodeURIComponent(pathname);
  //get the corresponding full static path located in the static folder
  const fullStaticPath = path.join(staticBasePath, pathname);

  //Can we find something in fullStaticPath?
  //no: send '404: File Not Found!'

  if (!fs.existsSync(fullStaticPath)) {
    console.log(`${fullStaticPath} does not exist`);
    response.write("404: File not Found :(");
    response.end();
    return false;
  }
  //We found something
  //is it a file or directory?
  let stats;
  try {
    stats = fs.lstatSync(fullStaticPath);
  } catch (err) {
    console.log(`${err}`);
  }

  //It is a directory:
  if (stats.isDirectory()) {
    //get content from the template index.html
    let data = fs.readFileSync(
      path.join(staticBasePath, "project_files/index.html"),
      "utf-8"
    );

    //build the page title
    let pathElements = pathname.split("/").reverse();
    pathElements = pathElements.filter((elements) => elements !== "");
    const folderName = pathElements[0];

    //build breadcrumb
    const breadcrumb = buildBreadcrumb(pathname);

    //build table rows (main_content)
    const mainContent = buildMainContent(fullStaticPath, pathname);

    //fill the template data with: the page title, breadcrumb and table rows (main_content)
    data = data.replace("page_title", folderName);
    data = data.replace("pathname", breadcrumb);
    data = data.replace("mainContent", mainContent);

    //print data to the webpage
    response.statusCode = 200;
    response.write(data);
    return response.end();
  }

  //It is not a directory but not a file either
  //send: 401: Access Denied!
  if (!stats.isFile()) {
    response.statusCode = 401;
    response.write("401: Access Denied");
    return response.end();
  }

  //It is a file
  //lets get the file extension

  let fileDetails = {};
  fileDetails.extname = path.extname(fullStaticPath);

  //get the file mime type and add it to the response header
  getMimeType(fileDetails.extname)
    .then((mime) => {
      //store headers here

      let head = {};
      let options = {};

      //response status code
      let statusCode = 200;

      //set "Content-Type" for all file types
      head["Content-Type"] = mime;

      fs.readFile(fullStaticPath, (err, html) => {
        if (err) {
          response.write("Error");
          response.end();
          return false;
        } else {
          response.writeHead(statusCode, mime);
          display(html);
        }
      });

      //reading the file using fs.readfile
      fs.promises
        .readFile(fullStaticPath, "utf8")
        .then((data) => {
          console.log("im here");
          response.writeHead(statusCode, head);
          response.write(d);
          return response.end(data);
        })
        .catch((error) => {
          response.statusCode = 404;
          response.write("404: File Reading error!");
          return response.end();
        });
    })
    .catch((err) => {
      response.statusCode = 500;
      response.write("500: Internal server error!");
      console.log(`Promise error: ${err}`);
      return response.end();
    });

  //get the file  size and add it to the response header
  //pdf file? then display in browser
  //audio/video file? then stream in ranges
  //all other files? then stream in a normal way
  response.end();
};

module.exports = respond;
