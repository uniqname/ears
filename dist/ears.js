(function() {
  var Ears, ears;

  if (!Array.isArray) {
    Array.isArray = function(testObj) {
      return Object.prototype.toString.call(testObj) === '[object Array]';
    };
  }

  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(item) {
      var el, i, _i, _len;
      for (i = _i = 0, _len = this.length; _i < _len; i = ++_i) {
        el = this[i];
        if (item === el) {
          return i;
        }
      }
    };
  }

  Ears = (function() {
    function Ears(obj) {
      this.obj = obj != null ? obj : {};
      this.__callbacks = {};
    }

    Ears.prototype.on = function(evts, handler) {
      var evt, _i, _len, _ref;
      _ref = evts.split(' ');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        evt = _ref[_i];
        if (!Array.isArray(this.__callbacks[evt])) {
          this.__callbacks[evt] = [];
        }
        this.__callbacks[evt].push(handler);
      }
      return this;
    };

    Ears.prototype.off = function(evts, handler) {
      var evt, _i, _len, _ref;
      _ref = evts.split(' ');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        evt = _ref[_i];
        this.__callbacks[evt].splice(this.__callbacks.indexOf(handler), 1);
      }
      return this;
    };

    Ears.prototype.listenTo = function(evts, ears, handler) {
      return ears.on(evts, handler);
    };

    Ears.prototype.ignore = function(evts, ears, handler) {
      return ears.off(evts, handler);
    };

    Ears.prototype.trigger = function(evts, data) {
      var evt, evtObj, handler, _i, _j, _len, _len1, _ref, _ref1;
      _ref = evts.split(' ');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        evt = _ref[_i];
        evtObj = {
          type: evt,
          data: data
        };
        _ref1 = this.__callbacks[evt];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          handler = _ref1[_j];
          if (typeof handler === "function") {
            handler(evtObj);
          }
        }
      }
      return this;
    };

    return Ears;

  })();

  ears = new Ears();

  ears.on('test', function(e) {
    return console.log(e);
  });

  ears.trigger('test');

}).call(this);

/*
//@ sourceMappingURL=ears.js.map
*/