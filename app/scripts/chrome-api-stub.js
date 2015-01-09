/**
* Used for testing to ensure chrome.storage.local exists.
*/

window.chrome = {
  storage: {
    local: {
      clear: function() {
        localStorage.clear();
      },
      get: function(name, callback) {
          if(name != null && localStorage[name] == undefined) {
            var obj = {};
            obj[name] = JSON.parse(localStorage.storage)[name];
            setTimeout(function() {callback(obj);},500);
          } else {
            if(typeof(name) == "string") {
              setTimeout(function() {callback(localStorage[name]);},500);
            } else {
              if(localStorage.storage !== undefined) {
                setTimeout(function() {callback(JSON.parse(localStorage.storage));},500);
              } else {
                setTimeout(function() {callback({});},500);
              }
            }
          }
      },
      set: function(data, callback) {
          if(data !== undefined) {
            function _addToObject(jString, objCol) {
              localStorage.storage = JSON.stringify(jString);
            }
            _addToObject(data, localStorage);
          }
      }
    }
  }
};
