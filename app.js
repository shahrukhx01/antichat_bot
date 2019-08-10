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
  '_InstallationId': "71273d8b-2f8c-82f0-542b-f28f4473ccfa",
  '_SessionToken': "r:c74d85e072dd8e823ff36d25cdd8f19e"};

  request.post({
    headers: {'content-type' : 'application/json'},
    url:     "https://mobile-elb.antich.at/classes/Messages",
    body:    JSON.stringify(data)
  }, function(error, response, body){
    console.log(JSON.stringify(body));
  });


}

function getDailyBonus(){
  var data = {
    'dialogue': "wKxPAGANdi",
    'message': "/bonus",
    'receiver': "public",
    '_ApplicationId': "fUEmHsDqbr9v73s4JBx0CwANjDJjoMcDFlrGqgY5",
    '_ClientVersion': "js1.11.1",
    '_InstallationId': "71273d8b-2f8c-82f0-542b-f28f4473ccfa",
    '_SessionToken': "r:c74d85e072dd8e823ff36d25cdd8f19e"};

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
//cron job for taking backups (0 0 * * *)
schedule.scheduleJob('*/1 * * * *', function(fireDate){

  var quote = getText();
  var groups = ["VCb5Q3h6vQ", "4rbEOuP292", "OBXL1FFYcX", "wlskfXGy8L", "ZKAZjXz6Rx",
  "0FLEEsLwCT", "OgZVAAJbUW", "7xBm7g9Dpo", "l0EgwBpBLW", "s0vxqBmbOw", "UtLAMPr1ls",
  "ELFds8Moxc", "bhJ67XYqRq", "nK4F9UIgWM", "1m4AFbYyNx", "mo6WeTKWTH",
  "dpzAhVLhPl", "0K6HP3LnvE", "XjgwHkVqNV", "GkdWBUsSSd", "H60OOFxk2q", "Hf8AVUJw0p",
  "RFWKxIC45G", "AVdggXExlo", "KaeTSKnjGL", "FAgoPb4QjS"];
  var group = groups[Math.floor(Math.random()*groups.length)];
  sendText(group,quote);
  console.log("sent to group  "+group+" "+quote);
});

schedule.scheduleJob('*/2 * * * *', function(fireDate){
  //NEWBIES
  var quote = getText();
  sendText("wKxPAGANdi",quote);
  console.log("sent to group newbies.");
});

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


server.listen(process.env.PORT || 5000, (err) => {
  if (err) {
    throw err;
  }
  /* eslint-disable no-console */
  console.log('Node Endpoints working :)');
});
module.exports = server;
