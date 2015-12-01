if(typeof ajax === "undefined"){alert("ajax is undefined!");}
var regionService = (function() {
                     
    var instance = {
        endPoint: "http://terminal2.expedia.com:80/x/suggestions/regions",
        apiKey: "XAAYcpdWrOZCnGyMS5Wmtx06QMG9yWky",
        offerCount: 10
    };
                     
    instance.search = function(done, error) {
        var params = {
        		"query": "2601%3A600%3A8c00%3A4583%3Ad8e9%3A37f8%3Ab574%3Adc63",
                "apikey": instance.apiKey
            };
        ajax.get(instance.endPoint, params, done, error);
    };
                     
    return instance;
})();