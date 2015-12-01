var flightService = (function() {
                     
    var instance = {
        endPoint: "http://terminal2.expedia.com:80/x/mflights/search",
        apiKey: "XAAYcpdWrOZCnGyMS5Wmtx06QMG9yWky",
        offerCount: 10
    };
                     
    instance.search = function(departureAirport, arrivalAirport, departureDate, returnDate, done, error) {
        var query = instance.endPoint + instance.param({
                "departureDate": departureDate,
                "returnDate": returnDate,
                "departureAirport": departureAirport,
                "arrivalAirport": arrivalAirport,
                "apikey": instance.apiKey,
                "maxOfferCount": instance.offerCount
            }, true);
        var request = new XMLHttpRequest();
        request.open("GET", query);
        request.onreadystatechange = function() {
            if(request.readyState == XMLHttpRequest.DONE) {
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