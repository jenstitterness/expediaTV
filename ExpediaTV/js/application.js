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
        <img src="http://localhost:9001/images/background-w.png"> </img>
    </background>
   <banner>
       <img width="350" height="250" style="tv-align:center;tv-position:top" src="http://localhost:9001/images/logo.png" />
   </banner>
   <carousel>
      <section>`

    
    for (var i = 0; i < feed.destinations.length; i++) {

        var youtubeURL = feed.destinations[i].youtubeURL;

        showcase += `<lockup url="` + youtubeURL + `" id="` + feed.destinations[i].youtubeId + `">`
        showcase += `<header><text style="color:rgb(104,104,104);tv-text-style:title3;text-align:center;">`
                +feed.destinations[i].title+`</text></header>`
        showcase += `<img src="http://img.youtube.com/vi/`+ feed.destinations[i].youtubeId +`/maxresdefault.jpg" />`

        
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
                                         var id = evt.target.getAttribute('id');
                                         
                                         var DestinationViewDoc = createDestinationView(id, url);
                                         
                                         navigationDocument.pushDocument(DestinationViewDoc);
                                
                                });
    }
    
  return showcaseDoc;

};

var createDestinationView = function(id, url) {
    
    var mainString = `<?xml version="1.0" encoding="UTF-8" ?>
    <document>
    <mainTemplate>
            <background>
                <img src="http://img.youtube.com/vi/`+ id +`/maxresdefault.jpg"/>
            </background>
            <menuBar>
                <section>
                    <menuItem id="video">
                        <title>Play</title>
                    </menuItem>
                    <menuItem id="flights">
                        <title>Flights</title>
                    </menuItem>
                    <menuItem>
                        <title>Hotels</title>
                    </menuItem>
                    <menuItem id="activities">
                        <title>Activities</title>
                    </menuItem>
                </section>
            </menuBar>
        </mainTemplate>
    </document>`
    var parser = new DOMParser();
    var mainDoc = parser.parseFromString(mainString, "application/xml");
    
    var videoMenuItem = mainDoc.getElementById("video");
    videoMenuItem.addEventListener('select', function(evt) {
        startVideo(url);
    });
    var flightsMenuItem = mainDoc.getElementById("flights");
    flightsMenuItem.addEventListener('select', function(evt) {

        var timeframeSelectionViewDoc = createTimeframeSelectionView(id, url);
        navigationDocument.pushDocument(timeframeSelectionViewDoc);
    });
    
    var activitiesMenuItem = mainDoc.getElementById("activities");
    activitiesMenuItem.addEventListener('select', function(evt) {
                                        
        var activitiesViewDoc = createActivitiesView(id);
        navigationDocument.pushDocument(activitiesViewDoc);
    });
    
    return mainDoc;
}

var createActivitiesView = function(id) {
    
    var mainString = `<?xml version="1.0" encoding="UTF-8" ?>
    <document>
    <listTemplate>
        <banner>
            <title>Activities</title>
        </banner>
        <list>
            <section>
                <listItemLockup>
                    <title>Item 1</title>
                    <relatedContent>
                        <lockup>
                            <img src="" width="857" height="482" />
                            <title>Activity 1</title>
                            <description>A brief description for the first activity should go here.</description>
                        </lockup>
                    </relatedContent>
                </listItemLockup>
            </section>
        </list>
    </listTemplate>
    </document>`
    var parser = new DOMParser();
    var mainDoc = parser.parseFromString(mainString, "application/xml");
    
    return mainDoc;
}

var startVideo = function(url) {
    
    var player = new Player();
    
    player.playlist = new Playlist();
    
    var video = new MediaItem('video', url);
    
    player.playlist.push(video);
    player.play();
}

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

var createTimeframeSelectionView = function(id, url) {
    
    var mainString = `<?xml version="1.0" encoding="UTF-8" ?>
    <document>
        <paradeTemplate>
            <list>
                <header>
                    <title>When would you like to go?</title>
                </header>
                <section>
                    <listItemLockup>
                        <title>Next week</title>
                    </listItemLockup>
                    <listItemLockup>
                        <title>Next month</title>
                    </listItemLockup>
                    <listItemLockup>
                        <title>Next six months</title>
                    </listItemLockup>
                </section>
                <relatedContent>
                    <imgDeck>
                        <img src="http://img.youtube.com/vi/`+ id +`/maxresdefault.jpg"/>
                        <img src="http://img.youtube.com/vi/`+ id +`/maxresdefault.jpg"/>
                        <img src="http://img.youtube.com/vi/`+ id +`/maxresdefault.jpg"/>
                    </imgDeck>
                </relatedContent>
            </list>
        </paradeTemplate>
    </document>`

    var parser = new DOMParser();
    var mainDoc = parser.parseFromString(mainString, "application/xml");
    
    var listItems = mainDoc.getElementsByTagName("listItemLockup");
    listItems.item(0).addEventListener('select', function(evt) {
        // next week
    });
    listItems.item(1).addEventListener('select', function(evt) {
        // next month
    });
    listItems.item(1).addEventListener('select', function(evt) {
        // next six months
    });
    
    return mainDoc;
}
 

