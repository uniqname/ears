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
      var callbacks;
      if (obj == null) {
        obj = {};
      }
      callbacks = {};
      this.raw = function() {
        return obj;
      };
      this.on = function(evts, handler) {
        var evt, _i, _len, _ref;
        _ref = evts.split(' ');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          evt = _ref[_i];
          if (!Array.isArray(callbacks[evt])) {
            callbacks[evt] = [];
          }
          callbacks[evt].push(handler);
        }
        return this;
      };
      this.off = function(evts, handler) {
        var evt, _i, _len, _ref;
        _ref = evts.split(' ');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          evt = _ref[_i];
          callbacks[evt].splice(callbacks.indexOf(handler), 1);
        }
        return this;
      };
      this.get = function(property) {
        this.trigger('observation', {
          property: property
        });
        return obj[property];
      };
      this.set = function(property, value) {
        var previous;
        previous = obj[property];
        obj[property] = value;
        this.trigger('mutation', {
          property: property,
          previousValue: previous,
          newValue: value
        });
        return this;
      };
      this.remove = function(property) {
        var previous;
        previous = obj[property];
        delete (obj[property] != null);
        this.trigger('propertyRemoved', {
          property: property,
          previousValue: previous,
          newValue: obj[property]
        });
        this.on('propertyRemoved', function(evt) {
          return this.trigger('mutation', evt.data);
        });
        return this;
      };
      this.listenTo = function(evts, ears, handler) {
        ears.on(evts, handler);
        return this;
      };
      this.ignore = function(evts, ears, handler) {
        ears.off(evts, handler);
        return this;
      };
      this.trigger = function(evts, data) {
        var evt, evtObj, handler, _i, _j, _len, _len1, _ref, _ref1;
        _ref = evts.split(' ');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          evt = _ref[_i];
          evtObj = {
            type: evt,
            data: data
          };
          _ref1 = callbacks[evt];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            handler = _ref1[_j];
            if (typeof handler === "function") {
              handler(evtObj);
            }
          }
        }
        return this;
      };
    }

    return Ears;

  })();

  window.Ears = Ears;

}).call(this);

/*
//@ sourceMappingURL=ears.js.map
*/