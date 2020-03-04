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

function nextLetter(s){
    return s.replace(/([a-zA-Z])[^a-zA-Z]*$/, function(a){
        var c= a.charCodeAt(0);
        switch(c){
            case 90: return 'A';
            case 122: return 'a';
            default: return String.fromCharCode(++c);
        }
    });
}

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


function lastLetterWord4567(){
  var dateobj = new Date();
  var nowTime = dateobj.toISOString();
  console.log(nowTime);
  var data = {
    "laterThen": {"iso":nowTime,"__type":"Date"},
    "searchText":"4-5-6-7",
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
    console.log('4567 last letter word--**');

    for(var index in JSON.parse(body).result){
      if(JSON.parse(body).result[index].objectId == 'tAkdXCUZpE' && JSON.parse(body).result[index].lastSenderId !='YAIwmOBFSm'){

        var wrdarr = JSON.parse(body).result[index].lastmessage.split('')
        var _wrds = vocab[wrdarr[wrdarr.length-1]]

        var lengthToFind = wrdarr.length+1;
        if(lengthToFind>7) lengthToFind=4

        var filtered = [];
        for (var _index in _wrds){
          if(englishWords[_wrds[_index]].length == lengthToFind){
          filtered.push(englishWords[_wrds[_index]]);
          }
        }
        var text = filtered[Math.floor(Math.random() * filtered.length)];
        sendText(text,'tAkdXCUZpE');

      }

    }
  }catch(error){
    console.log('4567 error');
    console.log(error)
  }
  });


}

function lastLetterWord(){
  var dateobj = new Date();
  var nowTime = dateobj.toISOString();
  console.log(nowTime);
  var data = {
    "laterThen": {"iso":nowTime,"__type":"Date"},
    "searchText":"word",
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
    console.log('last letter word--**');
   var counter = 0;
    for(var index in JSON.parse(body).result){
      if(JSON.parse(body).result[index].objectId == 'eMMUDYAfFf' && JSON.parse(body).result[index].lastSenderId !='YAIwmOBFSm'){

        var wrdarr = JSON.parse(body).result[index].lastmessage.split('')
        var _wrds = vocab[wrdarr[wrdarr.length-1]]
        var _wrd = _wrds[Math.floor(Math.random() * _wrds.length)];
        var text = englishWords[_wrd];

         sendText(text,'eMMUDYAfFf');

      }

    }
  }catch(error){
    console.log('top chats error');
  }
  });


}

function lastLetterWordDup(){
  var dateobj = new Date();
  var nowTime = dateobj.toISOString();
  console.log(nowTime);
  var data = {
    "laterThen": {"iso":nowTime,"__type":"Date"},
    "searchText":"word",
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
    console.log('last letter word--**');
   var counter = 0;
    for(var index in JSON.parse(body).result){
      if(JSON.parse(body).result[index].objectId == 'Vris18Jrn5' && JSON.parse(body).result[index].lastSenderId !='YAIwmOBFSm'){

        var wrdarr = JSON.parse(body).result[index].lastmessage.split('')
        var _wrds = vocab[wrdarr[wrdarr.length-1]]
        var _wrd = _wrds[Math.floor(Math.random() * _wrds.length)];
        var text = englishWords[_wrd];

         sendText(text,'Vris18Jrn5');

      }

    }
  }catch(error){
    console.log('top chats error');
  }
  });


}

function nextFirstLetter(){
  var dateobj = new Date();
  var nowTime = dateobj.toISOString();
  console.log(nowTime);
  var data = {
    "laterThen": {"iso":nowTime,"__type":"Date"},
    "searchText":"First letter",
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
    console.log('first next letter word--**');
   var counter = 0;
    for(var index in JSON.parse(body).result){
      if(JSON.parse(body).result[index].objectId == 'gHXWF8bgH9' && JSON.parse(body).result[index].lastSenderId !='YAIwmOBFSm'){

        var wrdarr = JSON.parse(body).result[index].lastmessage.split('')
        var _wrds = vocab[nextLetter(wrdarr[0]).toLowerCase()]
        var _wrd = _wrds[Math.floor(Math.random() * _wrds.length)];
        var text = englishWords[_wrd];

         sendText(text,'gHXWF8bgH9');

      }

    }
  }catch(error){
    console.log('first next letter word error');
    console.log(error);
  }
  });


}

function secondLastLetterWordDup(){
  var dateobj = new Date();
  var nowTime = dateobj.toISOString();
  console.log(nowTime);
  var data = {
    "laterThen": {"iso":nowTime,"__type":"Date"},
    "searchText":"2nd last",
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
    console.log('second last letter word--**');
   var counter = 0;
    for(var index in JSON.parse(body).result){
      if(JSON.parse(body).result[index].objectId == 'FCjq8Gp3Wa' && JSON.parse(body).result[index].lastSenderId !='YAIwmOBFSm'){

        var wrdarr = JSON.parse(body).result[index].lastmessage.split('')
        var _wrds = vocab[wrdarr[wrdarr.length-2]]
        var _wrd = _wrds[Math.floor(Math.random() * _wrds.length)];
        var text = englishWords[_wrd];

         sendText(text,'FCjq8Gp3Wa');

      }

    }
  }catch(error){
    console.log('top chats error');
  }
  });


}



function secondLastLetterWord(){
  var dateobj = new Date();
  var nowTime = dateobj.toISOString();
  console.log(nowTime);
  var data = {
    "laterThen": {"iso":nowTime,"__type":"Date"},
    "searchText":"2nd last",
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
    console.log('second last letter word--**');
   var counter = 0;
    for(var index in JSON.parse(body).result){
      if(JSON.parse(body).result[index].objectId == 'jrZV1GU4yJ' && JSON.parse(body).result[index].lastSenderId !='YAIwmOBFSm'){

        var wrdarr = JSON.parse(body).result[index].lastmessage.split('')
        var _wrds = vocab[wrdarr[wrdarr.length-2]]
        var _wrd = _wrds[Math.floor(Math.random() * _wrds.length)];
        var text = englishWords[_wrd];

         sendText(text,'jrZV1GU4yJ');

      }

    }
  }catch(error){
    console.log('top chats error');
  }
  });


}

//the word

function theWord(){
  var dateobj = new Date();
  var nowTime = dateobj.toISOString();
  console.log(nowTime);
  var data = {
    "laterThen": {"iso":nowTime,"__type":"Date"},
    "searchText":"the word",
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
    console.log('the word--**');
    for(var index in JSON.parse(body).result){
      if(JSON.parse(body).result[index].objectId == 'RF6BE7JXG1' && JSON.parse(body).result[index].lastSenderId !='YAIwmOBFSm'){
      try{
        if(synonyms(JSON.parse(body).result[index].lastmessage,"n")){
          sendText(synonyms(JSON.parse(body).result[index].lastmessage,"n")[1],'RF6BE7JXG1');
        }
      }catch(error){

      }


      }

    }
  }catch(error){
    console.log('top chats error');
  }
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

var createVocab = function(){
  for (var index in englishWords ){
    var key = englishWords[index].split('')[0];
    if(Object.keys(vocab).indexOf(key) > -1){
      vocab[key].push(index);
    }
    else{
      vocab[key] = [index];
    }
  }
}

var makeupText = function(){
  var group = groups[Math.floor(Math.random() * groups.length)];
  console.log(group);
  diseminateText(group);
  //diseminateText('78RPuf7pjD');
}


//getTopChats();
createVocab();


schedule.scheduleJob('*/45 * * * * *', nextFirstLetter);
schedule.scheduleJob('*/40 * * * * *', secondLastLetterWordDup);
schedule.scheduleJob('*/35 * * * * *', secondLastLetterWord);
schedule.scheduleJob('*/30 * * * * *', lastLetterWord4567);
schedule.scheduleJob('*/20 * * * * *', theWord);
schedule.scheduleJob('*/15 * * * * *', lastLetterWord);
schedule.scheduleJob('*/10 * * * * *', lastLetterWordDup);



//schedule.scheduleJob('*/30 * * * * *', makeupText);
//schedule.scheduleJob('*/1 * * * *', getTopChats);
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
