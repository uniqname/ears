ears
====

An object event manager


Create a new Ears object passing in the object to be managed

    earsObj = new Ears(managedObject)

Attach event handlers to events

    earsObj.on 'eventName', (e) ->
        //Do stuff

ears has an alternative syntax to changes the focus from triggering object managed events to listening object managed events

    earsObj.listenTo 'eventName', objToListenTo, (e) ->
        //Do stuff

Simply trigger events on objects

    earsObj.trigger 'test'

You can also pass data through the event object

    earsObj.trigger 'test', evtData

Data passed through the event object is accessed through the `data` property.

    earsSubscriber.listenTo 'eventName', earsPublisher, (evt) ->
        evt.data

TODO: Support for namespaced events.
