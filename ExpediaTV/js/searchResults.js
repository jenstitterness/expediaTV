App.onLaunch = function(options, displayCallBack) {
  var origin = "sea";
  var destination = "lax";
  var startDate = new Date("2016-01-01");
  var endDate = new Date("2016-01-07");
  var stayLength = 7;
  var results = searchResults()
    unrealDealService.search(origin, destination, startDate, endDate, stayLength, results.unrealDealDone, results.unrealDealError);
    flightsService.search(origin, destination, startDate, endDate, results.flightsDone, results.flightsError);
};

searchResults = (function(callback){
  var instance = {
    results: [],
    errors: [],
    displayCallBack: callback
  };

  instance.unrealDealDone = function(model) {
    instance.results.push(instance.mapUnrealDeal(model));
    instance.redisplay();
  };

  instance.mapUnrealDeal = function(model) {
    return {
      "name": parseDealName(model.deals.packages[0].marker[0].sticker),
      "price": model.deals.packages[0].totalPackagePrice
    };
  };

  instance.parseDealName = function(sticker) {
    return sticker.replace(/pkg/, "").split(/(?=[A-Z])/).join(" ");
  }

  instance.unrealDealError = function(error) {
    instance.errors.push(error);
    instance.redisplay();
  };

  instance.flightsDone = function(model) {
    for(var offer in model.offers) {
      instance.results.push(offer);
    }
    instance.redisplay();
  };

  instance.mapFlights = function(offer, model) {
    return {
      "name": instance.mapOfferName(offer, model),
      "price": offer.totalFarePrice
    };
  }

  instance.mapOfferName = function(offer, model) {
    var name = "";
    for(var legId in offer.legIds) {
      if(name.length > 0) {name += " & "}
      name += model.legs[legId].segments[0].AirlineName;
    }
    return name;
  }

  instance.getLegByID = function(legId, model) {
    for(var leg in model.legs) {
      if(leg.legId == legId) {
        return leg;
      }
    }
    return model.legs[0];
  }

  instance.flightsError = function(error) {
    instance.errors.push(error);
    instance.redisplay();
  };

  instance.redisplay = function() {
    callback(instance.results, instance.error);
  }

  return instance;
});
