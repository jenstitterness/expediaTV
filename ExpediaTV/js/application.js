App.onLaunch = function(options) {
  var req = new XMLHttpRequest();
  req.responseType = "application/json";

  req.onerror = function() {
    var alert = createAlert("ERROR", ""); //leaving 2nd parameter with an empty string
    navigationDocument.presentModal(alert);
  };

  req.onload = function() {
    var res = JSON.parse(req.responseText);

    var showcase = createShowcase(res);

      playVideo();
      
//    navigationDocument.presentModal(showcase);
  };

  req.onreadystatechange = function() {
  var status;
  var data;
  if (req.readyState == 4) { //request finished and response is ready
    status = req.status;
    // var alert = createAlert(status, status); //leaving 2nd parameter with an empty string
    // navigationDocument.presentModal(alert);
    if (status == 200) {
      data = JSON.parse(req.responseText);
      // pass the data to a handler
      //
      // var alert = createAlert(data.data[0].user.full_name, data); //leaving 2nd parameter with an empty string
      // navigationDocument.presentModal(alert);

    } else {
      // handle the error
    }
  }
};

  req.open("GET", "http://localhost:9001/js/feed.json");

  req.send();
};


var playVideo = function() {
    
    var player = new Player();
    
    player.playlist = new Playlist();
    
    var video = new MediaItem('video', 'https://r3---sn-n2gpou-nx5e.googlevideo.com/videoplayback?expire=1448947091&lmt=1436806554288758&requiressl=yes&upn=dc51bNn4ZGw&sver=3&initcwndbps=4701250&mn=sn-n2gpou-nx5e&ipbits=0&mm=31&id=o-AEMQfsLaYIvDHXvMGu0JqxQN_n6K7F1Te-kvLjk7Ua-A&mv=m&dur=86.865&mt=1448925437&ms=au&ip=208.95.100.4&ratebypass=yes&signature=58253226F721D83751259F6E5CF07B85D79DCFDF.4081F0F6377D52BFFCFCC71CF52E69E6535FF4FA&itag=22&sparams=dur%2Cid%2Cinitcwndbps%2Cip%2Cipbits%2Citag%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Cratebypass%2Crequiressl%2Csource%2Cupn%2Cexpire&key=yt6&fexp=9407051%2C9407535%2C9408710%2C9409245%2C9415515%2C9415792%2C9416126%2C9417683%2C9418203%2C9419838%2C9420452%2C9422436%2C9422596%2C9422618%2C9423162%2C9423662%2C9423724%2C9424196%2C9424446%2C9424963&source=youtube&pl=21&mime=video%2Fmp4');
    
    player.playlist.push(video);
    player.play();
    
};


var createShowcase = function(feed) {
  var showcase = `<?xml version="1.0" encoding="UTF-8" ?>
    <document>
    <showcaseTemplate>
   <banner>
      <title>Expedia</title>
      <row>
         <button>...</button>
      </row>
   </banner>
   <carousel>
      <section>`


      for(var i = 0; i < feed.data.length; i++) {
        showcase += `<lockup><img src="`+ feed.data[i].images.standard_resolution.url+`" />`

         if (feed.data[i].location) {
          showcase += `<description>`+feed.data[i].caption.text+`</description>`
         }

                    showcase += `</lockup>`
      }

    showcase += `</section>
                    </carousel>
                    </showcaseTemplate></document>
`


  var parser = new DOMParser();
  var showcaseDoc = parser.parseFromString(showcase, "application/xml");
  return showcaseDoc;

};



// 2
var createAlert = function(title, description) {
  var alertString = `<?xml version="1.0" encoding="UTF-8" ?>
    <document>
      <descriptiveAlertTemplate>
        <title>${title}</title>
        <description>${description}</description>
      </descriptiveAlertTemplate>
    </document>`
    var parser = new DOMParser();
    var alertDoc = parser.parseFromString(alertString, "application/xml");
    return alertDoc
}
