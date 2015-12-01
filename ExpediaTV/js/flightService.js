if(typeof ajax === "undefined"){alert("ajax is undefined!");}
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