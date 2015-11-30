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

    navigationDocument.presentModal(showcase);
  };

  req.onreadystatechange = function() {
  var status;
  var data;
  if (req.readyState == 4) { //request finished and response is ready
    status = req.status;
    // var alert = createAlert(status, status); //leaving 2nd parameter with an empty string
    // navigationDocument.presentModal(alert);
    if (status == 200) {
      data = JSON.parse(req.responseText);
      // pass the data to a handler
      //
      // var alert = createAlert(data.data[0].user.full_name, data); //leaving 2nd parameter with an empty string
      // navigationDocument.presentModal(alert);

    } else {
      // handle the error
    }
  }
};

  req.open("GET", "http://localhost:9001/js/feed.json");

  req.send();
};


var createShowcase = function(feed) {
  var showcase = `<?xml version="1.0" encoding="UTF-8" ?>
    <document>
    <showcaseTemplate>
   <banner>
      <title>Expedia</title>
      <row>
         <button>…</button>
      </row>
   </banner>
   <carousel>
      <section>`


      for(var i = 0; i < feed.data.length; i++) {
        showcase += `<lockup><img src="`+ feed.data[i].images.standard_resolution.url+`" />`

         if (feed.data[i].location) {
          showcase += `<description>`+feed.data[i].caption.text+`</description>`
         }

                    showcase += `</lockup>`
      }

    showcase += `</section>
                    </carousel>
                    </showcaseTemplate></document>
`


  var parser = new DOMParser();
  var showcaseDoc = parser.parseFromString(showcase, "application/xml");
  return showcaseDoc;

};



// 2
var createAlert = function(title, description) {
  var alertString = `<?xml version="1.0" encoding="UTF-8" ?>
    <document>
      <descriptiveAlertTemplate>
        <title>${title}</title>
        <description>${description}</description>
      </descriptiveAlertTemplate>
    </document>`
    var parser = new DOMParser();
    var alertDoc = parser.parseFromString(alertString, "application/xml");
    return alertDoc
}
