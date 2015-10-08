(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = Ears;
var symbolFor = function symbolFor(name) {
    return Symbol ? Symbol(name) : '_' + name;
},
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
    var valState = typeof val === 'object' ? Ears(val) : val;
    return Object.defineProperty(obj, prop, {
        enumerable: true,
        get: function get() {
            obj[s.trigger](config.accessorEvent, {
                property: prop
            });
            return valState;
        },
        set: function set(newVal) {
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
    return Object.keys(obj).reduce(function (o, key) {
        return createObservableProperty(o, key, obj[key], config);
    }, {});
}

function Ears() {
    var obj = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var _ref$accessorEvent = _ref.accessorEvent;
    var accessorEvent = _ref$accessorEvent === undefined ? 'access' : _ref$accessorEvent;
    var _ref$assignmentEvent = _ref.assignmentEvent;
    var assignmentEvent = _ref$assignmentEvent === undefined ? 'assignment' : _ref$assignmentEvent;

    var callbacks = {},

    // Make the object passed in observable.
    observable = objectToObservable(obj, { accessorEvent: accessorEvent, assignmentEvent: assignmentEvent });

    observable[s.on] = function (evts, handler) {
        evts.split(' ').reduce(function (cbs, evt) {
            cbs[evt] = (cbs[evt] || []).concat(handler);
            return cbs;
        }, callbacks);
        return this;
    };

    observable[s.off] = function (evts, handler) {
        evts.split(' ').reduce(function (cbs, evt) {
            //remove handler from cb list
            cbs[evt] = (cbs[evt] || []).filter(function (cb) {
                return cb !== handler;
            });
            return cbs;
        }, callbacks);
        return this;
    };

    observable[s.add] = function (prop, val) {
        createObservableProperty(observable, prop, val, { accessorEvent: accessorEvent, assignmentEvent: assignmentEvent });
    };

    observable[s.remove] = function (property) {
        var previous = observable[property];

        delete observable[property];

        this[s.trigger]('propertyRemoved', {
            property: property,
            previousValue: previous,
            newValue: observable[property]
        });

        return this;
    };

    observable[s.listenTo] = function (evts, objIn, handler) {
        if (!observable[s.on]) {
            throw new Error('The object passed in is not observable by Ears. ', objIn);
        }
        objIn[s.on](evts, handler);
        return this;
    };

    observable[s.ignore] = function (evts, objIn, handler) {
        if (!observable[s.off]) {
            throw new Error('The object passed in is not observable by Ears. ', objIn);
        }
        objIn[s.off](evts, handler);
        return this;
    };

    observable[s.trigger] = function (evts, data) {
        evts.split(' ').map(function (evt) {
            var evtObj = {
                type: evt,
                data: data
            };

            (callbacks[evt] || []).map(function (handler) {
                return handler(evtObj);
            });

            // Objects can subscribe to all events from another object.
            // It is left to the subscriber to filter and handle appropriate events
            (callbacks['*'] || []).map(function (handler) {
                return handler(evtObj);
            });
        });
        return this;
    };

    observable[s.on]('propertyRemoved add ' + assignmentEvent, function (evt) {
        return observable[s.trigger]('mutation', evt.data);
    });

    return observable;
}

window.Ears = Ears;
module.exports = exports['default'];

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvY29yeWJyb3duL2NvZGUvZWFycy9zcmMvZWFycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O3FCQ3NDd0IsSUFBSTtBQXRDNUIsSUFBTSxTQUFTLEdBQUcsU0FBWixTQUFTLENBQUksSUFBSTtXQUFLLE1BQU0sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQU8sSUFBSSxBQUFFO0NBQUE7SUFDMUQsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLEdBQUc7QUFDZixNQUFFLEVBQUUsU0FBUyxDQUFDLElBQUksQ0FBQztBQUNuQixPQUFHLEVBQUUsU0FBUyxDQUFDLEtBQUssQ0FBQztBQUNyQixZQUFRLEVBQUUsU0FBUyxDQUFDLFVBQVUsQ0FBQztBQUMvQixVQUFNLEVBQUUsU0FBUyxDQUFDLFFBQVEsQ0FBQztBQUMzQixVQUFNLEVBQUUsU0FBUyxDQUFDLFFBQVEsQ0FBQztBQUMzQixPQUFHLEVBQUUsU0FBUyxDQUFDLEtBQUssQ0FBQztBQUNyQixXQUFPLEVBQUUsU0FBUyxDQUFDLFNBQVMsQ0FBQztDQUNoQyxDQUFDOztBQUVOLFNBQVMsd0JBQXdCLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFO0FBQ3RELFFBQUksUUFBUSxHQUFHLEFBQUMsT0FBTyxHQUFHLEtBQUssUUFBUSxHQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7QUFDM0QsV0FBTyxNQUFNLENBQUMsY0FBYyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUU7QUFDcEMsa0JBQVUsRUFBRSxJQUFJO0FBQ2hCLFdBQUcsRUFBQSxlQUFHO0FBQ0YsZUFBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFO0FBQ2pDLHdCQUFRLEVBQUUsSUFBSTthQUNq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LENBQUUsR0FBRyxDQUFDLFVBQUEsT0FBTzt1QkFBSSxPQUFPLENBQUMsTUFBTSxDQUFDO2FBQUEsQ0FBQyxDQUFDOzs7O0FBSXZELGFBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQSxDQUFFLEdBQUcsQ0FBQyxVQUFBLE9BQU87dUJBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQzthQUFBLENBQUMsQ0FBQztTQUMxRCxDQUFDLENBQUM7QUFDSCxlQUFPLElBQUksQ0FBQztLQUNmLENBQUM7O0FBRUYsY0FBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsMEJBQXdCLGVBQWUsRUFBSSxVQUFDLEdBQUc7ZUFDM0QsVUFBVSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQztLQUFBLENBQUMsQ0FBQzs7QUFHakQsV0FBTyxVQUFVLENBQUM7Q0FDckI7O0FBRUQsTUFBTSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY29uc3Qgc3ltYm9sRm9yID0gKG5hbWUpID0+IFN5bWJvbCA/IFN5bWJvbChuYW1lKSA6IGBfJHtuYW1lfWAsXG4gICAgcyA9IEVhcnMuU3ltYm9scyA9IHtcbiAgICAgICAgb246IHN5bWJvbEZvcignb24nKSxcbiAgICAgICAgb2ZmOiBzeW1ib2xGb3IoJ29mZicpLFxuICAgICAgICBsaXN0ZW5Ubzogc3ltYm9sRm9yKCdsaXN0ZW5UbycpLFxuICAgICAgICBpZ25vcmU6IHN5bWJvbEZvcignaWdub3JlJyksXG4gICAgICAgIHJlbW92ZTogc3ltYm9sRm9yKCdyZW1vdmUnKSxcbiAgICAgICAgYWRkOiBzeW1ib2xGb3IoJ2FkZCcpLFxuICAgICAgICB0cmlnZ2VyOiBzeW1ib2xGb3IoJ3RyaWdnZXInKVxuICAgIH07XG5cbmZ1bmN0aW9uIGNyZWF0ZU9ic2VydmFibGVQcm9wZXJ0eShvYmosIHByb3AsIHZhbCwgY29uZmlnKSB7XG4gICAgbGV0IHZhbFN0YXRlID0gKHR5cGVvZiB2YWwgPT09ICdvYmplY3QnKSA/IEVhcnModmFsKSA6IHZhbDtcbiAgICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwgcHJvcCwge1xuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBnZXQoKSB7XG4gICAgICAgICAgICBvYmpbcy50cmlnZ2VyXShjb25maWcuYWNjZXNzb3JFdmVudCwge1xuICAgICAgICAgICAgICAgIHByb3BlcnR5OiBwcm9wXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB2YWxTdGF0ZTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0KG5ld1ZhbCkge1xuICAgICAgICAgICAgdmFsU3RhdGUgPSBuZXdWYWw7XG4gICAgICAgICAgICBvYmpbcy50cmlnZ2VyXShjb25maWcuYXNzaWdubWVudEV2ZW50LCB7XG4gICAgICAgICAgICAgICAgcHJvcGVydHk6IHByb3AsXG4gICAgICAgICAgICAgICAgcHJldmlvdXNWYWx1ZTogdmFsU3RhdGUsXG4gICAgICAgICAgICAgICAgbmV3VmFsdWU6IG5ld1ZhbFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gb2JqZWN0VG9PYnNlcnZhYmxlKG9iaiwgY29uZmlnKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKG9iaikucmVkdWNlKFxuICAgICAgICAobywga2V5KSA9PiBjcmVhdGVPYnNlcnZhYmxlUHJvcGVydHkobywga2V5LCBvYmpba2V5XSwgY29uZmlnKSxcbiAgICAgICAge30pO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBFYXJzKG9iaiA9IHt9LCB7XG4gICAgYWNjZXNzb3JFdmVudCA9ICdhY2Nlc3MnLFxuICAgIGFzc2lnbm1lbnRFdmVudCA9ICdhc3NpZ25tZW50J1xufSA9IHt9KSB7XG4gICAgY29uc3QgY2FsbGJhY2tzID0ge30sXG5cbiAgICAgICAgLy8gTWFrZSB0aGUgb2JqZWN0IHBhc3NlZCBpbiBvYnNlcnZhYmxlLlxuICAgICAgICBvYnNlcnZhYmxlID0gb2JqZWN0VG9PYnNlcnZhYmxlKG9iaiwge2FjY2Vzc29yRXZlbnQsIGFzc2lnbm1lbnRFdmVudH0pO1xuXG4gICAgb2JzZXJ2YWJsZVtzLm9uXSA9IGZ1bmN0aW9uIChldnRzLCBoYW5kbGVyKSB7XG4gICAgICAgIGV2dHMuc3BsaXQoJyAnKS5yZWR1Y2UoKGNicywgZXZ0KSA9PiB7XG4gICAgICAgICAgICBjYnNbZXZ0XSA9IChjYnNbZXZ0XSB8fCBbXSkuY29uY2F0KGhhbmRsZXIpO1xuICAgICAgICAgICAgcmV0dXJuIGNicztcbiAgICAgICAgfSwgY2FsbGJhY2tzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuXG4gICAgb2JzZXJ2YWJsZVtzLm9mZl0gPSBmdW5jdGlvbiAoZXZ0cywgaGFuZGxlcikge1xuICAgICAgICBldnRzLnNwbGl0KCcgJykucmVkdWNlKChjYnMsIGV2dCkgPT4ge1xuICAgICAgICAgICAgLy9yZW1vdmUgaGFuZGxlciBmcm9tIGNiIGxpc3RcbiAgICAgICAgICAgIGNic1tldnRdID0gKGNic1tldnRdIHx8IFtdKS5maWx0ZXIoY2IgPT4gY2IgIT09IGhhbmRsZXIpO1xuICAgICAgICAgICAgcmV0dXJuIGNicztcbiAgICAgICAgfSwgY2FsbGJhY2tzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIG9ic2VydmFibGVbcy5hZGRdID0gZnVuY3Rpb24gKHByb3AsIHZhbCkge1xuICAgICAgICBjcmVhdGVPYnNlcnZhYmxlUHJvcGVydHkob2JzZXJ2YWJsZSwgcHJvcCwgdmFsLCB7YWNjZXNzb3JFdmVudCwgYXNzaWdubWVudEV2ZW50fSk7XG4gICAgfTtcblxuXG4gICAgb2JzZXJ2YWJsZVtzLnJlbW92ZV0gPSBmdW5jdGlvbiAocHJvcGVydHkpIHtcbiAgICAgICAgbGV0IHByZXZpb3VzID0gb2JzZXJ2YWJsZVtwcm9wZXJ0eV07XG5cbiAgICAgICAgZGVsZXRlIG9ic2VydmFibGVbcHJvcGVydHldO1xuXG4gICAgICAgIHRoaXNbcy50cmlnZ2VyXSgncHJvcGVydHlSZW1vdmVkJywge1xuICAgICAgICAgICAgcHJvcGVydHksXG4gICAgICAgICAgICBwcmV2aW91c1ZhbHVlOiBwcmV2aW91cyxcbiAgICAgICAgICAgIG5ld1ZhbHVlOiBvYnNlcnZhYmxlW3Byb3BlcnR5XVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG5cbiAgICBvYnNlcnZhYmxlW3MubGlzdGVuVG9dID0gZnVuY3Rpb24gKGV2dHMsIG9iakluLCBoYW5kbGVyKSB7XG4gICAgICAgIGlmICghb2JzZXJ2YWJsZVtzLm9uXSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgb2JqZWN0IHBhc3NlZCBpbiBpcyBub3Qgb2JzZXJ2YWJsZSBieSBFYXJzLiBgLCBvYmpJbik7XG4gICAgICAgIH1cbiAgICAgICAgb2JqSW5bcy5vbl0oZXZ0cywgaGFuZGxlcik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cblxuICAgIG9ic2VydmFibGVbcy5pZ25vcmVdID0gZnVuY3Rpb24gKGV2dHMsIG9iakluLCBoYW5kbGVyKSB7XG4gICAgICAgIGlmICghb2JzZXJ2YWJsZVtzLm9mZl0pIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVGhlIG9iamVjdCBwYXNzZWQgaW4gaXMgbm90IG9ic2VydmFibGUgYnkgRWFycy4gYCwgb2JqSW4pO1xuICAgICAgICB9XG4gICAgICAgIG9iakluW3Mub2ZmXShldnRzLCBoYW5kbGVyKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuXG4gICAgb2JzZXJ2YWJsZVtzLnRyaWdnZXJdID0gZnVuY3Rpb24gKGV2dHMsIGRhdGEpIHtcbiAgICAgICAgZXZ0cy5zcGxpdCgnICcpLm1hcChldnQgPT4ge1xuICAgICAgICAgICAgbGV0IGV2dE9iaiA9IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBldnQsXG4gICAgICAgICAgICAgICAgZGF0YVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgKGNhbGxiYWNrc1tldnRdIHx8IFtdKS5tYXAoaGFuZGxlciA9PiBoYW5kbGVyKGV2dE9iaikpO1xuXG4gICAgICAgICAgICAvLyBPYmplY3RzIGNhbiBzdWJzY3JpYmUgdG8gYWxsIGV2ZW50cyBmcm9tIGFub3RoZXIgb2JqZWN0LlxuICAgICAgICAgICAgLy8gSXQgaXMgbGVmdCB0byB0aGUgc3Vic2NyaWJlciB0byBmaWx0ZXIgYW5kIGhhbmRsZSBhcHByb3ByaWF0ZSBldmVudHNcbiAgICAgICAgICAgIChjYWxsYmFja3NbJyonXSB8fCBbXSkubWFwKGhhbmRsZXIgPT4gaGFuZGxlcihldnRPYmopKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBvYnNlcnZhYmxlW3Mub25dKGBwcm9wZXJ0eVJlbW92ZWQgYWRkICR7YXNzaWdubWVudEV2ZW50fWAsIChldnQpID0+XG4gICAgICAgIG9ic2VydmFibGVbcy50cmlnZ2VyXSgnbXV0YXRpb24nLCBldnQuZGF0YSkpO1xuXG5cbiAgICByZXR1cm4gb2JzZXJ2YWJsZTtcbn1cblxud2luZG93LkVhcnMgPSBFYXJzO1xuIl19
