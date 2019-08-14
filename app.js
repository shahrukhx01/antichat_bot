const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const server = require('http').Server(app);
const port = 3000;
const helmet = require('helmet');
const request = require('request');
var fs = require('fs');
var schedule = require('node-schedule');
var txtgen = require('txtgen');
const randomQuotes = require('random-quotes');
var oneLinerJoke = require('one-liner-joke');
var userTexts = [];
var stickers = ["[sticker=a1]", "[sticker=a2]", "[sticker=a3]", "[sticker=a4]", "[sticker=a5]", "[sticker=a6]", "[sticker=a7]", "[sticker=a8]", "[sticker=a9]", "[sticker=a10]", "[sticker=a11]", "[sticker=a12]", "[sticker=a13]", "[sticker=a14]", "[sticker=a15]", "[sticker=a16]", "[sticker=a17]", "[sticker=a18]", "[sticker=a19]", "[sticker=a20]", "[sticker=a21]", "[sticker=a22]", "[sticker=a23]", "[sticker=a24]", "[sticker=a25]", "[sticker=a26]", "[sticker=a27]", "[sticker=a28]"];
var indexChats = 0;
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');
  next();
});

app.options('*', function(req, res) {
  res.send(200);
});

app.get('/', function(req, res) {
  res.send({data:'hello'});
});

function sendText(dialogue,text){

  var data = {//'antiFlood': false ,
    'dialogue': dialogue,
    'message': text,
    'receiver': "public",
    '_ApplicationId': "fUEmHsDqbr9v73s4JBx0CwANjDJjoMcDFlrGqgY5",
    '_ClientVersion': "js1.11.1",
    '_InstallationId': "f451bcb0-5c13-79ee-ee9e-4109a220c041",
    '_SessionToken': "r:99d9c13fd10bd71dcf774c5433e406fe"};

    request.post({
      headers: {'content-type' : 'application/json'},
      url:     "https://mobile-elb.antich.at/classes/Messages",
      body:    JSON.stringify(data)
    }, function(error, response, body){
      console.log(JSON.stringify(body));
    });


  }
  function keepAlive(){
    request.get({
      headers: {'content-type' : 'application/json'},
      url:     "https://nodeappx01.herokuapp.com/",
      body:    JSON.stringify({})
    }, function(error, response, body){
      console.log('keeping it going...!');
    });
  }

  function getDailyBonus(){
    var data = {
      'dialogue': "wKxPAGANdi",
      'message': "/bonus",
      'receiver': "public",
      '_ApplicationId': "fUEmHsDqbr9v73s4JBx0CwANjDJjoMcDFlrGqgY5",
      '_ClientVersion': "js1.11.1",
      '_InstallationId': "f451bcb0-5c13-79ee-ee9e-4109a220c041",
      '_SessionToken': "r:99d9c13fd10bd71dcf774c5433e406fe"};

      request.post({
        headers: {'content-type' : 'application/json'},
        url:     "https://mobile-elb.antich.at/classes/Messages",
        body:    JSON.stringify(data)
      }, function(error, response, body){

        // appendFile function with filename, content and callback function
        var date = new Date();
        var timestamp = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();

        fs.appendFile('bonus.log', JSON.parse(body).message+","+timestamp+"\n", function (err) {
          if (err) throw err;
          console.log('Bonus log written successfully.');
        });
      });


    }

    /*
    function getUsersList(diag){
    var data = {
    "dialogue":diag,
    "v":10001,
    "_ApplicationId":"fUEmHsDqbr9v73s4JBx0CwANjDJjoMcDFlrGqgY5",
    "_ClientVersion":"js1.11.1",
    '_InstallationId': "ee0a4992-703c-696d-71ca-19e52f3e81f2",
    '_SessionToken': "r:39b2e68ab336bb8a68cee6cf2136a121"
  };

  request.post({
  headers: {'content-type' : 'application/json'},
  url:     "https://mobile-elb.antich.at/functions/getActiveUsers",
  body:    JSON.stringify(data)
}, function(error, response, body){

// appendFile function with filename, content and callback function
var date = new Date();
var timestamp = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();

var usersDict = {};
JSON.parse(body).result.forEach(element => {
usersDict[element.objectId] = element.profileName;
});
getRecentMessages(usersDict,diag);
});
}

function getRecentMessages(users,diag){
var d = new Date();
// d = Mon Feb 29 2016 08:00:09 GMT+0100 (W. Europe Standard Time)
var milliseconds = Date.parse(d);
// 1456729209000
milliseconds = milliseconds - (1 * 60 * 1000);
// - 5 minutes
var d_ = new Date(milliseconds).toISOString();
var data = {
"laterThan": {"iso": d_, "__type": "Date"},
"dialogueId": diag,
"v": 10001,
"_ApplicationId": "fUEmHsDqbr9v73s4JBx0CwANjDJjoMcDFlrGqgY5",
"_ClientVersion": "js1.11.1",
'_InstallationId': "ee0a4992-703c-696d-71ca-19e52f3e81f2",
'_SessionToken': "r:39b2e68ab336bb8a68cee6cf2136a121"
};

request.post({
headers: {'content-type' : 'application/json'},
url:     "https://mobile-elb.antich.at/functions/getMessages",
body:    JSON.stringify(data)
}, function(error, response, body){

// appendFile function with filename, content and callback function
var userTexts = [];
JSON.parse(body).result.forEach(element => {
if (users[element.senderId] != undefined)
userTexts.push({name: users[element.senderId].trim(), text: element.message});
});

userTexts = userTexts.filter(obj => Object.keys(obj).includes("name"));
const toSearch = new Set(["Jake"]);
userTexts = userTexts.filter(obj => !toSearch.has(obj.name));
console.log(JSON.stringify(userTexts));
getBotReply(userTexts[Math.floor(Math.random()*userTexts.length)],diag);
});
}


function getBotReply(userText,diag){
if (userText == undefined || userText.text == undefined) return;
var text = JSON.stringify({	text: userText.text});
console.log(text);
request.post({
headers: {'content-type' : 'application/json'},
url:     "https://anti-botx01.herokuapp.com/get_reply",
body: text
}, function(error, response, body){
var text = userText.name+", "+JSON.parse(body).reply;
console.log("*** resp generated ***");
console.log(text);
sendText(diag,text);

});
} */




schedule.scheduleJob('0 5 * * *', getDailyBonus);


var getText = function(){
  if (Math.round(Math.random()) > 0.5) {
    console.log('quote generated');
    return randomQuotes['default']().body;
  }
  else {
    console.log('joke generated');
    return  oneLinerJoke.getRandomJoke().body;

  }

};



function getTopChats(){
  var d = new Date();
  // d = Mon Feb 29 2016 08:00:09 GMT+0100 (W. Europe Standard Time)
  var milliseconds = Date.parse(d);
  // 1456729209000
  milliseconds = milliseconds - (1 * 60 * 1000);
  // - 5 minutes
  var d_ = new Date(milliseconds).toISOString();
  var data = {
    "laterThen": {
      "iso": d_,
      "__type": "Date"
    },
    "v": 10001,
    "_ApplicationId": "fUEmHsDqbr9v73s4JBx0CwANjDJjoMcDFlrGqgY5",
    "_ClientVersion": "js1.11.1",
    "_InstallationId": "f451bcb0-5c13-79ee-ee9e-4109a220c041",
    "_SessionToken": "r:99d9c13fd10bd71dcf774c5433e406fe"
  };

  request.post({
    headers: {'content-type' : 'application/json'},
    url:     "https://mobile-elb.antich.at/functions/getTopChats",
    body:    JSON.stringify(data)
  }, function(error, response, body){

    // appendFile function with filename, content and callback function
    try{
      JSON.parse(body).result.forEach(element => {
        if (userTexts.indexOf(element.objectId) == -1) userTexts.push(element.objectId);

      });
      console.log(userTexts.length);
    }catch(err){
      console.log(err.message);
    }
  });
}
schedule.scheduleJob('*/1 * * * *', keepAlive);
schedule.scheduleJob('*/5 * * * * *', function(fireDate){
  //Top groups
  //var quote = stickers[Math.floor(Math.random()*stickers.length)];
  var quote = getText();
  sendText(userTexts[indexChats],quote);
  console.log("sent to group no."+ indexChats +"-"+quote+"-"+ userTexts[indexChats]);
  indexChats += 1;
  if(indexChats > userTexts.length-1) indexChats = 0;
});


//schedule.scheduleJob('*/1 * * * *', getTopChats);


schedule.scheduleJob('*/3 * * * *', function(fireDate){
  //NEWBIES
  var quote = getText();
  sendText("wKxPAGANdi",quote);
  console.log("sent to group newbies.");
});

schedule.scheduleJob('*/3 * * * *', function(fireDate){
  //AS
  var quote = getText();
  sendText("fkoulukUIg",quote);
  console.log("sent to group AS.");
});
server.listen(process.env.PORT || 5000, (err) => {
  if (err) {
    throw err;
  }
  /* eslint-disable no-console */
  console.log('Node Endpoints working :)');
});


module.exports = server;
