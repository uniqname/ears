/*! 
 @name          ears
 @description   An object event manager
 @version       0.1.0 - 2013/11/25
 @author        Cory Brown
 @copyright     Copyright 2013 by Intellectual Reserve, Inc.
 @usage

    # Create a new Ears object passing in the object to be managed
    earsObj = new Ears(managedObject)

    # Attach event handlers to events
    earsObj.on 'eventName', (e) ->
        //Do stuff

    # ears has an alternative syntax which changes the focus from events managed by the triggering object being managed by the listening object.
    earsObj.listenTo 'eventName', objToListenTo, (e) ->
        //Do stuff

    # Simply trigger events on objects
    earsObj.trigger 'test'

    # You can also pass data through the event object
    earsObj.trigger 'test', evtData

    # Data passed through the event object is accessed through the `data` property.
    earsSubscriber.listenTo 'eventName', earsPublisher, (evt) ->
        evt.data



 TODO: Support for namespaced events.
*/


(function() {
  var Ears;

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

}).call(this);

/*
//@ sourceMappingURL=ears.js.map
*/