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
      console.log('sending puppy!')
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



const randomPuppy = require('random-puppy');
function dowloadImage(text, dialogue){
  console.log('start sending puppy')
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
      dowloadImage('[photo]', dialogue)
      console.log('didnt sent it actually! 11');
      return false
    }
    else {
      if(resp[res_len-1].senderId =! senderId)  {
        console.log('sent it actually!');
        dowloadImage('[photo]', dialogue)

      }
      else{
        dowloadImage('[photo]', dialogue)
        console.log('didnt sent it actually!');
      }
    }
  });
}

//getActiveUsers("rQapfeid75");
function sendPet(){


  let GRP_INDEX = (Math.floor(Math.random() * groups.length-1) + 0  ) ;
  if (switch_ < groups.length ){
    let grp = groups[switch_];
    switch_ +=1;
    console.log(new Date(),  ' '+grp+' grps'+groups.length);


   getActiveUsersNew(grp, senderId)

  }else{
    switch_=0;

  }

}
