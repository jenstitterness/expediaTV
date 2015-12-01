var _API_KEY = "XAAYcpdWrOZCnGyMS5Wmtx06QMG9yWky";

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
//      data = JSON.parse(req.responseText);
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

        showcase += `<lockup url="` + youtubeURL + `" id="` + feed.destinations[i].youtubeId + `" airportCode="` + feed.destinations[i].airportCode + `" cityName="` + feed.destinations[i].title + `">`
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
                                         var airportCode = evt.target.getAttribute('airportCode');
                                         var cityName = evt.target.getAttribute('cityName');
                                         
                                         var DestinationViewDoc = createDestinationView(id, cityName, url, airportCode);
                                         
                                         navigationDocument.pushDocument(DestinationViewDoc);
                                
                                });
    }
    
  return showcaseDoc;

};

var createDestinationView = function(id, cityName, url, airportCode) {
    
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
                    <menuItem id="hotels">
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
    
    var hotelsMenuItem = mainDoc.getElementById("hotels");
    hotelsMenuItem.addEventListener('select', function(evt) {
                                     
        var hotelsComingSoonDoc = createAlert("Coming Soon", "");
        navigationDocument.pushDocument(hotelsComingSoonDoc);
    });
    
    var activitiesMenuItem = mainDoc.getElementById("activities");
    activitiesMenuItem.addEventListener('select', function(evt) {
        
        loadActivites(airportCode, function(jsonResponse) {
                      var activitiesViewDoc = createActivitiesView(id, cityName, jsonResponse);
                      navigationDocument.pushDocument(activitiesViewDoc);
        });
                                        
    });
    
    return mainDoc;
}

var createActivitiesView = function(id, cityName, jsonResponse) {
    
    var mainString = `<?xml version="1.0" encoding="UTF-8" ?><document><listTemplate><banner>`
    mainString += `<title>` + cityName + ` Activities</title>`
    mainString += `</banner><list><section>`
    
    for (var i = 0; i < jsonResponse.activities.length; i++) {
        
        var activity = jsonResponse.activities[i];
        var imageUrl = 'http:' + activity.imageUrl.split('//')[1];
        
        mainString += `<listItemLockup><title>`+activity.title+`</title>`
        mainString += `<relatedContent><lockup><img src="`+imageUrl+`"/>`
        mainString += `<description>`+activity.title+ `<br/><br/>From `+activity.fromPrice+` `+activity.fromPriceLabel+`</description>`
        mainString += `</lockup></relatedContent></listItemLockup>`
    }
    
    mainString += `</section></list></listTemplate></document>`
    
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
        <title style="color:rgb(0,0,0)">${title}</title>
        <description>${description}</description>
      </descriptiveAlertTemplate>
    </document>`
    var parser = new DOMParser();
    var alertDoc = parser.parseFromString(alertString, "application/xml");
    return alertDoc;
}

var createTimeframeSelectionView = function(id, url) {
    
    var mainString = `<?xml version="1.0" encoding="UTF-8" ?>
    <document>
        <paradeTemplate>
    <background>
    <img src="http://img.youtube.com/vi/`+ id +`/maxresdefault.jpg"> </img>
    </background>

            <list>
                <header>
                    <title>When do you want to go?</title>
                </header>
                <section>
                    <listItemLockup>
                        <title>Next week</title>
                    </listItemLockup>
                    <listItemLockup>
                        <title>Next month</title>
                    </listItemLockup>
                    <listItemLockup>
                        <title>In six months</title>
                    </listItemLockup>
                </section>
                <relatedContent>
                </relatedContent>
            </list>
        </paradeTemplate>
    </document>`

    var parser = new DOMParser();
    var mainDoc = parser.parseFromString(mainString, "application/xml");
    
    var listItems = mainDoc.getElementsByTagName("listItemLockup");
    listItems.item(0).addEventListener('select', function(evt) {
        var selectionDoc = createAlert("Next Week Selected", "");
        navigationDocument.pushDocument(selectionDoc);

    });
    listItems.item(1).addEventListener('select', function(evt) {
        var selectionDoc = createAlert("Next Month Selected", "");
        navigationDocument.pushDocument(selectionDoc);
    });
    listItems.item(2).addEventListener('select', function(evt) {
        var selectionDoc = createAlert("In Six Months Selected", "");
        navigationDocument.pushDocument(selectionDoc);

    });
    
    return mainDoc;
}

var xmlEscape = function(str) {
    return str.replace(/&/g, "&amp;");
    
//    return str_replace(array('&', '<', '>', '\'', '"'), array('&amp;', '&lt;', '&gt;', '&apos;', '&quot;'), $string);
}

var loadActivites = function(location, callback) {
    var req = new XMLHttpRequest();
    req.responseType = "application/json";
    req.onerror = function() {
        var alert = createAlert("ERROR", ""); //leaving 2nd parameter with an empty string
        navigationDocument.presentModal(alert);
    };
    
    req.onload = function() {
        
        var res = JSON.parse(xmlEscape(req.responseText));
        
        if (callback) {
            callback(res);
        }
    };
    
    req.onreadystatechange = function() {
        var status;
        var data;

        if (req.readyState == 4) { //request finished and response is ready
            status = req.status;
            if (status == 200) {
                
            } else {
                // handle the error
            }
        }
    };
    
    req.open("GET", "http://terminal2.expedia.com:80/x/activities/search?location="+location);
    req.setRequestHeader("Authorization", "expedia-apikey key="+_API_KEY);
    req.send();

}
