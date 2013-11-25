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


ears = new Ears()
ears.on 'test', (e) ->
    console.log e

ears.trigger 'test'
# ears = (@obj = {}) ->
    
#   callbacks = {}

#   @on