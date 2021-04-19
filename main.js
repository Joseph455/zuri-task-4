const http = require('http');
const fs = require('fs');

function getData(url) {
  http.get(url, async (res) => {
    let rawTextData = "";
    let retries = 0;

    res.on("data", (chuck) => {
      rawTextData += chuck;
    });

    res.on("end", async () => {
      let data = JSON.parse(rawTextData);
      console.log(data);
      writeDataToServer(data);
    });

    res.on("error", (err) => {
      
      setInterval((err) => {
        if (retries <= 10) retry(url, err);
      }, 5000, err);
    
    });
    
    function retry (url, err) {
      console.log("Network error retrying in 5 seconds");
      getData(url);
    }
  
  });
}

function writeDataToServer(jsonData) {
  let writableData = JSON.stringify(jsonData);

  fs.writeFile("./result/posts.json", writableData, (err) => {
    if (err) {
      console.log("Could't write file because of of : ", err);
    }
  });

}

function main () {
  let url = "http://jsonplaceholder.typicode.com/posts";
  getData(url);
}

main();