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


###*
* The Ears class. Where Awesome happens
*
* @class Ears
* @constructor
###
class Ears
    constructor: (obj = {}) ->
        callbacks = {}


        ###*
        * Returns the unwrapped raw object (ie The stuff between the ears ;) )
        *
        * @method raw
        * @return {Object} Returns the original (perhaps mutated) raw object absent any ears funtionality
        ###
        @raw = () ->
            return obj


        ###*
        * Attaches an event handler to one or more events on the object
        *
        * @method on
        * @param {String} evts A string consisting of a space speerated list of one or more event names to listen for
        * @param {Function} handler The function to be executed upon the occasion of the specfied event(s)
        * @return {Ears} Returns the Ears object
        ###
        @on = (evts, handler) ->
            for evt in evts.split(' ')
                callbacks[evt] = [] if not Array.isArray callbacks[evt]
                callbacks[evt].push handler
            return @
 

        ###*
        * Attaches an event handler to one or more events
        *
        * @method off
        * @param {String} evts A string consisting of a space speerated list of one or more event names to cease listening for
        * @param {Function} handler The function originally attached as the handler to the specified event(s)
        * @return {Ears} Returns the Ears object
        ###
        @off = (evts, handler) ->
            for evt in evts.split(' ')
                callbacks[evt].splice callbacks.indexOf(handler), 1
            return @


        ###*
        * Gets the value of a property on the managed object
        *
        * @method get
        * @param {String} property The name of the property to retrieve the value of.
        * @return {Mixed} The value of the property on the object, or undefined if it does not exist
        ###
        @get = (property) ->
            @trigger 'observation', 
                property: property
            
            return obj[property]


        ###*
        * Sets the value of a property on the managed object
        *
        * @method set
        * @param {String} property The name of the property to set the value of.
        * @param {String} value The value of the property being set
        * @return {Ears} Returns the Ears object
        ###
        @set = (property, value) ->
            previous = obj[property]
            obj[property] = value;
            @trigger 'mutation', 
                property: property
                previousValue: previous
                newValue: value 
            
            return @


        ###*
        * Removes a property from the managed object
        *
        * @method remove
        * @param {String} property The name of the property to be removed.
        * @return {Ears} Returns the Ears object
        ###
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


        ###*
        * Attaches an event handler to one or more events on another object.
        * This is essentailly the same as `on` only from the perspective of the
        * subscriber to the event, rather than the publisher.
        *
        * @method listenTo
        * @param {String} evts A string consisting of a space speerated list of one or more event names to listen for
        * @param {Ears} ears The object being lisented to (The event publisher)
        * @param {Function} handler The function to be executed upon the occasion of the specfied event(s)
        * @return {Ears} Returns the Ears object
        ###
        @listenTo = (evts, ears, handler) -> 
            ears.on evts, handler
            return @


        ###*
        * Removes an event handler from one or more events on another object.
        * This is essentailly the same as `off` only from the perspective of the
        * subscriber to the event, rather than the publisher.
        *
        * @method ignore
        * @param {String} evts A string consisting of a space speerated list of one or more event names to cease listening to
        * @param {Ears} ears The object whos event is no longer to be lisented to (The event publisher)
        * @param {Function} handler The function that was originally bound to the event.
        * @return {Ears} Returns the Ears object
        ###
        @ignore = (evts, ears, handler) ->
            ears.off evts, handler
            return @
    

        ###*
        * Publish (emit, dispatch) an event.
        *
        * @method trigger
        * @param {String} evts A string consisting of a space speerated list of one or more event names to dispatch
        * @param {Mixed} Data to be included in the dispached event object.
        * @return {Ears} Returns the Ears object
        ###
        @trigger = (evts, data) ->
            for evt in evts.split(' ')
                evtObj = 
                    type: evt
                    data: data

                handler?(evtObj) for handler in callbacks[evt]

            return @

window.Ears = Ears
