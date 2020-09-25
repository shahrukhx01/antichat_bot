const path = require('path');
process.binding('http_parser').HTTPParser = require('http-parser-js').HTTPParser;
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
var randomImageJs = require('random-image-js');
const imageToBase64 = require('image-to-base64');



//import wordlist from 'wordlist-english'; // ES Modules
var wordlist = require('wordlist-english');
var userTexts = [];
var stickers = ["[sticker=a1]", "[sticker=a2]", "[sticker=a3]", "[sticker=a4]", "[sticker=a5]", "[sticker=a6]", "[sticker=a7]", "[sticker=a8]", "[sticker=a9]", "[sticker=a10]", "[sticker=a11]", "[sticker=a12]", "[sticker=a13]", "[sticker=a14]", "[sticker=a15]", "[sticker=a16]", "[sticker=a17]", "[sticker=a18]", "[sticker=a19]", "[sticker=a20]", "[sticker=a21]", "[sticker=a22]", "[sticker=a23]", "[sticker=a24]", "[sticker=a25]", "[sticker=a26]", "[sticker=a27]", "[sticker=a28]"];
var indexChats = 0;
let rawdata = fs.readFileSync('groups.json');
let all_groups = JSON.parse(rawdata);
var groups = all_groups['groups'];
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



function getConfig(text, groupId, receiver){
  var data = {
    'dialogue': groupId,
    'message': text,
    'receiver': receiver,
    '_ApplicationId': "fUEmHsDqbr9v73s4JBx0CwANjDJjoMcDFlrGqgY5",
    '_ClientVersion': "js1.11.1",
    '_InstallationId': "dbdc7d93-cd71-e815-2f82-92a17583c768",
    '_SessionToken': "r:cdb732fb47533bc947cd4d0870fb8744"
  };
  return data;
}

function uploadImage(base64, text, dialogue){
  var data = {
    'base64': base64,
    '_ApplicationId': "fUEmHsDqbr9v73s4JBx0CwANjDJjoMcDFlrGqgY5",
    '_ClientVersion': "js1.11.1",
    '_InstallationId': "dbdc7d93-cd71-e815-2f82-92a17583c768",
    '_SessionToken': "r:cdb732fb47533bc947cd4d0870fb8744"
  };

let data_new = JSON.stringify(data);

  request.post({
    headers: {'content-type' : 'text/plain', "path": "/files/upload.jpg",  "authority": "mobile-elb.antich.at",
              "scheme": "https",   "accept": "*/*"},
    url:     "https://mobile-elb.antich.at/files/upload.jpg",
    body: data_new
  }, function(error, response, body){
    url = JSON.parse(body)['url']
    spt =  url.split('/')
    fname = spt[spt.length-1]
    data_img =   {name: fname,
      url: url,
      __type: "File"}

  sendImageText(text, dialogue, data_img)
  });
}


function sendImageText(text, dialogue, data_img){
  var data = getConfig(text, dialogue, "group");
  data['photo']= data_img
  request.post({
    headers: {'content-type' : 'application/json'},
    url:     "https://mobile-elb.antich.at/classes/Messages",
    body:    JSON.stringify(data)
  }, function(error, response, body){
    console.log(JSON.stringify(body));
  });
}

function sendText(text,dialogue){
  var data = getConfig(text, dialogue, "public");

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
  '_InstallationId': "dbdc7d93-cd71-e815-2f82-92a17583c768",
  '_SessionToken': "r:cdb732fb47533bc947cd4d0870fb8744"
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
  if (Math.random() >= 0.5) {
    return '[photo]';
  }
  else {
    return  oneLinerJoke.getRandomJoke({
    'exclude_tags': ['dirty', 'racist', 'marriage']
  }).body ;

  }

};



var diseminateText = async function(){

  let text = getText();
  let SLEEP_SECS = (Math.floor(Math.random() * 30) + 1  ) * 1000;
  await sleep(SLEEP_SECS);
  let proba = Math.random();
  let GRP_INDEX = (Math.floor(Math.random() * groups.length-1) + 0  ) ;
  if (proba >= 0.1 && groups.length>0) {

      let grp = groups[GRP_INDEX]
      console.log(new Date(), ' text sent: '+text,'hit proba: ' ,proba, ' '+grp+' grps'+groups.length);
    if (text == '[photo]') dowloadImage(text,grp);
    else sendText(text, grp);
  }
  else {
      console.log(new Date(), ' text sent: '+text,'hit proba: ' ,proba, ' rQapfeid75');
    if (text == '[photo]') dowloadImage(text,'rQapfeid75');
    else sendText(text,'rQapfeid75');
  }
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}


function dowloadImage(text, dialogue){
//use with callback
randomImageJs.getMemes().then(response => {
  console.log(response[0]['image']);

imageToBase64(response[0]['image']) // Image URL
    .then(
        (response) => {
          uploadImage(response, text, dialogue)
            //console.log(response); // "iVBORw0KGgoAAAANSwCAIA..."
        }
    )
    .catch(
        (error) => {
            console.log(error); // Logs an error if there was one
        }
    )
});
}


schedule.scheduleJob('*/30 * * * * *', diseminateText);
schedule.scheduleJob('*/1 * * * *', keepAlive);
schedule.scheduleJob('*/1 * * * *', getTopChats);
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
