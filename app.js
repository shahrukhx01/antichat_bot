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
var moby = require('moby')
var synonyms = require("synonyms");

//import wordlist from 'wordlist-english'; // ES Modules
var wordlist = require('wordlist-english');
var userTexts = [];
var stickers = ["[sticker=a1]", "[sticker=a2]", "[sticker=a3]", "[sticker=a4]", "[sticker=a5]", "[sticker=a6]", "[sticker=a7]", "[sticker=a8]", "[sticker=a9]", "[sticker=a10]", "[sticker=a11]", "[sticker=a12]", "[sticker=a13]", "[sticker=a14]", "[sticker=a15]", "[sticker=a16]", "[sticker=a17]", "[sticker=a18]", "[sticker=a19]", "[sticker=a20]", "[sticker=a21]", "[sticker=a22]", "[sticker=a23]", "[sticker=a24]", "[sticker=a25]", "[sticker=a26]", "[sticker=a27]", "[sticker=a28]"];
var indexChats = 0;
var vocab = {};
var englishWords = wordlist['english'];
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

var groups = [];

function getConfig(text, groupId){
  var data = {
    'dialogue': groupId,
    'message': text,
    'receiver': "public",
    '_ApplicationId': "fUEmHsDqbr9v73s4JBx0CwANjDJjoMcDFlrGqgY5",
    '_ClientVersion': "js1.11.1",
    "_InstallationId": "ad26f28e-a3d9-a0ac-725f-a389edb3a835",
    "_SessionToken": "r:9a4fb3f4feeb07b6532e175d8d1d098c"
  };
  return data;
}

function sendText(text,dialogue){
  var data = getConfig(text, dialogue);

  request.post({
    headers: {'content-type' : 'application/json'},
    url:     "https://mobile-elb.antich.at/classes/Messages",
    body:    JSON.stringify(data)
  }, function(error, response, body){
    console.log(JSON.stringify(body));
  });


}

function getTopChats(){
  var dateobj = new Date();

// Contents of above date object is
// converted into a string using toISOString() function.
var nowTime = dateobj.toISOString();
  var data = {
  "laterThen": {"iso":nowTime,"__type":"Date"},
  "searchText":"",
  "v":10002,
  "_ApplicationId": "fUEmHsDqbr9v73s4JBx0CwANjDJjoMcDFlrGqgY5",
  "_ClientVersion": "js1.11.1",
  "_InstallationId": "ad26f28e-a3d9-a0ac-725f-a389edb3a835",
  "_SessionToken": "r:9a4fb3f4feeb07b6532e175d8d1d098c"
};

request.post({
  headers: {'content-type' : 'application/json'},
  url:     "https://mobile-elb.antich.at/functions/getTopChats",
  body:    JSON.stringify(data)
}, function(error, response, body){
  try{
  console.log('top chats--**');
 var counter = 0;
  for(var index in JSON.parse(body).result){
    if(groups.indexOf(JSON.parse(body).result[index].objectId) == -1 && groups.length <= 20000){
      groups.push(JSON.parse(body).result[index].objectId);
      counter++;
    }

  }
  console.log(counter+' new groups added!');
}catch(error){
  console.log('top chats error');
}
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
  var data = getConfig(text, groupId);

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


var getText = function(){
  if (Math.round(Math.random()) > 0.5) {
    return randomQuotes['default']().body;
  }
  else {
    return  oneLinerJoke.getRandomJoke().body ;

  }

};



var diseminateText = async function(){

  let text = getText();
  let SLEEP_SECS = (Math.floor(Math.random() * 59) + 1  ) * 1000;
  await sleep(SLEEP_SECS);
  let proba = Math.random();

  if (proba >= 0.25) {
      console.log(new Date(), ' text sent: '+text,'hit proba: ' ,proba);
    sendText(text,'wKxPAGANdi');
  }
  else if (proba >= 0.5) {
      console.log(new Date(), ' text sent: '+text,'hit proba: ' ,proba);
    sendText(text,'OnC1z8QCsB');
  }
  else if (proba >= 0.75) {
      console.log(new Date(), ' text sent: '+text,'hit proba: ' ,proba);
    sendText(text,'rQapfeid75');
  }
  else{
    console.log(new Date(), ' text sent: '+text,'miss proba: ' ,proba);
  }
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}


schedule.scheduleJob('*/3 * * * *', diseminateText);
schedule.scheduleJob('*/1 * * * *', keepAlive);
schedule.scheduleJob('0 5 * * *', getDailyBonus);

//NEWBIES wKxPAGANdi NEWBIES 2 OnC1z8QCsB Khi VCb5Q3h6vQ AS fkoulukUIg
server.listen(process.env.PORT || 5000, (err) => {
  if (err) {
    throw err;
  }
  /* eslint-disable no-console */
  console.log('Node Endpoints working :)');
});


module.exports = server;
