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
//import wordlist from 'wordlist-english'; // ES Modules
var wordlist = require('wordlist-english');
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

var groups = [];

function sendText(text,dialogue){
  var data = {//'antiFlood': false ,
    'dialogue': dialogue,
    'message': text,
    'receiver': "public",
    "_ApplicationId":"fUEmHsDqbr9v73s4JBx0CwANjDJjoMcDFlrGqgY5",
    "_ClientVersion":"js1.11.1",
    "_InstallationId":"49b87787-56dd-0d12-46eb-b9e23e84a9bb",
    "_SessionToken":"r:57ad292f2b97ee498cc08f4c1ab8960b"
  };

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
  "_ApplicationId":"fUEmHsDqbr9v73s4JBx0CwANjDJjoMcDFlrGqgY5",
  "_ClientVersion":"js1.11.1",
  "_InstallationId":"49b87787-56dd-0d12-46eb-b9e23e84a9bb",
  "_SessionToken":"r:57ad292f2b97ee498cc08f4c1ab8960b"
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
  var data = {
    'dialogue': "wKxPAGANdi",
    'message': "/bonus",
    'receiver': "public",
    '_ApplicationId': "fUEmHsDqbr9v73s4JBx0CwANjDJjoMcDFlrGqgY5",
    '_ClientVersion': "js1.11.1",
    "_InstallationId": "47b6f990-8775-4d6f-41da-d6e6371a5ba8",
    "_SessionToken": "r:f94d5b7a2c5c44a17db74d66c0fe4bad"
  };

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

schedule.scheduleJob('0 5 * * *', getDailyBonus);


var getText = function(){
  if (Math.round(Math.random()) > 0.5) {
    return randomQuotes['default']().body;
  }
  else {
    return  oneLinerJoke.getRandomJoke().body ;

  }

};



var diseminateText = function(dialogue){
  console.log('**** THE TEXT IS: ***')
  let text = getText();
  console.log(text);
  if (Math.round(Math.random()) > 0.3) {
    sendText(text,dialogue);
  }
}

var wordGroup = function(){
  var dialogue = 'RF6BE7JXG1';
  console.log('**** WORD GROUP: ***')
  var englishWords = wordlist['english'];
  var text = englishWords[Math.floor(Math.random() * englishWords.length)];
  console.log(text);
  if (Math.round(Math.random()) > 0.3) {
    sendText(text,dialogue);
  }
}

//
getTopChats();
var makeupText = function(){
  var group = groups[Math.floor(Math.random() * groups.length)];
  console.log(group);
  diseminateText(group);
  //diseminateText('78RPuf7pjD');
}
//wordGroup();
schedule.scheduleJob('*/15 * * * * *', wordGroup);
schedule.scheduleJob('*/30 * * * * *', makeupText);
schedule.scheduleJob('*/1 * * * *', getTopChats);
schedule.scheduleJob('*/1 * * * *', keepAlive);

//NEWBIES wKxPAGANdi NEWBIES 2 OnC1z8QCsB Khi VCb5Q3h6vQ AS fkoulukUIg
server.listen(process.env.PORT || 5000, (err) => {
  if (err) {
    throw err;
  }
  /* eslint-disable no-console */
  console.log('Node Endpoints working :)');
});


module.exports = server;
