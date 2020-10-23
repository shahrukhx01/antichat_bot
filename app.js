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
var oneLinerJoke = require('one-liner-joke');
var moby = require('moby')
const imageToBase64 = require('image-to-base64');
const redditImageFetcher = require('reddit-image-fetcher');



var userTexts = [];
var stickers = ["[sticker=a1]", "[sticker=a2]", "[sticker=a3]", "[sticker=a4]", "[sticker=a5]", "[sticker=a6]", "[sticker=a7]", "[sticker=a8]", "[sticker=a9]", "[sticker=a10]", "[sticker=a11]", "[sticker=a12]", "[sticker=a13]", "[sticker=a14]", "[sticker=a15]", "[sticker=a16]", "[sticker=a17]", "[sticker=a18]", "[sticker=a19]", "[sticker=a20]", "[sticker=a21]", "[sticker=a22]", "[sticker=a23]", "[sticker=a24]", "[sticker=a25]", "[sticker=a26]", "[sticker=a27]", "[sticker=a28]"];
var indexChats = 0;
let users = [];
let sent = [];
let rawdata = fs.readFileSync('groups.json');
let all_groups = JSON.parse(rawdata);
var groups = all_groups['groups'];
var vocab = {};
var switch_ =0;

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


function get_session(){

  return ["2e7119cf-70ac-7084-031d-54f464ff143b","r:07e6c287409b603924ddc23e52eb8063"]
}
function getConfig(text, groupId, receiver){
  var data = {
    'dialogue': groupId,
    'message': text,
    'receiver': receiver,
    '_ApplicationId': "fUEmHsDqbr9v73s4JBx0CwANjDJjoMcDFlrGqgY5",
    '_ClientVersion': "js1.11.1",
    "_InstallationId": get_session()[0],
    "_SessionToken": get_session()[1]
  };
  return data;
}

function uploadImage(base64, text, dialogue){
  var data = {
    'base64': base64,
    '_ApplicationId': "fUEmHsDqbr9v73s4JBx0CwANjDJjoMcDFlrGqgY5",
    '_ClientVersion': "js1.11.1",
    "_InstallationId": get_session()[0],
    "_SessionToken": get_session()[1]
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
      exitPrivateChat(dialogue, "exitGroupChat")
      console.log(JSON.stringify(body));
    });
  }


  function exitPrivateChat(dialogue, type){
    var data = getConfig("", dialogue, "group");
    data['chat']= dialogue
    request.post({
      headers: {'content-type' : 'application/json'},
      url:     "https://mobile-elb.antich.at/functions/"+type,
      body:    JSON.stringify(data)
    }, function(error, response, body){
      console.log('deleted '+ type);
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

  function getActiveUsers(dialogue){
    var data = getConfig("", dialogue, "public");

    request.post({
      headers: {'content-type' : 'application/json'},
      url:     "https://mobile-elb.antich.at/functions/getActiveUsers",
      body:    JSON.stringify(data)
    }, function(error, response, body){
      let resp = JSON.parse(body).result

      for (let index in resp){
        let user = resp[index]
        let tempUser = {}
        if (user.female && !user.isAdmin && user.karma>1000){
          tempUser['otherProfileName'] = user.profileName;
          tempUser['otherObject'] = user.objectId;
          tempUser['dialogueId'] = 'freshDialogue';
          tempUser['message'] = getText() +"\n\n\n\n\n P.S: If you have a pet or love animals join my group: \n 'cute pets': https://chat.antiland.com/pgN4LN5GSw";
          if (sent.indexOf(user.objectId) == -1){
            users.push(tempUser)
          }
        }

      }
      sendPM()
    });


  }

  function sendPM(){
    var data = getConfig("text", "dialogue", "public");
    if (users.length==0) return
    let INDEX_ARR = Math.floor(Math.random()*users.length);
    console.log('index generated '+INDEX_ARR+' with len'+users.length);
    let user = users[INDEX_ARR]
    users.splice(INDEX_ARR, 1);
    console.log(JSON.stringify(user))
    data.otherProfileName = user.objectId;
    data.otherObject = user.otherObject;
    data['dialogueId'] = user.dialogueId;
    data['otherName'] = "";
    data['message'] = user.message;
    sent.push(data['otherObject'])
    console.log(JSON.stringify(data));
    request.post({
      headers: {'content-type' : 'application/json'},
      url:     "https://mobile-elb.antich.at/functions/sendMessage",
      body:    JSON.stringify(data)
    }, function(error, response, body){
    console.log(JSON.stringify(body));
    response_data = JSON.parse(body)
    console.log('pm created');
        try{
    exitPrivateChat(response_data.result.dialogue, "exitPrivateChat")
  }catch(error){
    console.log('karma error');
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
      "_ApplicationId": "fUEmHsDqbr9v73s4JBx0CwANjDJjoMcDFlrGqgY5",
      "_InstallationId": get_session()[0],
      "_SessionToken": get_session()[1]
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
    if (Math.random() >= 1) {
      return '[photo]';
    }
    else {
      return  oneLinerJoke.getRandomJoke({
        'exclude_tags': ['dirty', 'racist', 'marriage', 'sex']
      }).body ;

    }

  };



  var diseminateText = async function(){

    let text = getText();
    let SLEEP_SECS = (Math.floor(Math.random() * 30) + 1  ) * 1000;
    await sleep(SLEEP_SECS);
    let proba = Math.random();
    let GRP_INDEX = (Math.floor(Math.random() * groups.length-1) + 0  ) ;
    if (switch_ < groups.length ){
      let grp = groups[switch_];
      switch_ +=1;
      console.log(new Date(), ' text sent: '+text,'hit proba: ' ,proba, ' '+grp+' grps'+groups.length);
      getActiveUsers(grp);
     senderId = 'iqbEoeZGNu';
     getActiveUsers(grp, senderId)
     // sendText("If you play Clash Royale on mobile, Please join my group: \n 'Clash Royale 👑 🤴 ': https://chat.antiland.com/pgN4LN5GSw",grp);


    }else{
      switch_=0;

    }
    /*if (switch_ == 0) {
    switch_ = 1;
    let grp = '917IlKd2IC'
    console.log(new Date(), ' text sent: '+text,'hit proba: ' ,proba, ' '+grp+' grps'+groups.length);
    if (text == '[photo]') dowloadImage(text,grp);
    else sendText(text, grp);
  }
  else {
  switch_ = 0;
  let grp = 'wKxPAGANdi'
  console.log(new Date(), ' text sent: '+text,'hit proba: ' ,proba, grp);
  if (text == '[photo]') dowloadImage(text,grp);
  else sendText(text,grp);
} */
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}


const randomPuppy = require('random-puppy');
function dowloadImage(text, dialogue){
  //use with callback
  randomPuppy().then(url => {

    imageToBase64(url) // Image URL
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
  }); //returns 1 meme

}

function getActiveUsersNew(dialogue, senderId){
  var data = {"dialogueId":dialogue,"v":10001,"_ApplicationId":"fUEmHsDqbr9v73s4JBx0CwANjDJjoMcDFlrGqgY5","_ClientVersion":"js1.11.1","_InstallationId":get_session()[0],"_SessionToken":get_session()[1]}


  request.post({
    headers: {'content-type' : 'application/json'},
    url:     "https://mobile-elb.antich.at/functions/getMessages",
    body:    JSON.stringify(data)
  }, function(error, response, body){
    let resp = JSON.parse(body).result
    let res_len = resp.length-1;
    if (res_len <= 0) {
      console.log('didnt sent it actually!');
      return false
    }
    else {
      if(resp[res_len-1].senderId =! senderId && Math.random()>0.5)  {
        console.log('sent it actually!');
        dowloadImage('[photo]', dialogue)

      }
      else{
        console.log('didnt sent it actually!');
      }
    }
  });
}

//getActiveUsers("rQapfeid75");
function sendPet(){
  dialogue = 'pgN4LN5GSw'
  senderId = 'iqbEoeZGNu'
  getActiveUsersNew(dialogue, senderId)

}
schedule.scheduleJob('*/30 * * * *', sendPet);
schedule.scheduleJob('*/10 * * * *', diseminateText);
schedule.scheduleJob('*/1 * * * *', keepAlive);
schedule.scheduleJob('*/1 * * * *', getTopChats);
//schedule.scheduleJob('0 5 * * *', getDailyBonus);

//NEWBIES wKxPAGANdi NEWBIES 2 OnC1z8QCsB Khi VCb5Q3h6vQ AS fkoulukUIg
server.listen(process.env.PORT || 5000, (err) => {
  if (err) {
    throw err;
  }
  /* eslint-disable no-console */
  console.log('Node Endpoints working :)');
});


module.exports = server;
