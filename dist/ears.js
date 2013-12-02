/*! 
 @name          ears
 @description   An object event manager
 @version       0.2.0 - 2013/12/01
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

  /**
  * The Ears class. Where Awesome happens
  *
  * @class Ears
  * @constructor
  */


  Ears = (function() {
    function Ears(obj) {
      var callbacks;
      if (obj == null) {
        obj = {};
      }
      callbacks = {};
      /**
      * Returns the unwrapped raw object (ie The stuff between the ears ;) )
      *
      * @method raw
      * @return {Object} Returns the original (perhaps mutated) raw object absent any ears funtionality
      */

      this.raw = function() {
        return obj;
      };
      /**
      * Attaches an event handler to one or more events on the object
      *
      * @method on
      * @param {String} evts A string consisting of a space speerated list of one or more event names to listen for
      * @param {Function} handler The function to be executed upon the occasion of the specfied event(s)
      * @return {Ears} Returns the Ears object
      */

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
      /**
      * Attaches an event handler to one or more events
      *
      * @method off
      * @param {String} evts A string consisting of a space speerated list of one or more event names to cease listening for
      * @param {Function} handler The function originally attached as the handler to the specified event(s)
      * @return {Ears} Returns the Ears object
      */

      this.off = function(evts, handler) {
        var evt, _i, _len, _ref;
        _ref = evts.split(' ');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          evt = _ref[_i];
          callbacks[evt].splice(callbacks.indexOf(handler), 1);
        }
        return this;
      };
      /**
      * Gets the value of a property on the managed object
      *
      * @method get
      * @param {String} property The name of the property to retrieve the value of.
      * @return {Mixed} The value of the property on the object, or undefined if it does not exist
      */

      this.get = function(property) {
        this.trigger('observation', {
          property: property
        });
        return obj[property];
      };
      /**
      * Sets the value of a property on the managed object
      *
      * @method set
      * @param {String} property The name of the property to set the value of.
      * @param {String} value The value of the property being set
      * @return {Ears} Returns the Ears object
      */

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
      /**
      * Removes a property from the managed object
      *
      * @method remove
      * @param {String} property The name of the property to be removed.
      * @return {Ears} Returns the Ears object
      */

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
      /**
      * Attaches an event handler to one or more events on another object.
      * This is essentailly the same as `on` only from the perspective of the
      * subscriber to the event, rather than the publisher.
      *
      * @method listenTo
      * @param {String} evts A string consisting of a space speerated list of one or more event names to listen for
      * @param {Ears} ears The object being lisented to (The event publisher)
      * @param {Function} handler The function to be executed upon the occasion of the specfied event(s)
      * @return {Ears} Returns the Ears object
      */

      this.listenTo = function(evts, ears, handler) {
        ears.on(evts, handler);
        return this;
      };
      /**
      * Removes an event handler from one or more events on another object.
      * This is essentailly the same as `off` only from the perspective of the
      * subscriber to the event, rather than the publisher.
      *
      * @method ignore
      * @param {String} evts A string consisting of a space speerated list of one or more event names to cease listening to
      * @param {Ears} ears The object whos event is no longer to be lisented to (The event publisher)
      * @param {Function} handler The function that was originally bound to the event.
      * @return {Ears} Returns the Ears object
      */

      this.ignore = function(evts, ears, handler) {
        ears.off(evts, handler);
        return this;
      };
      /**
      * Publish (emit, dispatch) an event.
      *
      * @method trigger
      * @param {String} evts A string consisting of a space speerated list of one or more event names to dispatch
      * @param {Mixed} Data to be included in the dispached event object.
      * @return {Ears} Returns the Ears object
      */

      this.trigger = function(evts, data) {
        var evt, evtObj, handler, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
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
          _ref2 = callbacks['*'] != null;
          for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
            handler = _ref2[_k];
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