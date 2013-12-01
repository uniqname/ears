ears
====

An object event manager


Create a new Ears object passing in the object to be managed

    earsObj = new Ears(managedObject)

Attach event handlers to events

    earsObj.on 'eventName', (e) ->
        # Do stuff

ears has an alternative syntax which changes the focus from events managed by the triggering object being managed by the listening object.

    earsObj.listenTo 'eventName', objToListenTo, (e) ->
        # Do stuff
        
You can even subscribe to all published events from an object with the "*" event name. Using "*" as the event name will mean that the attached handler will be called on every published event an object triggers. It is up to the subscribing objects event handler to filter and responed to those events.

    earsObj.listenTo '*', objToListenTo, (e) ->
        case e.type
            when 'someEvent'
                # Do something
            when: 'someOtherEvent'
                # Do something else
            else:
                # default behavior

Easily trigger events on objects

    earsObj.trigger 'test'

You can also pass data through the event object

    earsObj.trigger 'test', evtData

Data passed through the event object is accessed through the `data` property.

    earsSubscriber.listenTo 'eventName', earsPublisher, (evt) ->
        evt.data

TODO: Support for namespaced events.
