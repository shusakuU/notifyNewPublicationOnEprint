function scrapingEprint() {
  var targetUrl = "https://eprint.iacr.org/eprint-bin/search.pl?last=1&title=1";
  var html = UrlFetchApp.fetch(targetUrl).getContentText();
  // const doc = Parser.data(html);
  var authors = Parser.data(html).from("<em>").to("</em>").iterate();
  //for(var i=0; i<authors.length; i++){Logger.log(authors[i]);}
  
  var titles = Parser.data(html).from("<b>").to("</b>").iterate();
  //for(var i=0; i<titles.length; i++){Logger.log(titles[i]);}
  
  var scriptProperties = PropertiesService.getScriptProperties();
  var mentionId = scriptProperties.getProperty("slackMentionId");
  sendToSlack("<@"+ mentionId +">\n今日のeprint "+targetUrl)
  var text = ""
  for(var i=0; i<titles.length; i++){
    text = text + "*"+titles[i]+"*\n_"+authors[i]+"_\n\n"
  }
  sendToSlack(text)
}


function sendToSlack(text){
  var scriptProperties = PropertiesService.getScriptProperties();
  var postUrl = scriptProperties.getProperty("slackURL");
  var username = 'Crypto-eprint'; 
  var icon = ':eprint:'; 
  var message = text; 
  
  var jsonData =
  {
     "username" : username,
     "icon_emoji": icon,
     "text" : message
  };
  var payload = JSON.stringify(jsonData);
  
  var options =
  {
    "method" : "post",
    "contentType" : "application/json",
    "payload" : payload
  };
  
  UrlFetchApp.fetch(postUrl, options);
}
