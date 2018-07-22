var request = require('request');

var lineGroupNotify = function(message, token){
  request({
          method: 'POST',
          uri: 'https://notify-api.line.me/api/notify',
          header: {
              'Content-Type': 'application/x-www-form-urlencoded'
          },
          'auth': {
              'bearer': token
          },
          form: {
              message: message
          }
      }, (err, httpResponse, body) => {
          if(err){
              console.log(err);
          } else {
              return "LINE Notify Ok!";
          }
      });
}

module.exports.lineGroupNotify = lineGroupNotify;
