var ajax = (function() {
    var instance = {};
    instance.get = function(endPoint, params, done, error) {
        var query = endPoint + instance.param(params);
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