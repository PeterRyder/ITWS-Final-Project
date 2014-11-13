var auth = {
  //
  // Update with your auth tokens.
  //
  consumerKey: "6bYY1U8dhgFt17noBW5NXQ",
  consumerSecret: "LXEV5iVj-Azb12ub7G8kaFWpK5Q",
  accessToken: "tX6UzxaDaewFyriSB902mFFs4EDUF6Lx",
  // This example is a proof of concept, for how to use the Yelp v2 API with javascript.
  // You wouldn't actually want to expose your access token secret like this in a real application.
  accessTokenSecret: "YpjvnyGiU5JRb6RaPrl0LmmVTjg",
  serviceProvider: {
    signatureMethod: "HMAC-SHA1"
  }
};

var accessor = {
  consumerSecret: auth.consumerSecret,
  tokenSecret: auth.accessTokenSecret
};

parameters = [];
parameters.push(['callback', 'cb']);
parameters.push(['oauth_consumer_key', auth.consumerKey]);
parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
parameters.push(['oauth_token', auth.accessToken]);
parameters.push(['oauth_signature_method', 'HMAC-SHA1']);
var message = {
  'action': 'http://api.yelp.com/v2/search?term=restaurants&location=Troy+NY&limit=10',
  'method': 'GET',
  'parameters': parameters
};

OAuth.setTimestampAndNonce(message);
OAuth.SignatureMethod.sign(message, accessor);
var parameterMap = OAuth.getParameterMap(message.parameters);
parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature);

$.ajax({
  'url': message.action,
  'data': parameterMap,
  'cache': true,
  'dataType': 'jsonp',
  'jsonpCallback': 'cb',
  'success': function (data, textStats, XMLHttpRequest) {

    var return_data = "<ul>";

    var businesses = data["businesses"];

    for (var i in businesses) {
      var business = businesses[i];

      return_data += "<li>" + "<div class='listings'>" + "<span class='text'>" + '<a target="_blank" href="' + business["url"] + '">' + business["name"] + '</a>' + "</span>" + "<span class='rating'>" + " Rating: " + '<img src="' + business["rating_img_url"] + '"' + "</span>" + "</div>" + "</li>";
    }

    return_data += "</ul>"

    $("#restaurants").html(return_data);

  }
});