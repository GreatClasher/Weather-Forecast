// require('dotenv').config();
const http = require("http");
const fs = require("fs");
var requests = require("requests");


const homeFile = fs.readFileSync("index.html","utf-8");


const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempval%}", (orgVal.main.temp - 273.15).toFixed(2));
    temperature = temperature.replace("{%tempmin%}", (orgVal.main.temp_min - 273.15).toFixed(2));
    temperature = temperature.replace("{%tempmax%}", (orgVal.main.temp_max - 273.15).toFixed(2));
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
  
    return temperature;
  };
  

const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests(
        "https://api.openweathermap.org/data/2.5/weather?q=Pune,In&appid=3c2979212ef609b3938cc43a92f44b17"
    )
      .on("data", (chunk) => {
        const objdata = JSON.parse(chunk);
        const arrData = [objdata];
        // console.log(arrData);
        const realTimeData = arrData
          .map((val) => replaceVal(homeFile, val))
          .join("");     //coverting array to string
        res.write(realTimeData);
        // console.log(realTimeData);
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);
        res.end();
      });
  } 
//   else if (req.url == "/styles.css") {
//   const cssFile = fs.readFileSync("styles.css", "utf-8");
//   res.writeHead(200, { "Content-type": "text/css" });
//   res.end(cssFile);
// }
   else {
    res.end("File not found");
  }
});

server.listen(8000, "127.0.0.1");