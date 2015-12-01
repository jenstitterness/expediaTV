var flightService = (function() {
                     
    var instance = {
        endPoint: "http://terminal2.expedia.com:80/x/mflights/search",
        apiKey: "XAAYcpdWrOZCnGyMS5Wmtx06QMG9yWky",
        offerCount: 10
    };
                     
    instance.search = function(departureAirport, arrivalAirport, departureDate, returnDate, done) {
        var query = instance.endPoint + "?" + $.param({
                "departureDate": departureDate,
                "returnDate": returnDate,
                "departureAirport": departureAirport,
                "arrivalAirport": arrivalAirport,
                "apikey": instance.apiKey,
                "maxOfferCount": instance.offerCount
            }, true);
        $.ajax(query).done(done);
    };
                     
    return instance;
})();