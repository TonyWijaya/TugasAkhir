// ==UserScript==
// @name TugasAkhir
// @include http://*.facebook.com/
// @include https://*.facebook.com/
// ==/UserScript==

/* Facebook ID and Class Variable */
var newsFeedParentID = "stream_pagelet";
var newsFeedID = "topnews_main_stream_";
var postClass = "_4-u2 mbm _4mrt _5v3q _4-u8";
var contentClass = "_5pbx userContent";
var serverURL = "https://tugasakhir-13512018.herokuapp.com/";
//var serverURL = "http://localhost:5000/";

/* Creating Observer */
var observer = new MutationObserver(function(mutations) {
 mutations.forEach(function(mutation) {
  /* Look for Adding Node Mutation */
    for (var i = 0; i < mutation.addedNodes.length; i++) {
      var node = mutation.addedNodes[i];
      kango.console.log("Node: " + node.getAttribute("class"));
      if (node.getAttribute("class") == postClass) { // searching for postClass in Node
        var content = node.getElementsByClassName(contentClass)[0]; // searching content in addedNode
        if (content != null) { // if content exists
          kango.console.log("Content: " + content.textContent);
          doSentimentAnalysis(content.textContent,function(result) {
            node.style.backgroundColor = result;
          });
        }
      }
    }
  })
});


/* Get complete newsFeedID */
var newsFeedParent = document.getElementById(newsFeedParentID);
var child = newsFeedParent.childNodes;
for (var i = 0 ;i<child.length;i++) {
  var childID = child[i].getAttribute("id");
  if (childID !== null && ~childID.indexOf(newsFeedID)) { // newsFeedID is substring of childID
    newsFeedID = childID;
  }
}

/* Observing newsFeed */
var newsFeed = document.getElementById(newsFeedID);
observer.observe(
  newsFeed, {
    childList: true,
    subtree:true
});

/* Initial Post before any Mutation*/
var initPost = document.getElementsByClassName(postClass);
for (var i=0;i<initPost.length;i++) {
  //initPost[i].style.backgroundColor="red";
  var content = initPost[i].getElementsByClassName(contentClass)[0]; // searching content in initPost
  if (content != null) {
    kango.console.log("Content init: " + content.textContent);
    doSentimentAnalysis(content.textContent,function(result) {
      initPost[i].style.backgroundColor = result;
    });
  }
}

function giveBGColor(sentiment, sentVal) {
  var r, g, b, RGB, val;
  if (sentiment == "positive") {
    val = sentVal[1][1];
    r = Math.round(150 * val);
    g = 204;
    b = Math.round(150 * val);
  }
  else if (sentiment == "negative") {
    val = sentVal[2][1];
    r = 204;
    g = Math.round(150*val);
    b = Math.round(150*val);
  }
  else {// (sentiment == "neutral")
    r = 200;
    g = 200;
    b = 200;
  }

  RGB = "RGB(" + r + "," + g + "," + b + ")";
  return RGB;
}

/*function doSentimentAnalysis(node,content) {
  var details = {
      method: 'POST',
      url: 'http://localhost:3000/',
      params: {'postContent': content},
      contentType: 'json'
  };
  kango.xhr.send(details, function(data) {
      if (data.status == 200 && data.response != null) {
          var score = data.response.scores;
          var prediction = data.response.prediction;
          kango.console.log("Score: " + score);
          node.style.backgroundColor = giveBGColor(prediction, score);
          kango.console.log("Prediction: " +prediction);
      }
      else { // something went wrong
          kango.console.log('something went wrong');
      }
  });
}*/
function doSentimentAnalysis(content,callback) {
  var details = {
      method: 'POST',
      url: serverURL,
      params: {'postContent': content},
      contentType: 'json'
  };
  kango.xhr.send(details, function(data) {
      if (data.status == 200 && data.response != null) {
          var score = data.response.scores;
          var prediction = data.response.prediction;
          kango.console.log("Score: " + score);
          var result = giveBGColor(prediction,score);
          callback(result);
          //node.style.backgroundColor = giveBGColor(prediction, score);
          kango.console.log("Prediction: " + prediction);
      }
      else { // something went wrong
          kango.console.log('something went wrong');
      }
  });
}