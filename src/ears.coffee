###! 
 @name          ears
 @description   An object event manager
 @version       @@version - @@date
 @author        Cory Brown
 @copyright     Copyright 2013 by Intellectual Reserve, Inc.
 @usage

    # Create a new Ears object passing in the object to be managed
    earsObj = new Ears(managedObject)

    # Attach event handlers to events
    earsObj.on 'eventName', (e) ->
        //Do stuff

    # ears has an alternative syntax to changes the focus from triggering object managed events to listening object managed events
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

###

# IE <=8 support
if not Array.isArray
    Array.isArray = (testObj) ->
        Object.prototype.toString.call( testObj ) is '[object Array]'

if not Array.prototype.indexOf
    Array.prototype.indexOf = (item) ->
        return i for el, i in @ when item is el



class Ears
    constructor: (@obj = {}) ->
        @__callbacks = {}

    on: (evts, handler) ->
        for evt in evts.split(' ')
            @__callbacks[evt] = [] if not Array.isArray @__callbacks[evt]
            @__callbacks[evt].push handler
        return @

    off: (evts, handler) ->
        for evt in evts.split(' ')
            @__callbacks[evt].splice @__callbacks.indexOf(handler), 1
        return @

    listenTo: (evts, ears, handler) -> 
        ears.on evts, handler

    ignore: (evts, ears, handler) ->
        ears.off evts, handler

    trigger: (evts, data) ->
        for evt in evts.split(' ')
            evtObj = 
                type: evt
                data: data

            handler?(evtObj) for handler in @__callbacks[evt]
        return @
