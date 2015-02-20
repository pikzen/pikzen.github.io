if (![].includes) {
  Array.prototype.includes = function(searchElement /*, fromIndex*/ ) {
    'use strict';
    var O = Object(this);
    var len = parseInt(O.length) || 0;
    if (len === 0) {
      return false;
    }
    var n = parseInt(arguments[1]) || 0;
    var k;
    if (n >= 0) {
      k = n;
    } else {
      k = len + n;
      if (k < 0) {k = 0;}
    }
    var currentElement;
    while (k < len) {
      currentElement = O[k];
      if (searchElement === currentElement ||
         (searchElement !== searchElement && currentElement !== currentElement)) {
        return true;
      }
      k++;
    }
    return false;
  };
}

if (![].any) {
  Array.prototype.any = function(arr) {
    for (var i = 0; i < this.length; i++) {
      for (var j = 0; j < arr.length; j++) {
        if (this[i] == arr[j]) return true;
      }
    }

    return false;
  }
}

if (![].all) {
  Array.prototype.all = function(arr) {
    for (var thisLength = 0; thisLength < this.length; thisLength++) {
      var wasFound = false;

      for (var i = 0; i < arr.length; i++) {
        if (this[i] == arr[i]) wasFound = true; break;
      }

      if (!wasFound) return false;
    }

    return true;
  }
}