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

//      playVideo();
      
    navigationDocument.pushDocument(showcase);
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

  req.open("GET", "http://localhost:9001/js/destinations.json");

  req.send();
};


var createShowcase = function(feed) {
  var showcase = `<?xml version="1.0" encoding="UTF-8" ?>
    <document>
    <showcaseTemplate>
    <background>
    <img src="http://localhost:9001/images/background.jpg"> </img>
    </background>
   <banner>
      <title style="color:rgb(50, 50, 250)">ExpediaTV</title>
      <row>
      </row>
   </banner>
   <carousel>
      <section>`

    
    for (var i = 0; i < feed.destinations.length; i++) {
        var youtubeURL = feed.destinations[i].youtubeURL;
        
        showcase += `<lockup url="` + youtubeURL + `"><img src="http://img.youtube.com/vi/`+ feed.destinations[i].youtubeId +`/maxresdefault.jpg" />`
        showcase += `<description>`+feed.destinations[i].title+`</description>`
        showcase += `</lockup>`
    }
    
    showcase += `</section>
                    </carousel>
                    </showcaseTemplate></document>
`


  var parser = new DOMParser();
  var showcaseDoc = parser.parseFromString(showcase, "application/xml");
    
    var lockups = showcaseDoc.getElementsByTagName("lockup");
    

    
    for (var j = 0; j < lockups.length; j++) {
        
        lockups.item(j).addEventListener('select', function(evt) {
                                var url = evt.target.getAttribute('url');

                                
                                var player = new Player();
                                
                                player.playlist = new Playlist();
                                
                                var video = new MediaItem('video', url);
                                
                                player.playlist.push(video);
                                player.play();
                                
                                });
    }
    
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
