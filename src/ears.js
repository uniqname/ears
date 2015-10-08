const symbolFor = (name) => Symbol ? Symbol(name) : `_${name}`,
    s = Ears.Symbols = {
        on: symbolFor('on'),
        off: symbolFor('off'),
        listenTo: symbolFor('listenTo'),
        ignore: symbolFor('ignore'),
        remove: symbolFor('remove'),
        add: symbolFor('add'),
        trigger: symbolFor('trigger')
    };

function createObservableProperty(obj, prop, val, config) {
    let valState = (typeof val === 'object') ? Ears(val) : val;
    return Object.defineProperty(obj, prop, {
        enumerable: true,
        get() {
            obj[s.trigger](config.accessorEvent, {
                property: prop
            });
            return valState;
        },
        set(newVal) {
            valState = newVal;
            obj[s.trigger](config.assignmentEvent, {
                property: prop,
                previousValue: valState,
                newValue: newVal
            });
        }
    });
}

function objectToObservable(obj, config) {
    return Object.keys(obj).reduce(
        (o, key) => createObservableProperty(o, key, obj[key], config),
        {});
}

export default function Ears(obj = {}, {
    accessorEvent = 'access',
    assignmentEvent = 'assignment'
} = {}) {
    const callbacks = {},

        // Make the object passed in observable.
        observable = objectToObservable(obj, {accessorEvent, assignmentEvent});

    observable[s.on] = function (evts, handler) {
        evts.split(' ').reduce((cbs, evt) => {
            cbs[evt] = (cbs[evt] || []).concat(handler);
            return cbs;
        }, callbacks);
        return this;
    };

    observable[s.off] = function (evts, handler) {
        evts.split(' ').reduce((cbs, evt) => {
            //remove handler from cb list
            cbs[evt] = (cbs[evt] || []).filter(cb => cb !== handler);
            return cbs;
        }, callbacks);
        return this;
    };

    observable[s.add] = function (prop, val) {
        createObservableProperty(observable, prop, val, {accessorEvent, assignmentEvent});
    };

    observable[s.remove] = function (property) {
        let previous = observable[property];

        delete observable[property];

        this[s.trigger]('propertyRemoved', {
            property,
            previousValue: previous,
            newValue: observable[property]
        });

        return this;
    };

    observable[s.listenTo] = function (evts, objIn, handler) {
        if (!observable[s.on]) {
            throw new Error(`The object passed in is not observable by Ears. `, objIn);
        }
        objIn[s.on](evts, handler);
        return this;
    };

    observable[s.ignore] = function (evts, objIn, handler) {
        if (!observable[s.off]) {
            throw new Error(`The object passed in is not observable by Ears. `, objIn);
        }
        objIn[s.off](evts, handler);
        return this;
    };

    observable[s.trigger] = function (evts, data) {
        evts.split(' ').map(evt => {
            let evtObj = {
                type: evt,
                data
            };

            (callbacks[evt] || []).map(handler => handler(evtObj));

            // Objects can subscribe to all events from another object.
            // It is left to the subscriber to filter and handle appropriate events
            (callbacks['*'] || []).map(handler => handler(evtObj));
        });
        return this;
    };

    observable[s.on](`propertyRemoved add ${assignmentEvent}`, (evt) =>
        observable[s.trigger]('mutation', evt.data));

    return observable;
}

window.Ears = Ears;
