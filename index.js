const fs = require("fs");
const http = require("http");
const url = require("url");

// const data = fs.readFileSync("./txt/input.txt", "utf8");
// console.log(data);

// fs.writeFileSync("result.txt", data);

// fs.readFile("./txt/start.txt", "utf8", (err, data) => {
//   console.log(data);

//   fs.readFile(`./txt/${data}.txt`, "utf8", (err, data) => {
//     console.log(data);

//     fs.writeFile('result.txt', data , (err) => {
//         console.log(data)
//       console.log("File successfully written! ");
//     });
//   });
// });

// console.log("Tasks performed!");

///////////////////////////////
///////////SERVER//////////////

const tempOverview = fs.readFileSync(
  `./templates/template-overview.html`,
  "utf8"
);

const tempProduct = fs.readFileSync(
  `./templates/template-product.html`,
  "utf8"
);

const tempCard = fs.readFileSync(`./templates/template-card.html`, "utf8");
const data = fs.readFileSync("./dev-data/data.json", "utf8");
dataObj = JSON.parse(data);

const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%ID%}/g, product.id);
  output = output.replace(/%DESCRIPTION%/g, product.description);

  if (!product.organic) {
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  }

  return output;
};

const server = http.createServer((req, res) => {
  // const pathName = req.url;
  // console.log(req.url);
  // console.log(url.parse(req.url, true));

  const { query, pathname } = url.parse(req.url, true);
  console.log(pathname, query);
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);

    // console.log(cardsHtml);

    res.end(output);
  } else if (pathname === "/product") {
    const product = dataObj[query.id];
    const productHtml = replaceTemplate(tempProduct, product);

    // console.log(productHtml);

    res.end(productHtml);
  } else if (pathname === "/api") {
    fs.readFile("./dev-data/data.json", "utf8", (err, data) => {
      console.log(JSON.parse(data));
      res.writeHead(200, { "Content-type": "application/JSON" });
      res.end(data);
    });
  } else {
    res.end("OOPS");
  }
});

server.listen(6600, () => {
  console.log("Listening to port 6600");
});
