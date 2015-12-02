var _API_KEY = "XAAYcpdWrOZCnGyMS5Wmtx06QMG9yWky";
var ORIGIN_TLA = "SEA";

App.onLaunch = function(options) {
    
  regionService.getOriginTLA(saveTLA, reportError);
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
        if(airportCode === ORIGIN_TLA){
            var alert = createAlert("You're already here, silly!", ""); //leaving 2nd parameter with an empty string
            navigationDocument.presentModal(alert);
        }
        var timeframeSelectionViewDoc = createTimeframeSelectionView(id, url, airportCode);
        navigationDocument.pushDocument(timeframeSelectionViewDoc);
    });
    
    var hotelsMenuItem = mainDoc.getElementById("hotels");
    hotelsMenuItem.addEventListener('select', function(evt) {
            getLatLong(cityName, function(latlong) {
                       getHotelSearch(latlong, function(hotelSearch) {
                                      var hotelsViewDoc = createHotelsView(id, cityName, hotelSearch);
                                      navigationDocument.pushDocument(hotelsViewDoc);
                                      //populateHotelPhotos(hotelsViewDoc);
                                      });
                       });
                                    
                                    
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
    mainString += `<title style="tv-text-style:title1;color:#4f4f4f;">` + cityName + ` Activities</title>`
    mainString += `</banner><list><section>`
    
    for (var i = 0; i < jsonResponse.activities.length; i++) {
        
        var activity = jsonResponse.activities[i];
        var imageUrl = 'http:' + activity.imageUrl.split('//')[1];
        var recScore = activity.recommendationScore/100;
        
        mainString += `<listItemLockup><title style="color:#1f1f1f;">`+activity.title+`</title>`
        mainString += `<relatedContent><lockup><img src="`+imageUrl+`"/>`
        mainString += `<ratingCard style="height:100;margin:20;">
            <title style="tv-align:center;tv-position:top">Recommendation Score</title>
            <ratingBadge style="tv-rating-style:star-l;tv-align:center;tv-position:bottom;" value="`+recScore+`"></ratingBadge>
            </ratingCard>`
        mainString += `<row style="tv-align:center;tv-position:bottom;margin:50;"><buttonLockup style="width:500;">
        <text style="font-size:30px;">From `+activity.fromPrice+` `+activity.fromPriceLabel+`</text>
            </buttonLockup></row>`
        mainString += `</lockup></relatedContent></listItemLockup>`
    }
    
    mainString += `</section></list></listTemplate></document>`
    
    var parser = new DOMParser();
    var mainDoc = parser.parseFromString(mainString, "application/xml");
    
    return mainDoc;
}

var createHotelsView = function(id, cityName, hotelSearch) {
    
    var mainString = `<?xml version="1.0" encoding="UTF-8" ?><document><listTemplate><banner>`
    mainString += `<title style="tv-text-style:title1;color:#4f4f4f;">` + cityName + ` Hotels</title>`
    mainString += `</banner><list><section>`
    
    for (var i = 0; i < hotelSearch.HotelInfoList.HotelInfo.length; i++) {
        
        var hotelInfo = hotelSearch.HotelInfoList.HotelInfo[i];
        var starRatingValue = hotelInfo.StarRating/5;
        var guestRatingValue = hotelInfo.GuestRating/5;
        
mainString += `<listItemLockup><title style="color:#1f1f1f;"><badge style="height:50;width:50;" src="`+hotelInfo.ThumbnailUrl+`"/> `+hotelInfo.Name+`</title>`
         mainString += `<relatedContent height="500"><lockup>`
        mainString += `<title style="tv-align:center;">`+hotelInfo.Name+`</title>`
        
mainString += `<description allowsZooming="true" moreLabel="more">`+hotelInfo.Description+`</description>`        
        
        mainString += `<ratingCard style="background-color:rgb(104,104,104);height:100;margin:20;" background-color="rgb(104,104,104)">
        <title style="tv-align:center;tv-position:top">Guest Rating</title>
        <ratingBadge style="tv-rating-style:star-l;tv-align:center;tv-position:bottom" value="`+guestRatingValue+`"></ratingBadge>
         </ratingCard>`
        
        mainString += `<ratingCard style="background-color:rgb(104,104,104);height:100;margin:20;">
        <title style="tv-align:center;tv-position:top">Star Rating</title>
        <ratingBadge style="tv-rating-style:star-m;tv-align:center;tv-position:bottom" value="`+starRatingValue+`"></ratingBadge>
        </ratingCard>`
        
        mainString += `<row style="tv-align:center;tv-position:bottom;margin:50;"><buttonLockup style="width:500;">
        <text style="font-size:30px;">From $`+hotelInfo.FeaturedOffer.Price.TotalRate.Value+` for a `+hotelInfo.FeaturedOffer.LengthOfStay+` day stay!</text>
            </buttonLockup></row>`
        mainString += `</lockup></relatedContent></listItemLockup>`
        
    }
    
    mainString += `</section></list></listTemplate></document>`
    
    var parser = new DOMParser();
    var mainDoc = parser.parseFromString(mainString, "application/xml");
    
    return mainDoc;
}


var getHotelPhoto = function(item, callback) { //hotelInfo.DetailsUrl
    var req = new XMLHttpRequest();
    req.onerror = function() {
        var alert = createAlert("ERROR", ""); //leaving 2nd parameter with an empty string
        navigationDocument.presentModal(alert);
    };
    
    req.onload = function() {
        
        var photos = req.responseText.match(/\/\/images\.trvl.*aria-hidden/g);
        for (var i = 0; i < photos.length; i++) {
            if (photos[i].indexOf('Featured Image') > -1) {
                var photo = "http:" + photos[i].match(/\/\/images\.trvl.*\.jpg/g);
                if (callback)
                    callback(item, photo);
            }
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
    
    req.open("GET", item.getAttribute('url'));
    req.send();
    
}

var populateHotelPhotos = function(hotelsViewDoc) {
    var images = hotelsViewDoc.getElementsByTagName('img');
    for(var i = 0; i < images.length; i++) {
        getHotelPhoto(images.item(i), function(item, photo) {
                       item.setAttribute('src', photo);
        });
    }
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

// 3
var createAvailableFlightsView = function(departureDate, returnDate, timeframe, data, destTla) {
    console.log(data);
    var mainString = `<?xml version="1.0" encoding="UTF-8" ?>
    <document>
        <listTemplate>
                <banner>
                    <title style="color:#4f4f4f;">Flights from ${ORIGIN_TLA} to ${destTla} ${timeframe}</title>
                </banner>
                <list>
                <section>`
                    for(var i=0; i<data.length; i++) {
                        mainString += `<listItemLockup>
                            <title style="color:#1f1f1f;tv-align:left;tv-position:center;">
                                <badge style="height:50;width:50;" src="${data[i].logo}" /> ${data[i].name} - ${data[i].departTime}</title>
                            <relatedContent style="margin: 200px;">
                            <lockup>
                                    <text style="font-weight: bold; font-size: 40px; color:#6b6b6b;">Timeframe:</text>
                                    <description style="color:#6b6b6b;">${data[i].departDate} (${data[i].departTime}) –– ${data[i].arriveDate} (${data[i].arriveTime})</description>
                                    <text style="font-weight: bold; font-size: 40px; color:#6b6b6b;">Airline:</text>
                                    <description style="color:#6b6b6b;">${data[i].name}</description>
                                    <text style="font-weight: bold; font-size: 40px; color:#6b6b6b;">Departure Flight:</text>
                                    <description style="color:#6b6b6b;">${data[i].departFlightNumber}</description>
                                    <text style="font-weight: bold; font-size: 40px; color:#6b6b6b;">Return Flight:</text>
                                    <description style="color:#6b6b6b;">${data[i].returnFlightNumber}</description>
                                    <text style="font-weight: bold; font-size: 40px; color:#6b6b6b;">Duration:</text>
                                    <description style="color:#6b6b6b;">${data[i].duration}</description>
                                    <row style="tv-align:center;tv-position:bottom;margin:50;">
                                        <buttonLockup style="width:300;">
                                            <text style="font-size:30px;">From $${data[i].price}</text>
                                        </buttonLockup>
                                    </row>
                                </lockup>
                            </relatedContent>
                        </listItemLockup>`
                    }
    mainString += `</section>
            </list>
        </listTemplate>
    </document>`
    
    var parser = new DOMParser();
    var mainDoc = parser.parseFromString(mainString, "application/xml");
    return mainDoc;
}

var loadLoadingView = function() {
    var mainString = `<?xml version="1.0" encoding="UTF-8" ?>
    <document>
    <loadingTemplate>
    <activityIndicator>
    <title>Finding the best fares</title>
    </activityIndicator>
    </loadingTemplate>
    </document>`
    
    var parser = new DOMParser();
    var mainDoc = parser.parseFromString(mainString, "application/xml");
    navigationDocument.presentModal(mainDoc);
}

var createTimeframeSelectionView = function(id, url, destTla) {
    
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
       loadLoadingView();
        var departureDate = getDepartureDate(7);
        var returnDate = getReturnDate(departureDate);
        
        searchResults.search(ORIGIN_TLA, destTla, departureDate, returnDate, function(evt) {
            var selectionDoc = createAvailableFlightsView(departureDate, returnDate, "for Next Week", evt, destTla);
             navigationDocument.dismissModal(); // remove load view
            navigationDocument.pushDocument(selectionDoc);
        }, function(err) {
            createAlert("ERROR", "Flights were not retrieved. Maybe try again, eh?");
        });
    });
    
    listItems.item(1).addEventListener('select', function(evt) {
       loadLoadingView();
        var departureDate = getDepartureDate(31);
        var returnDate = getReturnDate(departureDate);
                                       
        searchResults.search(ORIGIN_TLA, destTla, departureDate, returnDate, function(evt) {
            var selectionDoc = createAvailableFlightsView(departureDate, returnDate, "for Next Month", evt, destTla);
             navigationDocument.dismissModal(); // remove load view
            navigationDocument.pushDocument(selectionDoc);
        }, function(err) {
            createAlert("ERROR", "Flights were not retrieved. Maybe try again, eh?");
        });
    });
    
    listItems.item(2).addEventListener('select', function(evt) {
       loadLoadingView();
        var departureDate = getDepartureDate(186);
        var returnDate = getReturnDate(departureDate);
                                       
        searchResults.search(ORIGIN_TLA, destTla, departureDate, returnDate, function(evt) {
            var selectionDoc = createAvailableFlightsView(departureDate, returnDate, "in Six Months", evt, destTla);
            navigationDocument.dismissModal(); // remove load view
            navigationDocument.pushDocument(selectionDoc);
        }, function(err) {
            createAlert("ERROR", "Flights were not retrieved. Maybe try again, eh?");
        });
    });
    
    return mainDoc;
}

var getDepartureDate = function(numberOfDays) {
    var newDate = new Date();
    newDate.setDate(newDate.getDate() + numberOfDays);
    return newDate;
}

var getReturnDate = function(departureDate) {
    var newDate = new Date(departureDate);
    newDate.setDate(newDate.getDate() + 6);
    return newDate;
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


var getLatLong = function(location, callback) {
    var req = new XMLHttpRequest();
    req.responseType = "application/json";
    req.onerror = function() {
        var alert = createAlert("ERROR", ""); //leaving 2nd parameter with an empty string
        navigationDocument.presentModal(alert);
    };
    
    req.onload = function() {
        
        var res = JSON.parse(xmlEscape(req.responseText));
        
        if (callback) {
            callback(res.sr[0].ll);
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
    
    req.open("GET", "http://terminal2.expedia.com/x/suggestions/regions?query=" + location.replace(/ /g, "%20"));
    req.setRequestHeader("Authorization", "expedia-apikey key="+_API_KEY);
    req.send();
    
}

var getHotelSearch = function(latlong, callback) {
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
    
    req.open("GET", "http://terminal2.expedia.com:80/x/hotels?maxhotels=20&radius=5km&location="+ latlong.lat +"%2C"+latlong.lng);
    req.setRequestHeader("Authorization", "expedia-apikey key="+_API_KEY);
    req.send();
}


var ajax = (function() {
    var instance = {};
    instance.get = function(endPoint, params, done, error) {
        var query = endPoint + instance.param(params);
        var request = new XMLHttpRequest();
        request.open("GET", query);
        request.responseType = "application/json";
        request.onreadystatechange = function() {
            if(request.readyState == 4) {
                if(request.status === 200) {
                    var data;
                    if(!request.responseType || request.responseType === "text") {
                        data = JSON.parse(request.responseText);
                    } else if (request.responseType === "document"){
                        data = request.responseXML;
                    } else {
                        data = request.response;
                    }
                    done(data);
                } else {
                    error(request.statusText);
                }
            }
        }
        request.send();
    };
    
    instance.param = function(params) {
        var results = "";
        for(var key in params) {
            if(params.hasOwnProperty(key)){
                if(results.length == 0) {
                    results += "?"
                } else {
                    results += "&";
                }
                results += key + "=" + params[key];
            }
        }
        return results;
    }
                     
    return instance;
})();

var unrealDealService = (function() {

    var instance = {
        endPoint: "http://terminal2.expedia.com:80/x/deals/packages",
        apiKey: "XAAYcpdWrOZCnGyMS5Wmtx06QMG9yWky",
        roomCount: 1,
        adultCount: 1,
        childCount: 0,
        infantCount: 0,
        allowDuplicates: false,
        limit: 1
    };
                     
    instance.search = function(originTLA, destinationTLA, startDate, endDate, stayLength, done, error) {
        var params = {
                "startDate": instance.getISODateString(startDate),
                "endDate": instance.getISODateString(endDate),
                "originTLA": originTLA,
                "destinationTLA": destinationTLA,
                "limit": instance.limit,
                "lengthOfStay": stayLength,
                "roomCount": instance.roomCount,
                "adultCount": instance.adultCount,
                "childCount": instance.childCount,
                "infantCount": instance.infantCount,
                "allowDuplicates": instance.allowDuplicates,
                "apikey": instance.apiKey
            };
        ajax.get(instance.endPoint, params, done, error);
    };

    instance.getISODateString = function(date) {
        var outDate = date;
        if(!(date instanceof Date)) {
            outDate = new Date(date);
        }
        return outDate.toISOString().split("T")[0];
    }
                     
    return instance;
})();

var flightService = (function() {
                     
    var instance = {
        endPoint: "http://terminal2.expedia.com:80/x/mflights/search",
        apiKey: "XAAYcpdWrOZCnGyMS5Wmtx06QMG9yWky",
        offerCount: 10
    };
                     
    instance.search = function(departureAirport, arrivalAirport, departureDate, returnDate, done, error) {
        var params = {
                "departureDate": instance.getISODateString(departureDate),
                "returnDate": instance.getISODateString(returnDate),
                "departureAirport": departureAirport,
                "arrivalAirport": arrivalAirport,
                "apikey": instance.apiKey,
                "maxOfferCount": instance.offerCount
            };
        ajax.get(instance.endPoint, params, done, error);
    };

    instance.getISODateString = function(date) {
        var outDate = date;
        if(!(date instanceof Date)) {
            outDate = new Date(date);
        }
        return outDate.toISOString().split("T")[0];
    }
                     
    return instance;
})();

searchResults = (function(callback){
  var instance = {
    results: [],
    errors: [],
    displayCallBack: callback
  };

  instance.search = function(origin, destination, startDate, endDate, callback) {
    var stayLength = 7;
    instance.displayCallBack = callback;
    instance.results = [];
    instance.errors = [];
    flightService.search(origin, destination, startDate, endDate, instance.flightsDone, instance.flightsError);
  }

  instance.unrealDealDone = function(model) {
    var unrealDeal = instance.mapUnrealDeal(model);
    if(typeof unrealDeal !== "undefined") {
      instance.results.push(unrealDeal);
      instance.redisplay();
    }
  };

  instance.mapUnrealDeal = function(model) {
    if(model.deals.packages.length>0) {
      return {
        "name": instance.parseDealName(model.deals.packages[0].marker[0].sticker),
        "price": model.deals.packages[0].totalPackagePrice
      };
    }
    return undefined;
  };

  instance.parseDealName = function(sticker) {
    return "Package " + sticker.replace(/[pP][kK][gG]/, "").split(/(?=[A-Z])/).join(" ");
  }

  instance.unrealDealError = function(error) {
    instance.errors.push(error);
    instance.redisplay();
  };

  instance.flightsDone = function(model) {
    for(var offer in model.offers) {
      instance.results.push(instance.mapFlights(model.offers[offer], model));
    }
    instance.redisplay();
  };

  instance.mapFlights = function(offer, model) {
    var legs = instance.getLegs(offer, model);
    return {
      "name": legs[0].segments[0].airlineName,
      "price": offer.totalFare,
      "duration": instance.calcDuration(legs),
      "stops": instance.calcStops(legs),
      "departDate": instance.getPrettyDate(legs[0].segments[0].departureTimeRaw),
      "departTime": instance.getPrettyTime(legs[0].segments[0].departureTimeRaw),
      "arriveDate": instance.getPrettyDate(legs[0].segments[legs[0].segments.length-1].arrivalTimeRaw),
      "arriveTime": instance.getPrettyTime(legs[0].segments[legs[0].segments.length-1].arrivalTimeRaw),
      "logo": instance.getIconURL(legs[0].segments[0].airlineCode),
      "departFlightNumber": legs[0].segments[0].flightNumber,
      "returnFlightNumber": legs[legs.length-1].segments[legs[legs.length-1].segments.length-1].flightNumber
    };
  }

  instance.getIconURL = function(airlineCode) {
    return "http://images.trvl-media.com/media/content/expus/graphics/static_content/fusion/v0.1b/images/airlines/s/" + airlineCode + "_sq.jpg"
  }

  instance.getPrettyDate = function(date) {
    var d = new Date(date);
    return  (d.getMonth() + 1 < 10 ? "0" : "") + (d.getMonth() + 1) + "/" + (d.getDate() < 10 ? "0" : "") + d.getDate() + "/" + d.getFullYear();
  }

  instance.getPrettyTime = function(time) {
    var d = new Date(time);
    var hour = d.getHours()+1;
    if(hour > 12) {
      hour -= 12;
    }
    return hour + ":" + (d.getMinutes() < 10 ? "0" : "") + d.getMinutes() + " " + (d.getHours() + 1 > 11 ? "PM" : "AM");
  }

  instance.calcStops = function(legs) {
    var stops = 0;
    for(var leg in legs) {
      for(var segment in legs[leg].segments) {
        stops += legs[leg].segments[segment].stops;
      }
    }
    return stops;
  }

  instance.calcDuration = function(legs) {
    var minutes = 0;
    for(var leg in legs) {
      for(var segment in legs[leg].segments) {
        minutes += instance.parseDuration(legs[leg].segments[segment].duration);
      }
    }
    var res = "";
    if(minutes > 60) {
      res += Math.floor(minutes/60) + " hours ";
    }
    if(minutes % 60) {
      res += (minutes % 60) + " minutes";
    }
    return res;
  }

  instance.parseDuration = function(duration) {
    var res = 0;
    var days = duration.match(/(\d+)\s*D/);
    var hours = duration.match(/(\d+)\s*H/);
    var minutes = duration.match(/(\d+)\s*M/);
    if (days) { res += parseInt(days[1])*1440;}
    if (hours) { res += parseInt(hours[1])*60;}
    if (minutes) { res += parseInt(minutes[1]);}
    return res;
  }
  
  instance.splitDuration = function(duration) {
    var chars = duration.split('')
  }

  instance.getLegs = function(offer, model) {
    var legs = [];
    for(var legId in offer.legIds) {
      legs.push(instance.getLegByID(offer.legIds[legId], model));
    }
    return legs;
  }

  instance.getLegByID = function(legId, model) {
    for(var leg in model.legs) {
      if(model.legs[leg].legId == legId) {
        return model.legs[leg];
      }
    }
    return model.legs[0];
  }

  instance.flightsError = function(error) {
    instance.errors.push(error);
    instance.redisplay();
  };

  instance.redisplay = function() {
    instance.displayCallBack(instance.results, instance.error);
  }

  return instance;
})();

var regionService = (function() {
                     
    var instance = {
        endPoint: "http://terminal2.expedia.com:80/x/suggestions/regions",
        apiKey: "XAAYcpdWrOZCnGyMS5Wmtx06QMG9yWky",
        offerCount: 10
    };
                     
    instance.search = function(query, done, error) {
        var params = {
            "query": query,
                "apikey": instance.apiKey
            };
        ajax.get(instance.endPoint, params, done, error);
    };

    instance.getOriginTLA = function(done, error) {
      ipService.search(
        function(model) {
            regionService.search(encodeURI(model.city + ", " + model.region), function(model) {done(model.sr[0].a);}, function(errorMsg) {error(errorMsg);})
        },
        function(errorMsg) {
            error(errorMsg);
        });
    }
                     
    return instance;
})();

var ipService = (function() {
                     
    var instance = {
        endPoint: "http://ipinfo.io/json"
    };
                     
    instance.search = function(done, error) {
        var params = {};
        ajax.get(instance.endPoint, params, done, error);
    };
                     
    return instance;
})();

var saveTLA = function(tla) {
  ORIGIN_TLA = tla;
}

var reportError = function(errorMsg) {
  var alert = createAlert(errorMsg, ""); 
  navigationDocument.presentModal(alert);
}
