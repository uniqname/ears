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

###

# IE <=8 support
if not Array.isArray
    Array.isArray = (testObj) ->
        Object.prototype.toString.call( testObj ) is '[object Array]'

if not Array.prototype.indexOf
    Array.prototype.indexOf = (item) ->
        return i for el, i in @ when item is el



class Ears
    constructor: (obj = {}) ->
        callbacks = {}

        # Here be dragons!
        @raw = () ->
            return obj

        @on = (evts, handler) ->
            for evt in evts.split(' ')
                callbacks[evt] = [] if not Array.isArray callbacks[evt]
                callbacks[evt].push handler
            return @

        @off = (evts, handler) ->
            for evt in evts.split(' ')
                callbacks[evt].splice callbacks.indexOf(handler), 1
            return @

        @get = (property) ->
            @trigger 'observation', 
                property: property
            
            return obj[property]

        @set = (property, value) ->
            previous = obj[property]
            obj[property] = value;
            @trigger 'mutation', 
                property: property
                previousValue: previous
                newValue: value 
            
            return @

        @remove = (property) ->
            previous = obj[property]

            delete obj[property]?

            @trigger 'propertyRemoved', 
                property: property
                previousValue: previous
                newValue: obj[property]

            @on 'propertyRemoved', (evt) ->
                @trigger 'mutation', evt.data

            return @


        @listenTo = (evts, ears, handler) -> 
            ears.on evts, handler
            return @

        @ignore = (evts, ears, handler) ->
            ears.off evts, handler
            return @
    

        @trigger = (evts, data) ->
            for evt in evts.split(' ')
                evtObj = 
                    type: evt
                    data: data

                handler?(evtObj) for handler in callbacks[evt]

            return @

window.Ears = Ears
