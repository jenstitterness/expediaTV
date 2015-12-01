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