const buildBreadcrumb = require("./breadcrumb");
const fs = require("fs");
const path = require("path");

//require files
const calculateSizeD = require("./calculateSizeD");
const calculateSizeF = require("./calculateSizeF");

const buildMainContent = (fullStaticPath, pathname) => {
  let mainContent = "";

  //loop through the elements inside the folder
  let items, link;
  try {
    items = fs.readdirSync(fullStaticPath);
  } catch (err) {
    console.log("readdirSync Error: " + err);
    return `<div class="alert alert-danger">Internal Server Error</div>`;
  }

  //get the following elements for each item:
  items.forEach((item) => {
    let itemDetails = {};
    //name
    itemDetails.name = item;

    //link
    link = path.join(pathname, item);

    //icon

    const itemFullStaticPath = path.join(fullStaticPath, item);

    try {
      itemDetails.stats = fs.statSync(itemFullStaticPath);
    } catch (err) {
      console.log("statSync Error: " + err);
      mainContent = `<div class="alert alert-danger">Internal Server Error</div>`;
    }

    if (itemDetails.stats.isDirectory()) {
      itemDetails.icon = `<ion-icon name="folder"></ion-icon>`;
      [itemDetails.size, itemDetails.sizeBytes] = calculateSizeD(
        itemFullStaticPath
      );
    } else if (itemDetails.stats.isFile()) {
      itemDetails.icon = `<ion-icon name="document"></ion-icon>`;
      [itemDetails.size, itemDetails.sizeBytes] = calculateSizeF(
        itemDetails.stats
      );
    }
    //when was the file last changed??
    itemDetails.timeStamp = parseInt(itemDetails.stats.mtimeMs);

    itemDetails.date = new Date(itemDetails.timeStamp);

    itemDetails.date = itemDetails.date.toLocaleString();

    mainContent += `
<tr data-name="${itemDetails.name}" data-size="${itemDetails.size}" data-time="${itemDetails.timeStamp}">
<td>${itemDetails.icon} <a href="${link}">${item}</a></td>
<td>${itemDetails.sizeBytes}</td>
<td>${itemDetails.date}</td>
</tr>`;
  });

  return mainContent;
};

module.exports = buildMainContent;
