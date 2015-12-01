if(typeof flightService === "undefined"){alert("flightService is undefined!");}
if(typeof flightService === "undefined"){alert("flightService is undefined!");}

searchResults = (function(callback){
  var instance = {
    results: [],
    errors: [],
    displayCallBack: callback
  };

  instance.search = function(origin, destination, startDate, endDate, callback) {
    var stayLength = 7;
    instance.displayCallBack = callback;
    unrealDealService.search(origin, destination, startDate, endDate, stayLength, instance.unrealDealDone, instance.unrealDealError);
    flightService.search(origin, destination, startDate, endDate, instance.flightsDone, instance.flightsError);
  }

  instance.unrealDealDone = function(model) {
    instance.results.push(instance.mapUnrealDeal(model));
    instance.redisplay();
  };

  instance.mapUnrealDeal = function(model) {
    return {
      "name": instance.parseDealName(model.deals.packages[0].marker[0].sticker),
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
      instance.results.push(instance.mapFlights(model.offers[offer], model));
    }
    instance.redisplay();
  };

  instance.mapFlights = function(offer, model) {
    return {
      "name": instance.mapOfferName(offer, model),
      "price": offer.totalFare
    };
  }

  instance.mapOfferName = function(offer, model) {
    return instance.getLegByID(offer.legIds[0], model).segments[0].airlineName;
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
