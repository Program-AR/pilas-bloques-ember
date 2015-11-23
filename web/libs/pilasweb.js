/**
 * PixelLab Resource Loader
 * Loads resources while providing progress updates.
 */

function PxLoader(settings) {

    // merge settings with defaults
    settings = settings || {};

    // how frequently we poll resources for progress
    if (settings.statusInterval == null) {
        settings.statusInterval = 5000; // every 5 seconds by default
    }

    // delay before logging since last progress change
    if (settings.loggingDelay == null) {
        settings.loggingDelay = 20 * 1000; // log stragglers after 20 secs
    }

    // stop waiting if no progress has been made in the moving time window
    if (settings.noProgressTimeout == null) {
        settings.noProgressTimeout = Infinity; // do not stop waiting by default
    }

    var entries = [],
        // holds resources to be loaded with their status
        progressListeners = [],
        timeStarted, progressChanged = +new Date;

    /**
     * The status of a resource
     * @enum {number}
     */
    var ResourceState = {
        QUEUED: 0,
        WAITING: 1,
        LOADED: 2,
        ERROR: 3,
        TIMEOUT: 4
    };

    // places non-array values into an array.
    var ensureArray = function(val) {
        if (val == null) {
            return [];
        }

        if (Array.isArray(val)) {
            return val;
        }

        return [val];
    };

    // add an entry to the list of resources to be loaded
    this.add = function(resource) {

        // ensure tags are in an object
        resource.tags = new PxLoaderTags(resource.tags);

        // ensure priority is set
        if (resource.priority == null) {
            resource.priority = Infinity;
        }

        entries.push({
            resource: resource,
            status: ResourceState.QUEUED
        });
    };

    this.addProgressListener = function(callback, tags) {
        progressListeners.push({
            callback: callback,
            tags: new PxLoaderTags(tags)
        });
    };

    this.addCompletionListener = function(callback, tags) {
        progressListeners.push({
            tags: new PxLoaderTags(tags),
            callback: function(e) {
                if (e.completedCount === e.totalCount) {
                    callback();
                }
            }
        });
    };

    // creates a comparison function for resources
    var getResourceSort = function(orderedTags) {

        // helper to get the top tag's order for a resource
        orderedTags = ensureArray(orderedTags);
        var getTagOrder = function(entry) {
            var resource = entry.resource,
                bestIndex = Infinity;
            for (var i = 0; i < resource.tags.length; i++) {
                for (var j = 0; j < Math.min(orderedTags.length, bestIndex); j++) {
                    if (resource.tags[i] == orderedTags[j] && j < bestIndex) {
                        bestIndex = j;
                        if (bestIndex === 0) break;
                    }
                    if (bestIndex === 0) break;
                }
            }
            return bestIndex;
        };
        return function(a, b) {
            // check tag order first
            var aOrder = getTagOrder(a),
                bOrder = getTagOrder(b);
            if (aOrder < bOrder) return -1;
            if (aOrder > bOrder) return 1;

            // now check priority
            if (a.priority < b.priority) return -1;
            if (a.priority > b.priority) return 1;
            return 0;
        }
    };

    this.start = function(orderedTags) {
        timeStarted = +new Date;

        // first order the resources
        var compareResources = getResourceSort(orderedTags);
        entries.sort(compareResources);

        // trigger requests for each resource
        for (var i = 0, len = entries.length; i < len; i++) {
            var entry = entries[i];
            entry.status = ResourceState.WAITING;
            entry.resource.start(this);
        }

        // do an initial status check soon since items may be loaded from the cache
        setTimeout(statusCheck, 100);
    };

    var statusCheck = function() {
        var checkAgain = false,
            noProgressTime = (+new Date) - progressChanged,
            timedOut = (noProgressTime >= settings.noProgressTimeout),
            shouldLog = (noProgressTime >= settings.loggingDelay);

        for (var i = 0, len = entries.length; i < len; i++) {
            var entry = entries[i];
            if (entry.status !== ResourceState.WAITING) {
                continue;
            }

            // see if the resource has loaded
            if (entry.resource.checkStatus) {
                entry.resource.checkStatus();
            }

            // if still waiting, mark as timed out or make sure we check again
            if (entry.status === ResourceState.WAITING) {
                if (timedOut) {
                    entry.resource.onTimeout();
                } else {
                    checkAgain = true;
                }
            }
        }

        // log any resources that are still pending
        if (shouldLog && checkAgain) {
            log();
        }

        if (checkAgain) {
            setTimeout(statusCheck, settings.statusInterval);
        }
    };

    this.isBusy = function() {
        for (var i = 0, len = entries.length; i < len; i++) {
            if (entries[i].status === ResourceState.QUEUED || entries[i].status === ResourceState.WAITING) {
                return true;
            }
        }
        return false;
    };

    var onProgress = function(resource, statusType) {
        // find the entry for the resource
        var entry = null;
        for (var i = 0, len = entries.length; i < len; i++) {
            if (entries[i].resource === resource) {
                entry = entries[i];
                break;
            }
        }

        // we have already updated the status of the resource
        if (entry == null || entry.status !== ResourceState.WAITING) {
            return;
        }
        entry.status = statusType;
        progressChanged = +new Date;

        var numResourceTags = resource.tags.length;

        // fire callbacks for interested listeners
        for (var i = 0, numListeners = progressListeners.length; i < numListeners; i++) {
            var listener = progressListeners[i],
                shouldCall;

            if (listener.tags.length === 0) {
                // no tags specified so always tell the listener
                shouldCall = true;
            } else {
                // listener only wants to hear about certain tags
                shouldCall = resource.tags.contains(listener.tags);
            }

            if (shouldCall) {
                sendProgress(entry, listener);
            }
        }
    };

    this.onLoad = function(resource) {
        onProgress(resource, ResourceState.LOADED);
    };
    this.onError = function(resource) {
        onProgress(resource, ResourceState.ERROR);
    };
    this.onTimeout = function(resource) {
        onProgress(resource, ResourceState.TIMEOUT);
    };

    // sends a progress report to a listener
    var sendProgress = function(updatedEntry, listener) {
        // find stats for all the resources the caller is interested in
        var completed = 0,
            total = 0;
        for (var i = 0, len = entries.length; i < len; i++) {
            var entry = entries[i],
                includeResource = false;

            if (listener.tags.length === 0) {
                // no tags specified so always tell the listener
                includeResource = true;
            } else {
                includeResource = entry.resource.tags.contains(listener.tags);
            }

            if (includeResource) {
                total++;
                if (entry.status === ResourceState.LOADED || entry.status === ResourceState.ERROR || entry.status === ResourceState.TIMEOUT) {
                    completed++;
                }
            }
        }

        listener.callback({
            // info about the resource that changed
            resource: updatedEntry.resource,

            // should we expose StatusType instead?
            loaded: (updatedEntry.status === ResourceState.LOADED),
            error: (updatedEntry.status === ResourceState.ERROR),
            timeout: (updatedEntry.status === ResourceState.TIMEOUT),

            // updated stats for all resources
            completedCount: completed,
            totalCount: total
        });
    };

    // prints the status of each resource to the console
    var log = this.log = function(showAll) {
        if (!window.console) {
            return;
        }

        var elapsedSeconds = Math.round((+new Date - timeStarted) / 1000);
        window.console.log('PxLoader elapsed: ' + elapsedSeconds + ' sec');

        for (var i = 0, len = entries.length; i < len; i++) {
            var entry = entries[i];
            if (!showAll && entry.status !== ResourceState.WAITING) {
                continue;
            }

            var message = 'PxLoader: #' + i + ' ' + entry.resource.getName();
            switch(entry.status) {
                case ResourceState.QUEUED:
                    message += ' (Not Started)';
                    break;
                case ResourceState.WAITING:
                    message += ' (Waiting)';
                    break;
                case ResourceState.LOADED:
                    message += ' (Loaded)';
                    break;
                case ResourceState.ERROR:
                    message += ' (Error)';
                    break;
                case ResourceState.TIMEOUT:
                    message += ' (Timeout)';
                    break;
            }

            if (entry.resource.tags.length > 0) {
                message += ' Tags: [' + entry.resource.tags.join(',') + ']';
            }

            window.console.log(message);
        }
    };
}

// Tag object to handle tag intersection; once created not meant to be changed
// Performance rationale: http://jsperf.com/lists-indexof-vs-in-operator/3

function PxLoaderTags(values) {

    this.array = [];
    this.object = {};
    this.value = null; // single value
    this.length = 0;

    if (values !== null && values !== undefined) {
        if (Array.isArray(values)) {
            this.array = values;
        } else if (typeof values === 'object') {
            for (var key in values) {
                this.array.push(key);
            }
        } else {
            this.array.push(values);
            this.value = values;
        }

        this.length = this.array.length;

        // convert array values to object with truthy values, used by contains function below
        for (var i = 0; i < this.length; i++) {
            this.object[this.array[i]] = true;
        }
    }

    // compare this object with another; return true if they share at least one value
    this.contains = function(other) {
        if (this.length === 0 || other.length === 0) {
            return false;
        } else if (this.length === 1 && this.value !== null) {
            if (other.length === 1) {
                return this.value === other.value;
            } else {
                return other.object.hasOwnProperty(this.value);
            }
        } else if (other.length < this.length) {
            return other.contains(this); // better to loop through the smaller object
        } else {
            for (var key in this.object) {
                if (other.object[key]) {
                    return true;
                }
            }
            return false;
        }
    }
}

// shims to ensure we have newer Array utility methods
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/isArray
if (!Array.isArray) {
    Array.isArray = function(arg) {
        return Object.prototype.toString.call(arg) == '[object Array]';
    };
}
;// @depends PxLoader.js
/**
 * PxLoader plugin to load images
 */

function PxLoaderImage(url, tags, priority) {
    var self = this,
        loader = null;

    this.img = new Image();
    this.tags = tags;
    this.priority = priority;

    var onReadyStateChange = function() {
        if (self.img.readyState == 'complete') {
            removeEventHandlers();
            loader.onLoad(self);
        }
    };

    var onLoad = function() {
        removeEventHandlers();
        loader.onLoad(self);
    };

    var onError = function() {
        removeEventHandlers();
        loader.onError(self);
    };

    var removeEventHandlers = function() {
        self.unbind('load', onLoad);
        self.unbind('readystatechange', onReadyStateChange);
        self.unbind('error', onError);
    };

    this.start = function(pxLoader) {
        // we need the loader ref so we can notify upon completion
        loader = pxLoader;

        // NOTE: Must add event listeners before the src is set. We
        // also need to use the readystatechange because sometimes
        // load doesn't fire when an image is in the cache.
        self.bind('load', onLoad);
        self.bind('readystatechange', onReadyStateChange);
        self.bind('error', onError);

        self.img.src = url;
    };

    // called by PxLoader to check status of image (fallback in case
    // the event listeners are not triggered).
    this.checkStatus = function() {
        if (self.img.complete) {
            removeEventHandlers();
            loader.onLoad(self);
        }
    };

    // called by PxLoader when it is no longer waiting
    this.onTimeout = function() {
        removeEventHandlers();
        if (self.img.complete) {
            loader.onLoad(self);
        } else {
            loader.onTimeout(self);
        }
    };

    // returns a name for the resource that can be used in logging
    this.getName = function() {
        return url;
    };

    // cross-browser event binding
    this.bind = function(eventName, eventHandler) {
        if (self.img.addEventListener) {
            self.img.addEventListener(eventName, eventHandler, false);
        } else if (self.img.attachEvent) {
            self.img.attachEvent('on' + eventName, eventHandler);
        }
    };

    // cross-browser event un-binding
    this.unbind = function(eventName, eventHandler) {
        if (self.img.removeEventListener) {
            self.img.removeEventListener(eventName, eventHandler, false);
        } else if (self.img.detachEvent) {
            self.img.detachEvent('on' + eventName, eventHandler);
        }
    };

}

// add a convenience method to PxLoader for adding an image
PxLoader.prototype.addImage = function(url, tags, priority) {
    var imageLoader = new PxLoaderImage(url, tags, priority);
    this.add(imageLoader);

    // return the img element to the caller
    return imageLoader.img;
};;/*
* Copyright (c) 2006-2007 Erin Catto http://www.gphysics.com
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
var Box2D = {};

(function (a2j, undefined) {

   if(!(Object.prototype.defineProperty instanceof Function)
      && Object.prototype.__defineGetter__ instanceof Function
      && Object.prototype.__defineSetter__ instanceof Function)
   {
      Object.defineProperty = function(obj, p, cfg) {
         if(cfg.get instanceof Function)
            obj.__defineGetter__(p, cfg.get);
         if(cfg.set instanceof Function)
            obj.__defineSetter__(p, cfg.set);
      }
   }
   
   function emptyFn() {};
   a2j.inherit = function(cls, base) {
      var tmpCtr = cls;
      emptyFn.prototype = base.prototype;
      cls.prototype = new emptyFn;
      cls.prototype.constructor = tmpCtr;
   };
   
   a2j.generateCallback = function generateCallback(context, cb) {
      return function () {
         cb.apply(context, arguments);
      };
   };
   
   a2j.NVector = function NVector(length) {
      if (length === undefined) length = 0;
      var tmp = new Array(length || 0);
      for (var i = 0; i < length; ++i)
      tmp[i] = 0;
      return tmp;
   };
   
   a2j.is = function is(o1, o2) {
      if (o1 === null) return false;
      if ((o2 instanceof Function) && (o1 instanceof o2)) return true;
      if ((o1.constructor.__implements != undefined) && (o1.constructor.__implements[o2])) return true;
      return false;
   };
   
   a2j.parseUInt = function(v) {
      return Math.abs(parseInt(v));
   }
   
})(Box2D);

//#TODO remove assignments from global namespace
var Vector = Array;
var Vector_a2j_Number = Box2D.NVector;
//package structure
if (typeof(Box2D) === "undefined") Box2D = {};
if (typeof(Box2D.Collision) === "undefined") Box2D.Collision = {};
if (typeof(Box2D.Collision.Shapes) === "undefined") Box2D.Collision.Shapes = {};
if (typeof(Box2D.Common) === "undefined") Box2D.Common = {};
if (typeof(Box2D.Common.Math) === "undefined") Box2D.Common.Math = {};
if (typeof(Box2D.Dynamics) === "undefined") Box2D.Dynamics = {};
if (typeof(Box2D.Dynamics.Contacts) === "undefined") Box2D.Dynamics.Contacts = {};
if (typeof(Box2D.Dynamics.Controllers) === "undefined") Box2D.Dynamics.Controllers = {};
if (typeof(Box2D.Dynamics.Joints) === "undefined") Box2D.Dynamics.Joints = {};
//pre-definitions
(function () {
   Box2D.Collision.IBroadPhase = 'Box2D.Collision.IBroadPhase';

   function b2AABB() {
      b2AABB.b2AABB.apply(this, arguments);
   };
   Box2D.Collision.b2AABB = b2AABB;

   function b2Bound() {
      b2Bound.b2Bound.apply(this, arguments);
   };
   Box2D.Collision.b2Bound = b2Bound;

   function b2BoundValues() {
      b2BoundValues.b2BoundValues.apply(this, arguments);
      if (this.constructor === b2BoundValues) this.b2BoundValues.apply(this, arguments);
   };
   Box2D.Collision.b2BoundValues = b2BoundValues;

   function b2Collision() {
      b2Collision.b2Collision.apply(this, arguments);
   };
   Box2D.Collision.b2Collision = b2Collision;

   function b2ContactID() {
      b2ContactID.b2ContactID.apply(this, arguments);
      if (this.constructor === b2ContactID) this.b2ContactID.apply(this, arguments);
   };
   Box2D.Collision.b2ContactID = b2ContactID;

   function b2ContactPoint() {
      b2ContactPoint.b2ContactPoint.apply(this, arguments);
   };
   Box2D.Collision.b2ContactPoint = b2ContactPoint;

   function b2Distance() {
      b2Distance.b2Distance.apply(this, arguments);
   };
   Box2D.Collision.b2Distance = b2Distance;

   function b2DistanceInput() {
      b2DistanceInput.b2DistanceInput.apply(this, arguments);
   };
   Box2D.Collision.b2DistanceInput = b2DistanceInput;

   function b2DistanceOutput() {
      b2DistanceOutput.b2DistanceOutput.apply(this, arguments);
   };
   Box2D.Collision.b2DistanceOutput = b2DistanceOutput;

   function b2DistanceProxy() {
      b2DistanceProxy.b2DistanceProxy.apply(this, arguments);
   };
   Box2D.Collision.b2DistanceProxy = b2DistanceProxy;

   function b2DynamicTree() {
      b2DynamicTree.b2DynamicTree.apply(this, arguments);
      if (this.constructor === b2DynamicTree) this.b2DynamicTree.apply(this, arguments);
   };
   Box2D.Collision.b2DynamicTree = b2DynamicTree;

   function b2DynamicTreeBroadPhase() {
      b2DynamicTreeBroadPhase.b2DynamicTreeBroadPhase.apply(this, arguments);
   };
   Box2D.Collision.b2DynamicTreeBroadPhase = b2DynamicTreeBroadPhase;

   function b2DynamicTreeNode() {
      b2DynamicTreeNode.b2DynamicTreeNode.apply(this, arguments);
   };
   Box2D.Collision.b2DynamicTreeNode = b2DynamicTreeNode;

   function b2DynamicTreePair() {
      b2DynamicTreePair.b2DynamicTreePair.apply(this, arguments);
   };
   Box2D.Collision.b2DynamicTreePair = b2DynamicTreePair;

   function b2Manifold() {
      b2Manifold.b2Manifold.apply(this, arguments);
      if (this.constructor === b2Manifold) this.b2Manifold.apply(this, arguments);
   };
   Box2D.Collision.b2Manifold = b2Manifold;

   function b2ManifoldPoint() {
      b2ManifoldPoint.b2ManifoldPoint.apply(this, arguments);
      if (this.constructor === b2ManifoldPoint) this.b2ManifoldPoint.apply(this, arguments);
   };
   Box2D.Collision.b2ManifoldPoint = b2ManifoldPoint;

   function b2Point() {
      b2Point.b2Point.apply(this, arguments);
   };
   Box2D.Collision.b2Point = b2Point;

   function b2RayCastInput() {
      b2RayCastInput.b2RayCastInput.apply(this, arguments);
      if (this.constructor === b2RayCastInput) this.b2RayCastInput.apply(this, arguments);
   };
   Box2D.Collision.b2RayCastInput = b2RayCastInput;

   function b2RayCastOutput() {
      b2RayCastOutput.b2RayCastOutput.apply(this, arguments);
   };
   Box2D.Collision.b2RayCastOutput = b2RayCastOutput;

   function b2Segment() {
      b2Segment.b2Segment.apply(this, arguments);
   };
   Box2D.Collision.b2Segment = b2Segment;

   function b2SeparationFunction() {
      b2SeparationFunction.b2SeparationFunction.apply(this, arguments);
   };
   Box2D.Collision.b2SeparationFunction = b2SeparationFunction;

   function b2Simplex() {
      b2Simplex.b2Simplex.apply(this, arguments);
      if (this.constructor === b2Simplex) this.b2Simplex.apply(this, arguments);
   };
   Box2D.Collision.b2Simplex = b2Simplex;

   function b2SimplexCache() {
      b2SimplexCache.b2SimplexCache.apply(this, arguments);
   };
   Box2D.Collision.b2SimplexCache = b2SimplexCache;

   function b2SimplexVertex() {
      b2SimplexVertex.b2SimplexVertex.apply(this, arguments);
   };
   Box2D.Collision.b2SimplexVertex = b2SimplexVertex;

   function b2TimeOfImpact() {
      b2TimeOfImpact.b2TimeOfImpact.apply(this, arguments);
   };
   Box2D.Collision.b2TimeOfImpact = b2TimeOfImpact;

   function b2TOIInput() {
      b2TOIInput.b2TOIInput.apply(this, arguments);
   };
   Box2D.Collision.b2TOIInput = b2TOIInput;

   function b2WorldManifold() {
      b2WorldManifold.b2WorldManifold.apply(this, arguments);
      if (this.constructor === b2WorldManifold) this.b2WorldManifold.apply(this, arguments);
   };
   Box2D.Collision.b2WorldManifold = b2WorldManifold;

   function ClipVertex() {
      ClipVertex.ClipVertex.apply(this, arguments);
   };
   Box2D.Collision.ClipVertex = ClipVertex;

   function Features() {
      Features.Features.apply(this, arguments);
   };
   Box2D.Collision.Features = Features;

   function b2CircleShape() {
      b2CircleShape.b2CircleShape.apply(this, arguments);
      if (this.constructor === b2CircleShape) this.b2CircleShape.apply(this, arguments);
   };
   Box2D.Collision.Shapes.b2CircleShape = b2CircleShape;

   function b2EdgeChainDef() {
      b2EdgeChainDef.b2EdgeChainDef.apply(this, arguments);
      if (this.constructor === b2EdgeChainDef) this.b2EdgeChainDef.apply(this, arguments);
   };
   Box2D.Collision.Shapes.b2EdgeChainDef = b2EdgeChainDef;

   function b2EdgeShape() {
      b2EdgeShape.b2EdgeShape.apply(this, arguments);
      if (this.constructor === b2EdgeShape) this.b2EdgeShape.apply(this, arguments);
   };
   Box2D.Collision.Shapes.b2EdgeShape = b2EdgeShape;

   function b2MassData() {
      b2MassData.b2MassData.apply(this, arguments);
   };
   Box2D.Collision.Shapes.b2MassData = b2MassData;

   function b2PolygonShape() {
      b2PolygonShape.b2PolygonShape.apply(this, arguments);
      if (this.constructor === b2PolygonShape) this.b2PolygonShape.apply(this, arguments);
   };
   Box2D.Collision.Shapes.b2PolygonShape = b2PolygonShape;

   function b2Shape() {
      b2Shape.b2Shape.apply(this, arguments);
      if (this.constructor === b2Shape) this.b2Shape.apply(this, arguments);
   };
   Box2D.Collision.Shapes.b2Shape = b2Shape;
   Box2D.Common.b2internal = 'Box2D.Common.b2internal';

   function b2Color() {
      b2Color.b2Color.apply(this, arguments);
      if (this.constructor === b2Color) this.b2Color.apply(this, arguments);
   };
   Box2D.Common.b2Color = b2Color;

   function b2Settings() {
      b2Settings.b2Settings.apply(this, arguments);
   };
   Box2D.Common.b2Settings = b2Settings;

   function b2Mat22() {
      b2Mat22.b2Mat22.apply(this, arguments);
      if (this.constructor === b2Mat22) this.b2Mat22.apply(this, arguments);
   };
   Box2D.Common.Math.b2Mat22 = b2Mat22;

   function b2Mat33() {
      b2Mat33.b2Mat33.apply(this, arguments);
      if (this.constructor === b2Mat33) this.b2Mat33.apply(this, arguments);
   };
   Box2D.Common.Math.b2Mat33 = b2Mat33;

   function b2Math() {
      b2Math.b2Math.apply(this, arguments);
   };
   Box2D.Common.Math.b2Math = b2Math;

   function b2Sweep() {
      b2Sweep.b2Sweep.apply(this, arguments);
   };
   Box2D.Common.Math.b2Sweep = b2Sweep;

   function b2Transform() {
      b2Transform.b2Transform.apply(this, arguments);
      if (this.constructor === b2Transform) this.b2Transform.apply(this, arguments);
   };
   Box2D.Common.Math.b2Transform = b2Transform;

   function b2Vec2() {
      b2Vec2.b2Vec2.apply(this, arguments);
      if (this.constructor === b2Vec2) this.b2Vec2.apply(this, arguments);
   };
   Box2D.Common.Math.b2Vec2 = b2Vec2;

   function b2Vec3() {
      b2Vec3.b2Vec3.apply(this, arguments);
      if (this.constructor === b2Vec3) this.b2Vec3.apply(this, arguments);
   };
   Box2D.Common.Math.b2Vec3 = b2Vec3;

   function b2Body() {
      b2Body.b2Body.apply(this, arguments);
      if (this.constructor === b2Body) this.b2Body.apply(this, arguments);
   };
   Box2D.Dynamics.b2Body = b2Body;

   function b2BodyDef() {
      b2BodyDef.b2BodyDef.apply(this, arguments);
      if (this.constructor === b2BodyDef) this.b2BodyDef.apply(this, arguments);
   };
   Box2D.Dynamics.b2BodyDef = b2BodyDef;

   function b2ContactFilter() {
      b2ContactFilter.b2ContactFilter.apply(this, arguments);
   };
   Box2D.Dynamics.b2ContactFilter = b2ContactFilter;

   function b2ContactImpulse() {
      b2ContactImpulse.b2ContactImpulse.apply(this, arguments);
   };
   Box2D.Dynamics.b2ContactImpulse = b2ContactImpulse;

   function b2ContactListener() {
      b2ContactListener.b2ContactListener.apply(this, arguments);
   };
   Box2D.Dynamics.b2ContactListener = b2ContactListener;

   function b2ContactManager() {
      b2ContactManager.b2ContactManager.apply(this, arguments);
      if (this.constructor === b2ContactManager) this.b2ContactManager.apply(this, arguments);
   };
   Box2D.Dynamics.b2ContactManager = b2ContactManager;

   function b2DebugDraw() {
      b2DebugDraw.b2DebugDraw.apply(this, arguments);
      if (this.constructor === b2DebugDraw) this.b2DebugDraw.apply(this, arguments);
   };
   Box2D.Dynamics.b2DebugDraw = b2DebugDraw;

   function b2DestructionListener() {
      b2DestructionListener.b2DestructionListener.apply(this, arguments);
   };
   Box2D.Dynamics.b2DestructionListener = b2DestructionListener;

   function b2FilterData() {
      b2FilterData.b2FilterData.apply(this, arguments);
   };
   Box2D.Dynamics.b2FilterData = b2FilterData;

   function b2Fixture() {
      b2Fixture.b2Fixture.apply(this, arguments);
      if (this.constructor === b2Fixture) this.b2Fixture.apply(this, arguments);
   };
   Box2D.Dynamics.b2Fixture = b2Fixture;

   function b2FixtureDef() {
      b2FixtureDef.b2FixtureDef.apply(this, arguments);
      if (this.constructor === b2FixtureDef) this.b2FixtureDef.apply(this, arguments);
   };
   Box2D.Dynamics.b2FixtureDef = b2FixtureDef;

   function b2Island() {
      b2Island.b2Island.apply(this, arguments);
      if (this.constructor === b2Island) this.b2Island.apply(this, arguments);
   };
   Box2D.Dynamics.b2Island = b2Island;

   function b2TimeStep() {
      b2TimeStep.b2TimeStep.apply(this, arguments);
   };
   Box2D.Dynamics.b2TimeStep = b2TimeStep;

   function b2World() {
      b2World.b2World.apply(this, arguments);
      if (this.constructor === b2World) this.b2World.apply(this, arguments);
   };
   Box2D.Dynamics.b2World = b2World;

   function b2CircleContact() {
      b2CircleContact.b2CircleContact.apply(this, arguments);
   };
   Box2D.Dynamics.Contacts.b2CircleContact = b2CircleContact;

   function b2Contact() {
      b2Contact.b2Contact.apply(this, arguments);
      if (this.constructor === b2Contact) this.b2Contact.apply(this, arguments);
   };
   Box2D.Dynamics.Contacts.b2Contact = b2Contact;

   function b2ContactConstraint() {
      b2ContactConstraint.b2ContactConstraint.apply(this, arguments);
      if (this.constructor === b2ContactConstraint) this.b2ContactConstraint.apply(this, arguments);
   };
   Box2D.Dynamics.Contacts.b2ContactConstraint = b2ContactConstraint;

   function b2ContactConstraintPoint() {
      b2ContactConstraintPoint.b2ContactConstraintPoint.apply(this, arguments);
   };
   Box2D.Dynamics.Contacts.b2ContactConstraintPoint = b2ContactConstraintPoint;

   function b2ContactEdge() {
      b2ContactEdge.b2ContactEdge.apply(this, arguments);
   };
   Box2D.Dynamics.Contacts.b2ContactEdge = b2ContactEdge;

   function b2ContactFactory() {
      b2ContactFactory.b2ContactFactory.apply(this, arguments);
      if (this.constructor === b2ContactFactory) this.b2ContactFactory.apply(this, arguments);
   };
   Box2D.Dynamics.Contacts.b2ContactFactory = b2ContactFactory;

   function b2ContactRegister() {
      b2ContactRegister.b2ContactRegister.apply(this, arguments);
   };
   Box2D.Dynamics.Contacts.b2ContactRegister = b2ContactRegister;

   function b2ContactResult() {
      b2ContactResult.b2ContactResult.apply(this, arguments);
   };
   Box2D.Dynamics.Contacts.b2ContactResult = b2ContactResult;

   function b2ContactSolver() {
      b2ContactSolver.b2ContactSolver.apply(this, arguments);
      if (this.constructor === b2ContactSolver) this.b2ContactSolver.apply(this, arguments);
   };
   Box2D.Dynamics.Contacts.b2ContactSolver = b2ContactSolver;

   function b2EdgeAndCircleContact() {
      b2EdgeAndCircleContact.b2EdgeAndCircleContact.apply(this, arguments);
   };
   Box2D.Dynamics.Contacts.b2EdgeAndCircleContact = b2EdgeAndCircleContact;

   function b2NullContact() {
      b2NullContact.b2NullContact.apply(this, arguments);
      if (this.constructor === b2NullContact) this.b2NullContact.apply(this, arguments);
   };
   Box2D.Dynamics.Contacts.b2NullContact = b2NullContact;

   function b2PolyAndCircleContact() {
      b2PolyAndCircleContact.b2PolyAndCircleContact.apply(this, arguments);
   };
   Box2D.Dynamics.Contacts.b2PolyAndCircleContact = b2PolyAndCircleContact;

   function b2PolyAndEdgeContact() {
      b2PolyAndEdgeContact.b2PolyAndEdgeContact.apply(this, arguments);
   };
   Box2D.Dynamics.Contacts.b2PolyAndEdgeContact = b2PolyAndEdgeContact;

   function b2PolygonContact() {
      b2PolygonContact.b2PolygonContact.apply(this, arguments);
   };
   Box2D.Dynamics.Contacts.b2PolygonContact = b2PolygonContact;

   function b2PositionSolverManifold() {
      b2PositionSolverManifold.b2PositionSolverManifold.apply(this, arguments);
      if (this.constructor === b2PositionSolverManifold) this.b2PositionSolverManifold.apply(this, arguments);
   };
   Box2D.Dynamics.Contacts.b2PositionSolverManifold = b2PositionSolverManifold;

   function b2BuoyancyController() {
      b2BuoyancyController.b2BuoyancyController.apply(this, arguments);
   };
   Box2D.Dynamics.Controllers.b2BuoyancyController = b2BuoyancyController;

   function b2ConstantAccelController() {
      b2ConstantAccelController.b2ConstantAccelController.apply(this, arguments);
   };
   Box2D.Dynamics.Controllers.b2ConstantAccelController = b2ConstantAccelController;

   function b2ConstantForceController() {
      b2ConstantForceController.b2ConstantForceController.apply(this, arguments);
   };
   Box2D.Dynamics.Controllers.b2ConstantForceController = b2ConstantForceController;

   function b2Controller() {
      b2Controller.b2Controller.apply(this, arguments);
   };
   Box2D.Dynamics.Controllers.b2Controller = b2Controller;

   function b2ControllerEdge() {
      b2ControllerEdge.b2ControllerEdge.apply(this, arguments);
   };
   Box2D.Dynamics.Controllers.b2ControllerEdge = b2ControllerEdge;

   function b2GravityController() {
      b2GravityController.b2GravityController.apply(this, arguments);
   };
   Box2D.Dynamics.Controllers.b2GravityController = b2GravityController;

   function b2TensorDampingController() {
      b2TensorDampingController.b2TensorDampingController.apply(this, arguments);
   };
   Box2D.Dynamics.Controllers.b2TensorDampingController = b2TensorDampingController;

   function b2DistanceJoint() {
      b2DistanceJoint.b2DistanceJoint.apply(this, arguments);
      if (this.constructor === b2DistanceJoint) this.b2DistanceJoint.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2DistanceJoint = b2DistanceJoint;

   function b2DistanceJointDef() {
      b2DistanceJointDef.b2DistanceJointDef.apply(this, arguments);
      if (this.constructor === b2DistanceJointDef) this.b2DistanceJointDef.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2DistanceJointDef = b2DistanceJointDef;

   function b2FrictionJoint() {
      b2FrictionJoint.b2FrictionJoint.apply(this, arguments);
      if (this.constructor === b2FrictionJoint) this.b2FrictionJoint.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2FrictionJoint = b2FrictionJoint;

   function b2FrictionJointDef() {
      b2FrictionJointDef.b2FrictionJointDef.apply(this, arguments);
      if (this.constructor === b2FrictionJointDef) this.b2FrictionJointDef.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2FrictionJointDef = b2FrictionJointDef;

   function b2GearJoint() {
      b2GearJoint.b2GearJoint.apply(this, arguments);
      if (this.constructor === b2GearJoint) this.b2GearJoint.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2GearJoint = b2GearJoint;

   function b2GearJointDef() {
      b2GearJointDef.b2GearJointDef.apply(this, arguments);
      if (this.constructor === b2GearJointDef) this.b2GearJointDef.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2GearJointDef = b2GearJointDef;

   function b2Jacobian() {
      b2Jacobian.b2Jacobian.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2Jacobian = b2Jacobian;

   function b2Joint() {
      b2Joint.b2Joint.apply(this, arguments);
      if (this.constructor === b2Joint) this.b2Joint.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2Joint = b2Joint;

   function b2JointDef() {
      b2JointDef.b2JointDef.apply(this, arguments);
      if (this.constructor === b2JointDef) this.b2JointDef.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2JointDef = b2JointDef;

   function b2JointEdge() {
      b2JointEdge.b2JointEdge.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2JointEdge = b2JointEdge;

   function b2LineJoint() {
      b2LineJoint.b2LineJoint.apply(this, arguments);
      if (this.constructor === b2LineJoint) this.b2LineJoint.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2LineJoint = b2LineJoint;

   function b2LineJointDef() {
      b2LineJointDef.b2LineJointDef.apply(this, arguments);
      if (this.constructor === b2LineJointDef) this.b2LineJointDef.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2LineJointDef = b2LineJointDef;

   function b2MouseJoint() {
      b2MouseJoint.b2MouseJoint.apply(this, arguments);
      if (this.constructor === b2MouseJoint) this.b2MouseJoint.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2MouseJoint = b2MouseJoint;

   function b2MouseJointDef() {
      b2MouseJointDef.b2MouseJointDef.apply(this, arguments);
      if (this.constructor === b2MouseJointDef) this.b2MouseJointDef.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2MouseJointDef = b2MouseJointDef;

   function b2PrismaticJoint() {
      b2PrismaticJoint.b2PrismaticJoint.apply(this, arguments);
      if (this.constructor === b2PrismaticJoint) this.b2PrismaticJoint.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2PrismaticJoint = b2PrismaticJoint;

   function b2PrismaticJointDef() {
      b2PrismaticJointDef.b2PrismaticJointDef.apply(this, arguments);
      if (this.constructor === b2PrismaticJointDef) this.b2PrismaticJointDef.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2PrismaticJointDef = b2PrismaticJointDef;

   function b2PulleyJoint() {
      b2PulleyJoint.b2PulleyJoint.apply(this, arguments);
      if (this.constructor === b2PulleyJoint) this.b2PulleyJoint.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2PulleyJoint = b2PulleyJoint;

   function b2PulleyJointDef() {
      b2PulleyJointDef.b2PulleyJointDef.apply(this, arguments);
      if (this.constructor === b2PulleyJointDef) this.b2PulleyJointDef.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2PulleyJointDef = b2PulleyJointDef;

   function b2RevoluteJoint() {
      b2RevoluteJoint.b2RevoluteJoint.apply(this, arguments);
      if (this.constructor === b2RevoluteJoint) this.b2RevoluteJoint.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2RevoluteJoint = b2RevoluteJoint;

   function b2RevoluteJointDef() {
      b2RevoluteJointDef.b2RevoluteJointDef.apply(this, arguments);
      if (this.constructor === b2RevoluteJointDef) this.b2RevoluteJointDef.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2RevoluteJointDef = b2RevoluteJointDef;

   function b2WeldJoint() {
      b2WeldJoint.b2WeldJoint.apply(this, arguments);
      if (this.constructor === b2WeldJoint) this.b2WeldJoint.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2WeldJoint = b2WeldJoint;

   function b2WeldJointDef() {
      b2WeldJointDef.b2WeldJointDef.apply(this, arguments);
      if (this.constructor === b2WeldJointDef) this.b2WeldJointDef.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2WeldJointDef = b2WeldJointDef;
})(); //definitions
Box2D.postDefs = [];
(function () {
   var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
      b2EdgeChainDef = Box2D.Collision.Shapes.b2EdgeChainDef,
      b2EdgeShape = Box2D.Collision.Shapes.b2EdgeShape,
      b2MassData = Box2D.Collision.Shapes.b2MassData,
      b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
      b2Shape = Box2D.Collision.Shapes.b2Shape,
      b2Color = Box2D.Common.b2Color,
      b2internal = Box2D.Common.b2internal,
      b2Settings = Box2D.Common.b2Settings,
      b2Mat22 = Box2D.Common.Math.b2Mat22,
      b2Mat33 = Box2D.Common.Math.b2Mat33,
      b2Math = Box2D.Common.Math.b2Math,
      b2Sweep = Box2D.Common.Math.b2Sweep,
      b2Transform = Box2D.Common.Math.b2Transform,
      b2Vec2 = Box2D.Common.Math.b2Vec2,
      b2Vec3 = Box2D.Common.Math.b2Vec3,
      b2AABB = Box2D.Collision.b2AABB,
      b2Bound = Box2D.Collision.b2Bound,
      b2BoundValues = Box2D.Collision.b2BoundValues,
      b2Collision = Box2D.Collision.b2Collision,
      b2ContactID = Box2D.Collision.b2ContactID,
      b2ContactPoint = Box2D.Collision.b2ContactPoint,
      b2Distance = Box2D.Collision.b2Distance,
      b2DistanceInput = Box2D.Collision.b2DistanceInput,
      b2DistanceOutput = Box2D.Collision.b2DistanceOutput,
      b2DistanceProxy = Box2D.Collision.b2DistanceProxy,
      b2DynamicTree = Box2D.Collision.b2DynamicTree,
      b2DynamicTreeBroadPhase = Box2D.Collision.b2DynamicTreeBroadPhase,
      b2DynamicTreeNode = Box2D.Collision.b2DynamicTreeNode,
      b2DynamicTreePair = Box2D.Collision.b2DynamicTreePair,
      b2Manifold = Box2D.Collision.b2Manifold,
      b2ManifoldPoint = Box2D.Collision.b2ManifoldPoint,
      b2Point = Box2D.Collision.b2Point,
      b2RayCastInput = Box2D.Collision.b2RayCastInput,
      b2RayCastOutput = Box2D.Collision.b2RayCastOutput,
      b2Segment = Box2D.Collision.b2Segment,
      b2SeparationFunction = Box2D.Collision.b2SeparationFunction,
      b2Simplex = Box2D.Collision.b2Simplex,
      b2SimplexCache = Box2D.Collision.b2SimplexCache,
      b2SimplexVertex = Box2D.Collision.b2SimplexVertex,
      b2TimeOfImpact = Box2D.Collision.b2TimeOfImpact,
      b2TOIInput = Box2D.Collision.b2TOIInput,
      b2WorldManifold = Box2D.Collision.b2WorldManifold,
      ClipVertex = Box2D.Collision.ClipVertex,
      Features = Box2D.Collision.Features,
      IBroadPhase = Box2D.Collision.IBroadPhase;

   b2AABB.b2AABB = function () {
      this.lowerBound = new b2Vec2();
      this.upperBound = new b2Vec2();
   };
   b2AABB.prototype.IsValid = function () {
      var dX = this.upperBound.x - this.lowerBound.x;
      var dY = this.upperBound.y - this.lowerBound.y;
      var valid = dX >= 0.0 && dY >= 0.0;
      valid = valid && this.lowerBound.IsValid() && this.upperBound.IsValid();
      return valid;
   }
   b2AABB.prototype.GetCenter = function () {
      return new b2Vec2((this.lowerBound.x + this.upperBound.x) / 2, (this.lowerBound.y + this.upperBound.y) / 2);
   }
   b2AABB.prototype.GetExtents = function () {
      return new b2Vec2((this.upperBound.x - this.lowerBound.x) / 2, (this.upperBound.y - this.lowerBound.y) / 2);
   }
   b2AABB.prototype.Contains = function (aabb) {
      var result = true;
      result = result && this.lowerBound.x <= aabb.lowerBound.x;
      result = result && this.lowerBound.y <= aabb.lowerBound.y;
      result = result && aabb.upperBound.x <= this.upperBound.x;
      result = result && aabb.upperBound.y <= this.upperBound.y;
      return result;
   }
   b2AABB.prototype.RayCast = function (output, input) {
      var tmin = (-Number.MAX_VALUE);
      var tmax = Number.MAX_VALUE;
      var pX = input.p1.x;
      var pY = input.p1.y;
      var dX = input.p2.x - input.p1.x;
      var dY = input.p2.y - input.p1.y;
      var absDX = Math.abs(dX);
      var absDY = Math.abs(dY);
      var normal = output.normal;
      var inv_d = 0;
      var t1 = 0;
      var t2 = 0;
      var t3 = 0;
      var s = 0; {
         if (absDX < Number.MIN_VALUE) {
            if (pX < this.lowerBound.x || this.upperBound.x < pX) return false;
         }
         else {
            inv_d = 1.0 / dX;
            t1 = (this.lowerBound.x - pX) * inv_d;
            t2 = (this.upperBound.x - pX) * inv_d;
            s = (-1.0);
            if (t1 > t2) {
               t3 = t1;
               t1 = t2;
               t2 = t3;
               s = 1.0;
            }
            if (t1 > tmin) {
               normal.x = s;
               normal.y = 0;
               tmin = t1;
            }
            tmax = Math.min(tmax, t2);
            if (tmin > tmax) return false;
         }
      } {
         if (absDY < Number.MIN_VALUE) {
            if (pY < this.lowerBound.y || this.upperBound.y < pY) return false;
         }
         else {
            inv_d = 1.0 / dY;
            t1 = (this.lowerBound.y - pY) * inv_d;
            t2 = (this.upperBound.y - pY) * inv_d;
            s = (-1.0);
            if (t1 > t2) {
               t3 = t1;
               t1 = t2;
               t2 = t3;
               s = 1.0;
            }
            if (t1 > tmin) {
               normal.y = s;
               normal.x = 0;
               tmin = t1;
            }
            tmax = Math.min(tmax, t2);
            if (tmin > tmax) return false;
         }
      }
      output.fraction = tmin;
      return true;
   }
   b2AABB.prototype.TestOverlap = function (other) {
      var d1X = other.lowerBound.x - this.upperBound.x;
      var d1Y = other.lowerBound.y - this.upperBound.y;
      var d2X = this.lowerBound.x - other.upperBound.x;
      var d2Y = this.lowerBound.y - other.upperBound.y;
      if (d1X > 0.0 || d1Y > 0.0) return false;
      if (d2X > 0.0 || d2Y > 0.0) return false;
      return true;
   }
   b2AABB.Combine = function (aabb1, aabb2) {
      var aabb = new b2AABB();
      aabb.Combine(aabb1, aabb2);
      return aabb;
   }
   b2AABB.prototype.Combine = function (aabb1, aabb2) {
      this.lowerBound.x = Math.min(aabb1.lowerBound.x, aabb2.lowerBound.x);
      this.lowerBound.y = Math.min(aabb1.lowerBound.y, aabb2.lowerBound.y);
      this.upperBound.x = Math.max(aabb1.upperBound.x, aabb2.upperBound.x);
      this.upperBound.y = Math.max(aabb1.upperBound.y, aabb2.upperBound.y);
   }
   b2Bound.b2Bound = function () {};
   b2Bound.prototype.IsLower = function () {
      return (this.value & 1) == 0;
   }
   b2Bound.prototype.IsUpper = function () {
      return (this.value & 1) == 1;
   }
   b2Bound.prototype.Swap = function (b) {
      var tempValue = this.value;
      var tempProxy = this.proxy;
      var tempStabbingCount = this.stabbingCount;
      this.value = b.value;
      this.proxy = b.proxy;
      this.stabbingCount = b.stabbingCount;
      b.value = tempValue;
      b.proxy = tempProxy;
      b.stabbingCount = tempStabbingCount;
   }
   b2BoundValues.b2BoundValues = function () {};
   b2BoundValues.prototype.b2BoundValues = function () {
      this.lowerValues = new Vector_a2j_Number();
      this.lowerValues[0] = 0.0;
      this.lowerValues[1] = 0.0;
      this.upperValues = new Vector_a2j_Number();
      this.upperValues[0] = 0.0;
      this.upperValues[1] = 0.0;
   }
   b2Collision.b2Collision = function () {};
   b2Collision.ClipSegmentToLine = function (vOut, vIn, normal, offset) {
      if (offset === undefined) offset = 0;
      var cv;
      var numOut = 0;
      cv = vIn[0];
      var vIn0 = cv.v;
      cv = vIn[1];
      var vIn1 = cv.v;
      var distance0 = normal.x * vIn0.x + normal.y * vIn0.y - offset;
      var distance1 = normal.x * vIn1.x + normal.y * vIn1.y - offset;
      if (distance0 <= 0.0) vOut[numOut++].Set(vIn[0]);
      if (distance1 <= 0.0) vOut[numOut++].Set(vIn[1]);
      if (distance0 * distance1 < 0.0) {
         var interp = distance0 / (distance0 - distance1);
         cv = vOut[numOut];
         var tVec = cv.v;
         tVec.x = vIn0.x + interp * (vIn1.x - vIn0.x);
         tVec.y = vIn0.y + interp * (vIn1.y - vIn0.y);
         cv = vOut[numOut];
         var cv2;
         if (distance0 > 0.0) {
            cv2 = vIn[0];
            cv.id = cv2.id;
         }
         else {
            cv2 = vIn[1];
            cv.id = cv2.id;
         }++numOut;
      }
      return numOut;
   }
   b2Collision.EdgeSeparation = function (poly1, xf1, edge1, poly2, xf2) {
      if (edge1 === undefined) edge1 = 0;
      var count1 = parseInt(poly1.m_vertexCount);
      var vertices1 = poly1.m_vertices;
      var normals1 = poly1.m_normals;
      var count2 = parseInt(poly2.m_vertexCount);
      var vertices2 = poly2.m_vertices;
      var tMat;
      var tVec;
      tMat = xf1.R;
      tVec = normals1[edge1];
      var normal1WorldX = (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
      var normal1WorldY = (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      tMat = xf2.R;
      var normal1X = (tMat.col1.x * normal1WorldX + tMat.col1.y * normal1WorldY);
      var normal1Y = (tMat.col2.x * normal1WorldX + tMat.col2.y * normal1WorldY);
      var index = 0;
      var minDot = Number.MAX_VALUE;
      for (var i = 0; i < count2; ++i) {
         tVec = vertices2[i];
         var dot = tVec.x * normal1X + tVec.y * normal1Y;
         if (dot < minDot) {
            minDot = dot;
            index = i;
         }
      }
      tVec = vertices1[edge1];
      tMat = xf1.R;
      var v1X = xf1.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
      var v1Y = xf1.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      tVec = vertices2[index];
      tMat = xf2.R;
      var v2X = xf2.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
      var v2Y = xf2.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      v2X -= v1X;
      v2Y -= v1Y;
      var separation = v2X * normal1WorldX + v2Y * normal1WorldY;
      return separation;
   }
   b2Collision.FindMaxSeparation = function (edgeIndex, poly1, xf1, poly2, xf2) {
      var count1 = parseInt(poly1.m_vertexCount);
      var normals1 = poly1.m_normals;
      var tVec;
      var tMat;
      tMat = xf2.R;
      tVec = poly2.m_centroid;
      var dX = xf2.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
      var dY = xf2.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      tMat = xf1.R;
      tVec = poly1.m_centroid;
      dX -= xf1.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
      dY -= xf1.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      var dLocal1X = (dX * xf1.R.col1.x + dY * xf1.R.col1.y);
      var dLocal1Y = (dX * xf1.R.col2.x + dY * xf1.R.col2.y);
      var edge = 0;
      var maxDot = (-Number.MAX_VALUE);
      for (var i = 0; i < count1; ++i) {
         tVec = normals1[i];
         var dot = (tVec.x * dLocal1X + tVec.y * dLocal1Y);
         if (dot > maxDot) {
            maxDot = dot;
            edge = i;
         }
      }
      var s = b2Collision.EdgeSeparation(poly1, xf1, edge, poly2, xf2);
      var prevEdge = parseInt(edge - 1 >= 0 ? edge - 1 : count1 - 1);
      var sPrev = b2Collision.EdgeSeparation(poly1, xf1, prevEdge, poly2, xf2);
      var nextEdge = parseInt(edge + 1 < count1 ? edge + 1 : 0);
      var sNext = b2Collision.EdgeSeparation(poly1, xf1, nextEdge, poly2, xf2);
      var bestEdge = 0;
      var bestSeparation = 0;
      var increment = 0;
      if (sPrev > s && sPrev > sNext) {
         increment = (-1);
         bestEdge = prevEdge;
         bestSeparation = sPrev;
      }
      else if (sNext > s) {
         increment = 1;
         bestEdge = nextEdge;
         bestSeparation = sNext;
      }
      else {
         edgeIndex[0] = edge;
         return s;
      }
      while (true) {
         if (increment == (-1)) edge = bestEdge - 1 >= 0 ? bestEdge - 1 : count1 - 1;
         else edge = bestEdge + 1 < count1 ? bestEdge + 1 : 0;s = b2Collision.EdgeSeparation(poly1, xf1, edge, poly2, xf2);
         if (s > bestSeparation) {
            bestEdge = edge;
            bestSeparation = s;
         }
         else {
            break;
         }
      }
      edgeIndex[0] = bestEdge;
      return bestSeparation;
   }
   b2Collision.FindIncidentEdge = function (c, poly1, xf1, edge1, poly2, xf2) {
      if (edge1 === undefined) edge1 = 0;
      var count1 = parseInt(poly1.m_vertexCount);
      var normals1 = poly1.m_normals;
      var count2 = parseInt(poly2.m_vertexCount);
      var vertices2 = poly2.m_vertices;
      var normals2 = poly2.m_normals;
      var tMat;
      var tVec;
      tMat = xf1.R;
      tVec = normals1[edge1];
      var normal1X = (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
      var normal1Y = (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      tMat = xf2.R;
      var tX = (tMat.col1.x * normal1X + tMat.col1.y * normal1Y);
      normal1Y = (tMat.col2.x * normal1X + tMat.col2.y * normal1Y);
      normal1X = tX;
      var index = 0;
      var minDot = Number.MAX_VALUE;
      for (var i = 0; i < count2; ++i) {
         tVec = normals2[i];
         var dot = (normal1X * tVec.x + normal1Y * tVec.y);
         if (dot < minDot) {
            minDot = dot;
            index = i;
         }
      }
      var tClip;
      var i1 = parseInt(index);
      var i2 = parseInt(i1 + 1 < count2 ? i1 + 1 : 0);
      tClip = c[0];
      tVec = vertices2[i1];
      tMat = xf2.R;
      tClip.v.x = xf2.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
      tClip.v.y = xf2.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      tClip.id.features.referenceEdge = edge1;
      tClip.id.features.incidentEdge = i1;
      tClip.id.features.incidentVertex = 0;
      tClip = c[1];
      tVec = vertices2[i2];
      tMat = xf2.R;
      tClip.v.x = xf2.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
      tClip.v.y = xf2.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      tClip.id.features.referenceEdge = edge1;
      tClip.id.features.incidentEdge = i2;
      tClip.id.features.incidentVertex = 1;
   }
   b2Collision.MakeClipPointVector = function () {
      var r = new Vector(2);
      r[0] = new ClipVertex();
      r[1] = new ClipVertex();
      return r;
   }
   b2Collision.CollidePolygons = function (manifold, polyA, xfA, polyB, xfB) {
      var cv;
      manifold.m_pointCount = 0;
      var totalRadius = polyA.m_radius + polyB.m_radius;
      var edgeA = 0;
      b2Collision.s_edgeAO[0] = edgeA;
      var separationA = b2Collision.FindMaxSeparation(b2Collision.s_edgeAO, polyA, xfA, polyB, xfB);
      edgeA = b2Collision.s_edgeAO[0];
      if (separationA > totalRadius) return;
      var edgeB = 0;
      b2Collision.s_edgeBO[0] = edgeB;
      var separationB = b2Collision.FindMaxSeparation(b2Collision.s_edgeBO, polyB, xfB, polyA, xfA);
      edgeB = b2Collision.s_edgeBO[0];
      if (separationB > totalRadius) return;
      var poly1;
      var poly2;
      var xf1;
      var xf2;
      var edge1 = 0;
      var flip = 0;
      var k_relativeTol = 0.98;
      var k_absoluteTol = 0.001;
      var tMat;
      if (separationB > k_relativeTol * separationA + k_absoluteTol) {
         poly1 = polyB;
         poly2 = polyA;
         xf1 = xfB;
         xf2 = xfA;
         edge1 = edgeB;
         manifold.m_type = b2Manifold.e_faceB;
         flip = 1;
      }
      else {
         poly1 = polyA;
         poly2 = polyB;
         xf1 = xfA;
         xf2 = xfB;
         edge1 = edgeA;
         manifold.m_type = b2Manifold.e_faceA;
         flip = 0;
      }
      var incidentEdge = b2Collision.s_incidentEdge;
      b2Collision.FindIncidentEdge(incidentEdge, poly1, xf1, edge1, poly2, xf2);
      var count1 = parseInt(poly1.m_vertexCount);
      var vertices1 = poly1.m_vertices;
      var local_v11 = vertices1[edge1];
      var local_v12;
      if (edge1 + 1 < count1) {
         local_v12 = vertices1[parseInt(edge1 + 1)];
      }
      else {
         local_v12 = vertices1[0];
      }
      var localTangent = b2Collision.s_localTangent;
      localTangent.Set(local_v12.x - local_v11.x, local_v12.y - local_v11.y);
      localTangent.Normalize();
      var localNormal = b2Collision.s_localNormal;
      localNormal.x = localTangent.y;
      localNormal.y = (-localTangent.x);
      var planePoint = b2Collision.s_planePoint;
      planePoint.Set(0.5 * (local_v11.x + local_v12.x), 0.5 * (local_v11.y + local_v12.y));
      var tangent = b2Collision.s_tangent;
      tMat = xf1.R;
      tangent.x = (tMat.col1.x * localTangent.x + tMat.col2.x * localTangent.y);
      tangent.y = (tMat.col1.y * localTangent.x + tMat.col2.y * localTangent.y);
      var tangent2 = b2Collision.s_tangent2;
      tangent2.x = (-tangent.x);
      tangent2.y = (-tangent.y);
      var normal = b2Collision.s_normal;
      normal.x = tangent.y;
      normal.y = (-tangent.x);
      var v11 = b2Collision.s_v11;
      var v12 = b2Collision.s_v12;
      v11.x = xf1.position.x + (tMat.col1.x * local_v11.x + tMat.col2.x * local_v11.y);
      v11.y = xf1.position.y + (tMat.col1.y * local_v11.x + tMat.col2.y * local_v11.y);
      v12.x = xf1.position.x + (tMat.col1.x * local_v12.x + tMat.col2.x * local_v12.y);
      v12.y = xf1.position.y + (tMat.col1.y * local_v12.x + tMat.col2.y * local_v12.y);
      var frontOffset = normal.x * v11.x + normal.y * v11.y;
      var sideOffset1 = (-tangent.x * v11.x) - tangent.y * v11.y + totalRadius;
      var sideOffset2 = tangent.x * v12.x + tangent.y * v12.y + totalRadius;
      var clipPoints1 = b2Collision.s_clipPoints1;
      var clipPoints2 = b2Collision.s_clipPoints2;
      var np = 0;
      np = b2Collision.ClipSegmentToLine(clipPoints1, incidentEdge, tangent2, sideOffset1);
      if (np < 2) return;
      np = b2Collision.ClipSegmentToLine(clipPoints2, clipPoints1, tangent, sideOffset2);
      if (np < 2) return;
      manifold.m_localPlaneNormal.SetV(localNormal);
      manifold.m_localPoint.SetV(planePoint);
      var pointCount = 0;
      for (var i = 0; i < b2Settings.b2_maxManifoldPoints; ++i) {
         cv = clipPoints2[i];
         var separation = normal.x * cv.v.x + normal.y * cv.v.y - frontOffset;
         if (separation <= totalRadius) {
            var cp = manifold.m_points[pointCount];
            tMat = xf2.R;
            var tX = cv.v.x - xf2.position.x;
            var tY = cv.v.y - xf2.position.y;
            cp.m_localPoint.x = (tX * tMat.col1.x + tY * tMat.col1.y);
            cp.m_localPoint.y = (tX * tMat.col2.x + tY * tMat.col2.y);
            cp.m_id.Set(cv.id);
            cp.m_id.features.flip = flip;
            ++pointCount;
         }
      }
      manifold.m_pointCount = pointCount;
   }
   b2Collision.CollideCircles = function (manifold, circle1, xf1, circle2, xf2) {
      manifold.m_pointCount = 0;
      var tMat;
      var tVec;
      tMat = xf1.R;
      tVec = circle1.m_p;
      var p1X = xf1.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
      var p1Y = xf1.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      tMat = xf2.R;
      tVec = circle2.m_p;
      var p2X = xf2.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
      var p2Y = xf2.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      var dX = p2X - p1X;
      var dY = p2Y - p1Y;
      var distSqr = dX * dX + dY * dY;
      var radius = circle1.m_radius + circle2.m_radius;
      if (distSqr > radius * radius) {
         return;
      }
      manifold.m_type = b2Manifold.e_circles;
      manifold.m_localPoint.SetV(circle1.m_p);
      manifold.m_localPlaneNormal.SetZero();
      manifold.m_pointCount = 1;
      manifold.m_points[0].m_localPoint.SetV(circle2.m_p);
      manifold.m_points[0].m_id.key = 0;
   }
   b2Collision.CollidePolygonAndCircle = function (manifold, polygon, xf1, circle, xf2) {
      manifold.m_pointCount = 0;
      var tPoint;
      var dX = 0;
      var dY = 0;
      var positionX = 0;
      var positionY = 0;
      var tVec;
      var tMat;
      tMat = xf2.R;
      tVec = circle.m_p;
      var cX = xf2.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
      var cY = xf2.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      dX = cX - xf1.position.x;
      dY = cY - xf1.position.y;
      tMat = xf1.R;
      var cLocalX = (dX * tMat.col1.x + dY * tMat.col1.y);
      var cLocalY = (dX * tMat.col2.x + dY * tMat.col2.y);
      var dist = 0;
      var normalIndex = 0;
      var separation = (-Number.MAX_VALUE);
      var radius = polygon.m_radius + circle.m_radius;
      var vertexCount = parseInt(polygon.m_vertexCount);
      var vertices = polygon.m_vertices;
      var normals = polygon.m_normals;
      for (var i = 0; i < vertexCount; ++i) {
         tVec = vertices[i];
         dX = cLocalX - tVec.x;
         dY = cLocalY - tVec.y;
         tVec = normals[i];
         var s = tVec.x * dX + tVec.y * dY;
         if (s > radius) {
            return;
         }
         if (s > separation) {
            separation = s;
            normalIndex = i;
         }
      }
      var vertIndex1 = parseInt(normalIndex);
      var vertIndex2 = parseInt(vertIndex1 + 1 < vertexCount ? vertIndex1 + 1 : 0);
      var v1 = vertices[vertIndex1];
      var v2 = vertices[vertIndex2];
      if (separation < Number.MIN_VALUE) {
         manifold.m_pointCount = 1;
         manifold.m_type = b2Manifold.e_faceA;
         manifold.m_localPlaneNormal.SetV(normals[normalIndex]);
         manifold.m_localPoint.x = 0.5 * (v1.x + v2.x);
         manifold.m_localPoint.y = 0.5 * (v1.y + v2.y);
         manifold.m_points[0].m_localPoint.SetV(circle.m_p);
         manifold.m_points[0].m_id.key = 0;
         return;
      }
      var u1 = (cLocalX - v1.x) * (v2.x - v1.x) + (cLocalY - v1.y) * (v2.y - v1.y);
      var u2 = (cLocalX - v2.x) * (v1.x - v2.x) + (cLocalY - v2.y) * (v1.y - v2.y);
      if (u1 <= 0.0) {
         if ((cLocalX - v1.x) * (cLocalX - v1.x) + (cLocalY - v1.y) * (cLocalY - v1.y) > radius * radius) return;
         manifold.m_pointCount = 1;
         manifold.m_type = b2Manifold.e_faceA;
         manifold.m_localPlaneNormal.x = cLocalX - v1.x;
         manifold.m_localPlaneNormal.y = cLocalY - v1.y;
         manifold.m_localPlaneNormal.Normalize();
         manifold.m_localPoint.SetV(v1);
         manifold.m_points[0].m_localPoint.SetV(circle.m_p);
         manifold.m_points[0].m_id.key = 0;
      }
      else if (u2 <= 0) {
         if ((cLocalX - v2.x) * (cLocalX - v2.x) + (cLocalY - v2.y) * (cLocalY - v2.y) > radius * radius) return;
         manifold.m_pointCount = 1;
         manifold.m_type = b2Manifold.e_faceA;
         manifold.m_localPlaneNormal.x = cLocalX - v2.x;
         manifold.m_localPlaneNormal.y = cLocalY - v2.y;
         manifold.m_localPlaneNormal.Normalize();
         manifold.m_localPoint.SetV(v2);
         manifold.m_points[0].m_localPoint.SetV(circle.m_p);
         manifold.m_points[0].m_id.key = 0;
      }
      else {
         var faceCenterX = 0.5 * (v1.x + v2.x);
         var faceCenterY = 0.5 * (v1.y + v2.y);
         separation = (cLocalX - faceCenterX) * normals[vertIndex1].x + (cLocalY - faceCenterY) * normals[vertIndex1].y;
         if (separation > radius) return;
         manifold.m_pointCount = 1;
         manifold.m_type = b2Manifold.e_faceA;
         manifold.m_localPlaneNormal.x = normals[vertIndex1].x;
         manifold.m_localPlaneNormal.y = normals[vertIndex1].y;
         manifold.m_localPlaneNormal.Normalize();
         manifold.m_localPoint.Set(faceCenterX, faceCenterY);
         manifold.m_points[0].m_localPoint.SetV(circle.m_p);
         manifold.m_points[0].m_id.key = 0;
      }
   }
   b2Collision.TestOverlap = function (a, b) {
      var t1 = b.lowerBound;
      var t2 = a.upperBound;
      var d1X = t1.x - t2.x;
      var d1Y = t1.y - t2.y;
      t1 = a.lowerBound;
      t2 = b.upperBound;
      var d2X = t1.x - t2.x;
      var d2Y = t1.y - t2.y;
      if (d1X > 0.0 || d1Y > 0.0) return false;
      if (d2X > 0.0 || d2Y > 0.0) return false;
      return true;
   }
   Box2D.postDefs.push(function () {
      Box2D.Collision.b2Collision.s_incidentEdge = b2Collision.MakeClipPointVector();
      Box2D.Collision.b2Collision.s_clipPoints1 = b2Collision.MakeClipPointVector();
      Box2D.Collision.b2Collision.s_clipPoints2 = b2Collision.MakeClipPointVector();
      Box2D.Collision.b2Collision.s_edgeAO = new Vector_a2j_Number(1);
      Box2D.Collision.b2Collision.s_edgeBO = new Vector_a2j_Number(1);
      Box2D.Collision.b2Collision.s_localTangent = new b2Vec2();
      Box2D.Collision.b2Collision.s_localNormal = new b2Vec2();
      Box2D.Collision.b2Collision.s_planePoint = new b2Vec2();
      Box2D.Collision.b2Collision.s_normal = new b2Vec2();
      Box2D.Collision.b2Collision.s_tangent = new b2Vec2();
      Box2D.Collision.b2Collision.s_tangent2 = new b2Vec2();
      Box2D.Collision.b2Collision.s_v11 = new b2Vec2();
      Box2D.Collision.b2Collision.s_v12 = new b2Vec2();
      Box2D.Collision.b2Collision.b2CollidePolyTempVec = new b2Vec2();
      Box2D.Collision.b2Collision.b2_nullFeature = 0x000000ff;
   });
   b2ContactID.b2ContactID = function () {
      this.features = new Features();
   };
   b2ContactID.prototype.b2ContactID = function () {
      this.features._m_id = this;
   }
   b2ContactID.prototype.Set = function (id) {
      this.key = id._key;
   }
   b2ContactID.prototype.Copy = function () {
      var id = new b2ContactID();
      id.key = this.key;
      return id;
   }
   Object.defineProperty(b2ContactID.prototype, 'key', {
      enumerable: false,
      configurable: true,
      get: function () {
         return this._key;
      }
   });
   Object.defineProperty(b2ContactID.prototype, 'key', {
      enumerable: false,
      configurable: true,
      set: function (value) {
         if (value === undefined) value = 0;
         this._key = value;
         this.features._referenceEdge = this._key & 0x000000ff;
         this.features._incidentEdge = ((this._key & 0x0000ff00) >> 8) & 0x000000ff;
         this.features._incidentVertex = ((this._key & 0x00ff0000) >> 16) & 0x000000ff;
         this.features._flip = ((this._key & 0xff000000) >> 24) & 0x000000ff;
      }
   });
   b2ContactPoint.b2ContactPoint = function () {
      this.position = new b2Vec2();
      this.velocity = new b2Vec2();
      this.normal = new b2Vec2();
      this.id = new b2ContactID();
   };
   b2Distance.b2Distance = function () {};
   b2Distance.Distance = function (output, cache, input) {
      ++b2Distance.b2_gjkCalls;
      var proxyA = input.proxyA;
      var proxyB = input.proxyB;
      var transformA = input.transformA;
      var transformB = input.transformB;
      var simplex = b2Distance.s_simplex;
      simplex.ReadCache(cache, proxyA, transformA, proxyB, transformB);
      var vertices = simplex.m_vertices;
      var k_maxIters = 20;
      var saveA = b2Distance.s_saveA;
      var saveB = b2Distance.s_saveB;
      var saveCount = 0;
      var closestPoint = simplex.GetClosestPoint();
      var distanceSqr1 = closestPoint.LengthSquared();
      var distanceSqr2 = distanceSqr1;
      var i = 0;
      var p;
      var iter = 0;
      while (iter < k_maxIters) {
         saveCount = simplex.m_count;
         for (i = 0;
         i < saveCount; i++) {
            saveA[i] = vertices[i].indexA;
            saveB[i] = vertices[i].indexB;
         }
         switch (simplex.m_count) {
         case 1:
            break;
         case 2:
            simplex.Solve2();
            break;
         case 3:
            simplex.Solve3();
            break;
         default:
            b2Settings.b2Assert(false);
         }
         if (simplex.m_count == 3) {
            break;
         }
         p = simplex.GetClosestPoint();
         distanceSqr2 = p.LengthSquared();
         if (distanceSqr2 > distanceSqr1) {}
         distanceSqr1 = distanceSqr2;
         var d = simplex.GetSearchDirection();
         if (d.LengthSquared() < Number.MIN_VALUE * Number.MIN_VALUE) {
            break;
         }
         var vertex = vertices[simplex.m_count];
         vertex.indexA = proxyA.GetSupport(b2Math.MulTMV(transformA.R, d.GetNegative()));
         vertex.wA = b2Math.MulX(transformA, proxyA.GetVertex(vertex.indexA));
         vertex.indexB = proxyB.GetSupport(b2Math.MulTMV(transformB.R, d));
         vertex.wB = b2Math.MulX(transformB, proxyB.GetVertex(vertex.indexB));
         vertex.w = b2Math.SubtractVV(vertex.wB, vertex.wA);
         ++iter;
         ++b2Distance.b2_gjkIters;
         var duplicate = false;
         for (i = 0;
         i < saveCount; i++) {
            if (vertex.indexA == saveA[i] && vertex.indexB == saveB[i]) {
               duplicate = true;
               break;
            }
         }
         if (duplicate) {
            break;
         }++simplex.m_count;
      }
      b2Distance.b2_gjkMaxIters = b2Math.Max(b2Distance.b2_gjkMaxIters, iter);
      simplex.GetWitnessPoints(output.pointA, output.pointB);
      output.distance = b2Math.SubtractVV(output.pointA, output.pointB).Length();
      output.iterations = iter;
      simplex.WriteCache(cache);
      if (input.useRadii) {
         var rA = proxyA.m_radius;
         var rB = proxyB.m_radius;
         if (output.distance > rA + rB && output.distance > Number.MIN_VALUE) {
            output.distance -= rA + rB;
            var normal = b2Math.SubtractVV(output.pointB, output.pointA);
            normal.Normalize();
            output.pointA.x += rA * normal.x;
            output.pointA.y += rA * normal.y;
            output.pointB.x -= rB * normal.x;
            output.pointB.y -= rB * normal.y;
         }
         else {
            p = new b2Vec2();
            p.x = .5 * (output.pointA.x + output.pointB.x);
            p.y = .5 * (output.pointA.y + output.pointB.y);
            output.pointA.x = output.pointB.x = p.x;
            output.pointA.y = output.pointB.y = p.y;
            output.distance = 0.0;
         }
      }
   }
   Box2D.postDefs.push(function () {
      Box2D.Collision.b2Distance.s_simplex = new b2Simplex();
      Box2D.Collision.b2Distance.s_saveA = new Vector_a2j_Number(3);
      Box2D.Collision.b2Distance.s_saveB = new Vector_a2j_Number(3);
   });
   b2DistanceInput.b2DistanceInput = function () {};
   b2DistanceOutput.b2DistanceOutput = function () {
      this.pointA = new b2Vec2();
      this.pointB = new b2Vec2();
   };
   b2DistanceProxy.b2DistanceProxy = function () {};
   b2DistanceProxy.prototype.Set = function (shape) {
      switch (shape.GetType()) {
      case b2Shape.e_circleShape:
         {
            var circle = (shape instanceof b2CircleShape ? shape : null);
            this.m_vertices = new Vector(1, true);
            this.m_vertices[0] = circle.m_p;
            this.m_count = 1;
            this.m_radius = circle.m_radius;
         }
         break;
      case b2Shape.e_polygonShape:
         {
            var polygon = (shape instanceof b2PolygonShape ? shape : null);
            this.m_vertices = polygon.m_vertices;
            this.m_count = polygon.m_vertexCount;
            this.m_radius = polygon.m_radius;
         }
         break;
      default:
         b2Settings.b2Assert(false);
      }
   }
   b2DistanceProxy.prototype.GetSupport = function (d) {
      var bestIndex = 0;
      var bestValue = this.m_vertices[0].x * d.x + this.m_vertices[0].y * d.y;
      for (var i = 1; i < this.m_count; ++i) {
         var value = this.m_vertices[i].x * d.x + this.m_vertices[i].y * d.y;
         if (value > bestValue) {
            bestIndex = i;
            bestValue = value;
         }
      }
      return bestIndex;
   }
   b2DistanceProxy.prototype.GetSupportVertex = function (d) {
      var bestIndex = 0;
      var bestValue = this.m_vertices[0].x * d.x + this.m_vertices[0].y * d.y;
      for (var i = 1; i < this.m_count; ++i) {
         var value = this.m_vertices[i].x * d.x + this.m_vertices[i].y * d.y;
         if (value > bestValue) {
            bestIndex = i;
            bestValue = value;
         }
      }
      return this.m_vertices[bestIndex];
   }
   b2DistanceProxy.prototype.GetVertexCount = function () {
      return this.m_count;
   }
   b2DistanceProxy.prototype.GetVertex = function (index) {
      if (index === undefined) index = 0;
      b2Settings.b2Assert(0 <= index && index < this.m_count);
      return this.m_vertices[index];
   }
   b2DynamicTree.b2DynamicTree = function () {};
   b2DynamicTree.prototype.b2DynamicTree = function () {
      this.m_root = null;
      this.m_freeList = null;
      this.m_path = 0;
      this.m_insertionCount = 0;
   }
   b2DynamicTree.prototype.CreateProxy = function (aabb, userData) {
      var node = this.AllocateNode();
      var extendX = b2Settings.b2_aabbExtension;
      var extendY = b2Settings.b2_aabbExtension;
      node.aabb.lowerBound.x = aabb.lowerBound.x - extendX;
      node.aabb.lowerBound.y = aabb.lowerBound.y - extendY;
      node.aabb.upperBound.x = aabb.upperBound.x + extendX;
      node.aabb.upperBound.y = aabb.upperBound.y + extendY;
      node.userData = userData;
      this.InsertLeaf(node);
      return node;
   }
   b2DynamicTree.prototype.DestroyProxy = function (proxy) {
      this.RemoveLeaf(proxy);
      this.FreeNode(proxy);
   }
   b2DynamicTree.prototype.MoveProxy = function (proxy, aabb, displacement) {
      b2Settings.b2Assert(proxy.IsLeaf());
      if (proxy.aabb.Contains(aabb)) {
         return false;
      }
      this.RemoveLeaf(proxy);
      var extendX = b2Settings.b2_aabbExtension + b2Settings.b2_aabbMultiplier * (displacement.x > 0 ? displacement.x : (-displacement.x));
      var extendY = b2Settings.b2_aabbExtension + b2Settings.b2_aabbMultiplier * (displacement.y > 0 ? displacement.y : (-displacement.y));
      proxy.aabb.lowerBound.x = aabb.lowerBound.x - extendX;
      proxy.aabb.lowerBound.y = aabb.lowerBound.y - extendY;
      proxy.aabb.upperBound.x = aabb.upperBound.x + extendX;
      proxy.aabb.upperBound.y = aabb.upperBound.y + extendY;
      this.InsertLeaf(proxy);
      return true;
   }
   b2DynamicTree.prototype.Rebalance = function (iterations) {
      if (iterations === undefined) iterations = 0;
      if (this.m_root == null) return;
      for (var i = 0; i < iterations; i++) {
         var node = this.m_root;
         var bit = 0;
         while (node.IsLeaf() == false) {
            node = (this.m_path >> bit) & 1 ? node.child2 : node.child1;
            bit = (bit + 1) & 31;
         }++this.m_path;
         this.RemoveLeaf(node);
         this.InsertLeaf(node);
      }
   }
   b2DynamicTree.prototype.GetFatAABB = function (proxy) {
      return proxy.aabb;
   }
   b2DynamicTree.prototype.GetUserData = function (proxy) {
      return proxy.userData;
   }
   b2DynamicTree.prototype.Query = function (callback, aabb) {
      if (this.m_root == null) return;
      var stack = new Vector();
      var count = 0;
      stack[count++] = this.m_root;
      while (count > 0) {
         var node = stack[--count];
         if (node.aabb.TestOverlap(aabb)) {
            if (node.IsLeaf()) {
               var proceed = callback(node);
               if (!proceed) return;
            }
            else {
               stack[count++] = node.child1;
               stack[count++] = node.child2;
            }
         }
      }
   }
   b2DynamicTree.prototype.RayCast = function (callback, input) {
      if (this.m_root == null) return;
      var p1 = input.p1;
      var p2 = input.p2;
      var r = b2Math.SubtractVV(p1, p2);
      r.Normalize();
      var v = b2Math.CrossFV(1.0, r);
      var abs_v = b2Math.AbsV(v);
      var maxFraction = input.maxFraction;
      var segmentAABB = new b2AABB();
      var tX = 0;
      var tY = 0; {
         tX = p1.x + maxFraction * (p2.x - p1.x);
         tY = p1.y + maxFraction * (p2.y - p1.y);
         segmentAABB.lowerBound.x = Math.min(p1.x, tX);
         segmentAABB.lowerBound.y = Math.min(p1.y, tY);
         segmentAABB.upperBound.x = Math.max(p1.x, tX);
         segmentAABB.upperBound.y = Math.max(p1.y, tY);
      }
      var stack = new Vector();
      var count = 0;
      stack[count++] = this.m_root;
      while (count > 0) {
         var node = stack[--count];
         if (node.aabb.TestOverlap(segmentAABB) == false) {
            continue;
         }
         var c = node.aabb.GetCenter();
         var h = node.aabb.GetExtents();
         var separation = Math.abs(v.x * (p1.x - c.x) + v.y * (p1.y - c.y)) - abs_v.x * h.x - abs_v.y * h.y;
         if (separation > 0.0) continue;
         if (node.IsLeaf()) {
            var subInput = new b2RayCastInput();
            subInput.p1 = input.p1;
            subInput.p2 = input.p2;
            subInput.maxFraction = input.maxFraction;
            maxFraction = callback(subInput, node);
            if (maxFraction == 0.0) return;
            if (maxFraction > 0.0) {
               tX = p1.x + maxFraction * (p2.x - p1.x);
               tY = p1.y + maxFraction * (p2.y - p1.y);
               segmentAABB.lowerBound.x = Math.min(p1.x, tX);
               segmentAABB.lowerBound.y = Math.min(p1.y, tY);
               segmentAABB.upperBound.x = Math.max(p1.x, tX);
               segmentAABB.upperBound.y = Math.max(p1.y, tY);
            }
         }
         else {
            stack[count++] = node.child1;
            stack[count++] = node.child2;
         }
      }
   }
   b2DynamicTree.prototype.AllocateNode = function () {
      if (this.m_freeList) {
         var node = this.m_freeList;
         this.m_freeList = node.parent;
         node.parent = null;
         node.child1 = null;
         node.child2 = null;
         return node;
      }
      return new b2DynamicTreeNode();
   }
   b2DynamicTree.prototype.FreeNode = function (node) {
      node.parent = this.m_freeList;
      this.m_freeList = node;
   }
   b2DynamicTree.prototype.InsertLeaf = function (leaf) {
      ++this.m_insertionCount;
      if (this.m_root == null) {
         this.m_root = leaf;
         this.m_root.parent = null;
         return;
      }
      var center = leaf.aabb.GetCenter();
      var sibling = this.m_root;
      if (sibling.IsLeaf() == false) {
         do {
            var child1 = sibling.child1;
            var child2 = sibling.child2;
            var norm1 = Math.abs((child1.aabb.lowerBound.x + child1.aabb.upperBound.x) / 2 - center.x) + Math.abs((child1.aabb.lowerBound.y + child1.aabb.upperBound.y) / 2 - center.y);
            var norm2 = Math.abs((child2.aabb.lowerBound.x + child2.aabb.upperBound.x) / 2 - center.x) + Math.abs((child2.aabb.lowerBound.y + child2.aabb.upperBound.y) / 2 - center.y);
            if (norm1 < norm2) {
               sibling = child1;
            }
            else {
               sibling = child2;
            }
         }
         while (sibling.IsLeaf() == false)
      }
      var node1 = sibling.parent;
      var node2 = this.AllocateNode();
      node2.parent = node1;
      node2.userData = null;
      node2.aabb.Combine(leaf.aabb, sibling.aabb);
      if (node1) {
         if (sibling.parent.child1 == sibling) {
            node1.child1 = node2;
         }
         else {
            node1.child2 = node2;
         }
         node2.child1 = sibling;
         node2.child2 = leaf;
         sibling.parent = node2;
         leaf.parent = node2;
         do {
            if (node1.aabb.Contains(node2.aabb)) break;
            node1.aabb.Combine(node1.child1.aabb, node1.child2.aabb);
            node2 = node1;
            node1 = node1.parent;
         }
         while (node1)
      }
      else {
         node2.child1 = sibling;
         node2.child2 = leaf;
         sibling.parent = node2;
         leaf.parent = node2;
         this.m_root = node2;
      }
   }
   b2DynamicTree.prototype.RemoveLeaf = function (leaf) {
      if (leaf == this.m_root) {
         this.m_root = null;
         return;
      }
      var node2 = leaf.parent;
      var node1 = node2.parent;
      var sibling;
      if (node2.child1 == leaf) {
         sibling = node2.child2;
      }
      else {
         sibling = node2.child1;
      }
      if (node1) {
         if (node1.child1 == node2) {
            node1.child1 = sibling;
         }
         else {
            node1.child2 = sibling;
         }
         sibling.parent = node1;
         this.FreeNode(node2);
         while (node1) {
            var oldAABB = node1.aabb;
            node1.aabb = b2AABB.Combine(node1.child1.aabb, node1.child2.aabb);
            if (oldAABB.Contains(node1.aabb)) break;
            node1 = node1.parent;
         }
      }
      else {
         this.m_root = sibling;
         sibling.parent = null;
         this.FreeNode(node2);
      }
   }
   b2DynamicTreeBroadPhase.b2DynamicTreeBroadPhase = function () {
      this.m_tree = new b2DynamicTree();
      this.m_moveBuffer = new Vector();
      this.m_pairBuffer = new Vector();
      this.m_pairCount = 0;
   };
   b2DynamicTreeBroadPhase.prototype.CreateProxy = function (aabb, userData) {
      var proxy = this.m_tree.CreateProxy(aabb, userData);
      ++this.m_proxyCount;
      this.BufferMove(proxy);
      return proxy;
   }
   b2DynamicTreeBroadPhase.prototype.DestroyProxy = function (proxy) {
      this.UnBufferMove(proxy);
      --this.m_proxyCount;
      this.m_tree.DestroyProxy(proxy);
   }
   b2DynamicTreeBroadPhase.prototype.MoveProxy = function (proxy, aabb, displacement) {
      var buffer = this.m_tree.MoveProxy(proxy, aabb, displacement);
      if (buffer) {
         this.BufferMove(proxy);
      }
   }
   b2DynamicTreeBroadPhase.prototype.TestOverlap = function (proxyA, proxyB) {
      var aabbA = this.m_tree.GetFatAABB(proxyA);
      var aabbB = this.m_tree.GetFatAABB(proxyB);
      return aabbA.TestOverlap(aabbB);
   }
   b2DynamicTreeBroadPhase.prototype.GetUserData = function (proxy) {
      return this.m_tree.GetUserData(proxy);
   }
   b2DynamicTreeBroadPhase.prototype.GetFatAABB = function (proxy) {
      return this.m_tree.GetFatAABB(proxy);
   }
   b2DynamicTreeBroadPhase.prototype.GetProxyCount = function () {
      return this.m_proxyCount;
   }
   b2DynamicTreeBroadPhase.prototype.UpdatePairs = function (callback) {
      var __this = this;
      __this.m_pairCount = 0;
      var i = 0,
         queryProxy;
      for (i = 0;
      i < __this.m_moveBuffer.length; ++i) {
         queryProxy = __this.m_moveBuffer[i];

         function QueryCallback(proxy) {
            if (proxy == queryProxy) return true;
            if (__this.m_pairCount == __this.m_pairBuffer.length) {
               __this.m_pairBuffer[__this.m_pairCount] = new b2DynamicTreePair();
            }
            var pair = __this.m_pairBuffer[__this.m_pairCount];
            pair.proxyA = proxy < queryProxy ? proxy : queryProxy;
            pair.proxyB = proxy >= queryProxy ? proxy : queryProxy;++__this.m_pairCount;
            return true;
         };
         var fatAABB = __this.m_tree.GetFatAABB(queryProxy);
         __this.m_tree.Query(QueryCallback, fatAABB);
      }
      __this.m_moveBuffer.length = 0;
      for (var i = 0; i < __this.m_pairCount;) {
         var primaryPair = __this.m_pairBuffer[i];
         var userDataA = __this.m_tree.GetUserData(primaryPair.proxyA);
         var userDataB = __this.m_tree.GetUserData(primaryPair.proxyB);
         callback(userDataA, userDataB);
         ++i;
         while (i < __this.m_pairCount) {
            var pair = __this.m_pairBuffer[i];
            if (pair.proxyA != primaryPair.proxyA || pair.proxyB != primaryPair.proxyB) {
               break;
            }++i;
         }
      }
   }
   b2DynamicTreeBroadPhase.prototype.Query = function (callback, aabb) {
      this.m_tree.Query(callback, aabb);
   }
   b2DynamicTreeBroadPhase.prototype.RayCast = function (callback, input) {
      this.m_tree.RayCast(callback, input);
   }
   b2DynamicTreeBroadPhase.prototype.Validate = function () {}
   b2DynamicTreeBroadPhase.prototype.Rebalance = function (iterations) {
      if (iterations === undefined) iterations = 0;
      this.m_tree.Rebalance(iterations);
   }
   b2DynamicTreeBroadPhase.prototype.BufferMove = function (proxy) {
      this.m_moveBuffer[this.m_moveBuffer.length] = proxy;
   }
   b2DynamicTreeBroadPhase.prototype.UnBufferMove = function (proxy) {
      var i = parseInt(this.m_moveBuffer.indexOf(proxy));
      this.m_moveBuffer.splice(i, 1);
   }
   b2DynamicTreeBroadPhase.prototype.ComparePairs = function (pair1, pair2) {
      return 0;
   }
   b2DynamicTreeBroadPhase.__implements = {};
   b2DynamicTreeBroadPhase.__implements[IBroadPhase] = true;
   b2DynamicTreeNode.b2DynamicTreeNode = function () {
      this.aabb = new b2AABB();
   };
   b2DynamicTreeNode.prototype.IsLeaf = function () {
      return this.child1 == null;
   }
   b2DynamicTreePair.b2DynamicTreePair = function () {};
   b2Manifold.b2Manifold = function () {
      this.m_pointCount = 0;
   };
   b2Manifold.prototype.b2Manifold = function () {
      this.m_points = new Vector(b2Settings.b2_maxManifoldPoints);
      for (var i = 0; i < b2Settings.b2_maxManifoldPoints; i++) {
         this.m_points[i] = new b2ManifoldPoint();
      }
      this.m_localPlaneNormal = new b2Vec2();
      this.m_localPoint = new b2Vec2();
   }
   b2Manifold.prototype.Reset = function () {
      for (var i = 0; i < b2Settings.b2_maxManifoldPoints; i++) {
         ((this.m_points[i] instanceof b2ManifoldPoint ? this.m_points[i] : null)).Reset();
      }
      this.m_localPlaneNormal.SetZero();
      this.m_localPoint.SetZero();
      this.m_type = 0;
      this.m_pointCount = 0;
   }
   b2Manifold.prototype.Set = function (m) {
      this.m_pointCount = m.m_pointCount;
      for (var i = 0; i < b2Settings.b2_maxManifoldPoints; i++) {
         ((this.m_points[i] instanceof b2ManifoldPoint ? this.m_points[i] : null)).Set(m.m_points[i]);
      }
      this.m_localPlaneNormal.SetV(m.m_localPlaneNormal);
      this.m_localPoint.SetV(m.m_localPoint);
      this.m_type = m.m_type;
   }
   b2Manifold.prototype.Copy = function () {
      var copy = new b2Manifold();
      copy.Set(this);
      return copy;
   }
   Box2D.postDefs.push(function () {
      Box2D.Collision.b2Manifold.e_circles = 0x0001;
      Box2D.Collision.b2Manifold.e_faceA = 0x0002;
      Box2D.Collision.b2Manifold.e_faceB = 0x0004;
   });
   b2ManifoldPoint.b2ManifoldPoint = function () {
      this.m_localPoint = new b2Vec2();
      this.m_id = new b2ContactID();
   };
   b2ManifoldPoint.prototype.b2ManifoldPoint = function () {
      this.Reset();
   }
   b2ManifoldPoint.prototype.Reset = function () {
      this.m_localPoint.SetZero();
      this.m_normalImpulse = 0.0;
      this.m_tangentImpulse = 0.0;
      this.m_id.key = 0;
   }
   b2ManifoldPoint.prototype.Set = function (m) {
      this.m_localPoint.SetV(m.m_localPoint);
      this.m_normalImpulse = m.m_normalImpulse;
      this.m_tangentImpulse = m.m_tangentImpulse;
      this.m_id.Set(m.m_id);
   }
   b2Point.b2Point = function () {
      this.p = new b2Vec2();
   };
   b2Point.prototype.Support = function (xf, vX, vY) {
      if (vX === undefined) vX = 0;
      if (vY === undefined) vY = 0;
      return this.p;
   }
   b2Point.prototype.GetFirstVertex = function (xf) {
      return this.p;
   }
   b2RayCastInput.b2RayCastInput = function () {
      this.p1 = new b2Vec2();
      this.p2 = new b2Vec2();
   };
   b2RayCastInput.prototype.b2RayCastInput = function (p1, p2, maxFraction) {
      if (p1 === undefined) p1 = null;
      if (p2 === undefined) p2 = null;
      if (maxFraction === undefined) maxFraction = 1;
      if (p1) this.p1.SetV(p1);
      if (p2) this.p2.SetV(p2);
      this.maxFraction = maxFraction;
   }
   b2RayCastOutput.b2RayCastOutput = function () {
      this.normal = new b2Vec2();
   };
   b2Segment.b2Segment = function () {
      this.p1 = new b2Vec2();
      this.p2 = new b2Vec2();
   };
   b2Segment.prototype.TestSegment = function (lambda, normal, segment, maxLambda) {
      if (maxLambda === undefined) maxLambda = 0;
      var s = segment.p1;
      var rX = segment.p2.x - s.x;
      var rY = segment.p2.y - s.y;
      var dX = this.p2.x - this.p1.x;
      var dY = this.p2.y - this.p1.y;
      var nX = dY;
      var nY = (-dX);
      var k_slop = 100.0 * Number.MIN_VALUE;
      var denom = (-(rX * nX + rY * nY));
      if (denom > k_slop) {
         var bX = s.x - this.p1.x;
         var bY = s.y - this.p1.y;
         var a = (bX * nX + bY * nY);
         if (0.0 <= a && a <= maxLambda * denom) {
            var mu2 = (-rX * bY) + rY * bX;
            if ((-k_slop * denom) <= mu2 && mu2 <= denom * (1.0 + k_slop)) {
               a /= denom;
               var nLen = Math.sqrt(nX * nX + nY * nY);
               nX /= nLen;
               nY /= nLen;
               lambda[0] = a;
               normal.Set(nX, nY);
               return true;
            }
         }
      }
      return false;
   }
   b2Segment.prototype.Extend = function (aabb) {
      this.ExtendForward(aabb);
      this.ExtendBackward(aabb);
   }
   b2Segment.prototype.ExtendForward = function (aabb) {
      var dX = this.p2.x - this.p1.x;
      var dY = this.p2.y - this.p1.y;
      var lambda = Math.min(dX > 0 ? (aabb.upperBound.x - this.p1.x) / dX : dX < 0 ? (aabb.lowerBound.x - this.p1.x) / dX : Number.POSITIVE_INFINITY,
      dY > 0 ? (aabb.upperBound.y - this.p1.y) / dY : dY < 0 ? (aabb.lowerBound.y - this.p1.y) / dY : Number.POSITIVE_INFINITY);
      this.p2.x = this.p1.x + dX * lambda;
      this.p2.y = this.p1.y + dY * lambda;
   }
   b2Segment.prototype.ExtendBackward = function (aabb) {
      var dX = (-this.p2.x) + this.p1.x;
      var dY = (-this.p2.y) + this.p1.y;
      var lambda = Math.min(dX > 0 ? (aabb.upperBound.x - this.p2.x) / dX : dX < 0 ? (aabb.lowerBound.x - this.p2.x) / dX : Number.POSITIVE_INFINITY,
      dY > 0 ? (aabb.upperBound.y - this.p2.y) / dY : dY < 0 ? (aabb.lowerBound.y - this.p2.y) / dY : Number.POSITIVE_INFINITY);
      this.p1.x = this.p2.x + dX * lambda;
      this.p1.y = this.p2.y + dY * lambda;
   }
   b2SeparationFunction.b2SeparationFunction = function () {
      this.m_localPoint = new b2Vec2();
      this.m_axis = new b2Vec2();
   };
   b2SeparationFunction.prototype.Initialize = function (cache, proxyA, transformA, proxyB, transformB) {
      this.m_proxyA = proxyA;
      this.m_proxyB = proxyB;
      var count = parseInt(cache.count);
      b2Settings.b2Assert(0 < count && count < 3);
      var localPointA;
      var localPointA1;
      var localPointA2;
      var localPointB;
      var localPointB1;
      var localPointB2;
      var pointAX = 0;
      var pointAY = 0;
      var pointBX = 0;
      var pointBY = 0;
      var normalX = 0;
      var normalY = 0;
      var tMat;
      var tVec;
      var s = 0;
      var sgn = 0;
      if (count == 1) {
         this.m_type = b2SeparationFunction.e_points;
         localPointA = this.m_proxyA.GetVertex(cache.indexA[0]);
         localPointB = this.m_proxyB.GetVertex(cache.indexB[0]);
         tVec = localPointA;
         tMat = transformA.R;
         pointAX = transformA.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
         pointAY = transformA.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
         tVec = localPointB;
         tMat = transformB.R;
         pointBX = transformB.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
         pointBY = transformB.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
         this.m_axis.x = pointBX - pointAX;
         this.m_axis.y = pointBY - pointAY;
         this.m_axis.Normalize();
      }
      else if (cache.indexB[0] == cache.indexB[1]) {
         this.m_type = b2SeparationFunction.e_faceA;
         localPointA1 = this.m_proxyA.GetVertex(cache.indexA[0]);
         localPointA2 = this.m_proxyA.GetVertex(cache.indexA[1]);
         localPointB = this.m_proxyB.GetVertex(cache.indexB[0]);
         this.m_localPoint.x = 0.5 * (localPointA1.x + localPointA2.x);
         this.m_localPoint.y = 0.5 * (localPointA1.y + localPointA2.y);
         this.m_axis = b2Math.CrossVF(b2Math.SubtractVV(localPointA2, localPointA1), 1.0);
         this.m_axis.Normalize();
         tVec = this.m_axis;
         tMat = transformA.R;
         normalX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
         normalY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
         tVec = this.m_localPoint;
         tMat = transformA.R;
         pointAX = transformA.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
         pointAY = transformA.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
         tVec = localPointB;
         tMat = transformB.R;
         pointBX = transformB.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
         pointBY = transformB.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
         s = (pointBX - pointAX) * normalX + (pointBY - pointAY) * normalY;
         if (s < 0.0) {
            this.m_axis.NegativeSelf();
         }
      }
      else if (cache.indexA[0] == cache.indexA[0]) {
         this.m_type = b2SeparationFunction.e_faceB;
         localPointB1 = this.m_proxyB.GetVertex(cache.indexB[0]);
         localPointB2 = this.m_proxyB.GetVertex(cache.indexB[1]);
         localPointA = this.m_proxyA.GetVertex(cache.indexA[0]);
         this.m_localPoint.x = 0.5 * (localPointB1.x + localPointB2.x);
         this.m_localPoint.y = 0.5 * (localPointB1.y + localPointB2.y);
         this.m_axis = b2Math.CrossVF(b2Math.SubtractVV(localPointB2, localPointB1), 1.0);
         this.m_axis.Normalize();
         tVec = this.m_axis;
         tMat = transformB.R;
         normalX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
         normalY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
         tVec = this.m_localPoint;
         tMat = transformB.R;
         pointBX = transformB.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
         pointBY = transformB.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
         tVec = localPointA;
         tMat = transformA.R;
         pointAX = transformA.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
         pointAY = transformA.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
         s = (pointAX - pointBX) * normalX + (pointAY - pointBY) * normalY;
         if (s < 0.0) {
            this.m_axis.NegativeSelf();
         }
      }
      else {
         localPointA1 = this.m_proxyA.GetVertex(cache.indexA[0]);
         localPointA2 = this.m_proxyA.GetVertex(cache.indexA[1]);
         localPointB1 = this.m_proxyB.GetVertex(cache.indexB[0]);
         localPointB2 = this.m_proxyB.GetVertex(cache.indexB[1]);
         var pA = b2Math.MulX(transformA, localPointA);
         var dA = b2Math.MulMV(transformA.R, b2Math.SubtractVV(localPointA2, localPointA1));
         var pB = b2Math.MulX(transformB, localPointB);
         var dB = b2Math.MulMV(transformB.R, b2Math.SubtractVV(localPointB2, localPointB1));
         var a = dA.x * dA.x + dA.y * dA.y;
         var e = dB.x * dB.x + dB.y * dB.y;
         var r = b2Math.SubtractVV(dB, dA);
         var c = dA.x * r.x + dA.y * r.y;
         var f = dB.x * r.x + dB.y * r.y;
         var b = dA.x * dB.x + dA.y * dB.y;
         var denom = a * e - b * b;
         s = 0.0;
         if (denom != 0.0) {
            s = b2Math.Clamp((b * f - c * e) / denom, 0.0, 1.0);
         }
         var t = (b * s + f) / e;
         if (t < 0.0) {
            t = 0.0;
            s = b2Math.Clamp((b - c) / a, 0.0, 1.0);
         }
         localPointA = new b2Vec2();
         localPointA.x = localPointA1.x + s * (localPointA2.x - localPointA1.x);
         localPointA.y = localPointA1.y + s * (localPointA2.y - localPointA1.y);
         localPointB = new b2Vec2();
         localPointB.x = localPointB1.x + s * (localPointB2.x - localPointB1.x);
         localPointB.y = localPointB1.y + s * (localPointB2.y - localPointB1.y);
         if (s == 0.0 || s == 1.0) {
            this.m_type = b2SeparationFunction.e_faceB;
            this.m_axis = b2Math.CrossVF(b2Math.SubtractVV(localPointB2, localPointB1), 1.0);
            this.m_axis.Normalize();
            this.m_localPoint = localPointB;
            tVec = this.m_axis;
            tMat = transformB.R;
            normalX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
            normalY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
            tVec = this.m_localPoint;
            tMat = transformB.R;
            pointBX = transformB.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
            pointBY = transformB.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
            tVec = localPointA;
            tMat = transformA.R;
            pointAX = transformA.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
            pointAY = transformA.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
            sgn = (pointAX - pointBX) * normalX + (pointAY - pointBY) * normalY;
            if (s < 0.0) {
               this.m_axis.NegativeSelf();
            }
         }
         else {
            this.m_type = b2SeparationFunction.e_faceA;
            this.m_axis = b2Math.CrossVF(b2Math.SubtractVV(localPointA2, localPointA1), 1.0);
            this.m_localPoint = localPointA;
            tVec = this.m_axis;
            tMat = transformA.R;
            normalX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
            normalY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
            tVec = this.m_localPoint;
            tMat = transformA.R;
            pointAX = transformA.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
            pointAY = transformA.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
            tVec = localPointB;
            tMat = transformB.R;
            pointBX = transformB.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
            pointBY = transformB.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
            sgn = (pointBX - pointAX) * normalX + (pointBY - pointAY) * normalY;
            if (s < 0.0) {
               this.m_axis.NegativeSelf();
            }
         }
      }
   }
   b2SeparationFunction.prototype.Evaluate = function (transformA, transformB) {
      var axisA;
      var axisB;
      var localPointA;
      var localPointB;
      var pointA;
      var pointB;
      var seperation = 0;
      var normal;
      switch (this.m_type) {
      case b2SeparationFunction.e_points:
         {
            axisA = b2Math.MulTMV(transformA.R, this.m_axis);
            axisB = b2Math.MulTMV(transformB.R, this.m_axis.GetNegative());
            localPointA = this.m_proxyA.GetSupportVertex(axisA);
            localPointB = this.m_proxyB.GetSupportVertex(axisB);
            pointA = b2Math.MulX(transformA, localPointA);
            pointB = b2Math.MulX(transformB, localPointB);
            seperation = (pointB.x - pointA.x) * this.m_axis.x + (pointB.y - pointA.y) * this.m_axis.y;
            return seperation;
         }
      case b2SeparationFunction.e_faceA:
         {
            normal = b2Math.MulMV(transformA.R, this.m_axis);
            pointA = b2Math.MulX(transformA, this.m_localPoint);
            axisB = b2Math.MulTMV(transformB.R, normal.GetNegative());
            localPointB = this.m_proxyB.GetSupportVertex(axisB);
            pointB = b2Math.MulX(transformB, localPointB);
            seperation = (pointB.x - pointA.x) * normal.x + (pointB.y - pointA.y) * normal.y;
            return seperation;
         }
      case b2SeparationFunction.e_faceB:
         {
            normal = b2Math.MulMV(transformB.R, this.m_axis);
            pointB = b2Math.MulX(transformB, this.m_localPoint);
            axisA = b2Math.MulTMV(transformA.R, normal.GetNegative());
            localPointA = this.m_proxyA.GetSupportVertex(axisA);
            pointA = b2Math.MulX(transformA, localPointA);
            seperation = (pointA.x - pointB.x) * normal.x + (pointA.y - pointB.y) * normal.y;
            return seperation;
         }
      default:
         b2Settings.b2Assert(false);
         return 0.0;
      }
   }
   Box2D.postDefs.push(function () {
      Box2D.Collision.b2SeparationFunction.e_points = 0x01;
      Box2D.Collision.b2SeparationFunction.e_faceA = 0x02;
      Box2D.Collision.b2SeparationFunction.e_faceB = 0x04;
   });
   b2Simplex.b2Simplex = function () {
      this.m_v1 = new b2SimplexVertex();
      this.m_v2 = new b2SimplexVertex();
      this.m_v3 = new b2SimplexVertex();
      this.m_vertices = new Vector(3);
   };
   b2Simplex.prototype.b2Simplex = function () {
      this.m_vertices[0] = this.m_v1;
      this.m_vertices[1] = this.m_v2;
      this.m_vertices[2] = this.m_v3;
   }
   b2Simplex.prototype.ReadCache = function (cache, proxyA, transformA, proxyB, transformB) {
      b2Settings.b2Assert(0 <= cache.count && cache.count <= 3);
      var wALocal;
      var wBLocal;
      this.m_count = cache.count;
      var vertices = this.m_vertices;
      for (var i = 0; i < this.m_count; i++) {
         var v = vertices[i];
         v.indexA = cache.indexA[i];
         v.indexB = cache.indexB[i];
         wALocal = proxyA.GetVertex(v.indexA);
         wBLocal = proxyB.GetVertex(v.indexB);
         v.wA = b2Math.MulX(transformA, wALocal);
         v.wB = b2Math.MulX(transformB, wBLocal);
         v.w = b2Math.SubtractVV(v.wB, v.wA);
         v.a = 0;
      }
      if (this.m_count > 1) {
         var metric1 = cache.metric;
         var metric2 = this.GetMetric();
         if (metric2 < .5 * metric1 || 2.0 * metric1 < metric2 || metric2 < Number.MIN_VALUE) {
            this.m_count = 0;
         }
      }
      if (this.m_count == 0) {
         v = vertices[0];
         v.indexA = 0;
         v.indexB = 0;
         wALocal = proxyA.GetVertex(0);
         wBLocal = proxyB.GetVertex(0);
         v.wA = b2Math.MulX(transformA, wALocal);
         v.wB = b2Math.MulX(transformB, wBLocal);
         v.w = b2Math.SubtractVV(v.wB, v.wA);
         this.m_count = 1;
      }
   }
   b2Simplex.prototype.WriteCache = function (cache) {
      cache.metric = this.GetMetric();
      cache.count = Box2D.parseUInt(this.m_count);
      var vertices = this.m_vertices;
      for (var i = 0; i < this.m_count; i++) {
         cache.indexA[i] = Box2D.parseUInt(vertices[i].indexA);
         cache.indexB[i] = Box2D.parseUInt(vertices[i].indexB);
      }
   }
   b2Simplex.prototype.GetSearchDirection = function () {
      switch (this.m_count) {
      case 1:
         return this.m_v1.w.GetNegative();
      case 2:
         {
            var e12 = b2Math.SubtractVV(this.m_v2.w, this.m_v1.w);
            var sgn = b2Math.CrossVV(e12, this.m_v1.w.GetNegative());
            if (sgn > 0.0) {
               return b2Math.CrossFV(1.0, e12);
            }
            else {
               return b2Math.CrossVF(e12, 1.0);
            }
         }
      default:
         b2Settings.b2Assert(false);
         return new b2Vec2();
      }
   }
   b2Simplex.prototype.GetClosestPoint = function () {
      switch (this.m_count) {
      case 0:
         b2Settings.b2Assert(false);
         return new b2Vec2();
      case 1:
         return this.m_v1.w;
      case 2:
         return new b2Vec2(this.m_v1.a * this.m_v1.w.x + this.m_v2.a * this.m_v2.w.x, this.m_v1.a * this.m_v1.w.y + this.m_v2.a * this.m_v2.w.y);
      default:
         b2Settings.b2Assert(false);
         return new b2Vec2();
      }
   }
   b2Simplex.prototype.GetWitnessPoints = function (pA, pB) {
      switch (this.m_count) {
      case 0:
         b2Settings.b2Assert(false);
         break;
      case 1:
         pA.SetV(this.m_v1.wA);
         pB.SetV(this.m_v1.wB);
         break;
      case 2:
         pA.x = this.m_v1.a * this.m_v1.wA.x + this.m_v2.a * this.m_v2.wA.x;
         pA.y = this.m_v1.a * this.m_v1.wA.y + this.m_v2.a * this.m_v2.wA.y;
         pB.x = this.m_v1.a * this.m_v1.wB.x + this.m_v2.a * this.m_v2.wB.x;
         pB.y = this.m_v1.a * this.m_v1.wB.y + this.m_v2.a * this.m_v2.wB.y;
         break;
      case 3:
         pB.x = pA.x = this.m_v1.a * this.m_v1.wA.x + this.m_v2.a * this.m_v2.wA.x + this.m_v3.a * this.m_v3.wA.x;
         pB.y = pA.y = this.m_v1.a * this.m_v1.wA.y + this.m_v2.a * this.m_v2.wA.y + this.m_v3.a * this.m_v3.wA.y;
         break;
      default:
         b2Settings.b2Assert(false);
         break;
      }
   }
   b2Simplex.prototype.GetMetric = function () {
      switch (this.m_count) {
      case 0:
         b2Settings.b2Assert(false);
         return 0.0;
      case 1:
         return 0.0;
      case 2:
         return b2Math.SubtractVV(this.m_v1.w, this.m_v2.w).Length();
      case 3:
         return b2Math.CrossVV(b2Math.SubtractVV(this.m_v2.w, this.m_v1.w), b2Math.SubtractVV(this.m_v3.w, this.m_v1.w));
      default:
         b2Settings.b2Assert(false);
         return 0.0;
      }
   }
   b2Simplex.prototype.Solve2 = function () {
      var w1 = this.m_v1.w;
      var w2 = this.m_v2.w;
      var e12 = b2Math.SubtractVV(w2, w1);
      var d12_2 = (-(w1.x * e12.x + w1.y * e12.y));
      if (d12_2 <= 0.0) {
         this.m_v1.a = 1.0;
         this.m_count = 1;
         return;
      }
      var d12_1 = (w2.x * e12.x + w2.y * e12.y);
      if (d12_1 <= 0.0) {
         this.m_v2.a = 1.0;
         this.m_count = 1;
         this.m_v1.Set(this.m_v2);
         return;
      }
      var inv_d12 = 1.0 / (d12_1 + d12_2);
      this.m_v1.a = d12_1 * inv_d12;
      this.m_v2.a = d12_2 * inv_d12;
      this.m_count = 2;
   }
   b2Simplex.prototype.Solve3 = function () {
      var w1 = this.m_v1.w;
      var w2 = this.m_v2.w;
      var w3 = this.m_v3.w;
      var e12 = b2Math.SubtractVV(w2, w1);
      var w1e12 = b2Math.Dot(w1, e12);
      var w2e12 = b2Math.Dot(w2, e12);
      var d12_1 = w2e12;
      var d12_2 = (-w1e12);
      var e13 = b2Math.SubtractVV(w3, w1);
      var w1e13 = b2Math.Dot(w1, e13);
      var w3e13 = b2Math.Dot(w3, e13);
      var d13_1 = w3e13;
      var d13_2 = (-w1e13);
      var e23 = b2Math.SubtractVV(w3, w2);
      var w2e23 = b2Math.Dot(w2, e23);
      var w3e23 = b2Math.Dot(w3, e23);
      var d23_1 = w3e23;
      var d23_2 = (-w2e23);
      var n123 = b2Math.CrossVV(e12, e13);
      var d123_1 = n123 * b2Math.CrossVV(w2, w3);
      var d123_2 = n123 * b2Math.CrossVV(w3, w1);
      var d123_3 = n123 * b2Math.CrossVV(w1, w2);
      if (d12_2 <= 0.0 && d13_2 <= 0.0) {
         this.m_v1.a = 1.0;
         this.m_count = 1;
         return;
      }
      if (d12_1 > 0.0 && d12_2 > 0.0 && d123_3 <= 0.0) {
         var inv_d12 = 1.0 / (d12_1 + d12_2);
         this.m_v1.a = d12_1 * inv_d12;
         this.m_v2.a = d12_2 * inv_d12;
         this.m_count = 2;
         return;
      }
      if (d13_1 > 0.0 && d13_2 > 0.0 && d123_2 <= 0.0) {
         var inv_d13 = 1.0 / (d13_1 + d13_2);
         this.m_v1.a = d13_1 * inv_d13;
         this.m_v3.a = d13_2 * inv_d13;
         this.m_count = 2;
         this.m_v2.Set(this.m_v3);
         return;
      }
      if (d12_1 <= 0.0 && d23_2 <= 0.0) {
         this.m_v2.a = 1.0;
         this.m_count = 1;
         this.m_v1.Set(this.m_v2);
         return;
      }
      if (d13_1 <= 0.0 && d23_1 <= 0.0) {
         this.m_v3.a = 1.0;
         this.m_count = 1;
         this.m_v1.Set(this.m_v3);
         return;
      }
      if (d23_1 > 0.0 && d23_2 > 0.0 && d123_1 <= 0.0) {
         var inv_d23 = 1.0 / (d23_1 + d23_2);
         this.m_v2.a = d23_1 * inv_d23;
         this.m_v3.a = d23_2 * inv_d23;
         this.m_count = 2;
         this.m_v1.Set(this.m_v3);
         return;
      }
      var inv_d123 = 1.0 / (d123_1 + d123_2 + d123_3);
      this.m_v1.a = d123_1 * inv_d123;
      this.m_v2.a = d123_2 * inv_d123;
      this.m_v3.a = d123_3 * inv_d123;
      this.m_count = 3;
   }
   b2SimplexCache.b2SimplexCache = function () {
      this.indexA = new Vector_a2j_Number(3);
      this.indexB = new Vector_a2j_Number(3);
   };
   b2SimplexVertex.b2SimplexVertex = function () {};
   b2SimplexVertex.prototype.Set = function (other) {
      this.wA.SetV(other.wA);
      this.wB.SetV(other.wB);
      this.w.SetV(other.w);
      this.a = other.a;
      this.indexA = other.indexA;
      this.indexB = other.indexB;
   }
   b2TimeOfImpact.b2TimeOfImpact = function () {};
   b2TimeOfImpact.TimeOfImpact = function (input) {
      ++b2TimeOfImpact.b2_toiCalls;
      var proxyA = input.proxyA;
      var proxyB = input.proxyB;
      var sweepA = input.sweepA;
      var sweepB = input.sweepB;
      b2Settings.b2Assert(sweepA.t0 == sweepB.t0);
      b2Settings.b2Assert(1.0 - sweepA.t0 > Number.MIN_VALUE);
      var radius = proxyA.m_radius + proxyB.m_radius;
      var tolerance = input.tolerance;
      var alpha = 0.0;
      var k_maxIterations = 1000;
      var iter = 0;
      var target = 0.0;
      b2TimeOfImpact.s_cache.count = 0;
      b2TimeOfImpact.s_distanceInput.useRadii = false;
      for (;;) {
         sweepA.GetTransform(b2TimeOfImpact.s_xfA, alpha);
         sweepB.GetTransform(b2TimeOfImpact.s_xfB, alpha);
         b2TimeOfImpact.s_distanceInput.proxyA = proxyA;
         b2TimeOfImpact.s_distanceInput.proxyB = proxyB;
         b2TimeOfImpact.s_distanceInput.transformA = b2TimeOfImpact.s_xfA;
         b2TimeOfImpact.s_distanceInput.transformB = b2TimeOfImpact.s_xfB;
         b2Distance.Distance(b2TimeOfImpact.s_distanceOutput, b2TimeOfImpact.s_cache, b2TimeOfImpact.s_distanceInput);
         if (b2TimeOfImpact.s_distanceOutput.distance <= 0.0) {
            alpha = 1.0;
            break;
         }
         b2TimeOfImpact.s_fcn.Initialize(b2TimeOfImpact.s_cache, proxyA, b2TimeOfImpact.s_xfA, proxyB, b2TimeOfImpact.s_xfB);
         var separation = b2TimeOfImpact.s_fcn.Evaluate(b2TimeOfImpact.s_xfA, b2TimeOfImpact.s_xfB);
         if (separation <= 0.0) {
            alpha = 1.0;
            break;
         }
         if (iter == 0) {
            if (separation > radius) {
               target = b2Math.Max(radius - tolerance, 0.75 * radius);
            }
            else {
               target = b2Math.Max(separation - tolerance, 0.02 * radius);
            }
         }
         if (separation - target < 0.5 * tolerance) {
            if (iter == 0) {
               alpha = 1.0;
               break;
            }
            break;
         }
         var newAlpha = alpha; {
            var x1 = alpha;
            var x2 = 1.0;
            var f1 = separation;
            sweepA.GetTransform(b2TimeOfImpact.s_xfA, x2);
            sweepB.GetTransform(b2TimeOfImpact.s_xfB, x2);
            var f2 = b2TimeOfImpact.s_fcn.Evaluate(b2TimeOfImpact.s_xfA, b2TimeOfImpact.s_xfB);
            if (f2 >= target) {
               alpha = 1.0;
               break;
            }
            var rootIterCount = 0;
            for (;;) {
               var x = 0;
               if (rootIterCount & 1) {
                  x = x1 + (target - f1) * (x2 - x1) / (f2 - f1);
               }
               else {
                  x = 0.5 * (x1 + x2);
               }
               sweepA.GetTransform(b2TimeOfImpact.s_xfA, x);
               sweepB.GetTransform(b2TimeOfImpact.s_xfB, x);
               var f = b2TimeOfImpact.s_fcn.Evaluate(b2TimeOfImpact.s_xfA, b2TimeOfImpact.s_xfB);
               if (b2Math.Abs(f - target) < 0.025 * tolerance) {
                  newAlpha = x;
                  break;
               }
               if (f > target) {
                  x1 = x;
                  f1 = f;
               }
               else {
                  x2 = x;
                  f2 = f;
               }++rootIterCount;
               ++b2TimeOfImpact.b2_toiRootIters;
               if (rootIterCount == 50) {
                  break;
               }
            }
            b2TimeOfImpact.b2_toiMaxRootIters = b2Math.Max(b2TimeOfImpact.b2_toiMaxRootIters, rootIterCount);
         }
         if (newAlpha < (1.0 + 100.0 * Number.MIN_VALUE) * alpha) {
            break;
         }
         alpha = newAlpha;
         iter++;
         ++b2TimeOfImpact.b2_toiIters;
         if (iter == k_maxIterations) {
            break;
         }
      }
      b2TimeOfImpact.b2_toiMaxIters = b2Math.Max(b2TimeOfImpact.b2_toiMaxIters, iter);
      return alpha;
   }
   Box2D.postDefs.push(function () {
      Box2D.Collision.b2TimeOfImpact.b2_toiCalls = 0;
      Box2D.Collision.b2TimeOfImpact.b2_toiIters = 0;
      Box2D.Collision.b2TimeOfImpact.b2_toiMaxIters = 0;
      Box2D.Collision.b2TimeOfImpact.b2_toiRootIters = 0;
      Box2D.Collision.b2TimeOfImpact.b2_toiMaxRootIters = 0;
      Box2D.Collision.b2TimeOfImpact.s_cache = new b2SimplexCache();
      Box2D.Collision.b2TimeOfImpact.s_distanceInput = new b2DistanceInput();
      Box2D.Collision.b2TimeOfImpact.s_xfA = new b2Transform();
      Box2D.Collision.b2TimeOfImpact.s_xfB = new b2Transform();
      Box2D.Collision.b2TimeOfImpact.s_fcn = new b2SeparationFunction();
      Box2D.Collision.b2TimeOfImpact.s_distanceOutput = new b2DistanceOutput();
   });
   b2TOIInput.b2TOIInput = function () {
      this.proxyA = new b2DistanceProxy();
      this.proxyB = new b2DistanceProxy();
      this.sweepA = new b2Sweep();
      this.sweepB = new b2Sweep();
   };
   b2WorldManifold.b2WorldManifold = function () {
      this.m_normal = new b2Vec2();
   };
   b2WorldManifold.prototype.b2WorldManifold = function () {
      this.m_points = new Vector(b2Settings.b2_maxManifoldPoints);
      for (var i = 0; i < b2Settings.b2_maxManifoldPoints; i++) {
         this.m_points[i] = new b2Vec2();
      }
   }
   b2WorldManifold.prototype.Initialize = function (manifold, xfA, radiusA, xfB, radiusB) {
      if (radiusA === undefined) radiusA = 0;
      if (radiusB === undefined) radiusB = 0;
      if (manifold.m_pointCount == 0) {
         return;
      }
      var i = 0;
      var tVec;
      var tMat;
      var normalX = 0;
      var normalY = 0;
      var planePointX = 0;
      var planePointY = 0;
      var clipPointX = 0;
      var clipPointY = 0;
      switch (manifold.m_type) {
      case b2Manifold.e_circles:
         {
            tMat = xfA.R;
            tVec = manifold.m_localPoint;
            var pointAX = xfA.position.x + tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
            var pointAY = xfA.position.y + tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
            tMat = xfB.R;
            tVec = manifold.m_points[0].m_localPoint;
            var pointBX = xfB.position.x + tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
            var pointBY = xfB.position.y + tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
            var dX = pointBX - pointAX;
            var dY = pointBY - pointAY;
            var d2 = dX * dX + dY * dY;
            if (d2 > Number.MIN_VALUE * Number.MIN_VALUE) {
               var d = Math.sqrt(d2);
               this.m_normal.x = dX / d;
               this.m_normal.y = dY / d;
            }
            else {
               this.m_normal.x = 1;
               this.m_normal.y = 0;
            }
            var cAX = pointAX + radiusA * this.m_normal.x;
            var cAY = pointAY + radiusA * this.m_normal.y;
            var cBX = pointBX - radiusB * this.m_normal.x;
            var cBY = pointBY - radiusB * this.m_normal.y;
            this.m_points[0].x = 0.5 * (cAX + cBX);
            this.m_points[0].y = 0.5 * (cAY + cBY);
         }
         break;
      case b2Manifold.e_faceA:
         {
            tMat = xfA.R;
            tVec = manifold.m_localPlaneNormal;
            normalX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
            normalY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
            tMat = xfA.R;
            tVec = manifold.m_localPoint;
            planePointX = xfA.position.x + tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
            planePointY = xfA.position.y + tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
            this.m_normal.x = normalX;
            this.m_normal.y = normalY;
            for (i = 0;
            i < manifold.m_pointCount; i++) {
               tMat = xfB.R;
               tVec = manifold.m_points[i].m_localPoint;
               clipPointX = xfB.position.x + tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
               clipPointY = xfB.position.y + tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
               this.m_points[i].x = clipPointX + 0.5 * (radiusA - (clipPointX - planePointX) * normalX - (clipPointY - planePointY) * normalY - radiusB) * normalX;
               this.m_points[i].y = clipPointY + 0.5 * (radiusA - (clipPointX - planePointX) * normalX - (clipPointY - planePointY) * normalY - radiusB) * normalY;
            }
         }
         break;
      case b2Manifold.e_faceB:
         {
            tMat = xfB.R;
            tVec = manifold.m_localPlaneNormal;
            normalX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
            normalY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
            tMat = xfB.R;
            tVec = manifold.m_localPoint;
            planePointX = xfB.position.x + tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
            planePointY = xfB.position.y + tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
            this.m_normal.x = (-normalX);
            this.m_normal.y = (-normalY);
            for (i = 0;
            i < manifold.m_pointCount; i++) {
               tMat = xfA.R;
               tVec = manifold.m_points[i].m_localPoint;
               clipPointX = xfA.position.x + tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
               clipPointY = xfA.position.y + tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
               this.m_points[i].x = clipPointX + 0.5 * (radiusB - (clipPointX - planePointX) * normalX - (clipPointY - planePointY) * normalY - radiusA) * normalX;
               this.m_points[i].y = clipPointY + 0.5 * (radiusB - (clipPointX - planePointX) * normalX - (clipPointY - planePointY) * normalY - radiusA) * normalY;
            }
         }
         break;
      }
   }
   ClipVertex.ClipVertex = function () {
      this.v = new b2Vec2();
      this.id = new b2ContactID();
   };
   ClipVertex.prototype.Set = function (other) {
      this.v.SetV(other.v);
      this.id.Set(other.id);
   }
   Features.Features = function () {};
   Object.defineProperty(Features.prototype, 'referenceEdge', {
      enumerable: false,
      configurable: true,
      get: function () {
         return this._referenceEdge;
      }
   });
   Object.defineProperty(Features.prototype, 'referenceEdge', {
      enumerable: false,
      configurable: true,
      set: function (value) {
         if (value === undefined) value = 0;
         this._referenceEdge = value;
         this._m_id._key = (this._m_id._key & 0xffffff00) | (this._referenceEdge & 0x000000ff);
      }
   });
   Object.defineProperty(Features.prototype, 'incidentEdge', {
      enumerable: false,
      configurable: true,
      get: function () {
         return this._incidentEdge;
      }
   });
   Object.defineProperty(Features.prototype, 'incidentEdge', {
      enumerable: false,
      configurable: true,
      set: function (value) {
         if (value === undefined) value = 0;
         this._incidentEdge = value;
         this._m_id._key = (this._m_id._key & 0xffff00ff) | ((this._incidentEdge << 8) & 0x0000ff00);
      }
   });
   Object.defineProperty(Features.prototype, 'incidentVertex', {
      enumerable: false,
      configurable: true,
      get: function () {
         return this._incidentVertex;
      }
   });
   Object.defineProperty(Features.prototype, 'incidentVertex', {
      enumerable: false,
      configurable: true,
      set: function (value) {
         if (value === undefined) value = 0;
         this._incidentVertex = value;
         this._m_id._key = (this._m_id._key & 0xff00ffff) | ((this._incidentVertex << 16) & 0x00ff0000);
      }
   });
   Object.defineProperty(Features.prototype, 'flip', {
      enumerable: false,
      configurable: true,
      get: function () {
         return this._flip;
      }
   });
   Object.defineProperty(Features.prototype, 'flip', {
      enumerable: false,
      configurable: true,
      set: function (value) {
         if (value === undefined) value = 0;
         this._flip = value;
         this._m_id._key = (this._m_id._key & 0x00ffffff) | ((this._flip << 24) & 0xff000000);
      }
   });
})();
(function () {
   var b2Color = Box2D.Common.b2Color,
      b2internal = Box2D.Common.b2internal,
      b2Settings = Box2D.Common.b2Settings,
      b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
      b2EdgeChainDef = Box2D.Collision.Shapes.b2EdgeChainDef,
      b2EdgeShape = Box2D.Collision.Shapes.b2EdgeShape,
      b2MassData = Box2D.Collision.Shapes.b2MassData,
      b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
      b2Shape = Box2D.Collision.Shapes.b2Shape,
      b2Mat22 = Box2D.Common.Math.b2Mat22,
      b2Mat33 = Box2D.Common.Math.b2Mat33,
      b2Math = Box2D.Common.Math.b2Math,
      b2Sweep = Box2D.Common.Math.b2Sweep,
      b2Transform = Box2D.Common.Math.b2Transform,
      b2Vec2 = Box2D.Common.Math.b2Vec2,
      b2Vec3 = Box2D.Common.Math.b2Vec3,
      b2Body = Box2D.Dynamics.b2Body,
      b2BodyDef = Box2D.Dynamics.b2BodyDef,
      b2ContactFilter = Box2D.Dynamics.b2ContactFilter,
      b2ContactImpulse = Box2D.Dynamics.b2ContactImpulse,
      b2ContactListener = Box2D.Dynamics.b2ContactListener,
      b2ContactManager = Box2D.Dynamics.b2ContactManager,
      b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
      b2DestructionListener = Box2D.Dynamics.b2DestructionListener,
      b2FilterData = Box2D.Dynamics.b2FilterData,
      b2Fixture = Box2D.Dynamics.b2Fixture,
      b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
      b2Island = Box2D.Dynamics.b2Island,
      b2TimeStep = Box2D.Dynamics.b2TimeStep,
      b2World = Box2D.Dynamics.b2World,
      b2AABB = Box2D.Collision.b2AABB,
      b2Bound = Box2D.Collision.b2Bound,
      b2BoundValues = Box2D.Collision.b2BoundValues,
      b2Collision = Box2D.Collision.b2Collision,
      b2ContactID = Box2D.Collision.b2ContactID,
      b2ContactPoint = Box2D.Collision.b2ContactPoint,
      b2Distance = Box2D.Collision.b2Distance,
      b2DistanceInput = Box2D.Collision.b2DistanceInput,
      b2DistanceOutput = Box2D.Collision.b2DistanceOutput,
      b2DistanceProxy = Box2D.Collision.b2DistanceProxy,
      b2DynamicTree = Box2D.Collision.b2DynamicTree,
      b2DynamicTreeBroadPhase = Box2D.Collision.b2DynamicTreeBroadPhase,
      b2DynamicTreeNode = Box2D.Collision.b2DynamicTreeNode,
      b2DynamicTreePair = Box2D.Collision.b2DynamicTreePair,
      b2Manifold = Box2D.Collision.b2Manifold,
      b2ManifoldPoint = Box2D.Collision.b2ManifoldPoint,
      b2Point = Box2D.Collision.b2Point,
      b2RayCastInput = Box2D.Collision.b2RayCastInput,
      b2RayCastOutput = Box2D.Collision.b2RayCastOutput,
      b2Segment = Box2D.Collision.b2Segment,
      b2SeparationFunction = Box2D.Collision.b2SeparationFunction,
      b2Simplex = Box2D.Collision.b2Simplex,
      b2SimplexCache = Box2D.Collision.b2SimplexCache,
      b2SimplexVertex = Box2D.Collision.b2SimplexVertex,
      b2TimeOfImpact = Box2D.Collision.b2TimeOfImpact,
      b2TOIInput = Box2D.Collision.b2TOIInput,
      b2WorldManifold = Box2D.Collision.b2WorldManifold,
      ClipVertex = Box2D.Collision.ClipVertex,
      Features = Box2D.Collision.Features,
      IBroadPhase = Box2D.Collision.IBroadPhase;

   Box2D.inherit(b2CircleShape, Box2D.Collision.Shapes.b2Shape);
   b2CircleShape.prototype.__super = Box2D.Collision.Shapes.b2Shape.prototype;
   b2CircleShape.b2CircleShape = function () {
      Box2D.Collision.Shapes.b2Shape.b2Shape.apply(this, arguments);
      this.m_p = new b2Vec2();
   };
   b2CircleShape.prototype.Copy = function () {
      var s = new b2CircleShape();
      s.Set(this);
      return s;
   }
   b2CircleShape.prototype.Set = function (other) {
      this.__super.Set.call(this, other);
      if (Box2D.is(other, b2CircleShape)) {
         var other2 = (other instanceof b2CircleShape ? other : null);
         this.m_p.SetV(other2.m_p);
      }
   }
   b2CircleShape.prototype.TestPoint = function (transform, p) {
      var tMat = transform.R;
      var dX = transform.position.x + (tMat.col1.x * this.m_p.x + tMat.col2.x * this.m_p.y);
      var dY = transform.position.y + (tMat.col1.y * this.m_p.x + tMat.col2.y * this.m_p.y);
      dX = p.x - dX;
      dY = p.y - dY;
      return (dX * dX + dY * dY) <= this.m_radius * this.m_radius;
   }
   b2CircleShape.prototype.RayCast = function (output, input, transform) {
      var tMat = transform.R;
      var positionX = transform.position.x + (tMat.col1.x * this.m_p.x + tMat.col2.x * this.m_p.y);
      var positionY = transform.position.y + (tMat.col1.y * this.m_p.x + tMat.col2.y * this.m_p.y);
      var sX = input.p1.x - positionX;
      var sY = input.p1.y - positionY;
      var b = (sX * sX + sY * sY) - this.m_radius * this.m_radius;
      var rX = input.p2.x - input.p1.x;
      var rY = input.p2.y - input.p1.y;
      var c = (sX * rX + sY * rY);
      var rr = (rX * rX + rY * rY);
      var sigma = c * c - rr * b;
      if (sigma < 0.0 || rr < Number.MIN_VALUE) {
         return false;
      }
      var a = (-(c + Math.sqrt(sigma)));
      if (0.0 <= a && a <= input.maxFraction * rr) {
         a /= rr;
         output.fraction = a;
         output.normal.x = sX + a * rX;
         output.normal.y = sY + a * rY;
         output.normal.Normalize();
         return true;
      }
      return false;
   }
   b2CircleShape.prototype.ComputeAABB = function (aabb, transform) {
      var tMat = transform.R;
      var pX = transform.position.x + (tMat.col1.x * this.m_p.x + tMat.col2.x * this.m_p.y);
      var pY = transform.position.y + (tMat.col1.y * this.m_p.x + tMat.col2.y * this.m_p.y);
      aabb.lowerBound.Set(pX - this.m_radius, pY - this.m_radius);
      aabb.upperBound.Set(pX + this.m_radius, pY + this.m_radius);
   }
   b2CircleShape.prototype.ComputeMass = function (massData, density) {
      if (density === undefined) density = 0;
      massData.mass = density * b2Settings.b2_pi * this.m_radius * this.m_radius;
      massData.center.SetV(this.m_p);
      massData.I = massData.mass * (0.5 * this.m_radius * this.m_radius + (this.m_p.x * this.m_p.x + this.m_p.y * this.m_p.y));
   }
   b2CircleShape.prototype.ComputeSubmergedArea = function (normal, offset, xf, c) {
      if (offset === undefined) offset = 0;
      var p = b2Math.MulX(xf, this.m_p);
      var l = (-(b2Math.Dot(normal, p) - offset));
      if (l < (-this.m_radius) + Number.MIN_VALUE) {
         return 0;
      }
      if (l > this.m_radius) {
         c.SetV(p);
         return Math.PI * this.m_radius * this.m_radius;
      }
      var r2 = this.m_radius * this.m_radius;
      var l2 = l * l;
      var area = r2 * (Math.asin(l / this.m_radius) + Math.PI / 2) + l * Math.sqrt(r2 - l2);
      var com = (-2 / 3 * Math.pow(r2 - l2, 1.5) / area);
      c.x = p.x + normal.x * com;
      c.y = p.y + normal.y * com;
      return area;
   }
   b2CircleShape.prototype.GetLocalPosition = function () {
      return this.m_p;
   }
   b2CircleShape.prototype.SetLocalPosition = function (position) {
      this.m_p.SetV(position);
   }
   b2CircleShape.prototype.GetRadius = function () {
      return this.m_radius;
   }
   b2CircleShape.prototype.SetRadius = function (radius) {
      if (radius === undefined) radius = 0;
      this.m_radius = radius;
   }
   b2CircleShape.prototype.b2CircleShape = function (radius) {
      if (radius === undefined) radius = 0;
      this.__super.b2Shape.call(this);
      this.m_type = b2Shape.e_circleShape;
      this.m_radius = radius;
   }
   b2EdgeChainDef.b2EdgeChainDef = function () {};
   b2EdgeChainDef.prototype.b2EdgeChainDef = function () {
      this.vertexCount = 0;
      this.isALoop = true;
      this.vertices = [];
   }
   Box2D.inherit(b2EdgeShape, Box2D.Collision.Shapes.b2Shape);
   b2EdgeShape.prototype.__super = Box2D.Collision.Shapes.b2Shape.prototype;
   b2EdgeShape.b2EdgeShape = function () {
      Box2D.Collision.Shapes.b2Shape.b2Shape.apply(this, arguments);
      this.s_supportVec = new b2Vec2();
      this.m_v1 = new b2Vec2();
      this.m_v2 = new b2Vec2();
      this.m_coreV1 = new b2Vec2();
      this.m_coreV2 = new b2Vec2();
      this.m_normal = new b2Vec2();
      this.m_direction = new b2Vec2();
      this.m_cornerDir1 = new b2Vec2();
      this.m_cornerDir2 = new b2Vec2();
   };
   b2EdgeShape.prototype.TestPoint = function (transform, p) {
      return false;
   }
   b2EdgeShape.prototype.RayCast = function (output, input, transform) {
      var tMat;
      var rX = input.p2.x - input.p1.x;
      var rY = input.p2.y - input.p1.y;
      tMat = transform.R;
      var v1X = transform.position.x + (tMat.col1.x * this.m_v1.x + tMat.col2.x * this.m_v1.y);
      var v1Y = transform.position.y + (tMat.col1.y * this.m_v1.x + tMat.col2.y * this.m_v1.y);
      var nX = transform.position.y + (tMat.col1.y * this.m_v2.x + tMat.col2.y * this.m_v2.y) - v1Y;
      var nY = (-(transform.position.x + (tMat.col1.x * this.m_v2.x + tMat.col2.x * this.m_v2.y) - v1X));
      var k_slop = 100.0 * Number.MIN_VALUE;
      var denom = (-(rX * nX + rY * nY));
      if (denom > k_slop) {
         var bX = input.p1.x - v1X;
         var bY = input.p1.y - v1Y;
         var a = (bX * nX + bY * nY);
         if (0.0 <= a && a <= input.maxFraction * denom) {
            var mu2 = (-rX * bY) + rY * bX;
            if ((-k_slop * denom) <= mu2 && mu2 <= denom * (1.0 + k_slop)) {
               a /= denom;
               output.fraction = a;
               var nLen = Math.sqrt(nX * nX + nY * nY);
               output.normal.x = nX / nLen;
               output.normal.y = nY / nLen;
               return true;
            }
         }
      }
      return false;
   }
   b2EdgeShape.prototype.ComputeAABB = function (aabb, transform) {
      var tMat = transform.R;
      var v1X = transform.position.x + (tMat.col1.x * this.m_v1.x + tMat.col2.x * this.m_v1.y);
      var v1Y = transform.position.y + (tMat.col1.y * this.m_v1.x + tMat.col2.y * this.m_v1.y);
      var v2X = transform.position.x + (tMat.col1.x * this.m_v2.x + tMat.col2.x * this.m_v2.y);
      var v2Y = transform.position.y + (tMat.col1.y * this.m_v2.x + tMat.col2.y * this.m_v2.y);
      if (v1X < v2X) {
         aabb.lowerBound.x = v1X;
         aabb.upperBound.x = v2X;
      }
      else {
         aabb.lowerBound.x = v2X;
         aabb.upperBound.x = v1X;
      }
      if (v1Y < v2Y) {
         aabb.lowerBound.y = v1Y;
         aabb.upperBound.y = v2Y;
      }
      else {
         aabb.lowerBound.y = v2Y;
         aabb.upperBound.y = v1Y;
      }
   }
   b2EdgeShape.prototype.ComputeMass = function (massData, density) {
      if (density === undefined) density = 0;
      massData.mass = 0;
      massData.center.SetV(this.m_v1);
      massData.I = 0;
   }
   b2EdgeShape.prototype.ComputeSubmergedArea = function (normal, offset, xf, c) {
      if (offset === undefined) offset = 0;
      var v0 = new b2Vec2(normal.x * offset, normal.y * offset);
      var v1 = b2Math.MulX(xf, this.m_v1);
      var v2 = b2Math.MulX(xf, this.m_v2);
      var d1 = b2Math.Dot(normal, v1) - offset;
      var d2 = b2Math.Dot(normal, v2) - offset;
      if (d1 > 0) {
         if (d2 > 0) {
            return 0;
         }
         else {
            v1.x = (-d2 / (d1 - d2) * v1.x) + d1 / (d1 - d2) * v2.x;
            v1.y = (-d2 / (d1 - d2) * v1.y) + d1 / (d1 - d2) * v2.y;
         }
      }
      else {
         if (d2 > 0) {
            v2.x = (-d2 / (d1 - d2) * v1.x) + d1 / (d1 - d2) * v2.x;
            v2.y = (-d2 / (d1 - d2) * v1.y) + d1 / (d1 - d2) * v2.y;
         }
         else {}
      }
      c.x = (v0.x + v1.x + v2.x) / 3;
      c.y = (v0.y + v1.y + v2.y) / 3;
      return 0.5 * ((v1.x - v0.x) * (v2.y - v0.y) - (v1.y - v0.y) * (v2.x - v0.x));
   }
   b2EdgeShape.prototype.GetLength = function () {
      return this.m_length;
   }
   b2EdgeShape.prototype.GetVertex1 = function () {
      return this.m_v1;
   }
   b2EdgeShape.prototype.GetVertex2 = function () {
      return this.m_v2;
   }
   b2EdgeShape.prototype.GetCoreVertex1 = function () {
      return this.m_coreV1;
   }
   b2EdgeShape.prototype.GetCoreVertex2 = function () {
      return this.m_coreV2;
   }
   b2EdgeShape.prototype.GetNormalVector = function () {
      return this.m_normal;
   }
   b2EdgeShape.prototype.GetDirectionVector = function () {
      return this.m_direction;
   }
   b2EdgeShape.prototype.GetCorner1Vector = function () {
      return this.m_cornerDir1;
   }
   b2EdgeShape.prototype.GetCorner2Vector = function () {
      return this.m_cornerDir2;
   }
   b2EdgeShape.prototype.Corner1IsConvex = function () {
      return this.m_cornerConvex1;
   }
   b2EdgeShape.prototype.Corner2IsConvex = function () {
      return this.m_cornerConvex2;
   }
   b2EdgeShape.prototype.GetFirstVertex = function (xf) {
      var tMat = xf.R;
      return new b2Vec2(xf.position.x + (tMat.col1.x * this.m_coreV1.x + tMat.col2.x * this.m_coreV1.y), xf.position.y + (tMat.col1.y * this.m_coreV1.x + tMat.col2.y * this.m_coreV1.y));
   }
   b2EdgeShape.prototype.GetNextEdge = function () {
      return this.m_nextEdge;
   }
   b2EdgeShape.prototype.GetPrevEdge = function () {
      return this.m_prevEdge;
   }
   b2EdgeShape.prototype.Support = function (xf, dX, dY) {
      if (dX === undefined) dX = 0;
      if (dY === undefined) dY = 0;
      var tMat = xf.R;
      var v1X = xf.position.x + (tMat.col1.x * this.m_coreV1.x + tMat.col2.x * this.m_coreV1.y);
      var v1Y = xf.position.y + (tMat.col1.y * this.m_coreV1.x + tMat.col2.y * this.m_coreV1.y);
      var v2X = xf.position.x + (tMat.col1.x * this.m_coreV2.x + tMat.col2.x * this.m_coreV2.y);
      var v2Y = xf.position.y + (tMat.col1.y * this.m_coreV2.x + tMat.col2.y * this.m_coreV2.y);
      if ((v1X * dX + v1Y * dY) > (v2X * dX + v2Y * dY)) {
         this.s_supportVec.x = v1X;
         this.s_supportVec.y = v1Y;
      }
      else {
         this.s_supportVec.x = v2X;
         this.s_supportVec.y = v2Y;
      }
      return this.s_supportVec;
   }
   b2EdgeShape.prototype.b2EdgeShape = function (v1, v2) {
      this.__super.b2Shape.call(this);
      this.m_type = b2Shape.e_edgeShape;
      this.m_prevEdge = null;
      this.m_nextEdge = null;
      this.m_v1 = v1;
      this.m_v2 = v2;
      this.m_direction.Set(this.m_v2.x - this.m_v1.x, this.m_v2.y - this.m_v1.y);
      this.m_length = this.m_direction.Normalize();
      this.m_normal.Set(this.m_direction.y, (-this.m_direction.x));
      this.m_coreV1.Set((-b2Settings.b2_toiSlop * (this.m_normal.x - this.m_direction.x)) + this.m_v1.x, (-b2Settings.b2_toiSlop * (this.m_normal.y - this.m_direction.y)) + this.m_v1.y);
      this.m_coreV2.Set((-b2Settings.b2_toiSlop * (this.m_normal.x + this.m_direction.x)) + this.m_v2.x, (-b2Settings.b2_toiSlop * (this.m_normal.y + this.m_direction.y)) + this.m_v2.y);
      this.m_cornerDir1 = this.m_normal;
      this.m_cornerDir2.Set((-this.m_normal.x), (-this.m_normal.y));
   }
   b2EdgeShape.prototype.SetPrevEdge = function (edge, core, cornerDir, convex) {
      this.m_prevEdge = edge;
      this.m_coreV1 = core;
      this.m_cornerDir1 = cornerDir;
      this.m_cornerConvex1 = convex;
   }
   b2EdgeShape.prototype.SetNextEdge = function (edge, core, cornerDir, convex) {
      this.m_nextEdge = edge;
      this.m_coreV2 = core;
      this.m_cornerDir2 = cornerDir;
      this.m_cornerConvex2 = convex;
   }
   b2MassData.b2MassData = function () {
      this.mass = 0.0;
      this.center = new b2Vec2(0, 0);
      this.I = 0.0;
   };
   Box2D.inherit(b2PolygonShape, Box2D.Collision.Shapes.b2Shape);
   b2PolygonShape.prototype.__super = Box2D.Collision.Shapes.b2Shape.prototype;
   b2PolygonShape.b2PolygonShape = function () {
      Box2D.Collision.Shapes.b2Shape.b2Shape.apply(this, arguments);
   };
   b2PolygonShape.prototype.Copy = function () {
      var s = new b2PolygonShape();
      s.Set(this);
      return s;
   }
   b2PolygonShape.prototype.Set = function (other) {
      this.__super.Set.call(this, other);
      if (Box2D.is(other, b2PolygonShape)) {
         var other2 = (other instanceof b2PolygonShape ? other : null);
         this.m_centroid.SetV(other2.m_centroid);
         this.m_vertexCount = other2.m_vertexCount;
         this.Reserve(this.m_vertexCount);
         for (var i = 0; i < this.m_vertexCount; i++) {
            this.m_vertices[i].SetV(other2.m_vertices[i]);
            this.m_normals[i].SetV(other2.m_normals[i]);
         }
      }
   }
   b2PolygonShape.prototype.SetAsArray = function (vertices, vertexCount) {
      if (vertexCount === undefined) vertexCount = 0;
      var v = new Vector();
      var i = 0,
         tVec;
      for (i = 0;
      i < vertices.length; ++i) {
         tVec = vertices[i];
         v.push(tVec);
      }
      this.SetAsVector(v, vertexCount);
   }
   b2PolygonShape.AsArray = function (vertices, vertexCount) {
      if (vertexCount === undefined) vertexCount = 0;
      var polygonShape = new b2PolygonShape();
      polygonShape.SetAsArray(vertices, vertexCount);
      return polygonShape;
   }
   b2PolygonShape.prototype.SetAsVector = function (vertices, vertexCount) {
      if (vertexCount === undefined) vertexCount = 0;
      if (vertexCount == 0) vertexCount = vertices.length;
      b2Settings.b2Assert(2 <= vertexCount);
      this.m_vertexCount = vertexCount;
      this.Reserve(vertexCount);
      var i = 0;
      for (i = 0;
      i < this.m_vertexCount; i++) {
         this.m_vertices[i].SetV(vertices[i]);
      }
      for (i = 0;
      i < this.m_vertexCount; ++i) {
         var i1 = parseInt(i);
         var i2 = parseInt(i + 1 < this.m_vertexCount ? i + 1 : 0);
         var edge = b2Math.SubtractVV(this.m_vertices[i2], this.m_vertices[i1]);
         b2Settings.b2Assert(edge.LengthSquared() > Number.MIN_VALUE);
         this.m_normals[i].SetV(b2Math.CrossVF(edge, 1.0));
         this.m_normals[i].Normalize();
      }
      this.m_centroid = b2PolygonShape.ComputeCentroid(this.m_vertices, this.m_vertexCount);
   }
   b2PolygonShape.AsVector = function (vertices, vertexCount) {
      if (vertexCount === undefined) vertexCount = 0;
      var polygonShape = new b2PolygonShape();
      polygonShape.SetAsVector(vertices, vertexCount);
      return polygonShape;
   }
   b2PolygonShape.prototype.SetAsBox = function (hx, hy) {
      if (hx === undefined) hx = 0;
      if (hy === undefined) hy = 0;
      this.m_vertexCount = 4;
      this.Reserve(4);
      this.m_vertices[0].Set((-hx), (-hy));
      this.m_vertices[1].Set(hx, (-hy));
      this.m_vertices[2].Set(hx, hy);
      this.m_vertices[3].Set((-hx), hy);
      this.m_normals[0].Set(0.0, (-1.0));
      this.m_normals[1].Set(1.0, 0.0);
      this.m_normals[2].Set(0.0, 1.0);
      this.m_normals[3].Set((-1.0), 0.0);
      this.m_centroid.SetZero();
   }
   b2PolygonShape.AsBox = function (hx, hy) {
      if (hx === undefined) hx = 0;
      if (hy === undefined) hy = 0;
      var polygonShape = new b2PolygonShape();
      polygonShape.SetAsBox(hx, hy);
      return polygonShape;
   }
   b2PolygonShape.prototype.SetAsOrientedBox = function (hx, hy, center, angle) {
      if (hx === undefined) hx = 0;
      if (hy === undefined) hy = 0;
      if (center === undefined) center = null;
      if (angle === undefined) angle = 0.0;
      this.m_vertexCount = 4;
      this.Reserve(4);
      this.m_vertices[0].Set((-hx), (-hy));
      this.m_vertices[1].Set(hx, (-hy));
      this.m_vertices[2].Set(hx, hy);
      this.m_vertices[3].Set((-hx), hy);
      this.m_normals[0].Set(0.0, (-1.0));
      this.m_normals[1].Set(1.0, 0.0);
      this.m_normals[2].Set(0.0, 1.0);
      this.m_normals[3].Set((-1.0), 0.0);
      this.m_centroid = center;
      var xf = new b2Transform();
      xf.position = center;
      xf.R.Set(angle);
      for (var i = 0; i < this.m_vertexCount; ++i) {
         this.m_vertices[i] = b2Math.MulX(xf, this.m_vertices[i]);
         this.m_normals[i] = b2Math.MulMV(xf.R, this.m_normals[i]);
      }
   }
   b2PolygonShape.AsOrientedBox = function (hx, hy, center, angle) {
      if (hx === undefined) hx = 0;
      if (hy === undefined) hy = 0;
      if (center === undefined) center = null;
      if (angle === undefined) angle = 0.0;
      var polygonShape = new b2PolygonShape();
      polygonShape.SetAsOrientedBox(hx, hy, center, angle);
      return polygonShape;
   }
   b2PolygonShape.prototype.SetAsEdge = function (v1, v2) {
      this.m_vertexCount = 2;
      this.Reserve(2);
      this.m_vertices[0].SetV(v1);
      this.m_vertices[1].SetV(v2);
      this.m_centroid.x = 0.5 * (v1.x + v2.x);
      this.m_centroid.y = 0.5 * (v1.y + v2.y);
      this.m_normals[0] = b2Math.CrossVF(b2Math.SubtractVV(v2, v1), 1.0);
      this.m_normals[0].Normalize();
      this.m_normals[1].x = (-this.m_normals[0].x);
      this.m_normals[1].y = (-this.m_normals[0].y);
   }
   b2PolygonShape.AsEdge = function (v1, v2) {
      var polygonShape = new b2PolygonShape();
      polygonShape.SetAsEdge(v1, v2);
      return polygonShape;
   }
   b2PolygonShape.prototype.TestPoint = function (xf, p) {
      var tVec;
      var tMat = xf.R;
      var tX = p.x - xf.position.x;
      var tY = p.y - xf.position.y;
      var pLocalX = (tX * tMat.col1.x + tY * tMat.col1.y);
      var pLocalY = (tX * tMat.col2.x + tY * tMat.col2.y);
      for (var i = 0; i < this.m_vertexCount; ++i) {
         tVec = this.m_vertices[i];
         tX = pLocalX - tVec.x;
         tY = pLocalY - tVec.y;
         tVec = this.m_normals[i];
         var dot = (tVec.x * tX + tVec.y * tY);
         if (dot > 0.0) {
            return false;
         }
      }
      return true;
   }
   b2PolygonShape.prototype.RayCast = function (output, input, transform) {
      var lower = 0.0;
      var upper = input.maxFraction;
      var tX = 0;
      var tY = 0;
      var tMat;
      var tVec;
      tX = input.p1.x - transform.position.x;
      tY = input.p1.y - transform.position.y;
      tMat = transform.R;
      var p1X = (tX * tMat.col1.x + tY * tMat.col1.y);
      var p1Y = (tX * tMat.col2.x + tY * tMat.col2.y);
      tX = input.p2.x - transform.position.x;
      tY = input.p2.y - transform.position.y;
      tMat = transform.R;
      var p2X = (tX * tMat.col1.x + tY * tMat.col1.y);
      var p2Y = (tX * tMat.col2.x + tY * tMat.col2.y);
      var dX = p2X - p1X;
      var dY = p2Y - p1Y;
      var index = parseInt((-1));
      for (var i = 0; i < this.m_vertexCount; ++i) {
         tVec = this.m_vertices[i];
         tX = tVec.x - p1X;
         tY = tVec.y - p1Y;
         tVec = this.m_normals[i];
         var numerator = (tVec.x * tX + tVec.y * tY);
         var denominator = (tVec.x * dX + tVec.y * dY);
         if (denominator == 0.0) {
            if (numerator < 0.0) {
               return false;
            }
         }
         else {
            if (denominator < 0.0 && numerator < lower * denominator) {
               lower = numerator / denominator;
               index = i;
            }
            else if (denominator > 0.0 && numerator < upper * denominator) {
               upper = numerator / denominator;
            }
         }
         if (upper < lower - Number.MIN_VALUE) {
            return false;
         }
      }
      if (index >= 0) {
         output.fraction = lower;
         tMat = transform.R;
         tVec = this.m_normals[index];
         output.normal.x = (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
         output.normal.y = (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
         return true;
      }
      return false;
   }
   b2PolygonShape.prototype.ComputeAABB = function (aabb, xf) {
      var tMat = xf.R;
      var tVec = this.m_vertices[0];
      var lowerX = xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
      var lowerY = xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      var upperX = lowerX;
      var upperY = lowerY;
      for (var i = 1; i < this.m_vertexCount; ++i) {
         tVec = this.m_vertices[i];
         var vX = xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
         var vY = xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
         lowerX = lowerX < vX ? lowerX : vX;
         lowerY = lowerY < vY ? lowerY : vY;
         upperX = upperX > vX ? upperX : vX;
         upperY = upperY > vY ? upperY : vY;
      }
      aabb.lowerBound.x = lowerX - this.m_radius;
      aabb.lowerBound.y = lowerY - this.m_radius;
      aabb.upperBound.x = upperX + this.m_radius;
      aabb.upperBound.y = upperY + this.m_radius;
   }
   b2PolygonShape.prototype.ComputeMass = function (massData, density) {
      if (density === undefined) density = 0;
      if (this.m_vertexCount == 2) {
         massData.center.x = 0.5 * (this.m_vertices[0].x + this.m_vertices[1].x);
         massData.center.y = 0.5 * (this.m_vertices[0].y + this.m_vertices[1].y);
         massData.mass = 0.0;
         massData.I = 0.0;
         return;
      }
      var centerX = 0.0;
      var centerY = 0.0;
      var area = 0.0;
      var I = 0.0;
      var p1X = 0.0;
      var p1Y = 0.0;
      var k_inv3 = 1.0 / 3.0;
      for (var i = 0; i < this.m_vertexCount; ++i) {
         var p2 = this.m_vertices[i];
         var p3 = i + 1 < this.m_vertexCount ? this.m_vertices[parseInt(i + 1)] : this.m_vertices[0];
         var e1X = p2.x - p1X;
         var e1Y = p2.y - p1Y;
         var e2X = p3.x - p1X;
         var e2Y = p3.y - p1Y;
         var D = e1X * e2Y - e1Y * e2X;
         var triangleArea = 0.5 * D;area += triangleArea;
         centerX += triangleArea * k_inv3 * (p1X + p2.x + p3.x);
         centerY += triangleArea * k_inv3 * (p1Y + p2.y + p3.y);
         var px = p1X;
         var py = p1Y;
         var ex1 = e1X;
         var ey1 = e1Y;
         var ex2 = e2X;
         var ey2 = e2Y;
         var intx2 = k_inv3 * (0.25 * (ex1 * ex1 + ex2 * ex1 + ex2 * ex2) + (px * ex1 + px * ex2)) + 0.5 * px * px;
         var inty2 = k_inv3 * (0.25 * (ey1 * ey1 + ey2 * ey1 + ey2 * ey2) + (py * ey1 + py * ey2)) + 0.5 * py * py;I += D * (intx2 + inty2);
      }
      massData.mass = density * area;
      centerX *= 1.0 / area;
      centerY *= 1.0 / area;
      massData.center.Set(centerX, centerY);
      massData.I = density * I;
   }
   b2PolygonShape.prototype.ComputeSubmergedArea = function (normal, offset, xf, c) {
      if (offset === undefined) offset = 0;
      var normalL = b2Math.MulTMV(xf.R, normal);
      var offsetL = offset - b2Math.Dot(normal, xf.position);
      var depths = new Vector_a2j_Number();
      var diveCount = 0;
      var intoIndex = parseInt((-1));
      var outoIndex = parseInt((-1));
      var lastSubmerged = false;
      var i = 0;
      for (i = 0;
      i < this.m_vertexCount; ++i) {
         depths[i] = b2Math.Dot(normalL, this.m_vertices[i]) - offsetL;
         var isSubmerged = depths[i] < (-Number.MIN_VALUE);
         if (i > 0) {
            if (isSubmerged) {
               if (!lastSubmerged) {
                  intoIndex = i - 1;
                  diveCount++;
               }
            }
            else {
               if (lastSubmerged) {
                  outoIndex = i - 1;
                  diveCount++;
               }
            }
         }
         lastSubmerged = isSubmerged;
      }
      switch (diveCount) {
      case 0:
         if (lastSubmerged) {
            var md = new b2MassData();
            this.ComputeMass(md, 1);
            c.SetV(b2Math.MulX(xf, md.center));
            return md.mass;
         }
         else {
            return 0;
         }
         break;
      case 1:
         if (intoIndex == (-1)) {
            intoIndex = this.m_vertexCount - 1;
         }
         else {
            outoIndex = this.m_vertexCount - 1;
         }
         break;
      }
      var intoIndex2 = parseInt((intoIndex + 1) % this.m_vertexCount);
      var outoIndex2 = parseInt((outoIndex + 1) % this.m_vertexCount);
      var intoLamdda = (0 - depths[intoIndex]) / (depths[intoIndex2] - depths[intoIndex]);
      var outoLamdda = (0 - depths[outoIndex]) / (depths[outoIndex2] - depths[outoIndex]);
      var intoVec = new b2Vec2(this.m_vertices[intoIndex].x * (1 - intoLamdda) + this.m_vertices[intoIndex2].x * intoLamdda, this.m_vertices[intoIndex].y * (1 - intoLamdda) + this.m_vertices[intoIndex2].y * intoLamdda);
      var outoVec = new b2Vec2(this.m_vertices[outoIndex].x * (1 - outoLamdda) + this.m_vertices[outoIndex2].x * outoLamdda, this.m_vertices[outoIndex].y * (1 - outoLamdda) + this.m_vertices[outoIndex2].y * outoLamdda);
      var area = 0;
      var center = new b2Vec2();
      var p2 = this.m_vertices[intoIndex2];
      var p3;
      i = intoIndex2;
      while (i != outoIndex2) {
         i = (i + 1) % this.m_vertexCount;
         if (i == outoIndex2) p3 = outoVec;
         else p3 = this.m_vertices[i];
         var triangleArea = 0.5 * ((p2.x - intoVec.x) * (p3.y - intoVec.y) - (p2.y - intoVec.y) * (p3.x - intoVec.x));
         area += triangleArea;
         center.x += triangleArea * (intoVec.x + p2.x + p3.x) / 3;
         center.y += triangleArea * (intoVec.y + p2.y + p3.y) / 3;
         p2 = p3;
      }
      center.Multiply(1 / area);
      c.SetV(b2Math.MulX(xf, center));
      return area;
   }
   b2PolygonShape.prototype.GetVertexCount = function () {
      return this.m_vertexCount;
   }
   b2PolygonShape.prototype.GetVertices = function () {
      return this.m_vertices;
   }
   b2PolygonShape.prototype.GetNormals = function () {
      return this.m_normals;
   }
   b2PolygonShape.prototype.GetSupport = function (d) {
      var bestIndex = 0;
      var bestValue = this.m_vertices[0].x * d.x + this.m_vertices[0].y * d.y;
      for (var i = 1; i < this.m_vertexCount; ++i) {
         var value = this.m_vertices[i].x * d.x + this.m_vertices[i].y * d.y;
         if (value > bestValue) {
            bestIndex = i;
            bestValue = value;
         }
      }
      return bestIndex;
   }
   b2PolygonShape.prototype.GetSupportVertex = function (d) {
      var bestIndex = 0;
      var bestValue = this.m_vertices[0].x * d.x + this.m_vertices[0].y * d.y;
      for (var i = 1; i < this.m_vertexCount; ++i) {
         var value = this.m_vertices[i].x * d.x + this.m_vertices[i].y * d.y;
         if (value > bestValue) {
            bestIndex = i;
            bestValue = value;
         }
      }
      return this.m_vertices[bestIndex];
   }
   b2PolygonShape.prototype.Validate = function () {
      return false;
   }
   b2PolygonShape.prototype.b2PolygonShape = function () {
      this.__super.b2Shape.call(this);
      this.m_type = b2Shape.e_polygonShape;
      this.m_centroid = new b2Vec2();
      this.m_vertices = new Vector();
      this.m_normals = new Vector();
   }
   b2PolygonShape.prototype.Reserve = function (count) {
      if (count === undefined) count = 0;
      for (var i = parseInt(this.m_vertices.length); i < count; i++) {
         this.m_vertices[i] = new b2Vec2();
         this.m_normals[i] = new b2Vec2();
      }
   }
   b2PolygonShape.ComputeCentroid = function (vs, count) {
      if (count === undefined) count = 0;
      var c = new b2Vec2();
      var area = 0.0;
      var p1X = 0.0;
      var p1Y = 0.0;
      var inv3 = 1.0 / 3.0;
      for (var i = 0; i < count; ++i) {
         var p2 = vs[i];
         var p3 = i + 1 < count ? vs[parseInt(i + 1)] : vs[0];
         var e1X = p2.x - p1X;
         var e1Y = p2.y - p1Y;
         var e2X = p3.x - p1X;
         var e2Y = p3.y - p1Y;
         var D = (e1X * e2Y - e1Y * e2X);
         var triangleArea = 0.5 * D;area += triangleArea;
         c.x += triangleArea * inv3 * (p1X + p2.x + p3.x);
         c.y += triangleArea * inv3 * (p1Y + p2.y + p3.y);
      }
      c.x *= 1.0 / area;
      c.y *= 1.0 / area;
      return c;
   }
   b2PolygonShape.ComputeOBB = function (obb, vs, count) {
      if (count === undefined) count = 0;
      var i = 0;
      var p = new Vector(count + 1);
      for (i = 0;
      i < count; ++i) {
         p[i] = vs[i];
      }
      p[count] = p[0];
      var minArea = Number.MAX_VALUE;
      for (i = 1;
      i <= count; ++i) {
         var root = p[parseInt(i - 1)];
         var uxX = p[i].x - root.x;
         var uxY = p[i].y - root.y;
         var length = Math.sqrt(uxX * uxX + uxY * uxY);
         uxX /= length;
         uxY /= length;
         var uyX = (-uxY);
         var uyY = uxX;
         var lowerX = Number.MAX_VALUE;
         var lowerY = Number.MAX_VALUE;
         var upperX = (-Number.MAX_VALUE);
         var upperY = (-Number.MAX_VALUE);
         for (var j = 0; j < count; ++j) {
            var dX = p[j].x - root.x;
            var dY = p[j].y - root.y;
            var rX = (uxX * dX + uxY * dY);
            var rY = (uyX * dX + uyY * dY);
            if (rX < lowerX) lowerX = rX;
            if (rY < lowerY) lowerY = rY;
            if (rX > upperX) upperX = rX;
            if (rY > upperY) upperY = rY;
         }
         var area = (upperX - lowerX) * (upperY - lowerY);
         if (area < 0.95 * minArea) {
            minArea = area;
            obb.R.col1.x = uxX;
            obb.R.col1.y = uxY;
            obb.R.col2.x = uyX;
            obb.R.col2.y = uyY;
            var centerX = 0.5 * (lowerX + upperX);
            var centerY = 0.5 * (lowerY + upperY);
            var tMat = obb.R;
            obb.center.x = root.x + (tMat.col1.x * centerX + tMat.col2.x * centerY);
            obb.center.y = root.y + (tMat.col1.y * centerX + tMat.col2.y * centerY);
            obb.extents.x = 0.5 * (upperX - lowerX);
            obb.extents.y = 0.5 * (upperY - lowerY);
         }
      }
   }
   Box2D.postDefs.push(function () {
      Box2D.Collision.Shapes.b2PolygonShape.s_mat = new b2Mat22();
   });
   b2Shape.b2Shape = function () {};
   b2Shape.prototype.Copy = function () {
      return null;
   }
   b2Shape.prototype.Set = function (other) {
      this.m_radius = other.m_radius;
   }
   b2Shape.prototype.GetType = function () {
      return this.m_type;
   }
   b2Shape.prototype.TestPoint = function (xf, p) {
      return false;
   }
   b2Shape.prototype.RayCast = function (output, input, transform) {
      return false;
   }
   b2Shape.prototype.ComputeAABB = function (aabb, xf) {}
   b2Shape.prototype.ComputeMass = function (massData, density) {
      if (density === undefined) density = 0;
   }
   b2Shape.prototype.ComputeSubmergedArea = function (normal, offset, xf, c) {
      if (offset === undefined) offset = 0;
      return 0;
   }
   b2Shape.TestOverlap = function (shape1, transform1, shape2, transform2) {
      var input = new b2DistanceInput();
      input.proxyA = new b2DistanceProxy();
      input.proxyA.Set(shape1);
      input.proxyB = new b2DistanceProxy();
      input.proxyB.Set(shape2);
      input.transformA = transform1;
      input.transformB = transform2;
      input.useRadii = true;
      var simplexCache = new b2SimplexCache();
      simplexCache.count = 0;
      var output = new b2DistanceOutput();
      b2Distance.Distance(output, simplexCache, input);
      return output.distance < 10.0 * Number.MIN_VALUE;
   }
   b2Shape.prototype.b2Shape = function () {
      this.m_type = b2Shape.e_unknownShape;
      this.m_radius = b2Settings.b2_linearSlop;
   }
   Box2D.postDefs.push(function () {
      Box2D.Collision.Shapes.b2Shape.e_unknownShape = parseInt((-1));
      Box2D.Collision.Shapes.b2Shape.e_circleShape = 0;
      Box2D.Collision.Shapes.b2Shape.e_polygonShape = 1;
      Box2D.Collision.Shapes.b2Shape.e_edgeShape = 2;
      Box2D.Collision.Shapes.b2Shape.e_shapeTypeCount = 3;
      Box2D.Collision.Shapes.b2Shape.e_hitCollide = 1;
      Box2D.Collision.Shapes.b2Shape.e_missCollide = 0;
      Box2D.Collision.Shapes.b2Shape.e_startsInsideCollide = parseInt((-1));
   });
})();
(function () {
   var b2Color = Box2D.Common.b2Color,
      b2internal = Box2D.Common.b2internal,
      b2Settings = Box2D.Common.b2Settings,
      b2Mat22 = Box2D.Common.Math.b2Mat22,
      b2Mat33 = Box2D.Common.Math.b2Mat33,
      b2Math = Box2D.Common.Math.b2Math,
      b2Sweep = Box2D.Common.Math.b2Sweep,
      b2Transform = Box2D.Common.Math.b2Transform,
      b2Vec2 = Box2D.Common.Math.b2Vec2,
      b2Vec3 = Box2D.Common.Math.b2Vec3;

   b2Color.b2Color = function () {
      this._r = 0;
      this._g = 0;
      this._b = 0;
   };
   b2Color.prototype.b2Color = function (rr, gg, bb) {
      if (rr === undefined) rr = 0;
      if (gg === undefined) gg = 0;
      if (bb === undefined) bb = 0;
      this._r = Box2D.parseUInt(255 * b2Math.Clamp(rr, 0.0, 1.0));
      this._g = Box2D.parseUInt(255 * b2Math.Clamp(gg, 0.0, 1.0));
      this._b = Box2D.parseUInt(255 * b2Math.Clamp(bb, 0.0, 1.0));
   }
   b2Color.prototype.Set = function (rr, gg, bb) {
      if (rr === undefined) rr = 0;
      if (gg === undefined) gg = 0;
      if (bb === undefined) bb = 0;
      this._r = Box2D.parseUInt(255 * b2Math.Clamp(rr, 0.0, 1.0));
      this._g = Box2D.parseUInt(255 * b2Math.Clamp(gg, 0.0, 1.0));
      this._b = Box2D.parseUInt(255 * b2Math.Clamp(bb, 0.0, 1.0));
   }
   Object.defineProperty(b2Color.prototype, 'r', {
      enumerable: false,
      configurable: true,
      set: function (rr) {
         if (rr === undefined) rr = 0;
         this._r = Box2D.parseUInt(255 * b2Math.Clamp(rr, 0.0, 1.0));
      }
   });
   Object.defineProperty(b2Color.prototype, 'g', {
      enumerable: false,
      configurable: true,
      set: function (gg) {
         if (gg === undefined) gg = 0;
         this._g = Box2D.parseUInt(255 * b2Math.Clamp(gg, 0.0, 1.0));
      }
   });
   Object.defineProperty(b2Color.prototype, 'b', {
      enumerable: false,
      configurable: true,
      set: function (bb) {
         if (bb === undefined) bb = 0;
         this._b = Box2D.parseUInt(255 * b2Math.Clamp(bb, 0.0, 1.0));
      }
   });
   Object.defineProperty(b2Color.prototype, 'color', {
      enumerable: false,
      configurable: true,
      get: function () {
         return (this._r << 16) | (this._g << 8) | (this._b);
      }
   });
   b2Settings.b2Settings = function () {};
   b2Settings.b2MixFriction = function (friction1, friction2) {
      if (friction1 === undefined) friction1 = 0;
      if (friction2 === undefined) friction2 = 0;
      return Math.sqrt(friction1 * friction2);
   }
   b2Settings.b2MixRestitution = function (restitution1, restitution2) {
      if (restitution1 === undefined) restitution1 = 0;
      if (restitution2 === undefined) restitution2 = 0;
      return restitution1 > restitution2 ? restitution1 : restitution2;
   }
   b2Settings.b2Assert = function (a) {
      if (!a) {
         throw "Assertion Failed";
      }
   }
   Box2D.postDefs.push(function () {
      Box2D.Common.b2Settings.VERSION = "2.1alpha";
      Box2D.Common.b2Settings.USHRT_MAX = 0x0000ffff;
      Box2D.Common.b2Settings.b2_pi = Math.PI;
      Box2D.Common.b2Settings.b2_maxManifoldPoints = 2;
      Box2D.Common.b2Settings.b2_aabbExtension = 0.1;
      Box2D.Common.b2Settings.b2_aabbMultiplier = 2.0;
      Box2D.Common.b2Settings.b2_polygonRadius = 2.0 * b2Settings.b2_linearSlop;
      Box2D.Common.b2Settings.b2_linearSlop = 0.005;
      Box2D.Common.b2Settings.b2_angularSlop = 2.0 / 180.0 * b2Settings.b2_pi;
      Box2D.Common.b2Settings.b2_toiSlop = 8.0 * b2Settings.b2_linearSlop;
      Box2D.Common.b2Settings.b2_maxTOIContactsPerIsland = 32;
      Box2D.Common.b2Settings.b2_maxTOIJointsPerIsland = 32;
      Box2D.Common.b2Settings.b2_velocityThreshold = 1.0;
      Box2D.Common.b2Settings.b2_maxLinearCorrection = 0.2;
      Box2D.Common.b2Settings.b2_maxAngularCorrection = 8.0 / 180.0 * b2Settings.b2_pi;
      Box2D.Common.b2Settings.b2_maxTranslation = 2.0;
      Box2D.Common.b2Settings.b2_maxTranslationSquared = b2Settings.b2_maxTranslation * b2Settings.b2_maxTranslation;
      Box2D.Common.b2Settings.b2_maxRotation = 0.5 * b2Settings.b2_pi;
      Box2D.Common.b2Settings.b2_maxRotationSquared = b2Settings.b2_maxRotation * b2Settings.b2_maxRotation;
      Box2D.Common.b2Settings.b2_contactBaumgarte = 0.2;
      Box2D.Common.b2Settings.b2_timeToSleep = 0.5;
      Box2D.Common.b2Settings.b2_linearSleepTolerance = 0.01;
      Box2D.Common.b2Settings.b2_angularSleepTolerance = 2.0 / 180.0 * b2Settings.b2_pi;
   });
})();
(function () {
   var b2AABB = Box2D.Collision.b2AABB,
      b2Color = Box2D.Common.b2Color,
      b2internal = Box2D.Common.b2internal,
      b2Settings = Box2D.Common.b2Settings,
      b2Mat22 = Box2D.Common.Math.b2Mat22,
      b2Mat33 = Box2D.Common.Math.b2Mat33,
      b2Math = Box2D.Common.Math.b2Math,
      b2Sweep = Box2D.Common.Math.b2Sweep,
      b2Transform = Box2D.Common.Math.b2Transform,
      b2Vec2 = Box2D.Common.Math.b2Vec2,
      b2Vec3 = Box2D.Common.Math.b2Vec3;

   b2Mat22.b2Mat22 = function () {
      this.col1 = new b2Vec2();
      this.col2 = new b2Vec2();
   };
   b2Mat22.prototype.b2Mat22 = function () {
      this.SetIdentity();
   }
   b2Mat22.FromAngle = function (angle) {
      if (angle === undefined) angle = 0;
      var mat = new b2Mat22();
      mat.Set(angle);
      return mat;
   }
   b2Mat22.FromVV = function (c1, c2) {
      var mat = new b2Mat22();
      mat.SetVV(c1, c2);
      return mat;
   }
   b2Mat22.prototype.Set = function (angle) {
      if (angle === undefined) angle = 0;
      var c = Math.cos(angle);
      var s = Math.sin(angle);
      this.col1.x = c;
      this.col2.x = (-s);
      this.col1.y = s;
      this.col2.y = c;
   }
   b2Mat22.prototype.SetVV = function (c1, c2) {
      this.col1.SetV(c1);
      this.col2.SetV(c2);
   }
   b2Mat22.prototype.Copy = function () {
      var mat = new b2Mat22();
      mat.SetM(this);
      return mat;
   }
   b2Mat22.prototype.SetM = function (m) {
      this.col1.SetV(m.col1);
      this.col2.SetV(m.col2);
   }
   b2Mat22.prototype.AddM = function (m) {
      this.col1.x += m.col1.x;
      this.col1.y += m.col1.y;
      this.col2.x += m.col2.x;
      this.col2.y += m.col2.y;
   }
   b2Mat22.prototype.SetIdentity = function () {
      this.col1.x = 1.0;
      this.col2.x = 0.0;
      this.col1.y = 0.0;
      this.col2.y = 1.0;
   }
   b2Mat22.prototype.SetZero = function () {
      this.col1.x = 0.0;
      this.col2.x = 0.0;
      this.col1.y = 0.0;
      this.col2.y = 0.0;
   }
   b2Mat22.prototype.GetAngle = function () {
      return Math.atan2(this.col1.y, this.col1.x);
   }
   b2Mat22.prototype.GetInverse = function (out) {
      var a = this.col1.x;
      var b = this.col2.x;
      var c = this.col1.y;
      var d = this.col2.y;
      var det = a * d - b * c;
      if (det != 0.0) {
         det = 1.0 / det;
      }
      out.col1.x = det * d;
      out.col2.x = (-det * b);
      out.col1.y = (-det * c);
      out.col2.y = det * a;
      return out;
   }
   b2Mat22.prototype.Solve = function (out, bX, bY) {
      if (bX === undefined) bX = 0;
      if (bY === undefined) bY = 0;
      var a11 = this.col1.x;
      var a12 = this.col2.x;
      var a21 = this.col1.y;
      var a22 = this.col2.y;
      var det = a11 * a22 - a12 * a21;
      if (det != 0.0) {
         det = 1.0 / det;
      }
      out.x = det * (a22 * bX - a12 * bY);
      out.y = det * (a11 * bY - a21 * bX);
      return out;
   }
   b2Mat22.prototype.Abs = function () {
      this.col1.Abs();
      this.col2.Abs();
   }
   b2Mat33.b2Mat33 = function () {
      this.col1 = new b2Vec3();
      this.col2 = new b2Vec3();
      this.col3 = new b2Vec3();
   };
   b2Mat33.prototype.b2Mat33 = function (c1, c2, c3) {
      if (c1 === undefined) c1 = null;
      if (c2 === undefined) c2 = null;
      if (c3 === undefined) c3 = null;
      if (!c1 && !c2 && !c3) {
         this.col1.SetZero();
         this.col2.SetZero();
         this.col3.SetZero();
      }
      else {
         this.col1.SetV(c1);
         this.col2.SetV(c2);
         this.col3.SetV(c3);
      }
   }
   b2Mat33.prototype.SetVVV = function (c1, c2, c3) {
      this.col1.SetV(c1);
      this.col2.SetV(c2);
      this.col3.SetV(c3);
   }
   b2Mat33.prototype.Copy = function () {
      return new b2Mat33(this.col1, this.col2, this.col3);
   }
   b2Mat33.prototype.SetM = function (m) {
      this.col1.SetV(m.col1);
      this.col2.SetV(m.col2);
      this.col3.SetV(m.col3);
   }
   b2Mat33.prototype.AddM = function (m) {
      this.col1.x += m.col1.x;
      this.col1.y += m.col1.y;
      this.col1.z += m.col1.z;
      this.col2.x += m.col2.x;
      this.col2.y += m.col2.y;
      this.col2.z += m.col2.z;
      this.col3.x += m.col3.x;
      this.col3.y += m.col3.y;
      this.col3.z += m.col3.z;
   }
   b2Mat33.prototype.SetIdentity = function () {
      this.col1.x = 1.0;
      this.col2.x = 0.0;
      this.col3.x = 0.0;
      this.col1.y = 0.0;
      this.col2.y = 1.0;
      this.col3.y = 0.0;
      this.col1.z = 0.0;
      this.col2.z = 0.0;
      this.col3.z = 1.0;
   }
   b2Mat33.prototype.SetZero = function () {
      this.col1.x = 0.0;
      this.col2.x = 0.0;
      this.col3.x = 0.0;
      this.col1.y = 0.0;
      this.col2.y = 0.0;
      this.col3.y = 0.0;
      this.col1.z = 0.0;
      this.col2.z = 0.0;
      this.col3.z = 0.0;
   }
   b2Mat33.prototype.Solve22 = function (out, bX, bY) {
      if (bX === undefined) bX = 0;
      if (bY === undefined) bY = 0;
      var a11 = this.col1.x;
      var a12 = this.col2.x;
      var a21 = this.col1.y;
      var a22 = this.col2.y;
      var det = a11 * a22 - a12 * a21;
      if (det != 0.0) {
         det = 1.0 / det;
      }
      out.x = det * (a22 * bX - a12 * bY);
      out.y = det * (a11 * bY - a21 * bX);
      return out;
   }
   b2Mat33.prototype.Solve33 = function (out, bX, bY, bZ) {
      if (bX === undefined) bX = 0;
      if (bY === undefined) bY = 0;
      if (bZ === undefined) bZ = 0;
      var a11 = this.col1.x;
      var a21 = this.col1.y;
      var a31 = this.col1.z;
      var a12 = this.col2.x;
      var a22 = this.col2.y;
      var a32 = this.col2.z;
      var a13 = this.col3.x;
      var a23 = this.col3.y;
      var a33 = this.col3.z;
      var det = a11 * (a22 * a33 - a32 * a23) + a21 * (a32 * a13 - a12 * a33) + a31 * (a12 * a23 - a22 * a13);
      if (det != 0.0) {
         det = 1.0 / det;
      }
      out.x = det * (bX * (a22 * a33 - a32 * a23) + bY * (a32 * a13 - a12 * a33) + bZ * (a12 * a23 - a22 * a13));
      out.y = det * (a11 * (bY * a33 - bZ * a23) + a21 * (bZ * a13 - bX * a33) + a31 * (bX * a23 - bY * a13));
      out.z = det * (a11 * (a22 * bZ - a32 * bY) + a21 * (a32 * bX - a12 * bZ) + a31 * (a12 * bY - a22 * bX));
      return out;
   }
   b2Math.b2Math = function () {};
   b2Math.IsValid = function (x) {
      if (x === undefined) x = 0;
      return isFinite(x);
   }
   b2Math.Dot = function (a, b) {
      return a.x * b.x + a.y * b.y;
   }
   b2Math.CrossVV = function (a, b) {
      return a.x * b.y - a.y * b.x;
   }
   b2Math.CrossVF = function (a, s) {
      if (s === undefined) s = 0;
      var v = new b2Vec2(s * a.y, (-s * a.x));
      return v;
   }
   b2Math.CrossFV = function (s, a) {
      if (s === undefined) s = 0;
      var v = new b2Vec2((-s * a.y), s * a.x);
      return v;
   }
   b2Math.MulMV = function (A, v) {
      var u = new b2Vec2(A.col1.x * v.x + A.col2.x * v.y, A.col1.y * v.x + A.col2.y * v.y);
      return u;
   }
   b2Math.MulTMV = function (A, v) {
      var u = new b2Vec2(b2Math.Dot(v, A.col1), b2Math.Dot(v, A.col2));
      return u;
   }
   b2Math.MulX = function (T, v) {
      var a = b2Math.MulMV(T.R, v);
      a.x += T.position.x;
      a.y += T.position.y;
      return a;
   }
   b2Math.MulXT = function (T, v) {
      var a = b2Math.SubtractVV(v, T.position);
      var tX = (a.x * T.R.col1.x + a.y * T.R.col1.y);
      a.y = (a.x * T.R.col2.x + a.y * T.R.col2.y);
      a.x = tX;
      return a;
   }
   b2Math.AddVV = function (a, b) {
      var v = new b2Vec2(a.x + b.x, a.y + b.y);
      return v;
   }
   b2Math.SubtractVV = function (a, b) {
      var v = new b2Vec2(a.x - b.x, a.y - b.y);
      return v;
   }
   b2Math.Distance = function (a, b) {
      var cX = a.x - b.x;
      var cY = a.y - b.y;
      return Math.sqrt(cX * cX + cY * cY);
   }
   b2Math.DistanceSquared = function (a, b) {
      var cX = a.x - b.x;
      var cY = a.y - b.y;
      return (cX * cX + cY * cY);
   }
   b2Math.MulFV = function (s, a) {
      if (s === undefined) s = 0;
      var v = new b2Vec2(s * a.x, s * a.y);
      return v;
   }
   b2Math.AddMM = function (A, B) {
      var C = b2Mat22.FromVV(b2Math.AddVV(A.col1, B.col1), b2Math.AddVV(A.col2, B.col2));
      return C;
   }
   b2Math.MulMM = function (A, B) {
      var C = b2Mat22.FromVV(b2Math.MulMV(A, B.col1), b2Math.MulMV(A, B.col2));
      return C;
   }
   b2Math.MulTMM = function (A, B) {
      var c1 = new b2Vec2(b2Math.Dot(A.col1, B.col1), b2Math.Dot(A.col2, B.col1));
      var c2 = new b2Vec2(b2Math.Dot(A.col1, B.col2), b2Math.Dot(A.col2, B.col2));
      var C = b2Mat22.FromVV(c1, c2);
      return C;
   }
   b2Math.Abs = function (a) {
      if (a === undefined) a = 0;
      return a > 0.0 ? a : (-a);
   }
   b2Math.AbsV = function (a) {
      var b = new b2Vec2(b2Math.Abs(a.x), b2Math.Abs(a.y));
      return b;
   }
   b2Math.AbsM = function (A) {
      var B = b2Mat22.FromVV(b2Math.AbsV(A.col1), b2Math.AbsV(A.col2));
      return B;
   }
   b2Math.Min = function (a, b) {
      if (a === undefined) a = 0;
      if (b === undefined) b = 0;
      return a < b ? a : b;
   }
   b2Math.MinV = function (a, b) {
      var c = new b2Vec2(b2Math.Min(a.x, b.x), b2Math.Min(a.y, b.y));
      return c;
   }
   b2Math.Max = function (a, b) {
      if (a === undefined) a = 0;
      if (b === undefined) b = 0;
      return a > b ? a : b;
   }
   b2Math.MaxV = function (a, b) {
      var c = new b2Vec2(b2Math.Max(a.x, b.x), b2Math.Max(a.y, b.y));
      return c;
   }
   b2Math.Clamp = function (a, low, high) {
      if (a === undefined) a = 0;
      if (low === undefined) low = 0;
      if (high === undefined) high = 0;
      return a < low ? low : a > high ? high : a;
   }
   b2Math.ClampV = function (a, low, high) {
      return b2Math.MaxV(low, b2Math.MinV(a, high));
   }
   b2Math.Swap = function (a, b) {
      var tmp = a[0];
      a[0] = b[0];
      b[0] = tmp;
   }
   b2Math.Random = function () {
      return Math.random() * 2 - 1;
   }
   b2Math.RandomRange = function (lo, hi) {
      if (lo === undefined) lo = 0;
      if (hi === undefined) hi = 0;
      var r = Math.random();
      r = (hi - lo) * r + lo;
      return r;
   }
   b2Math.NextPowerOfTwo = function (x) {
      if (x === undefined) x = 0;
      x |= (x >> 1) & 0x7FFFFFFF;
      x |= (x >> 2) & 0x3FFFFFFF;
      x |= (x >> 4) & 0x0FFFFFFF;
      x |= (x >> 8) & 0x00FFFFFF;
      x |= (x >> 16) & 0x0000FFFF;
      return x + 1;
   }
   b2Math.IsPowerOfTwo = function (x) {
      if (x === undefined) x = 0;
      var result = x > 0 && (x & (x - 1)) == 0;
      return result;
   }
   Box2D.postDefs.push(function () {
      Box2D.Common.Math.b2Math.b2Vec2_zero = new b2Vec2(0.0, 0.0);
      Box2D.Common.Math.b2Math.b2Mat22_identity = b2Mat22.FromVV(new b2Vec2(1.0, 0.0), new b2Vec2(0.0, 1.0));
      Box2D.Common.Math.b2Math.b2Transform_identity = new b2Transform(b2Math.b2Vec2_zero, b2Math.b2Mat22_identity);
   });
   b2Sweep.b2Sweep = function () {
      this.localCenter = new b2Vec2();
      this.c0 = new b2Vec2;
      this.c = new b2Vec2();
   };
   b2Sweep.prototype.Set = function (other) {
      this.localCenter.SetV(other.localCenter);
      this.c0.SetV(other.c0);
      this.c.SetV(other.c);
      this.a0 = other.a0;
      this.a = other.a;
      this.t0 = other.t0;
   }
   b2Sweep.prototype.Copy = function () {
      var copy = new b2Sweep();
      copy.localCenter.SetV(this.localCenter);
      copy.c0.SetV(this.c0);
      copy.c.SetV(this.c);
      copy.a0 = this.a0;
      copy.a = this.a;
      copy.t0 = this.t0;
      return copy;
   }
   b2Sweep.prototype.GetTransform = function (xf, alpha) {
      if (alpha === undefined) alpha = 0;
      xf.position.x = (1.0 - alpha) * this.c0.x + alpha * this.c.x;
      xf.position.y = (1.0 - alpha) * this.c0.y + alpha * this.c.y;
      var angle = (1.0 - alpha) * this.a0 + alpha * this.a;
      xf.R.Set(angle);
      var tMat = xf.R;
      xf.position.x -= (tMat.col1.x * this.localCenter.x + tMat.col2.x * this.localCenter.y);
      xf.position.y -= (tMat.col1.y * this.localCenter.x + tMat.col2.y * this.localCenter.y);
   }
   b2Sweep.prototype.Advance = function (t) {
      if (t === undefined) t = 0;
      if (this.t0 < t && 1.0 - this.t0 > Number.MIN_VALUE) {
         var alpha = (t - this.t0) / (1.0 - this.t0);
         this.c0.x = (1.0 - alpha) * this.c0.x + alpha * this.c.x;
         this.c0.y = (1.0 - alpha) * this.c0.y + alpha * this.c.y;
         this.a0 = (1.0 - alpha) * this.a0 + alpha * this.a;
         this.t0 = t;
      }
   }
   b2Transform.b2Transform = function () {
      this.position = new b2Vec2;
      this.R = new b2Mat22();
   };
   b2Transform.prototype.b2Transform = function (pos, r) {
      if (pos === undefined) pos = null;
      if (r === undefined) r = null;
      if (pos) {
         this.position.SetV(pos);
         this.R.SetM(r);
      }
   }
   b2Transform.prototype.Initialize = function (pos, r) {
      this.position.SetV(pos);
      this.R.SetM(r);
   }
   b2Transform.prototype.SetIdentity = function () {
      this.position.SetZero();
      this.R.SetIdentity();
   }
   b2Transform.prototype.Set = function (x) {
      this.position.SetV(x.position);
      this.R.SetM(x.R);
   }
   b2Transform.prototype.GetAngle = function () {
      return Math.atan2(this.R.col1.y, this.R.col1.x);
   }
   b2Vec2.b2Vec2 = function () {};
   b2Vec2.prototype.b2Vec2 = function (x_, y_) {
      if (x_ === undefined) x_ = 0;
      if (y_ === undefined) y_ = 0;
      this.x = x_;
      this.y = y_;
   }
   b2Vec2.prototype.SetZero = function () {
      this.x = 0.0;
      this.y = 0.0;
   }
   b2Vec2.prototype.Set = function (x_, y_) {
      if (x_ === undefined) x_ = 0;
      if (y_ === undefined) y_ = 0;
      this.x = x_;
      this.y = y_;
   }
   b2Vec2.prototype.SetV = function (v) {
      this.x = v.x;
      this.y = v.y;
   }
   b2Vec2.prototype.GetNegative = function () {
      return new b2Vec2((-this.x), (-this.y));
   }
   b2Vec2.prototype.NegativeSelf = function () {
      this.x = (-this.x);
      this.y = (-this.y);
   }
   b2Vec2.Make = function (x_, y_) {
      if (x_ === undefined) x_ = 0;
      if (y_ === undefined) y_ = 0;
      return new b2Vec2(x_, y_);
   }
   b2Vec2.prototype.Copy = function () {
      return new b2Vec2(this.x, this.y);
   }
   b2Vec2.prototype.Add = function (v) {
      this.x += v.x;
      this.y += v.y;
   }
   b2Vec2.prototype.Subtract = function (v) {
      this.x -= v.x;
      this.y -= v.y;
   }
   b2Vec2.prototype.Multiply = function (a) {
      if (a === undefined) a = 0;
      this.x *= a;
      this.y *= a;
   }
   b2Vec2.prototype.MulM = function (A) {
      var tX = this.x;
      this.x = A.col1.x * tX + A.col2.x * this.y;
      this.y = A.col1.y * tX + A.col2.y * this.y;
   }
   b2Vec2.prototype.MulTM = function (A) {
      var tX = b2Math.Dot(this, A.col1);
      this.y = b2Math.Dot(this, A.col2);
      this.x = tX;
   }
   b2Vec2.prototype.CrossVF = function (s) {
      if (s === undefined) s = 0;
      var tX = this.x;
      this.x = s * this.y;
      this.y = (-s * tX);
   }
   b2Vec2.prototype.CrossFV = function (s) {
      if (s === undefined) s = 0;
      var tX = this.x;
      this.x = (-s * this.y);
      this.y = s * tX;
   }
   b2Vec2.prototype.MinV = function (b) {
      this.x = this.x < b.x ? this.x : b.x;
      this.y = this.y < b.y ? this.y : b.y;
   }
   b2Vec2.prototype.MaxV = function (b) {
      this.x = this.x > b.x ? this.x : b.x;
      this.y = this.y > b.y ? this.y : b.y;
   }
   b2Vec2.prototype.Abs = function () {
      if (this.x < 0) this.x = (-this.x);
      if (this.y < 0) this.y = (-this.y);
   }
   b2Vec2.prototype.Length = function () {
      return Math.sqrt(this.x * this.x + this.y * this.y);
   }
   b2Vec2.prototype.LengthSquared = function () {
      return (this.x * this.x + this.y * this.y);
   }
   b2Vec2.prototype.Normalize = function () {
      var length = Math.sqrt(this.x * this.x + this.y * this.y);
      if (length < Number.MIN_VALUE) {
         return 0.0;
      }
      var invLength = 1.0 / length;
      this.x *= invLength;
      this.y *= invLength;
      return length;
   }
   b2Vec2.prototype.IsValid = function () {
      return b2Math.IsValid(this.x) && b2Math.IsValid(this.y);
   }
   b2Vec3.b2Vec3 = function () {};
   b2Vec3.prototype.b2Vec3 = function (x, y, z) {
      if (x === undefined) x = 0;
      if (y === undefined) y = 0;
      if (z === undefined) z = 0;
      this.x = x;
      this.y = y;
      this.z = z;
   }
   b2Vec3.prototype.SetZero = function () {
      this.x = this.y = this.z = 0.0;
   }
   b2Vec3.prototype.Set = function (x, y, z) {
      if (x === undefined) x = 0;
      if (y === undefined) y = 0;
      if (z === undefined) z = 0;
      this.x = x;
      this.y = y;
      this.z = z;
   }
   b2Vec3.prototype.SetV = function (v) {
      this.x = v.x;
      this.y = v.y;
      this.z = v.z;
   }
   b2Vec3.prototype.GetNegative = function () {
      return new b2Vec3((-this.x), (-this.y), (-this.z));
   }
   b2Vec3.prototype.NegativeSelf = function () {
      this.x = (-this.x);
      this.y = (-this.y);
      this.z = (-this.z);
   }
   b2Vec3.prototype.Copy = function () {
      return new b2Vec3(this.x, this.y, this.z);
   }
   b2Vec3.prototype.Add = function (v) {
      this.x += v.x;
      this.y += v.y;
      this.z += v.z;
   }
   b2Vec3.prototype.Subtract = function (v) {
      this.x -= v.x;
      this.y -= v.y;
      this.z -= v.z;
   }
   b2Vec3.prototype.Multiply = function (a) {
      if (a === undefined) a = 0;
      this.x *= a;
      this.y *= a;
      this.z *= a;
   }
})();
(function () {
   var b2ControllerEdge = Box2D.Dynamics.Controllers.b2ControllerEdge,
      b2Mat22 = Box2D.Common.Math.b2Mat22,
      b2Mat33 = Box2D.Common.Math.b2Mat33,
      b2Math = Box2D.Common.Math.b2Math,
      b2Sweep = Box2D.Common.Math.b2Sweep,
      b2Transform = Box2D.Common.Math.b2Transform,
      b2Vec2 = Box2D.Common.Math.b2Vec2,
      b2Vec3 = Box2D.Common.Math.b2Vec3,
      b2Color = Box2D.Common.b2Color,
      b2internal = Box2D.Common.b2internal,
      b2Settings = Box2D.Common.b2Settings,
      b2AABB = Box2D.Collision.b2AABB,
      b2Bound = Box2D.Collision.b2Bound,
      b2BoundValues = Box2D.Collision.b2BoundValues,
      b2Collision = Box2D.Collision.b2Collision,
      b2ContactID = Box2D.Collision.b2ContactID,
      b2ContactPoint = Box2D.Collision.b2ContactPoint,
      b2Distance = Box2D.Collision.b2Distance,
      b2DistanceInput = Box2D.Collision.b2DistanceInput,
      b2DistanceOutput = Box2D.Collision.b2DistanceOutput,
      b2DistanceProxy = Box2D.Collision.b2DistanceProxy,
      b2DynamicTree = Box2D.Collision.b2DynamicTree,
      b2DynamicTreeBroadPhase = Box2D.Collision.b2DynamicTreeBroadPhase,
      b2DynamicTreeNode = Box2D.Collision.b2DynamicTreeNode,
      b2DynamicTreePair = Box2D.Collision.b2DynamicTreePair,
      b2Manifold = Box2D.Collision.b2Manifold,
      b2ManifoldPoint = Box2D.Collision.b2ManifoldPoint,
      b2Point = Box2D.Collision.b2Point,
      b2RayCastInput = Box2D.Collision.b2RayCastInput,
      b2RayCastOutput = Box2D.Collision.b2RayCastOutput,
      b2Segment = Box2D.Collision.b2Segment,
      b2SeparationFunction = Box2D.Collision.b2SeparationFunction,
      b2Simplex = Box2D.Collision.b2Simplex,
      b2SimplexCache = Box2D.Collision.b2SimplexCache,
      b2SimplexVertex = Box2D.Collision.b2SimplexVertex,
      b2TimeOfImpact = Box2D.Collision.b2TimeOfImpact,
      b2TOIInput = Box2D.Collision.b2TOIInput,
      b2WorldManifold = Box2D.Collision.b2WorldManifold,
      ClipVertex = Box2D.Collision.ClipVertex,
      Features = Box2D.Collision.Features,
      IBroadPhase = Box2D.Collision.IBroadPhase,
      b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
      b2EdgeChainDef = Box2D.Collision.Shapes.b2EdgeChainDef,
      b2EdgeShape = Box2D.Collision.Shapes.b2EdgeShape,
      b2MassData = Box2D.Collision.Shapes.b2MassData,
      b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
      b2Shape = Box2D.Collision.Shapes.b2Shape,
      b2Body = Box2D.Dynamics.b2Body,
      b2BodyDef = Box2D.Dynamics.b2BodyDef,
      b2ContactFilter = Box2D.Dynamics.b2ContactFilter,
      b2ContactImpulse = Box2D.Dynamics.b2ContactImpulse,
      b2ContactListener = Box2D.Dynamics.b2ContactListener,
      b2ContactManager = Box2D.Dynamics.b2ContactManager,
      b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
      b2DestructionListener = Box2D.Dynamics.b2DestructionListener,
      b2FilterData = Box2D.Dynamics.b2FilterData,
      b2Fixture = Box2D.Dynamics.b2Fixture,
      b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
      b2Island = Box2D.Dynamics.b2Island,
      b2TimeStep = Box2D.Dynamics.b2TimeStep,
      b2World = Box2D.Dynamics.b2World,
      b2CircleContact = Box2D.Dynamics.Contacts.b2CircleContact,
      b2Contact = Box2D.Dynamics.Contacts.b2Contact,
      b2ContactConstraint = Box2D.Dynamics.Contacts.b2ContactConstraint,
      b2ContactConstraintPoint = Box2D.Dynamics.Contacts.b2ContactConstraintPoint,
      b2ContactEdge = Box2D.Dynamics.Contacts.b2ContactEdge,
      b2ContactFactory = Box2D.Dynamics.Contacts.b2ContactFactory,
      b2ContactRegister = Box2D.Dynamics.Contacts.b2ContactRegister,
      b2ContactResult = Box2D.Dynamics.Contacts.b2ContactResult,
      b2ContactSolver = Box2D.Dynamics.Contacts.b2ContactSolver,
      b2EdgeAndCircleContact = Box2D.Dynamics.Contacts.b2EdgeAndCircleContact,
      b2NullContact = Box2D.Dynamics.Contacts.b2NullContact,
      b2PolyAndCircleContact = Box2D.Dynamics.Contacts.b2PolyAndCircleContact,
      b2PolyAndEdgeContact = Box2D.Dynamics.Contacts.b2PolyAndEdgeContact,
      b2PolygonContact = Box2D.Dynamics.Contacts.b2PolygonContact,
      b2PositionSolverManifold = Box2D.Dynamics.Contacts.b2PositionSolverManifold,
      b2Controller = Box2D.Dynamics.Controllers.b2Controller,
      b2DistanceJoint = Box2D.Dynamics.Joints.b2DistanceJoint,
      b2DistanceJointDef = Box2D.Dynamics.Joints.b2DistanceJointDef,
      b2FrictionJoint = Box2D.Dynamics.Joints.b2FrictionJoint,
      b2FrictionJointDef = Box2D.Dynamics.Joints.b2FrictionJointDef,
      b2GearJoint = Box2D.Dynamics.Joints.b2GearJoint,
      b2GearJointDef = Box2D.Dynamics.Joints.b2GearJointDef,
      b2Jacobian = Box2D.Dynamics.Joints.b2Jacobian,
      b2Joint = Box2D.Dynamics.Joints.b2Joint,
      b2JointDef = Box2D.Dynamics.Joints.b2JointDef,
      b2JointEdge = Box2D.Dynamics.Joints.b2JointEdge,
      b2LineJoint = Box2D.Dynamics.Joints.b2LineJoint,
      b2LineJointDef = Box2D.Dynamics.Joints.b2LineJointDef,
      b2MouseJoint = Box2D.Dynamics.Joints.b2MouseJoint,
      b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef,
      b2PrismaticJoint = Box2D.Dynamics.Joints.b2PrismaticJoint,
      b2PrismaticJointDef = Box2D.Dynamics.Joints.b2PrismaticJointDef,
      b2PulleyJoint = Box2D.Dynamics.Joints.b2PulleyJoint,
      b2PulleyJointDef = Box2D.Dynamics.Joints.b2PulleyJointDef,
      b2RevoluteJoint = Box2D.Dynamics.Joints.b2RevoluteJoint,
      b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef,
      b2WeldJoint = Box2D.Dynamics.Joints.b2WeldJoint,
      b2WeldJointDef = Box2D.Dynamics.Joints.b2WeldJointDef;

   b2Body.b2Body = function () {
      this.m_xf = new b2Transform();
      this.m_sweep = new b2Sweep();
      this.m_linearVelocity = new b2Vec2();
      this.m_force = new b2Vec2();
   };
   b2Body.prototype.connectEdges = function (s1, s2, angle1) {
      if (angle1 === undefined) angle1 = 0;
      var angle2 = Math.atan2(s2.GetDirectionVector().y, s2.GetDirectionVector().x);
      var coreOffset = Math.tan((angle2 - angle1) * 0.5);
      var core = b2Math.MulFV(coreOffset, s2.GetDirectionVector());
      core = b2Math.SubtractVV(core, s2.GetNormalVector());
      core = b2Math.MulFV(b2Settings.b2_toiSlop, core);
      core = b2Math.AddVV(core, s2.GetVertex1());
      var cornerDir = b2Math.AddVV(s1.GetDirectionVector(), s2.GetDirectionVector());
      cornerDir.Normalize();
      var convex = b2Math.Dot(s1.GetDirectionVector(), s2.GetNormalVector()) > 0.0;
      s1.SetNextEdge(s2, core, cornerDir, convex);
      s2.SetPrevEdge(s1, core, cornerDir, convex);
      return angle2;
   }
   b2Body.prototype.CreateFixture = function (def) {
      if (this.m_world.IsLocked() == true) {
         return null;
      }
      var fixture = new b2Fixture();
      fixture.Create(this, this.m_xf, def);
      if (this.m_flags & b2Body.e_activeFlag) {
         var broadPhase = this.m_world.m_contactManager.m_broadPhase;
         fixture.CreateProxy(broadPhase, this.m_xf);
      }
      fixture.m_next = this.m_fixtureList;
      this.m_fixtureList = fixture;
      ++this.m_fixtureCount;
      fixture.m_body = this;
      if (fixture.m_density > 0.0) {
         this.ResetMassData();
      }
      this.m_world.m_flags |= b2World.e_newFixture;
      return fixture;
   }
   b2Body.prototype.CreateFixture2 = function (shape, density) {
      if (density === undefined) density = 0.0;
      var def = new b2FixtureDef();
      def.shape = shape;
      def.density = density;
      return this.CreateFixture(def);
   }
   b2Body.prototype.DestroyFixture = function (fixture) {
      if (this.m_world.IsLocked() == true) {
         return;
      }
      var node = this.m_fixtureList;
      var ppF = null;
      var found = false;
      while (node != null) {
         if (node == fixture) {
            if (ppF) ppF.m_next = fixture.m_next;
            else this.m_fixtureList = fixture.m_next;
            found = true;
            break;
         }
         ppF = node;
         node = node.m_next;
      }
      var edge = this.m_contactList;
      while (edge) {
         var c = edge.contact;
         edge = edge.next;
         var fixtureA = c.GetFixtureA();
         var fixtureB = c.GetFixtureB();
         if (fixture == fixtureA || fixture == fixtureB) {
            this.m_world.m_contactManager.Destroy(c);
         }
      }
      if (this.m_flags & b2Body.e_activeFlag) {
         var broadPhase = this.m_world.m_contactManager.m_broadPhase;
         fixture.DestroyProxy(broadPhase);
      }
      else {}
      fixture.Destroy();
      fixture.m_body = null;
      fixture.m_next = null;
      --this.m_fixtureCount;
      this.ResetMassData();
   }
   b2Body.prototype.SetPositionAndAngle = function (position, angle) {
      if (angle === undefined) angle = 0;
      var f;
      if (this.m_world.IsLocked() == true) {
         return;
      }
      this.m_xf.R.Set(angle);
      this.m_xf.position.SetV(position);
      var tMat = this.m_xf.R;
      var tVec = this.m_sweep.localCenter;
      this.m_sweep.c.x = (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
      this.m_sweep.c.y = (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      this.m_sweep.c.x += this.m_xf.position.x;
      this.m_sweep.c.y += this.m_xf.position.y;
      this.m_sweep.c0.SetV(this.m_sweep.c);
      this.m_sweep.a0 = this.m_sweep.a = angle;
      var broadPhase = this.m_world.m_contactManager.m_broadPhase;
      for (f = this.m_fixtureList;
      f; f = f.m_next) {
         f.Synchronize(broadPhase, this.m_xf, this.m_xf);
      }
      this.m_world.m_contactManager.FindNewContacts();
   }
   b2Body.prototype.SetTransform = function (xf) {
      this.SetPositionAndAngle(xf.position, xf.GetAngle());
   }
   b2Body.prototype.GetTransform = function () {
      return this.m_xf;
   }
   b2Body.prototype.GetPosition = function () {
      return this.m_xf.position;
   }
   b2Body.prototype.SetPosition = function (position) {
      this.SetPositionAndAngle(position, this.GetAngle());
   }
   b2Body.prototype.GetAngle = function () {
      return this.m_sweep.a;
   }
   b2Body.prototype.SetAngle = function (angle) {
      if (angle === undefined) angle = 0;
      this.SetPositionAndAngle(this.GetPosition(), angle);
   }
   b2Body.prototype.GetWorldCenter = function () {
      return this.m_sweep.c;
   }
   b2Body.prototype.GetLocalCenter = function () {
      return this.m_sweep.localCenter;
   }
   b2Body.prototype.SetLinearVelocity = function (v) {
      if (this.m_type == b2Body.b2_staticBody) {
         return;
      }
      this.m_linearVelocity.SetV(v);
   }
   b2Body.prototype.GetLinearVelocity = function () {
      return this.m_linearVelocity;
   }
   b2Body.prototype.SetAngularVelocity = function (omega) {
      if (omega === undefined) omega = 0;
      if (this.m_type == b2Body.b2_staticBody) {
         return;
      }
      this.m_angularVelocity = omega;
   }
   b2Body.prototype.GetAngularVelocity = function () {
      return this.m_angularVelocity;
   }
   b2Body.prototype.GetDefinition = function () {
      var bd = new b2BodyDef();
      bd.type = this.GetType();
      bd.allowSleep = (this.m_flags & b2Body.e_allowSleepFlag) == b2Body.e_allowSleepFlag;
      bd.angle = this.GetAngle();
      bd.angularDamping = this.m_angularDamping;
      bd.angularVelocity = this.m_angularVelocity;
      bd.fixedRotation = (this.m_flags & b2Body.e_fixedRotationFlag) == b2Body.e_fixedRotationFlag;
      bd.bullet = (this.m_flags & b2Body.e_bulletFlag) == b2Body.e_bulletFlag;
      bd.awake = (this.m_flags & b2Body.e_awakeFlag) == b2Body.e_awakeFlag;
      bd.linearDamping = this.m_linearDamping;
      bd.linearVelocity.SetV(this.GetLinearVelocity());
      bd.position = this.GetPosition();
      bd.userData = this.GetUserData();
      return bd;
   }
   b2Body.prototype.ApplyForce = function (force, point) {
      if (this.m_type != b2Body.b2_dynamicBody) {
         return;
      }
      if (this.IsAwake() == false) {
         this.SetAwake(true);
      }
      this.m_force.x += force.x;
      this.m_force.y += force.y;
      this.m_torque += ((point.x - this.m_sweep.c.x) * force.y - (point.y - this.m_sweep.c.y) * force.x);
   }
   b2Body.prototype.ApplyTorque = function (torque) {
      if (torque === undefined) torque = 0;
      if (this.m_type != b2Body.b2_dynamicBody) {
         return;
      }
      if (this.IsAwake() == false) {
         this.SetAwake(true);
      }
      this.m_torque += torque;
   }
   b2Body.prototype.ApplyImpulse = function (impulse, point) {
      if (this.m_type != b2Body.b2_dynamicBody) {
         return;
      }
      if (this.IsAwake() == false) {
         this.SetAwake(true);
      }
      this.m_linearVelocity.x += this.m_invMass * impulse.x;
      this.m_linearVelocity.y += this.m_invMass * impulse.y;
      this.m_angularVelocity += this.m_invI * ((point.x - this.m_sweep.c.x) * impulse.y - (point.y - this.m_sweep.c.y) * impulse.x);
   }
   b2Body.prototype.Split = function (callback) {
      var linearVelocity = this.GetLinearVelocity().Copy();
      var angularVelocity = this.GetAngularVelocity();
      var center = this.GetWorldCenter();
      var body1 = this;
      var body2 = this.m_world.CreateBody(this.GetDefinition());
      var prev;
      for (var f = body1.m_fixtureList; f;) {
         if (callback(f)) {
            var next = f.m_next;
            if (prev) {
               prev.m_next = next;
            }
            else {
               body1.m_fixtureList = next;
            }
            body1.m_fixtureCount--;
            f.m_next = body2.m_fixtureList;
            body2.m_fixtureList = f;
            body2.m_fixtureCount++;
            f.m_body = body2;
            f = next;
         }
         else {
            prev = f;
            f = f.m_next;
         }
      }
      body1.ResetMassData();
      body2.ResetMassData();
      var center1 = body1.GetWorldCenter();
      var center2 = body2.GetWorldCenter();
      var velocity1 = b2Math.AddVV(linearVelocity, b2Math.CrossFV(angularVelocity, b2Math.SubtractVV(center1, center)));
      var velocity2 = b2Math.AddVV(linearVelocity, b2Math.CrossFV(angularVelocity, b2Math.SubtractVV(center2, center)));
      body1.SetLinearVelocity(velocity1);
      body2.SetLinearVelocity(velocity2);
      body1.SetAngularVelocity(angularVelocity);
      body2.SetAngularVelocity(angularVelocity);
      body1.SynchronizeFixtures();
      body2.SynchronizeFixtures();
      return body2;
   }
   b2Body.prototype.Merge = function (other) {
      var f;
      for (f = other.m_fixtureList;
      f;) {
         var next = f.m_next;
         other.m_fixtureCount--;
         f.m_next = this.m_fixtureList;
         this.m_fixtureList = f;
         this.m_fixtureCount++;
         f.m_body = body2;
         f = next;
      }
      body1.m_fixtureCount = 0;
      var body1 = this;
      var body2 = other;
      var center1 = body1.GetWorldCenter();
      var center2 = body2.GetWorldCenter();
      var velocity1 = body1.GetLinearVelocity().Copy();
      var velocity2 = body2.GetLinearVelocity().Copy();
      var angular1 = body1.GetAngularVelocity();
      var angular = body2.GetAngularVelocity();
      body1.ResetMassData();
      this.SynchronizeFixtures();
   }
   b2Body.prototype.GetMass = function () {
      return this.m_mass;
   }
   b2Body.prototype.GetInertia = function () {
      return this.m_I;
   }
   b2Body.prototype.GetMassData = function (data) {
      data.mass = this.m_mass;
      data.I = this.m_I;
      data.center.SetV(this.m_sweep.localCenter);
   }
   b2Body.prototype.SetMassData = function (massData) {
      b2Settings.b2Assert(this.m_world.IsLocked() == false);
      if (this.m_world.IsLocked() == true) {
         return;
      }
      if (this.m_type != b2Body.b2_dynamicBody) {
         return;
      }
      this.m_invMass = 0.0;
      this.m_I = 0.0;
      this.m_invI = 0.0;
      this.m_mass = massData.mass;
      if (this.m_mass <= 0.0) {
         this.m_mass = 1.0;
      }
      this.m_invMass = 1.0 / this.m_mass;
      if (massData.I > 0.0 && (this.m_flags & b2Body.e_fixedRotationFlag) == 0) {
         this.m_I = massData.I - this.m_mass * (massData.center.x * massData.center.x + massData.center.y * massData.center.y);
         this.m_invI = 1.0 / this.m_I;
      }
      var oldCenter = this.m_sweep.c.Copy();
      this.m_sweep.localCenter.SetV(massData.center);
      this.m_sweep.c0.SetV(b2Math.MulX(this.m_xf, this.m_sweep.localCenter));
      this.m_sweep.c.SetV(this.m_sweep.c0);
      this.m_linearVelocity.x += this.m_angularVelocity * (-(this.m_sweep.c.y - oldCenter.y));
      this.m_linearVelocity.y += this.m_angularVelocity * (+(this.m_sweep.c.x - oldCenter.x));
   }
   b2Body.prototype.ResetMassData = function () {
      this.m_mass = 0.0;
      this.m_invMass = 0.0;
      this.m_I = 0.0;
      this.m_invI = 0.0;
      this.m_sweep.localCenter.SetZero();
      if (this.m_type == b2Body.b2_staticBody || this.m_type == b2Body.b2_kinematicBody) {
         return;
      }
      var center = b2Vec2.Make(0, 0);
      for (var f = this.m_fixtureList; f; f = f.m_next) {
         if (f.m_density == 0.0) {
            continue;
         }
         var massData = f.GetMassData();
         this.m_mass += massData.mass;
         center.x += massData.center.x * massData.mass;
         center.y += massData.center.y * massData.mass;
         this.m_I += massData.I;
      }
      if (this.m_mass > 0.0) {
         this.m_invMass = 1.0 / this.m_mass;
         center.x *= this.m_invMass;
         center.y *= this.m_invMass;
      }
      else {
         this.m_mass = 1.0;
         this.m_invMass = 1.0;
      }
      if (this.m_I > 0.0 && (this.m_flags & b2Body.e_fixedRotationFlag) == 0) {
         this.m_I -= this.m_mass * (center.x * center.x + center.y * center.y);
         this.m_I *= this.m_inertiaScale;
         b2Settings.b2Assert(this.m_I > 0);
         this.m_invI = 1.0 / this.m_I;
      }
      else {
         this.m_I = 0.0;
         this.m_invI = 0.0;
      }
      var oldCenter = this.m_sweep.c.Copy();
      this.m_sweep.localCenter.SetV(center);
      this.m_sweep.c0.SetV(b2Math.MulX(this.m_xf, this.m_sweep.localCenter));
      this.m_sweep.c.SetV(this.m_sweep.c0);
      this.m_linearVelocity.x += this.m_angularVelocity * (-(this.m_sweep.c.y - oldCenter.y));
      this.m_linearVelocity.y += this.m_angularVelocity * (+(this.m_sweep.c.x - oldCenter.x));
   }
   b2Body.prototype.GetWorldPoint = function (localPoint) {
      var A = this.m_xf.R;
      var u = new b2Vec2(A.col1.x * localPoint.x + A.col2.x * localPoint.y, A.col1.y * localPoint.x + A.col2.y * localPoint.y);
      u.x += this.m_xf.position.x;
      u.y += this.m_xf.position.y;
      return u;
   }
   b2Body.prototype.GetWorldVector = function (localVector) {
      return b2Math.MulMV(this.m_xf.R, localVector);
   }
   b2Body.prototype.GetLocalPoint = function (worldPoint) {
      return b2Math.MulXT(this.m_xf, worldPoint);
   }
   b2Body.prototype.GetLocalVector = function (worldVector) {
      return b2Math.MulTMV(this.m_xf.R, worldVector);
   }
   b2Body.prototype.GetLinearVelocityFromWorldPoint = function (worldPoint) {
      return new b2Vec2(this.m_linearVelocity.x - this.m_angularVelocity * (worldPoint.y - this.m_sweep.c.y), this.m_linearVelocity.y + this.m_angularVelocity * (worldPoint.x - this.m_sweep.c.x));
   }
   b2Body.prototype.GetLinearVelocityFromLocalPoint = function (localPoint) {
      var A = this.m_xf.R;
      var worldPoint = new b2Vec2(A.col1.x * localPoint.x + A.col2.x * localPoint.y, A.col1.y * localPoint.x + A.col2.y * localPoint.y);
      worldPoint.x += this.m_xf.position.x;
      worldPoint.y += this.m_xf.position.y;
      return new b2Vec2(this.m_linearVelocity.x - this.m_angularVelocity * (worldPoint.y - this.m_sweep.c.y), this.m_linearVelocity.y + this.m_angularVelocity * (worldPoint.x - this.m_sweep.c.x));
   }
   b2Body.prototype.GetLinearDamping = function () {
      return this.m_linearDamping;
   }
   b2Body.prototype.SetLinearDamping = function (linearDamping) {
      if (linearDamping === undefined) linearDamping = 0;
      this.m_linearDamping = linearDamping;
   }
   b2Body.prototype.GetAngularDamping = function () {
      return this.m_angularDamping;
   }
   b2Body.prototype.SetAngularDamping = function (angularDamping) {
      if (angularDamping === undefined) angularDamping = 0;
      this.m_angularDamping = angularDamping;
   }
   b2Body.prototype.SetType = function (type) {
      if (type === undefined) type = 0;
      if (this.m_type == type) {
         return;
      }
      this.m_type = type;
      this.ResetMassData();
      if (this.m_type == b2Body.b2_staticBody) {
         this.m_linearVelocity.SetZero();
         this.m_angularVelocity = 0.0;
      }
      this.SetAwake(true);
      this.m_force.SetZero();
      this.m_torque = 0.0;
      for (var ce = this.m_contactList; ce; ce = ce.next) {
         ce.contact.FlagForFiltering();
      }
   }
   b2Body.prototype.GetType = function () {
      return this.m_type;
   }
   b2Body.prototype.SetBullet = function (flag) {
      if (flag) {
         this.m_flags |= b2Body.e_bulletFlag;
      }
      else {
         this.m_flags &= ~b2Body.e_bulletFlag;
      }
   }
   b2Body.prototype.IsBullet = function () {
      return (this.m_flags & b2Body.e_bulletFlag) == b2Body.e_bulletFlag;
   }
   b2Body.prototype.SetSleepingAllowed = function (flag) {
      if (flag) {
         this.m_flags |= b2Body.e_allowSleepFlag;
      }
      else {
         this.m_flags &= ~b2Body.e_allowSleepFlag;
         this.SetAwake(true);
      }
   }
   b2Body.prototype.SetAwake = function (flag) {
      if (flag) {
         this.m_flags |= b2Body.e_awakeFlag;
         this.m_sleepTime = 0.0;
      }
      else {
         this.m_flags &= ~b2Body.e_awakeFlag;
         this.m_sleepTime = 0.0;
         this.m_linearVelocity.SetZero();
         this.m_angularVelocity = 0.0;
         this.m_force.SetZero();
         this.m_torque = 0.0;
      }
   }
   b2Body.prototype.IsAwake = function () {
      return (this.m_flags & b2Body.e_awakeFlag) == b2Body.e_awakeFlag;
   }
   b2Body.prototype.SetFixedRotation = function (fixed) {
      if (fixed) {
         this.m_flags |= b2Body.e_fixedRotationFlag;
      }
      else {
         this.m_flags &= ~b2Body.e_fixedRotationFlag;
      }
      this.ResetMassData();
   }
   b2Body.prototype.IsFixedRotation = function () {
      return (this.m_flags & b2Body.e_fixedRotationFlag) == b2Body.e_fixedRotationFlag;
   }
   b2Body.prototype.SetActive = function (flag) {
      if (flag == this.IsActive()) {
         return;
      }
      var broadPhase;
      var f;
      if (flag) {
         this.m_flags |= b2Body.e_activeFlag;
         broadPhase = this.m_world.m_contactManager.m_broadPhase;
         for (f = this.m_fixtureList;
         f; f = f.m_next) {
            f.CreateProxy(broadPhase, this.m_xf);
         }
      }
      else {
         this.m_flags &= ~b2Body.e_activeFlag;
         broadPhase = this.m_world.m_contactManager.m_broadPhase;
         for (f = this.m_fixtureList;
         f; f = f.m_next) {
            f.DestroyProxy(broadPhase);
         }
         var ce = this.m_contactList;
         while (ce) {
            var ce0 = ce;
            ce = ce.next;
            this.m_world.m_contactManager.Destroy(ce0.contact);
         }
         this.m_contactList = null;
      }
   }
   b2Body.prototype.IsActive = function () {
      return (this.m_flags & b2Body.e_activeFlag) == b2Body.e_activeFlag;
   }
   b2Body.prototype.IsSleepingAllowed = function () {
      return (this.m_flags & b2Body.e_allowSleepFlag) == b2Body.e_allowSleepFlag;
   }
   b2Body.prototype.GetFixtureList = function () {
      return this.m_fixtureList;
   }
   b2Body.prototype.GetJointList = function () {
      return this.m_jointList;
   }
   b2Body.prototype.GetControllerList = function () {
      return this.m_controllerList;
   }
   b2Body.prototype.GetContactList = function () {
      return this.m_contactList;
   }
   b2Body.prototype.GetNext = function () {
      return this.m_next;
   }
   b2Body.prototype.GetUserData = function () {
      return this.m_userData;
   }
   b2Body.prototype.SetUserData = function (data) {
      this.m_userData = data;
   }
   b2Body.prototype.GetWorld = function () {
      return this.m_world;
   }
   b2Body.prototype.b2Body = function (bd, world) {
      this.m_flags = 0;
      if (bd.bullet) {
         this.m_flags |= b2Body.e_bulletFlag;
      }
      if (bd.fixedRotation) {
         this.m_flags |= b2Body.e_fixedRotationFlag;
      }
      if (bd.allowSleep) {
         this.m_flags |= b2Body.e_allowSleepFlag;
      }
      if (bd.awake) {
         this.m_flags |= b2Body.e_awakeFlag;
      }
      if (bd.active) {
         this.m_flags |= b2Body.e_activeFlag;
      }
      this.m_world = world;
      this.m_xf.position.SetV(bd.position);
      this.m_xf.R.Set(bd.angle);
      this.m_sweep.localCenter.SetZero();
      this.m_sweep.t0 = 1.0;
      this.m_sweep.a0 = this.m_sweep.a = bd.angle;
      var tMat = this.m_xf.R;
      var tVec = this.m_sweep.localCenter;
      this.m_sweep.c.x = (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
      this.m_sweep.c.y = (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      this.m_sweep.c.x += this.m_xf.position.x;
      this.m_sweep.c.y += this.m_xf.position.y;
      this.m_sweep.c0.SetV(this.m_sweep.c);
      this.m_jointList = null;
      this.m_controllerList = null;
      this.m_contactList = null;
      this.m_controllerCount = 0;
      this.m_prev = null;
      this.m_next = null;
      this.m_linearVelocity.SetV(bd.linearVelocity);
      this.m_angularVelocity = bd.angularVelocity;
      this.m_linearDamping = bd.linearDamping;
      this.m_angularDamping = bd.angularDamping;
      this.m_force.Set(0.0, 0.0);
      this.m_torque = 0.0;
      this.m_sleepTime = 0.0;
      this.m_type = bd.type;
      if (this.m_type == b2Body.b2_dynamicBody) {
         this.m_mass = 1.0;
         this.m_invMass = 1.0;
      }
      else {
         this.m_mass = 0.0;
         this.m_invMass = 0.0;
      }
      this.m_I = 0.0;
      this.m_invI = 0.0;
      this.m_inertiaScale = bd.inertiaScale;
      this.m_userData = bd.userData;
      this.m_fixtureList = null;
      this.m_fixtureCount = 0;
   }
   b2Body.prototype.SynchronizeFixtures = function () {
      var xf1 = b2Body.s_xf1;
      xf1.R.Set(this.m_sweep.a0);
      var tMat = xf1.R;
      var tVec = this.m_sweep.localCenter;
      xf1.position.x = this.m_sweep.c0.x - (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
      xf1.position.y = this.m_sweep.c0.y - (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      var f;
      var broadPhase = this.m_world.m_contactManager.m_broadPhase;
      for (f = this.m_fixtureList;
      f; f = f.m_next) {
         f.Synchronize(broadPhase, xf1, this.m_xf);
      }
   }
   b2Body.prototype.SynchronizeTransform = function () {
      this.m_xf.R.Set(this.m_sweep.a);
      var tMat = this.m_xf.R;
      var tVec = this.m_sweep.localCenter;
      this.m_xf.position.x = this.m_sweep.c.x - (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
      this.m_xf.position.y = this.m_sweep.c.y - (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
   }
   b2Body.prototype.ShouldCollide = function (other) {
      if (this.m_type != b2Body.b2_dynamicBody && other.m_type != b2Body.b2_dynamicBody) {
         return false;
      }
      for (var jn = this.m_jointList; jn; jn = jn.next) {
         if (jn.other == other) if (jn.joint.m_collideConnected == false) {
            return false;
         }
      }
      return true;
   }
   b2Body.prototype.Advance = function (t) {
      if (t === undefined) t = 0;
      this.m_sweep.Advance(t);
      this.m_sweep.c.SetV(this.m_sweep.c0);
      this.m_sweep.a = this.m_sweep.a0;
      this.SynchronizeTransform();
   }
   Box2D.postDefs.push(function () {
      Box2D.Dynamics.b2Body.s_xf1 = new b2Transform();
      Box2D.Dynamics.b2Body.e_islandFlag = 0x0001;
      Box2D.Dynamics.b2Body.e_awakeFlag = 0x0002;
      Box2D.Dynamics.b2Body.e_allowSleepFlag = 0x0004;
      Box2D.Dynamics.b2Body.e_bulletFlag = 0x0008;
      Box2D.Dynamics.b2Body.e_fixedRotationFlag = 0x0010;
      Box2D.Dynamics.b2Body.e_activeFlag = 0x0020;
      Box2D.Dynamics.b2Body.b2_staticBody = 0;
      Box2D.Dynamics.b2Body.b2_kinematicBody = 1;
      Box2D.Dynamics.b2Body.b2_dynamicBody = 2;
   });
   b2BodyDef.b2BodyDef = function () {
      this.position = new b2Vec2();
      this.linearVelocity = new b2Vec2();
   };
   b2BodyDef.prototype.b2BodyDef = function () {
      this.userData = null;
      this.position.Set(0.0, 0.0);
      this.angle = 0.0;
      this.linearVelocity.Set(0, 0);
      this.angularVelocity = 0.0;
      this.linearDamping = 0.0;
      this.angularDamping = 0.0;
      this.allowSleep = true;
      this.awake = true;
      this.fixedRotation = false;
      this.bullet = false;
      this.type = b2Body.b2_staticBody;
      this.active = true;
      this.inertiaScale = 1.0;
   }
   b2ContactFilter.b2ContactFilter = function () {};
   b2ContactFilter.prototype.ShouldCollide = function (fixtureA, fixtureB) {
      var filter1 = fixtureA.GetFilterData();
      var filter2 = fixtureB.GetFilterData();
      if (filter1.groupIndex == filter2.groupIndex && filter1.groupIndex != 0) {
         return filter1.groupIndex > 0;
      }
      var collide = (filter1.maskBits & filter2.categoryBits) != 0 && (filter1.categoryBits & filter2.maskBits) != 0;
      return collide;
   }
   b2ContactFilter.prototype.RayCollide = function (userData, fixture) {
      if (!userData) return true;
      return this.ShouldCollide((userData instanceof b2Fixture ? userData : null), fixture);
   }
   Box2D.postDefs.push(function () {
      Box2D.Dynamics.b2ContactFilter.b2_defaultFilter = new b2ContactFilter();
   });
   b2ContactImpulse.b2ContactImpulse = function () {
      this.normalImpulses = new Vector_a2j_Number(b2Settings.b2_maxManifoldPoints);
      this.tangentImpulses = new Vector_a2j_Number(b2Settings.b2_maxManifoldPoints);
   };
   b2ContactListener.b2ContactListener = function () {};
   b2ContactListener.prototype.BeginContact = function (contact) {}
   b2ContactListener.prototype.EndContact = function (contact) {}
   b2ContactListener.prototype.PreSolve = function (contact, oldManifold) {}
   b2ContactListener.prototype.PostSolve = function (contact, impulse) {}
   Box2D.postDefs.push(function () {
      Box2D.Dynamics.b2ContactListener.b2_defaultListener = new b2ContactListener();
   });
   b2ContactManager.b2ContactManager = function () {};
   b2ContactManager.prototype.b2ContactManager = function () {
      this.m_world = null;
      this.m_contactCount = 0;
      this.m_contactFilter = b2ContactFilter.b2_defaultFilter;
      this.m_contactListener = b2ContactListener.b2_defaultListener;
      this.m_contactFactory = new b2ContactFactory(this.m_allocator);
      this.m_broadPhase = new b2DynamicTreeBroadPhase();
   }
   b2ContactManager.prototype.AddPair = function (proxyUserDataA, proxyUserDataB) {
      var fixtureA = (proxyUserDataA instanceof b2Fixture ? proxyUserDataA : null);
      var fixtureB = (proxyUserDataB instanceof b2Fixture ? proxyUserDataB : null);
      var bodyA = fixtureA.GetBody();
      var bodyB = fixtureB.GetBody();
      if (bodyA == bodyB) return;
      var edge = bodyB.GetContactList();
      while (edge) {
         if (edge.other == bodyA) {
            var fA = edge.contact.GetFixtureA();
            var fB = edge.contact.GetFixtureB();
            if (fA == fixtureA && fB == fixtureB) return;
            if (fA == fixtureB && fB == fixtureA) return;
         }
         edge = edge.next;
      }
      if (bodyB.ShouldCollide(bodyA) == false) {
         return;
      }
      if (this.m_contactFilter.ShouldCollide(fixtureA, fixtureB) == false) {
         return;
      }
      var c = this.m_contactFactory.Create(fixtureA, fixtureB);
      fixtureA = c.GetFixtureA();
      fixtureB = c.GetFixtureB();
      bodyA = fixtureA.m_body;
      bodyB = fixtureB.m_body;
      c.m_prev = null;
      c.m_next = this.m_world.m_contactList;
      if (this.m_world.m_contactList != null) {
         this.m_world.m_contactList.m_prev = c;
      }
      this.m_world.m_contactList = c;
      c.m_nodeA.contact = c;
      c.m_nodeA.other = bodyB;
      c.m_nodeA.prev = null;
      c.m_nodeA.next = bodyA.m_contactList;
      if (bodyA.m_contactList != null) {
         bodyA.m_contactList.prev = c.m_nodeA;
      }
      bodyA.m_contactList = c.m_nodeA;
      c.m_nodeB.contact = c;
      c.m_nodeB.other = bodyA;
      c.m_nodeB.prev = null;
      c.m_nodeB.next = bodyB.m_contactList;
      if (bodyB.m_contactList != null) {
         bodyB.m_contactList.prev = c.m_nodeB;
      }
      bodyB.m_contactList = c.m_nodeB;
      ++this.m_world.m_contactCount;
      return;
   }
   b2ContactManager.prototype.FindNewContacts = function () {
      this.m_broadPhase.UpdatePairs(Box2D.generateCallback(this, this.AddPair));
   }
   b2ContactManager.prototype.Destroy = function (c) {
      var fixtureA = c.GetFixtureA();
      var fixtureB = c.GetFixtureB();
      var bodyA = fixtureA.GetBody();
      var bodyB = fixtureB.GetBody();
      if (c.IsTouching()) {
         this.m_contactListener.EndContact(c);
      }
      if (c.m_prev) {
         c.m_prev.m_next = c.m_next;
      }
      if (c.m_next) {
         c.m_next.m_prev = c.m_prev;
      }
      if (c == this.m_world.m_contactList) {
         this.m_world.m_contactList = c.m_next;
      }
      if (c.m_nodeA.prev) {
         c.m_nodeA.prev.next = c.m_nodeA.next;
      }
      if (c.m_nodeA.next) {
         c.m_nodeA.next.prev = c.m_nodeA.prev;
      }
      if (c.m_nodeA == bodyA.m_contactList) {
         bodyA.m_contactList = c.m_nodeA.next;
      }
      if (c.m_nodeB.prev) {
         c.m_nodeB.prev.next = c.m_nodeB.next;
      }
      if (c.m_nodeB.next) {
         c.m_nodeB.next.prev = c.m_nodeB.prev;
      }
      if (c.m_nodeB == bodyB.m_contactList) {
         bodyB.m_contactList = c.m_nodeB.next;
      }
      this.m_contactFactory.Destroy(c);
      --this.m_contactCount;
   }
   b2ContactManager.prototype.Collide = function () {
      var c = this.m_world.m_contactList;
      while (c) {
         var fixtureA = c.GetFixtureA();
         var fixtureB = c.GetFixtureB();
         var bodyA = fixtureA.GetBody();
         var bodyB = fixtureB.GetBody();
         if (bodyA.IsAwake() == false && bodyB.IsAwake() == false) {
            c = c.GetNext();
            continue;
         }
         if (c.m_flags & b2Contact.e_filterFlag) {
            if (bodyB.ShouldCollide(bodyA) == false) {
               var cNuke = c;
               c = cNuke.GetNext();
               this.Destroy(cNuke);
               continue;
            }
            if (this.m_contactFilter.ShouldCollide(fixtureA, fixtureB) == false) {
               cNuke = c;
               c = cNuke.GetNext();
               this.Destroy(cNuke);
               continue;
            }
            c.m_flags &= ~b2Contact.e_filterFlag;
         }
         var proxyA = fixtureA.m_proxy;
         var proxyB = fixtureB.m_proxy;
         var overlap = this.m_broadPhase.TestOverlap(proxyA, proxyB);
         if (overlap == false) {
            cNuke = c;
            c = cNuke.GetNext();
            this.Destroy(cNuke);
            continue;
         }
         c.Update(this.m_contactListener);
         c = c.GetNext();
      }
   }
   Box2D.postDefs.push(function () {
      Box2D.Dynamics.b2ContactManager.s_evalCP = new b2ContactPoint();
   });
   b2DebugDraw.b2DebugDraw = function () {};
   b2DebugDraw.prototype.b2DebugDraw = function () {}
   b2DebugDraw.prototype.SetFlags = function (flags) {
      if (flags === undefined) flags = 0;
   }
   b2DebugDraw.prototype.GetFlags = function () {}
   b2DebugDraw.prototype.AppendFlags = function (flags) {
      if (flags === undefined) flags = 0;
   }
   b2DebugDraw.prototype.ClearFlags = function (flags) {
      if (flags === undefined) flags = 0;
   }
   b2DebugDraw.prototype.SetSprite = function (sprite) {}
   b2DebugDraw.prototype.GetSprite = function () {}
   b2DebugDraw.prototype.SetDrawScale = function (drawScale) {
      if (drawScale === undefined) drawScale = 0;
   }
   b2DebugDraw.prototype.GetDrawScale = function () {}
   b2DebugDraw.prototype.SetLineThickness = function (lineThickness) {
      if (lineThickness === undefined) lineThickness = 0;
   }
   b2DebugDraw.prototype.GetLineThickness = function () {}
   b2DebugDraw.prototype.SetAlpha = function (alpha) {
      if (alpha === undefined) alpha = 0;
   }
   b2DebugDraw.prototype.GetAlpha = function () {}
   b2DebugDraw.prototype.SetFillAlpha = function (alpha) {
      if (alpha === undefined) alpha = 0;
   }
   b2DebugDraw.prototype.GetFillAlpha = function () {}
   b2DebugDraw.prototype.SetXFormScale = function (xformScale) {
      if (xformScale === undefined) xformScale = 0;
   }
   b2DebugDraw.prototype.GetXFormScale = function () {}
   b2DebugDraw.prototype.DrawPolygon = function (vertices, vertexCount, color) {
      if (vertexCount === undefined) vertexCount = 0;
   }
   b2DebugDraw.prototype.DrawSolidPolygon = function (vertices, vertexCount, color) {
      if (vertexCount === undefined) vertexCount = 0;
   }
   b2DebugDraw.prototype.DrawCircle = function (center, radius, color) {
      if (radius === undefined) radius = 0;
   }
   b2DebugDraw.prototype.DrawSolidCircle = function (center, radius, axis, color) {
      if (radius === undefined) radius = 0;
   }
   b2DebugDraw.prototype.DrawSegment = function (p1, p2, color) {}
   b2DebugDraw.prototype.DrawTransform = function (xf) {}
   Box2D.postDefs.push(function () {
      Box2D.Dynamics.b2DebugDraw.e_shapeBit = 0x0001;
      Box2D.Dynamics.b2DebugDraw.e_jointBit = 0x0002;
      Box2D.Dynamics.b2DebugDraw.e_aabbBit = 0x0004;
      Box2D.Dynamics.b2DebugDraw.e_pairBit = 0x0008;
      Box2D.Dynamics.b2DebugDraw.e_centerOfMassBit = 0x0010;
      Box2D.Dynamics.b2DebugDraw.e_controllerBit = 0x0020;
   });
   b2DestructionListener.b2DestructionListener = function () {};
   b2DestructionListener.prototype.SayGoodbyeJoint = function (joint) {}
   b2DestructionListener.prototype.SayGoodbyeFixture = function (fixture) {}
   b2FilterData.b2FilterData = function () {
      this.categoryBits = 0x0001;
      this.maskBits = 0xFFFF;
      this.groupIndex = 0;
   };
   b2FilterData.prototype.Copy = function () {
      var copy = new b2FilterData();
      copy.categoryBits = this.categoryBits;
      copy.maskBits = this.maskBits;
      copy.groupIndex = this.groupIndex;
      return copy;
   }
   b2Fixture.b2Fixture = function () {
      this.m_filter = new b2FilterData();
   };
   b2Fixture.prototype.GetType = function () {
      return this.m_shape.GetType();
   }
   b2Fixture.prototype.GetShape = function () {
      return this.m_shape;
   }
   b2Fixture.prototype.SetSensor = function (sensor) {
      if (this.m_isSensor == sensor) return;
      this.m_isSensor = sensor;
      if (this.m_body == null) return;
      var edge = this.m_body.GetContactList();
      while (edge) {
         var contact = edge.contact;
         var fixtureA = contact.GetFixtureA();
         var fixtureB = contact.GetFixtureB();
         if (fixtureA == this || fixtureB == this) contact.SetSensor(fixtureA.IsSensor() || fixtureB.IsSensor());
         edge = edge.next;
      }
   }
   b2Fixture.prototype.IsSensor = function () {
      return this.m_isSensor;
   }
   b2Fixture.prototype.SetFilterData = function (filter) {
      this.m_filter = filter.Copy();
      if (this.m_body) return;
      var edge = this.m_body.GetContactList();
      while (edge) {
         var contact = edge.contact;
         var fixtureA = contact.GetFixtureA();
         var fixtureB = contact.GetFixtureB();
         if (fixtureA == this || fixtureB == this) contact.FlagForFiltering();
         edge = edge.next;
      }
   }
   b2Fixture.prototype.GetFilterData = function () {
      return this.m_filter.Copy();
   }
   b2Fixture.prototype.GetBody = function () {
      return this.m_body;
   }
   b2Fixture.prototype.GetNext = function () {
      return this.m_next;
   }
   b2Fixture.prototype.GetUserData = function () {
      return this.m_userData;
   }
   b2Fixture.prototype.SetUserData = function (data) {
      this.m_userData = data;
   }
   b2Fixture.prototype.TestPoint = function (p) {
      return this.m_shape.TestPoint(this.m_body.GetTransform(), p);
   }
   b2Fixture.prototype.RayCast = function (output, input) {
      return this.m_shape.RayCast(output, input, this.m_body.GetTransform());
   }
   b2Fixture.prototype.GetMassData = function (massData) {
      if (massData === undefined) massData = null;
      if (massData == null) {
         massData = new b2MassData();
      }
      this.m_shape.ComputeMass(massData, this.m_density);
      return massData;
   }
   b2Fixture.prototype.SetDensity = function (density) {
      if (density === undefined) density = 0;
      this.m_density = density;
   }
   b2Fixture.prototype.GetDensity = function () {
      return this.m_density;
   }
   b2Fixture.prototype.GetFriction = function () {
      return this.m_friction;
   }
   b2Fixture.prototype.SetFriction = function (friction) {
      if (friction === undefined) friction = 0;
      this.m_friction = friction;
   }
   b2Fixture.prototype.GetRestitution = function () {
      return this.m_restitution;
   }
   b2Fixture.prototype.SetRestitution = function (restitution) {
      if (restitution === undefined) restitution = 0;
      this.m_restitution = restitution;
   }
   b2Fixture.prototype.GetAABB = function () {
      return this.m_aabb;
   }
   b2Fixture.prototype.b2Fixture = function () {
      this.m_aabb = new b2AABB();
      this.m_userData = null;
      this.m_body = null;
      this.m_next = null;
      this.m_shape = null;
      this.m_density = 0.0;
      this.m_friction = 0.0;
      this.m_restitution = 0.0;
   }
   b2Fixture.prototype.Create = function (body, xf, def) {
      this.m_userData = def.userData;
      this.m_friction = def.friction;
      this.m_restitution = def.restitution;
      this.m_body = body;
      this.m_next = null;
      this.m_filter = def.filter.Copy();
      this.m_isSensor = def.isSensor;
      this.m_shape = def.shape.Copy();
      this.m_density = def.density;
   }
   b2Fixture.prototype.Destroy = function () {
      this.m_shape = null;
   }
   b2Fixture.prototype.CreateProxy = function (broadPhase, xf) {
      this.m_shape.ComputeAABB(this.m_aabb, xf);
      this.m_proxy = broadPhase.CreateProxy(this.m_aabb, this);
   }
   b2Fixture.prototype.DestroyProxy = function (broadPhase) {
      if (this.m_proxy == null) {
         return;
      }
      broadPhase.DestroyProxy(this.m_proxy);
      this.m_proxy = null;
   }
   b2Fixture.prototype.Synchronize = function (broadPhase, transform1, transform2) {
      if (!this.m_proxy) return;
      var aabb1 = new b2AABB();
      var aabb2 = new b2AABB();
      this.m_shape.ComputeAABB(aabb1, transform1);
      this.m_shape.ComputeAABB(aabb2, transform2);
      this.m_aabb.Combine(aabb1, aabb2);
      var displacement = b2Math.SubtractVV(transform2.position, transform1.position);
      broadPhase.MoveProxy(this.m_proxy, this.m_aabb, displacement);
   }
   b2FixtureDef.b2FixtureDef = function () {
      this.filter = new b2FilterData();
   };
   b2FixtureDef.prototype.b2FixtureDef = function () {
      this.shape = null;
      this.userData = null;
      this.friction = 0.2;
      this.restitution = 0.0;
      this.density = 0.0;
      this.filter.categoryBits = 0x0001;
      this.filter.maskBits = 0xFFFF;
      this.filter.groupIndex = 0;
      this.isSensor = false;
   }
   b2Island.b2Island = function () {};
   b2Island.prototype.b2Island = function () {
      this.m_bodies = new Vector();
      this.m_contacts = new Vector();
      this.m_joints = new Vector();
   }
   b2Island.prototype.Initialize = function (bodyCapacity, contactCapacity, jointCapacity, allocator, listener, contactSolver) {
      if (bodyCapacity === undefined) bodyCapacity = 0;
      if (contactCapacity === undefined) contactCapacity = 0;
      if (jointCapacity === undefined) jointCapacity = 0;
      var i = 0;
      this.m_bodyCapacity = bodyCapacity;
      this.m_contactCapacity = contactCapacity;
      this.m_jointCapacity = jointCapacity;
      this.m_bodyCount = 0;
      this.m_contactCount = 0;
      this.m_jointCount = 0;
      this.m_allocator = allocator;
      this.m_listener = listener;
      this.m_contactSolver = contactSolver;
      for (i = this.m_bodies.length;
      i < bodyCapacity; i++)
      this.m_bodies[i] = null;
      for (i = this.m_contacts.length;
      i < contactCapacity; i++)
      this.m_contacts[i] = null;
      for (i = this.m_joints.length;
      i < jointCapacity; i++)
      this.m_joints[i] = null;
   }
   b2Island.prototype.Clear = function () {
      this.m_bodyCount = 0;
      this.m_contactCount = 0;
      this.m_jointCount = 0;
   }
   b2Island.prototype.Solve = function (step, gravity, allowSleep) {
      var i = 0;
      var j = 0;
      var b;
      var joint;
      for (i = 0;
      i < this.m_bodyCount; ++i) {
         b = this.m_bodies[i];
         if (b.GetType() != b2Body.b2_dynamicBody) continue;
         b.m_linearVelocity.x += step.dt * (gravity.x + b.m_invMass * b.m_force.x);
         b.m_linearVelocity.y += step.dt * (gravity.y + b.m_invMass * b.m_force.y);
         b.m_angularVelocity += step.dt * b.m_invI * b.m_torque;
         b.m_linearVelocity.Multiply(b2Math.Clamp(1.0 - step.dt * b.m_linearDamping, 0.0, 1.0));
         b.m_angularVelocity *= b2Math.Clamp(1.0 - step.dt * b.m_angularDamping, 0.0, 1.0);
      }
      this.m_contactSolver.Initialize(step, this.m_contacts, this.m_contactCount, this.m_allocator);
      var contactSolver = this.m_contactSolver;
      contactSolver.InitVelocityConstraints(step);
      for (i = 0;
      i < this.m_jointCount; ++i) {
         joint = this.m_joints[i];
         joint.InitVelocityConstraints(step);
      }
      for (i = 0;
      i < step.velocityIterations; ++i) {
         for (j = 0;
         j < this.m_jointCount; ++j) {
            joint = this.m_joints[j];
            joint.SolveVelocityConstraints(step);
         }
         contactSolver.SolveVelocityConstraints();
      }
      for (i = 0;
      i < this.m_jointCount; ++i) {
         joint = this.m_joints[i];
         joint.FinalizeVelocityConstraints();
      }
      contactSolver.FinalizeVelocityConstraints();
      for (i = 0;
      i < this.m_bodyCount; ++i) {
         b = this.m_bodies[i];
         if (b.GetType() == b2Body.b2_staticBody) continue;
         var translationX = step.dt * b.m_linearVelocity.x;
         var translationY = step.dt * b.m_linearVelocity.y;
         if ((translationX * translationX + translationY * translationY) > b2Settings.b2_maxTranslationSquared) {
            b.m_linearVelocity.Normalize();
            b.m_linearVelocity.x *= b2Settings.b2_maxTranslation * step.inv_dt;
            b.m_linearVelocity.y *= b2Settings.b2_maxTranslation * step.inv_dt;
         }
         var rotation = step.dt * b.m_angularVelocity;
         if (rotation * rotation > b2Settings.b2_maxRotationSquared) {
            if (b.m_angularVelocity < 0.0) {
               b.m_angularVelocity = (-b2Settings.b2_maxRotation * step.inv_dt);
            }
            else {
               b.m_angularVelocity = b2Settings.b2_maxRotation * step.inv_dt;
            }
         }
         b.m_sweep.c0.SetV(b.m_sweep.c);
         b.m_sweep.a0 = b.m_sweep.a;
         b.m_sweep.c.x += step.dt * b.m_linearVelocity.x;
         b.m_sweep.c.y += step.dt * b.m_linearVelocity.y;
         b.m_sweep.a += step.dt * b.m_angularVelocity;
         b.SynchronizeTransform();
      }
      for (i = 0;
      i < step.positionIterations; ++i) {
         var contactsOkay = contactSolver.SolvePositionConstraints(b2Settings.b2_contactBaumgarte);
         var jointsOkay = true;
         for (j = 0;
         j < this.m_jointCount; ++j) {
            joint = this.m_joints[j];
            var jointOkay = joint.SolvePositionConstraints(b2Settings.b2_contactBaumgarte);
            jointsOkay = jointsOkay && jointOkay;
         }
         if (contactsOkay && jointsOkay) {
            break;
         }
      }
      this.Report(contactSolver.m_constraints);
      if (allowSleep) {
         var minSleepTime = Number.MAX_VALUE;
         var linTolSqr = b2Settings.b2_linearSleepTolerance * b2Settings.b2_linearSleepTolerance;
         var angTolSqr = b2Settings.b2_angularSleepTolerance * b2Settings.b2_angularSleepTolerance;
         for (i = 0;
         i < this.m_bodyCount; ++i) {
            b = this.m_bodies[i];
            if (b.GetType() == b2Body.b2_staticBody) {
               continue;
            }
            if ((b.m_flags & b2Body.e_allowSleepFlag) == 0) {
               b.m_sleepTime = 0.0;
               minSleepTime = 0.0;
            }
            if ((b.m_flags & b2Body.e_allowSleepFlag) == 0 || b.m_angularVelocity * b.m_angularVelocity > angTolSqr || b2Math.Dot(b.m_linearVelocity, b.m_linearVelocity) > linTolSqr) {
               b.m_sleepTime = 0.0;
               minSleepTime = 0.0;
            }
            else {
               b.m_sleepTime += step.dt;
               minSleepTime = b2Math.Min(minSleepTime, b.m_sleepTime);
            }
         }
         if (minSleepTime >= b2Settings.b2_timeToSleep) {
            for (i = 0;
            i < this.m_bodyCount; ++i) {
               b = this.m_bodies[i];
               b.SetAwake(false);
            }
         }
      }
   }
   b2Island.prototype.SolveTOI = function (subStep) {
      var i = 0;
      var j = 0;
      this.m_contactSolver.Initialize(subStep, this.m_contacts, this.m_contactCount, this.m_allocator);
      var contactSolver = this.m_contactSolver;
      for (i = 0;
      i < this.m_jointCount; ++i) {
         this.m_joints[i].InitVelocityConstraints(subStep);
      }
      for (i = 0;
      i < subStep.velocityIterations; ++i) {
         contactSolver.SolveVelocityConstraints();
         for (j = 0;
         j < this.m_jointCount; ++j) {
            this.m_joints[j].SolveVelocityConstraints(subStep);
         }
      }
      for (i = 0;
      i < this.m_bodyCount; ++i) {
         var b = this.m_bodies[i];
         if (b.GetType() == b2Body.b2_staticBody) continue;
         var translationX = subStep.dt * b.m_linearVelocity.x;
         var translationY = subStep.dt * b.m_linearVelocity.y;
         if ((translationX * translationX + translationY * translationY) > b2Settings.b2_maxTranslationSquared) {
            b.m_linearVelocity.Normalize();
            b.m_linearVelocity.x *= b2Settings.b2_maxTranslation * subStep.inv_dt;
            b.m_linearVelocity.y *= b2Settings.b2_maxTranslation * subStep.inv_dt;
         }
         var rotation = subStep.dt * b.m_angularVelocity;
         if (rotation * rotation > b2Settings.b2_maxRotationSquared) {
            if (b.m_angularVelocity < 0.0) {
               b.m_angularVelocity = (-b2Settings.b2_maxRotation * subStep.inv_dt);
            }
            else {
               b.m_angularVelocity = b2Settings.b2_maxRotation * subStep.inv_dt;
            }
         }
         b.m_sweep.c0.SetV(b.m_sweep.c);
         b.m_sweep.a0 = b.m_sweep.a;
         b.m_sweep.c.x += subStep.dt * b.m_linearVelocity.x;
         b.m_sweep.c.y += subStep.dt * b.m_linearVelocity.y;
         b.m_sweep.a += subStep.dt * b.m_angularVelocity;
         b.SynchronizeTransform();
      }
      var k_toiBaumgarte = 0.75;
      for (i = 0;
      i < subStep.positionIterations; ++i) {
         var contactsOkay = contactSolver.SolvePositionConstraints(k_toiBaumgarte);
         var jointsOkay = true;
         for (j = 0;
         j < this.m_jointCount; ++j) {
            var jointOkay = this.m_joints[j].SolvePositionConstraints(b2Settings.b2_contactBaumgarte);
            jointsOkay = jointsOkay && jointOkay;
         }
         if (contactsOkay && jointsOkay) {
            break;
         }
      }
      this.Report(contactSolver.m_constraints);
   }
   b2Island.prototype.Report = function (constraints) {
      if (this.m_listener == null) {
         return;
      }
      for (var i = 0; i < this.m_contactCount; ++i) {
         var c = this.m_contacts[i];
         var cc = constraints[i];
         for (var j = 0; j < cc.pointCount; ++j) {
            b2Island.s_impulse.normalImpulses[j] = cc.points[j].normalImpulse;
            b2Island.s_impulse.tangentImpulses[j] = cc.points[j].tangentImpulse;
         }
         this.m_listener.PostSolve(c, b2Island.s_impulse);
      }
   }
   b2Island.prototype.AddBody = function (body) {
      body.m_islandIndex = this.m_bodyCount;
      this.m_bodies[this.m_bodyCount++] = body;
   }
   b2Island.prototype.AddContact = function (contact) {
      this.m_contacts[this.m_contactCount++] = contact;
   }
   b2Island.prototype.AddJoint = function (joint) {
      this.m_joints[this.m_jointCount++] = joint;
   }
   Box2D.postDefs.push(function () {
      Box2D.Dynamics.b2Island.s_impulse = new b2ContactImpulse();
   });
   b2TimeStep.b2TimeStep = function () {};
   b2TimeStep.prototype.Set = function (step) {
      this.dt = step.dt;
      this.inv_dt = step.inv_dt;
      this.positionIterations = step.positionIterations;
      this.velocityIterations = step.velocityIterations;
      this.warmStarting = step.warmStarting;
   }
   b2World.b2World = function () {
      this.s_stack = new Vector();
      this.m_contactManager = new b2ContactManager();
      this.m_contactSolver = new b2ContactSolver();
      this.m_island = new b2Island();
   };
   b2World.prototype.b2World = function (gravity, doSleep) {
      this.m_destructionListener = null;
      this.m_debugDraw = null;
      this.m_bodyList = null;
      this.m_contactList = null;
      this.m_jointList = null;
      this.m_controllerList = null;
      this.m_bodyCount = 0;
      this.m_contactCount = 0;
      this.m_jointCount = 0;
      this.m_controllerCount = 0;
      b2World.m_warmStarting = true;
      b2World.m_continuousPhysics = true;
      this.m_allowSleep = doSleep;
      this.m_gravity = gravity;
      this.m_inv_dt0 = 0.0;
      this.m_contactManager.m_world = this;
      var bd = new b2BodyDef();
      this.m_groundBody = this.CreateBody(bd);
   }
   b2World.prototype.SetDestructionListener = function (listener) {
      this.m_destructionListener = listener;
   }
   b2World.prototype.SetContactFilter = function (filter) {
      this.m_contactManager.m_contactFilter = filter;
   }
   b2World.prototype.SetContactListener = function (listener) {
      this.m_contactManager.m_contactListener = listener;
   }
   b2World.prototype.SetDebugDraw = function (debugDraw) {
      this.m_debugDraw = debugDraw;
   }
   b2World.prototype.SetBroadPhase = function (broadPhase) {
      var oldBroadPhase = this.m_contactManager.m_broadPhase;
      this.m_contactManager.m_broadPhase = broadPhase;
      for (var b = this.m_bodyList; b; b = b.m_next) {
         for (var f = b.m_fixtureList; f; f = f.m_next) {
            f.m_proxy = broadPhase.CreateProxy(oldBroadPhase.GetFatAABB(f.m_proxy), f);
         }
      }
   }
   b2World.prototype.Validate = function () {
      this.m_contactManager.m_broadPhase.Validate();
   }
   b2World.prototype.GetProxyCount = function () {
      return this.m_contactManager.m_broadPhase.GetProxyCount();
   }
   b2World.prototype.CreateBody = function (def) {
      if (this.IsLocked() == true) {
         return null;
      }
      var b = new b2Body(def, this);
      b.m_prev = null;
      b.m_next = this.m_bodyList;
      if (this.m_bodyList) {
         this.m_bodyList.m_prev = b;
      }
      this.m_bodyList = b;
      ++this.m_bodyCount;
      return b;
   }
   b2World.prototype.DestroyBody = function (b) {
      if (this.IsLocked() == true) {
         return;
      }
      var jn = b.m_jointList;
      while (jn) {
         var jn0 = jn;
         jn = jn.next;
         if (this.m_destructionListener) {
            this.m_destructionListener.SayGoodbyeJoint(jn0.joint);
         }
         this.DestroyJoint(jn0.joint);
      }
      var coe = b.m_controllerList;
      while (coe) {
         var coe0 = coe;
         coe = coe.nextController;
         coe0.controller.RemoveBody(b);
      }
      var ce = b.m_contactList;
      while (ce) {
         var ce0 = ce;
         ce = ce.next;
         this.m_contactManager.Destroy(ce0.contact);
      }
      b.m_contactList = null;
      var f = b.m_fixtureList;
      while (f) {
         var f0 = f;
         f = f.m_next;
         if (this.m_destructionListener) {
            this.m_destructionListener.SayGoodbyeFixture(f0);
         }
         f0.DestroyProxy(this.m_contactManager.m_broadPhase);
         f0.Destroy();
      }
      b.m_fixtureList = null;
      b.m_fixtureCount = 0;
      if (b.m_prev) {
         b.m_prev.m_next = b.m_next;
      }
      if (b.m_next) {
         b.m_next.m_prev = b.m_prev;
      }
      if (b == this.m_bodyList) {
         this.m_bodyList = b.m_next;
      }--this.m_bodyCount;
   }
   b2World.prototype.CreateJoint = function (def) {
      var j = b2Joint.Create(def, null);
      j.m_prev = null;
      j.m_next = this.m_jointList;
      if (this.m_jointList) {
         this.m_jointList.m_prev = j;
      }
      this.m_jointList = j;
      ++this.m_jointCount;
      j.m_edgeA.joint = j;
      j.m_edgeA.other = j.m_bodyB;
      j.m_edgeA.prev = null;
      j.m_edgeA.next = j.m_bodyA.m_jointList;
      if (j.m_bodyA.m_jointList) j.m_bodyA.m_jointList.prev = j.m_edgeA;
      j.m_bodyA.m_jointList = j.m_edgeA;
      j.m_edgeB.joint = j;
      j.m_edgeB.other = j.m_bodyA;
      j.m_edgeB.prev = null;
      j.m_edgeB.next = j.m_bodyB.m_jointList;
      if (j.m_bodyB.m_jointList) j.m_bodyB.m_jointList.prev = j.m_edgeB;
      j.m_bodyB.m_jointList = j.m_edgeB;
      var bodyA = def.bodyA;
      var bodyB = def.bodyB;
      if (def.collideConnected == false) {
         var edge = bodyB.GetContactList();
         while (edge) {
            if (edge.other == bodyA) {
               edge.contact.FlagForFiltering();
            }
            edge = edge.next;
         }
      }
      return j;
   }
   b2World.prototype.DestroyJoint = function (j) {
      var collideConnected = j.m_collideConnected;
      if (j.m_prev) {
         j.m_prev.m_next = j.m_next;
      }
      if (j.m_next) {
         j.m_next.m_prev = j.m_prev;
      }
      if (j == this.m_jointList) {
         this.m_jointList = j.m_next;
      }
      var bodyA = j.m_bodyA;
      var bodyB = j.m_bodyB;
      bodyA.SetAwake(true);
      bodyB.SetAwake(true);
      if (j.m_edgeA.prev) {
         j.m_edgeA.prev.next = j.m_edgeA.next;
      }
      if (j.m_edgeA.next) {
         j.m_edgeA.next.prev = j.m_edgeA.prev;
      }
      if (j.m_edgeA == bodyA.m_jointList) {
         bodyA.m_jointList = j.m_edgeA.next;
      }
      j.m_edgeA.prev = null;
      j.m_edgeA.next = null;
      if (j.m_edgeB.prev) {
         j.m_edgeB.prev.next = j.m_edgeB.next;
      }
      if (j.m_edgeB.next) {
         j.m_edgeB.next.prev = j.m_edgeB.prev;
      }
      if (j.m_edgeB == bodyB.m_jointList) {
         bodyB.m_jointList = j.m_edgeB.next;
      }
      j.m_edgeB.prev = null;
      j.m_edgeB.next = null;
      b2Joint.Destroy(j, null);
      --this.m_jointCount;
      if (collideConnected == false) {
         var edge = bodyB.GetContactList();
         while (edge) {
            if (edge.other == bodyA) {
               edge.contact.FlagForFiltering();
            }
            edge = edge.next;
         }
      }
   }
   b2World.prototype.AddController = function (c) {
      c.m_next = this.m_controllerList;
      c.m_prev = null;
      this.m_controllerList = c;
      c.m_world = this;
      this.m_controllerCount++;
      return c;
   }
   b2World.prototype.RemoveController = function (c) {
      if (c.m_prev) c.m_prev.m_next = c.m_next;
      if (c.m_next) c.m_next.m_prev = c.m_prev;
      if (this.m_controllerList == c) this.m_controllerList = c.m_next;
      this.m_controllerCount--;
   }
   b2World.prototype.CreateController = function (controller) {
      if (controller.m_world != this) throw new Error("Controller can only be a member of one world");
      controller.m_next = this.m_controllerList;
      controller.m_prev = null;
      if (this.m_controllerList) this.m_controllerList.m_prev = controller;
      this.m_controllerList = controller;
      ++this.m_controllerCount;
      controller.m_world = this;
      return controller;
   }
   b2World.prototype.DestroyController = function (controller) {
      controller.Clear();
      if (controller.m_next) controller.m_next.m_prev = controller.m_prev;
      if (controller.m_prev) controller.m_prev.m_next = controller.m_next;
      if (controller == this.m_controllerList) this.m_controllerList = controller.m_next;
      --this.m_controllerCount;
   }
   b2World.prototype.SetWarmStarting = function (flag) {
      b2World.m_warmStarting = flag;
   }
   b2World.prototype.SetContinuousPhysics = function (flag) {
      b2World.m_continuousPhysics = flag;
   }
   b2World.prototype.GetBodyCount = function () {
      return this.m_bodyCount;
   }
   b2World.prototype.GetJointCount = function () {
      return this.m_jointCount;
   }
   b2World.prototype.GetContactCount = function () {
      return this.m_contactCount;
   }
   b2World.prototype.SetGravity = function (gravity) {
      this.m_gravity = gravity;
   }
   b2World.prototype.GetGravity = function () {
      return this.m_gravity;
   }
   b2World.prototype.GetGroundBody = function () {
      return this.m_groundBody;
   }
   b2World.prototype.Step = function (dt, velocityIterations, positionIterations) {
      if (dt === undefined) dt = 0;
      if (velocityIterations === undefined) velocityIterations = 0;
      if (positionIterations === undefined) positionIterations = 0;
      if (this.m_flags & b2World.e_newFixture) {
         this.m_contactManager.FindNewContacts();
         this.m_flags &= ~b2World.e_newFixture;
      }
      this.m_flags |= b2World.e_locked;
      var step = b2World.s_timestep2;
      step.dt = dt;
      step.velocityIterations = velocityIterations;
      step.positionIterations = positionIterations;
      if (dt > 0.0) {
         step.inv_dt = 1.0 / dt;
      }
      else {
         step.inv_dt = 0.0;
      }
      step.dtRatio = this.m_inv_dt0 * dt;
      step.warmStarting = b2World.m_warmStarting;
      this.m_contactManager.Collide();
      if (step.dt > 0.0) {
         this.Solve(step);
      }
      if (b2World.m_continuousPhysics && step.dt > 0.0) {
         this.SolveTOI(step);
      }
      if (step.dt > 0.0) {
         this.m_inv_dt0 = step.inv_dt;
      }
      this.m_flags &= ~b2World.e_locked;
   }
   b2World.prototype.ClearForces = function () {
      for (var body = this.m_bodyList; body; body = body.m_next) {
         body.m_force.SetZero();
         body.m_torque = 0.0;
      }
   }
   b2World.prototype.DrawDebugData = function () {
      if (this.m_debugDraw == null) {
         return;
      }
      this.m_debugDraw.m_sprite.graphics.clear();
      var flags = this.m_debugDraw.GetFlags();
      var i = 0;
      var b;
      var f;
      var s;
      var j;
      var bp;
      var invQ = new b2Vec2;
      var x1 = new b2Vec2;
      var x2 = new b2Vec2;
      var xf;
      var b1 = new b2AABB();
      var b2 = new b2AABB();
      var vs = [new b2Vec2(), new b2Vec2(), new b2Vec2(), new b2Vec2()];
      var color = new b2Color(0, 0, 0);
      if (flags & b2DebugDraw.e_shapeBit) {
         for (b = this.m_bodyList;
         b; b = b.m_next) {
            xf = b.m_xf;
            for (f = b.GetFixtureList();
            f; f = f.m_next) {
               s = f.GetShape();
               if (b.IsActive() == false) {
                  color.Set(0.5, 0.5, 0.3);
                  this.DrawShape(s, xf, color);
               }
               else if (b.GetType() == b2Body.b2_staticBody) {
                  color.Set(0.5, 0.9, 0.5);
                  this.DrawShape(s, xf, color);
               }
               else if (b.GetType() == b2Body.b2_kinematicBody) {
                  color.Set(0.5, 0.5, 0.9);
                  this.DrawShape(s, xf, color);
               }
               else if (b.IsAwake() == false) {
                  color.Set(0.6, 0.6, 0.6);
                  this.DrawShape(s, xf, color);
               }
               else {
                  color.Set(0.9, 0.7, 0.7);
                  this.DrawShape(s, xf, color);
               }
            }
         }
      }
      if (flags & b2DebugDraw.e_jointBit) {
         for (j = this.m_jointList;
         j; j = j.m_next) {
            this.DrawJoint(j);
         }
      }
      if (flags & b2DebugDraw.e_controllerBit) {
         for (var c = this.m_controllerList; c; c = c.m_next) {
            c.Draw(this.m_debugDraw);
         }
      }
      if (flags & b2DebugDraw.e_pairBit) {
         color.Set(0.3, 0.9, 0.9);
         for (var contact = this.m_contactManager.m_contactList; contact; contact = contact.GetNext()) {
            var fixtureA = contact.GetFixtureA();
            var fixtureB = contact.GetFixtureB();
            var cA = fixtureA.GetAABB().GetCenter();
            var cB = fixtureB.GetAABB().GetCenter();
            this.m_debugDraw.DrawSegment(cA, cB, color);
         }
      }
      if (flags & b2DebugDraw.e_aabbBit) {
         bp = this.m_contactManager.m_broadPhase;
         vs = [new b2Vec2(), new b2Vec2(), new b2Vec2(), new b2Vec2()];
         for (b = this.m_bodyList;
         b; b = b.GetNext()) {
            if (b.IsActive() == false) {
               continue;
            }
            for (f = b.GetFixtureList();
            f; f = f.GetNext()) {
               var aabb = bp.GetFatAABB(f.m_proxy);
               vs[0].Set(aabb.lowerBound.x, aabb.lowerBound.y);
               vs[1].Set(aabb.upperBound.x, aabb.lowerBound.y);
               vs[2].Set(aabb.upperBound.x, aabb.upperBound.y);
               vs[3].Set(aabb.lowerBound.x, aabb.upperBound.y);
               this.m_debugDraw.DrawPolygon(vs, 4, color);
            }
         }
      }
      if (flags & b2DebugDraw.e_centerOfMassBit) {
         for (b = this.m_bodyList;
         b; b = b.m_next) {
            xf = b2World.s_xf;
            xf.R = b.m_xf.R;
            xf.position = b.GetWorldCenter();
            this.m_debugDraw.DrawTransform(xf);
         }
      }
   }
   b2World.prototype.QueryAABB = function (callback, aabb) {
      var __this = this;
      var broadPhase = __this.m_contactManager.m_broadPhase;

      function WorldQueryWrapper(proxy) {
         return callback(broadPhase.GetUserData(proxy));
      };
      broadPhase.Query(WorldQueryWrapper, aabb);
   }
   b2World.prototype.QueryShape = function (callback, shape, transform) {
      var __this = this;
      if (transform === undefined) transform = null;
      if (transform == null) {
         transform = new b2Transform();
         transform.SetIdentity();
      }
      var broadPhase = __this.m_contactManager.m_broadPhase;

      function WorldQueryWrapper(proxy) {
         var fixture = (broadPhase.GetUserData(proxy) instanceof b2Fixture ? broadPhase.GetUserData(proxy) : null);
         if (b2Shape.TestOverlap(shape, transform, fixture.GetShape(), fixture.GetBody().GetTransform())) return callback(fixture);
         return true;
      };
      var aabb = new b2AABB();
      shape.ComputeAABB(aabb, transform);
      broadPhase.Query(WorldQueryWrapper, aabb);
   }
   b2World.prototype.QueryPoint = function (callback, p) {
      var __this = this;
      var broadPhase = __this.m_contactManager.m_broadPhase;

      function WorldQueryWrapper(proxy) {
         var fixture = (broadPhase.GetUserData(proxy) instanceof b2Fixture ? broadPhase.GetUserData(proxy) : null);
         if (fixture.TestPoint(p)) return callback(fixture);
         return true;
      };
      var aabb = new b2AABB();
      aabb.lowerBound.Set(p.x - b2Settings.b2_linearSlop, p.y - b2Settings.b2_linearSlop);
      aabb.upperBound.Set(p.x + b2Settings.b2_linearSlop, p.y + b2Settings.b2_linearSlop);
      broadPhase.Query(WorldQueryWrapper, aabb);
   }
   b2World.prototype.RayCast = function (callback, point1, point2) {
      var __this = this;
      var broadPhase = __this.m_contactManager.m_broadPhase;
      var output = new b2RayCastOutput;

      function RayCastWrapper(input, proxy) {
         var userData = broadPhase.GetUserData(proxy);
         var fixture = (userData instanceof b2Fixture ? userData : null);
         var hit = fixture.RayCast(output, input);
         if (hit) {
            var fraction = output.fraction;
            var point = new b2Vec2((1.0 - fraction) * point1.x + fraction * point2.x, (1.0 - fraction) * point1.y + fraction * point2.y);
            return callback(fixture, point, output.normal, fraction);
         }
         return input.maxFraction;
      };
      var input = new b2RayCastInput(point1, point2);
      broadPhase.RayCast(RayCastWrapper, input);
   }
   b2World.prototype.RayCastOne = function (point1, point2) {
      var __this = this;
      var result;

      function RayCastOneWrapper(fixture, point, normal, fraction) {
         if (fraction === undefined) fraction = 0;
         result = fixture;
         return fraction;
      };
      __this.RayCast(RayCastOneWrapper, point1, point2);
      return result;
   }
   b2World.prototype.RayCastAll = function (point1, point2) {
      var __this = this;
      var result = new Vector();

      function RayCastAllWrapper(fixture, point, normal, fraction) {
         if (fraction === undefined) fraction = 0;
         result[result.length] = fixture;
         return 1;
      };
      __this.RayCast(RayCastAllWrapper, point1, point2);
      return result;
   }
   b2World.prototype.GetBodyList = function () {
      return this.m_bodyList;
   }
   b2World.prototype.GetJointList = function () {
      return this.m_jointList;
   }
   b2World.prototype.GetContactList = function () {
      return this.m_contactList;
   }
   b2World.prototype.IsLocked = function () {
      return (this.m_flags & b2World.e_locked) > 0;
   }
   b2World.prototype.Solve = function (step) {
      var b;
      for (var controller = this.m_controllerList; controller; controller = controller.m_next) {
         controller.Step(step);
      }
      var island = this.m_island;
      island.Initialize(this.m_bodyCount, this.m_contactCount, this.m_jointCount, null, this.m_contactManager.m_contactListener, this.m_contactSolver);
      for (b = this.m_bodyList;
      b; b = b.m_next) {
         b.m_flags &= ~b2Body.e_islandFlag;
      }
      for (var c = this.m_contactList; c; c = c.m_next) {
         c.m_flags &= ~b2Contact.e_islandFlag;
      }
      for (var j = this.m_jointList; j; j = j.m_next) {
         j.m_islandFlag = false;
      }
      var stackSize = parseInt(this.m_bodyCount);
      var stack = this.s_stack;
      for (var seed = this.m_bodyList; seed; seed = seed.m_next) {
         if (seed.m_flags & b2Body.e_islandFlag) {
            continue;
         }
         if (seed.IsAwake() == false || seed.IsActive() == false) {
            continue;
         }
         if (seed.GetType() == b2Body.b2_staticBody) {
            continue;
         }
         island.Clear();
         var stackCount = 0;
         stack[stackCount++] = seed;
         seed.m_flags |= b2Body.e_islandFlag;
         while (stackCount > 0) {
            b = stack[--stackCount];
            island.AddBody(b);
            if (b.IsAwake() == false) {
               b.SetAwake(true);
            }
            if (b.GetType() == b2Body.b2_staticBody) {
               continue;
            }
            var other;
            for (var ce = b.m_contactList; ce; ce = ce.next) {
               if (ce.contact.m_flags & b2Contact.e_islandFlag) {
                  continue;
               }
               if (ce.contact.IsSensor() == true || ce.contact.IsEnabled() == false || ce.contact.IsTouching() == false) {
                  continue;
               }
               island.AddContact(ce.contact);
               ce.contact.m_flags |= b2Contact.e_islandFlag;
               other = ce.other;
               if (other.m_flags & b2Body.e_islandFlag) {
                  continue;
               }
               stack[stackCount++] = other;
               other.m_flags |= b2Body.e_islandFlag;
            }
            for (var jn = b.m_jointList; jn; jn = jn.next) {
               if (jn.joint.m_islandFlag == true) {
                  continue;
               }
               other = jn.other;
               if (other.IsActive() == false) {
                  continue;
               }
               island.AddJoint(jn.joint);
               jn.joint.m_islandFlag = true;
               if (other.m_flags & b2Body.e_islandFlag) {
                  continue;
               }
               stack[stackCount++] = other;
               other.m_flags |= b2Body.e_islandFlag;
            }
         }
         island.Solve(step, this.m_gravity, this.m_allowSleep);
         for (var i = 0; i < island.m_bodyCount; ++i) {
            b = island.m_bodies[i];
            if (b.GetType() == b2Body.b2_staticBody) {
               b.m_flags &= ~b2Body.e_islandFlag;
            }
         }
      }
      for (i = 0;
      i < stack.length; ++i) {
         if (!stack[i]) break;
         stack[i] = null;
      }
      for (b = this.m_bodyList;
      b; b = b.m_next) {
         if (b.IsAwake() == false || b.IsActive() == false) {
            continue;
         }
         if (b.GetType() == b2Body.b2_staticBody) {
            continue;
         }
         b.SynchronizeFixtures();
      }
      this.m_contactManager.FindNewContacts();
   }
   b2World.prototype.SolveTOI = function (step) {
      var b;
      var fA;
      var fB;
      var bA;
      var bB;
      var cEdge;
      var j;
      var island = this.m_island;
      island.Initialize(this.m_bodyCount, b2Settings.b2_maxTOIContactsPerIsland, b2Settings.b2_maxTOIJointsPerIsland, null, this.m_contactManager.m_contactListener, this.m_contactSolver);
      var queue = b2World.s_queue;
      for (b = this.m_bodyList;
      b; b = b.m_next) {
         b.m_flags &= ~b2Body.e_islandFlag;
         b.m_sweep.t0 = 0.0;
      }
      var c;
      for (c = this.m_contactList;
      c; c = c.m_next) {
         c.m_flags &= ~ (b2Contact.e_toiFlag | b2Contact.e_islandFlag);
      }
      for (j = this.m_jointList;
      j; j = j.m_next) {
         j.m_islandFlag = false;
      }
      for (;;) {
         var minContact = null;
         var minTOI = 1.0;
         for (c = this.m_contactList;
         c; c = c.m_next) {
            if (c.IsSensor() == true || c.IsEnabled() == false || c.IsContinuous() == false) {
               continue;
            }
            var toi = 1.0;
            if (c.m_flags & b2Contact.e_toiFlag) {
               toi = c.m_toi;
            }
            else {
               fA = c.m_fixtureA;
               fB = c.m_fixtureB;
               bA = fA.m_body;
               bB = fB.m_body;
               if ((bA.GetType() != b2Body.b2_dynamicBody || bA.IsAwake() == false) && (bB.GetType() != b2Body.b2_dynamicBody || bB.IsAwake() == false)) {
                  continue;
               }
               var t0 = bA.m_sweep.t0;
               if (bA.m_sweep.t0 < bB.m_sweep.t0) {
                  t0 = bB.m_sweep.t0;
                  bA.m_sweep.Advance(t0);
               }
               else if (bB.m_sweep.t0 < bA.m_sweep.t0) {
                  t0 = bA.m_sweep.t0;
                  bB.m_sweep.Advance(t0);
               }
               toi = c.ComputeTOI(bA.m_sweep, bB.m_sweep);
               b2Settings.b2Assert(0.0 <= toi && toi <= 1.0);
               if (toi > 0.0 && toi < 1.0) {
                  toi = (1.0 - toi) * t0 + toi;
                  if (toi > 1) toi = 1;
               }
               c.m_toi = toi;
               c.m_flags |= b2Contact.e_toiFlag;
            }
            if (Number.MIN_VALUE < toi && toi < minTOI) {
               minContact = c;
               minTOI = toi;
            }
         }
         if (minContact == null || 1.0 - 100.0 * Number.MIN_VALUE < minTOI) {
            break;
         }
         fA = minContact.m_fixtureA;
         fB = minContact.m_fixtureB;
         bA = fA.m_body;
         bB = fB.m_body;
         b2World.s_backupA.Set(bA.m_sweep);
         b2World.s_backupB.Set(bB.m_sweep);
         bA.Advance(minTOI);
         bB.Advance(minTOI);
         minContact.Update(this.m_contactManager.m_contactListener);
         minContact.m_flags &= ~b2Contact.e_toiFlag;
         if (minContact.IsSensor() == true || minContact.IsEnabled() == false) {
            bA.m_sweep.Set(b2World.s_backupA);
            bB.m_sweep.Set(b2World.s_backupB);
            bA.SynchronizeTransform();
            bB.SynchronizeTransform();
            continue;
         }
         if (minContact.IsTouching() == false) {
            continue;
         }
         var seed = bA;
         if (seed.GetType() != b2Body.b2_dynamicBody) {
            seed = bB;
         }
         island.Clear();
         var queueStart = 0;
         var queueSize = 0;
         queue[queueStart + queueSize++] = seed;
         seed.m_flags |= b2Body.e_islandFlag;
         while (queueSize > 0) {
            b = queue[queueStart++];
            --queueSize;
            island.AddBody(b);
            if (b.IsAwake() == false) {
               b.SetAwake(true);
            }
            if (b.GetType() != b2Body.b2_dynamicBody) {
               continue;
            }
            for (cEdge = b.m_contactList;
            cEdge; cEdge = cEdge.next) {
               if (island.m_contactCount == island.m_contactCapacity) {
                  break;
               }
               if (cEdge.contact.m_flags & b2Contact.e_islandFlag) {
                  continue;
               }
               if (cEdge.contact.IsSensor() == true || cEdge.contact.IsEnabled() == false || cEdge.contact.IsTouching() == false) {
                  continue;
               }
               island.AddContact(cEdge.contact);
               cEdge.contact.m_flags |= b2Contact.e_islandFlag;
               var other = cEdge.other;
               if (other.m_flags & b2Body.e_islandFlag) {
                  continue;
               }
               if (other.GetType() != b2Body.b2_staticBody) {
                  other.Advance(minTOI);
                  other.SetAwake(true);
               }
               queue[queueStart + queueSize] = other;
               ++queueSize;
               other.m_flags |= b2Body.e_islandFlag;
            }
            for (var jEdge = b.m_jointList; jEdge; jEdge = jEdge.next) {
               if (island.m_jointCount == island.m_jointCapacity) continue;
               if (jEdge.joint.m_islandFlag == true) continue;
               other = jEdge.other;
               if (other.IsActive() == false) {
                  continue;
               }
               island.AddJoint(jEdge.joint);
               jEdge.joint.m_islandFlag = true;
               if (other.m_flags & b2Body.e_islandFlag) continue;
               if (other.GetType() != b2Body.b2_staticBody) {
                  other.Advance(minTOI);
                  other.SetAwake(true);
               }
               queue[queueStart + queueSize] = other;
               ++queueSize;
               other.m_flags |= b2Body.e_islandFlag;
            }
         }
         var subStep = b2World.s_timestep;
         subStep.warmStarting = false;
         subStep.dt = (1.0 - minTOI) * step.dt;
         subStep.inv_dt = 1.0 / subStep.dt;
         subStep.dtRatio = 0.0;
         subStep.velocityIterations = step.velocityIterations;
         subStep.positionIterations = step.positionIterations;
         island.SolveTOI(subStep);
         var i = 0;
         for (i = 0;
         i < island.m_bodyCount; ++i) {
            b = island.m_bodies[i];
            b.m_flags &= ~b2Body.e_islandFlag;
            if (b.IsAwake() == false) {
               continue;
            }
            if (b.GetType() != b2Body.b2_dynamicBody) {
               continue;
            }
            b.SynchronizeFixtures();
            for (cEdge = b.m_contactList;
            cEdge; cEdge = cEdge.next) {
               cEdge.contact.m_flags &= ~b2Contact.e_toiFlag;
            }
         }
         for (i = 0;
         i < island.m_contactCount; ++i) {
            c = island.m_contacts[i];
            c.m_flags &= ~ (b2Contact.e_toiFlag | b2Contact.e_islandFlag);
         }
         for (i = 0;
         i < island.m_jointCount; ++i) {
            j = island.m_joints[i];
            j.m_islandFlag = false;
         }
         this.m_contactManager.FindNewContacts();
      }
   }
   b2World.prototype.DrawJoint = function (joint) {
      var b1 = joint.GetBodyA();
      var b2 = joint.GetBodyB();
      var xf1 = b1.m_xf;
      var xf2 = b2.m_xf;
      var x1 = xf1.position;
      var x2 = xf2.position;
      var p1 = joint.GetAnchorA();
      var p2 = joint.GetAnchorB();
      var color = b2World.s_jointColor;
      switch (joint.m_type) {
      case b2Joint.e_distanceJoint:
         this.m_debugDraw.DrawSegment(p1, p2, color);
         break;
      case b2Joint.e_pulleyJoint:
         {
            var pulley = ((joint instanceof b2PulleyJoint ? joint : null));
            var s1 = pulley.GetGroundAnchorA();
            var s2 = pulley.GetGroundAnchorB();
            this.m_debugDraw.DrawSegment(s1, p1, color);
            this.m_debugDraw.DrawSegment(s2, p2, color);
            this.m_debugDraw.DrawSegment(s1, s2, color);
         }
         break;
      case b2Joint.e_mouseJoint:
         this.m_debugDraw.DrawSegment(p1, p2, color);
         break;
      default:
         if (b1 != this.m_groundBody) this.m_debugDraw.DrawSegment(x1, p1, color);
         this.m_debugDraw.DrawSegment(p1, p2, color);
         if (b2 != this.m_groundBody) this.m_debugDraw.DrawSegment(x2, p2, color);
      }
   }
   b2World.prototype.DrawShape = function (shape, xf, color) {
      switch (shape.m_type) {
      case b2Shape.e_circleShape:
         {
            var circle = ((shape instanceof b2CircleShape ? shape : null));
            var center = b2Math.MulX(xf, circle.m_p);
            var radius = circle.m_radius;
            var axis = xf.R.col1;
            this.m_debugDraw.DrawSolidCircle(center, radius, axis, color);
         }
         break;
      case b2Shape.e_polygonShape:
         {
            var i = 0;
            var poly = ((shape instanceof b2PolygonShape ? shape : null));
            var vertexCount = parseInt(poly.GetVertexCount());
            var localVertices = poly.GetVertices();
            var vertices = new Vector(vertexCount);
            for (i = 0;
            i < vertexCount; ++i) {
               vertices[i] = b2Math.MulX(xf, localVertices[i]);
            }
            this.m_debugDraw.DrawSolidPolygon(vertices, vertexCount, color);
         }
         break;
      case b2Shape.e_edgeShape:
         {
            var edge = (shape instanceof b2EdgeShape ? shape : null);
            this.m_debugDraw.DrawSegment(b2Math.MulX(xf, edge.GetVertex1()), b2Math.MulX(xf, edge.GetVertex2()), color);
         }
         break;
      }
   }
   Box2D.postDefs.push(function () {
      Box2D.Dynamics.b2World.s_timestep2 = new b2TimeStep();
      Box2D.Dynamics.b2World.s_xf = new b2Transform();
      Box2D.Dynamics.b2World.s_backupA = new b2Sweep();
      Box2D.Dynamics.b2World.s_backupB = new b2Sweep();
      Box2D.Dynamics.b2World.s_timestep = new b2TimeStep();
      Box2D.Dynamics.b2World.s_queue = new Vector();
      Box2D.Dynamics.b2World.s_jointColor = new b2Color(0.5, 0.8, 0.8);
      Box2D.Dynamics.b2World.e_newFixture = 0x0001;
      Box2D.Dynamics.b2World.e_locked = 0x0002;
   });
})();
(function () {
   var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
      b2EdgeChainDef = Box2D.Collision.Shapes.b2EdgeChainDef,
      b2EdgeShape = Box2D.Collision.Shapes.b2EdgeShape,
      b2MassData = Box2D.Collision.Shapes.b2MassData,
      b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
      b2Shape = Box2D.Collision.Shapes.b2Shape,
      b2CircleContact = Box2D.Dynamics.Contacts.b2CircleContact,
      b2Contact = Box2D.Dynamics.Contacts.b2Contact,
      b2ContactConstraint = Box2D.Dynamics.Contacts.b2ContactConstraint,
      b2ContactConstraintPoint = Box2D.Dynamics.Contacts.b2ContactConstraintPoint,
      b2ContactEdge = Box2D.Dynamics.Contacts.b2ContactEdge,
      b2ContactFactory = Box2D.Dynamics.Contacts.b2ContactFactory,
      b2ContactRegister = Box2D.Dynamics.Contacts.b2ContactRegister,
      b2ContactResult = Box2D.Dynamics.Contacts.b2ContactResult,
      b2ContactSolver = Box2D.Dynamics.Contacts.b2ContactSolver,
      b2EdgeAndCircleContact = Box2D.Dynamics.Contacts.b2EdgeAndCircleContact,
      b2NullContact = Box2D.Dynamics.Contacts.b2NullContact,
      b2PolyAndCircleContact = Box2D.Dynamics.Contacts.b2PolyAndCircleContact,
      b2PolyAndEdgeContact = Box2D.Dynamics.Contacts.b2PolyAndEdgeContact,
      b2PolygonContact = Box2D.Dynamics.Contacts.b2PolygonContact,
      b2PositionSolverManifold = Box2D.Dynamics.Contacts.b2PositionSolverManifold,
      b2Body = Box2D.Dynamics.b2Body,
      b2BodyDef = Box2D.Dynamics.b2BodyDef,
      b2ContactFilter = Box2D.Dynamics.b2ContactFilter,
      b2ContactImpulse = Box2D.Dynamics.b2ContactImpulse,
      b2ContactListener = Box2D.Dynamics.b2ContactListener,
      b2ContactManager = Box2D.Dynamics.b2ContactManager,
      b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
      b2DestructionListener = Box2D.Dynamics.b2DestructionListener,
      b2FilterData = Box2D.Dynamics.b2FilterData,
      b2Fixture = Box2D.Dynamics.b2Fixture,
      b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
      b2Island = Box2D.Dynamics.b2Island,
      b2TimeStep = Box2D.Dynamics.b2TimeStep,
      b2World = Box2D.Dynamics.b2World,
      b2Color = Box2D.Common.b2Color,
      b2internal = Box2D.Common.b2internal,
      b2Settings = Box2D.Common.b2Settings,
      b2Mat22 = Box2D.Common.Math.b2Mat22,
      b2Mat33 = Box2D.Common.Math.b2Mat33,
      b2Math = Box2D.Common.Math.b2Math,
      b2Sweep = Box2D.Common.Math.b2Sweep,
      b2Transform = Box2D.Common.Math.b2Transform,
      b2Vec2 = Box2D.Common.Math.b2Vec2,
      b2Vec3 = Box2D.Common.Math.b2Vec3,
      b2AABB = Box2D.Collision.b2AABB,
      b2Bound = Box2D.Collision.b2Bound,
      b2BoundValues = Box2D.Collision.b2BoundValues,
      b2Collision = Box2D.Collision.b2Collision,
      b2ContactID = Box2D.Collision.b2ContactID,
      b2ContactPoint = Box2D.Collision.b2ContactPoint,
      b2Distance = Box2D.Collision.b2Distance,
      b2DistanceInput = Box2D.Collision.b2DistanceInput,
      b2DistanceOutput = Box2D.Collision.b2DistanceOutput,
      b2DistanceProxy = Box2D.Collision.b2DistanceProxy,
      b2DynamicTree = Box2D.Collision.b2DynamicTree,
      b2DynamicTreeBroadPhase = Box2D.Collision.b2DynamicTreeBroadPhase,
      b2DynamicTreeNode = Box2D.Collision.b2DynamicTreeNode,
      b2DynamicTreePair = Box2D.Collision.b2DynamicTreePair,
      b2Manifold = Box2D.Collision.b2Manifold,
      b2ManifoldPoint = Box2D.Collision.b2ManifoldPoint,
      b2Point = Box2D.Collision.b2Point,
      b2RayCastInput = Box2D.Collision.b2RayCastInput,
      b2RayCastOutput = Box2D.Collision.b2RayCastOutput,
      b2Segment = Box2D.Collision.b2Segment,
      b2SeparationFunction = Box2D.Collision.b2SeparationFunction,
      b2Simplex = Box2D.Collision.b2Simplex,
      b2SimplexCache = Box2D.Collision.b2SimplexCache,
      b2SimplexVertex = Box2D.Collision.b2SimplexVertex,
      b2TimeOfImpact = Box2D.Collision.b2TimeOfImpact,
      b2TOIInput = Box2D.Collision.b2TOIInput,
      b2WorldManifold = Box2D.Collision.b2WorldManifold,
      ClipVertex = Box2D.Collision.ClipVertex,
      Features = Box2D.Collision.Features,
      IBroadPhase = Box2D.Collision.IBroadPhase;

   Box2D.inherit(b2CircleContact, Box2D.Dynamics.Contacts.b2Contact);
   b2CircleContact.prototype.__super = Box2D.Dynamics.Contacts.b2Contact.prototype;
   b2CircleContact.b2CircleContact = function () {
      Box2D.Dynamics.Contacts.b2Contact.b2Contact.apply(this, arguments);
   };
   b2CircleContact.Create = function (allocator) {
      return new b2CircleContact();
   }
   b2CircleContact.Destroy = function (contact, allocator) {}
   b2CircleContact.prototype.Reset = function (fixtureA, fixtureB) {
      this.__super.Reset.call(this, fixtureA, fixtureB);
   }
   b2CircleContact.prototype.Evaluate = function () {
      var bA = this.m_fixtureA.GetBody();
      var bB = this.m_fixtureB.GetBody();
      b2Collision.CollideCircles(this.m_manifold, (this.m_fixtureA.GetShape() instanceof b2CircleShape ? this.m_fixtureA.GetShape() : null), bA.m_xf, (this.m_fixtureB.GetShape() instanceof b2CircleShape ? this.m_fixtureB.GetShape() : null), bB.m_xf);
   }
   b2Contact.b2Contact = function () {
      this.m_nodeA = new b2ContactEdge();
      this.m_nodeB = new b2ContactEdge();
      this.m_manifold = new b2Manifold();
      this.m_oldManifold = new b2Manifold();
   };
   b2Contact.prototype.GetManifold = function () {
      return this.m_manifold;
   }
   b2Contact.prototype.GetWorldManifold = function (worldManifold) {
      var bodyA = this.m_fixtureA.GetBody();
      var bodyB = this.m_fixtureB.GetBody();
      var shapeA = this.m_fixtureA.GetShape();
      var shapeB = this.m_fixtureB.GetShape();
      worldManifold.Initialize(this.m_manifold, bodyA.GetTransform(), shapeA.m_radius, bodyB.GetTransform(), shapeB.m_radius);
   }
   b2Contact.prototype.IsTouching = function () {
      return (this.m_flags & b2Contact.e_touchingFlag) == b2Contact.e_touchingFlag;
   }
   b2Contact.prototype.IsContinuous = function () {
      return (this.m_flags & b2Contact.e_continuousFlag) == b2Contact.e_continuousFlag;
   }
   b2Contact.prototype.SetSensor = function (sensor) {
      if (sensor) {
         this.m_flags |= b2Contact.e_sensorFlag;
      }
      else {
         this.m_flags &= ~b2Contact.e_sensorFlag;
      }
   }
   b2Contact.prototype.IsSensor = function () {
      return (this.m_flags & b2Contact.e_sensorFlag) == b2Contact.e_sensorFlag;
   }
   b2Contact.prototype.SetEnabled = function (flag) {
      if (flag) {
         this.m_flags |= b2Contact.e_enabledFlag;
      }
      else {
         this.m_flags &= ~b2Contact.e_enabledFlag;
      }
   }
   b2Contact.prototype.IsEnabled = function () {
      return (this.m_flags & b2Contact.e_enabledFlag) == b2Contact.e_enabledFlag;
   }
   b2Contact.prototype.GetNext = function () {
      return this.m_next;
   }
   b2Contact.prototype.GetFixtureA = function () {
      return this.m_fixtureA;
   }
   b2Contact.prototype.GetFixtureB = function () {
      return this.m_fixtureB;
   }
   b2Contact.prototype.FlagForFiltering = function () {
      this.m_flags |= b2Contact.e_filterFlag;
   }
   b2Contact.prototype.b2Contact = function () {}
   b2Contact.prototype.Reset = function (fixtureA, fixtureB) {
      if (fixtureA === undefined) fixtureA = null;
      if (fixtureB === undefined) fixtureB = null;
      this.m_flags = b2Contact.e_enabledFlag;
      if (!fixtureA || !fixtureB) {
         this.m_fixtureA = null;
         this.m_fixtureB = null;
         return;
      }
      if (fixtureA.IsSensor() || fixtureB.IsSensor()) {
         this.m_flags |= b2Contact.e_sensorFlag;
      }
      var bodyA = fixtureA.GetBody();
      var bodyB = fixtureB.GetBody();
      if (bodyA.GetType() != b2Body.b2_dynamicBody || bodyA.IsBullet() || bodyB.GetType() != b2Body.b2_dynamicBody || bodyB.IsBullet()) {
         this.m_flags |= b2Contact.e_continuousFlag;
      }
      this.m_fixtureA = fixtureA;
      this.m_fixtureB = fixtureB;
      this.m_manifold.m_pointCount = 0;
      this.m_prev = null;
      this.m_next = null;
      this.m_nodeA.contact = null;
      this.m_nodeA.prev = null;
      this.m_nodeA.next = null;
      this.m_nodeA.other = null;
      this.m_nodeB.contact = null;
      this.m_nodeB.prev = null;
      this.m_nodeB.next = null;
      this.m_nodeB.other = null;
   }
   b2Contact.prototype.Update = function (listener) {
      var tManifold = this.m_oldManifold;
      this.m_oldManifold = this.m_manifold;
      this.m_manifold = tManifold;
      this.m_flags |= b2Contact.e_enabledFlag;
      var touching = false;
      var wasTouching = (this.m_flags & b2Contact.e_touchingFlag) == b2Contact.e_touchingFlag;
      var bodyA = this.m_fixtureA.m_body;
      var bodyB = this.m_fixtureB.m_body;
      var aabbOverlap = this.m_fixtureA.m_aabb.TestOverlap(this.m_fixtureB.m_aabb);
      if (this.m_flags & b2Contact.e_sensorFlag) {
         if (aabbOverlap) {
            var shapeA = this.m_fixtureA.GetShape();
            var shapeB = this.m_fixtureB.GetShape();
            var xfA = bodyA.GetTransform();
            var xfB = bodyB.GetTransform();
            touching = b2Shape.TestOverlap(shapeA, xfA, shapeB, xfB);
         }
         this.m_manifold.m_pointCount = 0;
      }
      else {
         if (bodyA.GetType() != b2Body.b2_dynamicBody || bodyA.IsBullet() || bodyB.GetType() != b2Body.b2_dynamicBody || bodyB.IsBullet()) {
            this.m_flags |= b2Contact.e_continuousFlag;
         }
         else {
            this.m_flags &= ~b2Contact.e_continuousFlag;
         }
         if (aabbOverlap) {
            this.Evaluate();
            touching = this.m_manifold.m_pointCount > 0;
            for (var i = 0; i < this.m_manifold.m_pointCount; ++i) {
               var mp2 = this.m_manifold.m_points[i];
               mp2.m_normalImpulse = 0.0;
               mp2.m_tangentImpulse = 0.0;
               var id2 = mp2.m_id;
               for (var j = 0; j < this.m_oldManifold.m_pointCount; ++j) {
                  var mp1 = this.m_oldManifold.m_points[j];
                  if (mp1.m_id.key == id2.key) {
                     mp2.m_normalImpulse = mp1.m_normalImpulse;
                     mp2.m_tangentImpulse = mp1.m_tangentImpulse;
                     break;
                  }
               }
            }
         }
         else {
            this.m_manifold.m_pointCount = 0;
         }
         if (touching != wasTouching) {
            bodyA.SetAwake(true);
            bodyB.SetAwake(true);
         }
      }
      if (touching) {
         this.m_flags |= b2Contact.e_touchingFlag;
      }
      else {
         this.m_flags &= ~b2Contact.e_touchingFlag;
      }
      if (wasTouching == false && touching == true) {
         listener.BeginContact(this);
      }
      if (wasTouching == true && touching == false) {
         listener.EndContact(this);
      }
      if ((this.m_flags & b2Contact.e_sensorFlag) == 0) {
         listener.PreSolve(this, this.m_oldManifold);
      }
   }
   b2Contact.prototype.Evaluate = function () {}
   b2Contact.prototype.ComputeTOI = function (sweepA, sweepB) {
      b2Contact.s_input.proxyA.Set(this.m_fixtureA.GetShape());
      b2Contact.s_input.proxyB.Set(this.m_fixtureB.GetShape());
      b2Contact.s_input.sweepA = sweepA;
      b2Contact.s_input.sweepB = sweepB;
      b2Contact.s_input.tolerance = b2Settings.b2_linearSlop;
      return b2TimeOfImpact.TimeOfImpact(b2Contact.s_input);
   }
   Box2D.postDefs.push(function () {
      Box2D.Dynamics.Contacts.b2Contact.e_sensorFlag = 0x0001;
      Box2D.Dynamics.Contacts.b2Contact.e_continuousFlag = 0x0002;
      Box2D.Dynamics.Contacts.b2Contact.e_islandFlag = 0x0004;
      Box2D.Dynamics.Contacts.b2Contact.e_toiFlag = 0x0008;
      Box2D.Dynamics.Contacts.b2Contact.e_touchingFlag = 0x0010;
      Box2D.Dynamics.Contacts.b2Contact.e_enabledFlag = 0x0020;
      Box2D.Dynamics.Contacts.b2Contact.e_filterFlag = 0x0040;
      Box2D.Dynamics.Contacts.b2Contact.s_input = new b2TOIInput();
   });
   b2ContactConstraint.b2ContactConstraint = function () {
      this.localPlaneNormal = new b2Vec2();
      this.localPoint = new b2Vec2();
      this.normal = new b2Vec2();
      this.normalMass = new b2Mat22();
      this.K = new b2Mat22();
   };
   b2ContactConstraint.prototype.b2ContactConstraint = function () {
      this.points = new Vector(b2Settings.b2_maxManifoldPoints);
      for (var i = 0; i < b2Settings.b2_maxManifoldPoints; i++) {
         this.points[i] = new b2ContactConstraintPoint();
      }
   }
   b2ContactConstraintPoint.b2ContactConstraintPoint = function () {
      this.localPoint = new b2Vec2();
      this.rA = new b2Vec2();
      this.rB = new b2Vec2();
   };
   b2ContactEdge.b2ContactEdge = function () {};
   b2ContactFactory.b2ContactFactory = function () {};
   b2ContactFactory.prototype.b2ContactFactory = function (allocator) {
      this.m_allocator = allocator;
      this.InitializeRegisters();
   }
   b2ContactFactory.prototype.AddType = function (createFcn, destroyFcn, type1, type2) {
      if (type1 === undefined) type1 = 0;
      if (type2 === undefined) type2 = 0;
      this.m_registers[type1][type2].createFcn = createFcn;
      this.m_registers[type1][type2].destroyFcn = destroyFcn;
      this.m_registers[type1][type2].primary = true;
      if (type1 != type2) {
         this.m_registers[type2][type1].createFcn = createFcn;
         this.m_registers[type2][type1].destroyFcn = destroyFcn;
         this.m_registers[type2][type1].primary = false;
      }
   }
   b2ContactFactory.prototype.InitializeRegisters = function () {
      this.m_registers = new Vector(b2Shape.e_shapeTypeCount);
      for (var i = 0; i < b2Shape.e_shapeTypeCount; i++) {
         this.m_registers[i] = new Vector(b2Shape.e_shapeTypeCount);
         for (var j = 0; j < b2Shape.e_shapeTypeCount; j++) {
            this.m_registers[i][j] = new b2ContactRegister();
         }
      }
      this.AddType(b2CircleContact.Create, b2CircleContact.Destroy, b2Shape.e_circleShape, b2Shape.e_circleShape);
      this.AddType(b2PolyAndCircleContact.Create, b2PolyAndCircleContact.Destroy, b2Shape.e_polygonShape, b2Shape.e_circleShape);
      this.AddType(b2PolygonContact.Create, b2PolygonContact.Destroy, b2Shape.e_polygonShape, b2Shape.e_polygonShape);
      this.AddType(b2EdgeAndCircleContact.Create, b2EdgeAndCircleContact.Destroy, b2Shape.e_edgeShape, b2Shape.e_circleShape);
      this.AddType(b2PolyAndEdgeContact.Create, b2PolyAndEdgeContact.Destroy, b2Shape.e_polygonShape, b2Shape.e_edgeShape);
   }
   b2ContactFactory.prototype.Create = function (fixtureA, fixtureB) {
      var type1 = parseInt(fixtureA.GetType());
      var type2 = parseInt(fixtureB.GetType());
      var reg = this.m_registers[type1][type2];
      var c;
      if (reg.pool) {
         c = reg.pool;
         reg.pool = c.m_next;
         reg.poolCount--;
         c.Reset(fixtureA, fixtureB);
         return c;
      }
      var createFcn = reg.createFcn;
      if (createFcn != null) {
         if (reg.primary) {
            c = createFcn(this.m_allocator);
            c.Reset(fixtureA, fixtureB);
            return c;
         }
         else {
            c = createFcn(this.m_allocator);
            c.Reset(fixtureB, fixtureA);
            return c;
         }
      }
      else {
         return null;
      }
   }
   b2ContactFactory.prototype.Destroy = function (contact) {
      if (contact.m_manifold.m_pointCount > 0) {
         contact.m_fixtureA.m_body.SetAwake(true);
         contact.m_fixtureB.m_body.SetAwake(true);
      }
      var type1 = parseInt(contact.m_fixtureA.GetType());
      var type2 = parseInt(contact.m_fixtureB.GetType());
      var reg = this.m_registers[type1][type2];
      if (true) {
         reg.poolCount++;
         contact.m_next = reg.pool;
         reg.pool = contact;
      }
      var destroyFcn = reg.destroyFcn;
      destroyFcn(contact, this.m_allocator);
   }
   b2ContactRegister.b2ContactRegister = function () {};
   b2ContactResult.b2ContactResult = function () {
      this.position = new b2Vec2();
      this.normal = new b2Vec2();
      this.id = new b2ContactID();
   };
   b2ContactSolver.b2ContactSolver = function () {
      this.m_step = new b2TimeStep();
      this.m_constraints = new Vector();
   };
   b2ContactSolver.prototype.b2ContactSolver = function () {}
   b2ContactSolver.prototype.Initialize = function (step, contacts, contactCount, allocator) {
      if (contactCount === undefined) contactCount = 0;
      var contact;
      this.m_step.Set(step);
      this.m_allocator = allocator;
      var i = 0;
      var tVec;
      var tMat;
      this.m_constraintCount = contactCount;
      while (this.m_constraints.length < this.m_constraintCount) {
         this.m_constraints[this.m_constraints.length] = new b2ContactConstraint();
      }
      for (i = 0;
      i < contactCount; ++i) {
         contact = contacts[i];
         var fixtureA = contact.m_fixtureA;
         var fixtureB = contact.m_fixtureB;
         var shapeA = fixtureA.m_shape;
         var shapeB = fixtureB.m_shape;
         var radiusA = shapeA.m_radius;
         var radiusB = shapeB.m_radius;
         var bodyA = fixtureA.m_body;
         var bodyB = fixtureB.m_body;
         var manifold = contact.GetManifold();
         var friction = b2Settings.b2MixFriction(fixtureA.GetFriction(), fixtureB.GetFriction());
         var restitution = b2Settings.b2MixRestitution(fixtureA.GetRestitution(), fixtureB.GetRestitution());
         var vAX = bodyA.m_linearVelocity.x;
         var vAY = bodyA.m_linearVelocity.y;
         var vBX = bodyB.m_linearVelocity.x;
         var vBY = bodyB.m_linearVelocity.y;
         var wA = bodyA.m_angularVelocity;
         var wB = bodyB.m_angularVelocity;
         b2Settings.b2Assert(manifold.m_pointCount > 0);
         b2ContactSolver.s_worldManifold.Initialize(manifold, bodyA.m_xf, radiusA, bodyB.m_xf, radiusB);
         var normalX = b2ContactSolver.s_worldManifold.m_normal.x;
         var normalY = b2ContactSolver.s_worldManifold.m_normal.y;
         var cc = this.m_constraints[i];
         cc.bodyA = bodyA;
         cc.bodyB = bodyB;
         cc.manifold = manifold;
         cc.normal.x = normalX;
         cc.normal.y = normalY;
         cc.pointCount = manifold.m_pointCount;
         cc.friction = friction;
         cc.restitution = restitution;
         cc.localPlaneNormal.x = manifold.m_localPlaneNormal.x;
         cc.localPlaneNormal.y = manifold.m_localPlaneNormal.y;
         cc.localPoint.x = manifold.m_localPoint.x;
         cc.localPoint.y = manifold.m_localPoint.y;
         cc.radius = radiusA + radiusB;
         cc.type = manifold.m_type;
         for (var k = 0; k < cc.pointCount; ++k) {
            var cp = manifold.m_points[k];
            var ccp = cc.points[k];
            ccp.normalImpulse = cp.m_normalImpulse;
            ccp.tangentImpulse = cp.m_tangentImpulse;
            ccp.localPoint.SetV(cp.m_localPoint);
            var rAX = ccp.rA.x = b2ContactSolver.s_worldManifold.m_points[k].x - bodyA.m_sweep.c.x;
            var rAY = ccp.rA.y = b2ContactSolver.s_worldManifold.m_points[k].y - bodyA.m_sweep.c.y;
            var rBX = ccp.rB.x = b2ContactSolver.s_worldManifold.m_points[k].x - bodyB.m_sweep.c.x;
            var rBY = ccp.rB.y = b2ContactSolver.s_worldManifold.m_points[k].y - bodyB.m_sweep.c.y;
            var rnA = rAX * normalY - rAY * normalX;
            var rnB = rBX * normalY - rBY * normalX;
            rnA *= rnA;
            rnB *= rnB;
            var kNormal = bodyA.m_invMass + bodyB.m_invMass + bodyA.m_invI * rnA + bodyB.m_invI * rnB;
            ccp.normalMass = 1.0 / kNormal;
            var kEqualized = bodyA.m_mass * bodyA.m_invMass + bodyB.m_mass * bodyB.m_invMass;
            kEqualized += bodyA.m_mass * bodyA.m_invI * rnA + bodyB.m_mass * bodyB.m_invI * rnB;
            ccp.equalizedMass = 1.0 / kEqualized;
            var tangentX = normalY;
            var tangentY = (-normalX);
            var rtA = rAX * tangentY - rAY * tangentX;
            var rtB = rBX * tangentY - rBY * tangentX;
            rtA *= rtA;
            rtB *= rtB;
            var kTangent = bodyA.m_invMass + bodyB.m_invMass + bodyA.m_invI * rtA + bodyB.m_invI * rtB;
            ccp.tangentMass = 1.0 / kTangent;
            ccp.velocityBias = 0.0;
            var tX = vBX + ((-wB * rBY)) - vAX - ((-wA * rAY));
            var tY = vBY + (wB * rBX) - vAY - (wA * rAX);
            var vRel = cc.normal.x * tX + cc.normal.y * tY;
            if (vRel < (-b2Settings.b2_velocityThreshold)) {
               ccp.velocityBias += (-cc.restitution * vRel);
            }
         }
         if (cc.pointCount == 2) {
            var ccp1 = cc.points[0];
            var ccp2 = cc.points[1];
            var invMassA = bodyA.m_invMass;
            var invIA = bodyA.m_invI;
            var invMassB = bodyB.m_invMass;
            var invIB = bodyB.m_invI;
            var rn1A = ccp1.rA.x * normalY - ccp1.rA.y * normalX;
            var rn1B = ccp1.rB.x * normalY - ccp1.rB.y * normalX;
            var rn2A = ccp2.rA.x * normalY - ccp2.rA.y * normalX;
            var rn2B = ccp2.rB.x * normalY - ccp2.rB.y * normalX;
            var k11 = invMassA + invMassB + invIA * rn1A * rn1A + invIB * rn1B * rn1B;
            var k22 = invMassA + invMassB + invIA * rn2A * rn2A + invIB * rn2B * rn2B;
            var k12 = invMassA + invMassB + invIA * rn1A * rn2A + invIB * rn1B * rn2B;
            var k_maxConditionNumber = 100.0;
            if (k11 * k11 < k_maxConditionNumber * (k11 * k22 - k12 * k12)) {
               cc.K.col1.Set(k11, k12);
               cc.K.col2.Set(k12, k22);
               cc.K.GetInverse(cc.normalMass);
            }
            else {
               cc.pointCount = 1;
            }
         }
      }
   }
   b2ContactSolver.prototype.InitVelocityConstraints = function (step) {
      var tVec;
      var tVec2;
      var tMat;
      for (var i = 0; i < this.m_constraintCount; ++i) {
         var c = this.m_constraints[i];
         var bodyA = c.bodyA;
         var bodyB = c.bodyB;
         var invMassA = bodyA.m_invMass;
         var invIA = bodyA.m_invI;
         var invMassB = bodyB.m_invMass;
         var invIB = bodyB.m_invI;
         var normalX = c.normal.x;
         var normalY = c.normal.y;
         var tangentX = normalY;
         var tangentY = (-normalX);
         var tX = 0;
         var j = 0;
         var tCount = 0;
         if (step.warmStarting) {
            tCount = c.pointCount;
            for (j = 0;
            j < tCount; ++j) {
               var ccp = c.points[j];
               ccp.normalImpulse *= step.dtRatio;
               ccp.tangentImpulse *= step.dtRatio;
               var PX = ccp.normalImpulse * normalX + ccp.tangentImpulse * tangentX;
               var PY = ccp.normalImpulse * normalY + ccp.tangentImpulse * tangentY;
               bodyA.m_angularVelocity -= invIA * (ccp.rA.x * PY - ccp.rA.y * PX);
               bodyA.m_linearVelocity.x -= invMassA * PX;
               bodyA.m_linearVelocity.y -= invMassA * PY;
               bodyB.m_angularVelocity += invIB * (ccp.rB.x * PY - ccp.rB.y * PX);
               bodyB.m_linearVelocity.x += invMassB * PX;
               bodyB.m_linearVelocity.y += invMassB * PY;
            }
         }
         else {
            tCount = c.pointCount;
            for (j = 0;
            j < tCount; ++j) {
               var ccp2 = c.points[j];
               ccp2.normalImpulse = 0.0;
               ccp2.tangentImpulse = 0.0;
            }
         }
      }
   }
   b2ContactSolver.prototype.SolveVelocityConstraints = function () {
      var j = 0;
      var ccp;
      var rAX = 0;
      var rAY = 0;
      var rBX = 0;
      var rBY = 0;
      var dvX = 0;
      var dvY = 0;
      var vn = 0;
      var vt = 0;
      var lambda = 0;
      var maxFriction = 0;
      var newImpulse = 0;
      var PX = 0;
      var PY = 0;
      var dX = 0;
      var dY = 0;
      var P1X = 0;
      var P1Y = 0;
      var P2X = 0;
      var P2Y = 0;
      var tMat;
      var tVec;
      for (var i = 0; i < this.m_constraintCount; ++i) {
         var c = this.m_constraints[i];
         var bodyA = c.bodyA;
         var bodyB = c.bodyB;
         var wA = bodyA.m_angularVelocity;
         var wB = bodyB.m_angularVelocity;
         var vA = bodyA.m_linearVelocity;
         var vB = bodyB.m_linearVelocity;
         var invMassA = bodyA.m_invMass;
         var invIA = bodyA.m_invI;
         var invMassB = bodyB.m_invMass;
         var invIB = bodyB.m_invI;
         var normalX = c.normal.x;
         var normalY = c.normal.y;
         var tangentX = normalY;
         var tangentY = (-normalX);
         var friction = c.friction;
         var tX = 0;
         for (j = 0;
         j < c.pointCount; j++) {
            ccp = c.points[j];
            dvX = vB.x - wB * ccp.rB.y - vA.x + wA * ccp.rA.y;
            dvY = vB.y + wB * ccp.rB.x - vA.y - wA * ccp.rA.x;
            vt = dvX * tangentX + dvY * tangentY;
            lambda = ccp.tangentMass * (-vt);
            maxFriction = friction * ccp.normalImpulse;
            newImpulse = b2Math.Clamp(ccp.tangentImpulse + lambda, (-maxFriction), maxFriction);
            lambda = newImpulse - ccp.tangentImpulse;
            PX = lambda * tangentX;
            PY = lambda * tangentY;
            vA.x -= invMassA * PX;
            vA.y -= invMassA * PY;
            wA -= invIA * (ccp.rA.x * PY - ccp.rA.y * PX);
            vB.x += invMassB * PX;
            vB.y += invMassB * PY;
            wB += invIB * (ccp.rB.x * PY - ccp.rB.y * PX);
            ccp.tangentImpulse = newImpulse;
         }
         var tCount = parseInt(c.pointCount);
         if (c.pointCount == 1) {
            ccp = c.points[0];
            dvX = vB.x + ((-wB * ccp.rB.y)) - vA.x - ((-wA * ccp.rA.y));
            dvY = vB.y + (wB * ccp.rB.x) - vA.y - (wA * ccp.rA.x);
            vn = dvX * normalX + dvY * normalY;
            lambda = (-ccp.normalMass * (vn - ccp.velocityBias));
            newImpulse = ccp.normalImpulse + lambda;
            newImpulse = newImpulse > 0 ? newImpulse : 0.0;
            lambda = newImpulse - ccp.normalImpulse;
            PX = lambda * normalX;
            PY = lambda * normalY;
            vA.x -= invMassA * PX;
            vA.y -= invMassA * PY;
            wA -= invIA * (ccp.rA.x * PY - ccp.rA.y * PX);
            vB.x += invMassB * PX;
            vB.y += invMassB * PY;
            wB += invIB * (ccp.rB.x * PY - ccp.rB.y * PX);
            ccp.normalImpulse = newImpulse;
         }
         else {
            var cp1 = c.points[0];
            var cp2 = c.points[1];
            var aX = cp1.normalImpulse;
            var aY = cp2.normalImpulse;
            var dv1X = vB.x - wB * cp1.rB.y - vA.x + wA * cp1.rA.y;
            var dv1Y = vB.y + wB * cp1.rB.x - vA.y - wA * cp1.rA.x;
            var dv2X = vB.x - wB * cp2.rB.y - vA.x + wA * cp2.rA.y;
            var dv2Y = vB.y + wB * cp2.rB.x - vA.y - wA * cp2.rA.x;
            var vn1 = dv1X * normalX + dv1Y * normalY;
            var vn2 = dv2X * normalX + dv2Y * normalY;
            var bX = vn1 - cp1.velocityBias;
            var bY = vn2 - cp2.velocityBias;
            tMat = c.K;
            bX -= tMat.col1.x * aX + tMat.col2.x * aY;
            bY -= tMat.col1.y * aX + tMat.col2.y * aY;
            var k_errorTol = 0.001;
            for (;;) {
               tMat = c.normalMass;
               var xX = (-(tMat.col1.x * bX + tMat.col2.x * bY));
               var xY = (-(tMat.col1.y * bX + tMat.col2.y * bY));
               if (xX >= 0.0 && xY >= 0.0) {
                  dX = xX - aX;
                  dY = xY - aY;
                  P1X = dX * normalX;
                  P1Y = dX * normalY;
                  P2X = dY * normalX;
                  P2Y = dY * normalY;
                  vA.x -= invMassA * (P1X + P2X);
                  vA.y -= invMassA * (P1Y + P2Y);
                  wA -= invIA * (cp1.rA.x * P1Y - cp1.rA.y * P1X + cp2.rA.x * P2Y - cp2.rA.y * P2X);
                  vB.x += invMassB * (P1X + P2X);
                  vB.y += invMassB * (P1Y + P2Y);
                  wB += invIB * (cp1.rB.x * P1Y - cp1.rB.y * P1X + cp2.rB.x * P2Y - cp2.rB.y * P2X);
                  cp1.normalImpulse = xX;
                  cp2.normalImpulse = xY;
                  break;
               }
               xX = (-cp1.normalMass * bX);
               xY = 0.0;
               vn1 = 0.0;
               vn2 = c.K.col1.y * xX + bY;
               if (xX >= 0.0 && vn2 >= 0.0) {
                  dX = xX - aX;
                  dY = xY - aY;
                  P1X = dX * normalX;
                  P1Y = dX * normalY;
                  P2X = dY * normalX;
                  P2Y = dY * normalY;
                  vA.x -= invMassA * (P1X + P2X);
                  vA.y -= invMassA * (P1Y + P2Y);
                  wA -= invIA * (cp1.rA.x * P1Y - cp1.rA.y * P1X + cp2.rA.x * P2Y - cp2.rA.y * P2X);
                  vB.x += invMassB * (P1X + P2X);
                  vB.y += invMassB * (P1Y + P2Y);
                  wB += invIB * (cp1.rB.x * P1Y - cp1.rB.y * P1X + cp2.rB.x * P2Y - cp2.rB.y * P2X);
                  cp1.normalImpulse = xX;
                  cp2.normalImpulse = xY;
                  break;
               }
               xX = 0.0;
               xY = (-cp2.normalMass * bY);
               vn1 = c.K.col2.x * xY + bX;
               vn2 = 0.0;
               if (xY >= 0.0 && vn1 >= 0.0) {
                  dX = xX - aX;
                  dY = xY - aY;
                  P1X = dX * normalX;
                  P1Y = dX * normalY;
                  P2X = dY * normalX;
                  P2Y = dY * normalY;
                  vA.x -= invMassA * (P1X + P2X);
                  vA.y -= invMassA * (P1Y + P2Y);
                  wA -= invIA * (cp1.rA.x * P1Y - cp1.rA.y * P1X + cp2.rA.x * P2Y - cp2.rA.y * P2X);
                  vB.x += invMassB * (P1X + P2X);
                  vB.y += invMassB * (P1Y + P2Y);
                  wB += invIB * (cp1.rB.x * P1Y - cp1.rB.y * P1X + cp2.rB.x * P2Y - cp2.rB.y * P2X);
                  cp1.normalImpulse = xX;
                  cp2.normalImpulse = xY;
                  break;
               }
               xX = 0.0;
               xY = 0.0;
               vn1 = bX;
               vn2 = bY;
               if (vn1 >= 0.0 && vn2 >= 0.0) {
                  dX = xX - aX;
                  dY = xY - aY;
                  P1X = dX * normalX;
                  P1Y = dX * normalY;
                  P2X = dY * normalX;
                  P2Y = dY * normalY;
                  vA.x -= invMassA * (P1X + P2X);
                  vA.y -= invMassA * (P1Y + P2Y);
                  wA -= invIA * (cp1.rA.x * P1Y - cp1.rA.y * P1X + cp2.rA.x * P2Y - cp2.rA.y * P2X);
                  vB.x += invMassB * (P1X + P2X);
                  vB.y += invMassB * (P1Y + P2Y);
                  wB += invIB * (cp1.rB.x * P1Y - cp1.rB.y * P1X + cp2.rB.x * P2Y - cp2.rB.y * P2X);
                  cp1.normalImpulse = xX;
                  cp2.normalImpulse = xY;
                  break;
               }
               break;
            }
         }
         bodyA.m_angularVelocity = wA;
         bodyB.m_angularVelocity = wB;
      }
   }
   b2ContactSolver.prototype.FinalizeVelocityConstraints = function () {
      for (var i = 0; i < this.m_constraintCount; ++i) {
         var c = this.m_constraints[i];
         var m = c.manifold;
         for (var j = 0; j < c.pointCount; ++j) {
            var point1 = m.m_points[j];
            var point2 = c.points[j];
            point1.m_normalImpulse = point2.normalImpulse;
            point1.m_tangentImpulse = point2.tangentImpulse;
         }
      }
   }
   b2ContactSolver.prototype.SolvePositionConstraints = function (baumgarte) {
      if (baumgarte === undefined) baumgarte = 0;
      var minSeparation = 0.0;
      for (var i = 0; i < this.m_constraintCount; i++) {
         var c = this.m_constraints[i];
         var bodyA = c.bodyA;
         var bodyB = c.bodyB;
         var invMassA = bodyA.m_mass * bodyA.m_invMass;
         var invIA = bodyA.m_mass * bodyA.m_invI;
         var invMassB = bodyB.m_mass * bodyB.m_invMass;
         var invIB = bodyB.m_mass * bodyB.m_invI;
         b2ContactSolver.s_psm.Initialize(c);
         var normal = b2ContactSolver.s_psm.m_normal;
         for (var j = 0; j < c.pointCount; j++) {
            var ccp = c.points[j];
            var point = b2ContactSolver.s_psm.m_points[j];
            var separation = b2ContactSolver.s_psm.m_separations[j];
            var rAX = point.x - bodyA.m_sweep.c.x;
            var rAY = point.y - bodyA.m_sweep.c.y;
            var rBX = point.x - bodyB.m_sweep.c.x;
            var rBY = point.y - bodyB.m_sweep.c.y;
            minSeparation = minSeparation < separation ? minSeparation : separation;
            var C = b2Math.Clamp(baumgarte * (separation + b2Settings.b2_linearSlop), (-b2Settings.b2_maxLinearCorrection), 0.0);
            var impulse = (-ccp.equalizedMass * C);
            var PX = impulse * normal.x;
            var PY = impulse * normal.y;bodyA.m_sweep.c.x -= invMassA * PX;
            bodyA.m_sweep.c.y -= invMassA * PY;
            bodyA.m_sweep.a -= invIA * (rAX * PY - rAY * PX);
            bodyA.SynchronizeTransform();
            bodyB.m_sweep.c.x += invMassB * PX;
            bodyB.m_sweep.c.y += invMassB * PY;
            bodyB.m_sweep.a += invIB * (rBX * PY - rBY * PX);
            bodyB.SynchronizeTransform();
         }
      }
      return minSeparation > (-1.5 * b2Settings.b2_linearSlop);
   }
   Box2D.postDefs.push(function () {
      Box2D.Dynamics.Contacts.b2ContactSolver.s_worldManifold = new b2WorldManifold();
      Box2D.Dynamics.Contacts.b2ContactSolver.s_psm = new b2PositionSolverManifold();
   });
   Box2D.inherit(b2EdgeAndCircleContact, Box2D.Dynamics.Contacts.b2Contact);
   b2EdgeAndCircleContact.prototype.__super = Box2D.Dynamics.Contacts.b2Contact.prototype;
   b2EdgeAndCircleContact.b2EdgeAndCircleContact = function () {
      Box2D.Dynamics.Contacts.b2Contact.b2Contact.apply(this, arguments);
   };
   b2EdgeAndCircleContact.Create = function (allocator) {
      return new b2EdgeAndCircleContact();
   }
   b2EdgeAndCircleContact.Destroy = function (contact, allocator) {}
   b2EdgeAndCircleContact.prototype.Reset = function (fixtureA, fixtureB) {
      this.__super.Reset.call(this, fixtureA, fixtureB);
   }
   b2EdgeAndCircleContact.prototype.Evaluate = function () {
      var bA = this.m_fixtureA.GetBody();
      var bB = this.m_fixtureB.GetBody();
      this.b2CollideEdgeAndCircle(this.m_manifold, (this.m_fixtureA.GetShape() instanceof b2EdgeShape ? this.m_fixtureA.GetShape() : null), bA.m_xf, (this.m_fixtureB.GetShape() instanceof b2CircleShape ? this.m_fixtureB.GetShape() : null), bB.m_xf);
   }
   b2EdgeAndCircleContact.prototype.b2CollideEdgeAndCircle = function (manifold, edge, xf1, circle, xf2) {}
   Box2D.inherit(b2NullContact, Box2D.Dynamics.Contacts.b2Contact);
   b2NullContact.prototype.__super = Box2D.Dynamics.Contacts.b2Contact.prototype;
   b2NullContact.b2NullContact = function () {
      Box2D.Dynamics.Contacts.b2Contact.b2Contact.apply(this, arguments);
   };
   b2NullContact.prototype.b2NullContact = function () {
      this.__super.b2Contact.call(this);
   }
   b2NullContact.prototype.Evaluate = function () {}
   Box2D.inherit(b2PolyAndCircleContact, Box2D.Dynamics.Contacts.b2Contact);
   b2PolyAndCircleContact.prototype.__super = Box2D.Dynamics.Contacts.b2Contact.prototype;
   b2PolyAndCircleContact.b2PolyAndCircleContact = function () {
      Box2D.Dynamics.Contacts.b2Contact.b2Contact.apply(this, arguments);
   };
   b2PolyAndCircleContact.Create = function (allocator) {
      return new b2PolyAndCircleContact();
   }
   b2PolyAndCircleContact.Destroy = function (contact, allocator) {}
   b2PolyAndCircleContact.prototype.Reset = function (fixtureA, fixtureB) {
      this.__super.Reset.call(this, fixtureA, fixtureB);
      b2Settings.b2Assert(fixtureA.GetType() == b2Shape.e_polygonShape);
      b2Settings.b2Assert(fixtureB.GetType() == b2Shape.e_circleShape);
   }
   b2PolyAndCircleContact.prototype.Evaluate = function () {
      var bA = this.m_fixtureA.m_body;
      var bB = this.m_fixtureB.m_body;
      b2Collision.CollidePolygonAndCircle(this.m_manifold, (this.m_fixtureA.GetShape() instanceof b2PolygonShape ? this.m_fixtureA.GetShape() : null), bA.m_xf, (this.m_fixtureB.GetShape() instanceof b2CircleShape ? this.m_fixtureB.GetShape() : null), bB.m_xf);
   }
   Box2D.inherit(b2PolyAndEdgeContact, Box2D.Dynamics.Contacts.b2Contact);
   b2PolyAndEdgeContact.prototype.__super = Box2D.Dynamics.Contacts.b2Contact.prototype;
   b2PolyAndEdgeContact.b2PolyAndEdgeContact = function () {
      Box2D.Dynamics.Contacts.b2Contact.b2Contact.apply(this, arguments);
   };
   b2PolyAndEdgeContact.Create = function (allocator) {
      return new b2PolyAndEdgeContact();
   }
   b2PolyAndEdgeContact.Destroy = function (contact, allocator) {}
   b2PolyAndEdgeContact.prototype.Reset = function (fixtureA, fixtureB) {
      this.__super.Reset.call(this, fixtureA, fixtureB);
      b2Settings.b2Assert(fixtureA.GetType() == b2Shape.e_polygonShape);
      b2Settings.b2Assert(fixtureB.GetType() == b2Shape.e_edgeShape);
   }
   b2PolyAndEdgeContact.prototype.Evaluate = function () {
      var bA = this.m_fixtureA.GetBody();
      var bB = this.m_fixtureB.GetBody();
      this.b2CollidePolyAndEdge(this.m_manifold, (this.m_fixtureA.GetShape() instanceof b2PolygonShape ? this.m_fixtureA.GetShape() : null), bA.m_xf, (this.m_fixtureB.GetShape() instanceof b2EdgeShape ? this.m_fixtureB.GetShape() : null), bB.m_xf);
   }
   b2PolyAndEdgeContact.prototype.b2CollidePolyAndEdge = function (manifold, polygon, xf1, edge, xf2) {}
   Box2D.inherit(b2PolygonContact, Box2D.Dynamics.Contacts.b2Contact);
   b2PolygonContact.prototype.__super = Box2D.Dynamics.Contacts.b2Contact.prototype;
   b2PolygonContact.b2PolygonContact = function () {
      Box2D.Dynamics.Contacts.b2Contact.b2Contact.apply(this, arguments);
   };
   b2PolygonContact.Create = function (allocator) {
      return new b2PolygonContact();
   }
   b2PolygonContact.Destroy = function (contact, allocator) {}
   b2PolygonContact.prototype.Reset = function (fixtureA, fixtureB) {
      this.__super.Reset.call(this, fixtureA, fixtureB);
   }
   b2PolygonContact.prototype.Evaluate = function () {
      var bA = this.m_fixtureA.GetBody();
      var bB = this.m_fixtureB.GetBody();
      b2Collision.CollidePolygons(this.m_manifold, (this.m_fixtureA.GetShape() instanceof b2PolygonShape ? this.m_fixtureA.GetShape() : null), bA.m_xf, (this.m_fixtureB.GetShape() instanceof b2PolygonShape ? this.m_fixtureB.GetShape() : null), bB.m_xf);
   }
   b2PositionSolverManifold.b2PositionSolverManifold = function () {};
   b2PositionSolverManifold.prototype.b2PositionSolverManifold = function () {
      this.m_normal = new b2Vec2();
      this.m_separations = new Vector_a2j_Number(b2Settings.b2_maxManifoldPoints);
      this.m_points = new Vector(b2Settings.b2_maxManifoldPoints);
      for (var i = 0; i < b2Settings.b2_maxManifoldPoints; i++) {
         this.m_points[i] = new b2Vec2();
      }
   }
   b2PositionSolverManifold.prototype.Initialize = function (cc) {
      b2Settings.b2Assert(cc.pointCount > 0);
      var i = 0;
      var clipPointX = 0;
      var clipPointY = 0;
      var tMat;
      var tVec;
      var planePointX = 0;
      var planePointY = 0;
      switch (cc.type) {
      case b2Manifold.e_circles:
         {
            tMat = cc.bodyA.m_xf.R;
            tVec = cc.localPoint;
            var pointAX = cc.bodyA.m_xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
            var pointAY = cc.bodyA.m_xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
            tMat = cc.bodyB.m_xf.R;
            tVec = cc.points[0].localPoint;
            var pointBX = cc.bodyB.m_xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
            var pointBY = cc.bodyB.m_xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
            var dX = pointBX - pointAX;
            var dY = pointBY - pointAY;
            var d2 = dX * dX + dY * dY;
            if (d2 > Number.MIN_VALUE * Number.MIN_VALUE) {
               var d = Math.sqrt(d2);
               this.m_normal.x = dX / d;
               this.m_normal.y = dY / d;
            }
            else {
               this.m_normal.x = 1.0;
               this.m_normal.y = 0.0;
            }
            this.m_points[0].x = 0.5 * (pointAX + pointBX);
            this.m_points[0].y = 0.5 * (pointAY + pointBY);
            this.m_separations[0] = dX * this.m_normal.x + dY * this.m_normal.y - cc.radius;
         }
         break;
      case b2Manifold.e_faceA:
         {
            tMat = cc.bodyA.m_xf.R;
            tVec = cc.localPlaneNormal;
            this.m_normal.x = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
            this.m_normal.y = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
            tMat = cc.bodyA.m_xf.R;
            tVec = cc.localPoint;
            planePointX = cc.bodyA.m_xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
            planePointY = cc.bodyA.m_xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
            tMat = cc.bodyB.m_xf.R;
            for (i = 0;
            i < cc.pointCount; ++i) {
               tVec = cc.points[i].localPoint;
               clipPointX = cc.bodyB.m_xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
               clipPointY = cc.bodyB.m_xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
               this.m_separations[i] = (clipPointX - planePointX) * this.m_normal.x + (clipPointY - planePointY) * this.m_normal.y - cc.radius;
               this.m_points[i].x = clipPointX;
               this.m_points[i].y = clipPointY;
            }
         }
         break;
      case b2Manifold.e_faceB:
         {
            tMat = cc.bodyB.m_xf.R;
            tVec = cc.localPlaneNormal;
            this.m_normal.x = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
            this.m_normal.y = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
            tMat = cc.bodyB.m_xf.R;
            tVec = cc.localPoint;
            planePointX = cc.bodyB.m_xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
            planePointY = cc.bodyB.m_xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
            tMat = cc.bodyA.m_xf.R;
            for (i = 0;
            i < cc.pointCount; ++i) {
               tVec = cc.points[i].localPoint;
               clipPointX = cc.bodyA.m_xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
               clipPointY = cc.bodyA.m_xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
               this.m_separations[i] = (clipPointX - planePointX) * this.m_normal.x + (clipPointY - planePointY) * this.m_normal.y - cc.radius;
               this.m_points[i].Set(clipPointX, clipPointY);
            }
            this.m_normal.x *= (-1);
            this.m_normal.y *= (-1);
         }
         break;
      }
   }
   Box2D.postDefs.push(function () {
      Box2D.Dynamics.Contacts.b2PositionSolverManifold.circlePointA = new b2Vec2();
      Box2D.Dynamics.Contacts.b2PositionSolverManifold.circlePointB = new b2Vec2();
   });
})();
(function () {
   var b2Body = Box2D.Dynamics.b2Body,
      b2BodyDef = Box2D.Dynamics.b2BodyDef,
      b2ContactFilter = Box2D.Dynamics.b2ContactFilter,
      b2ContactImpulse = Box2D.Dynamics.b2ContactImpulse,
      b2ContactListener = Box2D.Dynamics.b2ContactListener,
      b2ContactManager = Box2D.Dynamics.b2ContactManager,
      b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
      b2DestructionListener = Box2D.Dynamics.b2DestructionListener,
      b2FilterData = Box2D.Dynamics.b2FilterData,
      b2Fixture = Box2D.Dynamics.b2Fixture,
      b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
      b2Island = Box2D.Dynamics.b2Island,
      b2TimeStep = Box2D.Dynamics.b2TimeStep,
      b2World = Box2D.Dynamics.b2World,
      b2Mat22 = Box2D.Common.Math.b2Mat22,
      b2Mat33 = Box2D.Common.Math.b2Mat33,
      b2Math = Box2D.Common.Math.b2Math,
      b2Sweep = Box2D.Common.Math.b2Sweep,
      b2Transform = Box2D.Common.Math.b2Transform,
      b2Vec2 = Box2D.Common.Math.b2Vec2,
      b2Vec3 = Box2D.Common.Math.b2Vec3,
      b2Color = Box2D.Common.b2Color,
      b2internal = Box2D.Common.b2internal,
      b2Settings = Box2D.Common.b2Settings,
      b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
      b2EdgeChainDef = Box2D.Collision.Shapes.b2EdgeChainDef,
      b2EdgeShape = Box2D.Collision.Shapes.b2EdgeShape,
      b2MassData = Box2D.Collision.Shapes.b2MassData,
      b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
      b2Shape = Box2D.Collision.Shapes.b2Shape,
      b2BuoyancyController = Box2D.Dynamics.Controllers.b2BuoyancyController,
      b2ConstantAccelController = Box2D.Dynamics.Controllers.b2ConstantAccelController,
      b2ConstantForceController = Box2D.Dynamics.Controllers.b2ConstantForceController,
      b2Controller = Box2D.Dynamics.Controllers.b2Controller,
      b2ControllerEdge = Box2D.Dynamics.Controllers.b2ControllerEdge,
      b2GravityController = Box2D.Dynamics.Controllers.b2GravityController,
      b2TensorDampingController = Box2D.Dynamics.Controllers.b2TensorDampingController;

   Box2D.inherit(b2BuoyancyController, Box2D.Dynamics.Controllers.b2Controller);
   b2BuoyancyController.prototype.__super = Box2D.Dynamics.Controllers.b2Controller.prototype;
   b2BuoyancyController.b2BuoyancyController = function () {
      Box2D.Dynamics.Controllers.b2Controller.b2Controller.apply(this, arguments);
      this.normal = new b2Vec2(0, (-1));
      this.offset = 0;
      this.density = 0;
      this.velocity = new b2Vec2(0, 0);
      this.linearDrag = 2;
      this.angularDrag = 1;
      this.useDensity = false;
      this.useWorldGravity = true;
      this.gravity = null;
   };
   b2BuoyancyController.prototype.Step = function (step) {
      if (!this.m_bodyList) return;
      if (this.useWorldGravity) {
         this.gravity = this.GetWorld().GetGravity().Copy();
      }
      for (var i = this.m_bodyList; i; i = i.nextBody) {
         var body = i.body;
         if (body.IsAwake() == false) {
            continue;
         }
         var areac = new b2Vec2();
         var massc = new b2Vec2();
         var area = 0.0;
         var mass = 0.0;
         for (var fixture = body.GetFixtureList(); fixture; fixture = fixture.GetNext()) {
            var sc = new b2Vec2();
            var sarea = fixture.GetShape().ComputeSubmergedArea(this.normal, this.offset, body.GetTransform(), sc);
            area += sarea;
            areac.x += sarea * sc.x;
            areac.y += sarea * sc.y;
            var shapeDensity = 0;
            if (this.useDensity) {
               shapeDensity = 1;
            }
            else {
               shapeDensity = 1;
            }
            mass += sarea * shapeDensity;
            massc.x += sarea * sc.x * shapeDensity;
            massc.y += sarea * sc.y * shapeDensity;
         }
         areac.x /= area;
         areac.y /= area;
         massc.x /= mass;
         massc.y /= mass;
         if (area < Number.MIN_VALUE) continue;
         var buoyancyForce = this.gravity.GetNegative();
         buoyancyForce.Multiply(this.density * area);
         body.ApplyForce(buoyancyForce, massc);
         var dragForce = body.GetLinearVelocityFromWorldPoint(areac);
         dragForce.Subtract(this.velocity);
         dragForce.Multiply((-this.linearDrag * area));
         body.ApplyForce(dragForce, areac);
         body.ApplyTorque((-body.GetInertia() / body.GetMass() * area * body.GetAngularVelocity() * this.angularDrag));
      }
   }
   b2BuoyancyController.prototype.Draw = function (debugDraw) {
      var r = 1000;
      var p1 = new b2Vec2();
      var p2 = new b2Vec2();
      p1.x = this.normal.x * this.offset + this.normal.y * r;
      p1.y = this.normal.y * this.offset - this.normal.x * r;
      p2.x = this.normal.x * this.offset - this.normal.y * r;
      p2.y = this.normal.y * this.offset + this.normal.x * r;
      var color = new b2Color(0, 0, 1);
      debugDraw.DrawSegment(p1, p2, color);
   }
   Box2D.inherit(b2ConstantAccelController, Box2D.Dynamics.Controllers.b2Controller);
   b2ConstantAccelController.prototype.__super = Box2D.Dynamics.Controllers.b2Controller.prototype;
   b2ConstantAccelController.b2ConstantAccelController = function () {
      Box2D.Dynamics.Controllers.b2Controller.b2Controller.apply(this, arguments);
      this.A = new b2Vec2(0, 0);
   };
   b2ConstantAccelController.prototype.Step = function (step) {
      var smallA = new b2Vec2(this.A.x * step.dt, this.A.y * step.dt);
      for (var i = this.m_bodyList; i; i = i.nextBody) {
         var body = i.body;
         if (!body.IsAwake()) continue;
         body.SetLinearVelocity(new b2Vec2(body.GetLinearVelocity().x + smallA.x, body.GetLinearVelocity().y + smallA.y));
      }
   }
   Box2D.inherit(b2ConstantForceController, Box2D.Dynamics.Controllers.b2Controller);
   b2ConstantForceController.prototype.__super = Box2D.Dynamics.Controllers.b2Controller.prototype;
   b2ConstantForceController.b2ConstantForceController = function () {
      Box2D.Dynamics.Controllers.b2Controller.b2Controller.apply(this, arguments);
      this.F = new b2Vec2(0, 0);
   };
   b2ConstantForceController.prototype.Step = function (step) {
      for (var i = this.m_bodyList; i; i = i.nextBody) {
         var body = i.body;
         if (!body.IsAwake()) continue;
         body.ApplyForce(this.F, body.GetWorldCenter());
      }
   }
   b2Controller.b2Controller = function () {};
   b2Controller.prototype.Step = function (step) {}
   b2Controller.prototype.Draw = function (debugDraw) {}
   b2Controller.prototype.AddBody = function (body) {
      var edge = new b2ControllerEdge();
      edge.controller = this;
      edge.body = body;
      edge.nextBody = this.m_bodyList;
      edge.prevBody = null;
      this.m_bodyList = edge;
      if (edge.nextBody) edge.nextBody.prevBody = edge;
      this.m_bodyCount++;
      edge.nextController = body.m_controllerList;
      edge.prevController = null;
      body.m_controllerList = edge;
      if (edge.nextController) edge.nextController.prevController = edge;
      body.m_controllerCount++;
   }
   b2Controller.prototype.RemoveBody = function (body) {
      var edge = body.m_controllerList;
      while (edge && edge.controller != this)
      edge = edge.nextController;
      if (edge.prevBody) edge.prevBody.nextBody = edge.nextBody;
      if (edge.nextBody) edge.nextBody.prevBody = edge.prevBody;
      if (edge.nextController) edge.nextController.prevController = edge.prevController;
      if (edge.prevController) edge.prevController.nextController = edge.nextController;
      if (this.m_bodyList == edge) this.m_bodyList = edge.nextBody;
      if (body.m_controllerList == edge) body.m_controllerList = edge.nextController;
      body.m_controllerCount--;
      this.m_bodyCount--;
   }
   b2Controller.prototype.Clear = function () {
      while (this.m_bodyList)
      this.RemoveBody(this.m_bodyList.body);
   }
   b2Controller.prototype.GetNext = function () {
      return this.m_next;
   }
   b2Controller.prototype.GetWorld = function () {
      return this.m_world;
   }
   b2Controller.prototype.GetBodyList = function () {
      return this.m_bodyList;
   }
   b2ControllerEdge.b2ControllerEdge = function () {};
   Box2D.inherit(b2GravityController, Box2D.Dynamics.Controllers.b2Controller);
   b2GravityController.prototype.__super = Box2D.Dynamics.Controllers.b2Controller.prototype;
   b2GravityController.b2GravityController = function () {
      Box2D.Dynamics.Controllers.b2Controller.b2Controller.apply(this, arguments);
      this.G = 1;
      this.invSqr = true;
   };
   b2GravityController.prototype.Step = function (step) {
      var i = null;
      var body1 = null;
      var p1 = null;
      var mass1 = 0;
      var j = null;
      var body2 = null;
      var p2 = null;
      var dx = 0;
      var dy = 0;
      var r2 = 0;
      var f = null;
      if (this.invSqr) {
         for (i = this.m_bodyList;
         i; i = i.nextBody) {
            body1 = i.body;
            p1 = body1.GetWorldCenter();
            mass1 = body1.GetMass();
            for (j = this.m_bodyList;
            j != i; j = j.nextBody) {
               body2 = j.body;
               p2 = body2.GetWorldCenter();
               dx = p2.x - p1.x;
               dy = p2.y - p1.y;
               r2 = dx * dx + dy * dy;
               if (r2 < Number.MIN_VALUE) continue;
               f = new b2Vec2(dx, dy);
               f.Multiply(this.G / r2 / Math.sqrt(r2) * mass1 * body2.GetMass());
               if (body1.IsAwake()) body1.ApplyForce(f, p1);
               f.Multiply((-1));
               if (body2.IsAwake()) body2.ApplyForce(f, p2);
            }
         }
      }
      else {
         for (i = this.m_bodyList;
         i; i = i.nextBody) {
            body1 = i.body;
            p1 = body1.GetWorldCenter();
            mass1 = body1.GetMass();
            for (j = this.m_bodyList;
            j != i; j = j.nextBody) {
               body2 = j.body;
               p2 = body2.GetWorldCenter();
               dx = p2.x - p1.x;
               dy = p2.y - p1.y;
               r2 = dx * dx + dy * dy;
               if (r2 < Number.MIN_VALUE) continue;
               f = new b2Vec2(dx, dy);
               f.Multiply(this.G / r2 * mass1 * body2.GetMass());
               if (body1.IsAwake()) body1.ApplyForce(f, p1);
               f.Multiply((-1));
               if (body2.IsAwake()) body2.ApplyForce(f, p2);
            }
         }
      }
   }
   Box2D.inherit(b2TensorDampingController, Box2D.Dynamics.Controllers.b2Controller);
   b2TensorDampingController.prototype.__super = Box2D.Dynamics.Controllers.b2Controller.prototype;
   b2TensorDampingController.b2TensorDampingController = function () {
      Box2D.Dynamics.Controllers.b2Controller.b2Controller.apply(this, arguments);
      this.T = new b2Mat22();
      this.maxTimestep = 0;
   };
   b2TensorDampingController.prototype.SetAxisAligned = function (xDamping, yDamping) {
      if (xDamping === undefined) xDamping = 0;
      if (yDamping === undefined) yDamping = 0;
      this.T.col1.x = (-xDamping);
      this.T.col1.y = 0;
      this.T.col2.x = 0;
      this.T.col2.y = (-yDamping);
      if (xDamping > 0 || yDamping > 0) {
         this.maxTimestep = 1 / Math.max(xDamping, yDamping);
      }
      else {
         this.maxTimestep = 0;
      }
   }
   b2TensorDampingController.prototype.Step = function (step) {
      var timestep = step.dt;
      if (timestep <= Number.MIN_VALUE) return;
      if (timestep > this.maxTimestep && this.maxTimestep > 0) timestep = this.maxTimestep;
      for (var i = this.m_bodyList; i; i = i.nextBody) {
         var body = i.body;
         if (!body.IsAwake()) {
            continue;
         }
         var damping = body.GetWorldVector(b2Math.MulMV(this.T, body.GetLocalVector(body.GetLinearVelocity())));
         body.SetLinearVelocity(new b2Vec2(body.GetLinearVelocity().x + damping.x * timestep, body.GetLinearVelocity().y + damping.y * timestep));
      }
   }
})();
(function () {
   var b2Color = Box2D.Common.b2Color,
      b2internal = Box2D.Common.b2internal,
      b2Settings = Box2D.Common.b2Settings,
      b2Mat22 = Box2D.Common.Math.b2Mat22,
      b2Mat33 = Box2D.Common.Math.b2Mat33,
      b2Math = Box2D.Common.Math.b2Math,
      b2Sweep = Box2D.Common.Math.b2Sweep,
      b2Transform = Box2D.Common.Math.b2Transform,
      b2Vec2 = Box2D.Common.Math.b2Vec2,
      b2Vec3 = Box2D.Common.Math.b2Vec3,
      b2DistanceJoint = Box2D.Dynamics.Joints.b2DistanceJoint,
      b2DistanceJointDef = Box2D.Dynamics.Joints.b2DistanceJointDef,
      b2FrictionJoint = Box2D.Dynamics.Joints.b2FrictionJoint,
      b2FrictionJointDef = Box2D.Dynamics.Joints.b2FrictionJointDef,
      b2GearJoint = Box2D.Dynamics.Joints.b2GearJoint,
      b2GearJointDef = Box2D.Dynamics.Joints.b2GearJointDef,
      b2Jacobian = Box2D.Dynamics.Joints.b2Jacobian,
      b2Joint = Box2D.Dynamics.Joints.b2Joint,
      b2JointDef = Box2D.Dynamics.Joints.b2JointDef,
      b2JointEdge = Box2D.Dynamics.Joints.b2JointEdge,
      b2LineJoint = Box2D.Dynamics.Joints.b2LineJoint,
      b2LineJointDef = Box2D.Dynamics.Joints.b2LineJointDef,
      b2MouseJoint = Box2D.Dynamics.Joints.b2MouseJoint,
      b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef,
      b2PrismaticJoint = Box2D.Dynamics.Joints.b2PrismaticJoint,
      b2PrismaticJointDef = Box2D.Dynamics.Joints.b2PrismaticJointDef,
      b2PulleyJoint = Box2D.Dynamics.Joints.b2PulleyJoint,
      b2PulleyJointDef = Box2D.Dynamics.Joints.b2PulleyJointDef,
      b2RevoluteJoint = Box2D.Dynamics.Joints.b2RevoluteJoint,
      b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef,
      b2WeldJoint = Box2D.Dynamics.Joints.b2WeldJoint,
      b2WeldJointDef = Box2D.Dynamics.Joints.b2WeldJointDef,
      b2Body = Box2D.Dynamics.b2Body,
      b2BodyDef = Box2D.Dynamics.b2BodyDef,
      b2ContactFilter = Box2D.Dynamics.b2ContactFilter,
      b2ContactImpulse = Box2D.Dynamics.b2ContactImpulse,
      b2ContactListener = Box2D.Dynamics.b2ContactListener,
      b2ContactManager = Box2D.Dynamics.b2ContactManager,
      b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
      b2DestructionListener = Box2D.Dynamics.b2DestructionListener,
      b2FilterData = Box2D.Dynamics.b2FilterData,
      b2Fixture = Box2D.Dynamics.b2Fixture,
      b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
      b2Island = Box2D.Dynamics.b2Island,
      b2TimeStep = Box2D.Dynamics.b2TimeStep,
      b2World = Box2D.Dynamics.b2World;

   Box2D.inherit(b2DistanceJoint, Box2D.Dynamics.Joints.b2Joint);
   b2DistanceJoint.prototype.__super = Box2D.Dynamics.Joints.b2Joint.prototype;
   b2DistanceJoint.b2DistanceJoint = function () {
      Box2D.Dynamics.Joints.b2Joint.b2Joint.apply(this, arguments);
      this.m_localAnchor1 = new b2Vec2();
      this.m_localAnchor2 = new b2Vec2();
      this.m_u = new b2Vec2();
   };
   b2DistanceJoint.prototype.GetAnchorA = function () {
      return this.m_bodyA.GetWorldPoint(this.m_localAnchor1);
   }
   b2DistanceJoint.prototype.GetAnchorB = function () {
      return this.m_bodyB.GetWorldPoint(this.m_localAnchor2);
   }
   b2DistanceJoint.prototype.GetReactionForce = function (inv_dt) {
      if (inv_dt === undefined) inv_dt = 0;
      return new b2Vec2(inv_dt * this.m_impulse * this.m_u.x, inv_dt * this.m_impulse * this.m_u.y);
   }
   b2DistanceJoint.prototype.GetReactionTorque = function (inv_dt) {
      if (inv_dt === undefined) inv_dt = 0;
      return 0.0;
   }
   b2DistanceJoint.prototype.GetLength = function () {
      return this.m_length;
   }
   b2DistanceJoint.prototype.SetLength = function (length) {
      if (length === undefined) length = 0;
      this.m_length = length;
   }
   b2DistanceJoint.prototype.GetFrequency = function () {
      return this.m_frequencyHz;
   }
   b2DistanceJoint.prototype.SetFrequency = function (hz) {
      if (hz === undefined) hz = 0;
      this.m_frequencyHz = hz;
   }
   b2DistanceJoint.prototype.GetDampingRatio = function () {
      return this.m_dampingRatio;
   }
   b2DistanceJoint.prototype.SetDampingRatio = function (ratio) {
      if (ratio === undefined) ratio = 0;
      this.m_dampingRatio = ratio;
   }
   b2DistanceJoint.prototype.b2DistanceJoint = function (def) {
      this.__super.b2Joint.call(this, def);
      var tMat;
      var tX = 0;
      var tY = 0;
      this.m_localAnchor1.SetV(def.localAnchorA);
      this.m_localAnchor2.SetV(def.localAnchorB);
      this.m_length = def.length;
      this.m_frequencyHz = def.frequencyHz;
      this.m_dampingRatio = def.dampingRatio;
      this.m_impulse = 0.0;
      this.m_gamma = 0.0;
      this.m_bias = 0.0;
   }
   b2DistanceJoint.prototype.InitVelocityConstraints = function (step) {
      var tMat;
      var tX = 0;
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      tMat = bA.m_xf.R;
      var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
      var r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
      tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
      r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
      r1X = tX;
      tMat = bB.m_xf.R;
      var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
      var r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
      tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
      r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
      r2X = tX;
      this.m_u.x = bB.m_sweep.c.x + r2X - bA.m_sweep.c.x - r1X;
      this.m_u.y = bB.m_sweep.c.y + r2Y - bA.m_sweep.c.y - r1Y;
      var length = Math.sqrt(this.m_u.x * this.m_u.x + this.m_u.y * this.m_u.y);
      if (length > b2Settings.b2_linearSlop) {
         this.m_u.Multiply(1.0 / length);
      }
      else {
         this.m_u.SetZero();
      }
      var cr1u = (r1X * this.m_u.y - r1Y * this.m_u.x);
      var cr2u = (r2X * this.m_u.y - r2Y * this.m_u.x);
      var invMass = bA.m_invMass + bA.m_invI * cr1u * cr1u + bB.m_invMass + bB.m_invI * cr2u * cr2u;
      this.m_mass = invMass != 0.0 ? 1.0 / invMass : 0.0;
      if (this.m_frequencyHz > 0.0) {
         var C = length - this.m_length;
         var omega = 2.0 * Math.PI * this.m_frequencyHz;
         var d = 2.0 * this.m_mass * this.m_dampingRatio * omega;
         var k = this.m_mass * omega * omega;
         this.m_gamma = step.dt * (d + step.dt * k);
         this.m_gamma = this.m_gamma != 0.0 ? 1 / this.m_gamma : 0.0;
         this.m_bias = C * step.dt * k * this.m_gamma;
         this.m_mass = invMass + this.m_gamma;
         this.m_mass = this.m_mass != 0.0 ? 1.0 / this.m_mass : 0.0;
      }
      if (step.warmStarting) {
         this.m_impulse *= step.dtRatio;
         var PX = this.m_impulse * this.m_u.x;
         var PY = this.m_impulse * this.m_u.y;
         bA.m_linearVelocity.x -= bA.m_invMass * PX;
         bA.m_linearVelocity.y -= bA.m_invMass * PY;
         bA.m_angularVelocity -= bA.m_invI * (r1X * PY - r1Y * PX);
         bB.m_linearVelocity.x += bB.m_invMass * PX;
         bB.m_linearVelocity.y += bB.m_invMass * PY;
         bB.m_angularVelocity += bB.m_invI * (r2X * PY - r2Y * PX);
      }
      else {
         this.m_impulse = 0.0;
      }
   }
   b2DistanceJoint.prototype.SolveVelocityConstraints = function (step) {
      var tMat;
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      tMat = bA.m_xf.R;
      var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
      var r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
      var tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
      r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
      r1X = tX;
      tMat = bB.m_xf.R;
      var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
      var r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
      tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
      r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
      r2X = tX;
      var v1X = bA.m_linearVelocity.x + ((-bA.m_angularVelocity * r1Y));
      var v1Y = bA.m_linearVelocity.y + (bA.m_angularVelocity * r1X);
      var v2X = bB.m_linearVelocity.x + ((-bB.m_angularVelocity * r2Y));
      var v2Y = bB.m_linearVelocity.y + (bB.m_angularVelocity * r2X);
      var Cdot = (this.m_u.x * (v2X - v1X) + this.m_u.y * (v2Y - v1Y));
      var impulse = (-this.m_mass * (Cdot + this.m_bias + this.m_gamma * this.m_impulse));
      this.m_impulse += impulse;
      var PX = impulse * this.m_u.x;
      var PY = impulse * this.m_u.y;
      bA.m_linearVelocity.x -= bA.m_invMass * PX;
      bA.m_linearVelocity.y -= bA.m_invMass * PY;
      bA.m_angularVelocity -= bA.m_invI * (r1X * PY - r1Y * PX);
      bB.m_linearVelocity.x += bB.m_invMass * PX;
      bB.m_linearVelocity.y += bB.m_invMass * PY;
      bB.m_angularVelocity += bB.m_invI * (r2X * PY - r2Y * PX);
   }
   b2DistanceJoint.prototype.SolvePositionConstraints = function (baumgarte) {
      if (baumgarte === undefined) baumgarte = 0;
      var tMat;
      if (this.m_frequencyHz > 0.0) {
         return true;
      }
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      tMat = bA.m_xf.R;
      var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
      var r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
      var tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
      r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
      r1X = tX;
      tMat = bB.m_xf.R;
      var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
      var r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
      tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
      r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
      r2X = tX;
      var dX = bB.m_sweep.c.x + r2X - bA.m_sweep.c.x - r1X;
      var dY = bB.m_sweep.c.y + r2Y - bA.m_sweep.c.y - r1Y;
      var length = Math.sqrt(dX * dX + dY * dY);
      dX /= length;
      dY /= length;
      var C = length - this.m_length;
      C = b2Math.Clamp(C, (-b2Settings.b2_maxLinearCorrection), b2Settings.b2_maxLinearCorrection);
      var impulse = (-this.m_mass * C);
      this.m_u.Set(dX, dY);
      var PX = impulse * this.m_u.x;
      var PY = impulse * this.m_u.y;
      bA.m_sweep.c.x -= bA.m_invMass * PX;
      bA.m_sweep.c.y -= bA.m_invMass * PY;
      bA.m_sweep.a -= bA.m_invI * (r1X * PY - r1Y * PX);
      bB.m_sweep.c.x += bB.m_invMass * PX;
      bB.m_sweep.c.y += bB.m_invMass * PY;
      bB.m_sweep.a += bB.m_invI * (r2X * PY - r2Y * PX);
      bA.SynchronizeTransform();
      bB.SynchronizeTransform();
      return b2Math.Abs(C) < b2Settings.b2_linearSlop;
   }
   Box2D.inherit(b2DistanceJointDef, Box2D.Dynamics.Joints.b2JointDef);
   b2DistanceJointDef.prototype.__super = Box2D.Dynamics.Joints.b2JointDef.prototype;
   b2DistanceJointDef.b2DistanceJointDef = function () {
      Box2D.Dynamics.Joints.b2JointDef.b2JointDef.apply(this, arguments);
      this.localAnchorA = new b2Vec2();
      this.localAnchorB = new b2Vec2();
   };
   b2DistanceJointDef.prototype.b2DistanceJointDef = function () {
      this.__super.b2JointDef.call(this);
      this.type = b2Joint.e_distanceJoint;
      this.length = 1.0;
      this.frequencyHz = 0.0;
      this.dampingRatio = 0.0;
   }
   b2DistanceJointDef.prototype.Initialize = function (bA, bB, anchorA, anchorB) {
      this.bodyA = bA;
      this.bodyB = bB;
      this.localAnchorA.SetV(this.bodyA.GetLocalPoint(anchorA));
      this.localAnchorB.SetV(this.bodyB.GetLocalPoint(anchorB));
      var dX = anchorB.x - anchorA.x;
      var dY = anchorB.y - anchorA.y;
      this.length = Math.sqrt(dX * dX + dY * dY);
      this.frequencyHz = 0.0;
      this.dampingRatio = 0.0;
   }
   Box2D.inherit(b2FrictionJoint, Box2D.Dynamics.Joints.b2Joint);
   b2FrictionJoint.prototype.__super = Box2D.Dynamics.Joints.b2Joint.prototype;
   b2FrictionJoint.b2FrictionJoint = function () {
      Box2D.Dynamics.Joints.b2Joint.b2Joint.apply(this, arguments);
      this.m_localAnchorA = new b2Vec2();
      this.m_localAnchorB = new b2Vec2();
      this.m_linearMass = new b2Mat22();
      this.m_linearImpulse = new b2Vec2();
   };
   b2FrictionJoint.prototype.GetAnchorA = function () {
      return this.m_bodyA.GetWorldPoint(this.m_localAnchorA);
   }
   b2FrictionJoint.prototype.GetAnchorB = function () {
      return this.m_bodyB.GetWorldPoint(this.m_localAnchorB);
   }
   b2FrictionJoint.prototype.GetReactionForce = function (inv_dt) {
      if (inv_dt === undefined) inv_dt = 0;
      return new b2Vec2(inv_dt * this.m_linearImpulse.x, inv_dt * this.m_linearImpulse.y);
   }
   b2FrictionJoint.prototype.GetReactionTorque = function (inv_dt) {
      if (inv_dt === undefined) inv_dt = 0;
      return inv_dt * this.m_angularImpulse;
   }
   b2FrictionJoint.prototype.SetMaxForce = function (force) {
      if (force === undefined) force = 0;
      this.m_maxForce = force;
   }
   b2FrictionJoint.prototype.GetMaxForce = function () {
      return this.m_maxForce;
   }
   b2FrictionJoint.prototype.SetMaxTorque = function (torque) {
      if (torque === undefined) torque = 0;
      this.m_maxTorque = torque;
   }
   b2FrictionJoint.prototype.GetMaxTorque = function () {
      return this.m_maxTorque;
   }
   b2FrictionJoint.prototype.b2FrictionJoint = function (def) {
      this.__super.b2Joint.call(this, def);
      this.m_localAnchorA.SetV(def.localAnchorA);
      this.m_localAnchorB.SetV(def.localAnchorB);
      this.m_linearMass.SetZero();
      this.m_angularMass = 0.0;
      this.m_linearImpulse.SetZero();
      this.m_angularImpulse = 0.0;
      this.m_maxForce = def.maxForce;
      this.m_maxTorque = def.maxTorque;
   }
   b2FrictionJoint.prototype.InitVelocityConstraints = function (step) {
      var tMat;
      var tX = 0;
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      tMat = bA.m_xf.R;
      var rAX = this.m_localAnchorA.x - bA.m_sweep.localCenter.x;
      var rAY = this.m_localAnchorA.y - bA.m_sweep.localCenter.y;
      tX = (tMat.col1.x * rAX + tMat.col2.x * rAY);
      rAY = (tMat.col1.y * rAX + tMat.col2.y * rAY);
      rAX = tX;
      tMat = bB.m_xf.R;
      var rBX = this.m_localAnchorB.x - bB.m_sweep.localCenter.x;
      var rBY = this.m_localAnchorB.y - bB.m_sweep.localCenter.y;
      tX = (tMat.col1.x * rBX + tMat.col2.x * rBY);
      rBY = (tMat.col1.y * rBX + tMat.col2.y * rBY);
      rBX = tX;
      var mA = bA.m_invMass;
      var mB = bB.m_invMass;
      var iA = bA.m_invI;
      var iB = bB.m_invI;
      var K = new b2Mat22();
      K.col1.x = mA + mB;
      K.col2.x = 0.0;
      K.col1.y = 0.0;
      K.col2.y = mA + mB;
      K.col1.x += iA * rAY * rAY;
      K.col2.x += (-iA * rAX * rAY);
      K.col1.y += (-iA * rAX * rAY);
      K.col2.y += iA * rAX * rAX;
      K.col1.x += iB * rBY * rBY;
      K.col2.x += (-iB * rBX * rBY);
      K.col1.y += (-iB * rBX * rBY);
      K.col2.y += iB * rBX * rBX;
      K.GetInverse(this.m_linearMass);
      this.m_angularMass = iA + iB;
      if (this.m_angularMass > 0.0) {
         this.m_angularMass = 1.0 / this.m_angularMass;
      }
      if (step.warmStarting) {
         this.m_linearImpulse.x *= step.dtRatio;
         this.m_linearImpulse.y *= step.dtRatio;
         this.m_angularImpulse *= step.dtRatio;
         var P = this.m_linearImpulse;
         bA.m_linearVelocity.x -= mA * P.x;
         bA.m_linearVelocity.y -= mA * P.y;
         bA.m_angularVelocity -= iA * (rAX * P.y - rAY * P.x + this.m_angularImpulse);
         bB.m_linearVelocity.x += mB * P.x;
         bB.m_linearVelocity.y += mB * P.y;
         bB.m_angularVelocity += iB * (rBX * P.y - rBY * P.x + this.m_angularImpulse);
      }
      else {
         this.m_linearImpulse.SetZero();
         this.m_angularImpulse = 0.0;
      }
   }
   b2FrictionJoint.prototype.SolveVelocityConstraints = function (step) {
      var tMat;
      var tX = 0;
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var vA = bA.m_linearVelocity;
      var wA = bA.m_angularVelocity;
      var vB = bB.m_linearVelocity;
      var wB = bB.m_angularVelocity;
      var mA = bA.m_invMass;
      var mB = bB.m_invMass;
      var iA = bA.m_invI;
      var iB = bB.m_invI;
      tMat = bA.m_xf.R;
      var rAX = this.m_localAnchorA.x - bA.m_sweep.localCenter.x;
      var rAY = this.m_localAnchorA.y - bA.m_sweep.localCenter.y;
      tX = (tMat.col1.x * rAX + tMat.col2.x * rAY);
      rAY = (tMat.col1.y * rAX + tMat.col2.y * rAY);
      rAX = tX;
      tMat = bB.m_xf.R;
      var rBX = this.m_localAnchorB.x - bB.m_sweep.localCenter.x;
      var rBY = this.m_localAnchorB.y - bB.m_sweep.localCenter.y;
      tX = (tMat.col1.x * rBX + tMat.col2.x * rBY);
      rBY = (tMat.col1.y * rBX + tMat.col2.y * rBY);
      rBX = tX;
      var maxImpulse = 0; {
         var Cdot = wB - wA;
         var impulse = (-this.m_angularMass * Cdot);
         var oldImpulse = this.m_angularImpulse;
         maxImpulse = step.dt * this.m_maxTorque;
         this.m_angularImpulse = b2Math.Clamp(this.m_angularImpulse + impulse, (-maxImpulse), maxImpulse);
         impulse = this.m_angularImpulse - oldImpulse;
         wA -= iA * impulse;
         wB += iB * impulse;
      } {
         var CdotX = vB.x - wB * rBY - vA.x + wA * rAY;
         var CdotY = vB.y + wB * rBX - vA.y - wA * rAX;
         var impulseV = b2Math.MulMV(this.m_linearMass, new b2Vec2((-CdotX), (-CdotY)));
         var oldImpulseV = this.m_linearImpulse.Copy();
         this.m_linearImpulse.Add(impulseV);
         maxImpulse = step.dt * this.m_maxForce;
         if (this.m_linearImpulse.LengthSquared() > maxImpulse * maxImpulse) {
            this.m_linearImpulse.Normalize();
            this.m_linearImpulse.Multiply(maxImpulse);
         }
         impulseV = b2Math.SubtractVV(this.m_linearImpulse, oldImpulseV);
         vA.x -= mA * impulseV.x;
         vA.y -= mA * impulseV.y;
         wA -= iA * (rAX * impulseV.y - rAY * impulseV.x);
         vB.x += mB * impulseV.x;
         vB.y += mB * impulseV.y;
         wB += iB * (rBX * impulseV.y - rBY * impulseV.x);
      }
      bA.m_angularVelocity = wA;
      bB.m_angularVelocity = wB;
   }
   b2FrictionJoint.prototype.SolvePositionConstraints = function (baumgarte) {
      if (baumgarte === undefined) baumgarte = 0;
      return true;
   }
   Box2D.inherit(b2FrictionJointDef, Box2D.Dynamics.Joints.b2JointDef);
   b2FrictionJointDef.prototype.__super = Box2D.Dynamics.Joints.b2JointDef.prototype;
   b2FrictionJointDef.b2FrictionJointDef = function () {
      Box2D.Dynamics.Joints.b2JointDef.b2JointDef.apply(this, arguments);
      this.localAnchorA = new b2Vec2();
      this.localAnchorB = new b2Vec2();
   };
   b2FrictionJointDef.prototype.b2FrictionJointDef = function () {
      this.__super.b2JointDef.call(this);
      this.type = b2Joint.e_frictionJoint;
      this.maxForce = 0.0;
      this.maxTorque = 0.0;
   }
   b2FrictionJointDef.prototype.Initialize = function (bA, bB, anchor) {
      this.bodyA = bA;
      this.bodyB = bB;
      this.localAnchorA.SetV(this.bodyA.GetLocalPoint(anchor));
      this.localAnchorB.SetV(this.bodyB.GetLocalPoint(anchor));
   }
   Box2D.inherit(b2GearJoint, Box2D.Dynamics.Joints.b2Joint);
   b2GearJoint.prototype.__super = Box2D.Dynamics.Joints.b2Joint.prototype;
   b2GearJoint.b2GearJoint = function () {
      Box2D.Dynamics.Joints.b2Joint.b2Joint.apply(this, arguments);
      this.m_groundAnchor1 = new b2Vec2();
      this.m_groundAnchor2 = new b2Vec2();
      this.m_localAnchor1 = new b2Vec2();
      this.m_localAnchor2 = new b2Vec2();
      this.m_J = new b2Jacobian();
   };
   b2GearJoint.prototype.GetAnchorA = function () {
      return this.m_bodyA.GetWorldPoint(this.m_localAnchor1);
   }
   b2GearJoint.prototype.GetAnchorB = function () {
      return this.m_bodyB.GetWorldPoint(this.m_localAnchor2);
   }
   b2GearJoint.prototype.GetReactionForce = function (inv_dt) {
      if (inv_dt === undefined) inv_dt = 0;
      return new b2Vec2(inv_dt * this.m_impulse * this.m_J.linearB.x, inv_dt * this.m_impulse * this.m_J.linearB.y);
   }
   b2GearJoint.prototype.GetReactionTorque = function (inv_dt) {
      if (inv_dt === undefined) inv_dt = 0;
      var tMat = this.m_bodyB.m_xf.R;
      var rX = this.m_localAnchor1.x - this.m_bodyB.m_sweep.localCenter.x;
      var rY = this.m_localAnchor1.y - this.m_bodyB.m_sweep.localCenter.y;
      var tX = tMat.col1.x * rX + tMat.col2.x * rY;
      rY = tMat.col1.y * rX + tMat.col2.y * rY;
      rX = tX;
      var PX = this.m_impulse * this.m_J.linearB.x;
      var PY = this.m_impulse * this.m_J.linearB.y;
      return inv_dt * (this.m_impulse * this.m_J.angularB - rX * PY + rY * PX);
   }
   b2GearJoint.prototype.GetRatio = function () {
      return this.m_ratio;
   }
   b2GearJoint.prototype.SetRatio = function (ratio) {
      if (ratio === undefined) ratio = 0;
      this.m_ratio = ratio;
   }
   b2GearJoint.prototype.b2GearJoint = function (def) {
      this.__super.b2Joint.call(this, def);
      var type1 = parseInt(def.joint1.m_type);
      var type2 = parseInt(def.joint2.m_type);
      this.m_revolute1 = null;
      this.m_prismatic1 = null;
      this.m_revolute2 = null;
      this.m_prismatic2 = null;
      var coordinate1 = 0;
      var coordinate2 = 0;
      this.m_ground1 = def.joint1.GetBodyA();
      this.m_bodyA = def.joint1.GetBodyB();
      if (type1 == b2Joint.e_revoluteJoint) {
         this.m_revolute1 = (def.joint1 instanceof b2RevoluteJoint ? def.joint1 : null);
         this.m_groundAnchor1.SetV(this.m_revolute1.m_localAnchor1);
         this.m_localAnchor1.SetV(this.m_revolute1.m_localAnchor2);
         coordinate1 = this.m_revolute1.GetJointAngle();
      }
      else {
         this.m_prismatic1 = (def.joint1 instanceof b2PrismaticJoint ? def.joint1 : null);
         this.m_groundAnchor1.SetV(this.m_prismatic1.m_localAnchor1);
         this.m_localAnchor1.SetV(this.m_prismatic1.m_localAnchor2);
         coordinate1 = this.m_prismatic1.GetJointTranslation();
      }
      this.m_ground2 = def.joint2.GetBodyA();
      this.m_bodyB = def.joint2.GetBodyB();
      if (type2 == b2Joint.e_revoluteJoint) {
         this.m_revolute2 = (def.joint2 instanceof b2RevoluteJoint ? def.joint2 : null);
         this.m_groundAnchor2.SetV(this.m_revolute2.m_localAnchor1);
         this.m_localAnchor2.SetV(this.m_revolute2.m_localAnchor2);
         coordinate2 = this.m_revolute2.GetJointAngle();
      }
      else {
         this.m_prismatic2 = (def.joint2 instanceof b2PrismaticJoint ? def.joint2 : null);
         this.m_groundAnchor2.SetV(this.m_prismatic2.m_localAnchor1);
         this.m_localAnchor2.SetV(this.m_prismatic2.m_localAnchor2);
         coordinate2 = this.m_prismatic2.GetJointTranslation();
      }
      this.m_ratio = def.ratio;
      this.m_constant = coordinate1 + this.m_ratio * coordinate2;
      this.m_impulse = 0.0;
   }
   b2GearJoint.prototype.InitVelocityConstraints = function (step) {
      var g1 = this.m_ground1;
      var g2 = this.m_ground2;
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var ugX = 0;
      var ugY = 0;
      var rX = 0;
      var rY = 0;
      var tMat;
      var tVec;
      var crug = 0;
      var tX = 0;
      var K = 0.0;
      this.m_J.SetZero();
      if (this.m_revolute1) {
         this.m_J.angularA = (-1.0);
         K += bA.m_invI;
      }
      else {
         tMat = g1.m_xf.R;
         tVec = this.m_prismatic1.m_localXAxis1;
         ugX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
         ugY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
         tMat = bA.m_xf.R;
         rX = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
         rY = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
         tX = tMat.col1.x * rX + tMat.col2.x * rY;
         rY = tMat.col1.y * rX + tMat.col2.y * rY;
         rX = tX;
         crug = rX * ugY - rY * ugX;
         this.m_J.linearA.Set((-ugX), (-ugY));
         this.m_J.angularA = (-crug);
         K += bA.m_invMass + bA.m_invI * crug * crug;
      }
      if (this.m_revolute2) {
         this.m_J.angularB = (-this.m_ratio);
         K += this.m_ratio * this.m_ratio * bB.m_invI;
      }
      else {
         tMat = g2.m_xf.R;
         tVec = this.m_prismatic2.m_localXAxis1;
         ugX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
         ugY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
         tMat = bB.m_xf.R;
         rX = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
         rY = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
         tX = tMat.col1.x * rX + tMat.col2.x * rY;
         rY = tMat.col1.y * rX + tMat.col2.y * rY;
         rX = tX;
         crug = rX * ugY - rY * ugX;
         this.m_J.linearB.Set((-this.m_ratio * ugX), (-this.m_ratio * ugY));
         this.m_J.angularB = (-this.m_ratio * crug);
         K += this.m_ratio * this.m_ratio * (bB.m_invMass + bB.m_invI * crug * crug);
      }
      this.m_mass = K > 0.0 ? 1.0 / K : 0.0;
      if (step.warmStarting) {
         bA.m_linearVelocity.x += bA.m_invMass * this.m_impulse * this.m_J.linearA.x;
         bA.m_linearVelocity.y += bA.m_invMass * this.m_impulse * this.m_J.linearA.y;
         bA.m_angularVelocity += bA.m_invI * this.m_impulse * this.m_J.angularA;
         bB.m_linearVelocity.x += bB.m_invMass * this.m_impulse * this.m_J.linearB.x;
         bB.m_linearVelocity.y += bB.m_invMass * this.m_impulse * this.m_J.linearB.y;
         bB.m_angularVelocity += bB.m_invI * this.m_impulse * this.m_J.angularB;
      }
      else {
         this.m_impulse = 0.0;
      }
   }
   b2GearJoint.prototype.SolveVelocityConstraints = function (step) {
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var Cdot = this.m_J.Compute(bA.m_linearVelocity, bA.m_angularVelocity, bB.m_linearVelocity, bB.m_angularVelocity);
      var impulse = (-this.m_mass * Cdot);
      this.m_impulse += impulse;
      bA.m_linearVelocity.x += bA.m_invMass * impulse * this.m_J.linearA.x;
      bA.m_linearVelocity.y += bA.m_invMass * impulse * this.m_J.linearA.y;
      bA.m_angularVelocity += bA.m_invI * impulse * this.m_J.angularA;
      bB.m_linearVelocity.x += bB.m_invMass * impulse * this.m_J.linearB.x;
      bB.m_linearVelocity.y += bB.m_invMass * impulse * this.m_J.linearB.y;
      bB.m_angularVelocity += bB.m_invI * impulse * this.m_J.angularB;
   }
   b2GearJoint.prototype.SolvePositionConstraints = function (baumgarte) {
      if (baumgarte === undefined) baumgarte = 0;
      var linearError = 0.0;
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var coordinate1 = 0;
      var coordinate2 = 0;
      if (this.m_revolute1) {
         coordinate1 = this.m_revolute1.GetJointAngle();
      }
      else {
         coordinate1 = this.m_prismatic1.GetJointTranslation();
      }
      if (this.m_revolute2) {
         coordinate2 = this.m_revolute2.GetJointAngle();
      }
      else {
         coordinate2 = this.m_prismatic2.GetJointTranslation();
      }
      var C = this.m_constant - (coordinate1 + this.m_ratio * coordinate2);
      var impulse = (-this.m_mass * C);
      bA.m_sweep.c.x += bA.m_invMass * impulse * this.m_J.linearA.x;
      bA.m_sweep.c.y += bA.m_invMass * impulse * this.m_J.linearA.y;
      bA.m_sweep.a += bA.m_invI * impulse * this.m_J.angularA;
      bB.m_sweep.c.x += bB.m_invMass * impulse * this.m_J.linearB.x;
      bB.m_sweep.c.y += bB.m_invMass * impulse * this.m_J.linearB.y;
      bB.m_sweep.a += bB.m_invI * impulse * this.m_J.angularB;
      bA.SynchronizeTransform();
      bB.SynchronizeTransform();
      return linearError < b2Settings.b2_linearSlop;
   }
   Box2D.inherit(b2GearJointDef, Box2D.Dynamics.Joints.b2JointDef);
   b2GearJointDef.prototype.__super = Box2D.Dynamics.Joints.b2JointDef.prototype;
   b2GearJointDef.b2GearJointDef = function () {
      Box2D.Dynamics.Joints.b2JointDef.b2JointDef.apply(this, arguments);
   };
   b2GearJointDef.prototype.b2GearJointDef = function () {
      this.__super.b2JointDef.call(this);
      this.type = b2Joint.e_gearJoint;
      this.joint1 = null;
      this.joint2 = null;
      this.ratio = 1.0;
   }
   b2Jacobian.b2Jacobian = function () {
      this.linearA = new b2Vec2();
      this.linearB = new b2Vec2();
   };
   b2Jacobian.prototype.SetZero = function () {
      this.linearA.SetZero();
      this.angularA = 0.0;
      this.linearB.SetZero();
      this.angularB = 0.0;
   }
   b2Jacobian.prototype.Set = function (x1, a1, x2, a2) {
      if (a1 === undefined) a1 = 0;
      if (a2 === undefined) a2 = 0;
      this.linearA.SetV(x1);
      this.angularA = a1;
      this.linearB.SetV(x2);
      this.angularB = a2;
   }
   b2Jacobian.prototype.Compute = function (x1, a1, x2, a2) {
      if (a1 === undefined) a1 = 0;
      if (a2 === undefined) a2 = 0;
      return (this.linearA.x * x1.x + this.linearA.y * x1.y) + this.angularA * a1 + (this.linearB.x * x2.x + this.linearB.y * x2.y) + this.angularB * a2;
   }
   b2Joint.b2Joint = function () {
      this.m_edgeA = new b2JointEdge();
      this.m_edgeB = new b2JointEdge();
      this.m_localCenterA = new b2Vec2();
      this.m_localCenterB = new b2Vec2();
   };
   b2Joint.prototype.GetType = function () {
      return this.m_type;
   }
   b2Joint.prototype.GetAnchorA = function () {
      return null;
   }
   b2Joint.prototype.GetAnchorB = function () {
      return null;
   }
   b2Joint.prototype.GetReactionForce = function (inv_dt) {
      if (inv_dt === undefined) inv_dt = 0;
      return null;
   }
   b2Joint.prototype.GetReactionTorque = function (inv_dt) {
      if (inv_dt === undefined) inv_dt = 0;
      return 0.0;
   }
   b2Joint.prototype.GetBodyA = function () {
      return this.m_bodyA;
   }
   b2Joint.prototype.GetBodyB = function () {
      return this.m_bodyB;
   }
   b2Joint.prototype.GetNext = function () {
      return this.m_next;
   }
   b2Joint.prototype.GetUserData = function () {
      return this.m_userData;
   }
   b2Joint.prototype.SetUserData = function (data) {
      this.m_userData = data;
   }
   b2Joint.prototype.IsActive = function () {
      return this.m_bodyA.IsActive() && this.m_bodyB.IsActive();
   }
   b2Joint.Create = function (def, allocator) {
      var joint = null;
      switch (def.type) {
      case b2Joint.e_distanceJoint:
         {
            joint = new b2DistanceJoint((def instanceof b2DistanceJointDef ? def : null));
         }
         break;
      case b2Joint.e_mouseJoint:
         {
            joint = new b2MouseJoint((def instanceof b2MouseJointDef ? def : null));
         }
         break;
      case b2Joint.e_prismaticJoint:
         {
            joint = new b2PrismaticJoint((def instanceof b2PrismaticJointDef ? def : null));
         }
         break;
      case b2Joint.e_revoluteJoint:
         {
            joint = new b2RevoluteJoint((def instanceof b2RevoluteJointDef ? def : null));
         }
         break;
      case b2Joint.e_pulleyJoint:
         {
            joint = new b2PulleyJoint((def instanceof b2PulleyJointDef ? def : null));
         }
         break;
      case b2Joint.e_gearJoint:
         {
            joint = new b2GearJoint((def instanceof b2GearJointDef ? def : null));
         }
         break;
      case b2Joint.e_lineJoint:
         {
            joint = new b2LineJoint((def instanceof b2LineJointDef ? def : null));
         }
         break;
      case b2Joint.e_weldJoint:
         {
            joint = new b2WeldJoint((def instanceof b2WeldJointDef ? def : null));
         }
         break;
      case b2Joint.e_frictionJoint:
         {
            joint = new b2FrictionJoint((def instanceof b2FrictionJointDef ? def : null));
         }
         break;
      default:
         break;
      }
      return joint;
   }
   b2Joint.Destroy = function (joint, allocator) {}
   b2Joint.prototype.b2Joint = function (def) {
      b2Settings.b2Assert(def.bodyA != def.bodyB);
      this.m_type = def.type;
      this.m_prev = null;
      this.m_next = null;
      this.m_bodyA = def.bodyA;
      this.m_bodyB = def.bodyB;
      this.m_collideConnected = def.collideConnected;
      this.m_islandFlag = false;
      this.m_userData = def.userData;
   }
   b2Joint.prototype.InitVelocityConstraints = function (step) {}
   b2Joint.prototype.SolveVelocityConstraints = function (step) {}
   b2Joint.prototype.FinalizeVelocityConstraints = function () {}
   b2Joint.prototype.SolvePositionConstraints = function (baumgarte) {
      if (baumgarte === undefined) baumgarte = 0;
      return false;
   }
   Box2D.postDefs.push(function () {
      Box2D.Dynamics.Joints.b2Joint.e_unknownJoint = 0;
      Box2D.Dynamics.Joints.b2Joint.e_revoluteJoint = 1;
      Box2D.Dynamics.Joints.b2Joint.e_prismaticJoint = 2;
      Box2D.Dynamics.Joints.b2Joint.e_distanceJoint = 3;
      Box2D.Dynamics.Joints.b2Joint.e_pulleyJoint = 4;
      Box2D.Dynamics.Joints.b2Joint.e_mouseJoint = 5;
      Box2D.Dynamics.Joints.b2Joint.e_gearJoint = 6;
      Box2D.Dynamics.Joints.b2Joint.e_lineJoint = 7;
      Box2D.Dynamics.Joints.b2Joint.e_weldJoint = 8;
      Box2D.Dynamics.Joints.b2Joint.e_frictionJoint = 9;
      Box2D.Dynamics.Joints.b2Joint.e_inactiveLimit = 0;
      Box2D.Dynamics.Joints.b2Joint.e_atLowerLimit = 1;
      Box2D.Dynamics.Joints.b2Joint.e_atUpperLimit = 2;
      Box2D.Dynamics.Joints.b2Joint.e_equalLimits = 3;
   });
   b2JointDef.b2JointDef = function () {};
   b2JointDef.prototype.b2JointDef = function () {
      this.type = b2Joint.e_unknownJoint;
      this.userData = null;
      this.bodyA = null;
      this.bodyB = null;
      this.collideConnected = false;
   }
   b2JointEdge.b2JointEdge = function () {};
   Box2D.inherit(b2LineJoint, Box2D.Dynamics.Joints.b2Joint);
   b2LineJoint.prototype.__super = Box2D.Dynamics.Joints.b2Joint.prototype;
   b2LineJoint.b2LineJoint = function () {
      Box2D.Dynamics.Joints.b2Joint.b2Joint.apply(this, arguments);
      this.m_localAnchor1 = new b2Vec2();
      this.m_localAnchor2 = new b2Vec2();
      this.m_localXAxis1 = new b2Vec2();
      this.m_localYAxis1 = new b2Vec2();
      this.m_axis = new b2Vec2();
      this.m_perp = new b2Vec2();
      this.m_K = new b2Mat22();
      this.m_impulse = new b2Vec2();
   };
   b2LineJoint.prototype.GetAnchorA = function () {
      return this.m_bodyA.GetWorldPoint(this.m_localAnchor1);
   }
   b2LineJoint.prototype.GetAnchorB = function () {
      return this.m_bodyB.GetWorldPoint(this.m_localAnchor2);
   }
   b2LineJoint.prototype.GetReactionForce = function (inv_dt) {
      if (inv_dt === undefined) inv_dt = 0;
      return new b2Vec2(inv_dt * (this.m_impulse.x * this.m_perp.x + (this.m_motorImpulse + this.m_impulse.y) * this.m_axis.x), inv_dt * (this.m_impulse.x * this.m_perp.y + (this.m_motorImpulse + this.m_impulse.y) * this.m_axis.y));
   }
   b2LineJoint.prototype.GetReactionTorque = function (inv_dt) {
      if (inv_dt === undefined) inv_dt = 0;
      return inv_dt * this.m_impulse.y;
   }
   b2LineJoint.prototype.GetJointTranslation = function () {
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var tMat;
      var p1 = bA.GetWorldPoint(this.m_localAnchor1);
      var p2 = bB.GetWorldPoint(this.m_localAnchor2);
      var dX = p2.x - p1.x;
      var dY = p2.y - p1.y;
      var axis = bA.GetWorldVector(this.m_localXAxis1);
      var translation = axis.x * dX + axis.y * dY;
      return translation;
   }
   b2LineJoint.prototype.GetJointSpeed = function () {
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var tMat;
      tMat = bA.m_xf.R;
      var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
      var r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
      var tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
      r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
      r1X = tX;
      tMat = bB.m_xf.R;
      var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
      var r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
      tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
      r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
      r2X = tX;
      var p1X = bA.m_sweep.c.x + r1X;
      var p1Y = bA.m_sweep.c.y + r1Y;
      var p2X = bB.m_sweep.c.x + r2X;
      var p2Y = bB.m_sweep.c.y + r2Y;
      var dX = p2X - p1X;
      var dY = p2Y - p1Y;
      var axis = bA.GetWorldVector(this.m_localXAxis1);
      var v1 = bA.m_linearVelocity;
      var v2 = bB.m_linearVelocity;
      var w1 = bA.m_angularVelocity;
      var w2 = bB.m_angularVelocity;
      var speed = (dX * ((-w1 * axis.y)) + dY * (w1 * axis.x)) + (axis.x * (((v2.x + ((-w2 * r2Y))) - v1.x) - ((-w1 * r1Y))) + axis.y * (((v2.y + (w2 * r2X)) - v1.y) - (w1 * r1X)));
      return speed;
   }
   b2LineJoint.prototype.IsLimitEnabled = function () {
      return this.m_enableLimit;
   }
   b2LineJoint.prototype.EnableLimit = function (flag) {
      this.m_bodyA.SetAwake(true);
      this.m_bodyB.SetAwake(true);
      this.m_enableLimit = flag;
   }
   b2LineJoint.prototype.GetLowerLimit = function () {
      return this.m_lowerTranslation;
   }
   b2LineJoint.prototype.GetUpperLimit = function () {
      return this.m_upperTranslation;
   }
   b2LineJoint.prototype.SetLimits = function (lower, upper) {
      if (lower === undefined) lower = 0;
      if (upper === undefined) upper = 0;
      this.m_bodyA.SetAwake(true);
      this.m_bodyB.SetAwake(true);
      this.m_lowerTranslation = lower;
      this.m_upperTranslation = upper;
   }
   b2LineJoint.prototype.IsMotorEnabled = function () {
      return this.m_enableMotor;
   }
   b2LineJoint.prototype.EnableMotor = function (flag) {
      this.m_bodyA.SetAwake(true);
      this.m_bodyB.SetAwake(true);
      this.m_enableMotor = flag;
   }
   b2LineJoint.prototype.SetMotorSpeed = function (speed) {
      if (speed === undefined) speed = 0;
      this.m_bodyA.SetAwake(true);
      this.m_bodyB.SetAwake(true);
      this.m_motorSpeed = speed;
   }
   b2LineJoint.prototype.GetMotorSpeed = function () {
      return this.m_motorSpeed;
   }
   b2LineJoint.prototype.SetMaxMotorForce = function (force) {
      if (force === undefined) force = 0;
      this.m_bodyA.SetAwake(true);
      this.m_bodyB.SetAwake(true);
      this.m_maxMotorForce = force;
   }
   b2LineJoint.prototype.GetMaxMotorForce = function () {
      return this.m_maxMotorForce;
   }
   b2LineJoint.prototype.GetMotorForce = function () {
      return this.m_motorImpulse;
   }
   b2LineJoint.prototype.b2LineJoint = function (def) {
      this.__super.b2Joint.call(this, def);
      var tMat;
      var tX = 0;
      var tY = 0;
      this.m_localAnchor1.SetV(def.localAnchorA);
      this.m_localAnchor2.SetV(def.localAnchorB);
      this.m_localXAxis1.SetV(def.localAxisA);
      this.m_localYAxis1.x = (-this.m_localXAxis1.y);
      this.m_localYAxis1.y = this.m_localXAxis1.x;
      this.m_impulse.SetZero();
      this.m_motorMass = 0.0;
      this.m_motorImpulse = 0.0;
      this.m_lowerTranslation = def.lowerTranslation;
      this.m_upperTranslation = def.upperTranslation;
      this.m_maxMotorForce = def.maxMotorForce;
      this.m_motorSpeed = def.motorSpeed;
      this.m_enableLimit = def.enableLimit;
      this.m_enableMotor = def.enableMotor;
      this.m_limitState = b2Joint.e_inactiveLimit;
      this.m_axis.SetZero();
      this.m_perp.SetZero();
   }
   b2LineJoint.prototype.InitVelocityConstraints = function (step) {
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var tMat;
      var tX = 0;
      this.m_localCenterA.SetV(bA.GetLocalCenter());
      this.m_localCenterB.SetV(bB.GetLocalCenter());
      var xf1 = bA.GetTransform();
      var xf2 = bB.GetTransform();
      tMat = bA.m_xf.R;
      var r1X = this.m_localAnchor1.x - this.m_localCenterA.x;
      var r1Y = this.m_localAnchor1.y - this.m_localCenterA.y;
      tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
      r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
      r1X = tX;
      tMat = bB.m_xf.R;
      var r2X = this.m_localAnchor2.x - this.m_localCenterB.x;
      var r2Y = this.m_localAnchor2.y - this.m_localCenterB.y;
      tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
      r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
      r2X = tX;
      var dX = bB.m_sweep.c.x + r2X - bA.m_sweep.c.x - r1X;
      var dY = bB.m_sweep.c.y + r2Y - bA.m_sweep.c.y - r1Y;
      this.m_invMassA = bA.m_invMass;
      this.m_invMassB = bB.m_invMass;
      this.m_invIA = bA.m_invI;
      this.m_invIB = bB.m_invI; {
         this.m_axis.SetV(b2Math.MulMV(xf1.R, this.m_localXAxis1));
         this.m_a1 = (dX + r1X) * this.m_axis.y - (dY + r1Y) * this.m_axis.x;
         this.m_a2 = r2X * this.m_axis.y - r2Y * this.m_axis.x;
         this.m_motorMass = this.m_invMassA + this.m_invMassB + this.m_invIA * this.m_a1 * this.m_a1 + this.m_invIB * this.m_a2 * this.m_a2;
         this.m_motorMass = this.m_motorMass > Number.MIN_VALUE ? 1.0 / this.m_motorMass : 0.0;
      } {
         this.m_perp.SetV(b2Math.MulMV(xf1.R, this.m_localYAxis1));
         this.m_s1 = (dX + r1X) * this.m_perp.y - (dY + r1Y) * this.m_perp.x;
         this.m_s2 = r2X * this.m_perp.y - r2Y * this.m_perp.x;
         var m1 = this.m_invMassA;
         var m2 = this.m_invMassB;
         var i1 = this.m_invIA;
         var i2 = this.m_invIB;
         this.m_K.col1.x = m1 + m2 + i1 * this.m_s1 * this.m_s1 + i2 * this.m_s2 * this.m_s2;
         this.m_K.col1.y = i1 * this.m_s1 * this.m_a1 + i2 * this.m_s2 * this.m_a2;
         this.m_K.col2.x = this.m_K.col1.y;
         this.m_K.col2.y = m1 + m2 + i1 * this.m_a1 * this.m_a1 + i2 * this.m_a2 * this.m_a2;
      }
      if (this.m_enableLimit) {
         var jointTransition = this.m_axis.x * dX + this.m_axis.y * dY;
         if (b2Math.Abs(this.m_upperTranslation - this.m_lowerTranslation) < 2.0 * b2Settings.b2_linearSlop) {
            this.m_limitState = b2Joint.e_equalLimits;
         }
         else if (jointTransition <= this.m_lowerTranslation) {
            if (this.m_limitState != b2Joint.e_atLowerLimit) {
               this.m_limitState = b2Joint.e_atLowerLimit;
               this.m_impulse.y = 0.0;
            }
         }
         else if (jointTransition >= this.m_upperTranslation) {
            if (this.m_limitState != b2Joint.e_atUpperLimit) {
               this.m_limitState = b2Joint.e_atUpperLimit;
               this.m_impulse.y = 0.0;
            }
         }
         else {
            this.m_limitState = b2Joint.e_inactiveLimit;
            this.m_impulse.y = 0.0;
         }
      }
      else {
         this.m_limitState = b2Joint.e_inactiveLimit;
      }
      if (this.m_enableMotor == false) {
         this.m_motorImpulse = 0.0;
      }
      if (step.warmStarting) {
         this.m_impulse.x *= step.dtRatio;
         this.m_impulse.y *= step.dtRatio;
         this.m_motorImpulse *= step.dtRatio;
         var PX = this.m_impulse.x * this.m_perp.x + (this.m_motorImpulse + this.m_impulse.y) * this.m_axis.x;
         var PY = this.m_impulse.x * this.m_perp.y + (this.m_motorImpulse + this.m_impulse.y) * this.m_axis.y;
         var L1 = this.m_impulse.x * this.m_s1 + (this.m_motorImpulse + this.m_impulse.y) * this.m_a1;
         var L2 = this.m_impulse.x * this.m_s2 + (this.m_motorImpulse + this.m_impulse.y) * this.m_a2;
         bA.m_linearVelocity.x -= this.m_invMassA * PX;
         bA.m_linearVelocity.y -= this.m_invMassA * PY;
         bA.m_angularVelocity -= this.m_invIA * L1;
         bB.m_linearVelocity.x += this.m_invMassB * PX;
         bB.m_linearVelocity.y += this.m_invMassB * PY;
         bB.m_angularVelocity += this.m_invIB * L2;
      }
      else {
         this.m_impulse.SetZero();
         this.m_motorImpulse = 0.0;
      }
   }
   b2LineJoint.prototype.SolveVelocityConstraints = function (step) {
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var v1 = bA.m_linearVelocity;
      var w1 = bA.m_angularVelocity;
      var v2 = bB.m_linearVelocity;
      var w2 = bB.m_angularVelocity;
      var PX = 0;
      var PY = 0;
      var L1 = 0;
      var L2 = 0;
      if (this.m_enableMotor && this.m_limitState != b2Joint.e_equalLimits) {
         var Cdot = this.m_axis.x * (v2.x - v1.x) + this.m_axis.y * (v2.y - v1.y) + this.m_a2 * w2 - this.m_a1 * w1;
         var impulse = this.m_motorMass * (this.m_motorSpeed - Cdot);
         var oldImpulse = this.m_motorImpulse;
         var maxImpulse = step.dt * this.m_maxMotorForce;
         this.m_motorImpulse = b2Math.Clamp(this.m_motorImpulse + impulse, (-maxImpulse), maxImpulse);
         impulse = this.m_motorImpulse - oldImpulse;
         PX = impulse * this.m_axis.x;
         PY = impulse * this.m_axis.y;
         L1 = impulse * this.m_a1;
         L2 = impulse * this.m_a2;
         v1.x -= this.m_invMassA * PX;
         v1.y -= this.m_invMassA * PY;
         w1 -= this.m_invIA * L1;
         v2.x += this.m_invMassB * PX;
         v2.y += this.m_invMassB * PY;
         w2 += this.m_invIB * L2;
      }
      var Cdot1 = this.m_perp.x * (v2.x - v1.x) + this.m_perp.y * (v2.y - v1.y) + this.m_s2 * w2 - this.m_s1 * w1;
      if (this.m_enableLimit && this.m_limitState != b2Joint.e_inactiveLimit) {
         var Cdot2 = this.m_axis.x * (v2.x - v1.x) + this.m_axis.y * (v2.y - v1.y) + this.m_a2 * w2 - this.m_a1 * w1;
         var f1 = this.m_impulse.Copy();
         var df = this.m_K.Solve(new b2Vec2(), (-Cdot1), (-Cdot2));
         this.m_impulse.Add(df);
         if (this.m_limitState == b2Joint.e_atLowerLimit) {
            this.m_impulse.y = b2Math.Max(this.m_impulse.y, 0.0);
         }
         else if (this.m_limitState == b2Joint.e_atUpperLimit) {
            this.m_impulse.y = b2Math.Min(this.m_impulse.y, 0.0);
         }
         var b = (-Cdot1) - (this.m_impulse.y - f1.y) * this.m_K.col2.x;
         var f2r = 0;
         if (this.m_K.col1.x != 0.0) {
            f2r = b / this.m_K.col1.x + f1.x;
         }
         else {
            f2r = f1.x;
         }
         this.m_impulse.x = f2r;
         df.x = this.m_impulse.x - f1.x;
         df.y = this.m_impulse.y - f1.y;
         PX = df.x * this.m_perp.x + df.y * this.m_axis.x;
         PY = df.x * this.m_perp.y + df.y * this.m_axis.y;
         L1 = df.x * this.m_s1 + df.y * this.m_a1;
         L2 = df.x * this.m_s2 + df.y * this.m_a2;
         v1.x -= this.m_invMassA * PX;
         v1.y -= this.m_invMassA * PY;
         w1 -= this.m_invIA * L1;
         v2.x += this.m_invMassB * PX;
         v2.y += this.m_invMassB * PY;
         w2 += this.m_invIB * L2;
      }
      else {
         var df2 = 0;
         if (this.m_K.col1.x != 0.0) {
            df2 = ((-Cdot1)) / this.m_K.col1.x;
         }
         else {
            df2 = 0.0;
         }
         this.m_impulse.x += df2;
         PX = df2 * this.m_perp.x;
         PY = df2 * this.m_perp.y;
         L1 = df2 * this.m_s1;
         L2 = df2 * this.m_s2;
         v1.x -= this.m_invMassA * PX;
         v1.y -= this.m_invMassA * PY;
         w1 -= this.m_invIA * L1;
         v2.x += this.m_invMassB * PX;
         v2.y += this.m_invMassB * PY;
         w2 += this.m_invIB * L2;
      }
      bA.m_linearVelocity.SetV(v1);
      bA.m_angularVelocity = w1;
      bB.m_linearVelocity.SetV(v2);
      bB.m_angularVelocity = w2;
   }
   b2LineJoint.prototype.SolvePositionConstraints = function (baumgarte) {
      if (baumgarte === undefined) baumgarte = 0;
      var limitC = 0;
      var oldLimitImpulse = 0;
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var c1 = bA.m_sweep.c;
      var a1 = bA.m_sweep.a;
      var c2 = bB.m_sweep.c;
      var a2 = bB.m_sweep.a;
      var tMat;
      var tX = 0;
      var m1 = 0;
      var m2 = 0;
      var i1 = 0;
      var i2 = 0;
      var linearError = 0.0;
      var angularError = 0.0;
      var active = false;
      var C2 = 0.0;
      var R1 = b2Mat22.FromAngle(a1);
      var R2 = b2Mat22.FromAngle(a2);
      tMat = R1;
      var r1X = this.m_localAnchor1.x - this.m_localCenterA.x;
      var r1Y = this.m_localAnchor1.y - this.m_localCenterA.y;
      tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
      r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
      r1X = tX;
      tMat = R2;
      var r2X = this.m_localAnchor2.x - this.m_localCenterB.x;
      var r2Y = this.m_localAnchor2.y - this.m_localCenterB.y;
      tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
      r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
      r2X = tX;
      var dX = c2.x + r2X - c1.x - r1X;
      var dY = c2.y + r2Y - c1.y - r1Y;
      if (this.m_enableLimit) {
         this.m_axis = b2Math.MulMV(R1, this.m_localXAxis1);
         this.m_a1 = (dX + r1X) * this.m_axis.y - (dY + r1Y) * this.m_axis.x;
         this.m_a2 = r2X * this.m_axis.y - r2Y * this.m_axis.x;
         var translation = this.m_axis.x * dX + this.m_axis.y * dY;
         if (b2Math.Abs(this.m_upperTranslation - this.m_lowerTranslation) < 2.0 * b2Settings.b2_linearSlop) {
            C2 = b2Math.Clamp(translation, (-b2Settings.b2_maxLinearCorrection), b2Settings.b2_maxLinearCorrection);
            linearError = b2Math.Abs(translation);
            active = true;
         }
         else if (translation <= this.m_lowerTranslation) {
            C2 = b2Math.Clamp(translation - this.m_lowerTranslation + b2Settings.b2_linearSlop, (-b2Settings.b2_maxLinearCorrection), 0.0);
            linearError = this.m_lowerTranslation - translation;
            active = true;
         }
         else if (translation >= this.m_upperTranslation) {
            C2 = b2Math.Clamp(translation - this.m_upperTranslation + b2Settings.b2_linearSlop, 0.0, b2Settings.b2_maxLinearCorrection);
            linearError = translation - this.m_upperTranslation;
            active = true;
         }
      }
      this.m_perp = b2Math.MulMV(R1, this.m_localYAxis1);
      this.m_s1 = (dX + r1X) * this.m_perp.y - (dY + r1Y) * this.m_perp.x;
      this.m_s2 = r2X * this.m_perp.y - r2Y * this.m_perp.x;
      var impulse = new b2Vec2();
      var C1 = this.m_perp.x * dX + this.m_perp.y * dY;
      linearError = b2Math.Max(linearError, b2Math.Abs(C1));
      angularError = 0.0;
      if (active) {
         m1 = this.m_invMassA;
         m2 = this.m_invMassB;
         i1 = this.m_invIA;
         i2 = this.m_invIB;
         this.m_K.col1.x = m1 + m2 + i1 * this.m_s1 * this.m_s1 + i2 * this.m_s2 * this.m_s2;
         this.m_K.col1.y = i1 * this.m_s1 * this.m_a1 + i2 * this.m_s2 * this.m_a2;
         this.m_K.col2.x = this.m_K.col1.y;
         this.m_K.col2.y = m1 + m2 + i1 * this.m_a1 * this.m_a1 + i2 * this.m_a2 * this.m_a2;
         this.m_K.Solve(impulse, (-C1), (-C2));
      }
      else {
         m1 = this.m_invMassA;
         m2 = this.m_invMassB;
         i1 = this.m_invIA;
         i2 = this.m_invIB;
         var k11 = m1 + m2 + i1 * this.m_s1 * this.m_s1 + i2 * this.m_s2 * this.m_s2;
         var impulse1 = 0;
         if (k11 != 0.0) {
            impulse1 = ((-C1)) / k11;
         }
         else {
            impulse1 = 0.0;
         }
         impulse.x = impulse1;
         impulse.y = 0.0;
      }
      var PX = impulse.x * this.m_perp.x + impulse.y * this.m_axis.x;
      var PY = impulse.x * this.m_perp.y + impulse.y * this.m_axis.y;
      var L1 = impulse.x * this.m_s1 + impulse.y * this.m_a1;
      var L2 = impulse.x * this.m_s2 + impulse.y * this.m_a2;
      c1.x -= this.m_invMassA * PX;
      c1.y -= this.m_invMassA * PY;
      a1 -= this.m_invIA * L1;
      c2.x += this.m_invMassB * PX;
      c2.y += this.m_invMassB * PY;
      a2 += this.m_invIB * L2;
      bA.m_sweep.a = a1;
      bB.m_sweep.a = a2;
      bA.SynchronizeTransform();
      bB.SynchronizeTransform();
      return linearError <= b2Settings.b2_linearSlop && angularError <= b2Settings.b2_angularSlop;
   }
   Box2D.inherit(b2LineJointDef, Box2D.Dynamics.Joints.b2JointDef);
   b2LineJointDef.prototype.__super = Box2D.Dynamics.Joints.b2JointDef.prototype;
   b2LineJointDef.b2LineJointDef = function () {
      Box2D.Dynamics.Joints.b2JointDef.b2JointDef.apply(this, arguments);
      this.localAnchorA = new b2Vec2();
      this.localAnchorB = new b2Vec2();
      this.localAxisA = new b2Vec2();
   };
   b2LineJointDef.prototype.b2LineJointDef = function () {
      this.__super.b2JointDef.call(this);
      this.type = b2Joint.e_lineJoint;
      this.localAxisA.Set(1.0, 0.0);
      this.enableLimit = false;
      this.lowerTranslation = 0.0;
      this.upperTranslation = 0.0;
      this.enableMotor = false;
      this.maxMotorForce = 0.0;
      this.motorSpeed = 0.0;
   }
   b2LineJointDef.prototype.Initialize = function (bA, bB, anchor, axis) {
      this.bodyA = bA;
      this.bodyB = bB;
      this.localAnchorA = this.bodyA.GetLocalPoint(anchor);
      this.localAnchorB = this.bodyB.GetLocalPoint(anchor);
      this.localAxisA = this.bodyA.GetLocalVector(axis);
   }
   Box2D.inherit(b2MouseJoint, Box2D.Dynamics.Joints.b2Joint);
   b2MouseJoint.prototype.__super = Box2D.Dynamics.Joints.b2Joint.prototype;
   b2MouseJoint.b2MouseJoint = function () {
      Box2D.Dynamics.Joints.b2Joint.b2Joint.apply(this, arguments);
      this.K = new b2Mat22();
      this.K1 = new b2Mat22();
      this.K2 = new b2Mat22();
      this.m_localAnchor = new b2Vec2();
      this.m_target = new b2Vec2();
      this.m_impulse = new b2Vec2();
      this.m_mass = new b2Mat22();
      this.m_C = new b2Vec2();
   };
   b2MouseJoint.prototype.GetAnchorA = function () {
      return this.m_target;
   }
   b2MouseJoint.prototype.GetAnchorB = function () {
      return this.m_bodyB.GetWorldPoint(this.m_localAnchor);
   }
   b2MouseJoint.prototype.GetReactionForce = function (inv_dt) {
      if (inv_dt === undefined) inv_dt = 0;
      return new b2Vec2(inv_dt * this.m_impulse.x, inv_dt * this.m_impulse.y);
   }
   b2MouseJoint.prototype.GetReactionTorque = function (inv_dt) {
      if (inv_dt === undefined) inv_dt = 0;
      return 0.0;
   }
   b2MouseJoint.prototype.GetTarget = function () {
      return this.m_target;
   }
   b2MouseJoint.prototype.SetTarget = function (target) {
      if (this.m_bodyB.IsAwake() == false) {
         this.m_bodyB.SetAwake(true);
      }
      this.m_target = target;
   }
   b2MouseJoint.prototype.GetMaxForce = function () {
      return this.m_maxForce;
   }
   b2MouseJoint.prototype.SetMaxForce = function (maxForce) {
      if (maxForce === undefined) maxForce = 0;
      this.m_maxForce = maxForce;
   }
   b2MouseJoint.prototype.GetFrequency = function () {
      return this.m_frequencyHz;
   }
   b2MouseJoint.prototype.SetFrequency = function (hz) {
      if (hz === undefined) hz = 0;
      this.m_frequencyHz = hz;
   }
   b2MouseJoint.prototype.GetDampingRatio = function () {
      return this.m_dampingRatio;
   }
   b2MouseJoint.prototype.SetDampingRatio = function (ratio) {
      if (ratio === undefined) ratio = 0;
      this.m_dampingRatio = ratio;
   }
   b2MouseJoint.prototype.b2MouseJoint = function (def) {
      this.__super.b2Joint.call(this, def);
      this.m_target.SetV(def.target);
      var tX = this.m_target.x - this.m_bodyB.m_xf.position.x;
      var tY = this.m_target.y - this.m_bodyB.m_xf.position.y;
      var tMat = this.m_bodyB.m_xf.R;
      this.m_localAnchor.x = (tX * tMat.col1.x + tY * tMat.col1.y);
      this.m_localAnchor.y = (tX * tMat.col2.x + tY * tMat.col2.y);
      this.m_maxForce = def.maxForce;
      this.m_impulse.SetZero();
      this.m_frequencyHz = def.frequencyHz;
      this.m_dampingRatio = def.dampingRatio;
      this.m_beta = 0.0;
      this.m_gamma = 0.0;
   }
   b2MouseJoint.prototype.InitVelocityConstraints = function (step) {
      var b = this.m_bodyB;
      var mass = b.GetMass();
      var omega = 2.0 * Math.PI * this.m_frequencyHz;
      var d = 2.0 * mass * this.m_dampingRatio * omega;
      var k = mass * omega * omega;
      this.m_gamma = step.dt * (d + step.dt * k);
      this.m_gamma = this.m_gamma != 0 ? 1 / this.m_gamma : 0.0;
      this.m_beta = step.dt * k * this.m_gamma;
      var tMat;tMat = b.m_xf.R;
      var rX = this.m_localAnchor.x - b.m_sweep.localCenter.x;
      var rY = this.m_localAnchor.y - b.m_sweep.localCenter.y;
      var tX = (tMat.col1.x * rX + tMat.col2.x * rY);rY = (tMat.col1.y * rX + tMat.col2.y * rY);
      rX = tX;
      var invMass = b.m_invMass;
      var invI = b.m_invI;this.K1.col1.x = invMass;
      this.K1.col2.x = 0.0;
      this.K1.col1.y = 0.0;
      this.K1.col2.y = invMass;
      this.K2.col1.x = invI * rY * rY;
      this.K2.col2.x = (-invI * rX * rY);
      this.K2.col1.y = (-invI * rX * rY);
      this.K2.col2.y = invI * rX * rX;
      this.K.SetM(this.K1);
      this.K.AddM(this.K2);
      this.K.col1.x += this.m_gamma;
      this.K.col2.y += this.m_gamma;
      this.K.GetInverse(this.m_mass);
      this.m_C.x = b.m_sweep.c.x + rX - this.m_target.x;
      this.m_C.y = b.m_sweep.c.y + rY - this.m_target.y;
      b.m_angularVelocity *= 0.98;
      this.m_impulse.x *= step.dtRatio;
      this.m_impulse.y *= step.dtRatio;
      b.m_linearVelocity.x += invMass * this.m_impulse.x;
      b.m_linearVelocity.y += invMass * this.m_impulse.y;
      b.m_angularVelocity += invI * (rX * this.m_impulse.y - rY * this.m_impulse.x);
   }
   b2MouseJoint.prototype.SolveVelocityConstraints = function (step) {
      var b = this.m_bodyB;
      var tMat;
      var tX = 0;
      var tY = 0;
      tMat = b.m_xf.R;
      var rX = this.m_localAnchor.x - b.m_sweep.localCenter.x;
      var rY = this.m_localAnchor.y - b.m_sweep.localCenter.y;
      tX = (tMat.col1.x * rX + tMat.col2.x * rY);
      rY = (tMat.col1.y * rX + tMat.col2.y * rY);
      rX = tX;
      var CdotX = b.m_linearVelocity.x + ((-b.m_angularVelocity * rY));
      var CdotY = b.m_linearVelocity.y + (b.m_angularVelocity * rX);
      tMat = this.m_mass;
      tX = CdotX + this.m_beta * this.m_C.x + this.m_gamma * this.m_impulse.x;
      tY = CdotY + this.m_beta * this.m_C.y + this.m_gamma * this.m_impulse.y;
      var impulseX = (-(tMat.col1.x * tX + tMat.col2.x * tY));
      var impulseY = (-(tMat.col1.y * tX + tMat.col2.y * tY));
      var oldImpulseX = this.m_impulse.x;
      var oldImpulseY = this.m_impulse.y;
      this.m_impulse.x += impulseX;
      this.m_impulse.y += impulseY;
      var maxImpulse = step.dt * this.m_maxForce;
      if (this.m_impulse.LengthSquared() > maxImpulse * maxImpulse) {
         this.m_impulse.Multiply(maxImpulse / this.m_impulse.Length());
      }
      impulseX = this.m_impulse.x - oldImpulseX;
      impulseY = this.m_impulse.y - oldImpulseY;
      b.m_linearVelocity.x += b.m_invMass * impulseX;
      b.m_linearVelocity.y += b.m_invMass * impulseY;
      b.m_angularVelocity += b.m_invI * (rX * impulseY - rY * impulseX);
   }
   b2MouseJoint.prototype.SolvePositionConstraints = function (baumgarte) {
      if (baumgarte === undefined) baumgarte = 0;
      return true;
   }
   Box2D.inherit(b2MouseJointDef, Box2D.Dynamics.Joints.b2JointDef);
   b2MouseJointDef.prototype.__super = Box2D.Dynamics.Joints.b2JointDef.prototype;
   b2MouseJointDef.b2MouseJointDef = function () {
      Box2D.Dynamics.Joints.b2JointDef.b2JointDef.apply(this, arguments);
      this.target = new b2Vec2();
   };
   b2MouseJointDef.prototype.b2MouseJointDef = function () {
      this.__super.b2JointDef.call(this);
      this.type = b2Joint.e_mouseJoint;
      this.maxForce = 0.0;
      this.frequencyHz = 5.0;
      this.dampingRatio = 0.7;
   }
   Box2D.inherit(b2PrismaticJoint, Box2D.Dynamics.Joints.b2Joint);
   b2PrismaticJoint.prototype.__super = Box2D.Dynamics.Joints.b2Joint.prototype;
   b2PrismaticJoint.b2PrismaticJoint = function () {
      Box2D.Dynamics.Joints.b2Joint.b2Joint.apply(this, arguments);
      this.m_localAnchor1 = new b2Vec2();
      this.m_localAnchor2 = new b2Vec2();
      this.m_localXAxis1 = new b2Vec2();
      this.m_localYAxis1 = new b2Vec2();
      this.m_axis = new b2Vec2();
      this.m_perp = new b2Vec2();
      this.m_K = new b2Mat33();
      this.m_impulse = new b2Vec3();
   };
   b2PrismaticJoint.prototype.GetAnchorA = function () {
      return this.m_bodyA.GetWorldPoint(this.m_localAnchor1);
   }
   b2PrismaticJoint.prototype.GetAnchorB = function () {
      return this.m_bodyB.GetWorldPoint(this.m_localAnchor2);
   }
   b2PrismaticJoint.prototype.GetReactionForce = function (inv_dt) {
      if (inv_dt === undefined) inv_dt = 0;
      return new b2Vec2(inv_dt * (this.m_impulse.x * this.m_perp.x + (this.m_motorImpulse + this.m_impulse.z) * this.m_axis.x), inv_dt * (this.m_impulse.x * this.m_perp.y + (this.m_motorImpulse + this.m_impulse.z) * this.m_axis.y));
   }
   b2PrismaticJoint.prototype.GetReactionTorque = function (inv_dt) {
      if (inv_dt === undefined) inv_dt = 0;
      return inv_dt * this.m_impulse.y;
   }
   b2PrismaticJoint.prototype.GetJointTranslation = function () {
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var tMat;
      var p1 = bA.GetWorldPoint(this.m_localAnchor1);
      var p2 = bB.GetWorldPoint(this.m_localAnchor2);
      var dX = p2.x - p1.x;
      var dY = p2.y - p1.y;
      var axis = bA.GetWorldVector(this.m_localXAxis1);
      var translation = axis.x * dX + axis.y * dY;
      return translation;
   }
   b2PrismaticJoint.prototype.GetJointSpeed = function () {
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var tMat;
      tMat = bA.m_xf.R;
      var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
      var r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
      var tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
      r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
      r1X = tX;
      tMat = bB.m_xf.R;
      var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
      var r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
      tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
      r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
      r2X = tX;
      var p1X = bA.m_sweep.c.x + r1X;
      var p1Y = bA.m_sweep.c.y + r1Y;
      var p2X = bB.m_sweep.c.x + r2X;
      var p2Y = bB.m_sweep.c.y + r2Y;
      var dX = p2X - p1X;
      var dY = p2Y - p1Y;
      var axis = bA.GetWorldVector(this.m_localXAxis1);
      var v1 = bA.m_linearVelocity;
      var v2 = bB.m_linearVelocity;
      var w1 = bA.m_angularVelocity;
      var w2 = bB.m_angularVelocity;
      var speed = (dX * ((-w1 * axis.y)) + dY * (w1 * axis.x)) + (axis.x * (((v2.x + ((-w2 * r2Y))) - v1.x) - ((-w1 * r1Y))) + axis.y * (((v2.y + (w2 * r2X)) - v1.y) - (w1 * r1X)));
      return speed;
   }
   b2PrismaticJoint.prototype.IsLimitEnabled = function () {
      return this.m_enableLimit;
   }
   b2PrismaticJoint.prototype.EnableLimit = function (flag) {
      this.m_bodyA.SetAwake(true);
      this.m_bodyB.SetAwake(true);
      this.m_enableLimit = flag;
   }
   b2PrismaticJoint.prototype.GetLowerLimit = function () {
      return this.m_lowerTranslation;
   }
   b2PrismaticJoint.prototype.GetUpperLimit = function () {
      return this.m_upperTranslation;
   }
   b2PrismaticJoint.prototype.SetLimits = function (lower, upper) {
      if (lower === undefined) lower = 0;
      if (upper === undefined) upper = 0;
      this.m_bodyA.SetAwake(true);
      this.m_bodyB.SetAwake(true);
      this.m_lowerTranslation = lower;
      this.m_upperTranslation = upper;
   }
   b2PrismaticJoint.prototype.IsMotorEnabled = function () {
      return this.m_enableMotor;
   }
   b2PrismaticJoint.prototype.EnableMotor = function (flag) {
      this.m_bodyA.SetAwake(true);
      this.m_bodyB.SetAwake(true);
      this.m_enableMotor = flag;
   }
   b2PrismaticJoint.prototype.SetMotorSpeed = function (speed) {
      if (speed === undefined) speed = 0;
      this.m_bodyA.SetAwake(true);
      this.m_bodyB.SetAwake(true);
      this.m_motorSpeed = speed;
   }
   b2PrismaticJoint.prototype.GetMotorSpeed = function () {
      return this.m_motorSpeed;
   }
   b2PrismaticJoint.prototype.SetMaxMotorForce = function (force) {
      if (force === undefined) force = 0;
      this.m_bodyA.SetAwake(true);
      this.m_bodyB.SetAwake(true);
      this.m_maxMotorForce = force;
   }
   b2PrismaticJoint.prototype.GetMotorForce = function () {
      return this.m_motorImpulse;
   }
   b2PrismaticJoint.prototype.b2PrismaticJoint = function (def) {
      this.__super.b2Joint.call(this, def);
      var tMat;
      var tX = 0;
      var tY = 0;
      this.m_localAnchor1.SetV(def.localAnchorA);
      this.m_localAnchor2.SetV(def.localAnchorB);
      this.m_localXAxis1.SetV(def.localAxisA);
      this.m_localYAxis1.x = (-this.m_localXAxis1.y);
      this.m_localYAxis1.y = this.m_localXAxis1.x;
      this.m_refAngle = def.referenceAngle;
      this.m_impulse.SetZero();
      this.m_motorMass = 0.0;
      this.m_motorImpulse = 0.0;
      this.m_lowerTranslation = def.lowerTranslation;
      this.m_upperTranslation = def.upperTranslation;
      this.m_maxMotorForce = def.maxMotorForce;
      this.m_motorSpeed = def.motorSpeed;
      this.m_enableLimit = def.enableLimit;
      this.m_enableMotor = def.enableMotor;
      this.m_limitState = b2Joint.e_inactiveLimit;
      this.m_axis.SetZero();
      this.m_perp.SetZero();
   }
   b2PrismaticJoint.prototype.InitVelocityConstraints = function (step) {
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var tMat;
      var tX = 0;
      this.m_localCenterA.SetV(bA.GetLocalCenter());
      this.m_localCenterB.SetV(bB.GetLocalCenter());
      var xf1 = bA.GetTransform();
      var xf2 = bB.GetTransform();
      tMat = bA.m_xf.R;
      var r1X = this.m_localAnchor1.x - this.m_localCenterA.x;
      var r1Y = this.m_localAnchor1.y - this.m_localCenterA.y;
      tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
      r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
      r1X = tX;
      tMat = bB.m_xf.R;
      var r2X = this.m_localAnchor2.x - this.m_localCenterB.x;
      var r2Y = this.m_localAnchor2.y - this.m_localCenterB.y;
      tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
      r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
      r2X = tX;
      var dX = bB.m_sweep.c.x + r2X - bA.m_sweep.c.x - r1X;
      var dY = bB.m_sweep.c.y + r2Y - bA.m_sweep.c.y - r1Y;
      this.m_invMassA = bA.m_invMass;
      this.m_invMassB = bB.m_invMass;
      this.m_invIA = bA.m_invI;
      this.m_invIB = bB.m_invI; {
         this.m_axis.SetV(b2Math.MulMV(xf1.R, this.m_localXAxis1));
         this.m_a1 = (dX + r1X) * this.m_axis.y - (dY + r1Y) * this.m_axis.x;
         this.m_a2 = r2X * this.m_axis.y - r2Y * this.m_axis.x;
         this.m_motorMass = this.m_invMassA + this.m_invMassB + this.m_invIA * this.m_a1 * this.m_a1 + this.m_invIB * this.m_a2 * this.m_a2;
         if (this.m_motorMass > Number.MIN_VALUE) this.m_motorMass = 1.0 / this.m_motorMass;
      } {
         this.m_perp.SetV(b2Math.MulMV(xf1.R, this.m_localYAxis1));
         this.m_s1 = (dX + r1X) * this.m_perp.y - (dY + r1Y) * this.m_perp.x;
         this.m_s2 = r2X * this.m_perp.y - r2Y * this.m_perp.x;
         var m1 = this.m_invMassA;
         var m2 = this.m_invMassB;
         var i1 = this.m_invIA;
         var i2 = this.m_invIB;
         this.m_K.col1.x = m1 + m2 + i1 * this.m_s1 * this.m_s1 + i2 * this.m_s2 * this.m_s2;
         this.m_K.col1.y = i1 * this.m_s1 + i2 * this.m_s2;
         this.m_K.col1.z = i1 * this.m_s1 * this.m_a1 + i2 * this.m_s2 * this.m_a2;
         this.m_K.col2.x = this.m_K.col1.y;
         this.m_K.col2.y = i1 + i2;
         this.m_K.col2.z = i1 * this.m_a1 + i2 * this.m_a2;
         this.m_K.col3.x = this.m_K.col1.z;
         this.m_K.col3.y = this.m_K.col2.z;
         this.m_K.col3.z = m1 + m2 + i1 * this.m_a1 * this.m_a1 + i2 * this.m_a2 * this.m_a2;
      }
      if (this.m_enableLimit) {
         var jointTransition = this.m_axis.x * dX + this.m_axis.y * dY;
         if (b2Math.Abs(this.m_upperTranslation - this.m_lowerTranslation) < 2.0 * b2Settings.b2_linearSlop) {
            this.m_limitState = b2Joint.e_equalLimits;
         }
         else if (jointTransition <= this.m_lowerTranslation) {
            if (this.m_limitState != b2Joint.e_atLowerLimit) {
               this.m_limitState = b2Joint.e_atLowerLimit;
               this.m_impulse.z = 0.0;
            }
         }
         else if (jointTransition >= this.m_upperTranslation) {
            if (this.m_limitState != b2Joint.e_atUpperLimit) {
               this.m_limitState = b2Joint.e_atUpperLimit;
               this.m_impulse.z = 0.0;
            }
         }
         else {
            this.m_limitState = b2Joint.e_inactiveLimit;
            this.m_impulse.z = 0.0;
         }
      }
      else {
         this.m_limitState = b2Joint.e_inactiveLimit;
      }
      if (this.m_enableMotor == false) {
         this.m_motorImpulse = 0.0;
      }
      if (step.warmStarting) {
         this.m_impulse.x *= step.dtRatio;
         this.m_impulse.y *= step.dtRatio;
         this.m_motorImpulse *= step.dtRatio;
         var PX = this.m_impulse.x * this.m_perp.x + (this.m_motorImpulse + this.m_impulse.z) * this.m_axis.x;
         var PY = this.m_impulse.x * this.m_perp.y + (this.m_motorImpulse + this.m_impulse.z) * this.m_axis.y;
         var L1 = this.m_impulse.x * this.m_s1 + this.m_impulse.y + (this.m_motorImpulse + this.m_impulse.z) * this.m_a1;
         var L2 = this.m_impulse.x * this.m_s2 + this.m_impulse.y + (this.m_motorImpulse + this.m_impulse.z) * this.m_a2;
         bA.m_linearVelocity.x -= this.m_invMassA * PX;
         bA.m_linearVelocity.y -= this.m_invMassA * PY;
         bA.m_angularVelocity -= this.m_invIA * L1;
         bB.m_linearVelocity.x += this.m_invMassB * PX;
         bB.m_linearVelocity.y += this.m_invMassB * PY;
         bB.m_angularVelocity += this.m_invIB * L2;
      }
      else {
         this.m_impulse.SetZero();
         this.m_motorImpulse = 0.0;
      }
   }
   b2PrismaticJoint.prototype.SolveVelocityConstraints = function (step) {
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var v1 = bA.m_linearVelocity;
      var w1 = bA.m_angularVelocity;
      var v2 = bB.m_linearVelocity;
      var w2 = bB.m_angularVelocity;
      var PX = 0;
      var PY = 0;
      var L1 = 0;
      var L2 = 0;
      if (this.m_enableMotor && this.m_limitState != b2Joint.e_equalLimits) {
         var Cdot = this.m_axis.x * (v2.x - v1.x) + this.m_axis.y * (v2.y - v1.y) + this.m_a2 * w2 - this.m_a1 * w1;
         var impulse = this.m_motorMass * (this.m_motorSpeed - Cdot);
         var oldImpulse = this.m_motorImpulse;
         var maxImpulse = step.dt * this.m_maxMotorForce;
         this.m_motorImpulse = b2Math.Clamp(this.m_motorImpulse + impulse, (-maxImpulse), maxImpulse);
         impulse = this.m_motorImpulse - oldImpulse;
         PX = impulse * this.m_axis.x;
         PY = impulse * this.m_axis.y;
         L1 = impulse * this.m_a1;
         L2 = impulse * this.m_a2;
         v1.x -= this.m_invMassA * PX;
         v1.y -= this.m_invMassA * PY;
         w1 -= this.m_invIA * L1;
         v2.x += this.m_invMassB * PX;
         v2.y += this.m_invMassB * PY;
         w2 += this.m_invIB * L2;
      }
      var Cdot1X = this.m_perp.x * (v2.x - v1.x) + this.m_perp.y * (v2.y - v1.y) + this.m_s2 * w2 - this.m_s1 * w1;
      var Cdot1Y = w2 - w1;
      if (this.m_enableLimit && this.m_limitState != b2Joint.e_inactiveLimit) {
         var Cdot2 = this.m_axis.x * (v2.x - v1.x) + this.m_axis.y * (v2.y - v1.y) + this.m_a2 * w2 - this.m_a1 * w1;
         var f1 = this.m_impulse.Copy();
         var df = this.m_K.Solve33(new b2Vec3(), (-Cdot1X), (-Cdot1Y), (-Cdot2));
         this.m_impulse.Add(df);
         if (this.m_limitState == b2Joint.e_atLowerLimit) {
            this.m_impulse.z = b2Math.Max(this.m_impulse.z, 0.0);
         }
         else if (this.m_limitState == b2Joint.e_atUpperLimit) {
            this.m_impulse.z = b2Math.Min(this.m_impulse.z, 0.0);
         }
         var bX = (-Cdot1X) - (this.m_impulse.z - f1.z) * this.m_K.col3.x;
         var bY = (-Cdot1Y) - (this.m_impulse.z - f1.z) * this.m_K.col3.y;
         var f2r = this.m_K.Solve22(new b2Vec2(), bX, bY);
         f2r.x += f1.x;
         f2r.y += f1.y;
         this.m_impulse.x = f2r.x;
         this.m_impulse.y = f2r.y;
         df.x = this.m_impulse.x - f1.x;
         df.y = this.m_impulse.y - f1.y;
         df.z = this.m_impulse.z - f1.z;
         PX = df.x * this.m_perp.x + df.z * this.m_axis.x;
         PY = df.x * this.m_perp.y + df.z * this.m_axis.y;
         L1 = df.x * this.m_s1 + df.y + df.z * this.m_a1;
         L2 = df.x * this.m_s2 + df.y + df.z * this.m_a2;
         v1.x -= this.m_invMassA * PX;
         v1.y -= this.m_invMassA * PY;
         w1 -= this.m_invIA * L1;
         v2.x += this.m_invMassB * PX;
         v2.y += this.m_invMassB * PY;
         w2 += this.m_invIB * L2;
      }
      else {
         var df2 = this.m_K.Solve22(new b2Vec2(), (-Cdot1X), (-Cdot1Y));
         this.m_impulse.x += df2.x;
         this.m_impulse.y += df2.y;
         PX = df2.x * this.m_perp.x;
         PY = df2.x * this.m_perp.y;
         L1 = df2.x * this.m_s1 + df2.y;
         L2 = df2.x * this.m_s2 + df2.y;
         v1.x -= this.m_invMassA * PX;
         v1.y -= this.m_invMassA * PY;
         w1 -= this.m_invIA * L1;
         v2.x += this.m_invMassB * PX;
         v2.y += this.m_invMassB * PY;
         w2 += this.m_invIB * L2;
      }
      bA.m_linearVelocity.SetV(v1);
      bA.m_angularVelocity = w1;
      bB.m_linearVelocity.SetV(v2);
      bB.m_angularVelocity = w2;
   }
   b2PrismaticJoint.prototype.SolvePositionConstraints = function (baumgarte) {
      if (baumgarte === undefined) baumgarte = 0;
      var limitC = 0;
      var oldLimitImpulse = 0;
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var c1 = bA.m_sweep.c;
      var a1 = bA.m_sweep.a;
      var c2 = bB.m_sweep.c;
      var a2 = bB.m_sweep.a;
      var tMat;
      var tX = 0;
      var m1 = 0;
      var m2 = 0;
      var i1 = 0;
      var i2 = 0;
      var linearError = 0.0;
      var angularError = 0.0;
      var active = false;
      var C2 = 0.0;
      var R1 = b2Mat22.FromAngle(a1);
      var R2 = b2Mat22.FromAngle(a2);
      tMat = R1;
      var r1X = this.m_localAnchor1.x - this.m_localCenterA.x;
      var r1Y = this.m_localAnchor1.y - this.m_localCenterA.y;
      tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
      r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
      r1X = tX;
      tMat = R2;
      var r2X = this.m_localAnchor2.x - this.m_localCenterB.x;
      var r2Y = this.m_localAnchor2.y - this.m_localCenterB.y;
      tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
      r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
      r2X = tX;
      var dX = c2.x + r2X - c1.x - r1X;
      var dY = c2.y + r2Y - c1.y - r1Y;
      if (this.m_enableLimit) {
         this.m_axis = b2Math.MulMV(R1, this.m_localXAxis1);
         this.m_a1 = (dX + r1X) * this.m_axis.y - (dY + r1Y) * this.m_axis.x;
         this.m_a2 = r2X * this.m_axis.y - r2Y * this.m_axis.x;
         var translation = this.m_axis.x * dX + this.m_axis.y * dY;
         if (b2Math.Abs(this.m_upperTranslation - this.m_lowerTranslation) < 2.0 * b2Settings.b2_linearSlop) {
            C2 = b2Math.Clamp(translation, (-b2Settings.b2_maxLinearCorrection), b2Settings.b2_maxLinearCorrection);
            linearError = b2Math.Abs(translation);
            active = true;
         }
         else if (translation <= this.m_lowerTranslation) {
            C2 = b2Math.Clamp(translation - this.m_lowerTranslation + b2Settings.b2_linearSlop, (-b2Settings.b2_maxLinearCorrection), 0.0);
            linearError = this.m_lowerTranslation - translation;
            active = true;
         }
         else if (translation >= this.m_upperTranslation) {
            C2 = b2Math.Clamp(translation - this.m_upperTranslation + b2Settings.b2_linearSlop, 0.0, b2Settings.b2_maxLinearCorrection);
            linearError = translation - this.m_upperTranslation;
            active = true;
         }
      }
      this.m_perp = b2Math.MulMV(R1, this.m_localYAxis1);
      this.m_s1 = (dX + r1X) * this.m_perp.y - (dY + r1Y) * this.m_perp.x;
      this.m_s2 = r2X * this.m_perp.y - r2Y * this.m_perp.x;
      var impulse = new b2Vec3();
      var C1X = this.m_perp.x * dX + this.m_perp.y * dY;
      var C1Y = a2 - a1 - this.m_refAngle;
      linearError = b2Math.Max(linearError, b2Math.Abs(C1X));
      angularError = b2Math.Abs(C1Y);
      if (active) {
         m1 = this.m_invMassA;
         m2 = this.m_invMassB;
         i1 = this.m_invIA;
         i2 = this.m_invIB;
         this.m_K.col1.x = m1 + m2 + i1 * this.m_s1 * this.m_s1 + i2 * this.m_s2 * this.m_s2;
         this.m_K.col1.y = i1 * this.m_s1 + i2 * this.m_s2;
         this.m_K.col1.z = i1 * this.m_s1 * this.m_a1 + i2 * this.m_s2 * this.m_a2;
         this.m_K.col2.x = this.m_K.col1.y;
         this.m_K.col2.y = i1 + i2;
         this.m_K.col2.z = i1 * this.m_a1 + i2 * this.m_a2;
         this.m_K.col3.x = this.m_K.col1.z;
         this.m_K.col3.y = this.m_K.col2.z;
         this.m_K.col3.z = m1 + m2 + i1 * this.m_a1 * this.m_a1 + i2 * this.m_a2 * this.m_a2;
         this.m_K.Solve33(impulse, (-C1X), (-C1Y), (-C2));
      }
      else {
         m1 = this.m_invMassA;
         m2 = this.m_invMassB;
         i1 = this.m_invIA;
         i2 = this.m_invIB;
         var k11 = m1 + m2 + i1 * this.m_s1 * this.m_s1 + i2 * this.m_s2 * this.m_s2;
         var k12 = i1 * this.m_s1 + i2 * this.m_s2;
         var k22 = i1 + i2;
         this.m_K.col1.Set(k11, k12, 0.0);
         this.m_K.col2.Set(k12, k22, 0.0);
         var impulse1 = this.m_K.Solve22(new b2Vec2(), (-C1X), (-C1Y));
         impulse.x = impulse1.x;
         impulse.y = impulse1.y;
         impulse.z = 0.0;
      }
      var PX = impulse.x * this.m_perp.x + impulse.z * this.m_axis.x;
      var PY = impulse.x * this.m_perp.y + impulse.z * this.m_axis.y;
      var L1 = impulse.x * this.m_s1 + impulse.y + impulse.z * this.m_a1;
      var L2 = impulse.x * this.m_s2 + impulse.y + impulse.z * this.m_a2;
      c1.x -= this.m_invMassA * PX;
      c1.y -= this.m_invMassA * PY;
      a1 -= this.m_invIA * L1;
      c2.x += this.m_invMassB * PX;
      c2.y += this.m_invMassB * PY;
      a2 += this.m_invIB * L2;
      bA.m_sweep.a = a1;
      bB.m_sweep.a = a2;
      bA.SynchronizeTransform();
      bB.SynchronizeTransform();
      return linearError <= b2Settings.b2_linearSlop && angularError <= b2Settings.b2_angularSlop;
   }
   Box2D.inherit(b2PrismaticJointDef, Box2D.Dynamics.Joints.b2JointDef);
   b2PrismaticJointDef.prototype.__super = Box2D.Dynamics.Joints.b2JointDef.prototype;
   b2PrismaticJointDef.b2PrismaticJointDef = function () {
      Box2D.Dynamics.Joints.b2JointDef.b2JointDef.apply(this, arguments);
      this.localAnchorA = new b2Vec2();
      this.localAnchorB = new b2Vec2();
      this.localAxisA = new b2Vec2();
   };
   b2PrismaticJointDef.prototype.b2PrismaticJointDef = function () {
      this.__super.b2JointDef.call(this);
      this.type = b2Joint.e_prismaticJoint;
      this.localAxisA.Set(1.0, 0.0);
      this.referenceAngle = 0.0;
      this.enableLimit = false;
      this.lowerTranslation = 0.0;
      this.upperTranslation = 0.0;
      this.enableMotor = false;
      this.maxMotorForce = 0.0;
      this.motorSpeed = 0.0;
   }
   b2PrismaticJointDef.prototype.Initialize = function (bA, bB, anchor, axis) {
      this.bodyA = bA;
      this.bodyB = bB;
      this.localAnchorA = this.bodyA.GetLocalPoint(anchor);
      this.localAnchorB = this.bodyB.GetLocalPoint(anchor);
      this.localAxisA = this.bodyA.GetLocalVector(axis);
      this.referenceAngle = this.bodyB.GetAngle() - this.bodyA.GetAngle();
   }
   Box2D.inherit(b2PulleyJoint, Box2D.Dynamics.Joints.b2Joint);
   b2PulleyJoint.prototype.__super = Box2D.Dynamics.Joints.b2Joint.prototype;
   b2PulleyJoint.b2PulleyJoint = function () {
      Box2D.Dynamics.Joints.b2Joint.b2Joint.apply(this, arguments);
      this.m_groundAnchor1 = new b2Vec2();
      this.m_groundAnchor2 = new b2Vec2();
      this.m_localAnchor1 = new b2Vec2();
      this.m_localAnchor2 = new b2Vec2();
      this.m_u1 = new b2Vec2();
      this.m_u2 = new b2Vec2();
   };
   b2PulleyJoint.prototype.GetAnchorA = function () {
      return this.m_bodyA.GetWorldPoint(this.m_localAnchor1);
   }
   b2PulleyJoint.prototype.GetAnchorB = function () {
      return this.m_bodyB.GetWorldPoint(this.m_localAnchor2);
   }
   b2PulleyJoint.prototype.GetReactionForce = function (inv_dt) {
      if (inv_dt === undefined) inv_dt = 0;
      return new b2Vec2(inv_dt * this.m_impulse * this.m_u2.x, inv_dt * this.m_impulse * this.m_u2.y);
   }
   b2PulleyJoint.prototype.GetReactionTorque = function (inv_dt) {
      if (inv_dt === undefined) inv_dt = 0;
      return 0.0;
   }
   b2PulleyJoint.prototype.GetGroundAnchorA = function () {
      var a = this.m_ground.m_xf.position.Copy();
      a.Add(this.m_groundAnchor1);
      return a;
   }
   b2PulleyJoint.prototype.GetGroundAnchorB = function () {
      var a = this.m_ground.m_xf.position.Copy();
      a.Add(this.m_groundAnchor2);
      return a;
   }
   b2PulleyJoint.prototype.GetLength1 = function () {
      var p = this.m_bodyA.GetWorldPoint(this.m_localAnchor1);
      var sX = this.m_ground.m_xf.position.x + this.m_groundAnchor1.x;
      var sY = this.m_ground.m_xf.position.y + this.m_groundAnchor1.y;
      var dX = p.x - sX;
      var dY = p.y - sY;
      return Math.sqrt(dX * dX + dY * dY);
   }
   b2PulleyJoint.prototype.GetLength2 = function () {
      var p = this.m_bodyB.GetWorldPoint(this.m_localAnchor2);
      var sX = this.m_ground.m_xf.position.x + this.m_groundAnchor2.x;
      var sY = this.m_ground.m_xf.position.y + this.m_groundAnchor2.y;
      var dX = p.x - sX;
      var dY = p.y - sY;
      return Math.sqrt(dX * dX + dY * dY);
   }
   b2PulleyJoint.prototype.GetRatio = function () {
      return this.m_ratio;
   }
   b2PulleyJoint.prototype.b2PulleyJoint = function (def) {
      this.__super.b2Joint.call(this, def);
      var tMat;
      var tX = 0;
      var tY = 0;
      this.m_ground = this.m_bodyA.m_world.m_groundBody;
      this.m_groundAnchor1.x = def.groundAnchorA.x - this.m_ground.m_xf.position.x;
      this.m_groundAnchor1.y = def.groundAnchorA.y - this.m_ground.m_xf.position.y;
      this.m_groundAnchor2.x = def.groundAnchorB.x - this.m_ground.m_xf.position.x;
      this.m_groundAnchor2.y = def.groundAnchorB.y - this.m_ground.m_xf.position.y;
      this.m_localAnchor1.SetV(def.localAnchorA);
      this.m_localAnchor2.SetV(def.localAnchorB);
      this.m_ratio = def.ratio;
      this.m_constant = def.lengthA + this.m_ratio * def.lengthB;
      this.m_maxLength1 = b2Math.Min(def.maxLengthA, this.m_constant - this.m_ratio * b2PulleyJoint.b2_minPulleyLength);
      this.m_maxLength2 = b2Math.Min(def.maxLengthB, (this.m_constant - b2PulleyJoint.b2_minPulleyLength) / this.m_ratio);
      this.m_impulse = 0.0;
      this.m_limitImpulse1 = 0.0;
      this.m_limitImpulse2 = 0.0;
   }
   b2PulleyJoint.prototype.InitVelocityConstraints = function (step) {
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var tMat;
      tMat = bA.m_xf.R;
      var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
      var r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
      var tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
      r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
      r1X = tX;
      tMat = bB.m_xf.R;
      var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
      var r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
      tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
      r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
      r2X = tX;
      var p1X = bA.m_sweep.c.x + r1X;
      var p1Y = bA.m_sweep.c.y + r1Y;
      var p2X = bB.m_sweep.c.x + r2X;
      var p2Y = bB.m_sweep.c.y + r2Y;
      var s1X = this.m_ground.m_xf.position.x + this.m_groundAnchor1.x;
      var s1Y = this.m_ground.m_xf.position.y + this.m_groundAnchor1.y;
      var s2X = this.m_ground.m_xf.position.x + this.m_groundAnchor2.x;
      var s2Y = this.m_ground.m_xf.position.y + this.m_groundAnchor2.y;
      this.m_u1.Set(p1X - s1X, p1Y - s1Y);
      this.m_u2.Set(p2X - s2X, p2Y - s2Y);
      var length1 = this.m_u1.Length();
      var length2 = this.m_u2.Length();
      if (length1 > b2Settings.b2_linearSlop) {
         this.m_u1.Multiply(1.0 / length1);
      }
      else {
         this.m_u1.SetZero();
      }
      if (length2 > b2Settings.b2_linearSlop) {
         this.m_u2.Multiply(1.0 / length2);
      }
      else {
         this.m_u2.SetZero();
      }
      var C = this.m_constant - length1 - this.m_ratio * length2;
      if (C > 0.0) {
         this.m_state = b2Joint.e_inactiveLimit;
         this.m_impulse = 0.0;
      }
      else {
         this.m_state = b2Joint.e_atUpperLimit;
      }
      if (length1 < this.m_maxLength1) {
         this.m_limitState1 = b2Joint.e_inactiveLimit;
         this.m_limitImpulse1 = 0.0;
      }
      else {
         this.m_limitState1 = b2Joint.e_atUpperLimit;
      }
      if (length2 < this.m_maxLength2) {
         this.m_limitState2 = b2Joint.e_inactiveLimit;
         this.m_limitImpulse2 = 0.0;
      }
      else {
         this.m_limitState2 = b2Joint.e_atUpperLimit;
      }
      var cr1u1 = r1X * this.m_u1.y - r1Y * this.m_u1.x;
      var cr2u2 = r2X * this.m_u2.y - r2Y * this.m_u2.x;
      this.m_limitMass1 = bA.m_invMass + bA.m_invI * cr1u1 * cr1u1;
      this.m_limitMass2 = bB.m_invMass + bB.m_invI * cr2u2 * cr2u2;
      this.m_pulleyMass = this.m_limitMass1 + this.m_ratio * this.m_ratio * this.m_limitMass2;
      this.m_limitMass1 = 1.0 / this.m_limitMass1;
      this.m_limitMass2 = 1.0 / this.m_limitMass2;
      this.m_pulleyMass = 1.0 / this.m_pulleyMass;
      if (step.warmStarting) {
         this.m_impulse *= step.dtRatio;
         this.m_limitImpulse1 *= step.dtRatio;
         this.m_limitImpulse2 *= step.dtRatio;
         var P1X = ((-this.m_impulse) - this.m_limitImpulse1) * this.m_u1.x;
         var P1Y = ((-this.m_impulse) - this.m_limitImpulse1) * this.m_u1.y;
         var P2X = ((-this.m_ratio * this.m_impulse) - this.m_limitImpulse2) * this.m_u2.x;
         var P2Y = ((-this.m_ratio * this.m_impulse) - this.m_limitImpulse2) * this.m_u2.y;
         bA.m_linearVelocity.x += bA.m_invMass * P1X;
         bA.m_linearVelocity.y += bA.m_invMass * P1Y;
         bA.m_angularVelocity += bA.m_invI * (r1X * P1Y - r1Y * P1X);
         bB.m_linearVelocity.x += bB.m_invMass * P2X;
         bB.m_linearVelocity.y += bB.m_invMass * P2Y;
         bB.m_angularVelocity += bB.m_invI * (r2X * P2Y - r2Y * P2X);
      }
      else {
         this.m_impulse = 0.0;
         this.m_limitImpulse1 = 0.0;
         this.m_limitImpulse2 = 0.0;
      }
   }
   b2PulleyJoint.prototype.SolveVelocityConstraints = function (step) {
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var tMat;
      tMat = bA.m_xf.R;
      var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
      var r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
      var tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
      r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
      r1X = tX;
      tMat = bB.m_xf.R;
      var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
      var r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
      tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
      r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
      r2X = tX;
      var v1X = 0;
      var v1Y = 0;
      var v2X = 0;
      var v2Y = 0;
      var P1X = 0;
      var P1Y = 0;
      var P2X = 0;
      var P2Y = 0;
      var Cdot = 0;
      var impulse = 0;
      var oldImpulse = 0;
      if (this.m_state == b2Joint.e_atUpperLimit) {
         v1X = bA.m_linearVelocity.x + ((-bA.m_angularVelocity * r1Y));
         v1Y = bA.m_linearVelocity.y + (bA.m_angularVelocity * r1X);
         v2X = bB.m_linearVelocity.x + ((-bB.m_angularVelocity * r2Y));
         v2Y = bB.m_linearVelocity.y + (bB.m_angularVelocity * r2X);
         Cdot = (-(this.m_u1.x * v1X + this.m_u1.y * v1Y)) - this.m_ratio * (this.m_u2.x * v2X + this.m_u2.y * v2Y);
         impulse = this.m_pulleyMass * ((-Cdot));
         oldImpulse = this.m_impulse;
         this.m_impulse = b2Math.Max(0.0, this.m_impulse + impulse);
         impulse = this.m_impulse - oldImpulse;
         P1X = (-impulse * this.m_u1.x);
         P1Y = (-impulse * this.m_u1.y);
         P2X = (-this.m_ratio * impulse * this.m_u2.x);
         P2Y = (-this.m_ratio * impulse * this.m_u2.y);
         bA.m_linearVelocity.x += bA.m_invMass * P1X;
         bA.m_linearVelocity.y += bA.m_invMass * P1Y;
         bA.m_angularVelocity += bA.m_invI * (r1X * P1Y - r1Y * P1X);
         bB.m_linearVelocity.x += bB.m_invMass * P2X;
         bB.m_linearVelocity.y += bB.m_invMass * P2Y;
         bB.m_angularVelocity += bB.m_invI * (r2X * P2Y - r2Y * P2X);
      }
      if (this.m_limitState1 == b2Joint.e_atUpperLimit) {
         v1X = bA.m_linearVelocity.x + ((-bA.m_angularVelocity * r1Y));
         v1Y = bA.m_linearVelocity.y + (bA.m_angularVelocity * r1X);
         Cdot = (-(this.m_u1.x * v1X + this.m_u1.y * v1Y));
         impulse = (-this.m_limitMass1 * Cdot);
         oldImpulse = this.m_limitImpulse1;
         this.m_limitImpulse1 = b2Math.Max(0.0, this.m_limitImpulse1 + impulse);
         impulse = this.m_limitImpulse1 - oldImpulse;
         P1X = (-impulse * this.m_u1.x);
         P1Y = (-impulse * this.m_u1.y);
         bA.m_linearVelocity.x += bA.m_invMass * P1X;
         bA.m_linearVelocity.y += bA.m_invMass * P1Y;
         bA.m_angularVelocity += bA.m_invI * (r1X * P1Y - r1Y * P1X);
      }
      if (this.m_limitState2 == b2Joint.e_atUpperLimit) {
         v2X = bB.m_linearVelocity.x + ((-bB.m_angularVelocity * r2Y));
         v2Y = bB.m_linearVelocity.y + (bB.m_angularVelocity * r2X);
         Cdot = (-(this.m_u2.x * v2X + this.m_u2.y * v2Y));
         impulse = (-this.m_limitMass2 * Cdot);
         oldImpulse = this.m_limitImpulse2;
         this.m_limitImpulse2 = b2Math.Max(0.0, this.m_limitImpulse2 + impulse);
         impulse = this.m_limitImpulse2 - oldImpulse;
         P2X = (-impulse * this.m_u2.x);
         P2Y = (-impulse * this.m_u2.y);
         bB.m_linearVelocity.x += bB.m_invMass * P2X;
         bB.m_linearVelocity.y += bB.m_invMass * P2Y;
         bB.m_angularVelocity += bB.m_invI * (r2X * P2Y - r2Y * P2X);
      }
   }
   b2PulleyJoint.prototype.SolvePositionConstraints = function (baumgarte) {
      if (baumgarte === undefined) baumgarte = 0;
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var tMat;
      var s1X = this.m_ground.m_xf.position.x + this.m_groundAnchor1.x;
      var s1Y = this.m_ground.m_xf.position.y + this.m_groundAnchor1.y;
      var s2X = this.m_ground.m_xf.position.x + this.m_groundAnchor2.x;
      var s2Y = this.m_ground.m_xf.position.y + this.m_groundAnchor2.y;
      var r1X = 0;
      var r1Y = 0;
      var r2X = 0;
      var r2Y = 0;
      var p1X = 0;
      var p1Y = 0;
      var p2X = 0;
      var p2Y = 0;
      var length1 = 0;
      var length2 = 0;
      var C = 0;
      var impulse = 0;
      var oldImpulse = 0;
      var oldLimitPositionImpulse = 0;
      var tX = 0;
      var linearError = 0.0;
      if (this.m_state == b2Joint.e_atUpperLimit) {
         tMat = bA.m_xf.R;
         r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
         r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
         tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
         r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
         r1X = tX;
         tMat = bB.m_xf.R;
         r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
         r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
         tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
         r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
         r2X = tX;
         p1X = bA.m_sweep.c.x + r1X;
         p1Y = bA.m_sweep.c.y + r1Y;
         p2X = bB.m_sweep.c.x + r2X;
         p2Y = bB.m_sweep.c.y + r2Y;
         this.m_u1.Set(p1X - s1X, p1Y - s1Y);
         this.m_u2.Set(p2X - s2X, p2Y - s2Y);
         length1 = this.m_u1.Length();
         length2 = this.m_u2.Length();
         if (length1 > b2Settings.b2_linearSlop) {
            this.m_u1.Multiply(1.0 / length1);
         }
         else {
            this.m_u1.SetZero();
         }
         if (length2 > b2Settings.b2_linearSlop) {
            this.m_u2.Multiply(1.0 / length2);
         }
         else {
            this.m_u2.SetZero();
         }
         C = this.m_constant - length1 - this.m_ratio * length2;
         linearError = b2Math.Max(linearError, (-C));
         C = b2Math.Clamp(C + b2Settings.b2_linearSlop, (-b2Settings.b2_maxLinearCorrection), 0.0);
         impulse = (-this.m_pulleyMass * C);
         p1X = (-impulse * this.m_u1.x);
         p1Y = (-impulse * this.m_u1.y);
         p2X = (-this.m_ratio * impulse * this.m_u2.x);
         p2Y = (-this.m_ratio * impulse * this.m_u2.y);
         bA.m_sweep.c.x += bA.m_invMass * p1X;
         bA.m_sweep.c.y += bA.m_invMass * p1Y;
         bA.m_sweep.a += bA.m_invI * (r1X * p1Y - r1Y * p1X);
         bB.m_sweep.c.x += bB.m_invMass * p2X;
         bB.m_sweep.c.y += bB.m_invMass * p2Y;
         bB.m_sweep.a += bB.m_invI * (r2X * p2Y - r2Y * p2X);
         bA.SynchronizeTransform();
         bB.SynchronizeTransform();
      }
      if (this.m_limitState1 == b2Joint.e_atUpperLimit) {
         tMat = bA.m_xf.R;
         r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
         r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
         tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
         r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
         r1X = tX;
         p1X = bA.m_sweep.c.x + r1X;
         p1Y = bA.m_sweep.c.y + r1Y;
         this.m_u1.Set(p1X - s1X, p1Y - s1Y);
         length1 = this.m_u1.Length();
         if (length1 > b2Settings.b2_linearSlop) {
            this.m_u1.x *= 1.0 / length1;
            this.m_u1.y *= 1.0 / length1;
         }
         else {
            this.m_u1.SetZero();
         }
         C = this.m_maxLength1 - length1;
         linearError = b2Math.Max(linearError, (-C));
         C = b2Math.Clamp(C + b2Settings.b2_linearSlop, (-b2Settings.b2_maxLinearCorrection), 0.0);
         impulse = (-this.m_limitMass1 * C);
         p1X = (-impulse * this.m_u1.x);
         p1Y = (-impulse * this.m_u1.y);
         bA.m_sweep.c.x += bA.m_invMass * p1X;
         bA.m_sweep.c.y += bA.m_invMass * p1Y;
         bA.m_sweep.a += bA.m_invI * (r1X * p1Y - r1Y * p1X);
         bA.SynchronizeTransform();
      }
      if (this.m_limitState2 == b2Joint.e_atUpperLimit) {
         tMat = bB.m_xf.R;
         r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
         r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
         tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
         r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
         r2X = tX;
         p2X = bB.m_sweep.c.x + r2X;
         p2Y = bB.m_sweep.c.y + r2Y;
         this.m_u2.Set(p2X - s2X, p2Y - s2Y);
         length2 = this.m_u2.Length();
         if (length2 > b2Settings.b2_linearSlop) {
            this.m_u2.x *= 1.0 / length2;
            this.m_u2.y *= 1.0 / length2;
         }
         else {
            this.m_u2.SetZero();
         }
         C = this.m_maxLength2 - length2;
         linearError = b2Math.Max(linearError, (-C));
         C = b2Math.Clamp(C + b2Settings.b2_linearSlop, (-b2Settings.b2_maxLinearCorrection), 0.0);
         impulse = (-this.m_limitMass2 * C);
         p2X = (-impulse * this.m_u2.x);
         p2Y = (-impulse * this.m_u2.y);
         bB.m_sweep.c.x += bB.m_invMass * p2X;
         bB.m_sweep.c.y += bB.m_invMass * p2Y;
         bB.m_sweep.a += bB.m_invI * (r2X * p2Y - r2Y * p2X);
         bB.SynchronizeTransform();
      }
      return linearError < b2Settings.b2_linearSlop;
   }
   Box2D.postDefs.push(function () {
      Box2D.Dynamics.Joints.b2PulleyJoint.b2_minPulleyLength = 2.0;
   });
   Box2D.inherit(b2PulleyJointDef, Box2D.Dynamics.Joints.b2JointDef);
   b2PulleyJointDef.prototype.__super = Box2D.Dynamics.Joints.b2JointDef.prototype;
   b2PulleyJointDef.b2PulleyJointDef = function () {
      Box2D.Dynamics.Joints.b2JointDef.b2JointDef.apply(this, arguments);
      this.groundAnchorA = new b2Vec2();
      this.groundAnchorB = new b2Vec2();
      this.localAnchorA = new b2Vec2();
      this.localAnchorB = new b2Vec2();
   };
   b2PulleyJointDef.prototype.b2PulleyJointDef = function () {
      this.__super.b2JointDef.call(this);
      this.type = b2Joint.e_pulleyJoint;
      this.groundAnchorA.Set((-1.0), 1.0);
      this.groundAnchorB.Set(1.0, 1.0);
      this.localAnchorA.Set((-1.0), 0.0);
      this.localAnchorB.Set(1.0, 0.0);
      this.lengthA = 0.0;
      this.maxLengthA = 0.0;
      this.lengthB = 0.0;
      this.maxLengthB = 0.0;
      this.ratio = 1.0;
      this.collideConnected = true;
   }
   b2PulleyJointDef.prototype.Initialize = function (bA, bB, gaA, gaB, anchorA, anchorB, r) {
      if (r === undefined) r = 0;
      this.bodyA = bA;
      this.bodyB = bB;
      this.groundAnchorA.SetV(gaA);
      this.groundAnchorB.SetV(gaB);
      this.localAnchorA = this.bodyA.GetLocalPoint(anchorA);
      this.localAnchorB = this.bodyB.GetLocalPoint(anchorB);
      var d1X = anchorA.x - gaA.x;
      var d1Y = anchorA.y - gaA.y;
      this.lengthA = Math.sqrt(d1X * d1X + d1Y * d1Y);
      var d2X = anchorB.x - gaB.x;
      var d2Y = anchorB.y - gaB.y;
      this.lengthB = Math.sqrt(d2X * d2X + d2Y * d2Y);
      this.ratio = r;
      var C = this.lengthA + this.ratio * this.lengthB;
      this.maxLengthA = C - this.ratio * b2PulleyJoint.b2_minPulleyLength;
      this.maxLengthB = (C - b2PulleyJoint.b2_minPulleyLength) / this.ratio;
   }
   Box2D.inherit(b2RevoluteJoint, Box2D.Dynamics.Joints.b2Joint);
   b2RevoluteJoint.prototype.__super = Box2D.Dynamics.Joints.b2Joint.prototype;
   b2RevoluteJoint.b2RevoluteJoint = function () {
      Box2D.Dynamics.Joints.b2Joint.b2Joint.apply(this, arguments);
      this.K = new b2Mat22();
      this.K1 = new b2Mat22();
      this.K2 = new b2Mat22();
      this.K3 = new b2Mat22();
      this.impulse3 = new b2Vec3();
      this.impulse2 = new b2Vec2();
      this.reduced = new b2Vec2();
      this.m_localAnchor1 = new b2Vec2();
      this.m_localAnchor2 = new b2Vec2();
      this.m_impulse = new b2Vec3();
      this.m_mass = new b2Mat33();
   };
   b2RevoluteJoint.prototype.GetAnchorA = function () {
      return this.m_bodyA.GetWorldPoint(this.m_localAnchor1);
   }
   b2RevoluteJoint.prototype.GetAnchorB = function () {
      return this.m_bodyB.GetWorldPoint(this.m_localAnchor2);
   }
   b2RevoluteJoint.prototype.GetReactionForce = function (inv_dt) {
      if (inv_dt === undefined) inv_dt = 0;
      return new b2Vec2(inv_dt * this.m_impulse.x, inv_dt * this.m_impulse.y);
   }
   b2RevoluteJoint.prototype.GetReactionTorque = function (inv_dt) {
      if (inv_dt === undefined) inv_dt = 0;
      return inv_dt * this.m_impulse.z;
   }
   b2RevoluteJoint.prototype.GetJointAngle = function () {
      return this.m_bodyB.m_sweep.a - this.m_bodyA.m_sweep.a - this.m_referenceAngle;
   }
   b2RevoluteJoint.prototype.GetJointSpeed = function () {
      return this.m_bodyB.m_angularVelocity - this.m_bodyA.m_angularVelocity;
   }
   b2RevoluteJoint.prototype.IsLimitEnabled = function () {
      return this.m_enableLimit;
   }
   b2RevoluteJoint.prototype.EnableLimit = function (flag) {
      this.m_enableLimit = flag;
   }
   b2RevoluteJoint.prototype.GetLowerLimit = function () {
      return this.m_lowerAngle;
   }
   b2RevoluteJoint.prototype.GetUpperLimit = function () {
      return this.m_upperAngle;
   }
   b2RevoluteJoint.prototype.SetLimits = function (lower, upper) {
      if (lower === undefined) lower = 0;
      if (upper === undefined) upper = 0;
      this.m_lowerAngle = lower;
      this.m_upperAngle = upper;
   }
   b2RevoluteJoint.prototype.IsMotorEnabled = function () {
      this.m_bodyA.SetAwake(true);
      this.m_bodyB.SetAwake(true);
      return this.m_enableMotor;
   }
   b2RevoluteJoint.prototype.EnableMotor = function (flag) {
      this.m_enableMotor = flag;
   }
   b2RevoluteJoint.prototype.SetMotorSpeed = function (speed) {
      if (speed === undefined) speed = 0;
      this.m_bodyA.SetAwake(true);
      this.m_bodyB.SetAwake(true);
      this.m_motorSpeed = speed;
   }
   b2RevoluteJoint.prototype.GetMotorSpeed = function () {
      return this.m_motorSpeed;
   }
   b2RevoluteJoint.prototype.SetMaxMotorTorque = function (torque) {
      if (torque === undefined) torque = 0;
      this.m_maxMotorTorque = torque;
   }
   b2RevoluteJoint.prototype.GetMotorTorque = function () {
      return this.m_maxMotorTorque;
   }
   b2RevoluteJoint.prototype.b2RevoluteJoint = function (def) {
      this.__super.b2Joint.call(this, def);
      this.m_localAnchor1.SetV(def.localAnchorA);
      this.m_localAnchor2.SetV(def.localAnchorB);
      this.m_referenceAngle = def.referenceAngle;
      this.m_impulse.SetZero();
      this.m_motorImpulse = 0.0;
      this.m_lowerAngle = def.lowerAngle;
      this.m_upperAngle = def.upperAngle;
      this.m_maxMotorTorque = def.maxMotorTorque;
      this.m_motorSpeed = def.motorSpeed;
      this.m_enableLimit = def.enableLimit;
      this.m_enableMotor = def.enableMotor;
      this.m_limitState = b2Joint.e_inactiveLimit;
   }
   b2RevoluteJoint.prototype.InitVelocityConstraints = function (step) {
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var tMat;
      var tX = 0;
      if (this.m_enableMotor || this.m_enableLimit) {}
      tMat = bA.m_xf.R;
      var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
      var r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
      tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
      r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
      r1X = tX;
      tMat = bB.m_xf.R;
      var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
      var r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
      tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
      r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
      r2X = tX;
      var m1 = bA.m_invMass;
      var m2 = bB.m_invMass;
      var i1 = bA.m_invI;
      var i2 = bB.m_invI;
      this.m_mass.col1.x = m1 + m2 + r1Y * r1Y * i1 + r2Y * r2Y * i2;
      this.m_mass.col2.x = (-r1Y * r1X * i1) - r2Y * r2X * i2;
      this.m_mass.col3.x = (-r1Y * i1) - r2Y * i2;
      this.m_mass.col1.y = this.m_mass.col2.x;
      this.m_mass.col2.y = m1 + m2 + r1X * r1X * i1 + r2X * r2X * i2;
      this.m_mass.col3.y = r1X * i1 + r2X * i2;
      this.m_mass.col1.z = this.m_mass.col3.x;
      this.m_mass.col2.z = this.m_mass.col3.y;
      this.m_mass.col3.z = i1 + i2;
      this.m_motorMass = 1.0 / (i1 + i2);
      if (this.m_enableMotor == false) {
         this.m_motorImpulse = 0.0;
      }
      if (this.m_enableLimit) {
         var jointAngle = bB.m_sweep.a - bA.m_sweep.a - this.m_referenceAngle;
         if (b2Math.Abs(this.m_upperAngle - this.m_lowerAngle) < 2.0 * b2Settings.b2_angularSlop) {
            this.m_limitState = b2Joint.e_equalLimits;
         }
         else if (jointAngle <= this.m_lowerAngle) {
            if (this.m_limitState != b2Joint.e_atLowerLimit) {
               this.m_impulse.z = 0.0;
            }
            this.m_limitState = b2Joint.e_atLowerLimit;
         }
         else if (jointAngle >= this.m_upperAngle) {
            if (this.m_limitState != b2Joint.e_atUpperLimit) {
               this.m_impulse.z = 0.0;
            }
            this.m_limitState = b2Joint.e_atUpperLimit;
         }
         else {
            this.m_limitState = b2Joint.e_inactiveLimit;
            this.m_impulse.z = 0.0;
         }
      }
      else {
         this.m_limitState = b2Joint.e_inactiveLimit;
      }
      if (step.warmStarting) {
         this.m_impulse.x *= step.dtRatio;
         this.m_impulse.y *= step.dtRatio;
         this.m_motorImpulse *= step.dtRatio;
         var PX = this.m_impulse.x;
         var PY = this.m_impulse.y;
         bA.m_linearVelocity.x -= m1 * PX;
         bA.m_linearVelocity.y -= m1 * PY;
         bA.m_angularVelocity -= i1 * ((r1X * PY - r1Y * PX) + this.m_motorImpulse + this.m_impulse.z);
         bB.m_linearVelocity.x += m2 * PX;
         bB.m_linearVelocity.y += m2 * PY;
         bB.m_angularVelocity += i2 * ((r2X * PY - r2Y * PX) + this.m_motorImpulse + this.m_impulse.z);
      }
      else {
         this.m_impulse.SetZero();
         this.m_motorImpulse = 0.0;
      }
   }
   b2RevoluteJoint.prototype.SolveVelocityConstraints = function (step) {
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var tMat;
      var tX = 0;
      var newImpulse = 0;
      var r1X = 0;
      var r1Y = 0;
      var r2X = 0;
      var r2Y = 0;
      var v1 = bA.m_linearVelocity;
      var w1 = bA.m_angularVelocity;
      var v2 = bB.m_linearVelocity;
      var w2 = bB.m_angularVelocity;
      var m1 = bA.m_invMass;
      var m2 = bB.m_invMass;
      var i1 = bA.m_invI;
      var i2 = bB.m_invI;
      if (this.m_enableMotor && this.m_limitState != b2Joint.e_equalLimits) {
         var Cdot = w2 - w1 - this.m_motorSpeed;
         var impulse = this.m_motorMass * ((-Cdot));
         var oldImpulse = this.m_motorImpulse;
         var maxImpulse = step.dt * this.m_maxMotorTorque;
         this.m_motorImpulse = b2Math.Clamp(this.m_motorImpulse + impulse, (-maxImpulse), maxImpulse);
         impulse = this.m_motorImpulse - oldImpulse;
         w1 -= i1 * impulse;
         w2 += i2 * impulse;
      }
      if (this.m_enableLimit && this.m_limitState != b2Joint.e_inactiveLimit) {
         tMat = bA.m_xf.R;
         r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
         r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
         tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
         r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
         r1X = tX;
         tMat = bB.m_xf.R;
         r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
         r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
         tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
         r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
         r2X = tX;
         var Cdot1X = v2.x + ((-w2 * r2Y)) - v1.x - ((-w1 * r1Y));
         var Cdot1Y = v2.y + (w2 * r2X) - v1.y - (w1 * r1X);
         var Cdot2 = w2 - w1;
         this.m_mass.Solve33(this.impulse3, (-Cdot1X), (-Cdot1Y), (-Cdot2));
         if (this.m_limitState == b2Joint.e_equalLimits) {
            this.m_impulse.Add(this.impulse3);
         }
         else if (this.m_limitState == b2Joint.e_atLowerLimit) {
            newImpulse = this.m_impulse.z + this.impulse3.z;
            if (newImpulse < 0.0) {
               this.m_mass.Solve22(this.reduced, (-Cdot1X), (-Cdot1Y));
               this.impulse3.x = this.reduced.x;
               this.impulse3.y = this.reduced.y;
               this.impulse3.z = (-this.m_impulse.z);
               this.m_impulse.x += this.reduced.x;
               this.m_impulse.y += this.reduced.y;
               this.m_impulse.z = 0.0;
            }
         }
         else if (this.m_limitState == b2Joint.e_atUpperLimit) {
            newImpulse = this.m_impulse.z + this.impulse3.z;
            if (newImpulse > 0.0) {
               this.m_mass.Solve22(this.reduced, (-Cdot1X), (-Cdot1Y));
               this.impulse3.x = this.reduced.x;
               this.impulse3.y = this.reduced.y;
               this.impulse3.z = (-this.m_impulse.z);
               this.m_impulse.x += this.reduced.x;
               this.m_impulse.y += this.reduced.y;
               this.m_impulse.z = 0.0;
            }
         }
         v1.x -= m1 * this.impulse3.x;
         v1.y -= m1 * this.impulse3.y;
         w1 -= i1 * (r1X * this.impulse3.y - r1Y * this.impulse3.x + this.impulse3.z);
         v2.x += m2 * this.impulse3.x;
         v2.y += m2 * this.impulse3.y;
         w2 += i2 * (r2X * this.impulse3.y - r2Y * this.impulse3.x + this.impulse3.z);
      }
      else {
         tMat = bA.m_xf.R;
         r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
         r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
         tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
         r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
         r1X = tX;
         tMat = bB.m_xf.R;
         r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
         r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
         tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
         r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
         r2X = tX;
         var CdotX = v2.x + ((-w2 * r2Y)) - v1.x - ((-w1 * r1Y));
         var CdotY = v2.y + (w2 * r2X) - v1.y - (w1 * r1X);
         this.m_mass.Solve22(this.impulse2, (-CdotX), (-CdotY));
         this.m_impulse.x += this.impulse2.x;
         this.m_impulse.y += this.impulse2.y;
         v1.x -= m1 * this.impulse2.x;
         v1.y -= m1 * this.impulse2.y;
         w1 -= i1 * (r1X * this.impulse2.y - r1Y * this.impulse2.x);
         v2.x += m2 * this.impulse2.x;
         v2.y += m2 * this.impulse2.y;
         w2 += i2 * (r2X * this.impulse2.y - r2Y * this.impulse2.x);
      }
      bA.m_linearVelocity.SetV(v1);
      bA.m_angularVelocity = w1;
      bB.m_linearVelocity.SetV(v2);
      bB.m_angularVelocity = w2;
   }
   b2RevoluteJoint.prototype.SolvePositionConstraints = function (baumgarte) {
      if (baumgarte === undefined) baumgarte = 0;
      var oldLimitImpulse = 0;
      var C = 0;
      var tMat;
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var angularError = 0.0;
      var positionError = 0.0;
      var tX = 0;
      var impulseX = 0;
      var impulseY = 0;
      if (this.m_enableLimit && this.m_limitState != b2Joint.e_inactiveLimit) {
         var angle = bB.m_sweep.a - bA.m_sweep.a - this.m_referenceAngle;
         var limitImpulse = 0.0;
         if (this.m_limitState == b2Joint.e_equalLimits) {
            C = b2Math.Clamp(angle - this.m_lowerAngle, (-b2Settings.b2_maxAngularCorrection), b2Settings.b2_maxAngularCorrection);
            limitImpulse = (-this.m_motorMass * C);
            angularError = b2Math.Abs(C);
         }
         else if (this.m_limitState == b2Joint.e_atLowerLimit) {
            C = angle - this.m_lowerAngle;
            angularError = (-C);
            C = b2Math.Clamp(C + b2Settings.b2_angularSlop, (-b2Settings.b2_maxAngularCorrection), 0.0);
            limitImpulse = (-this.m_motorMass * C);
         }
         else if (this.m_limitState == b2Joint.e_atUpperLimit) {
            C = angle - this.m_upperAngle;
            angularError = C;
            C = b2Math.Clamp(C - b2Settings.b2_angularSlop, 0.0, b2Settings.b2_maxAngularCorrection);
            limitImpulse = (-this.m_motorMass * C);
         }
         bA.m_sweep.a -= bA.m_invI * limitImpulse;
         bB.m_sweep.a += bB.m_invI * limitImpulse;
         bA.SynchronizeTransform();
         bB.SynchronizeTransform();
      } {
         tMat = bA.m_xf.R;
         var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
         var r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
         tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
         r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
         r1X = tX;
         tMat = bB.m_xf.R;
         var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
         var r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
         tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
         r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
         r2X = tX;
         var CX = bB.m_sweep.c.x + r2X - bA.m_sweep.c.x - r1X;
         var CY = bB.m_sweep.c.y + r2Y - bA.m_sweep.c.y - r1Y;
         var CLengthSquared = CX * CX + CY * CY;
         var CLength = Math.sqrt(CLengthSquared);
         positionError = CLength;
         var invMass1 = bA.m_invMass;
         var invMass2 = bB.m_invMass;
         var invI1 = bA.m_invI;
         var invI2 = bB.m_invI;
         var k_allowedStretch = 10.0 * b2Settings.b2_linearSlop;
         if (CLengthSquared > k_allowedStretch * k_allowedStretch) {
            var uX = CX / CLength;
            var uY = CY / CLength;
            var k = invMass1 + invMass2;
            var m = 1.0 / k;
            impulseX = m * ((-CX));
            impulseY = m * ((-CY));
            var k_beta = 0.5;
            bA.m_sweep.c.x -= k_beta * invMass1 * impulseX;
            bA.m_sweep.c.y -= k_beta * invMass1 * impulseY;
            bB.m_sweep.c.x += k_beta * invMass2 * impulseX;
            bB.m_sweep.c.y += k_beta * invMass2 * impulseY;
            CX = bB.m_sweep.c.x + r2X - bA.m_sweep.c.x - r1X;
            CY = bB.m_sweep.c.y + r2Y - bA.m_sweep.c.y - r1Y;
         }
         this.K1.col1.x = invMass1 + invMass2;
         this.K1.col2.x = 0.0;
         this.K1.col1.y = 0.0;
         this.K1.col2.y = invMass1 + invMass2;
         this.K2.col1.x = invI1 * r1Y * r1Y;
         this.K2.col2.x = (-invI1 * r1X * r1Y);
         this.K2.col1.y = (-invI1 * r1X * r1Y);
         this.K2.col2.y = invI1 * r1X * r1X;
         this.K3.col1.x = invI2 * r2Y * r2Y;
         this.K3.col2.x = (-invI2 * r2X * r2Y);
         this.K3.col1.y = (-invI2 * r2X * r2Y);
         this.K3.col2.y = invI2 * r2X * r2X;
         this.K.SetM(this.K1);
         this.K.AddM(this.K2);
         this.K.AddM(this.K3);
         this.K.Solve(b2RevoluteJoint.tImpulse, (-CX), (-CY));
         impulseX = b2RevoluteJoint.tImpulse.x;
         impulseY = b2RevoluteJoint.tImpulse.y;
         bA.m_sweep.c.x -= bA.m_invMass * impulseX;
         bA.m_sweep.c.y -= bA.m_invMass * impulseY;
         bA.m_sweep.a -= bA.m_invI * (r1X * impulseY - r1Y * impulseX);
         bB.m_sweep.c.x += bB.m_invMass * impulseX;
         bB.m_sweep.c.y += bB.m_invMass * impulseY;
         bB.m_sweep.a += bB.m_invI * (r2X * impulseY - r2Y * impulseX);
         bA.SynchronizeTransform();
         bB.SynchronizeTransform();
      }
      return positionError <= b2Settings.b2_linearSlop && angularError <= b2Settings.b2_angularSlop;
   }
   Box2D.postDefs.push(function () {
      Box2D.Dynamics.Joints.b2RevoluteJoint.tImpulse = new b2Vec2();
   });
   Box2D.inherit(b2RevoluteJointDef, Box2D.Dynamics.Joints.b2JointDef);
   b2RevoluteJointDef.prototype.__super = Box2D.Dynamics.Joints.b2JointDef.prototype;
   b2RevoluteJointDef.b2RevoluteJointDef = function () {
      Box2D.Dynamics.Joints.b2JointDef.b2JointDef.apply(this, arguments);
      this.localAnchorA = new b2Vec2();
      this.localAnchorB = new b2Vec2();
   };
   b2RevoluteJointDef.prototype.b2RevoluteJointDef = function () {
      this.__super.b2JointDef.call(this);
      this.type = b2Joint.e_revoluteJoint;
      this.localAnchorA.Set(0.0, 0.0);
      this.localAnchorB.Set(0.0, 0.0);
      this.referenceAngle = 0.0;
      this.lowerAngle = 0.0;
      this.upperAngle = 0.0;
      this.maxMotorTorque = 0.0;
      this.motorSpeed = 0.0;
      this.enableLimit = false;
      this.enableMotor = false;
   }
   b2RevoluteJointDef.prototype.Initialize = function (bA, bB, anchor) {
      this.bodyA = bA;
      this.bodyB = bB;
      this.localAnchorA = this.bodyA.GetLocalPoint(anchor);
      this.localAnchorB = this.bodyB.GetLocalPoint(anchor);
      this.referenceAngle = this.bodyB.GetAngle() - this.bodyA.GetAngle();
   }
   Box2D.inherit(b2WeldJoint, Box2D.Dynamics.Joints.b2Joint);
   b2WeldJoint.prototype.__super = Box2D.Dynamics.Joints.b2Joint.prototype;
   b2WeldJoint.b2WeldJoint = function () {
      Box2D.Dynamics.Joints.b2Joint.b2Joint.apply(this, arguments);
      this.m_localAnchorA = new b2Vec2();
      this.m_localAnchorB = new b2Vec2();
      this.m_impulse = new b2Vec3();
      this.m_mass = new b2Mat33();
   };
   b2WeldJoint.prototype.GetAnchorA = function () {
      return this.m_bodyA.GetWorldPoint(this.m_localAnchorA);
   }
   b2WeldJoint.prototype.GetAnchorB = function () {
      return this.m_bodyB.GetWorldPoint(this.m_localAnchorB);
   }
   b2WeldJoint.prototype.GetReactionForce = function (inv_dt) {
      if (inv_dt === undefined) inv_dt = 0;
      return new b2Vec2(inv_dt * this.m_impulse.x, inv_dt * this.m_impulse.y);
   }
   b2WeldJoint.prototype.GetReactionTorque = function (inv_dt) {
      if (inv_dt === undefined) inv_dt = 0;
      return inv_dt * this.m_impulse.z;
   }
   b2WeldJoint.prototype.b2WeldJoint = function (def) {
      this.__super.b2Joint.call(this, def);
      this.m_localAnchorA.SetV(def.localAnchorA);
      this.m_localAnchorB.SetV(def.localAnchorB);
      this.m_referenceAngle = def.referenceAngle;
      this.m_impulse.SetZero();
      this.m_mass = new b2Mat33();
   }
   b2WeldJoint.prototype.InitVelocityConstraints = function (step) {
      var tMat;
      var tX = 0;
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      tMat = bA.m_xf.R;
      var rAX = this.m_localAnchorA.x - bA.m_sweep.localCenter.x;
      var rAY = this.m_localAnchorA.y - bA.m_sweep.localCenter.y;
      tX = (tMat.col1.x * rAX + tMat.col2.x * rAY);
      rAY = (tMat.col1.y * rAX + tMat.col2.y * rAY);
      rAX = tX;
      tMat = bB.m_xf.R;
      var rBX = this.m_localAnchorB.x - bB.m_sweep.localCenter.x;
      var rBY = this.m_localAnchorB.y - bB.m_sweep.localCenter.y;
      tX = (tMat.col1.x * rBX + tMat.col2.x * rBY);
      rBY = (tMat.col1.y * rBX + tMat.col2.y * rBY);
      rBX = tX;
      var mA = bA.m_invMass;
      var mB = bB.m_invMass;
      var iA = bA.m_invI;
      var iB = bB.m_invI;
      this.m_mass.col1.x = mA + mB + rAY * rAY * iA + rBY * rBY * iB;
      this.m_mass.col2.x = (-rAY * rAX * iA) - rBY * rBX * iB;
      this.m_mass.col3.x = (-rAY * iA) - rBY * iB;
      this.m_mass.col1.y = this.m_mass.col2.x;
      this.m_mass.col2.y = mA + mB + rAX * rAX * iA + rBX * rBX * iB;
      this.m_mass.col3.y = rAX * iA + rBX * iB;
      this.m_mass.col1.z = this.m_mass.col3.x;
      this.m_mass.col2.z = this.m_mass.col3.y;
      this.m_mass.col3.z = iA + iB;
      if (step.warmStarting) {
         this.m_impulse.x *= step.dtRatio;
         this.m_impulse.y *= step.dtRatio;
         this.m_impulse.z *= step.dtRatio;
         bA.m_linearVelocity.x -= mA * this.m_impulse.x;
         bA.m_linearVelocity.y -= mA * this.m_impulse.y;
         bA.m_angularVelocity -= iA * (rAX * this.m_impulse.y - rAY * this.m_impulse.x + this.m_impulse.z);
         bB.m_linearVelocity.x += mB * this.m_impulse.x;
         bB.m_linearVelocity.y += mB * this.m_impulse.y;
         bB.m_angularVelocity += iB * (rBX * this.m_impulse.y - rBY * this.m_impulse.x + this.m_impulse.z);
      }
      else {
         this.m_impulse.SetZero();
      }
   }
   b2WeldJoint.prototype.SolveVelocityConstraints = function (step) {
      var tMat;
      var tX = 0;
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var vA = bA.m_linearVelocity;
      var wA = bA.m_angularVelocity;
      var vB = bB.m_linearVelocity;
      var wB = bB.m_angularVelocity;
      var mA = bA.m_invMass;
      var mB = bB.m_invMass;
      var iA = bA.m_invI;
      var iB = bB.m_invI;
      tMat = bA.m_xf.R;
      var rAX = this.m_localAnchorA.x - bA.m_sweep.localCenter.x;
      var rAY = this.m_localAnchorA.y - bA.m_sweep.localCenter.y;
      tX = (tMat.col1.x * rAX + tMat.col2.x * rAY);
      rAY = (tMat.col1.y * rAX + tMat.col2.y * rAY);
      rAX = tX;
      tMat = bB.m_xf.R;
      var rBX = this.m_localAnchorB.x - bB.m_sweep.localCenter.x;
      var rBY = this.m_localAnchorB.y - bB.m_sweep.localCenter.y;
      tX = (tMat.col1.x * rBX + tMat.col2.x * rBY);
      rBY = (tMat.col1.y * rBX + tMat.col2.y * rBY);
      rBX = tX;
      var Cdot1X = vB.x - wB * rBY - vA.x + wA * rAY;
      var Cdot1Y = vB.y + wB * rBX - vA.y - wA * rAX;
      var Cdot2 = wB - wA;
      var impulse = new b2Vec3();
      this.m_mass.Solve33(impulse, (-Cdot1X), (-Cdot1Y), (-Cdot2));
      this.m_impulse.Add(impulse);
      vA.x -= mA * impulse.x;
      vA.y -= mA * impulse.y;
      wA -= iA * (rAX * impulse.y - rAY * impulse.x + impulse.z);
      vB.x += mB * impulse.x;
      vB.y += mB * impulse.y;
      wB += iB * (rBX * impulse.y - rBY * impulse.x + impulse.z);
      bA.m_angularVelocity = wA;
      bB.m_angularVelocity = wB;
   }
   b2WeldJoint.prototype.SolvePositionConstraints = function (baumgarte) {
      if (baumgarte === undefined) baumgarte = 0;
      var tMat;
      var tX = 0;
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      tMat = bA.m_xf.R;
      var rAX = this.m_localAnchorA.x - bA.m_sweep.localCenter.x;
      var rAY = this.m_localAnchorA.y - bA.m_sweep.localCenter.y;
      tX = (tMat.col1.x * rAX + tMat.col2.x * rAY);
      rAY = (tMat.col1.y * rAX + tMat.col2.y * rAY);
      rAX = tX;
      tMat = bB.m_xf.R;
      var rBX = this.m_localAnchorB.x - bB.m_sweep.localCenter.x;
      var rBY = this.m_localAnchorB.y - bB.m_sweep.localCenter.y;
      tX = (tMat.col1.x * rBX + tMat.col2.x * rBY);
      rBY = (tMat.col1.y * rBX + tMat.col2.y * rBY);
      rBX = tX;
      var mA = bA.m_invMass;
      var mB = bB.m_invMass;
      var iA = bA.m_invI;
      var iB = bB.m_invI;
      var C1X = bB.m_sweep.c.x + rBX - bA.m_sweep.c.x - rAX;
      var C1Y = bB.m_sweep.c.y + rBY - bA.m_sweep.c.y - rAY;
      var C2 = bB.m_sweep.a - bA.m_sweep.a - this.m_referenceAngle;
      var k_allowedStretch = 10.0 * b2Settings.b2_linearSlop;
      var positionError = Math.sqrt(C1X * C1X + C1Y * C1Y);
      var angularError = b2Math.Abs(C2);
      if (positionError > k_allowedStretch) {
         iA *= 1.0;
         iB *= 1.0;
      }
      this.m_mass.col1.x = mA + mB + rAY * rAY * iA + rBY * rBY * iB;
      this.m_mass.col2.x = (-rAY * rAX * iA) - rBY * rBX * iB;
      this.m_mass.col3.x = (-rAY * iA) - rBY * iB;
      this.m_mass.col1.y = this.m_mass.col2.x;
      this.m_mass.col2.y = mA + mB + rAX * rAX * iA + rBX * rBX * iB;
      this.m_mass.col3.y = rAX * iA + rBX * iB;
      this.m_mass.col1.z = this.m_mass.col3.x;
      this.m_mass.col2.z = this.m_mass.col3.y;
      this.m_mass.col3.z = iA + iB;
      var impulse = new b2Vec3();
      this.m_mass.Solve33(impulse, (-C1X), (-C1Y), (-C2));
      bA.m_sweep.c.x -= mA * impulse.x;
      bA.m_sweep.c.y -= mA * impulse.y;
      bA.m_sweep.a -= iA * (rAX * impulse.y - rAY * impulse.x + impulse.z);
      bB.m_sweep.c.x += mB * impulse.x;
      bB.m_sweep.c.y += mB * impulse.y;
      bB.m_sweep.a += iB * (rBX * impulse.y - rBY * impulse.x + impulse.z);
      bA.SynchronizeTransform();
      bB.SynchronizeTransform();
      return positionError <= b2Settings.b2_linearSlop && angularError <= b2Settings.b2_angularSlop;
   }
   Box2D.inherit(b2WeldJointDef, Box2D.Dynamics.Joints.b2JointDef);
   b2WeldJointDef.prototype.__super = Box2D.Dynamics.Joints.b2JointDef.prototype;
   b2WeldJointDef.b2WeldJointDef = function () {
      Box2D.Dynamics.Joints.b2JointDef.b2JointDef.apply(this, arguments);
      this.localAnchorA = new b2Vec2();
      this.localAnchorB = new b2Vec2();
   };
   b2WeldJointDef.prototype.b2WeldJointDef = function () {
      this.__super.b2JointDef.call(this);
      this.type = b2Joint.e_weldJoint;
      this.referenceAngle = 0.0;
   }
   b2WeldJointDef.prototype.Initialize = function (bA, bB, anchor) {
      this.bodyA = bA;
      this.bodyB = bB;
      this.localAnchorA.SetV(this.bodyA.GetLocalPoint(anchor));
      this.localAnchorB.SetV(this.bodyB.GetLocalPoint(anchor));
      this.referenceAngle = this.bodyB.GetAngle() - this.bodyA.GetAngle();
   }
})();
(function () {
   var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
   b2DebugDraw.b2DebugDraw = function () {
      this.m_drawScale = 1.0;
      this.m_lineThickness = 1.0;
      this.m_alpha = 1.0;
      this.m_fillAlpha = 1.0;
      this.m_xformScale = 1.0;
      var __this = this;
      //#WORKAROUND
      this.m_sprite = {
         graphics: {
            clear: function () {
               __this.m_ctx.clearRect(0, 0, __this.m_ctx.canvas.width, __this.m_ctx.canvas.height)
            }
         }
      };
   };
   b2DebugDraw.prototype._color = function (color, alpha) {
      return "rgba(" + ((color & 0xFF0000) >> 16) + "," + ((color & 0xFF00) >> 8) + "," + (color & 0xFF) + "," + alpha + ")";
   };
   b2DebugDraw.prototype.b2DebugDraw = function () {
      this.m_drawFlags = 0;
   };
   b2DebugDraw.prototype.SetFlags = function (flags) {
      if (flags === undefined) flags = 0;
      this.m_drawFlags = flags;
   };
   b2DebugDraw.prototype.GetFlags = function () {
      return this.m_drawFlags;
   };
   b2DebugDraw.prototype.AppendFlags = function (flags) {
      if (flags === undefined) flags = 0;
      this.m_drawFlags |= flags;
   };
   b2DebugDraw.prototype.ClearFlags = function (flags) {
      if (flags === undefined) flags = 0;
      this.m_drawFlags &= ~flags;
   };
   b2DebugDraw.prototype.SetSprite = function (sprite) {
      this.m_ctx = sprite;
   };
   b2DebugDraw.prototype.GetSprite = function () {
      return this.m_ctx;
   };
   b2DebugDraw.prototype.SetDrawScale = function (drawScale) {
      if (drawScale === undefined) drawScale = 0;
      this.m_drawScale = drawScale;
   };
   b2DebugDraw.prototype.GetDrawScale = function () {
      return this.m_drawScale;
   };
   b2DebugDraw.prototype.SetLineThickness = function (lineThickness) {
      if (lineThickness === undefined) lineThickness = 0;
      this.m_lineThickness = lineThickness;
      this.m_ctx.strokeWidth = lineThickness;
   };
   b2DebugDraw.prototype.GetLineThickness = function () {
      return this.m_lineThickness;
   };
   b2DebugDraw.prototype.SetAlpha = function (alpha) {
      if (alpha === undefined) alpha = 0;
      this.m_alpha = alpha;
   };
   b2DebugDraw.prototype.GetAlpha = function () {
      return this.m_alpha;
   };
   b2DebugDraw.prototype.SetFillAlpha = function (alpha) {
      if (alpha === undefined) alpha = 0;
      this.m_fillAlpha = alpha;
   };
   b2DebugDraw.prototype.GetFillAlpha = function () {
      return this.m_fillAlpha;
   };
   b2DebugDraw.prototype.SetXFormScale = function (xformScale) {
      if (xformScale === undefined) xformScale = 0;
      this.m_xformScale = xformScale;
   };
   b2DebugDraw.prototype.GetXFormScale = function () {
      return this.m_xformScale;
   };
   b2DebugDraw.prototype.DrawPolygon = function (vertices, vertexCount, color) {
      if (!vertexCount) return;
      var s = this.m_ctx;
      var drawScale = this.m_drawScale;
      s.beginPath();
      s.strokeStyle = this._color(color.color, this.m_alpha);
      s.moveTo(vertices[0].x * drawScale, vertices[0].y * drawScale);
      for (var i = 1; i < vertexCount; i++) {
         s.lineTo(vertices[i].x * drawScale, vertices[i].y * drawScale);
      }
      s.lineTo(vertices[0].x * drawScale, vertices[0].y * drawScale);
      s.closePath();
      s.stroke();
   };
   b2DebugDraw.prototype.DrawSolidPolygon = function (vertices, vertexCount, color) {
      if (!vertexCount) return;
      var s = this.m_ctx;
      var drawScale = this.m_drawScale;
      s.beginPath();
      s.strokeStyle = this._color(color.color, this.m_alpha);
      s.fillStyle = this._color(color.color, this.m_fillAlpha);
      s.moveTo(vertices[0].x * drawScale, vertices[0].y * drawScale);
      for (var i = 1; i < vertexCount; i++) {
         s.lineTo(vertices[i].x * drawScale, vertices[i].y * drawScale);
      }
      s.lineTo(vertices[0].x * drawScale, vertices[0].y * drawScale);
      s.closePath();
      s.fill();
      s.stroke();
   };
   b2DebugDraw.prototype.DrawCircle = function (center, radius, color) {
      if (!radius) return;
      var s = this.m_ctx;
      var drawScale = this.m_drawScale;
      s.beginPath();
      s.strokeStyle = this._color(color.color, this.m_alpha);
      s.arc(center.x * drawScale, center.y * drawScale, radius * drawScale, 0, Math.PI * 2, true);
      s.closePath();
      s.stroke();
   };
   b2DebugDraw.prototype.DrawSolidCircle = function (center, radius, axis, color) {
      if (!radius) return;
      var s = this.m_ctx,
         drawScale = this.m_drawScale,
         cx = center.x * drawScale,
         cy = center.y * drawScale;
      s.moveTo(0, 0);
      s.beginPath();
      s.strokeStyle = this._color(color.color, this.m_alpha);
      s.fillStyle = this._color(color.color, this.m_fillAlpha);
      s.arc(cx, cy, radius * drawScale, 0, Math.PI * 2, true);
      s.moveTo(cx, cy);
      s.lineTo((center.x + axis.x * radius) * drawScale, (center.y + axis.y * radius) * drawScale);
      s.closePath();
      s.fill();
      s.stroke();
   };
   b2DebugDraw.prototype.DrawSegment = function (p1, p2, color) {
      var s = this.m_ctx,
         drawScale = this.m_drawScale;
      s.strokeStyle = this._color(color.color, this.m_alpha);
      s.beginPath();
      s.moveTo(p1.x * drawScale, p1.y * drawScale);
      s.lineTo(p2.x * drawScale, p2.y * drawScale);
      s.closePath();
      s.stroke();
   };
   b2DebugDraw.prototype.DrawTransform = function (xf) {
      var s = this.m_ctx,
         drawScale = this.m_drawScale;
      s.beginPath();
      s.strokeStyle = this._color(0xff0000, this.m_alpha);
      s.moveTo(xf.position.x * drawScale, xf.position.y * drawScale);
      s.lineTo((xf.position.x + this.m_xformScale * xf.R.col1.x) * drawScale, (xf.position.y + this.m_xformScale * xf.R.col1.y) * drawScale);

      s.strokeStyle = this._color(0xff00, this.m_alpha);
      s.moveTo(xf.position.x * drawScale, xf.position.y * drawScale);
      s.lineTo((xf.position.x + this.m_xformScale * xf.R.col2.x) * drawScale, (xf.position.y + this.m_xformScale * xf.R.col2.y) * drawScale);
      s.closePath();
      s.stroke();
   };
})(); //post-definitions
var i;
for (i = 0; i < Box2D.postDefs.length; ++i) Box2D.postDefs[i]();
delete Box2D.postDefs;;/*!
* @license PreloadJS
* Visit http://createjs.com/ for documentation, updates and examples.
*
* Copyright (c) 2011-2013 gskinner.com, inc.
*
* Distributed under the terms of the MIT license.
* http://www.opensource.org/licenses/mit-license.html
*
* This notice shall be included in all copies or substantial portions of the Software.
*/
this.createjs=this.createjs||{},function(){"use strict";var a=createjs.PreloadJS=createjs.PreloadJS||{};a.version="0.4.1",a.buildDate="Thu, 12 Dec 2013 23:33:38 GMT"}(),this.createjs=this.createjs||{},function(){"use strict";var a=function(a,b,c){this.initialize(a,b,c)},b=a.prototype;b.type=null,b.target=null,b.currentTarget=null,b.eventPhase=0,b.bubbles=!1,b.cancelable=!1,b.timeStamp=0,b.defaultPrevented=!1,b.propagationStopped=!1,b.immediatePropagationStopped=!1,b.removed=!1,b.initialize=function(a,b,c){this.type=a,this.bubbles=b,this.cancelable=c,this.timeStamp=(new Date).getTime()},b.preventDefault=function(){this.defaultPrevented=!0},b.stopPropagation=function(){this.propagationStopped=!0},b.stopImmediatePropagation=function(){this.immediatePropagationStopped=this.propagationStopped=!0},b.remove=function(){this.removed=!0},b.clone=function(){return new a(this.type,this.bubbles,this.cancelable)},b.toString=function(){return"[Event (type="+this.type+")]"},createjs.Event=a}(),this.createjs=this.createjs||{},function(){"use strict";var a=function(){},b=a.prototype;a.initialize=function(a){a.addEventListener=b.addEventListener,a.on=b.on,a.removeEventListener=a.off=b.removeEventListener,a.removeAllEventListeners=b.removeAllEventListeners,a.hasEventListener=b.hasEventListener,a.dispatchEvent=b.dispatchEvent,a._dispatchEvent=b._dispatchEvent,a.willTrigger=b.willTrigger},b._listeners=null,b._captureListeners=null,b.initialize=function(){},b.addEventListener=function(a,b,c){var d;d=c?this._captureListeners=this._captureListeners||{}:this._listeners=this._listeners||{};var e=d[a];return e&&this.removeEventListener(a,b,c),e=d[a],e?e.push(b):d[a]=[b],b},b.on=function(a,b,c,d,e,f){return b.handleEvent&&(c=c||b,b=b.handleEvent),c=c||this,this.addEventListener(a,function(a){b.call(c,a,e),d&&a.remove()},f)},b.removeEventListener=function(a,b,c){var d=c?this._captureListeners:this._listeners;if(d){var e=d[a];if(e)for(var f=0,g=e.length;g>f;f++)if(e[f]==b){1==g?delete d[a]:e.splice(f,1);break}}},b.off=b.removeEventListener,b.removeAllEventListeners=function(a){a?(this._listeners&&delete this._listeners[a],this._captureListeners&&delete this._captureListeners[a]):this._listeners=this._captureListeners=null},b.dispatchEvent=function(a,b){if("string"==typeof a){var c=this._listeners;if(!c||!c[a])return!1;a=new createjs.Event(a)}if(a.target=b||this,a.bubbles&&this.parent){for(var d=this,e=[d];d.parent;)e.push(d=d.parent);var f,g=e.length;for(f=g-1;f>=0&&!a.propagationStopped;f--)e[f]._dispatchEvent(a,1+(0==f));for(f=1;g>f&&!a.propagationStopped;f++)e[f]._dispatchEvent(a,3)}else this._dispatchEvent(a,2);return a.defaultPrevented},b.hasEventListener=function(a){var b=this._listeners,c=this._captureListeners;return!!(b&&b[a]||c&&c[a])},b.willTrigger=function(a){for(var b=this;b;){if(b.hasEventListener(a))return!0;b=b.parent}return!1},b.toString=function(){return"[EventDispatcher]"},b._dispatchEvent=function(a,b){var c,d=1==b?this._captureListeners:this._listeners;if(a&&d){var e=d[a.type];if(!e||!(c=e.length))return;a.currentTarget=this,a.eventPhase=b,a.removed=!1,e=e.slice();for(var f=0;c>f&&!a.immediatePropagationStopped;f++){var g=e[f];g.handleEvent?g.handleEvent(a):g(a),a.removed&&(this.off(a.type,g,1==b),a.removed=!1)}}},createjs.EventDispatcher=a}(),this.createjs=this.createjs||{},function(){"use strict";createjs.indexOf=function(a,b){for(var c=0,d=a.length;d>c;c++)if(b===a[c])return c;return-1}}(),this.createjs=this.createjs||{},function(){"use strict";createjs.proxy=function(a,b){var c=Array.prototype.slice.call(arguments,2);return function(){return a.apply(b,Array.prototype.slice.call(arguments,0).concat(c))}}}(),this.createjs=this.createjs||{},function(){"use strict";var a=function(){this.init()};a.prototype=new createjs.EventDispatcher;var b=a.prototype,c=a;c.FILE_PATTERN=/^(?:(\w+:)\/{2}(\w+(?:\.\w+)*\/?)|(.{0,2}\/{1}))?([/.]*?(?:[^?]+)?\/)?((?:[^/?]+)\.(\w+))(?:\?(\S+)?)?$/,c.PATH_PATTERN=/^(?:(\w+:)\/{2})|(.{0,2}\/{1})?([/.]*?(?:[^?]+)?\/?)?$/,b.loaded=!1,b.canceled=!1,b.progress=0,b._item=null,b.getItem=function(){return this._item},b.init=function(){},b.load=function(){},b.close=function(){},b._sendLoadStart=function(){this._isCanceled()||this.dispatchEvent("loadstart")},b._sendProgress=function(a){if(!this._isCanceled()){var b=null;"number"==typeof a?(this.progress=a,b=new createjs.Event("progress"),b.loaded=this.progress,b.total=1):(b=a,this.progress=a.loaded/a.total,(isNaN(this.progress)||1/0==this.progress)&&(this.progress=0)),b.progress=this.progress,this.hasEventListener("progress")&&this.dispatchEvent(b)}},b._sendComplete=function(){this._isCanceled()||this.dispatchEvent("complete")},b._sendError=function(a){!this._isCanceled()&&this.hasEventListener("error")&&(null==a&&(a=new createjs.Event("error")),this.dispatchEvent(a))},b._isCanceled=function(){return null==window.createjs||this.canceled?!0:!1},b._parseURI=function(a){return a?a.match(c.FILE_PATTERN):null},b._parsePath=function(a){return a?a.match(c.PATH_PATTERN):null},b._formatQueryString=function(a,b){if(null==a)throw new Error("You must specify data.");var c=[];for(var d in a)c.push(d+"="+escape(a[d]));return b&&(c=c.concat(b)),c.join("&")},b.buildPath=function(a,b){if(null==b)return a;var c=[],d=a.indexOf("?");if(-1!=d){var e=a.slice(d+1);c=c.concat(e.split("&"))}return-1!=d?a.slice(0,d)+"?"+this._formatQueryString(b,c):a+"?"+this._formatQueryString(b,c)},b._isCrossDomain=function(a){var b=document.createElement("a");b.href=a.src;var c=document.createElement("a");c.href=location.href;var d=""!=b.hostname&&(b.port!=c.port||b.protocol!=c.protocol||b.hostname!=c.hostname);return d},b._isLocal=function(a){var b=document.createElement("a");return b.href=a.src,""==b.hostname&&"file:"==b.protocol},b.toString=function(){return"[PreloadJS AbstractLoader]"},createjs.AbstractLoader=a}(),this.createjs=this.createjs||{},function(){"use strict";var a=function(a,b,c){this.init(a,b,c)},b=a.prototype=new createjs.AbstractLoader,c=a;c.loadTimeout=8e3,c.LOAD_TIMEOUT=0,c.BINARY="binary",c.CSS="css",c.IMAGE="image",c.JAVASCRIPT="javascript",c.JSON="json",c.JSONP="jsonp",c.MANIFEST="manifest",c.SOUND="sound",c.SVG="svg",c.TEXT="text",c.XML="xml",c.POST="POST",c.GET="GET",b._basePath=null,b._crossOrigin="",b.useXHR=!0,b.stopOnError=!1,b.maintainScriptOrder=!0,b.next=null,b._typeCallbacks=null,b._extensionCallbacks=null,b._loadStartWasDispatched=!1,b._maxConnections=1,b._currentlyLoadingScript=null,b._currentLoads=null,b._loadQueue=null,b._loadQueueBackup=null,b._loadItemsById=null,b._loadItemsBySrc=null,b._loadedResults=null,b._loadedRawResults=null,b._numItems=0,b._numItemsLoaded=0,b._scriptOrder=null,b._loadedScripts=null,b.init=function(a,b,c){this._numItems=this._numItemsLoaded=0,this._paused=!1,this._loadStartWasDispatched=!1,this._currentLoads=[],this._loadQueue=[],this._loadQueueBackup=[],this._scriptOrder=[],this._loadedScripts=[],this._loadItemsById={},this._loadItemsBySrc={},this._loadedResults={},this._loadedRawResults={},this._typeCallbacks={},this._extensionCallbacks={},this._basePath=b,this.setUseXHR(a),this._crossOrigin=c===!0?"Anonymous":c===!1||null==c?"":c},b.setUseXHR=function(a){return this.useXHR=0!=a&&null!=window.XMLHttpRequest,this.useXHR},b.removeAll=function(){this.remove()},b.remove=function(a){var b=null;if(!a||a instanceof Array){if(a)b=a;else if(arguments.length>0)return}else b=[a];var c=!1;if(b){for(;b.length;){var d=b.pop(),e=this.getResult(d);for(f=this._loadQueue.length-1;f>=0;f--)if(g=this._loadQueue[f].getItem(),g.id==d||g.src==d){this._loadQueue.splice(f,1)[0].cancel();break}for(f=this._loadQueueBackup.length-1;f>=0;f--)if(g=this._loadQueueBackup[f].getItem(),g.id==d||g.src==d){this._loadQueueBackup.splice(f,1)[0].cancel();break}if(e)delete this._loadItemsById[e.id],delete this._loadItemsBySrc[e.src],this._disposeItem(e);else for(var f=this._currentLoads.length-1;f>=0;f--){var g=this._currentLoads[f].getItem();if(g.id==d||g.src==d){this._currentLoads.splice(f,1)[0].cancel(),c=!0;break}}}c&&this._loadNext()}else{this.close();for(var h in this._loadItemsById)this._disposeItem(this._loadItemsById[h]);this.init(this.useXHR)}},b.reset=function(){this.close();for(var a in this._loadItemsById)this._disposeItem(this._loadItemsById[a]);for(var b=[],c=0,d=this._loadQueueBackup.length;d>c;c++)b.push(this._loadQueueBackup[c].getItem());this.loadManifest(b,!1)},c.isBinary=function(a){switch(a){case createjs.LoadQueue.IMAGE:case createjs.LoadQueue.BINARY:return!0;default:return!1}},c.isText=function(a){switch(a){case createjs.LoadQueue.TEXT:case createjs.LoadQueue.JSON:case createjs.LoadQueue.MANIFEST:case createjs.LoadQueue.XML:case createjs.LoadQueue.HTML:case createjs.LoadQueue.CSS:case createjs.LoadQueue.SVG:case createjs.LoadQueue.JAVASCRIPT:return!0;default:return!1}},b.installPlugin=function(a){if(null!=a&&null!=a.getPreloadHandlers){var b=a.getPreloadHandlers();if(b.scope=a,null!=b.types)for(var c=0,d=b.types.length;d>c;c++)this._typeCallbacks[b.types[c]]=b;if(null!=b.extensions)for(c=0,d=b.extensions.length;d>c;c++)this._extensionCallbacks[b.extensions[c]]=b}},b.setMaxConnections=function(a){this._maxConnections=a,!this._paused&&this._loadQueue.length>0&&this._loadNext()},b.loadFile=function(a,b,c){if(null==a){var d=new createjs.Event("error");return d.text="PRELOAD_NO_FILE",this._sendError(d),void 0}this._addItem(a,null,c),b!==!1?this.setPaused(!1):this.setPaused(!0)},b.loadManifest=function(a,b,d){var e=null,f=null;if(a instanceof Array){if(0==a.length){var g=new createjs.Event("error");return g.text="PRELOAD_MANIFEST_EMPTY",this._sendError(g),void 0}e=a}else if("string"==typeof a)e=[{src:a,type:c.MANIFEST}];else{if("object"!=typeof a){var g=new createjs.Event("error");return g.text="PRELOAD_MANIFEST_NULL",this._sendError(g),void 0}if(void 0!==a.src){if(null==a.type)a.type=c.MANIFEST;else if(a.type!=c.MANIFEST){var g=new createjs.Event("error");g.text="PRELOAD_MANIFEST_ERROR",this._sendError(g)}e=[a]}else void 0!==a.manifest&&(e=a.manifest,f=a.path)}for(var h=0,i=e.length;i>h;h++)this._addItem(e[h],f,d);b!==!1?this.setPaused(!1):this.setPaused(!0)},b.load=function(){this.setPaused(!1)},b.getItem=function(a){return this._loadItemsById[a]||this._loadItemsBySrc[a]},b.getResult=function(a,b){var c=this._loadItemsById[a]||this._loadItemsBySrc[a];if(null==c)return null;var d=c.id;return b&&this._loadedRawResults[d]?this._loadedRawResults[d]:this._loadedResults[d]},b.setPaused=function(a){this._paused=a,this._paused||this._loadNext()},b.close=function(){for(;this._currentLoads.length;)this._currentLoads.pop().cancel();this._scriptOrder.length=0,this._loadedScripts.length=0,this.loadStartWasDispatched=!1},b._addItem=function(a,b,c){var d=this._createLoadItem(a,b,c);if(null!=d){var e=this._createLoader(d);null!=e&&(this._loadQueue.push(e),this._loadQueueBackup.push(e),this._numItems++,this._updateProgress(),this.maintainScriptOrder&&d.type==createjs.LoadQueue.JAVASCRIPT&&e instanceof createjs.XHRLoader&&(this._scriptOrder.push(d),this._loadedScripts.push(null)))}},b._createLoadItem=function(a,b,c){var d=null;switch(typeof a){case"string":d={src:a};break;case"object":d=window.HTMLAudioElement&&a instanceof window.HTMLAudioElement?{tag:a,src:d.tag.src,type:createjs.LoadQueue.SOUND}:a;break;default:return null}var e=this._parseURI(d.src);null!=e&&(d.ext=e[6]),null==d.type&&(d.type=this._getTypeByExtension(d.ext));var f="",g=c||this._basePath,h=d.src;if(e&&null==e[1]&&null==e[3])if(b){f=b;var i=this._parsePath(b);h=b+h,null!=g&&i&&null==i[1]&&null==i[2]&&(f=g+f)}else null!=g&&(f=g);if(d.src=f+d.src,d.path=f,(d.type==createjs.LoadQueue.JSON||d.type==createjs.LoadQueue.MANIFEST)&&(d._loadAsJSONP=null!=d.callback),d.type==createjs.LoadQueue.JSONP&&null==d.callback)throw new Error("callback is required for loading JSONP requests.");(void 0===d.tag||null===d.tag)&&(d.tag=this._createTag(d)),(void 0===d.id||null===d.id||""===d.id)&&(d.id=h);var j=this._typeCallbacks[d.type]||this._extensionCallbacks[d.ext];if(j){var k=j.callback.call(j.scope,d.src,d.type,d.id,d.data,f,this);if(k===!1)return null;k===!0||(null!=k.src&&(d.src=k.src),null!=k.id&&(d.id=k.id),null!=k.tag&&(d.tag=k.tag),null!=k.completeHandler&&(d.completeHandler=k.completeHandler),k.type&&(d.type=k.type),e=this._parseURI(d.src),null!=e&&null!=e[6]&&(d.ext=e[6].toLowerCase()))}return this._loadItemsById[d.id]=d,this._loadItemsBySrc[d.src]=d,d},b._createLoader=function(a){var b=this.useXHR;switch(a.type){case createjs.LoadQueue.JSON:case createjs.LoadQueue.MANIFEST:b=!a._loadAsJSONP;break;case createjs.LoadQueue.XML:case createjs.LoadQueue.TEXT:b=!0;break;case createjs.LoadQueue.SOUND:case createjs.LoadQueue.JSONP:b=!1;break;case null:return null}return b?new createjs.XHRLoader(a,this._crossOrigin):new createjs.TagLoader(a)},b._loadNext=function(){if(!this._paused){this._loadStartWasDispatched||(this._sendLoadStart(),this._loadStartWasDispatched=!0),this._numItems==this._numItemsLoaded?(this.loaded=!0,this._sendComplete(),this.next&&this.next.load&&this.next.load()):this.loaded=!1;for(var a=0;a<this._loadQueue.length&&!(this._currentLoads.length>=this._maxConnections);a++){var b=this._loadQueue[a];if(this.maintainScriptOrder&&b instanceof createjs.TagLoader&&b.getItem().type==createjs.LoadQueue.JAVASCRIPT){if(this._currentlyLoadingScript)continue;this._currentlyLoadingScript=!0}this._loadQueue.splice(a,1),a--,this._loadItem(b)}}},b._loadItem=function(a){a.on("progress",this._handleProgress,this),a.on("complete",this._handleFileComplete,this),a.on("error",this._handleFileError,this),this._currentLoads.push(a),this._sendFileStart(a.getItem()),a.load()},b._handleFileError=function(a){var b=a.target;this._numItemsLoaded++,this._updateProgress();var c=new createjs.Event("error");c.text="FILE_LOAD_ERROR",c.item=b.getItem(),this._sendError(c),this.stopOnError||(this._removeLoadItem(b),this._loadNext())},b._handleFileComplete=function(a){var b=a.target,c=b.getItem();if(this._loadedResults[c.id]=b.getResult(),b instanceof createjs.XHRLoader&&(this._loadedRawResults[c.id]=b.getResult(!0)),this._removeLoadItem(b),this.maintainScriptOrder&&c.type==createjs.LoadQueue.JAVASCRIPT){if(!(b instanceof createjs.TagLoader))return this._loadedScripts[createjs.indexOf(this._scriptOrder,c)]=c,this._checkScriptLoadOrder(b),void 0;this._currentlyLoadingScript=!1}if(delete c._loadAsJSONP,c.type==createjs.LoadQueue.MANIFEST){var d=b.getResult();null!=d&&void 0!==d.manifest&&this.loadManifest(d,!0)}this._processFinishedLoad(c,b)},b._processFinishedLoad=function(a,b){this._numItemsLoaded++,this._updateProgress(),this._sendFileComplete(a,b),this._loadNext()},b._checkScriptLoadOrder=function(){for(var a=this._loadedScripts.length,b=0;a>b;b++){var c=this._loadedScripts[b];if(null===c)break;if(c!==!0){var d=this._loadedResults[c.id];(document.body||document.getElementsByTagName("body")[0]).appendChild(d),this._processFinishedLoad(c),this._loadedScripts[b]=!0}}},b._removeLoadItem=function(a){for(var b=this._currentLoads.length,c=0;b>c;c++)if(this._currentLoads[c]==a){this._currentLoads.splice(c,1);break}},b._handleProgress=function(a){var b=a.target;this._sendFileProgress(b.getItem(),b.progress),this._updateProgress()},b._updateProgress=function(){var a=this._numItemsLoaded/this._numItems,b=this._numItems-this._numItemsLoaded;if(b>0){for(var c=0,d=0,e=this._currentLoads.length;e>d;d++)c+=this._currentLoads[d].progress;a+=c/b*(b/this._numItems)}this._sendProgress(a)},b._disposeItem=function(a){delete this._loadedResults[a.id],delete this._loadedRawResults[a.id],delete this._loadItemsById[a.id],delete this._loadItemsBySrc[a.src]},b._createTag=function(a){var b=null;switch(a.type){case createjs.LoadQueue.IMAGE:return b=document.createElement("img"),""==this._crossOrigin||this._isLocal(a)||(b.crossOrigin=this._crossOrigin),b;case createjs.LoadQueue.SOUND:return b=document.createElement("audio"),b.autoplay=!1,b;case createjs.LoadQueue.JSON:case createjs.LoadQueue.JSONP:case createjs.LoadQueue.JAVASCRIPT:case createjs.LoadQueue.MANIFEST:return b=document.createElement("script"),b.type="text/javascript",b;case createjs.LoadQueue.CSS:return b=this.useXHR?document.createElement("style"):document.createElement("link"),b.rel="stylesheet",b.type="text/css",b;case createjs.LoadQueue.SVG:return this.useXHR?b=document.createElement("svg"):(b=document.createElement("object"),b.type="image/svg+xml"),b}return null},b._getTypeByExtension=function(a){if(null==a)return createjs.LoadQueue.TEXT;switch(a.toLowerCase()){case"jpeg":case"jpg":case"gif":case"png":case"webp":case"bmp":return createjs.LoadQueue.IMAGE;case"ogg":case"mp3":case"wav":return createjs.LoadQueue.SOUND;case"json":return createjs.LoadQueue.JSON;case"xml":return createjs.LoadQueue.XML;case"css":return createjs.LoadQueue.CSS;case"js":return createjs.LoadQueue.JAVASCRIPT;case"svg":return createjs.LoadQueue.SVG;default:return createjs.LoadQueue.TEXT}},b._sendFileProgress=function(a,b){if(this._isCanceled())return this._cleanUp(),void 0;if(this.hasEventListener("fileprogress")){var c=new createjs.Event("fileprogress");c.progress=b,c.loaded=b,c.total=1,c.item=a,this.dispatchEvent(c)}},b._sendFileComplete=function(a,b){if(!this._isCanceled()){var c=new createjs.Event("fileload");c.loader=b,c.item=a,c.result=this._loadedResults[a.id],c.rawResult=this._loadedRawResults[a.id],a.completeHandler&&a.completeHandler(c),this.hasEventListener("fileload")&&this.dispatchEvent(c)}},b._sendFileStart=function(a){var b=new createjs.Event("filestart");b.item=a,this.hasEventListener("filestart")&&this.dispatchEvent(b)},b.toString=function(){return"[PreloadJS LoadQueue]"},createjs.LoadQueue=a;var d=function(){};d.init=function(){var a=navigator.userAgent;d.isFirefox=a.indexOf("Firefox")>-1,d.isOpera=null!=window.opera,d.isChrome=a.indexOf("Chrome")>-1,d.isIOS=a.indexOf("iPod")>-1||a.indexOf("iPhone")>-1||a.indexOf("iPad")>-1},d.init(),createjs.LoadQueue.BrowserDetect=d}(),this.createjs=this.createjs||{},function(){"use strict";var a=function(a){this.init(a)},b=a.prototype=new createjs.AbstractLoader;b._loadTimeout=null,b._tagCompleteProxy=null,b._isAudio=!1,b._tag=null,b._jsonResult=null,b.init=function(a){this._item=a,this._tag=a.tag,this._isAudio=window.HTMLAudioElement&&a.tag instanceof window.HTMLAudioElement,this._tagCompleteProxy=createjs.proxy(this._handleLoad,this)},b.getResult=function(){return this._item.type==createjs.LoadQueue.JSONP||this._item.type==createjs.LoadQueue.MANIFEST?this._jsonResult:this._tag},b.cancel=function(){this.canceled=!0,this._clean()},b.load=function(){var a=this._item,b=this._tag;clearTimeout(this._loadTimeout);var c=createjs.LoadQueue.LOAD_TIMEOUT;0==c&&(c=createjs.LoadQueue.loadTimeout),this._loadTimeout=setTimeout(createjs.proxy(this._handleTimeout,this),c),this._isAudio&&(b.src=null,b.preload="auto"),b.onerror=createjs.proxy(this._handleError,this),this._isAudio?(b.onstalled=createjs.proxy(this._handleStalled,this),b.addEventListener("canplaythrough",this._tagCompleteProxy,!1)):(b.onload=createjs.proxy(this._handleLoad,this),b.onreadystatechange=createjs.proxy(this._handleReadyStateChange,this));var d=this.buildPath(a.src,a.values);switch(a.type){case createjs.LoadQueue.CSS:b.href=d;break;case createjs.LoadQueue.SVG:b.data=d;break;default:b.src=d}if(a.type==createjs.LoadQueue.JSONP||a.type==createjs.LoadQueue.JSON||a.type==createjs.LoadQueue.MANIFEST){if(null==a.callback)throw new Error("callback is required for loading JSONP requests.");if(null!=window[a.callback])throw new Error('JSONP callback "'+a.callback+'" already exists on window. You need to specify a different callback. Or re-name the current one.');window[a.callback]=createjs.proxy(this._handleJSONPLoad,this)}(a.type==createjs.LoadQueue.SVG||a.type==createjs.LoadQueue.JSONP||a.type==createjs.LoadQueue.JSON||a.type==createjs.LoadQueue.MANIFEST||a.type==createjs.LoadQueue.JAVASCRIPT||a.type==createjs.LoadQueue.CSS)&&(this._startTagVisibility=b.style.visibility,b.style.visibility="hidden",(document.body||document.getElementsByTagName("body")[0]).appendChild(b)),null!=b.load&&b.load()},b._handleJSONPLoad=function(a){this._jsonResult=a},b._handleTimeout=function(){this._clean();var a=new createjs.Event("error");a.text="PRELOAD_TIMEOUT",this._sendError(a)},b._handleStalled=function(){},b._handleError=function(){this._clean();var a=new createjs.Event("error");this._sendError(a)},b._handleReadyStateChange=function(){clearTimeout(this._loadTimeout);var a=this.getItem().tag;("loaded"==a.readyState||"complete"==a.readyState)&&this._handleLoad()},b._handleLoad=function(){if(!this._isCanceled()){var a=this.getItem(),b=a.tag;if(!(this.loaded||this._isAudio&&4!==b.readyState)){switch(this.loaded=!0,a.type){case createjs.LoadQueue.SVG:case createjs.LoadQueue.JSON:case createjs.LoadQueue.JSONP:case createjs.LoadQueue.MANIFEST:case createjs.LoadQueue.CSS:b.style.visibility=this._startTagVisibility,(document.body||document.getElementsByTagName("body")[0]).removeChild(b)}this._clean(),this._sendComplete()}}},b._clean=function(){clearTimeout(this._loadTimeout);var a=this.getItem(),b=a.tag;null!=b&&(b.onload=null,b.removeEventListener&&b.removeEventListener("canplaythrough",this._tagCompleteProxy,!1),b.onstalled=null,b.onprogress=null,b.onerror=null,null!=b.parentNode&&a.type==createjs.LoadQueue.SVG&&a.type==createjs.LoadQueue.JSON&&a.type==createjs.LoadQueue.MANIFEST&&a.type==createjs.LoadQueue.CSS&&a.type==createjs.LoadQueue.JSONP&&b.parentNode.removeChild(b));var a=this.getItem();(a.type==createjs.LoadQueue.JSONP||a.type==createjs.LoadQueue.MANIFEST)&&(window[a.callback]=null)},b.toString=function(){return"[PreloadJS TagLoader]"},createjs.TagLoader=a}(),this.createjs=this.createjs||{},function(){"use strict";var a=function(a,b){this.init(a,b)},b=a.prototype=new createjs.AbstractLoader;b._request=null,b._loadTimeout=null,b._xhrLevel=1,b._response=null,b._rawResponse=null,b._crossOrigin="",b.init=function(a,b){this._item=a,this._crossOrigin=b,!this._createXHR(a)},b.getResult=function(a){return a&&this._rawResponse?this._rawResponse:this._response},b.cancel=function(){this.canceled=!0,this._clean(),this._request.abort()},b.load=function(){if(null==this._request)return this._handleError(),void 0;if(this._request.onloadstart=createjs.proxy(this._handleLoadStart,this),this._request.onprogress=createjs.proxy(this._handleProgress,this),this._request.onabort=createjs.proxy(this._handleAbort,this),this._request.onerror=createjs.proxy(this._handleError,this),this._request.ontimeout=createjs.proxy(this._handleTimeout,this),1==this._xhrLevel){var a=createjs.LoadQueue.LOAD_TIMEOUT;if(0==a)a=createjs.LoadQueue.loadTimeout;else try{console.warn("LoadQueue.LOAD_TIMEOUT has been deprecated in favor of LoadQueue.loadTimeout")}catch(b){}this._loadTimeout=setTimeout(createjs.proxy(this._handleTimeout,this),a)}this._request.onload=createjs.proxy(this._handleLoad,this),this._request.onreadystatechange=createjs.proxy(this._handleReadyStateChange,this);try{this._item.values&&this._item.method!=createjs.LoadQueue.GET?this._item.method==createjs.LoadQueue.POST&&this._request.send(this._formatQueryString(this._item.values)):this._request.send()}catch(c){var d=new createjs.Event("error");d.error=c,this._sendError(d)}},b.getAllResponseHeaders=function(){return this._request.getAllResponseHeaders instanceof Function?this._request.getAllResponseHeaders():null},b.getResponseHeader=function(a){return this._request.getResponseHeader instanceof Function?this._request.getResponseHeader(a):null},b._handleProgress=function(a){if(a&&!(a.loaded>0&&0==a.total)){var b=new createjs.Event("progress");b.loaded=a.loaded,b.total=a.total,this._sendProgress(b)}},b._handleLoadStart=function(){clearTimeout(this._loadTimeout),this._sendLoadStart()},b._handleAbort=function(){this._clean();var a=new createjs.Event("error");a.text="XHR_ABORTED",this._sendError(a)},b._handleError=function(){this._clean();var a=new createjs.Event("error");this._sendError(a)},b._handleReadyStateChange=function(){4==this._request.readyState&&this._handleLoad()},b._handleLoad=function(){if(!this.loaded){if(this.loaded=!0,!this._checkError())return this._handleError(),void 0;this._response=this._getResponse(),this._clean();var a=this._generateTag();a&&this._sendComplete()}},b._handleTimeout=function(a){this._clean();var b=new createjs.Event("error");b.text="PRELOAD_TIMEOUT",this._sendError(a)},b._checkError=function(){var a=parseInt(this._request.status);switch(a){case 404:case 0:return!1}return!0},b._getResponse=function(){if(null!=this._response)return this._response;if(null!=this._request.response)return this._request.response;try{if(null!=this._request.responseText)return this._request.responseText}catch(a){}try{if(null!=this._request.responseXML)return this._request.responseXML}catch(a){}return null},b._createXHR=function(a){var b=this._isCrossDomain(a),c=null;if(b&&window.XDomainRequest)c=new XDomainRequest;else if(window.XMLHttpRequest)c=new XMLHttpRequest;else try{c=new ActiveXObject("Msxml2.XMLHTTP.6.0")}catch(d){try{c=new ActiveXObject("Msxml2.XMLHTTP.3.0")}catch(d){try{c=new ActiveXObject("Msxml2.XMLHTTP")}catch(d){return!1}}}createjs.LoadQueue.isText(a.type)&&c.overrideMimeType&&c.overrideMimeType("text/plain; charset=utf-8"),this._xhrLevel="string"==typeof c.responseType?2:1;var e=null;return e=a.method==createjs.LoadQueue.GET?this.buildPath(a.src,a.values):a.src,c.open(a.method||createjs.LoadQueue.GET,e,!0),b&&c instanceof XMLHttpRequest&&1==this._xhrLevel&&c.setRequestHeader("Origin",location.origin),a.values&&a.method==createjs.LoadQueue.POST&&c.setRequestHeader("Content-Type","application/x-www-form-urlencoded"),createjs.LoadQueue.isBinary(a.type)&&(c.responseType="arraybuffer"),this._request=c,!0},b._clean=function(){clearTimeout(this._loadTimeout);var a=this._request;a.onloadstart=null,a.onprogress=null,a.onabort=null,a.onerror=null,a.onload=null,a.ontimeout=null,a.onloadend=null,a.onreadystatechange=null},b._generateTag=function(){var a=this._item.type,b=this._item.tag;switch(a){case createjs.LoadQueue.IMAGE:return b.onload=createjs.proxy(this._handleTagReady,this),""!=this._crossOrigin&&(b.crossOrigin="Anonymous"),b.src=this.buildPath(this._item.src,this._item.values),this._rawResponse=this._response,this._response=b,!1;case createjs.LoadQueue.JAVASCRIPT:return b=document.createElement("script"),b.text=this._response,this._rawResponse=this._response,this._response=b,!0;case createjs.LoadQueue.CSS:var c=document.getElementsByTagName("head")[0];if(c.appendChild(b),b.styleSheet)b.styleSheet.cssText=this._response;else{var d=document.createTextNode(this._response);b.appendChild(d)}return this._rawResponse=this._response,this._response=b,!0;case createjs.LoadQueue.XML:var e=this._parseXML(this._response,"text/xml");return this._rawResponse=this._response,this._response=e,!0;case createjs.LoadQueue.SVG:var e=this._parseXML(this._response,"image/svg+xml");return this._rawResponse=this._response,null!=e.documentElement?(b.appendChild(e.documentElement),this._response=b):this._response=e,!0;case createjs.LoadQueue.JSON:case createjs.LoadQueue.MANIFEST:var f={};try{f=JSON.parse(this._response)}catch(g){f=g}return this._rawResponse=this._response,this._response=f,!0}return!0},b._parseXML=function(a,b){var c=null;try{if(window.DOMParser){var d=new DOMParser;c=d.parseFromString(a,b)}else c=new ActiveXObject("Microsoft.XMLDOM"),c.async=!1,c.loadXML(a)}catch(e){}return c},b._handleTagReady=function(){this._sendComplete()},b.toString=function(){return"[PreloadJS XHRLoader]"},createjs.XHRLoader=a}(),"object"!=typeof JSON&&(JSON={}),function(){"use strict";function f(a){return 10>a?"0"+a:a}function quote(a){return escapable.lastIndex=0,escapable.test(a)?'"'+a.replace(escapable,function(a){var b=meta[a];return"string"==typeof b?b:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}function str(a,b){var c,d,e,f,g,h=gap,i=b[a];switch(i&&"object"==typeof i&&"function"==typeof i.toJSON&&(i=i.toJSON(a)),"function"==typeof rep&&(i=rep.call(b,a,i)),typeof i){case"string":return quote(i);case"number":return isFinite(i)?String(i):"null";case"boolean":case"null":return String(i);case"object":if(!i)return"null";if(gap+=indent,g=[],"[object Array]"===Object.prototype.toString.apply(i)){for(f=i.length,c=0;f>c;c+=1)g[c]=str(c,i)||"null";return e=0===g.length?"[]":gap?"[\n"+gap+g.join(",\n"+gap)+"\n"+h+"]":"["+g.join(",")+"]",gap=h,e}if(rep&&"object"==typeof rep)for(f=rep.length,c=0;f>c;c+=1)"string"==typeof rep[c]&&(d=rep[c],e=str(d,i),e&&g.push(quote(d)+(gap?": ":":")+e));else for(d in i)Object.prototype.hasOwnProperty.call(i,d)&&(e=str(d,i),e&&g.push(quote(d)+(gap?": ":":")+e));return e=0===g.length?"{}":gap?"{\n"+gap+g.join(",\n"+gap)+"\n"+h+"}":"{"+g.join(",")+"}",gap=h,e}}"function"!=typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()});var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","	":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;"function"!=typeof JSON.stringify&&(JSON.stringify=function(a,b,c){var d;if(gap="",indent="","number"==typeof c)for(d=0;c>d;d+=1)indent+=" ";else"string"==typeof c&&(indent=c);if(rep=b,b&&"function"!=typeof b&&("object"!=typeof b||"number"!=typeof b.length))throw new Error("JSON.stringify");return str("",{"":a})}),"function"!=typeof JSON.parse&&(JSON.parse=function(text,reviver){function walk(a,b){var c,d,e=a[b];if(e&&"object"==typeof e)for(c in e)Object.prototype.hasOwnProperty.call(e,c)&&(d=walk(e,c),void 0!==d?e[c]=d:delete e[c]);return reviver.call(a,b,e)}var j;if(text=String(text),cx.lastIndex=0,cx.test(text)&&(text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})),/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return j=eval("("+text+")"),"function"==typeof reviver?walk({"":j},""):j;throw new SyntaxError("JSON.parse")})}();;/*!
* @license SoundJS
* Visit http://createjs.com/ for documentation, updates and examples.
*
* Copyright (c) 2011-2013 gskinner.com, inc.
*
* Distributed under the terms of the MIT license.
* http://www.opensource.org/licenses/mit-license.html
*
* This notice shall be included in all copies or substantial portions of the Software.
*/

/**!
 * SoundJS FlashPlugin also includes swfobject (http://code.google.com/p/swfobject/)
 */

this.createjs=this.createjs||{},function(){var a=createjs.SoundJS=createjs.SoundJS||{};a.version="0.5.2",a.buildDate="Thu, 12 Dec 2013 23:33:37 GMT"}(),this.createjs=this.createjs||{},function(){"use strict";var a=function(){},b=a.prototype;a.initialize=function(a){a.addEventListener=b.addEventListener,a.on=b.on,a.removeEventListener=a.off=b.removeEventListener,a.removeAllEventListeners=b.removeAllEventListeners,a.hasEventListener=b.hasEventListener,a.dispatchEvent=b.dispatchEvent,a._dispatchEvent=b._dispatchEvent,a.willTrigger=b.willTrigger},b._listeners=null,b._captureListeners=null,b.initialize=function(){},b.addEventListener=function(a,b,c){var d;d=c?this._captureListeners=this._captureListeners||{}:this._listeners=this._listeners||{};var e=d[a];return e&&this.removeEventListener(a,b,c),e=d[a],e?e.push(b):d[a]=[b],b},b.on=function(a,b,c,d,e,f){return b.handleEvent&&(c=c||b,b=b.handleEvent),c=c||this,this.addEventListener(a,function(a){b.call(c,a,e),d&&a.remove()},f)},b.removeEventListener=function(a,b,c){var d=c?this._captureListeners:this._listeners;if(d){var e=d[a];if(e)for(var f=0,g=e.length;g>f;f++)if(e[f]==b){1==g?delete d[a]:e.splice(f,1);break}}},b.off=b.removeEventListener,b.removeAllEventListeners=function(a){a?(this._listeners&&delete this._listeners[a],this._captureListeners&&delete this._captureListeners[a]):this._listeners=this._captureListeners=null},b.dispatchEvent=function(a,b){if("string"==typeof a){var c=this._listeners;if(!c||!c[a])return!1;a=new createjs.Event(a)}if(a.target=b||this,a.bubbles&&this.parent){for(var d=this,e=[d];d.parent;)e.push(d=d.parent);var f,g=e.length;for(f=g-1;f>=0&&!a.propagationStopped;f--)e[f]._dispatchEvent(a,1+(0==f));for(f=1;g>f&&!a.propagationStopped;f++)e[f]._dispatchEvent(a,3)}else this._dispatchEvent(a,2);return a.defaultPrevented},b.hasEventListener=function(a){var b=this._listeners,c=this._captureListeners;return!!(b&&b[a]||c&&c[a])},b.willTrigger=function(a){for(var b=this;b;){if(b.hasEventListener(a))return!0;b=b.parent}return!1},b.toString=function(){return"[EventDispatcher]"},b._dispatchEvent=function(a,b){var c,d=1==b?this._captureListeners:this._listeners;if(a&&d){var e=d[a.type];if(!e||!(c=e.length))return;a.currentTarget=this,a.eventPhase=b,a.removed=!1,e=e.slice();for(var f=0;c>f&&!a.immediatePropagationStopped;f++){var g=e[f];g.handleEvent?g.handleEvent(a):g(a),a.removed&&(this.off(a.type,g,1==b),a.removed=!1)}}},createjs.EventDispatcher=a}(),this.createjs=this.createjs||{},function(){"use strict";var a=function(a,b,c){this.initialize(a,b,c)},b=a.prototype;b.type=null,b.target=null,b.currentTarget=null,b.eventPhase=0,b.bubbles=!1,b.cancelable=!1,b.timeStamp=0,b.defaultPrevented=!1,b.propagationStopped=!1,b.immediatePropagationStopped=!1,b.removed=!1,b.initialize=function(a,b,c){this.type=a,this.bubbles=b,this.cancelable=c,this.timeStamp=(new Date).getTime()},b.preventDefault=function(){this.defaultPrevented=!0},b.stopPropagation=function(){this.propagationStopped=!0},b.stopImmediatePropagation=function(){this.immediatePropagationStopped=this.propagationStopped=!0},b.remove=function(){this.removed=!0},b.clone=function(){return new a(this.type,this.bubbles,this.cancelable)},b.toString=function(){return"[Event (type="+this.type+")]"},createjs.Event=a}(),this.createjs=this.createjs||{},function(){"use strict";createjs.indexOf=function(a,b){for(var c=0,d=a.length;d>c;c++)if(b===a[c])return c;return-1}}(),this.createjs=this.createjs||{},function(){"use strict";createjs.proxy=function(a,b){var c=Array.prototype.slice.call(arguments,2);return function(){return a.apply(b,Array.prototype.slice.call(arguments,0).concat(c))}}}(),this.createjs=this.createjs||{},function(){"use strict";function a(){throw"Sound cannot be instantiated"}function b(a,b){this.init(a,b)}function c(){this.isDefault=!0,this.addEventListener=this.removeEventListener=this.removeAllEventListeners=this.dispatchEvent=this.hasEventListener=this._listeners=this._interrupt=this._playFailed=this.pause=this.resume=this.play=this._beginPlaying=this._cleanUp=this.stop=this.setMasterVolume=this.setVolume=this.mute=this.setMute=this.getMute=this.setPan=this.getPosition=this.setPosition=this.playFailed=function(){return!1},this.getVolume=this.getPan=this.getDuration=function(){return 0},this.playState=a.PLAY_FAILED,this.toString=function(){return"[Sound Default Sound Instance]"}}function d(){}var e=a;e.DELIMITER="|",e.INTERRUPT_ANY="any",e.INTERRUPT_EARLY="early",e.INTERRUPT_LATE="late",e.INTERRUPT_NONE="none",e.PLAY_INITED="playInited",e.PLAY_SUCCEEDED="playSucceeded",e.PLAY_INTERRUPTED="playInterrupted",e.PLAY_FINISHED="playFinished",e.PLAY_FAILED="playFailed",e.SUPPORTED_EXTENSIONS=["mp3","ogg","mpeg","wav","m4a","mp4","aiff","wma","mid"],e.EXTENSION_MAP={m4a:"mp4"},e.FILE_PATTERN=/^(?:(\w+:)\/{2}(\w+(?:\.\w+)*\/?))?([/.]*?(?:[^?]+)?\/)?((?:[^/?]+)\.(\w+))(?:\?(\S+)?)?$/,e.defaultInterruptBehavior=e.INTERRUPT_NONE,e.alternateExtensions=[],e._lastID=0,e.activePlugin=null,e._pluginsRegistered=!1,e._masterVolume=1,e._masterMute=!1,e._instances=[],e._idHash={},e._preloadHash={},e._defaultSoundInstance=null,e.addEventListener=null,e.removeEventListener=null,e.removeAllEventListeners=null,e.dispatchEvent=null,e.hasEventListener=null,e._listeners=null,createjs.EventDispatcher.initialize(e),e._sendFileLoadEvent=function(a){if(e._preloadHash[a])for(var b=0,c=e._preloadHash[a].length;c>b;b++){var d=e._preloadHash[a][b];if(e._preloadHash[a][b]=!0,e.hasEventListener("fileload")){var f=new createjs.Event("fileload");f.src=d.src,f.id=d.id,f.data=d.data,e.dispatchEvent(f)}}},e.getPreloadHandlers=function(){return{callback:createjs.proxy(e.initLoad,e),types:["sound"],extensions:e.SUPPORTED_EXTENSIONS}},e.registerPlugin=function(a){try{console.log("createjs.Sound.registerPlugin has been deprecated. Please use registerPlugins.")}catch(b){}return e._registerPlugin(a)},e._registerPlugin=function(a){return e._pluginsRegistered=!0,null==a?!1:a.isSupported()?(e.activePlugin=new a,!0):!1},e.registerPlugins=function(a){for(var b=0,c=a.length;c>b;b++){var d=a[b];if(e._registerPlugin(d))return!0}return!1},e.initializeDefaultPlugins=function(){return null!=e.activePlugin?!0:e._pluginsRegistered?!1:e.registerPlugins([createjs.WebAudioPlugin,createjs.HTMLAudioPlugin])?!0:!1},e.isReady=function(){return null!=e.activePlugin},e.getCapabilities=function(){return null==e.activePlugin?null:e.activePlugin._capabilities},e.getCapability=function(a){return null==e.activePlugin?null:e.activePlugin._capabilities[a]},e.initLoad=function(a,b,c,d,f){a=a.replace(f,"");var g=e.registerSound(a,c,d,!1,f);return null==g?!1:g},e.registerSound=function(a,c,d,f,g){if(!e.initializeDefaultPlugins())return!1;if(a instanceof Object&&(g=c,c=a.id,d=a.data,a=a.src),e.alternateExtensions.length)var h=e._parsePath2(a,"sound",c,d);else var h=e._parsePath(a,"sound",c,d);if(null==h)return!1;null!=g&&(a=g+a,h.src=g+h.src),null!=c&&(e._idHash[c]=h.src);var i=null;null!=d&&(isNaN(d.channels)?isNaN(d)||(i=parseInt(d)):i=parseInt(d.channels));var j=e.activePlugin.register(h.src,i);if(null!=j&&(null!=j.numChannels&&(i=j.numChannels),b.create(h.src,i),null!=d&&isNaN(d)?d.channels=h.data.channels=i||b.maxPerChannel():d=h.data=i||b.maxPerChannel(),null!=j.tag?h.tag=j.tag:j.src&&(h.src=j.src),null!=j.completeHandler&&(h.completeHandler=j.completeHandler),j.type&&(h.type=j.type)),0!=f)if(e._preloadHash[h.src]||(e._preloadHash[h.src]=[]),e._preloadHash[h.src].push({src:a,id:c,data:d}),1==e._preloadHash[h.src].length)e.activePlugin.preload(h.src,j);else if(1==e._preloadHash[h.src][0])return!0;return h},e.registerManifest=function(a,b){for(var c=[],d=0,e=a.length;e>d;d++)c[d]=createjs.Sound.registerSound(a[d].src,a[d].id,a[d].data,a[d].preload,b);return c},e.removeSound=function(a,c){if(null==e.activePlugin)return!1;if(a instanceof Object&&(a=a.src),a=e._getSrcById(a),e.alternateExtensions.length)var d=e._parsePath2(a);else var d=e._parsePath(a);if(null==d)return!1;null!=c&&(d.src=c+d.src),a=d.src;for(var f in e._idHash)e._idHash[f]==a&&delete e._idHash[f];return b.removeSrc(a),delete e._preloadHash[a],e.activePlugin.removeSound(a),!0},e.removeManifest=function(a,b){for(var c=[],d=0,e=a.length;e>d;d++)c[d]=createjs.Sound.removeSound(a[d].src,b);return c},e.removeAllSounds=function(){e._idHash={},e._preloadHash={},b.removeAll(),e.activePlugin.removeAllSounds()},e.loadComplete=function(a){if(e.alternateExtensions.length)var b=e._parsePath2(a,"sound");else var b=e._parsePath(a,"sound");return a=b?e._getSrcById(b.src):e._getSrcById(a),1==e._preloadHash[a][0]},e._parsePath=function(a,b,c,d){"string"!=typeof a&&(a=a.toString());var f=a.split(e.DELIMITER);if(f.length>1)try{console.log('createjs.Sound.DELIMITER "|" loading approach has been deprecated. Please use the new alternateExtensions property.')}catch(g){}for(var h={type:b||"sound",id:c,data:d},i=e.getCapabilities(),j=0,k=f.length;k>j;j++){var l=f[j],m=l.match(e.FILE_PATTERN);if(null==m)return!1;var n=m[4],o=m[5];if(i[o]&&createjs.indexOf(e.SUPPORTED_EXTENSIONS,o)>-1)return h.name=n,h.src=l,h.extension=o,h}return null},e._parsePath2=function(a,b,c,d){"string"!=typeof a&&(a=a.toString());var f=a.match(e.FILE_PATTERN);if(null==f)return!1;for(var g=f[4],h=f[5],i=e.getCapabilities(),j=0;!i[h];)if(h=e.alternateExtensions[j++],j>e.alternateExtensions.length)return null;a=a.replace("."+f[5],"."+h);var k={type:b||"sound",id:c,data:d};return k.name=g,k.src=a,k.extension=h,k},e.play=function(a,b,c,d,f,g,h){var i=e.createInstance(a),j=e._playInstance(i,b,c,d,f,g,h);return j||i.playFailed(),i},e.createInstance=function(c){if(!e.initializeDefaultPlugins())return e._defaultSoundInstance;if(c=e._getSrcById(c),e.alternateExtensions.length)var d=e._parsePath2(c,"sound");else var d=e._parsePath(c,"sound");var f=null;return null!=d&&null!=d.src?(b.create(d.src),f=e.activePlugin.create(d.src)):f=a._defaultSoundInstance,f.uniqueId=e._lastID++,f},e.setVolume=function(a){if(null==Number(a))return!1;if(a=Math.max(0,Math.min(1,a)),e._masterVolume=a,!this.activePlugin||!this.activePlugin.setVolume||!this.activePlugin.setVolume(a))for(var b=this._instances,c=0,d=b.length;d>c;c++)b[c].setMasterVolume(a)},e.getVolume=function(){return e._masterVolume},e.setMute=function(a){if(null==a||void 0==a)return!1;if(this._masterMute=a,!this.activePlugin||!this.activePlugin.setMute||!this.activePlugin.setMute(a))for(var b=this._instances,c=0,d=b.length;d>c;c++)b[c].setMasterMute(a);return!0},e.getMute=function(){return this._masterMute},e.stop=function(){for(var a=this._instances,b=a.length;b--;)a[b].stop()},e._playInstance=function(a,b,c,d,f,g,h){if(b instanceof Object&&(c=b.delay,d=b.offset,f=b.loop,g=b.volume,h=b.pan,b=b.interrupt),b=b||e.defaultInterruptBehavior,null==c&&(c=0),null==d&&(d=a.getPosition()),null==f&&(f=0),null==g&&(g=a.volume),null==h&&(h=a.pan),0==c){var i=e._beginPlaying(a,b,d,f,g,h);if(!i)return!1}else{var j=setTimeout(function(){e._beginPlaying(a,b,d,f,g,h)},c);a._delayTimeoutId=j}return this._instances.push(a),!0},e._beginPlaying=function(a,c,d,e,f,g){if(!b.add(a,c))return!1;var h=a._beginPlaying(d,e,f,g);if(!h){var i=createjs.indexOf(this._instances,a);return i>-1&&this._instances.splice(i,1),!1}return!0},e._getSrcById=function(a){return null==e._idHash||null==e._idHash[a]?a:e._idHash[a]},e._playFinished=function(a){b.remove(a);var c=createjs.indexOf(this._instances,a);c>-1&&this._instances.splice(c,1)},createjs.Sound=a,b.channels={},b.create=function(a,c){var d=b.get(a);return null==d?(b.channels[a]=new b(a,c),!0):!1},b.removeSrc=function(a){var c=b.get(a);return null==c?!1:(c.removeAll(),delete b.channels[a],!0)},b.removeAll=function(){for(var a in b.channels)b.channels[a].removeAll();b.channels={}},b.add=function(a,c){var d=b.get(a.src);return null==d?!1:d.add(a,c)},b.remove=function(a){var c=b.get(a.src);return null==c?!1:(c.remove(a),!0)},b.maxPerChannel=function(){return f.maxDefault},b.get=function(a){return b.channels[a]};var f=b.prototype;f.src=null,f.max=null,f.maxDefault=100,f.length=0,f.init=function(a,b){this.src=a,this.max=b||this.maxDefault,-1==this.max&&(this.max=this.maxDefault),this._instances=[]},f.get=function(a){return this._instances[a]},f.add=function(a,b){return this.getSlot(b,a)?(this._instances.push(a),this.length++,!0):!1},f.remove=function(a){var b=createjs.indexOf(this._instances,a);return-1==b?!1:(this._instances.splice(b,1),this.length--,!0)},f.removeAll=function(){for(var a=this.length-1;a>=0;a--)this._instances[a].stop()},f.getSlot=function(b){for(var c,d,e=0,f=this.max;f>e;e++){if(c=this.get(e),null==c)return!0;(b!=a.INTERRUPT_NONE||c.playState==a.PLAY_FINISHED)&&(0!=e?c.playState==a.PLAY_FINISHED||c.playState==a.PLAY_INTERRUPTED||c.playState==a.PLAY_FAILED?d=c:(b==a.INTERRUPT_EARLY&&c.getPosition()<d.getPosition()||b==a.INTERRUPT_LATE&&c.getPosition()>d.getPosition())&&(d=c):d=c)}return null!=d?(d._interrupt(),this.remove(d),!0):!1},f.toString=function(){return"[Sound SoundChannel]"},a._defaultSoundInstance=new c,d.init=function(){var a=window.navigator.userAgent;d.isFirefox=a.indexOf("Firefox")>-1,d.isOpera=null!=window.opera,d.isChrome=a.indexOf("Chrome")>-1,d.isIOS=a.indexOf("iPod")>-1||a.indexOf("iPhone")>-1||a.indexOf("iPad")>-1,d.isAndroid=a.indexOf("Android")>-1,d.isBlackberry=a.indexOf("Blackberry")>-1},d.init(),createjs.Sound.BrowserDetect=d}(),this.createjs=this.createjs||{},function(){"use strict";function a(){this._init()}var b=a;b._capabilities=null,b.isSupported=function(){var a=createjs.Sound.BrowserDetect.isIOS||createjs.Sound.BrowserDetect.isAndroid||createjs.Sound.BrowserDetect.isBlackberry;return"file:"!=location.protocol||a||this._isFileXHRSupported()?(b._generateCapabilities(),null==b.context?!1:!0):!1},b._isFileXHRSupported=function(){var a=!0,b=new XMLHttpRequest;try{b.open("GET","fail.fail",!1)}catch(c){return a=!1}b.onerror=function(){a=!1},b.onload=function(){a=404==this.status||200==this.status||0==this.status&&""!=this.response};try{b.send()}catch(c){a=!1}return a},b._generateCapabilities=function(){if(null==b._capabilities){var a=document.createElement("audio");if(null==a.canPlayType)return null;if(window.webkitAudioContext)b.context=new webkitAudioContext;else{if(!window.AudioContext)return null;b.context=new AudioContext}b._compatibilitySetUp(),b.playEmptySound(),b._capabilities={panning:!0,volume:!0,tracks:-1};for(var c=createjs.Sound.SUPPORTED_EXTENSIONS,d=createjs.Sound.EXTENSION_MAP,e=0,f=c.length;f>e;e++){var g=c[e],h=d[g]||g;b._capabilities[g]="no"!=a.canPlayType("audio/"+g)&&""!=a.canPlayType("audio/"+g)||"no"!=a.canPlayType("audio/"+h)&&""!=a.canPlayType("audio/"+h)}b.context.destination.numberOfChannels<2&&(b._capabilities.panning=!1),b.dynamicsCompressorNode=b.context.createDynamicsCompressor(),b.dynamicsCompressorNode.connect(b.context.destination),b.gainNode=b.context.createGain(),b.gainNode.connect(b.dynamicsCompressorNode)}},b._compatibilitySetUp=function(){if(!b.context.createGain){b.context.createGain=b.context.createGainNode;var a=b.context.createBufferSource();a.__proto__.start=a.__proto__.noteGrainOn,a.__proto__.stop=a.__proto__.noteOff,this._panningModel=0}},b.playEmptySound=function(){var a=this.context.createBuffer(1,1,22050),b=this.context.createBufferSource();b.buffer=a,b.connect(this.context.destination),b.start(0,0,0)};var c=a.prototype;c._capabilities=null,c._volume=1,c.context=null,c._panningModel="equalpower",c.dynamicsCompressorNode=null,c.gainNode=null,c._arrayBuffers=null,c._init=function(){this._capabilities=b._capabilities,this._arrayBuffers={},this.context=b.context,this.gainNode=b.gainNode,this.dynamicsCompressorNode=b.dynamicsCompressorNode},c.register=function(a){this._arrayBuffers[a]=!0;var b=new createjs.WebAudioPlugin.Loader(a,this);return{tag:b}},c.isPreloadStarted=function(a){return null!=this._arrayBuffers[a]},c.isPreloadComplete=function(a){return!(null==this._arrayBuffers[a]||1==this._arrayBuffers[a])},c.removeSound=function(a){delete this._arrayBuffers[a]},c.removeAllSounds=function(){this._arrayBuffers={}},c.addPreloadResults=function(a,b){this._arrayBuffers[a]=b},c._handlePreloadComplete=function(){createjs.Sound._sendFileLoadEvent(this.src)},c.preload=function(a){this._arrayBuffers[a]=!0;var b=new createjs.WebAudioPlugin.Loader(a,this);b.onload=this._handlePreloadComplete,b.load()},c.create=function(a){return this.isPreloadStarted(a)||this.preload(a),new createjs.WebAudioPlugin.SoundInstance(a,this)},c.setVolume=function(a){return this._volume=a,this._updateVolume(),!0},c._updateVolume=function(){var a=createjs.Sound._masterMute?0:this._volume;a!=this.gainNode.gain.value&&(this.gainNode.gain.value=a)},c.getVolume=function(){return this._volume},c.setMute=function(){return this._updateVolume(),!0},c.toString=function(){return"[WebAudioPlugin]"},createjs.WebAudioPlugin=a}(),function(){"use strict";function a(a,b){this._init(a,b)}var b=a.prototype=new createjs.EventDispatcher;b.src=null,b.uniqueId=-1,b.playState=null,b._owner=null,b._offset=0,b._delay=0,b._volume=1;try{Object.defineProperty(b,"volume",{get:function(){return this._volume},set:function(a){return null==Number(a)?!1:(a=Math.max(0,Math.min(1,a)),this._volume=a,this._updateVolume(),void 0)}})}catch(c){}b._pan=0;try{Object.defineProperty(b,"pan",{get:function(){return this._pan},set:function(a){return this._owner._capabilities.panning&&null!=Number(a)?(a=Math.max(-1,Math.min(1,a)),this._pan=a,this.panNode.setPosition(a,0,-.5),void 0):!1}})}catch(c){}b._duration=0,b._remainingLoops=0,b._delayTimeoutId=null,b._soundCompleteTimeout=null,b.gainNode=null,b.panNode=null,b.sourceNode=null,b._sourceNodeNext=null,b._muted=!1,b._paused=!1,b._startTime=0,b._endedHandler=null,b._sendEvent=function(a){var b=new createjs.Event(a);this.dispatchEvent(b)},b._init=function(a,b){this._owner=b,this.src=a,this.gainNode=this._owner.context.createGain(),this.panNode=this._owner.context.createPanner(),this.panNode.panningModel=this._owner._panningModel,this.panNode.connect(this.gainNode),this._owner.isPreloadComplete(this.src)&&(this._duration=1e3*this._owner._arrayBuffers[this.src].duration),this._endedHandler=createjs.proxy(this._handleSoundComplete,this)},b._cleanUp=function(){this.sourceNode&&this.playState==createjs.Sound.PLAY_SUCCEEDED&&(this.sourceNode=this._cleanUpAudioNode(this.sourceNode),this._sourceNodeNext=this._cleanUpAudioNode(this._sourceNodeNext)),0!=this.gainNode.numberOfOutputs&&this.gainNode.disconnect(0),clearTimeout(this._delayTimeoutId),clearTimeout(this._soundCompleteTimeout),this._startTime=0,null!=window.createjs&&createjs.Sound._playFinished(this)},b._cleanUpAudioNode=function(a){return a&&(a.stop(0),a.disconnect(this.panNode),a=null),a},b._interrupt=function(){this._cleanUp(),this.playState=createjs.Sound.PLAY_INTERRUPTED,this._paused=!1,this._sendEvent("interrupted")},b._handleSoundReady=function(){if(null!=window.createjs){if(1e3*this._offset>this.getDuration())return this.playFailed(),void 0;this._offset<0&&(this._offset=0),this.playState=createjs.Sound.PLAY_SUCCEEDED,this._paused=!1,this.gainNode.connect(this._owner.gainNode);var a=this._owner._arrayBuffers[this.src].duration;this.sourceNode=this._createAndPlayAudioNode(this._owner.context.currentTime-a,this._offset),this._duration=1e3*a,this._startTime=this.sourceNode.startTime-this._offset,this._soundCompleteTimeout=setTimeout(this._endedHandler,1e3*(a-this._offset)),0!=this._remainingLoops&&(this._sourceNodeNext=this._createAndPlayAudioNode(this._startTime,0))}},b._createAndPlayAudioNode=function(a,b){var c=this._owner.context.createBufferSource();return c.buffer=this._owner._arrayBuffers[this.src],c.connect(this.panNode),this._owner.context.currentTime,c.startTime=a+c.buffer.duration,c.start(c.startTime,b,c.buffer.duration-b),c},b.play=function(a,b,c,d,e,f){this._cleanUp(),createjs.Sound._playInstance(this,a,b,c,d,e,f)},b._beginPlaying=function(a,b,c,d){return null!=window.createjs&&this.src?(this._offset=a/1e3,this._remainingLoops=b,this.volume=c,this.pan=d,this._owner.isPreloadComplete(this.src)?(this._handleSoundReady(null),this._sendEvent("succeeded"),1):(this.playFailed(),void 0)):void 0},b.pause=function(){return this._paused||this.playState!=createjs.Sound.PLAY_SUCCEEDED?!1:(this._paused=!0,this._offset=this._owner.context.currentTime-this._startTime,this._cleanUpAudioNode(this.sourceNode),this._cleanUpAudioNode(this._sourceNodeNext),0!=this.gainNode.numberOfOutputs&&this.gainNode.disconnect(),clearTimeout(this._delayTimeoutId),clearTimeout(this._soundCompleteTimeout),!0)},b.resume=function(){return this._paused?(this._handleSoundReady(null),!0):!1},b.stop=function(){return this._cleanUp(),this.playState=createjs.Sound.PLAY_FINISHED,this._offset=0,!0},b.setVolume=function(a){return this.volume=a,!0},b._updateVolume=function(){var a=this._muted?0:this._volume;return a!=this.gainNode.gain.value?(this.gainNode.gain.value=a,!0):!1},b.getVolume=function(){return this.volume},b.setMute=function(a){return null==a||void 0==a?!1:(this._muted=a,this._updateVolume(),!0)},b.getMute=function(){return this._muted},b.setPan=function(a){return this.pan=a,this.pan!=a?!1:void 0},b.getPan=function(){return this.pan},b.getPosition=function(){if(this._paused||null==this.sourceNode)var a=this._offset;else var a=this._owner.context.currentTime-this._startTime;return 1e3*a},b.setPosition=function(a){return this._offset=a/1e3,this.sourceNode&&this.playState==createjs.Sound.PLAY_SUCCEEDED&&(this._cleanUpAudioNode(this.sourceNode),this._cleanUpAudioNode(this._sourceNodeNext),clearTimeout(this._soundCompleteTimeout)),this._paused||this.playState!=createjs.Sound.PLAY_SUCCEEDED||this._handleSoundReady(null),!0},b.getDuration=function(){return this._duration},b._handleSoundComplete=function(){return this._offset=0,0!=this._remainingLoops?(this._remainingLoops--,this._sourceNodeNext?(this._cleanUpAudioNode(this.sourceNode),this.sourceNode=this._sourceNodeNext,this._startTime=this.sourceNode.startTime,this._sourceNodeNext=this._createAndPlayAudioNode(this._startTime,0),this._soundCompleteTimeout=setTimeout(this._endedHandler,this._duration)):this._handleSoundReady(null),this._sendEvent("loop"),void 0):(null!=window.createjs&&(this._cleanUp(),this.playState=createjs.Sound.PLAY_FINISHED,this._sendEvent("complete")),void 0)},b.playFailed=function(){null!=window.createjs&&(this._cleanUp(),this.playState=createjs.Sound.PLAY_FAILED,this._sendEvent("failed"))},b.toString=function(){return"[WebAudioPlugin SoundInstance]"},createjs.WebAudioPlugin.SoundInstance=a}(),function(){"use strict";function a(a,b){this._init(a,b)}var b=a.prototype;b.request=null,b.owner=null,b.progress=-1,b.src=null,b.originalSrc=null,b.result=null,b.onload=null,b.onprogress=null,b.onError=null,b._init=function(a,b){this.src=a,this.originalSrc=a,this.owner=b},b.load=function(a){null!=a&&(this.src=a),this.request=new XMLHttpRequest,this.request.open("GET",this.src,!0),this.request.responseType="arraybuffer",this.request.onload=createjs.proxy(this.handleLoad,this),this.request.onError=createjs.proxy(this.handleError,this),this.request.onprogress=createjs.proxy(this.handleProgress,this),this.request.send()},b.handleProgress=function(a,b){this.progress=a/b,null!=this.onprogress&&this.onprogress({loaded:a,total:b,progress:this.progress})},b.handleLoad=function(){this.owner.context.decodeAudioData(this.request.response,createjs.proxy(this.handleAudioDecoded,this),createjs.proxy(this.handleError,this))},b.handleAudioDecoded=function(a){this.progress=1,this.result=a,this.src=this.originalSrc,this.owner.addPreloadResults(this.src,this.result),this.onload&&this.onload()},b.handleError=function(a){this.owner.removeSound(this.src),this.onerror&&this.onerror(a)},b.toString=function(){return"[WebAudioPlugin Loader]"},createjs.WebAudioPlugin.Loader=a}(),this.createjs=this.createjs||{},function(){"use strict";function a(){this._init()}var b=a;b.MAX_INSTANCES=30,b._AUDIO_READY="canplaythrough",b._AUDIO_ENDED="ended",b._AUDIO_SEEKED="seeked",b._AUDIO_STALLED="stalled",b._capabilities=null,b.enableIOS=!1,b.isSupported=function(){if(createjs.Sound.BrowserDetect.isIOS&&!b.enableIOS)return!1;b._generateCapabilities();var a=b.tag;return null==a||null==b._capabilities?!1:!0},b._generateCapabilities=function(){if(null==b._capabilities){var a=b.tag=document.createElement("audio");if(null==a.canPlayType)return null;b._capabilities={panning:!0,volume:!0,tracks:-1};for(var c=createjs.Sound.SUPPORTED_EXTENSIONS,d=createjs.Sound.EXTENSION_MAP,e=0,f=c.length;f>e;e++){var g=c[e],h=d[g]||g;b._capabilities[g]="no"!=a.canPlayType("audio/"+g)&&""!=a.canPlayType("audio/"+g)||"no"!=a.canPlayType("audio/"+h)&&""!=a.canPlayType("audio/"+h)}}};var c=a.prototype;c._capabilities=null,c._audioSources=null,c.defaultNumChannels=2,c.loadedHandler=null,c._init=function(){this._capabilities=b._capabilities,this._audioSources={}},c.register=function(a,b){this._audioSources[a]=!0;for(var c=createjs.HTMLAudioPlugin.TagPool.get(a),d=null,e=b||this.defaultNumChannels,f=0;e>f;f++)d=this._createTag(a),c.add(d);if(d.id=a,this.loadedHandler=createjs.proxy(this._handleTagLoad,this),d.addEventListener&&d.addEventListener("canplaythrough",this.loadedHandler),null==d.onreadystatechange)d.onreadystatechange=this.loadedHandler;else{var g=d.onreadystatechange;d.onreadystatechange=function(){g(),this.loadedHandler()}}return{tag:d,numChannels:e}},c._handleTagLoad=function(a){a.target.removeEventListener&&a.target.removeEventListener("canplaythrough",this.loadedHandler),a.target.onreadystatechange=null,a.target.src!=a.target.id&&createjs.HTMLAudioPlugin.TagPool.checkSrc(a.target.id)},c._createTag=function(a){var b=document.createElement("audio");return b.autoplay=!1,b.preload="none",b.src=a,b},c.removeSound=function(a){delete this._audioSources[a],createjs.HTMLAudioPlugin.TagPool.remove(a)},c.removeAllSounds=function(){this._audioSources={},createjs.HTMLAudioPlugin.TagPool.removeAll()},c.create=function(a){if(!this.isPreloadStarted(a)){var b=createjs.HTMLAudioPlugin.TagPool.get(a),c=this._createTag(a);c.id=a,b.add(c),this.preload(a,{tag:c})}return new createjs.HTMLAudioPlugin.SoundInstance(a,this)},c.isPreloadStarted=function(a){return null!=this._audioSources[a]},c.preload=function(a,b){this._audioSources[a]=!0,new createjs.HTMLAudioPlugin.Loader(a,b.tag)},c.toString=function(){return"[HTMLAudioPlugin]"},createjs.HTMLAudioPlugin=a}(),function(){"use strict";function a(a,b){this._init(a,b)}var b=a.prototype=new createjs.EventDispatcher;b.src=null,b.uniqueId=-1,b.playState=null,b._owner=null,b.loaded=!1,b._offset=0,b._delay=0,b._volume=1;try{Object.defineProperty(b,"volume",{get:function(){return this._volume},set:function(a){null!=Number(a)&&(a=Math.max(0,Math.min(1,a)),this._volume=a,this._updateVolume())}})}catch(c){}b.pan=0,b._duration=0,b._remainingLoops=0,b._delayTimeoutId=null,b.tag=null,b._muted=!1,b._paused=!1,b._endedHandler=null,b._readyHandler=null,b._stalledHandler=null,b.loopHandler=null,b._init=function(a,b){this.src=a,this._owner=b,this._endedHandler=createjs.proxy(this._handleSoundComplete,this),this._readyHandler=createjs.proxy(this._handleSoundReady,this),this._stalledHandler=createjs.proxy(this._handleSoundStalled,this),this.loopHandler=createjs.proxy(this.handleSoundLoop,this)},b._sendEvent=function(a){var b=new createjs.Event(a);this.dispatchEvent(b)},b._cleanUp=function(){var a=this.tag;if(null!=a){a.pause(),a.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_ENDED,this._endedHandler,!1),a.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_READY,this._readyHandler,!1),a.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_SEEKED,this.loopHandler,!1);try{a.currentTime=0}catch(b){}createjs.HTMLAudioPlugin.TagPool.setInstance(this.src,a),this.tag=null}clearTimeout(this._delayTimeoutId),null!=window.createjs&&createjs.Sound._playFinished(this)},b._interrupt=function(){null!=this.tag&&(this.playState=createjs.Sound.PLAY_INTERRUPTED,this._cleanUp(),this._paused=!1,this._sendEvent("interrupted"))},b.play=function(a,b,c,d,e,f){this._cleanUp(),createjs.Sound._playInstance(this,a,b,c,d,e,f)},b._beginPlaying=function(a,b,c,d){if(null==window.createjs)return-1;var e=this.tag=createjs.HTMLAudioPlugin.TagPool.getInstance(this.src);return null==e?(this.playFailed(),-1):(e.addEventListener(createjs.HTMLAudioPlugin._AUDIO_ENDED,this._endedHandler,!1),this._offset=a,this.volume=c,this.pan=d,this._updateVolume(),this._remainingLoops=b,4!==e.readyState?(e.addEventListener(createjs.HTMLAudioPlugin._AUDIO_READY,this._readyHandler,!1),e.addEventListener(createjs.HTMLAudioPlugin._AUDIO_STALLED,this._stalledHandler,!1),e.preload="auto",e.load()):this._handleSoundReady(null),this._sendEvent("succeeded"),1)},b._handleSoundStalled=function(){this._cleanUp(),this._sendEvent("failed")},b._handleSoundReady=function(){if(null!=window.createjs){if(this._duration=1e3*this.tag.duration,this.playState=createjs.Sound.PLAY_SUCCEEDED,this._paused=!1,this.tag.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_READY,this._readyHandler,!1),this._offset>=this.getDuration())return this.playFailed(),void 0;this._offset>0&&(this.tag.currentTime=.001*this._offset),-1==this._remainingLoops&&(this.tag.loop=!0),0!=this._remainingLoops&&(this.tag.addEventListener(createjs.HTMLAudioPlugin._AUDIO_SEEKED,this.loopHandler,!1),this.tag.loop=!0),this.tag.play()}},b.pause=function(){return this._paused||this.playState!=createjs.Sound.PLAY_SUCCEEDED||null==this.tag?!1:(this._paused=!0,this.tag.pause(),clearTimeout(this._delayTimeoutId),!0)},b.resume=function(){return this._paused&&null!=this.tag?(this._paused=!1,this.tag.play(),!0):!1},b.stop=function(){return this._offset=0,this.pause(),this.playState=createjs.Sound.PLAY_FINISHED,this._cleanUp(),!0},b.setMasterVolume=function(){return this._updateVolume(),!0},b.setVolume=function(a){return this.volume=a,!0},b._updateVolume=function(){if(null!=this.tag){var a=this._muted||createjs.Sound._masterMute?0:this._volume*createjs.Sound._masterVolume;return a!=this.tag.volume&&(this.tag.volume=a),!0}return!1},b.getVolume=function(){return this.volume},b.setMasterMute=function(){return this._updateVolume(),!0},b.setMute=function(a){return null==a||void 0==a?!1:(this._muted=a,this._updateVolume(),!0)},b.getMute=function(){return this._muted},b.setPan=function(){return!1},b.getPan=function(){return 0},b.getPosition=function(){return null==this.tag?this._offset:1e3*this.tag.currentTime},b.setPosition=function(a){if(null==this.tag)this._offset=a;else{this.tag.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_SEEKED,this.loopHandler,!1);try{this.tag.currentTime=.001*a}catch(b){return!1}this.tag.addEventListener(createjs.HTMLAudioPlugin._AUDIO_SEEKED,this.loopHandler,!1)}return!0},b.getDuration=function(){return this._duration},b._handleSoundComplete=function(){this._offset=0,null!=window.createjs&&(this.playState=createjs.Sound.PLAY_FINISHED,this._cleanUp(),this._sendEvent("complete"))},b.handleSoundLoop=function(){this._offset=0,this._remainingLoops--,0==this._remainingLoops&&(this.tag.loop=!1,this.tag.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_SEEKED,this.loopHandler,!1)),this._sendEvent("loop")},b.playFailed=function(){null!=window.createjs&&(this.playState=createjs.Sound.PLAY_FAILED,this._cleanUp(),this._sendEvent("failed"))},b.toString=function(){return"[HTMLAudioPlugin SoundInstance]"},createjs.HTMLAudioPlugin.SoundInstance=a}(),function(){"use strict";function a(a,b){this._init(a,b)}var b=a.prototype;b.src=null,b.tag=null,b.preloadTimer=null,b.loadedHandler=null,b._init=function(a,b){if(this.src=a,this.tag=b,this.preloadTimer=setInterval(createjs.proxy(this.preloadTick,this),200),this.loadedHandler=createjs.proxy(this.sendLoadedEvent,this),this.tag.addEventListener&&this.tag.addEventListener("canplaythrough",this.loadedHandler),null==this.tag.onreadystatechange)this.tag.onreadystatechange=createjs.proxy(this.sendLoadedEvent,this);else{var c=this.tag.onreadystatechange;this.tag.onreadystatechange=function(){c(),this.tag.onreadystatechange=createjs.proxy(this.sendLoadedEvent,this)}
}this.tag.preload="auto",this.tag.load()},b.preloadTick=function(){var a=this.tag.buffered,b=this.tag.duration;a.length>0&&a.end(0)>=b-1&&this.handleTagLoaded()},b.handleTagLoaded=function(){clearInterval(this.preloadTimer)},b.sendLoadedEvent=function(){this.tag.removeEventListener&&this.tag.removeEventListener("canplaythrough",this.loadedHandler),this.tag.onreadystatechange=null,createjs.Sound._sendFileLoadEvent(this.src)},b.toString=function(){return"[HTMLAudioPlugin Loader]"},createjs.HTMLAudioPlugin.Loader=a}(),function(){"use strict";function a(a){this._init(a)}var b=a;b.tags={},b.get=function(c){var d=b.tags[c];return null==d&&(d=b.tags[c]=new a(c)),d},b.remove=function(a){var c=b.tags[a];return null==c?!1:(c.removeAll(),delete b.tags[a],!0)},b.removeAll=function(){for(var a in b.tags)b.tags[a].removeAll();b.tags={}},b.getInstance=function(a){var c=b.tags[a];return null==c?null:c.get()},b.setInstance=function(a,c){var d=b.tags[a];return null==d?null:d.set(c)},b.checkSrc=function(a){var c=b.tags[a];return null==c?null:(c.checkSrcChange(),void 0)};var c=a.prototype;c.src=null,c.length=0,c.available=0,c.tags=null,c._init=function(a){this.src=a,this.tags=[]},c.add=function(a){this.tags.push(a),this.length++,this.available++},c.removeAll=function(){for(;this.length--;)delete this.tags[this.length];this.src=null,this.tags.length=0},c.get=function(){if(0==this.tags.length)return null;this.available=this.tags.length;var a=this.tags.pop();return null==a.parentNode&&document.body.appendChild(a),a},c.set=function(a){var b=createjs.indexOf(this.tags,a);-1==b&&this.tags.push(a),this.available=this.tags.length},c.checkSrcChange=function(){for(var a=this.tags.length-1,b=this.tags[a].src;a--;)this.tags[a].src=b},c.toString=function(){return"[HTMLAudioPlugin TagPool]"},createjs.HTMLAudioPlugin.TagPool=a}();;/*!
* @license EaselJS
* Visit http://createjs.com/ for documentation, updates and examples.
*
* Copyright (c) 2011-2013 gskinner.com, inc.
*
* Distributed under the terms of the MIT license.
* http://www.opensource.org/licenses/mit-license.html
*
* This notice shall be included in all copies or substantial portions of the Software.
*/
this.createjs=this.createjs||{},function(){"use strict";var a=function(a,b,c){this.initialize(a,b,c)},b=a.prototype;b.type=null,b.target=null,b.currentTarget=null,b.eventPhase=0,b.bubbles=!1,b.cancelable=!1,b.timeStamp=0,b.defaultPrevented=!1,b.propagationStopped=!1,b.immediatePropagationStopped=!1,b.removed=!1,b.initialize=function(a,b,c){this.type=a,this.bubbles=b,this.cancelable=c,this.timeStamp=(new Date).getTime()},b.preventDefault=function(){this.defaultPrevented=!0},b.stopPropagation=function(){this.propagationStopped=!0},b.stopImmediatePropagation=function(){this.immediatePropagationStopped=this.propagationStopped=!0},b.remove=function(){this.removed=!0},b.clone=function(){return new a(this.type,this.bubbles,this.cancelable)},b.toString=function(){return"[Event (type="+this.type+")]"},createjs.Event=a}(),this.createjs=this.createjs||{},function(){"use strict";var a=function(){},b=a.prototype;a.initialize=function(a){a.addEventListener=b.addEventListener,a.on=b.on,a.removeEventListener=a.off=b.removeEventListener,a.removeAllEventListeners=b.removeAllEventListeners,a.hasEventListener=b.hasEventListener,a.dispatchEvent=b.dispatchEvent,a._dispatchEvent=b._dispatchEvent,a.willTrigger=b.willTrigger},b._listeners=null,b._captureListeners=null,b.initialize=function(){},b.addEventListener=function(a,b,c){var d;d=c?this._captureListeners=this._captureListeners||{}:this._listeners=this._listeners||{};var e=d[a];return e&&this.removeEventListener(a,b,c),e=d[a],e?e.push(b):d[a]=[b],b},b.on=function(a,b,c,d,e,f){return b.handleEvent&&(c=c||b,b=b.handleEvent),c=c||this,this.addEventListener(a,function(a){b.call(c,a,e),d&&a.remove()},f)},b.removeEventListener=function(a,b,c){var d=c?this._captureListeners:this._listeners;if(d){var e=d[a];if(e)for(var f=0,g=e.length;g>f;f++)if(e[f]==b){1==g?delete d[a]:e.splice(f,1);break}}},b.off=b.removeEventListener,b.removeAllEventListeners=function(a){a?(this._listeners&&delete this._listeners[a],this._captureListeners&&delete this._captureListeners[a]):this._listeners=this._captureListeners=null},b.dispatchEvent=function(a,b){if("string"==typeof a){var c=this._listeners;if(!c||!c[a])return!1;a=new createjs.Event(a)}if(a.target=b||this,a.bubbles&&this.parent){for(var d=this,e=[d];d.parent;)e.push(d=d.parent);var f,g=e.length;for(f=g-1;f>=0&&!a.propagationStopped;f--)e[f]._dispatchEvent(a,1+(0==f));for(f=1;g>f&&!a.propagationStopped;f++)e[f]._dispatchEvent(a,3)}else this._dispatchEvent(a,2);return a.defaultPrevented},b.hasEventListener=function(a){var b=this._listeners,c=this._captureListeners;return!!(b&&b[a]||c&&c[a])},b.willTrigger=function(a){for(var b=this;b;){if(b.hasEventListener(a))return!0;b=b.parent}return!1},b.toString=function(){return"[EventDispatcher]"},b._dispatchEvent=function(a,b){var c,d=1==b?this._captureListeners:this._listeners;if(a&&d){var e=d[a.type];if(!e||!(c=e.length))return;a.currentTarget=this,a.eventPhase=b,a.removed=!1,e=e.slice();for(var f=0;c>f&&!a.immediatePropagationStopped;f++){var g=e[f];g.handleEvent?g.handleEvent(a):g(a),a.removed&&(this.off(a.type,g,1==b),a.removed=!1)}}},createjs.EventDispatcher=a}(),this.createjs=this.createjs||{},function(){"use strict";createjs.indexOf=function(a,b){for(var c=0,d=a.length;d>c;c++)if(b===a[c])return c;return-1}}(),this.createjs=this.createjs||{},function(){"use strict";var a=function(){throw"UID cannot be instantiated"};a._nextID=0,a.get=function(){return a._nextID++},createjs.UID=a}(),this.createjs=this.createjs||{},function(){"use strict";var a=function(){throw"Ticker cannot be instantiated."};a.RAF_SYNCHED="synched",a.RAF="raf",a.TIMEOUT="timeout",a.useRAF=!1,a.timingMode=null,a.maxDelta=0,a.removeEventListener=null,a.removeAllEventListeners=null,a.dispatchEvent=null,a.hasEventListener=null,a._listeners=null,createjs.EventDispatcher.initialize(a),a._addEventListener=a.addEventListener,a.addEventListener=function(){return!a._inited&&a.init(),a._addEventListener.apply(a,arguments)},a._paused=!1,a._inited=!1,a._startTime=0,a._pausedTime=0,a._ticks=0,a._pausedTicks=0,a._interval=50,a._lastTime=0,a._times=null,a._tickTimes=null,a._timerId=null,a._raf=!0,a.init=function(){a._inited||(a._inited=!0,a._times=[],a._tickTimes=[],a._startTime=a._getTime(),a._times.push(a._lastTime=0),a.setInterval(a._interval))},a.reset=function(){if(a._raf){var b=window.cancelAnimationFrame||window.webkitCancelAnimationFrame||window.mozCancelAnimationFrame||window.oCancelAnimationFrame||window.msCancelAnimationFrame;b&&b(a._timerId)}else clearTimeout(a._timerId);a.removeAllEventListeners("tick")},a.setInterval=function(b){a._interval=b,a._inited&&a._setupTick()},a.getInterval=function(){return a._interval},a.setFPS=function(b){a.setInterval(1e3/b)},a.getFPS=function(){return 1e3/a._interval},a.getMeasuredTickTime=function(b){var c=0,d=a._tickTimes;if(d.length<1)return-1;b=Math.min(d.length,b||0|a.getFPS());for(var e=0;b>e;e++)c+=d[e];return c/b},a.getMeasuredFPS=function(b){var c=a._times;return c.length<2?-1:(b=Math.min(c.length-1,b||0|a.getFPS()),1e3/((c[0]-c[b])/b))},a.setPaused=function(b){a._paused=b},a.getPaused=function(){return a._paused},a.getTime=function(b){return a._getTime()-a._startTime-(b?a._pausedTime:0)},a.getEventTime=function(b){return(a._lastTime||a._startTime)-(b?a._pausedTime:0)},a.getTicks=function(b){return a._ticks-(b?a._pausedTicks:0)},a._handleSynch=function(){var b=a._getTime()-a._startTime;a._timerId=null,a._setupTick(),b-a._lastTime>=.97*(a._interval-1)&&a._tick()},a._handleRAF=function(){a._timerId=null,a._setupTick(),a._tick()},a._handleTimeout=function(){a._timerId=null,a._setupTick(),a._tick()},a._setupTick=function(){if(null==a._timerId){var b=a.timingMode||a.useRAF&&a.RAF_SYNCHED;if(b==a.RAF_SYNCHED||b==a.RAF){var c=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame;if(c)return a._timerId=c(b==a.RAF?a._handleRAF:a._handleSynch),a._raf=!0,void 0}a._raf=!1,a._timerId=setTimeout(a._handleTimeout,a._interval)}},a._tick=function(){var b=a._getTime()-a._startTime,c=b-a._lastTime,d=a._paused;if(a._ticks++,d&&(a._pausedTicks++,a._pausedTime+=c),a._lastTime=b,a.hasEventListener("tick")){var e=new createjs.Event("tick"),f=a.maxDelta;e.delta=f&&c>f?f:c,e.paused=d,e.time=b,e.runTime=b-a._pausedTime,a.dispatchEvent(e)}for(a._tickTimes.unshift(a._getTime()-b);a._tickTimes.length>100;)a._tickTimes.pop();for(a._times.unshift(b);a._times.length>100;)a._times.pop()};var b=window.performance&&(performance.now||performance.mozNow||performance.msNow||performance.oNow||performance.webkitNow);a._getTime=function(){return b&&b.call(performance)||(new Date).getTime()},createjs.Ticker=a}(),this.createjs=this.createjs||{},function(){"use strict";var a=function(a,b,c,d,e,f,g,h,i,j){this.initialize(a,b,c,d,e,f,g,h,i,j)},b=a.prototype=new createjs.Event;b.stageX=0,b.stageY=0,b.rawX=0,b.rawY=0,b.nativeEvent=null,b.pointerID=0,b.primary=!1,b.addEventListener=null,b.removeEventListener=null,b.removeAllEventListeners=null,b.dispatchEvent=null,b.hasEventListener=null,b._listeners=null,createjs.EventDispatcher.initialize(b),b._get_localX=function(){return this.currentTarget.globalToLocal(this.rawX,this.rawY).x},b._get_localY=function(){return this.currentTarget.globalToLocal(this.rawX,this.rawY).y};try{Object.defineProperties(b,{localX:{get:b._get_localX},localY:{get:b._get_localY}})}catch(c){}b.Event_initialize=b.initialize,b.initialize=function(a,b,c,d,e,f,g,h,i,j){this.Event_initialize(a,b,c),this.stageX=d,this.stageY=e,this.nativeEvent=f,this.pointerID=g,this.primary=h,this.rawX=null==i?d:i,this.rawY=null==j?e:j},b.clone=function(){return new a(this.type,this.bubbles,this.cancelable,this.stageX,this.stageY,this.target,this.nativeEvent,this.pointerID,this.primary,this.rawX,this.rawY)},b.toString=function(){return"[MouseEvent (type="+this.type+" stageX="+this.stageX+" stageY="+this.stageY+")]"},createjs.MouseEvent=a}(),this.createjs=this.createjs||{},function(){"use strict";var a=function(a,b,c,d,e,f){this.initialize(a,b,c,d,e,f)},b=a.prototype;a.identity=null,a.DEG_TO_RAD=Math.PI/180,b.a=1,b.b=0,b.c=0,b.d=1,b.tx=0,b.ty=0,b.alpha=1,b.shadow=null,b.compositeOperation=null,b.initialize=function(a,b,c,d,e,f){return this.a=null==a?1:a,this.b=b||0,this.c=c||0,this.d=null==d?1:d,this.tx=e||0,this.ty=f||0,this},b.prepend=function(a,b,c,d,e,f){var g=this.tx;if(1!=a||0!=b||0!=c||1!=d){var h=this.a,i=this.c;this.a=h*a+this.b*c,this.b=h*b+this.b*d,this.c=i*a+this.d*c,this.d=i*b+this.d*d}return this.tx=g*a+this.ty*c+e,this.ty=g*b+this.ty*d+f,this},b.append=function(a,b,c,d,e,f){var g=this.a,h=this.b,i=this.c,j=this.d;return this.a=a*g+b*i,this.b=a*h+b*j,this.c=c*g+d*i,this.d=c*h+d*j,this.tx=e*g+f*i+this.tx,this.ty=e*h+f*j+this.ty,this},b.prependMatrix=function(a){return this.prepend(a.a,a.b,a.c,a.d,a.tx,a.ty),this.prependProperties(a.alpha,a.shadow,a.compositeOperation),this},b.appendMatrix=function(a){return this.append(a.a,a.b,a.c,a.d,a.tx,a.ty),this.appendProperties(a.alpha,a.shadow,a.compositeOperation),this},b.prependTransform=function(b,c,d,e,f,g,h,i,j){if(f%360)var k=f*a.DEG_TO_RAD,l=Math.cos(k),m=Math.sin(k);else l=1,m=0;return(i||j)&&(this.tx-=i,this.ty-=j),g||h?(g*=a.DEG_TO_RAD,h*=a.DEG_TO_RAD,this.prepend(l*d,m*d,-m*e,l*e,0,0),this.prepend(Math.cos(h),Math.sin(h),-Math.sin(g),Math.cos(g),b,c)):this.prepend(l*d,m*d,-m*e,l*e,b,c),this},b.appendTransform=function(b,c,d,e,f,g,h,i,j){if(f%360)var k=f*a.DEG_TO_RAD,l=Math.cos(k),m=Math.sin(k);else l=1,m=0;return g||h?(g*=a.DEG_TO_RAD,h*=a.DEG_TO_RAD,this.append(Math.cos(h),Math.sin(h),-Math.sin(g),Math.cos(g),b,c),this.append(l*d,m*d,-m*e,l*e,0,0)):this.append(l*d,m*d,-m*e,l*e,b,c),(i||j)&&(this.tx-=i*this.a+j*this.c,this.ty-=i*this.b+j*this.d),this},b.rotate=function(a){var b=Math.cos(a),c=Math.sin(a),d=this.a,e=this.c,f=this.tx;return this.a=d*b-this.b*c,this.b=d*c+this.b*b,this.c=e*b-this.d*c,this.d=e*c+this.d*b,this.tx=f*b-this.ty*c,this.ty=f*c+this.ty*b,this},b.skew=function(b,c){return b*=a.DEG_TO_RAD,c*=a.DEG_TO_RAD,this.append(Math.cos(c),Math.sin(c),-Math.sin(b),Math.cos(b),0,0),this},b.scale=function(a,b){return this.a*=a,this.d*=b,this.c*=a,this.b*=b,this.tx*=a,this.ty*=b,this},b.translate=function(a,b){return this.tx+=a,this.ty+=b,this},b.identity=function(){return this.alpha=this.a=this.d=1,this.b=this.c=this.tx=this.ty=0,this.shadow=this.compositeOperation=null,this},b.invert=function(){var a=this.a,b=this.b,c=this.c,d=this.d,e=this.tx,f=a*d-b*c;return this.a=d/f,this.b=-b/f,this.c=-c/f,this.d=a/f,this.tx=(c*this.ty-d*e)/f,this.ty=-(a*this.ty-b*e)/f,this},b.isIdentity=function(){return 0==this.tx&&0==this.ty&&1==this.a&&0==this.b&&0==this.c&&1==this.d},b.transformPoint=function(a,b,c){return c=c||{},c.x=a*this.a+b*this.c+this.tx,c.y=a*this.b+b*this.d+this.ty,c},b.decompose=function(b){null==b&&(b={}),b.x=this.tx,b.y=this.ty,b.scaleX=Math.sqrt(this.a*this.a+this.b*this.b),b.scaleY=Math.sqrt(this.c*this.c+this.d*this.d);var c=Math.atan2(-this.c,this.d),d=Math.atan2(this.b,this.a);return c==d?(b.rotation=d/a.DEG_TO_RAD,this.a<0&&this.d>=0&&(b.rotation+=b.rotation<=0?180:-180),b.skewX=b.skewY=0):(b.skewX=c/a.DEG_TO_RAD,b.skewY=d/a.DEG_TO_RAD),b},b.reinitialize=function(a,b,c,d,e,f,g,h,i){return this.initialize(a,b,c,d,e,f),this.alpha=null==g?1:g,this.shadow=h,this.compositeOperation=i,this},b.copy=function(a){return this.reinitialize(a.a,a.b,a.c,a.d,a.tx,a.ty,a.alpha,a.shadow,a.compositeOperation)},b.appendProperties=function(a,b,c){return this.alpha*=a,this.shadow=b||this.shadow,this.compositeOperation=c||this.compositeOperation,this},b.prependProperties=function(a,b,c){return this.alpha*=a,this.shadow=this.shadow||b,this.compositeOperation=this.compositeOperation||c,this},b.clone=function(){return(new a).copy(this)},b.toString=function(){return"[Matrix2D (a="+this.a+" b="+this.b+" c="+this.c+" d="+this.d+" tx="+this.tx+" ty="+this.ty+")]"},a.identity=new a,createjs.Matrix2D=a}(),this.createjs=this.createjs||{},function(){"use strict";var a=function(a,b){this.initialize(a,b)},b=a.prototype;b.x=0,b.y=0,b.initialize=function(a,b){return this.x=null==a?0:a,this.y=null==b?0:b,this},b.copy=function(a){return this.initialize(a.x,a.y)},b.clone=function(){return new a(this.x,this.y)},b.toString=function(){return"[Point (x="+this.x+" y="+this.y+")]"},createjs.Point=a}(),this.createjs=this.createjs||{},function(){"use strict";var a=function(a,b,c,d){this.initialize(a,b,c,d)},b=a.prototype;b.x=0,b.y=0,b.width=0,b.height=0,b.initialize=function(a,b,c,d){return this.x=a||0,this.y=b||0,this.width=c||0,this.height=d||0,this},b.copy=function(a){return this.initialize(a.x,a.y,a.width,a.height)},b.clone=function(){return new a(this.x,this.y,this.width,this.height)},b.toString=function(){return"[Rectangle (x="+this.x+" y="+this.y+" width="+this.width+" height="+this.height+")]"},createjs.Rectangle=a}(),this.createjs=this.createjs||{},function(){"use strict";var a=function(a,b,c,d,e,f,g){this.initialize(a,b,c,d,e,f,g)},b=a.prototype;b.target=null,b.overLabel=null,b.outLabel=null,b.downLabel=null,b.play=!1,b._isPressed=!1,b._isOver=!1,b.initialize=function(a,b,c,d,e,f,g){a.addEventListener&&(this.target=a,a.cursor="pointer",this.overLabel=null==c?"over":c,this.outLabel=null==b?"out":b,this.downLabel=null==d?"down":d,this.play=e,this.setEnabled(!0),this.handleEvent({}),f&&(g&&(f.actionsEnabled=!1,f.gotoAndStop&&f.gotoAndStop(g)),a.hitArea=f))},b.setEnabled=function(a){var b=this.target;a?(b.addEventListener("rollover",this),b.addEventListener("rollout",this),b.addEventListener("mousedown",this),b.addEventListener("pressup",this)):(b.removeEventListener("rollover",this),b.removeEventListener("rollout",this),b.removeEventListener("mousedown",this),b.removeEventListener("pressup",this))},b.toString=function(){return"[ButtonHelper]"},b.handleEvent=function(a){var b,c=this.target,d=a.type;"mousedown"==d?(this._isPressed=!0,b=this.downLabel):"pressup"==d?(this._isPressed=!1,b=this._isOver?this.overLabel:this.outLabel):"rollover"==d?(this._isOver=!0,b=this._isPressed?this.downLabel:this.overLabel):(this._isOver=!1,b=this._isPressed?this.overLabel:this.outLabel),this.play?c.gotoAndPlay&&c.gotoAndPlay(b):c.gotoAndStop&&c.gotoAndStop(b)},createjs.ButtonHelper=a}(),this.createjs=this.createjs||{},function(){"use strict";var a=function(a,b,c,d){this.initialize(a,b,c,d)},b=a.prototype;a.identity=null,b.color=null,b.offsetX=0,b.offsetY=0,b.blur=0,b.initialize=function(a,b,c,d){this.color=a,this.offsetX=b,this.offsetY=c,this.blur=d},b.toString=function(){return"[Shadow]"},b.clone=function(){return new a(this.color,this.offsetX,this.offsetY,this.blur)},a.identity=new a("transparent",0,0,0),createjs.Shadow=a}(),this.createjs=this.createjs||{},function(){"use strict";var a=function(a){this.initialize(a)},b=a.prototype=new createjs.EventDispatcher;b.complete=!0,b.framerate=0,b._animations=null,b._frames=null,b._images=null,b._data=null,b._loadCount=0,b._frameHeight=0,b._frameWidth=0,b._numFrames=0,b._regX=0,b._regY=0,b.initialize=function(a){var b,c,d,e;if(null!=a){if(this.framerate=a.framerate||0,a.images&&(c=a.images.length)>0)for(e=this._images=[],b=0;c>b;b++){var f=a.images[b];if("string"==typeof f){var g=f;f=document.createElement("img"),f.src=g}e.push(f),f.getContext||f.complete||(this._loadCount++,this.complete=!1,function(a){f.onload=function(){a._handleImageLoad()}}(this))}if(null==a.frames);else if(a.frames instanceof Array)for(this._frames=[],e=a.frames,b=0,c=e.length;c>b;b++){var h=e[b];this._frames.push({image:this._images[h[4]?h[4]:0],rect:new createjs.Rectangle(h[0],h[1],h[2],h[3]),regX:h[5]||0,regY:h[6]||0})}else d=a.frames,this._frameWidth=d.width,this._frameHeight=d.height,this._regX=d.regX||0,this._regY=d.regY||0,this._numFrames=d.count,0==this._loadCount&&this._calculateFrames();if(this._animations=[],null!=(d=a.animations)){this._data={};var i;for(i in d){var j={name:i},k=d[i];if("number"==typeof k)e=j.frames=[k];else if(k instanceof Array)if(1==k.length)j.frames=[k[0]];else for(j.speed=k[3],j.next=k[2],e=j.frames=[],b=k[0];b<=k[1];b++)e.push(b);else{j.speed=k.speed,j.next=k.next;var l=k.frames;e=j.frames="number"==typeof l?[l]:l.slice(0)}(j.next===!0||void 0===j.next)&&(j.next=i),(j.next===!1||e.length<2&&j.next==i)&&(j.next=null),j.speed||(j.speed=1),this._animations.push(i),this._data[i]=j}}}},b.getNumFrames=function(a){if(null==a)return this._frames?this._frames.length:this._numFrames;var b=this._data[a];return null==b?0:b.frames.length},b.getAnimations=function(){return this._animations.slice(0)},b.getAnimation=function(a){return this._data[a]},b.getFrame=function(a){var b;return this._frames&&(b=this._frames[a])?b:null},b.getFrameBounds=function(a,b){var c=this.getFrame(a);return c?(b||new createjs.Rectangle).initialize(-c.regX,-c.regY,c.rect.width,c.rect.height):null},b.toString=function(){return"[SpriteSheet]"},b.clone=function(){var b=new a;return b.complete=this.complete,b._animations=this._animations,b._frames=this._frames,b._images=this._images,b._data=this._data,b._frameHeight=this._frameHeight,b._frameWidth=this._frameWidth,b._numFrames=this._numFrames,b._loadCount=this._loadCount,b},b._handleImageLoad=function(){0==--this._loadCount&&(this._calculateFrames(),this.complete=!0,this.dispatchEvent("complete"))},b._calculateFrames=function(){if(!this._frames&&0!=this._frameWidth){this._frames=[];for(var a=0,b=this._frameWidth,c=this._frameHeight,d=0,e=this._images;d<e.length;d++){for(var f=e[d],g=0|f.width/b,h=0|f.height/c,i=this._numFrames>0?Math.min(this._numFrames-a,g*h):g*h,j=0;i>j;j++)this._frames.push({image:f,rect:new createjs.Rectangle(j%g*b,(0|j/g)*c,b,c),regX:this._regX,regY:this._regY});a+=i}this._numFrames=a}},createjs.SpriteSheet=a}(),this.createjs=this.createjs||{},function(){"use strict";function a(a,b,c){this.f=a,this.params=b,this.path=null==c?!0:c}a.prototype.exec=function(a){this.f.apply(a,this.params)};var b=function(){this.initialize()},c=b.prototype;b.getRGB=function(a,b,c,d){return null!=a&&null==c&&(d=b,c=255&a,b=255&a>>8,a=255&a>>16),null==d?"rgb("+a+","+b+","+c+")":"rgba("+a+","+b+","+c+","+d+")"},b.getHSL=function(a,b,c,d){return null==d?"hsl("+a%360+","+b+"%,"+c+"%)":"hsla("+a%360+","+b+"%,"+c+"%,"+d+")"},b.Command=a,b.BASE_64={A:0,B:1,C:2,D:3,E:4,F:5,G:6,H:7,I:8,J:9,K:10,L:11,M:12,N:13,O:14,P:15,Q:16,R:17,S:18,T:19,U:20,V:21,W:22,X:23,Y:24,Z:25,a:26,b:27,c:28,d:29,e:30,f:31,g:32,h:33,i:34,j:35,k:36,l:37,m:38,n:39,o:40,p:41,q:42,r:43,s:44,t:45,u:46,v:47,w:48,x:49,y:50,z:51,0:52,1:53,2:54,3:55,4:56,5:57,6:58,7:59,8:60,9:61,"+":62,"/":63},b.STROKE_CAPS_MAP=["butt","round","square"],b.STROKE_JOINTS_MAP=["miter","round","bevel"];var d=createjs.createCanvas?createjs.createCanvas():document.createElement("canvas");if(d.getContext){var e=b._ctx=d.getContext("2d");b.beginCmd=new a(e.beginPath,[],!1),b.fillCmd=new a(e.fill,[],!1),b.strokeCmd=new a(e.stroke,[],!1),d.width=d.height=1}c._strokeInstructions=null,c._strokeStyleInstructions=null,c._strokeIgnoreScale=!1,c._fillInstructions=null,c._fillMatrix=null,c._instructions=null,c._oldInstructions=null,c._activeInstructions=null,c._active=!1,c._dirty=!1,c.initialize=function(){this.clear(),this._ctx=b._ctx},c.isEmpty=function(){return!(this._instructions.length||this._oldInstructions.length||this._activeInstructions.length)},c.draw=function(a){this._dirty&&this._updateInstructions();for(var b=this._instructions,c=0,d=b.length;d>c;c++)b[c].exec(a)},c.drawAsPath=function(a){this._dirty&&this._updateInstructions();for(var b,c=this._instructions,d=0,e=c.length;e>d;d++)((b=c[d]).path||0==d)&&b.exec(a)},c.moveTo=function(b,c){return this._activeInstructions.push(new a(this._ctx.moveTo,[b,c])),this},c.lineTo=function(b,c){return this._dirty=this._active=!0,this._activeInstructions.push(new a(this._ctx.lineTo,[b,c])),this},c.arcTo=function(b,c,d,e,f){return this._dirty=this._active=!0,this._activeInstructions.push(new a(this._ctx.arcTo,[b,c,d,e,f])),this},c.arc=function(b,c,d,e,f,g){return this._dirty=this._active=!0,null==g&&(g=!1),this._activeInstructions.push(new a(this._ctx.arc,[b,c,d,e,f,g])),this},c.quadraticCurveTo=function(b,c,d,e){return this._dirty=this._active=!0,this._activeInstructions.push(new a(this._ctx.quadraticCurveTo,[b,c,d,e])),this},c.bezierCurveTo=function(b,c,d,e,f,g){return this._dirty=this._active=!0,this._activeInstructions.push(new a(this._ctx.bezierCurveTo,[b,c,d,e,f,g])),this},c.rect=function(b,c,d,e){return this._dirty=this._active=!0,this._activeInstructions.push(new a(this._ctx.rect,[b,c,d,e])),this},c.closePath=function(){return this._active&&(this._dirty=!0,this._activeInstructions.push(new a(this._ctx.closePath,[]))),this},c.clear=function(){return this._instructions=[],this._oldInstructions=[],this._activeInstructions=[],this._strokeStyleInstructions=this._strokeInstructions=this._fillInstructions=this._fillMatrix=null,this._active=this._dirty=this._strokeIgnoreScale=!1,this},c.beginFill=function(b){return this._active&&this._newPath(),this._fillInstructions=b?[new a(this._setProp,["fillStyle",b],!1)]:null,this._fillMatrix=null,this},c.beginLinearGradientFill=function(b,c,d,e,f,g){this._active&&this._newPath();for(var h=this._ctx.createLinearGradient(d,e,f,g),i=0,j=b.length;j>i;i++)h.addColorStop(c[i],b[i]);return this._fillInstructions=[new a(this._setProp,["fillStyle",h],!1)],this._fillMatrix=null,this},c.beginRadialGradientFill=function(b,c,d,e,f,g,h,i){this._active&&this._newPath();for(var j=this._ctx.createRadialGradient(d,e,f,g,h,i),k=0,l=b.length;l>k;k++)j.addColorStop(c[k],b[k]);return this._fillInstructions=[new a(this._setProp,["fillStyle",j],!1)],this._fillMatrix=null,this},c.beginBitmapFill=function(b,c,d){this._active&&this._newPath(),c=c||"";var e=this._ctx.createPattern(b,c);return this._fillInstructions=[new a(this._setProp,["fillStyle",e],!1)],this._fillMatrix=d?[d.a,d.b,d.c,d.d,d.tx,d.ty]:null,this},c.endFill=function(){return this.beginFill()},c.setStrokeStyle=function(c,d,e,f,g){return this._active&&this._newPath(),this._strokeStyleInstructions=[new a(this._setProp,["lineWidth",null==c?"1":c],!1),new a(this._setProp,["lineCap",null==d?"butt":isNaN(d)?d:b.STROKE_CAPS_MAP[d]],!1),new a(this._setProp,["lineJoin",null==e?"miter":isNaN(e)?e:b.STROKE_JOINTS_MAP[e]],!1),new a(this._setProp,["miterLimit",null==f?"10":f],!1)],this._strokeIgnoreScale=g,this},c.beginStroke=function(b){return this._active&&this._newPath(),this._strokeInstructions=b?[new a(this._setProp,["strokeStyle",b],!1)]:null,this},c.beginLinearGradientStroke=function(b,c,d,e,f,g){this._active&&this._newPath();for(var h=this._ctx.createLinearGradient(d,e,f,g),i=0,j=b.length;j>i;i++)h.addColorStop(c[i],b[i]);return this._strokeInstructions=[new a(this._setProp,["strokeStyle",h],!1)],this},c.beginRadialGradientStroke=function(b,c,d,e,f,g,h,i){this._active&&this._newPath();for(var j=this._ctx.createRadialGradient(d,e,f,g,h,i),k=0,l=b.length;l>k;k++)j.addColorStop(c[k],b[k]);return this._strokeInstructions=[new a(this._setProp,["strokeStyle",j],!1)],this},c.beginBitmapStroke=function(b,c){this._active&&this._newPath(),c=c||"";var d=this._ctx.createPattern(b,c);return this._strokeInstructions=[new a(this._setProp,["strokeStyle",d],!1)],this},c.endStroke=function(){return this.beginStroke(),this},c.curveTo=c.quadraticCurveTo,c.drawRect=c.rect,c.drawRoundRect=function(a,b,c,d,e){return this.drawRoundRectComplex(a,b,c,d,e,e,e,e),this},c.drawRoundRectComplex=function(b,c,d,e,f,g,h,i){var j=(e>d?d:e)/2,k=0,l=0,m=0,n=0;0>f&&(f*=k=-1),f>j&&(f=j),0>g&&(g*=l=-1),g>j&&(g=j),0>h&&(h*=m=-1),h>j&&(h=j),0>i&&(i*=n=-1),i>j&&(i=j),this._dirty=this._active=!0;var o=this._ctx.arcTo,p=this._ctx.lineTo;return this._activeInstructions.push(new a(this._ctx.moveTo,[b+d-g,c]),new a(o,[b+d+g*l,c-g*l,b+d,c+g,g]),new a(p,[b+d,c+e-h]),new a(o,[b+d+h*m,c+e+h*m,b+d-h,c+e,h]),new a(p,[b+i,c+e]),new a(o,[b-i*n,c+e+i*n,b,c+e-i,i]),new a(p,[b,c+f]),new a(o,[b-f*k,c-f*k,b+f,c,f]),new a(this._ctx.closePath)),this},c.drawCircle=function(a,b,c){return this.arc(a,b,c,0,2*Math.PI),this},c.drawEllipse=function(b,c,d,e){this._dirty=this._active=!0;var f=.5522848,g=d/2*f,h=e/2*f,i=b+d,j=c+e,k=b+d/2,l=c+e/2;return this._activeInstructions.push(new a(this._ctx.moveTo,[b,l]),new a(this._ctx.bezierCurveTo,[b,l-h,k-g,c,k,c]),new a(this._ctx.bezierCurveTo,[k+g,c,i,l-h,i,l]),new a(this._ctx.bezierCurveTo,[i,l+h,k+g,j,k,j]),new a(this._ctx.bezierCurveTo,[k-g,j,b,l+h,b,l])),this},c.inject=function(b,c){return this._dirty=this._active=!0,this._activeInstructions.push(new a(b,[c])),this},c.drawPolyStar=function(b,c,d,e,f,g){this._dirty=this._active=!0,null==f&&(f=0),f=1-f,null==g?g=0:g/=180/Math.PI;var h=Math.PI/e;this._activeInstructions.push(new a(this._ctx.moveTo,[b+Math.cos(g)*d,c+Math.sin(g)*d]));for(var i=0;e>i;i++)g+=h,1!=f&&this._activeInstructions.push(new a(this._ctx.lineTo,[b+Math.cos(g)*d*f,c+Math.sin(g)*d*f])),g+=h,this._activeInstructions.push(new a(this._ctx.lineTo,[b+Math.cos(g)*d,c+Math.sin(g)*d]));return this},c.decodePath=function(a){for(var c=[this.moveTo,this.lineTo,this.quadraticCurveTo,this.bezierCurveTo,this.closePath],d=[2,2,4,6,0],e=0,f=a.length,g=[],h=0,i=0,j=b.BASE_64;f>e;){var k=a.charAt(e),l=j[k],m=l>>3,n=c[m];if(!n||3&l)throw"bad path data (@"+e+"): "+k;var o=d[m];m||(h=i=0),g.length=0,e++;for(var p=(1&l>>2)+2,q=0;o>q;q++){var r=j[a.charAt(e)],s=r>>5?-1:1;r=(31&r)<<6|j[a.charAt(e+1)],3==p&&(r=r<<6|j[a.charAt(e+2)]),r=s*r/10,q%2?h=r+=h:i=r+=i,g[q]=r,e+=p}n.apply(this,g)}return this},c.clone=function(){var a=new b;return a._instructions=this._instructions.slice(),a._activeInstructions=this._activeInstructions.slice(),a._oldInstructions=this._oldInstructions.slice(),this._fillInstructions&&(a._fillInstructions=this._fillInstructions.slice()),this._strokeInstructions&&(a._strokeInstructions=this._strokeInstructions.slice()),this._strokeStyleInstructions&&(a._strokeStyleInstructions=this._strokeStyleInstructions.slice()),a._active=this._active,a._dirty=this._dirty,a._fillMatrix=this._fillMatrix,a._strokeIgnoreScale=this._strokeIgnoreScale,a},c.toString=function(){return"[Graphics]"},c.mt=c.moveTo,c.lt=c.lineTo,c.at=c.arcTo,c.bt=c.bezierCurveTo,c.qt=c.quadraticCurveTo,c.a=c.arc,c.r=c.rect,c.cp=c.closePath,c.c=c.clear,c.f=c.beginFill,c.lf=c.beginLinearGradientFill,c.rf=c.beginRadialGradientFill,c.bf=c.beginBitmapFill,c.ef=c.endFill,c.ss=c.setStrokeStyle,c.s=c.beginStroke,c.ls=c.beginLinearGradientStroke,c.rs=c.beginRadialGradientStroke,c.bs=c.beginBitmapStroke,c.es=c.endStroke,c.dr=c.drawRect,c.rr=c.drawRoundRect,c.rc=c.drawRoundRectComplex,c.dc=c.drawCircle,c.de=c.drawEllipse,c.dp=c.drawPolyStar,c.p=c.decodePath,c._updateInstructions=function(){this._instructions=this._oldInstructions.slice(),this._instructions.push(b.beginCmd),this._appendInstructions(this._fillInstructions),this._appendInstructions(this._strokeInstructions),this._appendInstructions(this._strokeInstructions&&this._strokeStyleInstructions),this._appendInstructions(this._activeInstructions),this._fillInstructions&&this._appendDraw(b.fillCmd,this._fillMatrix),this._strokeInstructions&&this._appendDraw(b.strokeCmd,this._strokeIgnoreScale&&[1,0,0,1,0,0])},c._appendInstructions=function(a){a&&this._instructions.push.apply(this._instructions,a)},c._appendDraw=function(b,c){c?this._instructions.push(new a(this._ctx.save,[],!1),new a(this._ctx.transform,c,!1),b,new a(this._ctx.restore,[],!1)):this._instructions.push(b)},c._newPath=function(){this._dirty&&this._updateInstructions(),this._oldInstructions=this._instructions,this._activeInstructions=[],this._active=this._dirty=!1},c._setProp=function(a,b){this[a]=b},createjs.Graphics=b}(),this.createjs=this.createjs||{},function(){var a=function(){this.initialize()},b=a.prototype=new createjs.EventDispatcher;a._MOUSE_EVENTS=["click","dblclick","mousedown","mouseout","mouseover","pressmove","pressup","rollout","rollover"],a.suppressCrossDomainErrors=!1;var c=createjs.createCanvas?createjs.createCanvas():document.createElement("canvas");c.getContext&&(a._hitTestCanvas=c,a._hitTestContext=c.getContext("2d"),c.width=c.height=1),a._nextCacheID=1,b.alpha=1,b.cacheCanvas=null,b.id=-1,b.mouseEnabled=!0,b.tickEnabled=!0,b.name=null,b.parent=null,b.regX=0,b.regY=0,b.rotation=0,b.scaleX=1,b.scaleY=1,b.skewX=0,b.skewY=0,b.shadow=null,b.visible=!0,b.x=0,b.y=0,b.compositeOperation=null,b.snapToPixel=!1,b.filters=null,b.cacheID=0,b.mask=null,b.hitArea=null,b.cursor=null,b._cacheOffsetX=0,b._cacheOffsetY=0,b._cacheScale=1,b._cacheDataURLID=0,b._cacheDataURL=null,b._matrix=null,b._rectangle=null,b._bounds=null,b.initialize=function(){this.id=createjs.UID.get(),this._matrix=new createjs.Matrix2D,this._rectangle=new createjs.Rectangle},b.isVisible=function(){return!!(this.visible&&this.alpha>0&&0!=this.scaleX&&0!=this.scaleY)},b.draw=function(a,b){var c=this.cacheCanvas;if(b||!c)return!1;var d,e=this._cacheScale,f=this._cacheOffsetX,g=this._cacheOffsetY;return(d=this._applyFilterBounds(f,g,0,0))&&(f=d.x,g=d.y),a.drawImage(c,f,g,c.width/e,c.height/e),!0},b.updateContext=function(a){var b,c=this.mask,d=this;c&&c.graphics&&!c.graphics.isEmpty()&&(b=c.getMatrix(c._matrix),a.transform(b.a,b.b,b.c,b.d,b.tx,b.ty),c.graphics.drawAsPath(a),a.clip(),b.invert(),a.transform(b.a,b.b,b.c,b.d,b.tx,b.ty)),b=d._matrix.identity().appendTransform(d.x,d.y,d.scaleX,d.scaleY,d.rotation,d.skewX,d.skewY,d.regX,d.regY),createjs.Stage._snapToPixelEnabled&&d.snapToPixel?a.transform(b.a,b.b,b.c,b.d,0|b.tx+.5,0|b.ty+.5):a.transform(b.a,b.b,b.c,b.d,b.tx,b.ty),a.globalAlpha*=d.alpha,d.compositeOperation&&(a.globalCompositeOperation=d.compositeOperation),d.shadow&&this._applyShadow(a,d.shadow)},b.cache=function(a,b,c,d,e){e=e||1,this.cacheCanvas||(this.cacheCanvas=createjs.createCanvas?createjs.createCanvas():document.createElement("canvas")),this._cacheWidth=c,this._cacheHeight=d,this._cacheOffsetX=a,this._cacheOffsetY=b,this._cacheScale=e,this.updateCache()},b.updateCache=function(b){var c,d=this.cacheCanvas,e=this._cacheScale,f=this._cacheOffsetX*e,g=this._cacheOffsetY*e,h=this._cacheWidth,i=this._cacheHeight;if(!d)throw"cache() must be called before updateCache()";var j=d.getContext("2d");(c=this._applyFilterBounds(f,g,h,i))&&(f=c.x,g=c.y,h=c.width,i=c.height),h=Math.ceil(h*e),i=Math.ceil(i*e),h!=d.width||i!=d.height?(d.width=h,d.height=i):b||j.clearRect(0,0,h+1,i+1),j.save(),j.globalCompositeOperation=b,j.setTransform(e,0,0,e,-f,-g),this.draw(j,!0),this._applyFilters(),j.restore(),this.cacheID=a._nextCacheID++},b.uncache=function(){this._cacheDataURL=this.cacheCanvas=null,this.cacheID=this._cacheOffsetX=this._cacheOffsetY=0,this._cacheScale=1},b.getCacheDataURL=function(){return this.cacheCanvas?(this.cacheID!=this._cacheDataURLID&&(this._cacheDataURL=this.cacheCanvas.toDataURL()),this._cacheDataURL):null},b.getStage=function(){for(var a=this;a.parent;)a=a.parent;return a instanceof createjs.Stage?a:null},b.localToGlobal=function(a,b){var c=this.getConcatenatedMatrix(this._matrix);return null==c?null:(c.append(1,0,0,1,a,b),new createjs.Point(c.tx,c.ty))},b.globalToLocal=function(a,b){var c=this.getConcatenatedMatrix(this._matrix);return null==c?null:(c.invert(),c.append(1,0,0,1,a,b),new createjs.Point(c.tx,c.ty))},b.localToLocal=function(a,b,c){var d=this.localToGlobal(a,b);return c.globalToLocal(d.x,d.y)},b.setTransform=function(a,b,c,d,e,f,g,h,i){return this.x=a||0,this.y=b||0,this.scaleX=null==c?1:c,this.scaleY=null==d?1:d,this.rotation=e||0,this.skewX=f||0,this.skewY=g||0,this.regX=h||0,this.regY=i||0,this},b.getMatrix=function(a){var b=this;return(a?a.identity():new createjs.Matrix2D).appendTransform(b.x,b.y,b.scaleX,b.scaleY,b.rotation,b.skewX,b.skewY,b.regX,b.regY).appendProperties(b.alpha,b.shadow,b.compositeOperation)},b.getConcatenatedMatrix=function(a){a?a.identity():a=new createjs.Matrix2D;for(var b=this;null!=b;)a.prependTransform(b.x,b.y,b.scaleX,b.scaleY,b.rotation,b.skewX,b.skewY,b.regX,b.regY).prependProperties(b.alpha,b.shadow,b.compositeOperation),b=b.parent;return a},b.hitTest=function(b,c){var d=a._hitTestContext;d.setTransform(1,0,0,1,-b,-c),this.draw(d);
var e=this._testHit(d);return d.setTransform(1,0,0,1,0,0),d.clearRect(0,0,2,2),e},b.set=function(a){for(var b in a)this[b]=a[b];return this},b.getBounds=function(){if(this._bounds)return this._rectangle.copy(this._bounds);var a=this.cacheCanvas;if(a){var b=this._cacheScale;return this._rectangle.initialize(this._cacheOffsetX,this._cacheOffsetY,a.width/b,a.height/b)}return null},b.getTransformedBounds=function(){return this._getBounds()},b.setBounds=function(a,b,c,d){null==a&&(this._bounds=a),this._bounds=(this._bounds||new createjs.Rectangle).initialize(a,b,c,d)},b.clone=function(){var b=new a;return this.cloneProps(b),b},b.toString=function(){return"[DisplayObject (name="+this.name+")]"},b.cloneProps=function(a){a.alpha=this.alpha,a.name=this.name,a.regX=this.regX,a.regY=this.regY,a.rotation=this.rotation,a.scaleX=this.scaleX,a.scaleY=this.scaleY,a.shadow=this.shadow,a.skewX=this.skewX,a.skewY=this.skewY,a.visible=this.visible,a.x=this.x,a.y=this.y,a._bounds=this._bounds,a.mouseEnabled=this.mouseEnabled,a.compositeOperation=this.compositeOperation},b._applyShadow=function(a,b){b=b||Shadow.identity,a.shadowColor=b.color,a.shadowOffsetX=b.offsetX,a.shadowOffsetY=b.offsetY,a.shadowBlur=b.blur},b._tick=function(a){var b=this._listeners;if(b&&b.tick){var c=new createjs.Event("tick");c.params=a,this._dispatchEvent(c,this,2)}},b._testHit=function(b){try{var c=b.getImageData(0,0,1,1).data[3]>1}catch(d){if(!a.suppressCrossDomainErrors)throw"An error has occurred. This is most likely due to security restrictions on reading canvas pixel data with local or cross-domain images."}return c},b._applyFilters=function(){if(this.filters&&0!=this.filters.length&&this.cacheCanvas)for(var a=this.filters.length,b=this.cacheCanvas.getContext("2d"),c=this.cacheCanvas.width,d=this.cacheCanvas.height,e=0;a>e;e++)this.filters[e].applyFilter(b,0,0,c,d)},b._applyFilterBounds=function(a,b,c,d){var e,f,g=this.filters;if(!g||!(f=g.length))return null;for(var h=0;f>h;h++){var i=this.filters[h],j=i.getBounds&&i.getBounds();j&&(e||(e=this._rectangle.initialize(a,b,c,d)),e.x+=j.x,e.y+=j.y,e.width+=j.width,e.height+=j.height)}return e},b._getBounds=function(a,b){return this._transformBounds(this.getBounds(),a,b)},b._transformBounds=function(a,b,c){if(!a)return a;var d=a.x,e=a.y,f=a.width,g=a.height,h=c?this._matrix.identity():this.getMatrix(this._matrix);(d||e)&&h.appendTransform(0,0,1,1,0,0,0,-d,-e),b&&h.prependMatrix(b);var i=f*h.a,j=f*h.b,k=g*h.c,l=g*h.d,m=h.tx,n=h.ty,o=m,p=m,q=n,r=n;return(d=i+m)<o?o=d:d>p&&(p=d),(d=i+k+m)<o?o=d:d>p&&(p=d),(d=k+m)<o?o=d:d>p&&(p=d),(e=j+n)<q?q=e:e>r&&(r=e),(e=j+l+n)<q?q=e:e>r&&(r=e),(e=l+n)<q?q=e:e>r&&(r=e),a.initialize(o,q,p-o,r-q)},b._hasMouseEventListener=function(){for(var b=a._MOUSE_EVENTS,c=0,d=b.length;d>c;c++)if(this.hasEventListener(b[c]))return!0;return!!this.cursor},createjs.DisplayObject=a}(),this.createjs=this.createjs||{},function(){var a=function(){this.initialize()},b=a.prototype=new createjs.DisplayObject;b.children=null,b.mouseChildren=!0,b.tickChildren=!0,b.DisplayObject_initialize=b.initialize,b.initialize=function(){this.DisplayObject_initialize(),this.children=[]},b.isVisible=function(){var a=this.cacheCanvas||this.children.length;return!!(this.visible&&this.alpha>0&&0!=this.scaleX&&0!=this.scaleY&&a)},b.DisplayObject_draw=b.draw,b.draw=function(a,b){if(this.DisplayObject_draw(a,b))return!0;for(var c=this.children.slice(0),d=0,e=c.length;e>d;d++){var f=c[d];f.isVisible()&&(a.save(),f.updateContext(a),f.draw(a),a.restore())}return!0},b.addChild=function(a){if(null==a)return a;var b=arguments.length;if(b>1){for(var c=0;b>c;c++)this.addChild(arguments[c]);return arguments[b-1]}return a.parent&&a.parent.removeChild(a),a.parent=this,this.children.push(a),a},b.addChildAt=function(a,b){var c=arguments.length,d=arguments[c-1];if(0>d||d>this.children.length)return arguments[c-2];if(c>2){for(var e=0;c-1>e;e++)this.addChildAt(arguments[e],d+e);return arguments[c-2]}return a.parent&&a.parent.removeChild(a),a.parent=this,this.children.splice(b,0,a),a},b.removeChild=function(a){var b=arguments.length;if(b>1){for(var c=!0,d=0;b>d;d++)c=c&&this.removeChild(arguments[d]);return c}return this.removeChildAt(createjs.indexOf(this.children,a))},b.removeChildAt=function(a){var b=arguments.length;if(b>1){for(var c=[],d=0;b>d;d++)c[d]=arguments[d];c.sort(function(a,b){return b-a});for(var e=!0,d=0;b>d;d++)e=e&&this.removeChildAt(c[d]);return e}if(0>a||a>this.children.length-1)return!1;var f=this.children[a];return f&&(f.parent=null),this.children.splice(a,1),!0},b.removeAllChildren=function(){for(var a=this.children;a.length;)a.pop().parent=null},b.getChildAt=function(a){return this.children[a]},b.getChildByName=function(a){for(var b=this.children,c=0,d=b.length;d>c;c++)if(b[c].name==a)return b[c];return null},b.sortChildren=function(a){this.children.sort(a)},b.getChildIndex=function(a){return createjs.indexOf(this.children,a)},b.getNumChildren=function(){return this.children.length},b.swapChildrenAt=function(a,b){var c=this.children,d=c[a],e=c[b];d&&e&&(c[a]=e,c[b]=d)},b.swapChildren=function(a,b){for(var c,d,e=this.children,f=0,g=e.length;g>f&&(e[f]==a&&(c=f),e[f]==b&&(d=f),null==c||null==d);f++);f!=g&&(e[c]=b,e[d]=a)},b.setChildIndex=function(a,b){var c=this.children,d=c.length;if(!(a.parent!=this||0>b||b>=d)){for(var e=0;d>e&&c[e]!=a;e++);e!=d&&e!=b&&(c.splice(e,1),c.splice(b,0,a))}},b.contains=function(a){for(;a;){if(a==this)return!0;a=a.parent}return!1},b.hitTest=function(a,b){return null!=this.getObjectUnderPoint(a,b)},b.getObjectsUnderPoint=function(a,b){var c=[],d=this.localToGlobal(a,b);return this._getObjectsUnderPoint(d.x,d.y,c),c},b.getObjectUnderPoint=function(a,b){var c=this.localToGlobal(a,b);return this._getObjectsUnderPoint(c.x,c.y)},b.DisplayObject_getBounds=b.getBounds,b.getBounds=function(){return this._getBounds(null,!0)},b.getTransformedBounds=function(){return this._getBounds()},b.clone=function(b){var c=new a;if(this.cloneProps(c),b)for(var d=c.children=[],e=0,f=this.children.length;f>e;e++){var g=this.children[e].clone(b);g.parent=c,d.push(g)}return c},b.toString=function(){return"[Container (name="+this.name+")]"},b.DisplayObject__tick=b._tick,b._tick=function(a){if(this.tickChildren)for(var b=this.children.length-1;b>=0;b--){var c=this.children[b];c.tickEnabled&&c._tick&&c._tick(a)}this.DisplayObject__tick(a)},b._getObjectsUnderPoint=function(b,c,d,e,f){var g=createjs.DisplayObject._hitTestContext,h=this._matrix;f=f||e&&this._hasMouseEventListener();for(var i=this.children,j=i.length,k=j-1;k>=0;k--){var l=i[k],m=l.hitArea;if(l.visible&&(m||l.isVisible())&&(!e||l.mouseEnabled))if(!m&&l instanceof a){var n=l._getObjectsUnderPoint(b,c,d,e,f);if(!d&&n)return e&&!this.mouseChildren?this:n}else{if(!f&&!l._hasMouseEventListener())continue;if(l.getConcatenatedMatrix(h),m&&(h.appendTransform(m.x,m.y,m.scaleX,m.scaleY,m.rotation,m.skewX,m.skewY,m.regX,m.regY),h.alpha=m.alpha),g.globalAlpha=h.alpha,g.setTransform(h.a,h.b,h.c,h.d,h.tx-b,h.ty-c),(m||l).draw(g),!this._testHit(g))continue;if(g.setTransform(1,0,0,1,0,0),g.clearRect(0,0,2,2),!d)return e&&!this.mouseChildren?this:l;d.push(l)}}return null},b._getBounds=function(a,b){var c=this.DisplayObject_getBounds();if(c)return this._transformBounds(c,a,b);var d,e,f,g,h=b?this._matrix.identity():this.getMatrix(this._matrix);a&&h.prependMatrix(a);for(var i=this.children.length,j=0;i>j;j++){var k=this.children[j];if(k.visible&&(c=k._getBounds(h))){var l=c.x,m=c.y,n=l+c.width,o=m+c.height;(d>l||null==d)&&(d=l),(n>e||null==e)&&(e=n),(f>m||null==f)&&(f=m),(o>g||null==g)&&(g=o)}}return null==e?null:this._rectangle.initialize(d,f,e-d,g-f)},createjs.Container=a}(),this.createjs=this.createjs||{},function(){"use strict";var a=function(a){this.initialize(a)},b=a.prototype=new createjs.Container;a._snapToPixelEnabled=!1,b.autoClear=!0,b.canvas=null,b.mouseX=0,b.mouseY=0,b.snapToPixelEnabled=!1,b.mouseInBounds=!1,b.tickOnUpdate=!0,b.mouseMoveOutside=!1,b.nextStage=null,b._pointerData=null,b._pointerCount=0,b._primaryPointerID=null,b._mouseOverIntervalID=null,b.Container_initialize=b.initialize,b.initialize=function(a){this.Container_initialize(),this.canvas="string"==typeof a?document.getElementById(a):a,this._pointerData={},this.enableDOMEvents(!0)},b.update=function(){if(this.canvas){this.tickOnUpdate&&(this.dispatchEvent("tickstart"),this.tickEnabled&&this._tick(arguments.length?arguments:null),this.dispatchEvent("tickend")),this.dispatchEvent("drawstart"),a._snapToPixelEnabled=this.snapToPixelEnabled,this.autoClear&&this.clear();var b=this.canvas.getContext("2d");b.save(),this.updateContext(b),this.draw(b,!1),b.restore(),this.dispatchEvent("drawend")}},b.handleEvent=function(a){"tick"==a.type&&this.update(a)},b.clear=function(){if(this.canvas){var a=this.canvas.getContext("2d");a.setTransform(1,0,0,1,0,0),a.clearRect(0,0,this.canvas.width+1,this.canvas.height+1)}},b.toDataURL=function(a,b){b||(b="image/png");var c,d=this.canvas.getContext("2d"),e=this.canvas.width,f=this.canvas.height;if(a){c=d.getImageData(0,0,e,f);var g=d.globalCompositeOperation;d.globalCompositeOperation="destination-over",d.fillStyle=a,d.fillRect(0,0,e,f)}var h=this.canvas.toDataURL(b);return a&&(d.clearRect(0,0,e+1,f+1),d.putImageData(c,0,0),d.globalCompositeOperation=g),h},b.enableMouseOver=function(a){if(this._mouseOverIntervalID&&(clearInterval(this._mouseOverIntervalID),this._mouseOverIntervalID=null,0==a&&this._testMouseOver(!0)),null==a)a=20;else if(0>=a)return;var b=this;this._mouseOverIntervalID=setInterval(function(){b._testMouseOver()},1e3/Math.min(50,a))},b.enableDOMEvents=function(a){null==a&&(a=!0);var b,c,d=this._eventListeners;if(!a&&d){for(b in d)c=d[b],c.t.removeEventListener(b,c.f,!1);this._eventListeners=null}else if(a&&!d&&this.canvas){var e=window.addEventListener?window:document,f=this;d=this._eventListeners={},d.mouseup={t:e,f:function(a){f._handleMouseUp(a)}},d.mousemove={t:e,f:function(a){f._handleMouseMove(a)}},d.dblclick={t:this.canvas,f:function(a){f._handleDoubleClick(a)}},d.mousedown={t:this.canvas,f:function(a){f._handleMouseDown(a)}};for(b in d)c=d[b],c.t.addEventListener(b,c.f,!1)}},b.clone=function(){var b=new a(null);return this.cloneProps(b),b},b.toString=function(){return"[Stage (name="+this.name+")]"},b._getElementRect=function(a){var b;try{b=a.getBoundingClientRect()}catch(c){b={top:a.offsetTop,left:a.offsetLeft,width:a.offsetWidth,height:a.offsetHeight}}var d=(window.pageXOffset||document.scrollLeft||0)-(document.clientLeft||document.body.clientLeft||0),e=(window.pageYOffset||document.scrollTop||0)-(document.clientTop||document.body.clientTop||0),f=window.getComputedStyle?getComputedStyle(a):a.currentStyle,g=parseInt(f.paddingLeft)+parseInt(f.borderLeftWidth),h=parseInt(f.paddingTop)+parseInt(f.borderTopWidth),i=parseInt(f.paddingRight)+parseInt(f.borderRightWidth),j=parseInt(f.paddingBottom)+parseInt(f.borderBottomWidth);return{left:b.left+d+g,right:b.right+d-i,top:b.top+e+h,bottom:b.bottom+e-j}},b._getPointerData=function(a){var b=this._pointerData[a];return b||(b=this._pointerData[a]={x:0,y:0},null==this._primaryPointerID&&(this._primaryPointerID=a),(null==this._primaryPointerID||-1==this._primaryPointerID)&&(this._primaryPointerID=a)),b},b._handleMouseMove=function(a){a||(a=window.event),this._handlePointerMove(-1,a,a.pageX,a.pageY)},b._handlePointerMove=function(a,b,c,d){if(this.canvas){var e=this._getPointerData(a),f=e.inBounds;if(this._updatePointerPosition(a,b,c,d),f||e.inBounds||this.mouseMoveOutside){-1==a&&e.inBounds==!f&&this._dispatchMouseEvent(this,f?"mouseleave":"mouseenter",!1,a,e,b),this._dispatchMouseEvent(this,"stagemousemove",!1,a,e,b),this._dispatchMouseEvent(e.target,"pressmove",!0,a,e,b);var g=e.event;g&&g.hasEventListener("mousemove")&&g.dispatchEvent(new createjs.MouseEvent("mousemove",!1,!1,e.x,e.y,b,a,a==this._primaryPointerID,e.rawX,e.rawY),e.target),this.nextStage&&this.nextStage._handlePointerMove(a,b,c,d)}}},b._updatePointerPosition=function(a,b,c,d){var e=this._getElementRect(this.canvas);c-=e.left,d-=e.top;var f=this.canvas.width,g=this.canvas.height;c/=(e.right-e.left)/f,d/=(e.bottom-e.top)/g;var h=this._getPointerData(a);(h.inBounds=c>=0&&d>=0&&f-1>=c&&g-1>=d)?(h.x=c,h.y=d):this.mouseMoveOutside&&(h.x=0>c?0:c>f-1?f-1:c,h.y=0>d?0:d>g-1?g-1:d),h.posEvtObj=b,h.rawX=c,h.rawY=d,a==this._primaryPointerID&&(this.mouseX=h.x,this.mouseY=h.y,this.mouseInBounds=h.inBounds)},b._handleMouseUp=function(a){this._handlePointerUp(-1,a,!1)},b._handlePointerUp=function(a,b,c){var d=this._getPointerData(a);this._dispatchMouseEvent(this,"stagemouseup",!1,a,d,b);var e=d.target;e&&(this._getObjectsUnderPoint(d.x,d.y,null,!0)==e&&this._dispatchMouseEvent(e,"click",!0,a,d,b),this._dispatchMouseEvent(e,"pressup",!0,a,d,b));var f=d.event;f&&f.hasEventListener("mouseup")&&f.dispatchEvent(new createjs.MouseEvent("mouseup",!1,!1,d.x,d.y,b,a,a==this._primaryPointerID,d.rawX,d.rawY),e),c?(a==this._primaryPointerID&&(this._primaryPointerID=null),delete this._pointerData[a]):d.event=d.target=null,this.nextStage&&this.nextStage._handlePointerUp(a,b,c)},b._handleMouseDown=function(a){this._handlePointerDown(-1,a,a.pageX,a.pageY)},b._handlePointerDown=function(a,b,c,d){null!=d&&this._updatePointerPosition(a,b,c,d);var e=this._getPointerData(a);this._dispatchMouseEvent(this,"stagemousedown",!1,a,e,b),e.target=this._getObjectsUnderPoint(e.x,e.y,null,!0),e.event=this._dispatchMouseEvent(e.target,"mousedown",!0,a,e,b),this.nextStage&&this.nextStage._handlePointerDown(a,b,c,d)},b._testMouseOver=function(a){if(-1==this._primaryPointerID&&(a||this.mouseX!=this._mouseOverX||this.mouseY!=this._mouseOverY||!this.mouseInBounds)){var b,c,d,e,f=this._getPointerData(-1),g=f.posEvtObj,h=-1,i="";(a||this.mouseInBounds&&g&&g.target==this.canvas)&&(b=this._getObjectsUnderPoint(this.mouseX,this.mouseY,null,!0),this._mouseOverX=this.mouseX,this._mouseOverY=this.mouseY);var j=this._mouseOverTarget||[],k=j[j.length-1],l=this._mouseOverTarget=[];for(c=b;c;)l.unshift(c),null!=c.cursor&&(i=c.cursor),c=c.parent;for(this.canvas.style.cursor=i,d=0,e=l.length;e>d&&l[d]==j[d];d++)h=d;for(k!=b&&this._dispatchMouseEvent(k,"mouseout",!0,-1,f,g),d=j.length-1;d>h;d--)this._dispatchMouseEvent(j[d],"rollout",!1,-1,f,g);for(d=l.length-1;d>h;d--)this._dispatchMouseEvent(l[d],"rollover",!1,-1,f,g);k!=b&&this._dispatchMouseEvent(b,"mouseover",!0,-1,f,g)}},b._handleDoubleClick=function(a){var b=this._getPointerData(-1),c=this._getObjectsUnderPoint(b.x,b.y,null,!0);this._dispatchMouseEvent(c,"dblclick",!0,-1,b,a),this.nextStage&&this.nextStage._handleDoubleClick(a)},b._dispatchMouseEvent=function(a,b,c,d,e,f){if(a&&(c||a.hasEventListener(b))){var g=new createjs.MouseEvent(b,c,!1,e.x,e.y,f,d,d==this._primaryPointerID,e.rawX,e.rawY);return a.dispatchEvent(g),g}},createjs.Stage=a}(),this.createjs=this.createjs||{},function(){var a=function(a){this.initialize(a)},b=a.prototype=new createjs.DisplayObject;b.image=null,b.snapToPixel=!0,b.sourceRect=null,b.DisplayObject_initialize=b.initialize,b.initialize=function(a){this.DisplayObject_initialize(),"string"==typeof a?(this.image=document.createElement("img"),this.image.src=a):this.image=a},b.isVisible=function(){var a=this.cacheCanvas||this.image&&(this.image.complete||this.image.getContext||this.image.readyState>=2);return!!(this.visible&&this.alpha>0&&0!=this.scaleX&&0!=this.scaleY&&a)},b.DisplayObject_draw=b.draw,b.draw=function(a,b){if(this.DisplayObject_draw(a,b))return!0;var c=this.sourceRect;return c?a.drawImage(this.image,c.x,c.y,c.width,c.height,0,0,c.width,c.height):a.drawImage(this.image,0,0),!0},b.DisplayObject_getBounds=b.getBounds,b.getBounds=function(){var a=this.DisplayObject_getBounds();if(a)return a;var b=this.sourceRect||this.image,c=this.image&&(this.image.complete||this.image.getContext||this.image.readyState>=2);return c?this._rectangle.initialize(0,0,b.width,b.height):null},b.clone=function(){var b=new a(this.image);return this.sourceRect&&(b.sourceRect=this.sourceRect.clone()),this.cloneProps(b),b},b.toString=function(){return"[Bitmap (name="+this.name+")]"},createjs.Bitmap=a}(),this.createjs=this.createjs||{},function(){"use strict";var a=function(a,b){this.initialize(a,b)},b=a.prototype=new createjs.DisplayObject;b.currentFrame=0,b.currentAnimation=null,b.paused=!0,b.spriteSheet=null,b.snapToPixel=!0,b.offset=0,b.currentAnimationFrame=0,b.framerate=0,b._advanceCount=0,b._animation=null,b._currentFrame=null,b.DisplayObject_initialize=b.initialize,b.initialize=function(a,b){this.DisplayObject_initialize(),this.spriteSheet=a,b&&this.gotoAndPlay(b)},b.isVisible=function(){var a=this.cacheCanvas||this.spriteSheet.complete;return!!(this.visible&&this.alpha>0&&0!=this.scaleX&&0!=this.scaleY&&a)},b.DisplayObject_draw=b.draw,b.draw=function(a,b){if(this.DisplayObject_draw(a,b))return!0;this._normalizeFrame();var c=this.spriteSheet.getFrame(0|this._currentFrame);if(!c)return!1;var d=c.rect;return a.drawImage(c.image,d.x,d.y,d.width,d.height,-c.regX,-c.regY,d.width,d.height),!0},b.play=function(){this.paused=!1},b.stop=function(){this.paused=!0},b.gotoAndPlay=function(a){this.paused=!1,this._goto(a)},b.gotoAndStop=function(a){this.paused=!0,this._goto(a)},b.advance=function(a){var b=this._animation&&this._animation.speed||1,c=this.framerate||this.spriteSheet.framerate,d=c&&null!=a?a/(1e3/c):1;this._animation?this.currentAnimationFrame+=d*b:this._currentFrame+=d*b,this._normalizeFrame()},b.DisplayObject_getBounds=b.getBounds,b.getBounds=function(){return this.DisplayObject_getBounds()||this.spriteSheet.getFrameBounds(this.currentFrame,this._rectangle)},b.clone=function(){var b=new a(this.spriteSheet);return this.cloneProps(b),b},b.toString=function(){return"[Sprite (name="+this.name+")]"},b.DisplayObject__tick=b._tick,b._tick=function(a){this.paused||this.advance(a&&a[0]&&a[0].delta),this.DisplayObject__tick(a)},b._normalizeFrame=function(){var a,b=this._animation,c=this.paused,d=this._currentFrame,e=this.currentAnimationFrame;if(b)if(a=b.frames.length,(0|e)>=a){var f=b.next;if(this._dispatchAnimationEnd(b,d,c,f,a-1));else{if(f)return this._goto(f,e-a);this.paused=!0,e=this.currentAnimationFrame=b.frames.length-1,this._currentFrame=b.frames[e]}}else this._currentFrame=b.frames[0|e];else if(a=this.spriteSheet.getNumFrames(),d>=a&&!this._dispatchAnimationEnd(b,d,c,a-1)&&(this._currentFrame-=a)>=a)return this._normalizeFrame();this.currentFrame=0|this._currentFrame},b._dispatchAnimationEnd=function(a,b,c,d,e){var f=a?a.name:null;if(this.hasEventListener("animationend")){var g=new createjs.Event("animationend");g.name=f,g.next=d,this.dispatchEvent(g)}var h=this._animation!=a||this._currentFrame!=b;return h||c||!this.paused||(this.currentAnimationFrame=e,h=!0),h},b.DisplayObject_cloneProps=b.cloneProps,b.cloneProps=function(a){this.DisplayObject_cloneProps(a),a.currentFrame=this.currentFrame,a._currentFrame=this._currentFrame,a.currentAnimation=this.currentAnimation,a.paused=this.paused,a._animation=this._animation,a.currentAnimationFrame=this.currentAnimationFrame,a.framerate=this.framerate},b._goto=function(a,b){if(isNaN(a)){var c=this.spriteSheet.getAnimation(a);c&&(this.currentAnimationFrame=b||0,this._animation=c,this.currentAnimation=a,this._normalizeFrame())}else this.currentAnimationFrame=0,this.currentAnimation=this._animation=null,this._currentFrame=a,this._normalizeFrame()},createjs.Sprite=a}(),this.createjs=this.createjs||{},function(){"use strict";var a="BitmapAnimation is deprecated in favour of Sprite. See VERSIONS file for info on changes.";if(!createjs.Sprite)throw a;(createjs.BitmapAnimation=function(b){console.log(a),this.initialize(b)}).prototype=new createjs.Sprite}(),this.createjs=this.createjs||{},function(){"use strict";var a=function(a){this.initialize(a)},b=a.prototype=new createjs.DisplayObject;b.graphics=null,b.DisplayObject_initialize=b.initialize,b.initialize=function(a){this.DisplayObject_initialize(),this.graphics=a?a:new createjs.Graphics},b.isVisible=function(){var a=this.cacheCanvas||this.graphics&&!this.graphics.isEmpty();return!!(this.visible&&this.alpha>0&&0!=this.scaleX&&0!=this.scaleY&&a)},b.DisplayObject_draw=b.draw,b.draw=function(a,b){return this.DisplayObject_draw(a,b)?!0:(this.graphics.draw(a),!0)},b.clone=function(b){var c=new a(b&&this.graphics?this.graphics.clone():this.graphics);return this.cloneProps(c),c},b.toString=function(){return"[Shape (name="+this.name+")]"},createjs.Shape=a}(),this.createjs=this.createjs||{},function(){"use strict";var a=function(a,b,c){this.initialize(a,b,c)},b=a.prototype=new createjs.DisplayObject,c=createjs.createCanvas?createjs.createCanvas():document.createElement("canvas");c.getContext&&(a._workingContext=c.getContext("2d"),c.width=c.height=1),a.H_OFFSETS={start:0,left:0,center:-.5,end:-1,right:-1},a.V_OFFSETS={top:0,hanging:-.01,middle:-.4,alphabetic:-.8,ideographic:-.85,bottom:-1},b.text="",b.font=null,b.color=null,b.textAlign="left",b.textBaseline="top",b.maxWidth=null,b.outline=0,b.lineHeight=0,b.lineWidth=null,b.DisplayObject_initialize=b.initialize,b.initialize=function(a,b,c){this.DisplayObject_initialize(),this.text=a,this.font=b,this.color=c},b.isVisible=function(){var a=this.cacheCanvas||null!=this.text&&""!==this.text;return!!(this.visible&&this.alpha>0&&0!=this.scaleX&&0!=this.scaleY&&a)},b.DisplayObject_draw=b.draw,b.draw=function(a,b){if(this.DisplayObject_draw(a,b))return!0;var c=this.color||"#000";return this.outline?(a.strokeStyle=c,a.lineWidth=1*this.outline):a.fillStyle=c,this._drawText(this._prepContext(a)),!0},b.getMeasuredWidth=function(){return this._prepContext(a._workingContext).measureText(this.text).width},b.getMeasuredLineHeight=function(){return 1.2*this._prepContext(a._workingContext).measureText("M").width},b.getMeasuredHeight=function(){return this._drawText(null,{}).height},b.DisplayObject_getBounds=b.getBounds,b.getBounds=function(){var b=this.DisplayObject_getBounds();if(b)return b;if(null==this.text||""==this.text)return null;var c=this._drawText(null,{}),d=this.maxWidth&&this.maxWidth<c.width?this.maxWidth:c.width,e=d*a.H_OFFSETS[this.textAlign||"left"],f=this.lineHeight||this.getMeasuredLineHeight(),g=f*a.V_OFFSETS[this.textBaseline||"top"];return this._rectangle.initialize(e,g,d,c.height)},b.clone=function(){var b=new a(this.text,this.font,this.color);return this.cloneProps(b),b},b.toString=function(){return"[Text (text="+(this.text.length>20?this.text.substr(0,17)+"...":this.text)+")]"},b.DisplayObject_cloneProps=b.cloneProps,b.cloneProps=function(a){this.DisplayObject_cloneProps(a),a.textAlign=this.textAlign,a.textBaseline=this.textBaseline,a.maxWidth=this.maxWidth,a.outline=this.outline,a.lineHeight=this.lineHeight,a.lineWidth=this.lineWidth},b._prepContext=function(a){return a.font=this.font,a.textAlign=this.textAlign||"left",a.textBaseline=this.textBaseline||"top",a},b._drawText=function(b,c){var d=!!b;d||(b=this._prepContext(a._workingContext));for(var e=this.lineHeight||this.getMeasuredLineHeight(),f=0,g=0,h=String(this.text).split(/(?:\r\n|\r|\n)/),i=0,j=h.length;j>i;i++){var k=h[i],l=null;if(null!=this.lineWidth&&(l=b.measureText(k).width)>this.lineWidth){var m=k.split(/(\s)/);k=m[0],l=b.measureText(k).width;for(var n=1,o=m.length;o>n;n+=2){var p=b.measureText(m[n]+m[n+1]).width;l+p>this.lineWidth?(d&&this._drawTextLine(b,k,g*e),l>f&&(f=l),k=m[n+1],l=b.measureText(k).width,g++):(k+=m[n]+m[n+1],l+=p)}}d&&this._drawTextLine(b,k,g*e),c&&null==l&&(l=b.measureText(k).width),l>f&&(f=l),g++}return c&&(c.count=g,c.width=f,c.height=g*e),c},b._drawTextLine=function(a,b,c){this.outline?a.strokeText(b,0,c,this.maxWidth||65535):a.fillText(b,0,c,this.maxWidth||65535)},createjs.Text=a}(),this.createjs=this.createjs||{},function(){"use strict";function a(a,b){this.initialize(a,b)}var b=a.prototype=new createjs.DisplayObject;b.text="",b.spriteSheet=null,b.lineHeight=0,b.letterSpacing=0,b.spaceWidth=0,b.DisplayObject_initialize=b.initialize,b.initialize=function(a,b){this.DisplayObject_initialize(),this.text=a,this.spriteSheet=b},b.DisplayObject_draw=b.draw,b.draw=function(a,b){return this.DisplayObject_draw(a,b)?!0:(this._drawText(a),void 0)},b.isVisible=function(){var a=this.cacheCanvas||this.spriteSheet&&this.spriteSheet.complete&&this.text;return!!(this.visible&&this.alpha>0&&0!=this.scaleX&&0!=this.scaleY&&a)},b.getBounds=function(){var a=this._rectangle;return this._drawText(null,a),a.width?a:null},b._getFrame=function(a,b){var c,d=b.getAnimation(a);return d||(a!=(c=a.toUpperCase())||a!=(c=a.toLowerCase())||(c=null),c&&(d=b.getAnimation(c))),d&&b.getFrame(d.frames[0])},b._getLineHeight=function(a){var b=this._getFrame("1",a)||this._getFrame("T",a)||this._getFrame("L",a)||a.getFrame(0);return b?b.rect.height:1},b._getSpaceWidth=function(a){var b=this._getFrame("1",a)||this._getFrame("l",a)||this._getFrame("e",a)||this._getFrame("a",a)||a.getFrame(0);return b?b.rect.width:1},b._drawText=function(a,b){var c,d,e,f=0,g=0,h=this.spaceWidth,i=this.lineHeight,j=this.spriteSheet,k=!!this._getFrame(" ",j);k||0!=h||(h=this._getSpaceWidth(j)),0==i&&(i=this._getLineHeight(j));for(var l=0,m=0,n=this.text.length;n>m;m++){var o=this.text.charAt(m);if(k||" "!=o)if("\n"!=o&&"\r"!=o){var p=this._getFrame(o,j);if(p){var q=p.rect;e=p.regX,c=q.width,a&&a.drawImage(p.image,q.x,q.y,c,d=q.height,f-e,g-p.regY,c,d),f+=c+this.letterSpacing}}else"\r"==o&&"\n"==this.text.charAt(m+1)&&m++,f-e>l&&(l=f-e),f=0,g+=i;else f+=h}f-e>l&&(l=f-e),b&&(b.width=l-this.letterSpacing,b.height=g+i)},createjs.BitmapText=a}(),this.createjs=this.createjs||{},function(){"use strict";var a=function(){throw"SpriteSheetUtils cannot be instantiated"},b=createjs.createCanvas?createjs.createCanvas():document.createElement("canvas");b.getContext&&(a._workingCanvas=b,a._workingContext=b.getContext("2d"),b.width=b.height=1),a.addFlippedFrames=function(b,c,d,e){if(c||d||e){var f=0;c&&a._flip(b,++f,!0,!1),d&&a._flip(b,++f,!1,!0),e&&a._flip(b,++f,!0,!0)}},a.extractFrame=function(b,c){isNaN(c)&&(c=b.getAnimation(c).frames[0]);var d=b.getFrame(c);if(!d)return null;var e=d.rect,f=a._workingCanvas;f.width=e.width,f.height=e.height,a._workingContext.drawImage(d.image,e.x,e.y,e.width,e.height,0,0,e.width,e.height);var g=document.createElement("img");return g.src=f.toDataURL("image/png"),g},a.mergeAlpha=function(a,b,c){c||(c=createjs.createCanvas?createjs.createCanvas():document.createElement("canvas")),c.width=Math.max(b.width,a.width),c.height=Math.max(b.height,a.height);var d=c.getContext("2d");return d.save(),d.drawImage(a,0,0),d.globalCompositeOperation="destination-in",d.drawImage(b,0,0),d.restore(),c},a._flip=function(b,c,d,e){for(var f=b._images,g=a._workingCanvas,h=a._workingContext,i=f.length/c,j=0;i>j;j++){var k=f[j];k.__tmp=j,h.setTransform(1,0,0,1,0,0),h.clearRect(0,0,g.width+1,g.height+1),g.width=k.width,g.height=k.height,h.setTransform(d?-1:1,0,0,e?-1:1,d?k.width:0,e?k.height:0),h.drawImage(k,0,0);var l=document.createElement("img");l.src=g.toDataURL("image/png"),l.width=k.width,l.height=k.height,f.push(l)}var m=b._frames,n=m.length/c;for(j=0;n>j;j++){k=m[j];var o=k.rect.clone();l=f[k.image.__tmp+i*c];var p={image:l,rect:o,regX:k.regX,regY:k.regY};d&&(o.x=l.width-o.x-o.width,p.regX=o.width-k.regX),e&&(o.y=l.height-o.y-o.height,p.regY=o.height-k.regY),m.push(p)}var q="_"+(d?"h":"")+(e?"v":""),r=b._animations,s=b._data,t=r.length/c;for(j=0;t>j;j++){var u=r[j];k=s[u];var v={name:u+q,speed:k.speed,next:k.next,frames:[]};k.next&&(v.next+=q),m=k.frames;for(var w=0,x=m.length;x>w;w++)v.frames.push(m[w]+n*c);s[v.name]=v,r.push(v.name)}},createjs.SpriteSheetUtils=a}(),this.createjs=this.createjs||{},function(){"use strict";var a=function(){this.initialize()},b=a.prototype=new createjs.EventDispatcher;a.ERR_DIMENSIONS="frame dimensions exceed max spritesheet dimensions",a.ERR_RUNNING="a build is already running",b.maxWidth=2048,b.maxHeight=2048,b.spriteSheet=null,b.scale=1,b.padding=1,b.timeSlice=.3,b.progress=-1,b._frames=null,b._animations=null,b._data=null,b._nextFrameIndex=0,b._index=0,b._timerID=null,b._scale=1,b.initialize=function(){this._frames=[],this._animations={}},b.addFrame=function(b,c,d,e,f,g){if(this._data)throw a.ERR_RUNNING;var h=c||b.bounds||b.nominalBounds;return!h&&b.getBounds&&(h=b.getBounds()),h?(d=d||1,this._frames.push({source:b,sourceRect:h,scale:d,funct:e,params:f,scope:g,index:this._frames.length,height:h.height*d})-1):null},b.addAnimation=function(b,c,d,e){if(this._data)throw a.ERR_RUNNING;this._animations[b]={frames:c,next:d,frequency:e}},b.addMovieClip=function(b,c,d){if(this._data)throw a.ERR_RUNNING;var e=b.frameBounds,f=c||b.bounds||b.nominalBounds;if(!f&&b.getBounds&&(f=b.getBounds()),!f&&!e)return null;for(var g=this._frames.length,h=b.timeline.duration,i=0;h>i;i++){var j=e&&e[i]?e[i]:f;this.addFrame(b,j,d,function(a){var b=this.actionsEnabled;this.actionsEnabled=!1,this.gotoAndStop(a),this.actionsEnabled=b},[i],b)}var k=b.timeline._labels,l=[];for(var m in k)l.push({index:k[m],label:m});if(l.length){l.sort(function(a,b){return a.index-b.index});for(var i=0,n=l.length;n>i;i++){for(var o=l[i].label,p=g+l[i].index,q=g+(i==n-1?h:l[i+1].index),r=[],s=p;q>s;s++)r.push(s);this.addAnimation(o,r,!0)}}},b.build=function(){if(this._data)throw a.ERR_RUNNING;for(this._startBuild();this._drawNext(););return this._endBuild(),this.spriteSheet},b.buildAsync=function(b){if(this._data)throw a.ERR_RUNNING;this.timeSlice=b,this._startBuild();var c=this;this._timerID=setTimeout(function(){c._run()},50-50*Math.max(.01,Math.min(.99,this.timeSlice||.3)))},b.stopAsync=function(){clearTimeout(this._timerID),this._data=null},b.clone=function(){throw"SpriteSheetBuilder cannot be cloned."},b.toString=function(){return"[SpriteSheetBuilder]"},b._startBuild=function(){var b=this.padding||0;this.progress=0,this.spriteSheet=null,this._index=0,this._scale=this.scale;var c=[];this._data={images:[],frames:c,animations:this._animations};var d=this._frames.slice();if(d.sort(function(a,b){return a.height<=b.height?-1:1}),d[d.length-1].height+2*b>this.maxHeight)throw a.ERR_DIMENSIONS;for(var e=0,f=0,g=0;d.length;){var h=this._fillRow(d,e,g,c,b);if(h.w>f&&(f=h.w),e+=h.h,!h.h||!d.length){var i=createjs.createCanvas?createjs.createCanvas():document.createElement("canvas");i.width=this._getSize(f,this.maxWidth),i.height=this._getSize(e,this.maxHeight),this._data.images[g]=i,h.h||(f=e=0,g++)}}},b._getSize=function(a,b){for(var c=4;Math.pow(2,++c)<a;);return Math.min(b,Math.pow(2,c))},b._fillRow=function(b,c,d,e,f){var g=this.maxWidth,h=this.maxHeight;c+=f;for(var i=h-c,j=f,k=0,l=b.length-1;l>=0;l--){var m=b[l],n=this._scale*m.scale,o=m.sourceRect,p=m.source,q=Math.floor(n*o.x-f),r=Math.floor(n*o.y-f),s=Math.ceil(n*o.height+2*f),t=Math.ceil(n*o.width+2*f);if(t>g)throw a.ERR_DIMENSIONS;s>i||j+t>g||(m.img=d,m.rect=new createjs.Rectangle(j,c,t,s),k=k||s,b.splice(l,1),e[m.index]=[j,c,t,s,d,Math.round(-q+n*p.regX-f),Math.round(-r+n*p.regY-f)],j+=t)}return{w:j,h:k}},b._endBuild=function(){this.spriteSheet=new createjs.SpriteSheet(this._data),this._data=null,this.progress=1,this.dispatchEvent("complete")},b._run=function(){for(var a=50*Math.max(.01,Math.min(.99,this.timeSlice||.3)),b=(new Date).getTime()+a,c=!1;b>(new Date).getTime();)if(!this._drawNext()){c=!0;break}if(c)this._endBuild();else{var d=this;this._timerID=setTimeout(function(){d._run()},50-a)}var e=this.progress=this._index/this._frames.length;if(this.hasEventListener("progress")){var f=new createjs.Event("progress");f.progress=e,this.dispatchEvent(f)}},b._drawNext=function(){var a=this._frames[this._index],b=a.scale*this._scale,c=a.rect,d=a.sourceRect,e=this._data.images[a.img],f=e.getContext("2d");return a.funct&&a.funct.apply(a.scope,a.params),f.save(),f.beginPath(),f.rect(c.x,c.y,c.width,c.height),f.clip(),f.translate(Math.ceil(c.x-d.x*b),Math.ceil(c.y-d.y*b)),f.scale(b,b),a.source.draw(f),f.restore(),++this._index<this._frames.length},createjs.SpriteSheetBuilder=a}(),this.createjs=this.createjs||{},function(){"use strict";var a=function(a){this.initialize(a)},b=a.prototype=new createjs.DisplayObject;b.htmlElement=null,b._oldMtx=null,b._visible=!1,b.DisplayObject_initialize=b.initialize,b.initialize=function(a){"string"==typeof a&&(a=document.getElementById(a)),this.DisplayObject_initialize(),this.mouseEnabled=!1,this.htmlElement=a;
var b=a.style;b.position="absolute",b.transformOrigin=b.WebkitTransformOrigin=b.msTransformOrigin=b.MozTransformOrigin=b.OTransformOrigin="0% 0%"},b.isVisible=function(){return null!=this.htmlElement},b.draw=function(){return this.visible&&(this._visible=!0),!0},b.cache=function(){},b.uncache=function(){},b.updateCache=function(){},b.hitTest=function(){},b.localToGlobal=function(){},b.globalToLocal=function(){},b.localToLocal=function(){},b.clone=function(){throw"DOMElement cannot be cloned."},b.toString=function(){return"[DOMElement (name="+this.name+")]"},b.DisplayObject__tick=b._tick,b._tick=function(a){var b=this.getStage();this._visible=!1,b&&b.on("drawend",this._handleDrawEnd,this,!0),this.DisplayObject__tick(a)},b._handleDrawEnd=function(){var a=this.htmlElement;if(a){var b=a.style,c=this._visible?"visible":"hidden";if(c!=b.visibility&&(b.visibility=c),this._visible){var d=this.getConcatenatedMatrix(this._matrix),e=this._oldMtx,f=1e4;if(e&&e.alpha==d.alpha||(b.opacity=""+(0|d.alpha*f)/f,e&&(e.alpha=d.alpha)),!e||e.tx!=d.tx||e.ty!=d.ty||e.a!=d.a||e.b!=d.b||e.c!=d.c||e.d!=d.d){var g="matrix("+(0|d.a*f)/f+","+(0|d.b*f)/f+","+(0|d.c*f)/f+","+(0|d.d*f)/f+","+(0|d.tx+.5);b.transform=b.WebkitTransform=b.OTransform=b.msTransform=g+","+(0|d.ty+.5)+")",b.MozTransform=g+"px,"+(0|d.ty+.5)+"px)",this._oldMtx=e?e.copy(d):d.clone()}}}},createjs.DOMElement=a}(),this.createjs=this.createjs||{},function(){"use strict";var a=function(){this.initialize()},b=a.prototype;b.initialize=function(){},b.getBounds=function(){return null},b.applyFilter=function(){},b.toString=function(){return"[Filter]"},b.clone=function(){return new a},createjs.Filter=a}(),this.createjs=this.createjs||{},function(){"use strict";var a=function(a,b,c){this.initialize(a,b,c)},b=a.prototype=new createjs.Filter;b.initialize=function(a,b,c){(isNaN(a)||0>a)&&(a=0),this.blurX=0|a,(isNaN(b)||0>b)&&(b=0),this.blurY=0|b,(isNaN(c)||1>c)&&(c=1),this.quality=0|c},b.blurX=0,b.blurY=0,b.quality=1,b.mul_table=[1,171,205,293,57,373,79,137,241,27,391,357,41,19,283,265,497,469,443,421,25,191,365,349,335,161,155,149,9,278,269,261,505,245,475,231,449,437,213,415,405,395,193,377,369,361,353,345,169,331,325,319,313,307,301,37,145,285,281,69,271,267,263,259,509,501,493,243,479,118,465,459,113,446,55,435,429,423,209,413,51,403,199,393,97,3,379,375,371,367,363,359,355,351,347,43,85,337,333,165,327,323,5,317,157,311,77,305,303,75,297,294,73,289,287,71,141,279,277,275,68,135,67,133,33,262,260,129,511,507,503,499,495,491,61,121,481,477,237,235,467,232,115,457,227,451,7,445,221,439,218,433,215,427,425,211,419,417,207,411,409,203,202,401,399,396,197,49,389,387,385,383,95,189,47,187,93,185,23,183,91,181,45,179,89,177,11,175,87,173,345,343,341,339,337,21,167,83,331,329,327,163,81,323,321,319,159,79,315,313,39,155,309,307,153,305,303,151,75,299,149,37,295,147,73,291,145,289,287,143,285,71,141,281,35,279,139,69,275,137,273,17,271,135,269,267,133,265,33,263,131,261,130,259,129,257,1],b.shg_table=[0,9,10,11,9,12,10,11,12,9,13,13,10,9,13,13,14,14,14,14,10,13,14,14,14,13,13,13,9,14,14,14,15,14,15,14,15,15,14,15,15,15,14,15,15,15,15,15,14,15,15,15,15,15,15,12,14,15,15,13,15,15,15,15,16,16,16,15,16,14,16,16,14,16,13,16,16,16,15,16,13,16,15,16,14,9,16,16,16,16,16,16,16,16,16,13,14,16,16,15,16,16,10,16,15,16,14,16,16,14,16,16,14,16,16,14,15,16,16,16,14,15,14,15,13,16,16,15,17,17,17,17,17,17,14,15,17,17,16,16,17,16,15,17,16,17,11,17,16,17,16,17,16,17,17,16,17,17,16,17,17,16,16,17,17,17,16,14,17,17,17,17,15,16,14,16,15,16,13,16,15,16,14,16,15,16,12,16,15,16,17,17,17,17,17,13,16,15,17,17,17,16,15,17,17,17,16,15,17,17,14,16,17,17,16,17,17,16,15,17,16,14,17,16,15,17,16,17,17,16,17,15,16,17,14,17,16,15,17,16,17,13,17,16,17,17,16,17,14,17,16,17,16,17,16,17,9],b.getBounds=function(){var a=.5*Math.pow(this.quality,.6);return new createjs.Rectangle(-this.blurX*a,-this.blurY*a,2*this.blurX*a,2*this.blurY*a)},b.applyFilter=function(a,b,c,d,e,f,g,h){f=f||a,null==g&&(g=b),null==h&&(h=c);try{var i=a.getImageData(b,c,d,e)}catch(j){return!1}var k=this.blurX/2;if(isNaN(k)||0>k)return!1;k|=0;var l=this.blurY/2;if(isNaN(l)||0>l)return!1;if(l|=0,0==k&&0==l)return!1;var m=this.quality;(isNaN(m)||1>m)&&(m=1),m|=0,m>3&&(m=3),1>m&&(m=1);var b,c,n,o,p,q,r,s,t,u,v,w,x,y,z,A=i.data,B=k+k+1,C=l+l+1,D=d-1,E=e-1,F=k+1,G=l+1,H={r:0,b:0,g:0,a:0,next:null},I=H;for(n=1;B>n;n++)I=I.next={r:0,b:0,g:0,a:0,next:null};I.next=H;var J={r:0,b:0,g:0,a:0,next:null},K=J;for(n=1;C>n;n++)K=K.next={r:0,b:0,g:0,a:0,next:null};K.next=J;for(var L=null;m-->0;){r=q=0;var M=this.mul_table[k],N=this.shg_table[k];for(c=e;--c>-1;){for(s=F*(w=A[q]),t=F*(x=A[q+1]),u=F*(y=A[q+2]),v=F*(z=A[q+3]),I=H,n=F;--n>-1;)I.r=w,I.g=x,I.b=y,I.a=z,I=I.next;for(n=1;F>n;n++)o=q+((n>D?D:n)<<2),s+=I.r=A[o],t+=I.g=A[o+1],u+=I.b=A[o+2],v+=I.a=A[o+3],I=I.next;for(L=H,b=0;d>b;b++)A[q++]=s*M>>>N,A[q++]=t*M>>>N,A[q++]=u*M>>>N,A[q++]=v*M>>>N,o=r+((o=b+k+1)<D?o:D)<<2,s-=L.r-(L.r=A[o]),t-=L.g-(L.g=A[o+1]),u-=L.b-(L.b=A[o+2]),v-=L.a-(L.a=A[o+3]),L=L.next;r+=d}for(M=this.mul_table[l],N=this.shg_table[l],b=0;d>b;b++){for(q=b<<2,s=G*(w=A[q]),t=G*(x=A[q+1]),u=G*(y=A[q+2]),v=G*(z=A[q+3]),K=J,n=0;G>n;n++)K.r=w,K.g=x,K.b=y,K.a=z,K=K.next;for(p=d,n=1;l>=n;n++)q=p+b<<2,s+=K.r=A[q],t+=K.g=A[q+1],u+=K.b=A[q+2],v+=K.a=A[q+3],K=K.next,E>n&&(p+=d);if(q=b,L=J,m>0)for(c=0;e>c;c++)o=q<<2,A[o+3]=z=v*M>>>N,z>0?(A[o]=s*M>>>N,A[o+1]=t*M>>>N,A[o+2]=u*M>>>N):A[o]=A[o+1]=A[o+2]=0,o=b+((o=c+G)<E?o:E)*d<<2,s-=L.r-(L.r=A[o]),t-=L.g-(L.g=A[o+1]),u-=L.b-(L.b=A[o+2]),v-=L.a-(L.a=A[o+3]),L=L.next,q+=d;else for(c=0;e>c;c++)o=q<<2,A[o+3]=z=v*M>>>N,z>0?(z=255/z,A[o]=(s*M>>>N)*z,A[o+1]=(t*M>>>N)*z,A[o+2]=(u*M>>>N)*z):A[o]=A[o+1]=A[o+2]=0,o=b+((o=c+G)<E?o:E)*d<<2,s-=L.r-(L.r=A[o]),t-=L.g-(L.g=A[o+1]),u-=L.b-(L.b=A[o+2]),v-=L.a-(L.a=A[o+3]),L=L.next,q+=d}}return f.putImageData(i,g,h),!0},b.clone=function(){return new a(this.blurX,this.blurY,this.quality)},b.toString=function(){return"[BlurFilter]"},createjs.BlurFilter=a}(),this.createjs=this.createjs||{},function(){"use strict";var a=function(a){this.initialize(a)},b=a.prototype=new createjs.Filter;b.initialize=function(a){this.alphaMap=a},b.alphaMap=null,b._alphaMap=null,b._mapData=null,b.applyFilter=function(a,b,c,d,e,f,g,h){if(!this.alphaMap)return!0;if(!this._prepAlphaMap())return!1;f=f||a,null==g&&(g=b),null==h&&(h=c);try{var i=a.getImageData(b,c,d,e)}catch(j){return!1}for(var k=i.data,l=this._mapData,m=k.length,n=0;m>n;n+=4)k[n+3]=l[n]||0;return f.putImageData(i,g,h),!0},b.clone=function(){return new a(this.alphaMap)},b.toString=function(){return"[AlphaMapFilter]"},b._prepAlphaMap=function(){if(!this.alphaMap)return!1;if(this.alphaMap==this._alphaMap&&this._mapData)return!0;this._mapData=null;var a,b=this._alphaMap=this.alphaMap,c=b;b instanceof HTMLCanvasElement?a=c.getContext("2d"):(c=createjs.createCanvas?createjs.createCanvas():document.createElement("canvas"),c.width=b.width,c.height=b.height,a=c.getContext("2d"),a.drawImage(b,0,0));try{var d=a.getImageData(0,0,b.width,b.height)}catch(e){return!1}return this._mapData=d.data,!0},createjs.AlphaMapFilter=a}(),this.createjs=this.createjs||{},function(){"use strict";var a=function(a){this.initialize(a)},b=a.prototype=new createjs.Filter;b.initialize=function(a){this.mask=a},b.mask=null,b.applyFilter=function(a,b,c,d,e,f,g,h){return this.mask?(f=f||a,null==g&&(g=b),null==h&&(h=c),f.save(),f.globalCompositeOperation="destination-in",f.drawImage(this.mask,g,h),f.restore(),!0):!0},b.clone=function(){return new a(this.mask)},b.toString=function(){return"[AlphaMaskFilter]"},createjs.AlphaMaskFilter=a}(),this.createjs=this.createjs||{},function(){"use strict";var a=function(a,b,c,d,e,f,g,h){this.initialize(a,b,c,d,e,f,g,h)},b=a.prototype=new createjs.Filter;b.redMultiplier=1,b.greenMultiplier=1,b.blueMultiplier=1,b.alphaMultiplier=1,b.redOffset=0,b.greenOffset=0,b.blueOffset=0,b.alphaOffset=0,b.initialize=function(a,b,c,d,e,f,g,h){this.redMultiplier=null!=a?a:1,this.greenMultiplier=null!=b?b:1,this.blueMultiplier=null!=c?c:1,this.alphaMultiplier=null!=d?d:1,this.redOffset=e||0,this.greenOffset=f||0,this.blueOffset=g||0,this.alphaOffset=h||0},b.applyFilter=function(a,b,c,d,e,f,g,h){f=f||a,null==g&&(g=b),null==h&&(h=c);try{var i=a.getImageData(b,c,d,e)}catch(j){return!1}for(var k=i.data,l=k.length,m=0;l>m;m+=4)k[m]=k[m]*this.redMultiplier+this.redOffset,k[m+1]=k[m+1]*this.greenMultiplier+this.greenOffset,k[m+2]=k[m+2]*this.blueMultiplier+this.blueOffset,k[m+3]=k[m+3]*this.alphaMultiplier+this.alphaOffset;return f.putImageData(i,g,h),!0},b.toString=function(){return"[ColorFilter]"},b.clone=function(){return new a(this.redMultiplier,this.greenMultiplier,this.blueMultiplier,this.alphaMultiplier,this.redOffset,this.greenOffset,this.blueOffset,this.alphaOffset)},createjs.ColorFilter=a}(),this.createjs=this.createjs||{},function(){"use strict";var a=function(a,b,c,d){this.initialize(a,b,c,d)},b=a.prototype;a.DELTA_INDEX=[0,.01,.02,.04,.05,.06,.07,.08,.1,.11,.12,.14,.15,.16,.17,.18,.2,.21,.22,.24,.25,.27,.28,.3,.32,.34,.36,.38,.4,.42,.44,.46,.48,.5,.53,.56,.59,.62,.65,.68,.71,.74,.77,.8,.83,.86,.89,.92,.95,.98,1,1.06,1.12,1.18,1.24,1.3,1.36,1.42,1.48,1.54,1.6,1.66,1.72,1.78,1.84,1.9,1.96,2,2.12,2.25,2.37,2.5,2.62,2.75,2.87,3,3.2,3.4,3.6,3.8,4,4.3,4.7,4.9,5,5.5,6,6.5,6.8,7,7.3,7.5,7.8,8,8.4,8.7,9,9.4,9.6,9.8,10],a.IDENTITY_MATRIX=[1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1],a.LENGTH=a.IDENTITY_MATRIX.length,b.initialize=function(a,b,c,d){return this.reset(),this.adjustColor(a,b,c,d),this},b.reset=function(){return this.copyMatrix(a.IDENTITY_MATRIX)},b.adjustColor=function(a,b,c,d){return this.adjustHue(d),this.adjustContrast(b),this.adjustBrightness(a),this.adjustSaturation(c)},b.adjustBrightness=function(a){return 0==a||isNaN(a)?this:(a=this._cleanValue(a,255),this._multiplyMatrix([1,0,0,0,a,0,1,0,0,a,0,0,1,0,a,0,0,0,1,0,0,0,0,0,1]),this)},b.adjustContrast=function(b){if(0==b||isNaN(b))return this;b=this._cleanValue(b,100);var c;return 0>b?c=127+127*(b/100):(c=b%1,c=0==c?a.DELTA_INDEX[b]:a.DELTA_INDEX[b<<0]*(1-c)+a.DELTA_INDEX[(b<<0)+1]*c,c=127*c+127),this._multiplyMatrix([c/127,0,0,0,.5*(127-c),0,c/127,0,0,.5*(127-c),0,0,c/127,0,.5*(127-c),0,0,0,1,0,0,0,0,0,1]),this},b.adjustSaturation=function(a){if(0==a||isNaN(a))return this;a=this._cleanValue(a,100);var b=1+(a>0?3*a/100:a/100),c=.3086,d=.6094,e=.082;return this._multiplyMatrix([c*(1-b)+b,d*(1-b),e*(1-b),0,0,c*(1-b),d*(1-b)+b,e*(1-b),0,0,c*(1-b),d*(1-b),e*(1-b)+b,0,0,0,0,0,1,0,0,0,0,0,1]),this},b.adjustHue=function(a){if(0==a||isNaN(a))return this;a=this._cleanValue(a,180)/180*Math.PI;var b=Math.cos(a),c=Math.sin(a),d=.213,e=.715,f=.072;return this._multiplyMatrix([d+b*(1-d)+c*-d,e+b*-e+c*-e,f+b*-f+c*(1-f),0,0,d+b*-d+.143*c,e+b*(1-e)+.14*c,f+b*-f+c*-.283,0,0,d+b*-d+c*-(1-d),e+b*-e+c*e,f+b*(1-f)+c*f,0,0,0,0,0,1,0,0,0,0,0,1]),this},b.concat=function(b){return b=this._fixMatrix(b),b.length!=a.LENGTH?this:(this._multiplyMatrix(b),this)},b.clone=function(){return(new a).copyMatrix(this)},b.toArray=function(){for(var b=[],c=0,d=a.LENGTH;d>c;c++)b[c]=this[c];return b},b.copyMatrix=function(b){for(var c=a.LENGTH,d=0;c>d;d++)this[d]=b[d];return this},b.toString=function(){return"[ColorMatrix]"},b._multiplyMatrix=function(a){for(var b=[],c=0;5>c;c++){for(var d=0;5>d;d++)b[d]=this[d+5*c];for(var d=0;5>d;d++){for(var e=0,f=0;5>f;f++)e+=a[d+5*f]*b[f];this[d+5*c]=e}}},b._cleanValue=function(a,b){return Math.min(b,Math.max(-b,a))},b._fixMatrix=function(b){return b instanceof a&&(b=b.toArray()),b.length<a.LENGTH?b=b.slice(0,b.length).concat(a.IDENTITY_MATRIX.slice(b.length,a.LENGTH)):b.length>a.LENGTH&&(b=b.slice(0,a.LENGTH)),b},createjs.ColorMatrix=a}(),this.createjs=this.createjs||{},function(){"use strict";var a=function(a){this.initialize(a)},b=a.prototype=new createjs.Filter;b.matrix=null,b.initialize=function(a){this.matrix=a},b.applyFilter=function(a,b,c,d,e,f,g,h){f=f||a,null==g&&(g=b),null==h&&(h=c);try{var i=a.getImageData(b,c,d,e)}catch(j){return!1}for(var k,l,m,n,o=i.data,p=o.length,q=this.matrix,r=q[0],s=q[1],t=q[2],u=q[3],v=q[4],w=q[5],x=q[6],y=q[7],z=q[8],A=q[9],B=q[10],C=q[11],D=q[12],E=q[13],F=q[14],G=q[15],H=q[16],I=q[17],J=q[18],K=q[19],L=0;p>L;L+=4)k=o[L],l=o[L+1],m=o[L+2],n=o[L+3],o[L]=k*r+l*s+m*t+n*u+v,o[L+1]=k*w+l*x+m*y+n*z+A,o[L+2]=k*B+l*C+m*D+n*E+F,o[L+3]=k*G+l*H+m*I+n*J+K;return f.putImageData(i,g,h),!0},b.toString=function(){return"[ColorMatrixFilter]"},b.clone=function(){return new a(this.matrix)},createjs.ColorMatrixFilter=a}(),this.createjs=this.createjs||{},function(){"use strict";var a=function(){throw"Touch cannot be instantiated"};a.isSupported=function(){return"ontouchstart"in window||window.navigator.msPointerEnabled&&window.navigator.msMaxTouchPoints>0||window.navigator.pointerEnabled&&window.navigator.maxTouchPoints>0},a.enable=function(b,c,d){return b&&b.canvas&&a.isSupported()?(b.__touch={pointers:{},multitouch:!c,preventDefault:!d,count:0},"ontouchstart"in window?a._IOS_enable(b):(window.navigator.msPointerEnabled||window.navigator.pointerEnabled)&&a._IE_enable(b),!0):!1},a.disable=function(b){b&&("ontouchstart"in window?a._IOS_disable(b):(window.navigator.msPointerEnabled||window.navigator.pointerEnabled)&&a._IE_disable(b))},a._IOS_enable=function(b){var c=b.canvas,d=b.__touch.f=function(c){a._IOS_handleEvent(b,c)};c.addEventListener("touchstart",d,!1),c.addEventListener("touchmove",d,!1),c.addEventListener("touchend",d,!1),c.addEventListener("touchcancel",d,!1)},a._IOS_disable=function(a){var b=a.canvas;if(b){var c=a.__touch.f;b.removeEventListener("touchstart",c,!1),b.removeEventListener("touchmove",c,!1),b.removeEventListener("touchend",c,!1),b.removeEventListener("touchcancel",c,!1)}},a._IOS_handleEvent=function(a,b){if(a){a.__touch.preventDefault&&b.preventDefault&&b.preventDefault();for(var c=b.changedTouches,d=b.type,e=0,f=c.length;f>e;e++){var g=c[e],h=g.identifier;g.target==a.canvas&&("touchstart"==d?this._handleStart(a,h,b,g.pageX,g.pageY):"touchmove"==d?this._handleMove(a,h,b,g.pageX,g.pageY):("touchend"==d||"touchcancel"==d)&&this._handleEnd(a,h,b))}}},a._IE_enable=function(b){var c=b.canvas,d=b.__touch.f=function(c){a._IE_handleEvent(b,c)};void 0===window.navigator.pointerEnabled?(c.addEventListener("MSPointerDown",d,!1),window.addEventListener("MSPointerMove",d,!1),window.addEventListener("MSPointerUp",d,!1),window.addEventListener("MSPointerCancel",d,!1),b.__touch.preventDefault&&(c.style.msTouchAction="none")):(c.addEventListener("pointerdown",d,!1),window.addEventListener("pointermove",d,!1),window.addEventListener("pointerup",d,!1),window.addEventListener("pointercancel",d,!1),b.__touch.preventDefault&&(c.style.touchAction="none")),b.__touch.activeIDs={}},a._IE_disable=function(a){var b=a.__touch.f;void 0===window.navigator.pointerEnabled?(window.removeEventListener("MSPointerMove",b,!1),window.removeEventListener("MSPointerUp",b,!1),window.removeEventListener("MSPointerCancel",b,!1),a.canvas&&a.canvas.removeEventListener("MSPointerDown",b,!1)):(window.removeEventListener("pointermove",b,!1),window.removeEventListener("pointerup",b,!1),window.removeEventListener("pointercancel",b,!1),a.canvas&&a.canvas.removeEventListener("pointerdown",b,!1))},a._IE_handleEvent=function(a,b){if(a){a.__touch.preventDefault&&b.preventDefault&&b.preventDefault();var c=b.type,d=b.pointerId,e=a.__touch.activeIDs;if("MSPointerDown"==c||"pointerdown"==c){if(b.srcElement!=a.canvas)return;e[d]=!0,this._handleStart(a,d,b,b.pageX,b.pageY)}else e[d]&&("MSPointerMove"==c||"pointermove"==c?this._handleMove(a,d,b,b.pageX,b.pageY):("MSPointerUp"==c||"MSPointerCancel"==c||"pointerup"==c||"pointercancel"==c)&&(delete e[d],this._handleEnd(a,d,b)))}},a._handleStart=function(a,b,c,d,e){var f=a.__touch;if(f.multitouch||!f.count){var g=f.pointers;g[b]||(g[b]=!0,f.count++,a._handlePointerDown(b,c,d,e))}},a._handleMove=function(a,b,c,d,e){a.__touch.pointers[b]&&a._handlePointerMove(b,c,d,e)},a._handleEnd=function(a,b,c){var d=a.__touch,e=d.pointers;e[b]&&(d.count--,a._handlePointerUp(b,c,!0),delete e[b])},createjs.Touch=a}(),this.createjs=this.createjs||{},function(){"use strict";var a=createjs.EaselJS=createjs.EaselJS||{};a.version="0.7.1",a.buildDate="Thu, 12 Dec 2013 23:33:39 GMT"}();;/*!
* @license TweenJS
* Visit http://createjs.com/ for documentation, updates and examples.
*
* Copyright (c) 2011-2013 gskinner.com, inc.
*
* Distributed under the terms of the MIT license.
* http://www.opensource.org/licenses/mit-license.html
*
* This notice shall be included in all copies or substantial portions of the Software.
*/

/**!
 * SoundJS FlashPlugin also includes swfobject (http://code.google.com/p/swfobject/)
 */

this.createjs=this.createjs||{},function(){"use strict";var a=function(a,b,c){this.initialize(a,b,c)},b=a.prototype;b.type=null,b.target=null,b.currentTarget=null,b.eventPhase=0,b.bubbles=!1,b.cancelable=!1,b.timeStamp=0,b.defaultPrevented=!1,b.propagationStopped=!1,b.immediatePropagationStopped=!1,b.removed=!1,b.initialize=function(a,b,c){this.type=a,this.bubbles=b,this.cancelable=c,this.timeStamp=(new Date).getTime()},b.preventDefault=function(){this.defaultPrevented=!0},b.stopPropagation=function(){this.propagationStopped=!0},b.stopImmediatePropagation=function(){this.immediatePropagationStopped=this.propagationStopped=!0},b.remove=function(){this.removed=!0},b.clone=function(){return new a(this.type,this.bubbles,this.cancelable)},b.toString=function(){return"[Event (type="+this.type+")]"},createjs.Event=a}(),this.createjs=this.createjs||{},function(){"use strict";var a=function(){},b=a.prototype;a.initialize=function(a){a.addEventListener=b.addEventListener,a.on=b.on,a.removeEventListener=a.off=b.removeEventListener,a.removeAllEventListeners=b.removeAllEventListeners,a.hasEventListener=b.hasEventListener,a.dispatchEvent=b.dispatchEvent,a._dispatchEvent=b._dispatchEvent,a.willTrigger=b.willTrigger},b._listeners=null,b._captureListeners=null,b.initialize=function(){},b.addEventListener=function(a,b,c){var d;d=c?this._captureListeners=this._captureListeners||{}:this._listeners=this._listeners||{};var e=d[a];return e&&this.removeEventListener(a,b,c),e=d[a],e?e.push(b):d[a]=[b],b},b.on=function(a,b,c,d,e,f){return b.handleEvent&&(c=c||b,b=b.handleEvent),c=c||this,this.addEventListener(a,function(a){b.call(c,a,e),d&&a.remove()},f)},b.removeEventListener=function(a,b,c){var d=c?this._captureListeners:this._listeners;if(d){var e=d[a];if(e)for(var f=0,g=e.length;g>f;f++)if(e[f]==b){1==g?delete d[a]:e.splice(f,1);break}}},b.off=b.removeEventListener,b.removeAllEventListeners=function(a){a?(this._listeners&&delete this._listeners[a],this._captureListeners&&delete this._captureListeners[a]):this._listeners=this._captureListeners=null},b.dispatchEvent=function(a,b){if("string"==typeof a){var c=this._listeners;if(!c||!c[a])return!1;a=new createjs.Event(a)}if(a.target=b||this,a.bubbles&&this.parent){for(var d=this,e=[d];d.parent;)e.push(d=d.parent);var f,g=e.length;for(f=g-1;f>=0&&!a.propagationStopped;f--)e[f]._dispatchEvent(a,1+(0==f));for(f=1;g>f&&!a.propagationStopped;f++)e[f]._dispatchEvent(a,3)}else this._dispatchEvent(a,2);return a.defaultPrevented},b.hasEventListener=function(a){var b=this._listeners,c=this._captureListeners;return!!(b&&b[a]||c&&c[a])},b.willTrigger=function(a){for(var b=this;b;){if(b.hasEventListener(a))return!0;b=b.parent}return!1},b.toString=function(){return"[EventDispatcher]"},b._dispatchEvent=function(a,b){var c,d=1==b?this._captureListeners:this._listeners;if(a&&d){var e=d[a.type];if(!e||!(c=e.length))return;a.currentTarget=this,a.eventPhase=b,a.removed=!1,e=e.slice();for(var f=0;c>f&&!a.immediatePropagationStopped;f++){var g=e[f];g.handleEvent?g.handleEvent(a):g(a),a.removed&&(this.off(a.type,g,1==b),a.removed=!1)}}},createjs.EventDispatcher=a}(),this.createjs=this.createjs||{},function(){"use strict";var a=function(a,b,c){this.initialize(a,b,c)},b=a.prototype=new createjs.EventDispatcher;a.NONE=0,a.LOOP=1,a.REVERSE=2,a.IGNORE={},a._tweens=[],a._plugins={},a.get=function(b,c,d,e){return e&&a.removeTweens(b),new a(b,c,d)},a.tick=function(b,c){for(var d=a._tweens.slice(),e=d.length-1;e>=0;e--){var f=d[e];c&&!f.ignoreGlobalPause||f._paused||f.tick(f._useTicks?1:b)}},a.handleEvent=function(a){"tick"==a.type&&this.tick(a.delta,a.paused)},a.removeTweens=function(b){if(b.tweenjs_count){for(var c=a._tweens,d=c.length-1;d>=0;d--)c[d]._target==b&&(c[d]._paused=!0,c.splice(d,1));b.tweenjs_count=0}},a.removeAllTweens=function(){for(var b=a._tweens,c=0,d=b.length;d>c;c++){var e=b[c];e.paused=!0,e.target.tweenjs_count=0}b.length=0},a.hasActiveTweens=function(b){return b?b.tweenjs_count:a._tweens&&!!a._tweens.length},a.installPlugin=function(b,c){var d=b.priority;null==d&&(b.priority=d=0);for(var e=0,f=c.length,g=a._plugins;f>e;e++){var h=c[e];if(g[h]){for(var i=g[h],j=0,k=i.length;k>j&&!(d<i[j].priority);j++);g[h].splice(j,0,b)}else g[h]=[b]}},a._register=function(b,c){var d=b._target,e=a._tweens;if(c)d&&(d.tweenjs_count=d.tweenjs_count?d.tweenjs_count+1:1),e.push(b),!a._inited&&createjs.Ticker&&(createjs.Ticker.addEventListener("tick",a),a._inited=!0);else{d&&d.tweenjs_count--;for(var f=e.length;f--;)if(e[f]==b)return e.splice(f,1),void 0}},b.ignoreGlobalPause=!1,b.loop=!1,b.duration=0,b.pluginData=null,b.target=null,b.position=null,b.passive=!1,b._paused=!1,b._curQueueProps=null,b._initQueueProps=null,b._steps=null,b._actions=null,b._prevPosition=0,b._stepPosition=0,b._prevPos=-1,b._target=null,b._useTicks=!1,b._inited=!1,b.initialize=function(b,c,d){this.target=this._target=b,c&&(this._useTicks=c.useTicks,this.ignoreGlobalPause=c.ignoreGlobalPause,this.loop=c.loop,c.onChange&&this.addEventListener("change",c.onChange),c.override&&a.removeTweens(b)),this.pluginData=d||{},this._curQueueProps={},this._initQueueProps={},this._steps=[],this._actions=[],c&&c.paused?this._paused=!0:a._register(this,!0),c&&null!=c.position&&this.setPosition(c.position,a.NONE)},b.wait=function(a,b){if(null==a||0>=a)return this;var c=this._cloneProps(this._curQueueProps);return this._addStep({d:a,p0:c,e:this._linearEase,p1:c,v:b})},b.to=function(a,b,c){return(isNaN(b)||0>b)&&(b=0),this._addStep({d:b||0,p0:this._cloneProps(this._curQueueProps),e:c,p1:this._cloneProps(this._appendQueueProps(a))})},b.call=function(a,b,c){return this._addAction({f:a,p:b?b:[this],o:c?c:this._target})},b.set=function(a,b){return this._addAction({f:this._set,o:this,p:[a,b?b:this._target]})},b.play=function(a){return a||(a=this),this.call(a.setPaused,[!1],a)},b.pause=function(a){return a||(a=this),this.call(a.setPaused,[!0],a)},b.setPosition=function(a,b){0>a&&(a=0),null==b&&(b=1);var c=a,d=!1;if(c>=this.duration&&(this.loop?c%=this.duration:(c=this.duration,d=!0)),c==this._prevPos)return d;var e=this._prevPos;if(this.position=this._prevPos=c,this._prevPosition=a,this._target)if(d)this._updateTargetProps(null,1);else if(this._steps.length>0){for(var f=0,g=this._steps.length;g>f&&!(this._steps[f].t>c);f++);var h=this._steps[f-1];this._updateTargetProps(h,(this._stepPosition=c-h.t)/h.d)}return 0!=b&&this._actions.length>0&&(this._useTicks?this._runActions(c,c):1==b&&e>c?(e!=this.duration&&this._runActions(e,this.duration),this._runActions(0,c,!0)):this._runActions(e,c)),d&&this.setPaused(!0),this.dispatchEvent("change"),d},b.tick=function(a){this._paused||this.setPosition(this._prevPosition+a)},b.setPaused=function(b){return this._paused=!!b,a._register(this,!b),this},b.w=b.wait,b.t=b.to,b.c=b.call,b.s=b.set,b.toString=function(){return"[Tween]"},b.clone=function(){throw"Tween can not be cloned."},b._updateTargetProps=function(b,c){var d,e,f,g,h,i;if(b||1!=c){if(this.passive=!!b.v,this.passive)return;b.e&&(c=b.e(c,0,1,1)),d=b.p0,e=b.p1}else this.passive=!1,d=e=this._curQueueProps;for(var j in this._initQueueProps){null==(g=d[j])&&(d[j]=g=this._initQueueProps[j]),null==(h=e[j])&&(e[j]=h=g),f=g==h||0==c||1==c||"number"!=typeof g?1==c?h:g:g+(h-g)*c;var k=!1;if(i=a._plugins[j])for(var l=0,m=i.length;m>l;l++){var n=i[l].tween(this,j,f,d,e,c,!!b&&d==e,!b);n==a.IGNORE?k=!0:f=n}k||(this._target[j]=f)}},b._runActions=function(a,b,c){var d=a,e=b,f=-1,g=this._actions.length,h=1;for(a>b&&(d=b,e=a,f=g,g=h=-1);(f+=h)!=g;){var i=this._actions[f],j=i.t;(j==e||j>d&&e>j||c&&j==a)&&i.f.apply(i.o,i.p)}},b._appendQueueProps=function(b){var c,d,e,f,g;for(var h in b)if(void 0===this._initQueueProps[h]){if(d=this._target[h],c=a._plugins[h])for(e=0,f=c.length;f>e;e++)d=c[e].init(this,h,d);this._initQueueProps[h]=this._curQueueProps[h]=void 0===d?null:d}else d=this._curQueueProps[h];for(var h in b){if(d=this._curQueueProps[h],c=a._plugins[h])for(g=g||{},e=0,f=c.length;f>e;e++)c[e].step&&c[e].step(this,h,d,b[h],g);this._curQueueProps[h]=b[h]}return g&&this._appendQueueProps(g),this._curQueueProps},b._cloneProps=function(a){var b={};for(var c in a)b[c]=a[c];return b},b._addStep=function(a){return a.d>0&&(this._steps.push(a),a.t=this.duration,this.duration+=a.d),this},b._addAction=function(a){return a.t=this.duration,this._actions.push(a),this},b._set=function(a,b){for(var c in a)b[c]=a[c]},createjs.Tween=a}(),this.createjs=this.createjs||{},function(){"use strict";var a=function(a,b,c){this.initialize(a,b,c)},b=a.prototype=new createjs.EventDispatcher;b.ignoreGlobalPause=!1,b.duration=0,b.loop=!1,b.position=null,b._paused=!1,b._tweens=null,b._labels=null,b._labelList=null,b._prevPosition=0,b._prevPos=-1,b._useTicks=!1,b.initialize=function(a,b,c){this._tweens=[],c&&(this._useTicks=c.useTicks,this.loop=c.loop,this.ignoreGlobalPause=c.ignoreGlobalPause,c.onChange&&this.addEventListener("change",c.onChange)),a&&this.addTween.apply(this,a),this.setLabels(b),c&&c.paused?this._paused=!0:createjs.Tween._register(this,!0),c&&null!=c.position&&this.setPosition(c.position,createjs.Tween.NONE)},b.addTween=function(a){var b=arguments.length;if(b>1){for(var c=0;b>c;c++)this.addTween(arguments[c]);return arguments[0]}return 0==b?null:(this.removeTween(a),this._tweens.push(a),a.setPaused(!0),a._paused=!1,a._useTicks=this._useTicks,a.duration>this.duration&&(this.duration=a.duration),this._prevPos>=0&&a.setPosition(this._prevPos,createjs.Tween.NONE),a)},b.removeTween=function(a){var b=arguments.length;if(b>1){for(var c=!0,d=0;b>d;d++)c=c&&this.removeTween(arguments[d]);return c}if(0==b)return!1;for(var e=this._tweens,d=e.length;d--;)if(e[d]==a)return e.splice(d,1),a.duration>=this.duration&&this.updateDuration(),!0;return!1},b.addLabel=function(a,b){this._labels[a]=b;var c=this._labelList;if(c){for(var d=0,e=c.length;e>d&&!(b<c[d].position);d++);c.splice(d,0,{label:a,position:b})}},b.setLabels=function(a){this._labels=a?a:{}},b.getLabels=function(){var a=this._labelList;if(!a){a=this._labelList=[];var b=this._labels;for(var c in b)a.push({label:c,position:b[c]});a.sort(function(a,b){return a.position-b.position})}return a},b.getCurrentLabel=function(){var a=this.getLabels(),b=this.position,c=a.length;if(c){for(var d=0;c>d&&!(b<a[d].position);d++);return 0==d?null:a[d-1].label}return null},b.gotoAndPlay=function(a){this.setPaused(!1),this._goto(a)},b.gotoAndStop=function(a){this.setPaused(!0),this._goto(a)},b.setPosition=function(a,b){0>a&&(a=0);var c=this.loop?a%this.duration:a,d=!this.loop&&a>=this.duration;if(c==this._prevPos)return d;this._prevPosition=a,this.position=this._prevPos=c;for(var e=0,f=this._tweens.length;f>e;e++)if(this._tweens[e].setPosition(c,b),c!=this._prevPos)return!1;return d&&this.setPaused(!0),this.dispatchEvent("change"),d},b.setPaused=function(a){this._paused=!!a,createjs.Tween._register(this,!a)},b.updateDuration=function(){this.duration=0;for(var a=0,b=this._tweens.length;b>a;a++){var c=this._tweens[a];c.duration>this.duration&&(this.duration=c.duration)}},b.tick=function(a){this.setPosition(this._prevPosition+a)},b.resolve=function(a){var b=parseFloat(a);return isNaN(b)&&(b=this._labels[a]),b},b.toString=function(){return"[Timeline]"},b.clone=function(){throw"Timeline can not be cloned."},b._goto=function(a){var b=this.resolve(a);null!=b&&this.setPosition(b)},createjs.Timeline=a}(),this.createjs=this.createjs||{},function(){"use strict";var a=function(){throw"Ease cannot be instantiated."};a.linear=function(a){return a},a.none=a.linear,a.get=function(a){return-1>a&&(a=-1),a>1&&(a=1),function(b){return 0==a?b:0>a?b*(b*-a+1+a):b*((2-b)*a+(1-a))}},a.getPowIn=function(a){return function(b){return Math.pow(b,a)}},a.getPowOut=function(a){return function(b){return 1-Math.pow(1-b,a)}},a.getPowInOut=function(a){return function(b){return(b*=2)<1?.5*Math.pow(b,a):1-.5*Math.abs(Math.pow(2-b,a))}},a.quadIn=a.getPowIn(2),a.quadOut=a.getPowOut(2),a.quadInOut=a.getPowInOut(2),a.cubicIn=a.getPowIn(3),a.cubicOut=a.getPowOut(3),a.cubicInOut=a.getPowInOut(3),a.quartIn=a.getPowIn(4),a.quartOut=a.getPowOut(4),a.quartInOut=a.getPowInOut(4),a.quintIn=a.getPowIn(5),a.quintOut=a.getPowOut(5),a.quintInOut=a.getPowInOut(5),a.sineIn=function(a){return 1-Math.cos(a*Math.PI/2)},a.sineOut=function(a){return Math.sin(a*Math.PI/2)},a.sineInOut=function(a){return-.5*(Math.cos(Math.PI*a)-1)},a.getBackIn=function(a){return function(b){return b*b*((a+1)*b-a)}},a.backIn=a.getBackIn(1.7),a.getBackOut=function(a){return function(b){return--b*b*((a+1)*b+a)+1}},a.backOut=a.getBackOut(1.7),a.getBackInOut=function(a){return a*=1.525,function(b){return(b*=2)<1?.5*b*b*((a+1)*b-a):.5*((b-=2)*b*((a+1)*b+a)+2)}},a.backInOut=a.getBackInOut(1.7),a.circIn=function(a){return-(Math.sqrt(1-a*a)-1)},a.circOut=function(a){return Math.sqrt(1- --a*a)},a.circInOut=function(a){return(a*=2)<1?-.5*(Math.sqrt(1-a*a)-1):.5*(Math.sqrt(1-(a-=2)*a)+1)},a.bounceIn=function(b){return 1-a.bounceOut(1-b)},a.bounceOut=function(a){return 1/2.75>a?7.5625*a*a:2/2.75>a?7.5625*(a-=1.5/2.75)*a+.75:2.5/2.75>a?7.5625*(a-=2.25/2.75)*a+.9375:7.5625*(a-=2.625/2.75)*a+.984375},a.bounceInOut=function(b){return.5>b?.5*a.bounceIn(2*b):.5*a.bounceOut(2*b-1)+.5},a.getElasticIn=function(a,b){var c=2*Math.PI;return function(d){if(0==d||1==d)return d;var e=b/c*Math.asin(1/a);return-(a*Math.pow(2,10*(d-=1))*Math.sin((d-e)*c/b))}},a.elasticIn=a.getElasticIn(1,.3),a.getElasticOut=function(a,b){var c=2*Math.PI;return function(d){if(0==d||1==d)return d;var e=b/c*Math.asin(1/a);return a*Math.pow(2,-10*d)*Math.sin((d-e)*c/b)+1}},a.elasticOut=a.getElasticOut(1,.3),a.getElasticInOut=function(a,b){var c=2*Math.PI;return function(d){var e=b/c*Math.asin(1/a);return(d*=2)<1?-.5*a*Math.pow(2,10*(d-=1))*Math.sin((d-e)*c/b):.5*a*Math.pow(2,-10*(d-=1))*Math.sin((d-e)*c/b)+1}},a.elasticInOut=a.getElasticInOut(1,.3*1.5),createjs.Ease=a}(),this.createjs=this.createjs||{},function(){"use strict";var a=function(){throw"MotionGuidePlugin cannot be instantiated."};a.priority=0,a._rotOffS,a._rotOffE,a._rotNormS,a._rotNormE,a.install=function(){return createjs.Tween.installPlugin(a,["guide","x","y","rotation"]),createjs.Tween.IGNORE},a.init=function(a,b,c){var d=a.target;return d.hasOwnProperty("x")||(d.x=0),d.hasOwnProperty("y")||(d.y=0),d.hasOwnProperty("rotation")||(d.rotation=0),"rotation"==b&&(a.__needsRot=!0),"guide"==b?null:c},a.step=function(b,c,d,e,f){if("rotation"==c&&(b.__rotGlobalS=d,b.__rotGlobalE=e,a.testRotData(b,f)),"guide"!=c)return e;var g,h=e;h.hasOwnProperty("path")||(h.path=[]);var i=h.path;if(h.hasOwnProperty("end")||(h.end=1),h.hasOwnProperty("start")||(h.start=d&&d.hasOwnProperty("end")&&d.path===i?d.end:0),h.hasOwnProperty("_segments")&&h._length)return e;var j=i.length,k=10;if(!(j>=6&&0==(j-2)%4))throw"invalid 'path' data, please see documentation for valid paths";h._segments=[],h._length=0;for(var l=2;j>l;l+=4){for(var m,n,o=i[l-2],p=i[l-1],q=i[l+0],r=i[l+1],s=i[l+2],t=i[l+3],u=o,v=p,w=0,x=[],y=1;k>=y;y++){var z=y/k,A=1-z;m=A*A*o+2*A*z*q+z*z*s,n=A*A*p+2*A*z*r+z*z*t,w+=x[x.push(Math.sqrt((g=m-u)*g+(g=n-v)*g))-1],u=m,v=n}h._segments.push(w),h._segments.push(x),h._length+=w}g=h.orient,h.orient=!0;var B={};return a.calc(h,h.start,B),b.__rotPathS=Number(B.rotation.toFixed(5)),a.calc(h,h.end,B),b.__rotPathE=Number(B.rotation.toFixed(5)),h.orient=!1,a.calc(h,h.end,f),h.orient=g,h.orient?(b.__guideData=h,a.testRotData(b,f),e):e},a.testRotData=function(a,b){if(void 0===a.__rotGlobalS||void 0===a.__rotGlobalE){if(a.__needsRot)return;a.__rotGlobalS=a.__rotGlobalE=void 0!==a._curQueueProps.rotation?a._curQueueProps.rotation:b.rotation=a.target.rotation||0}if(void 0!==a.__guideData){var c=a.__guideData,d=a.__rotGlobalE-a.__rotGlobalS,e=a.__rotPathE-a.__rotPathS,f=d-e;if("auto"==c.orient)f>180?f-=360:-180>f&&(f+=360);else if("cw"==c.orient){for(;0>f;)f+=360;0==f&&d>0&&180!=d&&(f+=360)}else if("ccw"==c.orient){for(f=d-(e>180?360-e:e);f>0;)f-=360;0==f&&0>d&&-180!=d&&(f-=360)}c.rotDelta=f,c.rotOffS=a.__rotGlobalS-a.__rotPathS,a.__rotGlobalS=a.__rotGlobalE=a.__guideData=a.__needsRot=void 0}},a.tween=function(b,c,d,e,f,g,h){var i=f.guide;if(void 0==i||i===e.guide)return d;if(i.lastRatio!=g){var j=(i.end-i.start)*(h?i.end:g)+i.start;switch(a.calc(i,j,b.target),i.orient){case"cw":case"ccw":case"auto":b.target.rotation+=i.rotOffS+i.rotDelta*g;break;case"fixed":default:b.target.rotation+=i.rotOffS}i.lastRatio=g}return"rotation"!=c||i.orient&&"false"!=i.orient?b.target[c]:d},a.calc=function(b,c,d){void 0==b._segments&&a.validate(b),void 0==d&&(d={x:0,y:0,rotation:0});for(var e=b._segments,f=b.path,g=b._length*c,h=e.length-2,i=0;g>e[i]&&h>i;)g-=e[i],i+=2;var j=e[i+1],k=0;for(h=j.length-1;g>j[k]&&h>k;)g-=j[k],k++;var l=k/++h+g/(h*j[k]);i=2*i+2;var m=1-l;return d.x=m*m*f[i-2]+2*m*l*f[i+0]+l*l*f[i+2],d.y=m*m*f[i-1]+2*m*l*f[i+1]+l*l*f[i+3],b.orient&&(d.rotation=57.2957795*Math.atan2((f[i+1]-f[i-1])*m+(f[i+3]-f[i+1])*l,(f[i+0]-f[i-2])*m+(f[i+2]-f[i+0])*l)),d},createjs.MotionGuidePlugin=a}(),this.createjs=this.createjs||{},function(){"use strict";var a=createjs.TweenJS=createjs.TweenJS||{};a.version="0.5.1",a.buildDate="Thu, 12 Dec 2013 23:33:38 GMT"}();;/*!
Math.uuid.js (v1.4)
http://www.broofa.com
mailto:robert@broofa.com

Copyright (c) 2010 Robert Kieffer
Dual licensed under the MIT and GPL licenses.
*/

/*
 * Generate a random uuid.
 *
 * USAGE: Math.uuid(length, radix)
 *   length - the desired number of characters
 *   radix  - the number of allowable values for each character.
 *
 * EXAMPLES:
 *   // No arguments  - returns RFC4122, version 4 ID
 *   >>> Math.uuid()
 *   "92329D39-6F5C-4520-ABFC-AAB64544E172"
 *
 *   // One argument - returns ID of the specified length
 *   >>> Math.uuid(15)     // 15 character ID (default base=62)
 *   "VcydxgltxrVZSTV"
 *
 *   // Two arguments - returns ID of the specified length, and radix. (Radix must be <= 62)
 *   >>> Math.uuid(8, 2)  // 8 character ID (base=2)
 *   "01001010"
 *   >>> Math.uuid(8, 10) // 8 character ID (base=10)
 *   "47473046"
 *   >>> Math.uuid(8, 16) // 8 character ID (base=16)
 *   "098F4D35"
 */
(function() {
  // Private array of chars to use
  var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

  Math.uuid = function (len, radix) {
    var chars = CHARS, uuid = [], i;
    radix = radix || chars.length;

    if (len) {
      // Compact form
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
    } else {
      // rfc4122, version 4 form
      var r;

      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';

      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random()*16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }

    return uuid.join('');
  };

  // A more performant, but slightly bulkier, RFC4122v4 solution.  We boost performance
  // by minimizing calls to random()
  Math.uuidFast = function() {
    var chars = CHARS, uuid = new Array(36), rnd=0, r;
    for (var i = 0; i < 36; i++) {
      if (i==8 || i==13 ||  i==18 || i==23) {
        uuid[i] = '-';
      } else if (i==14) {
        uuid[i] = '4';
      } else {
        if (rnd <= 0x02) rnd = 0x2000000 + (Math.random()*0x1000000)|0;
        r = rnd & 0xf;
        rnd = rnd >> 4;
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
      }
    }
    return uuid.join('');
  };

  // A more compact, but less performant, RFC4122v4 solution:
  Math.uuidCompact = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  };
})();
;/*!
 * @overview RSVP - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/tildeio/rsvp.js/master/LICENSE
 * @version   3.0.16
 */

(function() {
    "use strict";
    function lib$rsvp$utils$$objectOrFunction(x) {
      return typeof x === 'function' || (typeof x === 'object' && x !== null);
    }

    function lib$rsvp$utils$$isFunction(x) {
      return typeof x === 'function';
    }

    function lib$rsvp$utils$$isMaybeThenable(x) {
      return typeof x === 'object' && x !== null;
    }

    var lib$rsvp$utils$$_isArray;
    if (!Array.isArray) {
      lib$rsvp$utils$$_isArray = function (x) {
        return Object.prototype.toString.call(x) === '[object Array]';
      };
    } else {
      lib$rsvp$utils$$_isArray = Array.isArray;
    }

    var lib$rsvp$utils$$isArray = lib$rsvp$utils$$_isArray;

    var lib$rsvp$utils$$now = Date.now || function() { return new Date().getTime(); };

    function lib$rsvp$utils$$F() { }

    var lib$rsvp$utils$$o_create = (Object.create || function (o) {
      if (arguments.length > 1) {
        throw new Error('Second argument not supported');
      }
      if (typeof o !== 'object') {
        throw new TypeError('Argument must be an object');
      }
      lib$rsvp$utils$$F.prototype = o;
      return new lib$rsvp$utils$$F();
    });
    function lib$rsvp$events$$indexOf(callbacks, callback) {
      for (var i=0, l=callbacks.length; i<l; i++) {
        if (callbacks[i] === callback) { return i; }
      }

      return -1;
    }

    function lib$rsvp$events$$callbacksFor(object) {
      var callbacks = object._promiseCallbacks;

      if (!callbacks) {
        callbacks = object._promiseCallbacks = {};
      }

      return callbacks;
    }

    var lib$rsvp$events$$default = {

      /**
        `RSVP.EventTarget.mixin` extends an object with EventTarget methods. For
        Example:

        ```javascript
        var object = {};

        RSVP.EventTarget.mixin(object);

        object.on('finished', function(event) {
          // handle event
        });

        object.trigger('finished', { detail: value });
        ```

        `EventTarget.mixin` also works with prototypes:

        ```javascript
        var Person = function() {};
        RSVP.EventTarget.mixin(Person.prototype);

        var yehuda = new Person();
        var tom = new Person();

        yehuda.on('poke', function(event) {
          console.log('Yehuda says OW');
        });

        tom.on('poke', function(event) {
          console.log('Tom says OW');
        });

        yehuda.trigger('poke');
        tom.trigger('poke');
        ```

        @method mixin
        @for RSVP.EventTarget
        @private
        @param {Object} object object to extend with EventTarget methods
      */
      'mixin': function(object) {
        object['on']      = this['on'];
        object['off']     = this['off'];
        object['trigger'] = this['trigger'];
        object._promiseCallbacks = undefined;
        return object;
      },

      /**
        Registers a callback to be executed when `eventName` is triggered

        ```javascript
        object.on('event', function(eventInfo){
          // handle the event
        });

        object.trigger('event');
        ```

        @method on
        @for RSVP.EventTarget
        @private
        @param {String} eventName name of the event to listen for
        @param {Function} callback function to be called when the event is triggered.
      */
      'on': function(eventName, callback) {
        var allCallbacks = lib$rsvp$events$$callbacksFor(this), callbacks;

        callbacks = allCallbacks[eventName];

        if (!callbacks) {
          callbacks = allCallbacks[eventName] = [];
        }

        if (lib$rsvp$events$$indexOf(callbacks, callback) === -1) {
          callbacks.push(callback);
        }
      },

      /**
        You can use `off` to stop firing a particular callback for an event:

        ```javascript
        function doStuff() { // do stuff! }
        object.on('stuff', doStuff);

        object.trigger('stuff'); // doStuff will be called

        // Unregister ONLY the doStuff callback
        object.off('stuff', doStuff);
        object.trigger('stuff'); // doStuff will NOT be called
        ```

        If you don't pass a `callback` argument to `off`, ALL callbacks for the
        event will not be executed when the event fires. For example:

        ```javascript
        var callback1 = function(){};
        var callback2 = function(){};

        object.on('stuff', callback1);
        object.on('stuff', callback2);

        object.trigger('stuff'); // callback1 and callback2 will be executed.

        object.off('stuff');
        object.trigger('stuff'); // callback1 and callback2 will not be executed!
        ```

        @method off
        @for RSVP.EventTarget
        @private
        @param {String} eventName event to stop listening to
        @param {Function} callback optional argument. If given, only the function
        given will be removed from the event's callback queue. If no `callback`
        argument is given, all callbacks will be removed from the event's callback
        queue.
      */
      'off': function(eventName, callback) {
        var allCallbacks = lib$rsvp$events$$callbacksFor(this), callbacks, index;

        if (!callback) {
          allCallbacks[eventName] = [];
          return;
        }

        callbacks = allCallbacks[eventName];

        index = lib$rsvp$events$$indexOf(callbacks, callback);

        if (index !== -1) { callbacks.splice(index, 1); }
      },

      /**
        Use `trigger` to fire custom events. For example:

        ```javascript
        object.on('foo', function(){
          console.log('foo event happened!');
        });
        object.trigger('foo');
        // 'foo event happened!' logged to the console
        ```

        You can also pass a value as a second argument to `trigger` that will be
        passed as an argument to all event listeners for the event:

        ```javascript
        object.on('foo', function(value){
          console.log(value.name);
        });

        object.trigger('foo', { name: 'bar' });
        // 'bar' logged to the console
        ```

        @method trigger
        @for RSVP.EventTarget
        @private
        @param {String} eventName name of the event to be triggered
        @param {Any} options optional value to be passed to any event handlers for
        the given `eventName`
      */
      'trigger': function(eventName, options) {
        var allCallbacks = lib$rsvp$events$$callbacksFor(this), callbacks, callback;

        if (callbacks = allCallbacks[eventName]) {
          // Don't cache the callbacks.length since it may grow
          for (var i=0; i<callbacks.length; i++) {
            callback = callbacks[i];

            callback(options);
          }
        }
      }
    };

    var lib$rsvp$config$$config = {
      instrument: false
    };

    lib$rsvp$events$$default['mixin'](lib$rsvp$config$$config);

    function lib$rsvp$config$$configure(name, value) {
      if (name === 'onerror') {
        // handle for legacy users that expect the actual
        // error to be passed to their function added via
        // `RSVP.configure('onerror', someFunctionHere);`
        lib$rsvp$config$$config['on']('error', value);
        return;
      }

      if (arguments.length === 2) {
        lib$rsvp$config$$config[name] = value;
      } else {
        return lib$rsvp$config$$config[name];
      }
    }

    var lib$rsvp$instrument$$queue = [];

    function lib$rsvp$instrument$$scheduleFlush() {
      setTimeout(function() {
        var entry;
        for (var i = 0; i < lib$rsvp$instrument$$queue.length; i++) {
          entry = lib$rsvp$instrument$$queue[i];

          var payload = entry.payload;

          payload.guid = payload.key + payload.id;
          payload.childGuid = payload.key + payload.childId;
          if (payload.error) {
            payload.stack = payload.error.stack;
          }

          lib$rsvp$config$$config['trigger'](entry.name, entry.payload);
        }
        lib$rsvp$instrument$$queue.length = 0;
      }, 50);
    }

    function lib$rsvp$instrument$$instrument(eventName, promise, child) {
      if (1 === lib$rsvp$instrument$$queue.push({
          name: eventName,
          payload: {
            key: promise._guidKey,
            id:  promise._id,
            eventName: eventName,
            detail: promise._result,
            childId: child && child._id,
            label: promise._label,
            timeStamp: lib$rsvp$utils$$now(),
            error: lib$rsvp$config$$config["instrument-with-stack"] ? new Error(promise._label) : null
          }})) {
            lib$rsvp$instrument$$scheduleFlush();
          }
      }
    var lib$rsvp$instrument$$default = lib$rsvp$instrument$$instrument;

    function  lib$rsvp$$internal$$withOwnPromise() {
      return new TypeError('A promises callback cannot return that same promise.');
    }

    function lib$rsvp$$internal$$noop() {}

    var lib$rsvp$$internal$$PENDING   = void 0;
    var lib$rsvp$$internal$$FULFILLED = 1;
    var lib$rsvp$$internal$$REJECTED  = 2;

    var lib$rsvp$$internal$$GET_THEN_ERROR = new lib$rsvp$$internal$$ErrorObject();

    function lib$rsvp$$internal$$getThen(promise) {
      try {
        return promise.then;
      } catch(error) {
        lib$rsvp$$internal$$GET_THEN_ERROR.error = error;
        return lib$rsvp$$internal$$GET_THEN_ERROR;
      }
    }

    function lib$rsvp$$internal$$tryThen(then, value, fulfillmentHandler, rejectionHandler) {
      try {
        then.call(value, fulfillmentHandler, rejectionHandler);
      } catch(e) {
        return e;
      }
    }

    function lib$rsvp$$internal$$handleForeignThenable(promise, thenable, then) {
      lib$rsvp$config$$config.async(function(promise) {
        var sealed = false;
        var error = lib$rsvp$$internal$$tryThen(then, thenable, function(value) {
          if (sealed) { return; }
          sealed = true;
          if (thenable !== value) {
            lib$rsvp$$internal$$resolve(promise, value);
          } else {
            lib$rsvp$$internal$$fulfill(promise, value);
          }
        }, function(reason) {
          if (sealed) { return; }
          sealed = true;

          lib$rsvp$$internal$$reject(promise, reason);
        }, 'Settle: ' + (promise._label || ' unknown promise'));

        if (!sealed && error) {
          sealed = true;
          lib$rsvp$$internal$$reject(promise, error);
        }
      }, promise);
    }

    function lib$rsvp$$internal$$handleOwnThenable(promise, thenable) {
      if (thenable._state === lib$rsvp$$internal$$FULFILLED) {
        lib$rsvp$$internal$$fulfill(promise, thenable._result);
      } else if (thenable._state === lib$rsvp$$internal$$REJECTED) {
        thenable._onError = null;
        lib$rsvp$$internal$$reject(promise, thenable._result);
      } else {
        lib$rsvp$$internal$$subscribe(thenable, undefined, function(value) {
          if (thenable !== value) {
            lib$rsvp$$internal$$resolve(promise, value);
          } else {
            lib$rsvp$$internal$$fulfill(promise, value);
          }
        }, function(reason) {
          lib$rsvp$$internal$$reject(promise, reason);
        });
      }
    }

    function lib$rsvp$$internal$$handleMaybeThenable(promise, maybeThenable) {
      if (maybeThenable.constructor === promise.constructor) {
        lib$rsvp$$internal$$handleOwnThenable(promise, maybeThenable);
      } else {
        var then = lib$rsvp$$internal$$getThen(maybeThenable);

        if (then === lib$rsvp$$internal$$GET_THEN_ERROR) {
          lib$rsvp$$internal$$reject(promise, lib$rsvp$$internal$$GET_THEN_ERROR.error);
        } else if (then === undefined) {
          lib$rsvp$$internal$$fulfill(promise, maybeThenable);
        } else if (lib$rsvp$utils$$isFunction(then)) {
          lib$rsvp$$internal$$handleForeignThenable(promise, maybeThenable, then);
        } else {
          lib$rsvp$$internal$$fulfill(promise, maybeThenable);
        }
      }
    }

    function lib$rsvp$$internal$$resolve(promise, value) {
      if (promise === value) {
        lib$rsvp$$internal$$fulfill(promise, value);
      } else if (lib$rsvp$utils$$objectOrFunction(value)) {
        lib$rsvp$$internal$$handleMaybeThenable(promise, value);
      } else {
        lib$rsvp$$internal$$fulfill(promise, value);
      }
    }

    function lib$rsvp$$internal$$publishRejection(promise) {
      if (promise._onError) {
        promise._onError(promise._result);
      }

      lib$rsvp$$internal$$publish(promise);
    }

    function lib$rsvp$$internal$$fulfill(promise, value) {
      if (promise._state !== lib$rsvp$$internal$$PENDING) { return; }

      promise._result = value;
      promise._state = lib$rsvp$$internal$$FULFILLED;

      if (promise._subscribers.length === 0) {
        if (lib$rsvp$config$$config.instrument) {
          lib$rsvp$instrument$$default('fulfilled', promise);
        }
      } else {
        lib$rsvp$config$$config.async(lib$rsvp$$internal$$publish, promise);
      }
    }

    function lib$rsvp$$internal$$reject(promise, reason) {
      if (promise._state !== lib$rsvp$$internal$$PENDING) { return; }
      promise._state = lib$rsvp$$internal$$REJECTED;
      promise._result = reason;
      lib$rsvp$config$$config.async(lib$rsvp$$internal$$publishRejection, promise);
    }

    function lib$rsvp$$internal$$subscribe(parent, child, onFulfillment, onRejection) {
      var subscribers = parent._subscribers;
      var length = subscribers.length;

      parent._onError = null;

      subscribers[length] = child;
      subscribers[length + lib$rsvp$$internal$$FULFILLED] = onFulfillment;
      subscribers[length + lib$rsvp$$internal$$REJECTED]  = onRejection;

      if (length === 0 && parent._state) {
        lib$rsvp$config$$config.async(lib$rsvp$$internal$$publish, parent);
      }
    }

    function lib$rsvp$$internal$$publish(promise) {
      var subscribers = promise._subscribers;
      var settled = promise._state;

      if (lib$rsvp$config$$config.instrument) {
        lib$rsvp$instrument$$default(settled === lib$rsvp$$internal$$FULFILLED ? 'fulfilled' : 'rejected', promise);
      }

      if (subscribers.length === 0) { return; }

      var child, callback, detail = promise._result;

      for (var i = 0; i < subscribers.length; i += 3) {
        child = subscribers[i];
        callback = subscribers[i + settled];

        if (child) {
          lib$rsvp$$internal$$invokeCallback(settled, child, callback, detail);
        } else {
          callback(detail);
        }
      }

      promise._subscribers.length = 0;
    }

    function lib$rsvp$$internal$$ErrorObject() {
      this.error = null;
    }

    var lib$rsvp$$internal$$TRY_CATCH_ERROR = new lib$rsvp$$internal$$ErrorObject();

    function lib$rsvp$$internal$$tryCatch(callback, detail) {
      try {
        return callback(detail);
      } catch(e) {
        lib$rsvp$$internal$$TRY_CATCH_ERROR.error = e;
        return lib$rsvp$$internal$$TRY_CATCH_ERROR;
      }
    }

    function lib$rsvp$$internal$$invokeCallback(settled, promise, callback, detail) {
      var hasCallback = lib$rsvp$utils$$isFunction(callback),
          value, error, succeeded, failed;

      if (hasCallback) {
        value = lib$rsvp$$internal$$tryCatch(callback, detail);

        if (value === lib$rsvp$$internal$$TRY_CATCH_ERROR) {
          failed = true;
          error = value.error;
          value = null;
        } else {
          succeeded = true;
        }

        if (promise === value) {
          lib$rsvp$$internal$$reject(promise, lib$rsvp$$internal$$withOwnPromise());
          return;
        }

      } else {
        value = detail;
        succeeded = true;
      }

      if (promise._state !== lib$rsvp$$internal$$PENDING) {
        // noop
      } else if (hasCallback && succeeded) {
        lib$rsvp$$internal$$resolve(promise, value);
      } else if (failed) {
        lib$rsvp$$internal$$reject(promise, error);
      } else if (settled === lib$rsvp$$internal$$FULFILLED) {
        lib$rsvp$$internal$$fulfill(promise, value);
      } else if (settled === lib$rsvp$$internal$$REJECTED) {
        lib$rsvp$$internal$$reject(promise, value);
      }
    }

    function lib$rsvp$$internal$$initializePromise(promise, resolver) {
      var resolved = false;
      try {
        resolver(function resolvePromise(value){
          if (resolved) { return; }
          resolved = true;
          lib$rsvp$$internal$$resolve(promise, value);
        }, function rejectPromise(reason) {
          if (resolved) { return; }
          resolved = true;
          lib$rsvp$$internal$$reject(promise, reason);
        });
      } catch(e) {
        lib$rsvp$$internal$$reject(promise, e);
      }
    }

    function lib$rsvp$enumerator$$makeSettledResult(state, position, value) {
      if (state === lib$rsvp$$internal$$FULFILLED) {
        return {
          state: 'fulfilled',
          value: value
        };
      } else {
        return {
          state: 'rejected',
          reason: value
        };
      }
    }

    function lib$rsvp$enumerator$$Enumerator(Constructor, input, abortOnReject, label) {
      this._instanceConstructor = Constructor;
      this.promise = new Constructor(lib$rsvp$$internal$$noop, label);
      this._abortOnReject = abortOnReject;

      if (this._validateInput(input)) {
        this._input     = input;
        this.length     = input.length;
        this._remaining = input.length;

        this._init();

        if (this.length === 0) {
          lib$rsvp$$internal$$fulfill(this.promise, this._result);
        } else {
          this.length = this.length || 0;
          this._enumerate();
          if (this._remaining === 0) {
            lib$rsvp$$internal$$fulfill(this.promise, this._result);
          }
        }
      } else {
        lib$rsvp$$internal$$reject(this.promise, this._validationError());
      }
    }

    var lib$rsvp$enumerator$$default = lib$rsvp$enumerator$$Enumerator;

    lib$rsvp$enumerator$$Enumerator.prototype._validateInput = function(input) {
      return lib$rsvp$utils$$isArray(input);
    };

    lib$rsvp$enumerator$$Enumerator.prototype._validationError = function() {
      return new Error('Array Methods must be provided an Array');
    };

    lib$rsvp$enumerator$$Enumerator.prototype._init = function() {
      this._result = new Array(this.length);
    };

    lib$rsvp$enumerator$$Enumerator.prototype._enumerate = function() {
      var length  = this.length;
      var promise = this.promise;
      var input   = this._input;

      for (var i = 0; promise._state === lib$rsvp$$internal$$PENDING && i < length; i++) {
        this._eachEntry(input[i], i);
      }
    };

    lib$rsvp$enumerator$$Enumerator.prototype._eachEntry = function(entry, i) {
      var c = this._instanceConstructor;
      if (lib$rsvp$utils$$isMaybeThenable(entry)) {
        if (entry.constructor === c && entry._state !== lib$rsvp$$internal$$PENDING) {
          entry._onError = null;
          this._settledAt(entry._state, i, entry._result);
        } else {
          this._willSettleAt(c.resolve(entry), i);
        }
      } else {
        this._remaining--;
        this._result[i] = this._makeResult(lib$rsvp$$internal$$FULFILLED, i, entry);
      }
    };

    lib$rsvp$enumerator$$Enumerator.prototype._settledAt = function(state, i, value) {
      var promise = this.promise;

      if (promise._state === lib$rsvp$$internal$$PENDING) {
        this._remaining--;

        if (this._abortOnReject && state === lib$rsvp$$internal$$REJECTED) {
          lib$rsvp$$internal$$reject(promise, value);
        } else {
          this._result[i] = this._makeResult(state, i, value);
        }
      }

      if (this._remaining === 0) {
        lib$rsvp$$internal$$fulfill(promise, this._result);
      }
    };

    lib$rsvp$enumerator$$Enumerator.prototype._makeResult = function(state, i, value) {
      return value;
    };

    lib$rsvp$enumerator$$Enumerator.prototype._willSettleAt = function(promise, i) {
      var enumerator = this;

      lib$rsvp$$internal$$subscribe(promise, undefined, function(value) {
        enumerator._settledAt(lib$rsvp$$internal$$FULFILLED, i, value);
      }, function(reason) {
        enumerator._settledAt(lib$rsvp$$internal$$REJECTED, i, reason);
      });
    };
    function lib$rsvp$promise$all$$all(entries, label) {
      return new lib$rsvp$enumerator$$default(this, entries, true /* abort on reject */, label).promise;
    }
    var lib$rsvp$promise$all$$default = lib$rsvp$promise$all$$all;
    function lib$rsvp$promise$race$$race(entries, label) {
      /*jshint validthis:true */
      var Constructor = this;

      var promise = new Constructor(lib$rsvp$$internal$$noop, label);

      if (!lib$rsvp$utils$$isArray(entries)) {
        lib$rsvp$$internal$$reject(promise, new TypeError('You must pass an array to race.'));
        return promise;
      }

      var length = entries.length;

      function onFulfillment(value) {
        lib$rsvp$$internal$$resolve(promise, value);
      }

      function onRejection(reason) {
        lib$rsvp$$internal$$reject(promise, reason);
      }

      for (var i = 0; promise._state === lib$rsvp$$internal$$PENDING && i < length; i++) {
        lib$rsvp$$internal$$subscribe(Constructor.resolve(entries[i]), undefined, onFulfillment, onRejection);
      }

      return promise;
    }
    var lib$rsvp$promise$race$$default = lib$rsvp$promise$race$$race;
    function lib$rsvp$promise$resolve$$resolve(object, label) {
      /*jshint validthis:true */
      var Constructor = this;

      if (object && typeof object === 'object' && object.constructor === Constructor) {
        return object;
      }

      var promise = new Constructor(lib$rsvp$$internal$$noop, label);
      lib$rsvp$$internal$$resolve(promise, object);
      return promise;
    }
    var lib$rsvp$promise$resolve$$default = lib$rsvp$promise$resolve$$resolve;
    function lib$rsvp$promise$reject$$reject(reason, label) {
      /*jshint validthis:true */
      var Constructor = this;
      var promise = new Constructor(lib$rsvp$$internal$$noop, label);
      lib$rsvp$$internal$$reject(promise, reason);
      return promise;
    }
    var lib$rsvp$promise$reject$$default = lib$rsvp$promise$reject$$reject;

    var lib$rsvp$promise$$guidKey = 'rsvp_' + lib$rsvp$utils$$now() + '-';
    var lib$rsvp$promise$$counter = 0;

    function lib$rsvp$promise$$needsResolver() {
      throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
    }

    function lib$rsvp$promise$$needsNew() {
      throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
    }

    /**
      Promise objects represent the eventual result of an asynchronous operation. The
      primary way of interacting with a promise is through its `then` method, which
      registers callbacks to receive either a promise’s eventual value or the reason
      why the promise cannot be fulfilled.

      Terminology
      -----------

      - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
      - `thenable` is an object or function that defines a `then` method.
      - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
      - `exception` is a value that is thrown using the throw statement.
      - `reason` is a value that indicates why a promise was rejected.
      - `settled` the final resting state of a promise, fulfilled or rejected.

      A promise can be in one of three states: pending, fulfilled, or rejected.

      Promises that are fulfilled have a fulfillment value and are in the fulfilled
      state.  Promises that are rejected have a rejection reason and are in the
      rejected state.  A fulfillment value is never a thenable.

      Promises can also be said to *resolve* a value.  If this value is also a
      promise, then the original promise's settled state will match the value's
      settled state.  So a promise that *resolves* a promise that rejects will
      itself reject, and a promise that *resolves* a promise that fulfills will
      itself fulfill.


      Basic Usage:
      ------------

      ```js
      var promise = new Promise(function(resolve, reject) {
        // on success
        resolve(value);

        // on failure
        reject(reason);
      });

      promise.then(function(value) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```

      Advanced Usage:
      ---------------

      Promises shine when abstracting away asynchronous interactions such as
      `XMLHttpRequest`s.

      ```js
      function getJSON(url) {
        return new Promise(function(resolve, reject){
          var xhr = new XMLHttpRequest();

          xhr.open('GET', url);
          xhr.onreadystatechange = handler;
          xhr.responseType = 'json';
          xhr.setRequestHeader('Accept', 'application/json');
          xhr.send();

          function handler() {
            if (this.readyState === this.DONE) {
              if (this.status === 200) {
                resolve(this.response);
              } else {
                reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
              }
            }
          };
        });
      }

      getJSON('/posts.json').then(function(json) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```

      Unlike callbacks, promises are great composable primitives.

      ```js
      Promise.all([
        getJSON('/posts'),
        getJSON('/comments')
      ]).then(function(values){
        values[0] // => postsJSON
        values[1] // => commentsJSON

        return values;
      });
      ```

      @class RSVP.Promise
      @param {function} resolver
      @param {String} label optional string for labeling the promise.
      Useful for tooling.
      @constructor
    */
    function lib$rsvp$promise$$Promise(resolver, label) {
      this._id = lib$rsvp$promise$$counter++;
      this._label = label;
      this._state = undefined;
      this._result = undefined;
      this._subscribers = [];

      if (lib$rsvp$config$$config.instrument) {
        lib$rsvp$instrument$$default('created', this);
      }

      if (lib$rsvp$$internal$$noop !== resolver) {
        if (!lib$rsvp$utils$$isFunction(resolver)) {
          lib$rsvp$promise$$needsResolver();
        }

        if (!(this instanceof lib$rsvp$promise$$Promise)) {
          lib$rsvp$promise$$needsNew();
        }

        lib$rsvp$$internal$$initializePromise(this, resolver);
      }
    }

    var lib$rsvp$promise$$default = lib$rsvp$promise$$Promise;

    // deprecated
    lib$rsvp$promise$$Promise.cast = lib$rsvp$promise$resolve$$default;
    lib$rsvp$promise$$Promise.all = lib$rsvp$promise$all$$default;
    lib$rsvp$promise$$Promise.race = lib$rsvp$promise$race$$default;
    lib$rsvp$promise$$Promise.resolve = lib$rsvp$promise$resolve$$default;
    lib$rsvp$promise$$Promise.reject = lib$rsvp$promise$reject$$default;

    lib$rsvp$promise$$Promise.prototype = {
      constructor: lib$rsvp$promise$$Promise,

      _guidKey: lib$rsvp$promise$$guidKey,

      _onError: function (reason) {
        lib$rsvp$config$$config.async(function(promise) {
          setTimeout(function() {
            if (promise._onError) {
              lib$rsvp$config$$config['trigger']('error', reason);
            }
          }, 0);
        }, this);
      },

    /**
      The primary way of interacting with a promise is through its `then` method,
      which registers callbacks to receive either a promise's eventual value or the
      reason why the promise cannot be fulfilled.

      ```js
      findUser().then(function(user){
        // user is available
      }, function(reason){
        // user is unavailable, and you are given the reason why
      });
      ```

      Chaining
      --------

      The return value of `then` is itself a promise.  This second, 'downstream'
      promise is resolved with the return value of the first promise's fulfillment
      or rejection handler, or rejected if the handler throws an exception.

      ```js
      findUser().then(function (user) {
        return user.name;
      }, function (reason) {
        return 'default name';
      }).then(function (userName) {
        // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
        // will be `'default name'`
      });

      findUser().then(function (user) {
        throw new Error('Found user, but still unhappy');
      }, function (reason) {
        throw new Error('`findUser` rejected and we're unhappy');
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
        // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
      });
      ```
      If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.

      ```js
      findUser().then(function (user) {
        throw new PedagogicalException('Upstream error');
      }).then(function (value) {
        // never reached
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // The `PedgagocialException` is propagated all the way down to here
      });
      ```

      Assimilation
      ------------

      Sometimes the value you want to propagate to a downstream promise can only be
      retrieved asynchronously. This can be achieved by returning a promise in the
      fulfillment or rejection handler. The downstream promise will then be pending
      until the returned promise is settled. This is called *assimilation*.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // The user's comments are now available
      });
      ```

      If the assimliated promise rejects, then the downstream promise will also reject.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // If `findCommentsByAuthor` fulfills, we'll have the value here
      }, function (reason) {
        // If `findCommentsByAuthor` rejects, we'll have the reason here
      });
      ```

      Simple Example
      --------------

      Synchronous Example

      ```javascript
      var result;

      try {
        result = findResult();
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js
      findResult(function(result, err){
        if (err) {
          // failure
        } else {
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findResult().then(function(result){
        // success
      }, function(reason){
        // failure
      });
      ```

      Advanced Example
      --------------

      Synchronous Example

      ```javascript
      var author, books;

      try {
        author = findAuthor();
        books  = findBooksByAuthor(author);
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js

      function foundBooks(books) {

      }

      function failure(reason) {

      }

      findAuthor(function(author, err){
        if (err) {
          failure(err);
          // failure
        } else {
          try {
            findBoooksByAuthor(author, function(books, err) {
              if (err) {
                failure(err);
              } else {
                try {
                  foundBooks(books);
                } catch(reason) {
                  failure(reason);
                }
              }
            });
          } catch(error) {
            failure(err);
          }
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findAuthor().
        then(findBooksByAuthor).
        then(function(books){
          // found books
      }).catch(function(reason){
        // something went wrong
      });
      ```

      @method then
      @param {Function} onFulfilled
      @param {Function} onRejected
      @param {String} label optional string for labeling the promise.
      Useful for tooling.
      @return {Promise}
    */
      then: function(onFulfillment, onRejection, label) {
        var parent = this;
        var state = parent._state;

        if (state === lib$rsvp$$internal$$FULFILLED && !onFulfillment || state === lib$rsvp$$internal$$REJECTED && !onRejection) {
          if (lib$rsvp$config$$config.instrument) {
            lib$rsvp$instrument$$default('chained', this, this);
          }
          return this;
        }

        parent._onError = null;

        var child = new this.constructor(lib$rsvp$$internal$$noop, label);
        var result = parent._result;

        if (lib$rsvp$config$$config.instrument) {
          lib$rsvp$instrument$$default('chained', parent, child);
        }

        if (state) {
          var callback = arguments[state - 1];
          lib$rsvp$config$$config.async(function(){
            lib$rsvp$$internal$$invokeCallback(state, child, callback, result);
          });
        } else {
          lib$rsvp$$internal$$subscribe(parent, child, onFulfillment, onRejection);
        }

        return child;
      },

    /**
      `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
      as the catch block of a try/catch statement.

      ```js
      function findAuthor(){
        throw new Error('couldn't find that author');
      }

      // synchronous
      try {
        findAuthor();
      } catch(reason) {
        // something went wrong
      }

      // async with promises
      findAuthor().catch(function(reason){
        // something went wrong
      });
      ```

      @method catch
      @param {Function} onRejection
      @param {String} label optional string for labeling the promise.
      Useful for tooling.
      @return {Promise}
    */
      'catch': function(onRejection, label) {
        return this.then(null, onRejection, label);
      },

    /**
      `finally` will be invoked regardless of the promise's fate just as native
      try/catch/finally behaves

      Synchronous example:

      ```js
      findAuthor() {
        if (Math.random() > 0.5) {
          throw new Error();
        }
        return new Author();
      }

      try {
        return findAuthor(); // succeed or fail
      } catch(error) {
        return findOtherAuther();
      } finally {
        // always runs
        // doesn't affect the return value
      }
      ```

      Asynchronous example:

      ```js
      findAuthor().catch(function(reason){
        return findOtherAuther();
      }).finally(function(){
        // author was either found, or not
      });
      ```

      @method finally
      @param {Function} callback
      @param {String} label optional string for labeling the promise.
      Useful for tooling.
      @return {Promise}
    */
      'finally': function(callback, label) {
        var constructor = this.constructor;

        return this.then(function(value) {
          return constructor.resolve(callback()).then(function(){
            return value;
          });
        }, function(reason) {
          return constructor.resolve(callback()).then(function(){
            throw reason;
          });
        }, label);
      }
    };

    function lib$rsvp$all$settled$$AllSettled(Constructor, entries, label) {
      this._superConstructor(Constructor, entries, false /* don't abort on reject */, label);
    }

    lib$rsvp$all$settled$$AllSettled.prototype = lib$rsvp$utils$$o_create(lib$rsvp$enumerator$$default.prototype);
    lib$rsvp$all$settled$$AllSettled.prototype._superConstructor = lib$rsvp$enumerator$$default;
    lib$rsvp$all$settled$$AllSettled.prototype._makeResult = lib$rsvp$enumerator$$makeSettledResult;
    lib$rsvp$all$settled$$AllSettled.prototype._validationError = function() {
      return new Error('allSettled must be called with an array');
    };

    function lib$rsvp$all$settled$$allSettled(entries, label) {
      return new lib$rsvp$all$settled$$AllSettled(lib$rsvp$promise$$default, entries, label).promise;
    }
    var lib$rsvp$all$settled$$default = lib$rsvp$all$settled$$allSettled;
    function lib$rsvp$all$$all(array, label) {
      return lib$rsvp$promise$$default.all(array, label);
    }
    var lib$rsvp$all$$default = lib$rsvp$all$$all;
    var lib$rsvp$asap$$len = 0;
    var lib$rsvp$asap$$toString = {}.toString;
    var lib$rsvp$asap$$vertxNext;
    function lib$rsvp$asap$$asap(callback, arg) {
      lib$rsvp$asap$$queue[lib$rsvp$asap$$len] = callback;
      lib$rsvp$asap$$queue[lib$rsvp$asap$$len + 1] = arg;
      lib$rsvp$asap$$len += 2;
      if (lib$rsvp$asap$$len === 2) {
        // If len is 1, that means that we need to schedule an async flush.
        // If additional callbacks are queued before the queue is flushed, they
        // will be processed by this flush that we are scheduling.
        lib$rsvp$asap$$scheduleFlush();
      }
    }

    var lib$rsvp$asap$$default = lib$rsvp$asap$$asap;

    var lib$rsvp$asap$$browserWindow = (typeof window !== 'undefined') ? window : undefined;
    var lib$rsvp$asap$$browserGlobal = lib$rsvp$asap$$browserWindow || {};
    var lib$rsvp$asap$$BrowserMutationObserver = lib$rsvp$asap$$browserGlobal.MutationObserver || lib$rsvp$asap$$browserGlobal.WebKitMutationObserver;
    var lib$rsvp$asap$$isNode = typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

    // test for web worker but not in IE10
    var lib$rsvp$asap$$isWorker = typeof Uint8ClampedArray !== 'undefined' &&
      typeof importScripts !== 'undefined' &&
      typeof MessageChannel !== 'undefined';

    // node
    function lib$rsvp$asap$$useNextTick() {
      var nextTick = process.nextTick;
      // node version 0.10.x displays a deprecation warning when nextTick is used recursively
      // setImmediate should be used instead instead
      
      var version = process.versions.node.match(/^(?:(\d+)\.)?(?:(\d+)\.)?(\*|\d+)$/);
      //if (Array.isArray(version) && version[1] === '0' && version[2] === '10') {
      //  nextTick = setImmediate;
      //}
      
      return function() {
        nextTick(lib$rsvp$asap$$flush);
      };
    }

    // vertx
    function lib$rsvp$asap$$useVertxTimer() {
      return function() {
        lib$rsvp$asap$$vertxNext(lib$rsvp$asap$$flush);
      };
    }

    function lib$rsvp$asap$$useMutationObserver() {
      var iterations = 0;
      var observer = new lib$rsvp$asap$$BrowserMutationObserver(lib$rsvp$asap$$flush);
      var node = document.createTextNode('');
      observer.observe(node, { characterData: true });

      return function() {
        node.data = (iterations = ++iterations % 2);
      };
    }

    // web worker
    function lib$rsvp$asap$$useMessageChannel() {
      var channel = new MessageChannel();
      channel.port1.onmessage = lib$rsvp$asap$$flush;
      return function () {
        channel.port2.postMessage(0);
      };
    }

    function lib$rsvp$asap$$useSetTimeout() {
      return function() {
        setTimeout(lib$rsvp$asap$$flush, 1);
      };
    }

    var lib$rsvp$asap$$queue = new Array(1000);
    function lib$rsvp$asap$$flush() {
      for (var i = 0; i < lib$rsvp$asap$$len; i+=2) {
        var callback = lib$rsvp$asap$$queue[i];
        var arg = lib$rsvp$asap$$queue[i+1];

        callback(arg);

        lib$rsvp$asap$$queue[i] = undefined;
        lib$rsvp$asap$$queue[i+1] = undefined;
      }

      lib$rsvp$asap$$len = 0;
    }

    function lib$rsvp$asap$$attemptVertex() {
      try {
        var r = require;
        var vertx = r('vertx');
        lib$rsvp$asap$$vertxNext = vertx.runOnLoop || vertx.runOnContext;
        return lib$rsvp$asap$$useVertxTimer();
      } catch(e) {
        return lib$rsvp$asap$$useSetTimeout();
      }
    }

    var lib$rsvp$asap$$scheduleFlush;
    // Decide what async method to use to triggering processing of queued callbacks:
    if (lib$rsvp$asap$$isNode) {
      lib$rsvp$asap$$scheduleFlush = lib$rsvp$asap$$useNextTick();
    } else if (lib$rsvp$asap$$BrowserMutationObserver) {
      lib$rsvp$asap$$scheduleFlush = lib$rsvp$asap$$useMutationObserver();
    } else if (lib$rsvp$asap$$isWorker) {
      lib$rsvp$asap$$scheduleFlush = lib$rsvp$asap$$useMessageChannel();
    } else if (lib$rsvp$asap$$browserWindow === undefined && typeof require === 'function') {
      lib$rsvp$asap$$scheduleFlush = lib$rsvp$asap$$attemptVertex();
    } else {
      lib$rsvp$asap$$scheduleFlush = lib$rsvp$asap$$useSetTimeout();
    }
    function lib$rsvp$defer$$defer(label) {
      var deferred = { };

      deferred['promise'] = new lib$rsvp$promise$$default(function(resolve, reject) {
        deferred['resolve'] = resolve;
        deferred['reject'] = reject;
      }, label);

      return deferred;
    }
    var lib$rsvp$defer$$default = lib$rsvp$defer$$defer;
    function lib$rsvp$filter$$filter(promises, filterFn, label) {
      return lib$rsvp$promise$$default.all(promises, label).then(function(values) {
        if (!lib$rsvp$utils$$isFunction(filterFn)) {
          throw new TypeError("You must pass a function as filter's second argument.");
        }

        var length = values.length;
        var filtered = new Array(length);

        for (var i = 0; i < length; i++) {
          filtered[i] = filterFn(values[i]);
        }

        return lib$rsvp$promise$$default.all(filtered, label).then(function(filtered) {
          var results = new Array(length);
          var newLength = 0;

          for (var i = 0; i < length; i++) {
            if (filtered[i]) {
              results[newLength] = values[i];
              newLength++;
            }
          }

          results.length = newLength;

          return results;
        });
      });
    }
    var lib$rsvp$filter$$default = lib$rsvp$filter$$filter;

    function lib$rsvp$promise$hash$$PromiseHash(Constructor, object, label) {
      this._superConstructor(Constructor, object, true, label);
    }

    var lib$rsvp$promise$hash$$default = lib$rsvp$promise$hash$$PromiseHash;

    lib$rsvp$promise$hash$$PromiseHash.prototype = lib$rsvp$utils$$o_create(lib$rsvp$enumerator$$default.prototype);
    lib$rsvp$promise$hash$$PromiseHash.prototype._superConstructor = lib$rsvp$enumerator$$default;
    lib$rsvp$promise$hash$$PromiseHash.prototype._init = function() {
      this._result = {};
    };

    lib$rsvp$promise$hash$$PromiseHash.prototype._validateInput = function(input) {
      return input && typeof input === 'object';
    };

    lib$rsvp$promise$hash$$PromiseHash.prototype._validationError = function() {
      return new Error('Promise.hash must be called with an object');
    };

    lib$rsvp$promise$hash$$PromiseHash.prototype._enumerate = function() {
      var promise = this.promise;
      var input   = this._input;
      var results = [];

      for (var key in input) {
        if (promise._state === lib$rsvp$$internal$$PENDING && input.hasOwnProperty(key)) {
          results.push({
            position: key,
            entry: input[key]
          });
        }
      }

      var length = results.length;
      this._remaining = length;
      var result;

      for (var i = 0; promise._state === lib$rsvp$$internal$$PENDING && i < length; i++) {
        result = results[i];
        this._eachEntry(result.entry, result.position);
      }
    };

    function lib$rsvp$hash$settled$$HashSettled(Constructor, object, label) {
      this._superConstructor(Constructor, object, false, label);
    }

    lib$rsvp$hash$settled$$HashSettled.prototype = lib$rsvp$utils$$o_create(lib$rsvp$promise$hash$$default.prototype);
    lib$rsvp$hash$settled$$HashSettled.prototype._superConstructor = lib$rsvp$enumerator$$default;
    lib$rsvp$hash$settled$$HashSettled.prototype._makeResult = lib$rsvp$enumerator$$makeSettledResult;

    lib$rsvp$hash$settled$$HashSettled.prototype._validationError = function() {
      return new Error('hashSettled must be called with an object');
    };

    function lib$rsvp$hash$settled$$hashSettled(object, label) {
      return new lib$rsvp$hash$settled$$HashSettled(lib$rsvp$promise$$default, object, label).promise;
    }
    var lib$rsvp$hash$settled$$default = lib$rsvp$hash$settled$$hashSettled;
    function lib$rsvp$hash$$hash(object, label) {
      return new lib$rsvp$promise$hash$$default(lib$rsvp$promise$$default, object, label).promise;
    }
    var lib$rsvp$hash$$default = lib$rsvp$hash$$hash;
    function lib$rsvp$map$$map(promises, mapFn, label) {
      return lib$rsvp$promise$$default.all(promises, label).then(function(values) {
        if (!lib$rsvp$utils$$isFunction(mapFn)) {
          throw new TypeError("You must pass a function as map's second argument.");
        }

        var length = values.length;
        var results = new Array(length);

        for (var i = 0; i < length; i++) {
          results[i] = mapFn(values[i]);
        }

        return lib$rsvp$promise$$default.all(results, label);
      });
    }
    var lib$rsvp$map$$default = lib$rsvp$map$$map;

    function lib$rsvp$node$$Result() {
      this.value = undefined;
    }

    var lib$rsvp$node$$ERROR = new lib$rsvp$node$$Result();
    var lib$rsvp$node$$GET_THEN_ERROR = new lib$rsvp$node$$Result();

    function lib$rsvp$node$$getThen(obj) {
      try {
       return obj.then;
      } catch(error) {
        lib$rsvp$node$$ERROR.value= error;
        return lib$rsvp$node$$ERROR;
      }
    }


    function lib$rsvp$node$$tryApply(f, s, a) {
      try {
        f.apply(s, a);
      } catch(error) {
        lib$rsvp$node$$ERROR.value = error;
        return lib$rsvp$node$$ERROR;
      }
    }

    function lib$rsvp$node$$makeObject(_, argumentNames) {
      var obj = {};
      var name;
      var i;
      var length = _.length;
      var args = new Array(length);

      for (var x = 0; x < length; x++) {
        args[x] = _[x];
      }

      for (i = 0; i < argumentNames.length; i++) {
        name = argumentNames[i];
        obj[name] = args[i + 1];
      }

      return obj;
    }

    function lib$rsvp$node$$arrayResult(_) {
      var length = _.length;
      var args = new Array(length - 1);

      for (var i = 1; i < length; i++) {
        args[i - 1] = _[i];
      }

      return args;
    }

    function lib$rsvp$node$$wrapThenable(then, promise) {
      return {
        then: function(onFulFillment, onRejection) {
          return then.call(promise, onFulFillment, onRejection);
        }
      };
    }

    function lib$rsvp$node$$denodeify(nodeFunc, options) {
      var fn = function() {
        var self = this;
        var l = arguments.length;
        var args = new Array(l + 1);
        var arg;
        var promiseInput = false;

        for (var i = 0; i < l; ++i) {
          arg = arguments[i];

          if (!promiseInput) {
            // TODO: clean this up
            promiseInput = lib$rsvp$node$$needsPromiseInput(arg);
            if (promiseInput === lib$rsvp$node$$GET_THEN_ERROR) {
              var p = new lib$rsvp$promise$$default(lib$rsvp$$internal$$noop);
              lib$rsvp$$internal$$reject(p, lib$rsvp$node$$GET_THEN_ERROR.value);
              return p;
            } else if (promiseInput && promiseInput !== true) {
              arg = lib$rsvp$node$$wrapThenable(promiseInput, arg);
            }
          }
          args[i] = arg;
        }

        var promise = new lib$rsvp$promise$$default(lib$rsvp$$internal$$noop);

        args[l] = function(err, val) {
          if (err)
            lib$rsvp$$internal$$reject(promise, err);
          else if (options === undefined)
            lib$rsvp$$internal$$resolve(promise, val);
          else if (options === true)
            lib$rsvp$$internal$$resolve(promise, lib$rsvp$node$$arrayResult(arguments));
          else if (lib$rsvp$utils$$isArray(options))
            lib$rsvp$$internal$$resolve(promise, lib$rsvp$node$$makeObject(arguments, options));
          else
            lib$rsvp$$internal$$resolve(promise, val);
        };

        if (promiseInput) {
          return lib$rsvp$node$$handlePromiseInput(promise, args, nodeFunc, self);
        } else {
          return lib$rsvp$node$$handleValueInput(promise, args, nodeFunc, self);
        }
      };

      fn.__proto__ = nodeFunc;

      return fn;
    }

    var lib$rsvp$node$$default = lib$rsvp$node$$denodeify;

    function lib$rsvp$node$$handleValueInput(promise, args, nodeFunc, self) {
      var result = lib$rsvp$node$$tryApply(nodeFunc, self, args);
      if (result === lib$rsvp$node$$ERROR) {
        lib$rsvp$$internal$$reject(promise, result.value);
      }
      return promise;
    }

    function lib$rsvp$node$$handlePromiseInput(promise, args, nodeFunc, self){
      return lib$rsvp$promise$$default.all(args).then(function(args){
        var result = lib$rsvp$node$$tryApply(nodeFunc, self, args);
        if (result === lib$rsvp$node$$ERROR) {
          lib$rsvp$$internal$$reject(promise, result.value);
        }
        return promise;
      });
    }

    function lib$rsvp$node$$needsPromiseInput(arg) {
      if (arg && typeof arg === 'object') {
        if (arg.constructor === lib$rsvp$promise$$default) {
          return true;
        } else {
          return lib$rsvp$node$$getThen(arg);
        }
      } else {
        return false;
      }
    }
    function lib$rsvp$race$$race(array, label) {
      return lib$rsvp$promise$$default.race(array, label);
    }
    var lib$rsvp$race$$default = lib$rsvp$race$$race;
    function lib$rsvp$reject$$reject(reason, label) {
      return lib$rsvp$promise$$default.reject(reason, label);
    }
    var lib$rsvp$reject$$default = lib$rsvp$reject$$reject;
    function lib$rsvp$resolve$$resolve(value, label) {
      return lib$rsvp$promise$$default.resolve(value, label);
    }
    var lib$rsvp$resolve$$default = lib$rsvp$resolve$$resolve;
    function lib$rsvp$rethrow$$rethrow(reason) {
      setTimeout(function() {
        throw reason;
      });
      throw reason;
    }
    var lib$rsvp$rethrow$$default = lib$rsvp$rethrow$$rethrow;

    // default async is asap;
    lib$rsvp$config$$config.async = lib$rsvp$asap$$default;
    var lib$rsvp$$cast = lib$rsvp$resolve$$default;
    function lib$rsvp$$async(callback, arg) {
      lib$rsvp$config$$config.async(callback, arg);
    }

    function lib$rsvp$$on() {
      lib$rsvp$config$$config['on'].apply(lib$rsvp$config$$config, arguments);
    }

    function lib$rsvp$$off() {
      lib$rsvp$config$$config['off'].apply(lib$rsvp$config$$config, arguments);
    }

    // Set up instrumentation through `window.__PROMISE_INTRUMENTATION__`
    if (typeof window !== 'undefined' && typeof window['__PROMISE_INSTRUMENTATION__'] === 'object') {
      var lib$rsvp$$callbacks = window['__PROMISE_INSTRUMENTATION__'];
      lib$rsvp$config$$configure('instrument', true);
      for (var lib$rsvp$$eventName in lib$rsvp$$callbacks) {
        if (lib$rsvp$$callbacks.hasOwnProperty(lib$rsvp$$eventName)) {
          lib$rsvp$$on(lib$rsvp$$eventName, lib$rsvp$$callbacks[lib$rsvp$$eventName]);
        }
      }
    }

    var lib$rsvp$umd$$RSVP = {
      'race': lib$rsvp$race$$default,
      'Promise': lib$rsvp$promise$$default,
      'allSettled': lib$rsvp$all$settled$$default,
      'hash': lib$rsvp$hash$$default,
      'hashSettled': lib$rsvp$hash$settled$$default,
      'denodeify': lib$rsvp$node$$default,
      'on': lib$rsvp$$on,
      'off': lib$rsvp$$off,
      'map': lib$rsvp$map$$default,
      'filter': lib$rsvp$filter$$default,
      'resolve': lib$rsvp$resolve$$default,
      'reject': lib$rsvp$reject$$default,
      'all': lib$rsvp$all$$default,
      'rethrow': lib$rsvp$rethrow$$default,
      'defer': lib$rsvp$defer$$default,
      'EventTarget': lib$rsvp$events$$default,
      'configure': lib$rsvp$config$$configure,
      'async': lib$rsvp$$async
    };

    /* global define:true module:true window: true */
    if (typeof define === 'function' && define['amd']) {
      define(function() { return lib$rsvp$umd$$RSVP; });
    } else if (typeof module !== 'undefined' && module['exports']) {
      module['exports'] = lib$rsvp$umd$$RSVP;
    } else if (typeof this !== 'undefined') {
      this['RSVP'] = lib$rsvp$umd$$RSVP;
    }
}).call(this);
;var Estudiante = (function () {
    function Estudiante() {
        this.habilidades = [];
        this.comportamientos = [];
    }
    Estudiante.prototype.aprender = function (clase_de_habilidad, argumentos) {
        if (typeof argumentos === "undefined") { argumentos = undefined; }
        this.agregar_habilidad(clase_de_habilidad, argumentos);
        return "Enseñando una habilidad ...";
    };

    Estudiante.prototype.agregar_habilidad = function (clase_de_habilidad, argumentos) {
        for (var i = 0; i < this.habilidades.length; i++) {
            if (this.habilidades[i] instanceof clase_de_habilidad) {
                this.habilidades.splice(i, 1);
                break;
            }
        }

        if (argumentos == undefined) {
            var habilidad = new clase_de_habilidad(this);
        } else {
            var habilidad = new clase_de_habilidad(this, argumentos);
        }

        // TODO permitir que se puedan enviar habiliades ya instanciadas.
        this.habilidades.push(habilidad);
    };

    Estudiante.prototype.actualizar_habilidades = function () {
        for (var i = 0; i < this.habilidades.length; i++) {
            this.habilidades[i].actualizar();
        }
    };

    Estudiante.prototype.hacer = function (comportamiento, argumentos) {
        if (typeof argumentos === "undefined") { argumentos = {}; }
        var _comportamiento = new comportamiento(argumentos);
        this.comportamientos.splice(0, 0, _comportamiento);
        this._adoptar_el_siguiente_comportamiento();
    };

    Estudiante.prototype.hacer_luego = function (comportamiento, argumentos) {
        if (typeof argumentos === "undefined") { argumentos = {}; }
        var _comportamiento = new comportamiento(argumentos);
        this.comportamientos.push(_comportamiento);
    };

    Estudiante.prototype.actualizar_comportamientos = function () {
        if (this.comportamiento_actual) {
            var termina = this.comportamiento_actual[0]["actualizar"]();

            if (termina) {
                this._adoptar_el_siguiente_comportamiento();
            }
        } else {
            this._adoptar_el_siguiente_comportamiento();
        }
    };

    Estudiante.prototype._adoptar_el_siguiente_comportamiento = function () {
        if (this.comportamientos[0]) {
            this.comportamiento_actual = this.comportamientos.splice(0, 1);

            //console.log(this.comportamiento_actual);
            this.comportamiento_actual[0]["iniciar"](this);
        } else {
            this.comportamiento_actual = undefined;
        }
    };
    return Estudiante;
})();
/// <reference path="estudiante.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
* @class Actor
*
* Representa un objeto visible en pantalla, algo que se ve y tiene posicion.
*
* {@img actores/actor.png}
*
* Un objeto Actor se tiene que crear siempre indicando una imagen. Si no
* se especifica una imagen, se verá una pila de color gris cómo la que
* está mas arriba.
*
* Una forma de crear el actor con una imagen es:
*
*     @example
*     var protagonista = Actor("protagonista_de_frente.png");
*
* incluso, es equivalente hacer lo siguiente:
*
*     @example
*     var imagen = pilas.imagenes.cargar("protagonista_de_frente.png");
*     var protagonista = Actor(imagen);
*
* Luego, una vez que ha sido ejecutada la sentencia aparecerá
* el nuevo actor para que puedas manipularlo. Por ejemplo
* alterando sus propiedades:
*
*     @example
*     protagonista.x = 100;
*     protagonista.escala = 2;
*     protagonista.rotacion = 30;
*
* Estas propiedades también se pueden manipular mediante
* interpolaciones. Por ejemplo, para aumentar el tamaño del
* personaje de 1 a 5 en 7 segundos:
*
*     @example
*     protagonista.escala = 1;
*     protagonista.escala = [5];
*
* Si quieres que el actor sea invisible, un truco es crearlo
* con la imagen ``invisible.png``:
*
*     @example
*     invisible = pilas.actores.Actor('invisible.png');
*
*/
var Actor = (function (_super) {
    __extends(Actor, _super);
    function Actor(imagen, x, y, atributos) {
        if (typeof atributos === "undefined") { atributos = {}; }
        _super.call(this);
        this.evto_se_movio = new Evento("se_movio");
        this.imagen = imagen || 'sin_imagen.png';
        atributos = atributos || {};
        this.vivo = true;
        this.radio_de_colision = 10;
        this.id = pilas.utils.obtener_uuid();
        this.x = x || 0;
        this.y = y || 0;
        this.espejado = false;
        this.centro = ['centro', 'centro'];

        this.etiquetas = [];
        this.etiquetas.push(this.getClassName());

        if (atributos['rotacion'])
            this.rotacion = atributos['rotacion'];

        if (atributos['centro_x'])
            this.centro_x = atributos['centro_x'];

        if (atributos['centro_x'])
            this.centro_y = atributos['centro_y'];

        this.z = 0;
        pilas.escena_actual().agregar_actor(this);

        //eventos
        pilas.escena_actual().click_de_mouse.conectar(this);
        pilas.escena_actual().mueve_mouse.conectar(this);

        this.callbacks_cuando_hace_click = [];
        this.callbacks_cuando_mueve_mouse = [];

        this.iniciar();
    }
    Actor.prototype.getClassName = function () {
        var funcNameRegex = /function (.{1,})\(/;
        var results = (funcNameRegex).exec(this["constructor"].toString());
        return (results && results.length > 1) ? results[1] : "";
    };

    Actor.prototype.iniciar = function () {
    };

    Actor.prototype.tiene_fisica = function () {
        return (this.figura !== undefined);
    };

    Actor.prototype._crear_sprite = function () {
        /* Si el actor ya tenía imagen, entonces se encarga de reemplazar
        la imagen actual, y vuelve a definir el punto de control en el
        centro. */
        if (this.sprite === undefined) {
            var x = 0;
            var y = 0;
            var rotacion = 0;
            var escala = 1;
        } else {
            var x = this.x;
            var y = this.y;
            var rotacion = this.rotacion;
            var escala = this.escala;
        }

        if (this.sprite === undefined) {
            this.sprite = this._imagen.instanciar();
        } else {
            pilas.escena_actual().eliminar_actor(this);
            this.sprite = this._imagen.instanciar();
            pilas.escena_actual().agregar_actor(this);
        }

        this.x = x;
        this.y = y;
        this.rotacion = rotacion;
        this.escala = escala;
        /*
        if (this.sprite !== undefined) {
        this.sprite.image = this._imagen.instanciar().image;
        
        if (! this.sprite.image) {
        this.sprite = this._imagen.instanciar();
        }
        
        } else {
        this.sprite = this._imagen.instanciar();
        }
        */
    };

    Actor.prototype.eliminar = function () {
        this.vivo = false;
        pilas.escena_actual().eliminar_actor(this);
        if (this.tiene_fisica()) {
            this.figura.eliminar();
        }
    };

    Object.defineProperty(Actor.prototype, "z", {
        get: function () {
            return this.sprite.z;
        },
        set: function (_z) {
            this.sprite.z = _z;
            this.evto_se_movio.emitir();
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Actor.prototype, "espejado", {
        get: function () {
            return this._espejado;
        },
        set: function (_espejado) {
            this._espejado = _espejado;

            if (_espejado)
                this.sprite.scaleX = -Math.abs(this.sprite.scaleX);
            else
                this.sprite.scaleX = Math.abs(this.sprite.scaleX);
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Actor.prototype, "x", {
        get: function () {
            var pos = pilas.escena_actual().obtener_posicion_escenario(this.sprite.x, 0);
            return pos.x;
        },
        set: function (_x) {
            if (_x instanceof Array)
                pilas.interpolar(this, 'x', _x, 1);
            else {
                var pos = pilas.escena_actual().obtener_posicion_pantalla(_x, 0);
                this.sprite.x = pos.x;
                this.evto_se_movio.emitir({});
            }
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Actor.prototype, "y", {
        get: function () {
            var pos = pilas.escena_actual().obtener_posicion_escenario(0, this.sprite.y);
            return pos.y;
        },
        set: function (_y) {
            if (_y instanceof Array)
                pilas.interpolar(this, 'y', _y, 1);
            else {
                var pos = pilas.escena_actual().obtener_posicion_pantalla(0, _y);
                this.sprite.y = pos.y;
                this.evto_se_movio.emitir({});
            }
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Actor.prototype, "centro", {
        get: function () {
            return [this.centro_x, this.centro_y];
        },
        set: function (_valor) {
            if (typeof _valor === 'object' && _valor.length) {
                var x = _valor[0];
                var y = _valor[1];
                this.centro_x = x;
                this.centro_y = y;
            } else {
                throw Error("Solo se permite centrar usando un array de dos elementos.");
            }
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Actor.prototype, "centro_x", {
        get: function () {
            return this.sprite.regX;
        },
        set: function (_x) {
            if (_x === 'centro')
                _x = this.ancho / 2;

            if (_x === 'derecha')
                _x = this.ancho;

            if (_x === 'izquierda')
                _x = 0;

            if (typeof _x !== 'number')
                throw new Error("Solo se permite asignar números o las cadenas 'centro', 'izquierda' y 'derecha'");

            this.sprite.regX = _x;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Actor.prototype, "centro_y", {
        get: function () {
            return this.sprite.regY;
        },
        set: function (_y) {
            if (_y === 'centro')
                _y = this.alto / 2;

            if (_y === 'abajo')
                _y = this.alto;

            if (_y === 'arriba')
                _y = 0;

            if (typeof _y !== 'number')
                throw new Error("Solo se permite asignar números o las cadenas 'centro', 'abajo' y 'arriba'");

            this.sprite.regY = _y;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Actor.prototype, "escala_x", {
        get: function () {
            return this.sprite.scaleX;
        },
        set: function (valor) {
            if (valor instanceof Array)
                pilas.interpolar(this.sprite, 'scaleX', valor, 1);
            else
                this.sprite.scaleX = valor;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Actor.prototype, "escala_y", {
        get: function () {
            return this.sprite.scaleY;
        },
        set: function (valor) {
            if (valor instanceof Array)
                pilas.interpolar(this.sprite, 'scaleY', valor, 1);
            else
                this.sprite.scaleY = valor;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Actor.prototype, "escala", {
        get: function () {
            return this.escala_x;
        },
        set: function (valor) {
            if (valor instanceof Array) {
                var nuevo_radio_de_colision = [];
                for (var i = 0; i < valor.length; i++) {
                    nuevo_radio_de_colision.push((this.radio_de_colision * valor[i]) / this.escala);
                }
                pilas.interpolar(this, 'radio_de_colision', nuevo_radio_de_colision, 1);
                this.radio_de_colision = nuevo_radio_de_colision[0];
            } else {
                this.radio_de_colision = (this.radio_de_colision * valor) / this.escala;
            }

            this.escala_x = valor;
            this.escala_y = valor;
        },
        enumerable: true,
        configurable: true
    });

    Actor.prototype.escalarProporcionalALimites = function (anchoLimite, altoLimite) {
        this.escala = 1;

        var escalaAlto = this.alto / altoLimite;
        var escalaAncho = this.ancho / anchoLimite;

        var escalaMayor = Math.max(escalaAncho, escalaAlto);

        this.escala = 1.0 / escalaMayor;
    };

    Object.defineProperty(Actor.prototype, "rotacion", {
        get: function () {
            return -this.sprite.rotation;
        },
        set: function (valor) {
            if (valor instanceof Array) {
                for (var i in valor) {
                    valor[i] = -1 * (((valor[i] % 360) + 360) % 360);
                }
                pilas.interpolar(this.sprite, 'rotation', valor, 1);
            } else
                this.sprite.rotation = -1 * (((valor % 360) + 360) % 360);
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Actor.prototype, "transparencia", {
        get: function () {
            return (-100 * this.sprite.alpha) + 100;
        },
        set: function (_t) {
            this.sprite.alpha = (_t - 100) / -100;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Actor.prototype, "ancho", {
        get: function () {
            return this._imagen.ancho * this.escala_x;
        },
        set: function (nuevo) {
            this.escala_x = nuevo / this._imagen.ancho;
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Actor.prototype, "alto", {
        get: function () {
            return this._imagen.alto * this.escala_y;
        },
        set: function (nuevo) {
            this.escala_y = nuevo / this._imagen.alto;
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Actor.prototype, "imagen", {
        set: function (_i) {
            if (_i.substring)
                this._imagen = pilas.imagenes.cargar(_i);
            else
                this._imagen = _i;

            //alert(_i);
            this._crear_sprite();
            this.centro = ['centro', 'centro'];
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Actor.prototype, "izquierda", {
        /* TODO: hacer que se puedan interpolar
        las propiedades: izquierda, derecha, arriba, abajo.
        */
        get: function () {
            return this.x - (this.centro_x * this.escala);
        },
        set: function (x) {
            this.x = x + (this.centro_x * this.escala);
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Actor.prototype, "derecha", {
        get: function () {
            return this.izquierda + this.ancho;
        },
        set: function (x) {
            this.izquierda = x - this.ancho;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Actor.prototype, "arriba", {
        get: function () {
            return this.y + (this.centro_y * this.escala_y);
        },
        set: function (y) {
            this.y = y - (this.centro_y * this.escala_y);
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Actor.prototype, "abajo", {
        get: function () {
            return this.arriba - this.alto;
        },
        set: function (y) {
            this.arriba = y + this.alto;
        },
        enumerable: true,
        configurable: true
    });


    Actor.prototype.ejecutar_callbacks_clicks = function () {
        for (var i = 0; i < this.callbacks_cuando_hace_click.length; i++) {
            this.callbacks_cuando_hace_click[i]();
        }
    };

    Actor.prototype.ejecutar_callbacks_over = function () {
        for (var i = 0; i < this.callbacks_cuando_mueve_mouse.length; i++) {
            this.callbacks_cuando_mueve_mouse[i]();
        }
    };

    Object.defineProperty(Actor.prototype, "cuando_hace_click", {
        get: function () {
            return this.callbacks_cuando_hace_click;
        },
        set: function (funcion) {
            //Esta funcion no admite parametros
            this.callbacks_cuando_hace_click.push(funcion);
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Actor.prototype, "cuando_mueve_mouse", {
        get: function () {
            return this.callbacks_cuando_mueve_mouse;
        },
        set: function (funcion) {
            //Esta funcion no admite parametros
            this.callbacks_cuando_mueve_mouse.push(funcion);
        },
        enumerable: true,
        configurable: true
    });

    //metodo recibir() para gestionar los eventos
    Actor.prototype.recibir = function (evento, tipo) {
        if (tipo == pilas.escena_actual().click_de_mouse) {
            this._cuando_hace_click(evento);
        }
        if (tipo == pilas.escena_actual().mueve_mouse) {
            this._cuando_mueve_mouse(evento);
        }
    };

    Actor.prototype._cuando_hace_click = function (click) {
        if (this.colisiona_con_un_punto(click.x, click.y)) {
            this.ejecutar_callbacks_clicks();
        }
    };

    Actor.prototype._cuando_mueve_mouse = function (evento) {
        if (this.colisiona_con_un_punto(evento.x, evento.y)) {
            this.ejecutar_callbacks_over();
        }
    };

    /**
    * @method colisiona_con_un_punto
    *
    * Determina si un punto colisiona con el area del actor.
    */
    Actor.prototype.colisiona_con_un_punto = function (x, y) {
        if (x >= ((this.x - this.centro_x * this.escala_x)) && (x <= (this.x + this.centro_x * this.escala_x))) {
            if (y >= ((this.y - this.centro_y * this.escala_y)) && (y <= (this.y + this.centro_y * this.escala_y))) {
                return true;
            }
        }
        return false;
    };

    Actor.prototype.decir = function (mensaje) {
        var globo = new pilas.actores.Globo(this.izquierda + (this.ancho / 2), this.arriba, mensaje);
    };

    Actor.prototype.imitar = function (actor_o_figura) {
        this.aprender(pilas.habilidades.Imitar, { objeto_a_imitar: actor_o_figura });
    };

    Actor.prototype.pre_actualizar = function () {
        this.actualizar_comportamientos();
        this.actualizar_habilidades();
    };

    Actor.prototype.actualizar = function () {
    };

    Actor.prototype.colisiona_con = function (otro_actor) {
        return pilas.utils.colisionan(this, otro_actor);
    };

    /*
    * Comprueba si el actor se encuentra dentro del area visible de la pantalla
    */
    Actor.prototype.esta_fuera_de_la_pantalla = function () {
        var area_visible = pilas.escena_actual().camara.obtener_area_visible();
        return this.derecha < area_visible.izquierda || this.izquierda > area_visible.derecha || this.abajo > area_visible.arriba || this.arriba < area_visible.abajo;
    };

    Actor.prototype.tiene_etiqueta = function (etiqueta) {
        return this.etiquetas.indexOf(etiqueta) > -1;
    };
    return Actor;
})(Estudiante);
var Utils = (function () {
    function Utils() {
    }
    Utils.prototype.convertir_a_grados = function (angulo_en_radianes) {
        return angulo_en_radianes * (180 / Math.PI);
    };

    Utils.prototype.convertir_a_radianes = function (angulo_en_grados) {
        return angulo_en_grados * (Math.PI / 180);
    };

    Utils.prototype.colisionan = function (a, b) {
        return (this.distancia_entre_dos_actores(a, b) < a.radio_de_colision + b.radio_de_colision);
    };

    Utils.prototype.distancia_entre_dos_actores = function (a, b) {
        return this.distancia_entre_dos_puntos(a.x, a.y, b.x, b.y);
    };

    Utils.prototype.distancia_entre_dos_puntos = function (x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(this.distancia(x1, x2), 2) + Math.pow(this.distancia(y1, y2), 2));
    };

    Utils.prototype.obtener_uuid = function () {
        var uuid = Math['uuid'];
        return uuid();
    };

    Utils.prototype.distancia = function (a, b) {
        return Math.abs(b - a);
    };

    Utils.prototype.fabricar = function (clase, cantidad, posiciones_al_azar) {
        if (typeof cantidad === "undefined") { cantidad = 1; }
        if (typeof posiciones_al_azar === "undefined") { posiciones_al_azar = true; }
        var actores = [];

        for (var i = 0; i < cantidad; i++) {
            if (posiciones_al_azar) {
                var x = Math.floor(Math.random() * (320 - (-320 + 1))) - 320;
                var y = Math.floor(Math.random() * (240 - (-240 + 1))) - 240;
            } else {
                var x = 0;
                var y = 0;
            }

            var nuevo = new clase(x, y);
            actores.push(nuevo);
        }

        return new pilas.grupo.Grupo(actores);
    };
    return Utils;
})();
//modulo grupo
var grupo = (function () {
    function grupo() {
        this.Grupo = Grupo;
    }
    return grupo;
})();

var HGrupo = (function () {
    /*Se utiliza para que la clase Grupo pueda extender de ella y por ende
    extender propiedades y metodos de la clase Array */
    function HGrupo() {
        Array.apply(this, arguments);
        return new Array();
    }
    HGrupo.prototype.pop = function () {
        return "";
    };
    HGrupo.prototype.push = function (val) {
        return 0;
    };
    return HGrupo;
})();

HGrupo["prototype"] = new Array();

var Grupo = (function (_super) {
    __extends(Grupo, _super);
    function Grupo(actor_o_array) {
        _super.call(this);
        if (actor_o_array instanceof Array) {
            this.agregar_grupo(actor_o_array);
        } else if (actor_o_array instanceof Object) {
            this.agregar_actor(actor_o_array);
        }
    }
    Grupo.prototype.agregar_grupo = function (grupo) {
        for (var i = 0; i < grupo.length; i++) {
            this.agregar_actor(grupo[i]);
        }
    };

    Grupo.prototype.agregar_actor = function (actor) {
        this.push(actor);
    };

    Object.defineProperty(Grupo.prototype, "x", {
        get: function () {
            return this.__getattr__("x");
        },
        set: function (x) {
            this.__setattr__("x", x);
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Grupo.prototype, "y", {
        get: function () {
            return this.__getattr__("y");
        },
        set: function (y) {
            this.__setattr__("y", y);
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Grupo.prototype, "escala", {
        get: function () {
            return this.__getattr__("escala");
        },
        set: function (escala) {
            this.__setattr__("escala", escala);
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Grupo.prototype, "rotacion", {
        get: function () {
            return this.__getattr__("rotacion");
        },
        set: function (rotacion) {
            this.__setattr__("rotacion", rotacion);
        },
        enumerable: true,
        configurable: true
    });


    Grupo.prototype.aprender = function (habilidad, argumentos) {
        if (typeof argumentos === "undefined") { argumentos = undefined; }
        this.ejecutar_funcion("aprender", habilidad, argumentos);
    };

    Grupo.prototype.hacer = function (comportamiento, argumentos) {
        if (typeof argumentos === "undefined") { argumentos = undefined; }
        this.ejecutar_funcion("hacer", comportamiento, argumentos);
    };

    Grupo.prototype.hacer_luego = function (comportamiento, argumentos) {
        if (typeof argumentos === "undefined") { argumentos = undefined; }
        this.ejecutar_funcion("hacer_luego", comportamiento, argumentos);
    };

    Grupo.prototype.decir = function (mensaje) {
        this.ejecutar_funcion("decir", mensaje);
    };

    Grupo.prototype.eliminar = function () {
        this.ejecutar_funcion("eliminar");
    };

    Grupo.prototype.__getattr__ = function (attr) {
        var valores = [];
        for (var i = 0; i < this.length; i++) {
            valores.push(this[i][attr]);
        }
        return valores;
    };

    Grupo.prototype.__setattr__ = function (attr, valor) {
        for (var i = 0; i < this.length; i++) {
            this[i][attr] = valor;
        }
    };

    Grupo.prototype.ejecutar_funcion = function (id, argumentos1, argumentos2) {
        if (typeof argumentos1 === "undefined") { argumentos1 = undefined; }
        if (typeof argumentos2 === "undefined") { argumentos2 = undefined; }
        for (var i = 0; i < this.length; i++) {
            this[i][id](argumentos1, argumentos2);
        }
    };
    return Grupo;
})(HGrupo);
/// <reference path="actores/actor.ts"/>
var Fondo = (function (_super) {
    __extends(Fondo, _super);
    function Fondo(imagen, x, y) {
        _super.call(this, imagen, x, y);
        this.z = 1000;
    }
    return Fondo;
})(Actor);

var Tarde = (function (_super) {
    __extends(Tarde, _super);
    function Tarde() {
        _super.call(this, "fondos.tarde.jpg", 0, 0);
        this.z = 1000;
        this.y = 120; // TODO: temporal solo para tutorial.
    }
    return Tarde;
})(Fondo);

var Plano = (function (_super) {
    __extends(Plano, _super);
    function Plano() {
        _super.call(this, 'plano.png', 0, 0);
        this.sprite.regX = 0;
        this.sprite.regY = 0;
    }
    Plano.prototype.crear_sprite = function () {
        var img = this._imagen.imagen;
        var s = new createjs.Shape();

        s.graphics.beginBitmapFill(img, 'repeat');
        s.graphics.drawRect(-pilas.opciones.ancho / 2, -pilas.opciones.alto / 2, pilas.opciones.ancho, pilas.opciones.alto);
        this.sprite = s;
    };

    Plano.prototype.actualizar = function () {
    };
    return Plano;
})(Fondo);

var Pasto = (function (_super) {
    __extends(Pasto, _super);
    function Pasto() {
        _super.call(this, 'pasto.png', 0, 0);
        this.sprite.regX = 0;
        this.sprite.regY = 0;
    }
    Pasto.prototype.crear_sprite = function () {
        var img = this._imagen.imagen;
        var s = new createjs.Shape();

        s.graphics.beginBitmapFill(img, 'repeat');
        s.graphics.drawRect(-pilas.opciones.ancho / 2, -pilas.opciones.alto / 2, pilas.opciones.ancho, pilas.opciones.alto);
        this.sprite = s;
    };

    Pasto.prototype.actualizar = function () {
    };
    return Pasto;
})(Fondo);

var PastoCuadriculado = (function (_super) {
    __extends(PastoCuadriculado, _super);
    function PastoCuadriculado() {
        _super.call(this, 'pasto_cuadriculado.png', 0, 0);
    }
    PastoCuadriculado.prototype.actualizar = function () {
    };
    return PastoCuadriculado;
})(Fondo);

var Laberinto1 = (function (_super) {
    __extends(Laberinto1, _super);
    function Laberinto1() {
        _super.call(this, 'fondos.laberinto1.png', 0, 0);
    }
    Laberinto1.prototype.actualizar = function () {
    };
    return Laberinto1;
})(Fondo);

var Fondos = (function () {
    function Fondos() {
        this.Plano = Plano;
        this.Pasto = Pasto;
        this.PastoCuadriculado = PastoCuadriculado;
        this.Tarde = Tarde;
        this.Laberinto1 = Laberinto1;
    }
    return Fondos;
})();
var Imagenes = (function () {
    function Imagenes(callback_onready, opciones) {
        this.nombresImagenes = [
            'aceituna.png', 'aceituna_grita.png', 'aceituna_risa.png',
            'aceituna_burla.png',
            'banana.png', 'bomba.png', 'caja.png', 'explosion.png',
            'sin_imagen.png',
            'plano.png', 'alien.png', 'alien_marron.png', 'tuerca.png', 'nave.png',
            'piedra_chica.png', 'piedra_grande.png', 'piedra_media.png', 'ejes.png',
            'disparos.misil.png', 'rpg.maton.png', 'pasto.png',
            'pasto_cuadriculado.png', 'globo.png', 'bloque.png',
            'manzana_chica.png', 'invisible.png', 'cofre.png', 'llave.png',
            'cesto.png', 'pelota.png', 'zanahoria_normal.png',
            'zanahoria_sonrie.png', 'boton.boton_normal.png',
            'boton.boton_over.png', 'boton.boton_press.png',
            'fondos.tarde.jpg', 'fondos.laberinto1.png',
            'monkey_normal.png', 'monkey_smile.png', 'monkey_shout.png',
            'tortuga.png',
            'pingu.png', 'sombra.png',
            'cooperativista.alerta.png', 'cooperativista.camina.png',
            'cooperativista.camina_sujeta.png', 'cooperativista.ok.png',
            'cooperativista.parado.png', 'cooperativista.parado_sujeta.png',
            'cooperativista.trabajando.png'
        ];
        this.recursos = {};
        this.data_path = opciones.data_path;
        this.loader = new PxLoader();
        this.imagenes_solicitadas = 0;

        this.nombresImagenes = this.nombresImagenes.concat(opciones.imagenesExtra);
        this.cargar_recursos();

        //loader.addProgressListener(function (e) {
        //    this.actualizar_progreso(e);
        //            return true
        // });
        this.loader.addCompletionListener(function (e) {
            pilas.ready = true;
            pilas.escena_actual().iniciar();
            pilas.onready();
            pilas.ejecutar();
        });

        this.loader.start();
    }
    Imagenes.prototype.cargar_recursos = function () {
        var _this = this;
        this.nombresImagenes.forEach(function (nombre) {
            _this.cargar_recurso(nombre);
        });
    };

    Imagenes.prototype.cargar_recurso = function (nombre) {
        var path = this.data_path + '/' + nombre;
        this.recursos[nombre] = this.loader.addImage(path);
        this.imagenes_solicitadas += 1;
    };

    Imagenes.prototype.cargar = function (nombre) {
        if (nombre in this.recursos)
            return new Imagen(this.recursos[nombre]);
        else
            throw "No se puede encontrar la imagen: '" + nombre + "' ¿ha sido pre-cargada en el archivo imagenes.ts?";
    };

    Imagenes.prototype.cargar_grilla = function (nombre, columnas, filas) {
        if (typeof columnas === "undefined") { columnas = 1; }
        if (typeof filas === "undefined") { filas = 1; }
        return new Grilla(this.recursos[nombre], columnas, filas);
    };

    Imagenes.prototype.cargar_animacion = function (nombre, columnas, filas) {
        if (typeof columnas === "undefined") { columnas = 1; }
        if (typeof filas === "undefined") { filas = 1; }
        return new Animacion(this.recursos[nombre], columnas, filas);
    };
    return Imagenes;
})();

var Imagen = (function () {
    function Imagen(imagen) {
        this.ruta = imagen;
        this.imagen = imagen;
    }
    Imagen.prototype.instanciar = function () {
        return new createjs.Bitmap(this.imagen);
    };

    Imagen.prototype.avanzar = function (velocidad) {
        if (typeof velocidad === "undefined") { velocidad = 60; }
        return false;
    };

    Object.defineProperty(Imagen.prototype, "ancho", {
        get: function () {
            return this.imagen.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Imagen.prototype, "alto", {
        get: function () {
            return this.imagen.height;
        },
        enumerable: true,
        configurable: true
    });
    return Imagen;
})();

var Grilla = (function (_super) {
    __extends(Grilla, _super);
    function Grilla(imagen, columnas, filas) {
        if (typeof columnas === "undefined") { columnas = 1; }
        if (typeof filas === "undefined") { filas = 1; }
        _super.call(this, imagen);
        this.columnas = columnas;
        this.filas = filas;
        this.cuadro = 0;
    }
    Grilla.prototype.instanciar = function () {
        var data = {
            images: [this.ruta.src],
            frames: { width: this.ancho, height: this.alto }
        };
        var spritesheet = new createjs.SpriteSheet(data);

        this.sprite = new createjs.Sprite(spritesheet);
        this.definir_cuadro(0);
        return this.sprite;
    };

    Object.defineProperty(Grilla.prototype, "cantidad_cuadros", {
        get: function () {
            return this.filas * this.columnas;
        },
        enumerable: true,
        configurable: true
    });

    Grilla.prototype.definir_cuadro = function (numero_de_cuadro) {
        this.cuadro = numero_de_cuadro;
        this.sprite.gotoAndStop(numero_de_cuadro);
    };

    Grilla.prototype.avanzar = function (velocidad) {
        if (typeof velocidad === "undefined") { velocidad = 60; }
        var ha_avanzado = true;
        this.cuadro += 1;

        if (this.cuadro >= this.cantidad_cuadros) {
            this.cuadro = 0;
            ha_avanzado = false;
        }

        this.definir_cuadro(this.cuadro);
        return ha_avanzado;
    };

    Object.defineProperty(Grilla.prototype, "ancho", {
        get: function () {
            return this.imagen.width / this.columnas;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Grilla.prototype, "alto", {
        get: function () {
            return this.imagen.height / this.filas;
        },
        enumerable: true,
        configurable: true
    });
    return Grilla;
})(Imagen);

var Animacion = (function (_super) {
    __extends(Animacion, _super);
    function Animacion(imagen, columnas, filas) {
        if (typeof columnas === "undefined") { columnas = 1; }
        if (typeof filas === "undefined") { filas = 1; }
        _super.call(this, imagen, columnas, filas);
        this.animaciones = {};
        this.animacion_en_curso = null;
        this.cuadro_en_la_animacion = 0;
        this._ticks_acumulados = 0;
    }
    Animacion.prototype.definir_animacion = function (nombre, cuadros, velocidad) {
        this.animaciones[nombre] = {
            cuadros: cuadros,
            velocidad: velocidad
        };
    };

    Animacion.prototype.cargar_animacion = function (nombre) {
        if (this.animacion_en_curso !== this.animaciones[nombre]) {
            this._ticks_acumulados = 0;
            this.animacion_en_curso = this.animaciones[nombre];
            this.cuadro_en_la_animacion = 0;
            this.definir_cuadro(this.animacion_en_curso["cuadros"][this.cuadro_en_la_animacion]);
        }
    };

    Animacion.prototype.avanzar = function (velocidad) {
        if (typeof velocidad === "undefined") { velocidad = -1; }
        if (velocidad !== -1)
            throw new Error("Tienes que definir la velocidad usando 'definir_animacion' no llamando al metodo avanzar con un numero.");

        if (!this.animacion_en_curso)
            throw new Error("Tienes que definir al menos una animacion inicial.");

        var velocidad_de_animacion = (1000.0 / 60) * this.animacion_en_curso["velocidad"];
        this._ticks_acumulados += velocidad_de_animacion;
        var ha_avanzado = true;

        if (this._ticks_acumulados > 1000.0) {
            this._ticks_acumulados -= 1000.0;

            if (this.cuadro_en_la_animacion >= this.animacion_en_curso['cuadros'].length) {
                this.cuadro_en_la_animacion = 0;
                ha_avanzado = false;
            }

            this.definir_cuadro(this.animacion_en_curso['cuadros'][this.cuadro_en_la_animacion]);
            this.cuadro_en_la_animacion += 1;
        }

        return ha_avanzado;
    };
    return Animacion;
})(Grilla);
var GestorDeEscenas = (function () {
    function GestorDeEscenas() {
        //this.escenas = [];
        this.escena = null;
    }
    GestorDeEscenas.prototype.cambiar_escena = function (nueva_escena) {
        this.escena = nueva_escena;
        if (pilas.ready) {
            this.escena.iniciar();
        }
        this.actualizar(); // NOTA: se ejecuta para que los actores
        //       tomen su posición inicial.
    };

    GestorDeEscenas.prototype.actualizar = function () {
        var escena = this.escena_actual();
        escena.actualizar();
    };

    GestorDeEscenas.prototype.escena_actual = function () {
        return this.escena;
    };
    return GestorDeEscenas;
})();
var DepuradorDeshabilitado = (function () {
    function DepuradorDeshabilitado() {
        this.modos = [];
        this.diccionario_modos = {};
    }
    DepuradorDeshabilitado.prototype.actualizar = function () {
        for (var i = 0; i < this.modos.length; i++) {
            this.modos[i].actualizar();
        }
    };

    DepuradorDeshabilitado.prototype.definir_modos = function (modos) {
        modos = modos || {};
        modos.puntos_de_control = modos.puntos_de_control || false;
        modos.radios_de_colision = modos.radios_de_colision || false;
        modos.fisica = modos.fisica || false;
        modos.area = modos.area || false;
        modos.posiciones = modos.posiciones || false;

        this.eliminar_todos_los_modos();

        if (modos.radios_de_colision)
            this.modos.push(new ModoRadiosDeColision());

        if (modos.puntos_de_control)
            this.modos.push(new ModoPuntosDeControl());

        if (modos.fisica)
            this.modos.push(new ModoFisica());

        if (modos.area)
            this.modos.push(new ModoArea());

        if (modos.posiciones)
            this.modos.push(new ModoPosicion());

        this.diccionario_modos = modos;
    };

    DepuradorDeshabilitado.prototype.eliminar_todos_los_modos = function () {
        for (var i = 0; i < this.modos.length; i++)
            this.modos[i].eliminar();

        this.modos = [];
    };

    DepuradorDeshabilitado.prototype.obtener_modos = function () {
        return this.diccionario_modos;
    };
    return DepuradorDeshabilitado;
})();

var ModoDeDepuracion = (function () {
    function ModoDeDepuracion() {
        this.container = new createjs.Container();

        this.shape = new createjs.Shape();
        this.container.addChild(this.shape);

        pilas.escena_actual().stage.addChild(this.container);

        this.grosor_linea = 2;
    }
    ModoDeDepuracion.prototype.eliminar = function () {
        pilas.escena_actual().stage.removeChild(this.container);
    };

    ModoDeDepuracion.prototype.actualizar = function () {
        this.shape.graphics.clear();
    };
    return ModoDeDepuracion;
})();

var ModoRadiosDeColision = (function (_super) {
    __extends(ModoRadiosDeColision, _super);
    function ModoRadiosDeColision() {
        _super.apply(this, arguments);
    }
    ModoRadiosDeColision.prototype.actualizar = function () {
        _super.prototype.actualizar.call(this);
        var escena = pilas.escena_actual();
        for (var i = 0; i < escena.actores.length; i++) {
            var actor = escena.actores[i];
            var posicion = escena.obtener_posicion_pantalla(actor.x, actor.y);

            this.shape.graphics.beginStroke("#FFF").setStrokeStyle(this.grosor_linea).drawCircle(posicion.x, posicion.y, actor.radio_de_colision).endStroke();
        }
    };
    return ModoRadiosDeColision;
})(ModoDeDepuracion);

var ModoArea = (function (_super) {
    __extends(ModoArea, _super);
    function ModoArea() {
        _super.apply(this, arguments);
    }
    ModoArea.prototype.actualizar = function () {
        _super.prototype.actualizar.call(this);
        var escena = pilas.escena_actual();

        for (var i = 0; i < escena.actores.length; i++) {
            var actor = escena.actores[i];
            var posicion = escena.obtener_posicion_pantalla(actor.x, actor.y);

            this.shape.graphics.beginStroke("#FFF").setStrokeStyle(this.grosor_linea).drawRect(posicion.x - actor.ancho / 2, posicion.y - actor.alto / 2, actor.ancho, actor.alto).endStroke();
        }
    };
    return ModoArea;
})(ModoDeDepuracion);

var ModoPuntosDeControl = (function (_super) {
    __extends(ModoPuntosDeControl, _super);
    function ModoPuntosDeControl() {
        _super.apply(this, arguments);
    }
    ModoPuntosDeControl.prototype.actualizar = function () {
        _super.prototype.actualizar.call(this);
        var escena = pilas.escena_actual();

        for (var i = 0; i < escena.actores.length; i++) {
            var actor = escena.actores[i];
            var posicion = escena.obtener_posicion_pantalla(actor.x, actor.y);
            var size = 3;

            // Dibuja una cruz negra
            size = 4;
            this.shape.graphics.beginStroke("#000").setStrokeStyle(this.grosor_linea + 2).moveTo(posicion.x - size, posicion.y - size).lineTo(posicion.x + size, posicion.y + size).endStroke();
            this.shape.graphics.beginStroke("#000").setStrokeStyle(this.grosor_linea + 2).moveTo(posicion.x - size, posicion.y + size).lineTo(posicion.x + size, posicion.y - size).endStroke();

            // Dibuja una cruz blanca
            size = 3;
            this.shape.graphics.beginStroke("#FFF").setStrokeStyle(this.grosor_linea).moveTo(posicion.x - size, posicion.y - size).lineTo(posicion.x + size, posicion.y + size).endStroke();
            this.shape.graphics.beginStroke("#FFF").setStrokeStyle(this.grosor_linea).moveTo(posicion.x - size, posicion.y + size).lineTo(posicion.x + size, posicion.y - size).endStroke();
        }
    };
    return ModoPuntosDeControl;
})(ModoDeDepuracion);

var ModoFisica = (function (_super) {
    __extends(ModoFisica, _super);
    function ModoFisica() {
        _super.apply(this, arguments);
    }
    ModoFisica.prototype.actualizar = function () {
        _super.prototype.actualizar.call(this);
        var escena = pilas.escena_actual();
        this.shape.graphics.setStrokeStyle(this.grosor_linea);
        escena.fisica.dibujar_figuras_sobre_lienzo(this.shape.graphics);
    };
    return ModoFisica;
})(ModoDeDepuracion);

var ModoPosicion = (function (_super) {
    __extends(ModoPosicion, _super);
    function ModoPosicion() {
        _super.call(this);
        this.text_coordenada = new createjs.Text("Posición del mouse: x=12 y=33", "12px Arial", "white");
        this.text_coordenada.y = 920 / 2; //TODO: Tamaño decanvas 640*480
        this.text_coordenada.x = 900 / 2;
        this.container.addChild(this.text_coordenada);
        this.eje = new pilas.actores.Eje();
        this.sobre_escribir_dibujado();
    }
    ModoPosicion.prototype.sobre_escribir_dibujado = function () {
        var anterior_draw = this.shape.graphics.draw;
        var g = this.shape.graphics;
        this.shape.graphics.actores = [];

        this.shape.graphics.draw = function (a) {
            a.fillStyle = "white";

            for (var i = 0; i < this.actores.length; i++) {
                var actor = this.escena.actores[i];
                var posicion = this.escena.obtener_posicion_pantalla(actor.x, actor.y);

                a.fillText(" (" + Math.floor(actor.x) + ", " + Math.floor(actor.y) + ")", posicion.x + 10, posicion.y + 10);
            }

            anterior_draw.call(g, a);
        };
    };

    ModoPosicion.prototype.eliminar = function () {
        _super.prototype.eliminar.call(this);
        this.eje.eliminar();
    };

    ModoPosicion.prototype.actualizar = function () {
        _super.prototype.actualizar.call(this);
        var escena = pilas.escena_actual();
        this.shape.graphics.actores = escena.actores;
        this.shape.graphics.escena = escena;

        for (var i = 0; i < escena.actores.length; i++) {
            var actor = escena.actores[i];
            var posicion = escena.obtener_posicion_pantalla(actor.x, actor.y);
            var size = 3;

            // Dibuja un punto
            this.shape.graphics.beginFill("#FFF").setStrokeStyle(this.grosor_linea).drawCircle(posicion.x, posicion.y, 2);
        }

        var pos = escena.obtener_posicion_escenario(escena.stage.mouseX, escena.stage.mouseY);
        this.text_coordenada.text = "Posición del mouse: x=" + Math.floor(pos.x) + " y=" + Math.floor(pos.y);
    };
    return ModoPosicion;
})(ModoDeDepuracion);
/// <reference path="gestor_escenas.ts" />
/// <reference path="depurador.ts" />
/// <reference path="pilas.ts" />
var Mundo = (function () {
    function Mundo() {
        this.gestor_escenas = new GestorDeEscenas();
        this.depurador = new DepuradorDeshabilitado();
    }
    Mundo.prototype.actualizar = function () {
        this.gestor_escenas.actualizar();
        this.depurador.actualizar();
    };

    Mundo.prototype.definir_modos = function (modos) {
        this.depurador.definir_modos(modos);
    };

    Mundo.prototype.obtener_modos = function () {
        return this.depurador.obtener_modos();
    };

    Mundo.prototype.agregar_tarea_una_vez = function (tiempo, funcion, parametros, parent) {
        if (typeof parametros === "undefined") { parametros = undefined; }
        if (typeof parent === "undefined") { parent = undefined; }
        pilas.escena_actual().tareas.una_vez(tiempo, funcion, parametros, parent);
    };

    Mundo.prototype.agregar_tarea_siempre = function (tiempo, funcion, parametros, parent) {
        if (typeof parametros === "undefined") { parametros = undefined; }
        if (typeof parent === "undefined") { parent = undefined; }
        pilas.escena_actual().tareas.siempre(tiempo, funcion, parametros, parent);
    };
    return Mundo;
})();
var simbolos = {
    IZQUIERDA: 37,
    DERECHA: 39,
    ARRIBA: 38,
    ABAJO: 40,
    ESPACIO: 32,
    W: 87,
    A: 65,
    S: 83,
    D: 68,
    J: 74
};
/// <reference path="simbolos.ts" />
/// <reference path="pilas.ts" />
/**
* @class Control
*
* Representa un control de teclado sencillo.
*
* Este objeto permite acceder al estado del teclado usando atributos.
*
* Por ejemplo, con este objeto, para saber si el usuario está
* pulsando el direccional hacia la izquierda puedes ejecutar::
*
*     @example
*     if (pilas.escena_actual().control.izquierda) {
*       console.log('Ha pulsado hacia la izquierda');
*     }
*
* Es decir, si bien Control es una clase, no hace falta
* instanciarla. Ya existe un objeto que se puede consultar bajo el
* nombre ``pilas.escena_actual().control``.
*
* Entonces, una vez que tienes la referencia para consultar, los
* atributos que tiene este objeto control son::
*
*     @example
*     izquierda
*     derecha
*     arriba
*     abajo
*     boton
*
* Cada uno de estos atributos te pueden devolver true, o false,
* indicando si el control está pulsado o no.
*/
var Control = (function () {
    function Control(escena) {
        this.izquierda = false;
        this.derecha = false;
        this.arriba = false;
        this.abajo = false;
        this.boton = false;

        escena.pulsa_tecla.conectar(this);
        escena.suelta_tecla.conectar(this);
    }
    Control.prototype.recibir = function (evento, tipo) {
        if (tipo == pilas.escena_actual().pulsa_tecla) {
            this.cuando_pulsa_una_tecla(evento);
        }
        if (tipo == pilas.escena_actual().suelta_tecla) {
            this.cuando_suelta_una_tecla(evento);
        }
    };

    Control.prototype.cuando_pulsa_una_tecla = function (evento) {
        switch (evento.codigo) {
            case simbolos.IZQUIERDA: {
                this.izquierda = true;
                break;
            }
            case simbolos.DERECHA: {
                this.derecha = true;
                break;
            }
            case simbolos.ARRIBA: {
                this.arriba = true;
                break;
            }
            case simbolos.ABAJO: {
                this.abajo = true;
                break;
            }
            case simbolos.ESPACIO: {
                this.boton = true;
                break;
            }

            case simbolos.W: {
                this.arriba = true;
                break;
            }

            case simbolos.A: {
                this.izquierda = true;
                break;
            }

            case simbolos.D: {
                this.derecha = true;
                break;
            }

            case simbolos.S: {
                this.abajo = true;
                break;
            }

            case simbolos.J: {
                this.boton = true;
                break;
            }
        }
    };

    Control.prototype.cuando_suelta_una_tecla = function (evento) {
        switch (evento.codigo) {
            case simbolos.IZQUIERDA: {
                this.izquierda = false;
                break;
            }
            case simbolos.DERECHA: {
                this.derecha = false;
                break;
            }
            case simbolos.ARRIBA: {
                this.arriba = false;
                break;
            }
            case simbolos.ABAJO: {
                this.abajo = false;
                break;
            }
            case simbolos.ESPACIO: {
                this.boton = false;
                break;
            }

            case simbolos.W: {
                this.arriba = false;
                break;
            }

            case simbolos.A: {
                this.izquierda = false;
                break;
            }

            case simbolos.D: {
                this.derecha = false;
                break;
            }

            case simbolos.S: {
                this.abajo = false;
                break;
            }

            case simbolos.J: {
                this.boton = false;
                break;
            }
        }
    };
    return Control;
})();
/**
* @class Camara
*
* Representa la cámara que visualiza el escenario y permite hacer movimientos
* de pantalla.
*
* Esta clase también se encarga de transformar el sistema de referencia
* entre coordenadas de pantalla y coordenadas de escenario.
*/
var Camara = (function () {
    function Camara(escenario) {
        this.centro_x = pilas.opciones.ancho / 2;
        this.centro_y = pilas.opciones.alto / 2;

        this.escenario = escenario;
    }
    Object.defineProperty(Camara.prototype, "x", {
        get: function () {
            return this.escenario.x;
        },
        set: function (_x) {
            if (_x instanceof Array)
                pilas.interpolar(this.escenario, "x", [-_x], 1);
            else {
                this.escenario.x = -_x;
            }
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Camara.prototype, "y", {
        get: function () {
            return this.escenario.y;
        },
        set: function (_y) {
            if (_y instanceof Array)
                pilas.interpolar(this.escenario, "y", [-_y], 1);
            else {
                this.escenario.y = -_y;
            }
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Camara.prototype, "zoom", {
        get: function () {
            return this.escenario.scaleX;
        },
        set: function (_z) {
            if (_z instanceof Array) {
                pilas.interpolar(this.escenario, "scaleX", [1 + _z * 0.1], 1);
                pilas.interpolar(this.escenario, "scaleY", [1 + _z * 0.1], 1);
            } else {
                this.escenario.scaleX = 1 + _z * 0.1;
                this.escenario.scaleY = 1 + _z * 0.1;
            }
        },
        enumerable: true,
        configurable: true
    });


    /**
    * @method obtener_posicion_pantalla
    *
    * Convierte una posición del escenario de pilas al formato
    * de coordenadas del navegador.
    *
    * Por ejemplo, el punto (0, 0) es el centro del escenario para
    * pilas, pero el navegador lo interpreta como el punto (160, 120).
    */
    Camara.prototype.obtener_posicion_pantalla = function (x, y) {
        return { x: x + this.centro_x, y: this.centro_y - y };
    };

    /**
    * @method obtener_posicion_escenario
    *
    * Convierte una posición dada en un sistema de coordenadas
    * tradicional, en una posición de escenario, donde el punto (0, 0)
    * es el centro de la pantalla.
    */
    Camara.prototype.obtener_posicion_escenario = function (x, y) {
        return { x: x - this.centro_x, y: this.centro_y - y };
    };

    Camara.prototype.obtener_posicion = function () {
        return {
            x: this.centro_x - this.x,
            y: this.centro_y + this.y };
    };

    /*
    * Convierte una coordenada de pilas (donde 0,0 es el centro de pantalla)
    * en una coordenada real de pantalla (donde 0,0 es la esquina superior izquierda).
    */
    Camara.prototype.convertir_de_posicion_relativa_a_fisica = function (x, y) {
        var centro = this.obtener_posicion();
        return {
            x: centro.x + x,
            y: centro.y - y };
    };

    /*
    * Convierte una coordenada real de pantalla (donde 0,0 es la esquina superior izquierda)
    * en una coordenada de pilas (donde 0,0 es el centro de pantalla).
    */
    Camara.prototype.convertir_de_posicion_fisica_a_relativa = function (x, y) {
        var centro = this.obtener_posicion();
        return {
            x: -centro.x + x,
            y: +centro.y - y };
    };

    /*
    * Obtiene el area visible de la pantalla.
    * return: object
    */
    Camara.prototype.obtener_area_visible = function () {
        var ancho = pilas.opciones.ancho;
        var alto = pilas.opciones.alto;

        return {
            izquierda: this.x - ancho / 2, derecha: this.x + ancho / 2, arriba: this.y + alto / 2, abajo: this.y - alto / 2 };
    };
    return Camara;
})();
var Evento = (function () {
    function Evento(nombre) {
        this.respuestas = {};
        this.nombre = nombre;
    }
    Evento.prototype.emitir = function (evento) {
        for (var nombre_respuesta in this.respuestas) {
            var respuesta = this.respuestas[nombre_respuesta];
            if (typeof (respuesta) == 'object') {
                respuesta.recibir(evento, this);
            } else {
                respuesta(evento);
            }
        }
    };

    Evento.prototype.conectar = function (respuesta) {
        this.respuestas[respuesta.toString() + Math.random().toString()] = respuesta;
    };

    Evento.prototype.desconectar = function (respuesta) {
        delete this.respuestas[respuesta.toString()];
    };
    return Evento;
})();

var ProxyEventos = (function () {
    function ProxyEventos() {
        this.click_de_mouse = pilas.escena_actual().click_de_mouse;
        this.cuando_termina_click = pilas.escena_actual().cuando_termina_click;
        this.mueve_mouse = pilas.escena_actual().mueve_mouse;
        this.actualiza = pilas.escena_actual().actualiza;
        this.pulsa_tecla = pilas.escena_actual().pulsa_tecla;
        this.suelta_tecla = pilas.escena_actual().suelta_tecla;
        this.Evento = Evento;
    }
    return ProxyEventos;
})();
/// <reference path="control.ts" />
/// <reference path="camara.ts" />
/// <reference path="evento.ts" />
/// <reference path="pilas.ts" />
var escena = (function () {
    function escena() {
        this.Base = Base;
        this.Normal = Normal;
    }
    return escena;
})();

var Base = (function () {
    function Base() {
        this.click_de_mouse = new Evento('click_de_mouse'); // ['boton', 'x', 'y']
        this.cuando_termina_click = new Evento('cuando_termina_click'); // ['boton', 'x', 'y']
        this.mueve_mouse = new Evento('mueve_mouse'); // ['x', 'y', 'dx', 'dy']
        this.pulsa_tecla = new Evento('pulsa_tecla'); // ['codigo', 'texto']
        this.suelta_tecla = new Evento('suelta_tecla'); // ['codigo', 'texto']
        this.actualiza = new Evento('actualiza'); // []
        this.stage = new createjs.Stage(pilas.canvas);

        this.stage.snapToPixel = true;

        this.camara = new Camara(this.stage);
        this.fisica = new Fisica(this.camara);
        this.control = new Control(this);

        this.actores = [];
        this.tareas = new pilas.tareas.Tareas();
    }
    Base.prototype.iniciar = function () {
        throw "Tienes que re-definir el método iniciar";
    };

    Base.prototype.actualizar = function () {
        this.fisica.actualizar();
        this.tareas.actualizar();

        var copiaActores = this.actores.slice();

        for (var i = 0; i < this.actores.length; i++) {
            copiaActores[i].pre_actualizar();
            copiaActores[i].actualizar();
        }

        this.actualiza.emitir();
        pilas.colisiones.verificar_colisiones();

        this.stage.update();

        if (this.necesita_ordenar_actores())
            this.ordenar_actores_por_valor_z();
    };

    Base.prototype.necesita_ordenar_actores = function () {
        var ultimo_z = 300000000;

        for (var i = 0; i < this.stage.children.length; i++) {
            if (this.stage.children[i].z > ultimo_z) {
                console.log("necesita actualizar!");
                return true;
            }

            ultimo_z = this.stage.children[i].z;
        }
    };

    Base.prototype.ordenar_actores_por_valor_z = function () {
        var sortFunction = function (a, b) {
            if (a.z < b.z)
                return 1;
            if (a.z > b.z)
                return -1;
            return 0;
        };

        this.stage.sortChildren(sortFunction);
    };

    Base.prototype.agregar_actor = function (actor) {
        if (this.actores[1]) {
            actor.z = this.actores[this.actores.length - 1].z - 1;
        }
        this.actores.push(actor);

        this.stage.addChild(actor.sprite);
        this.stage.update();
    };

    Base.prototype.eliminar_actor = function (actor) {
        var index = this.actores.indexOf(actor);
        this.actores.splice(index, 1);

        this.stage.removeChild(actor.sprite);
        this.stage.update();
    };

    Base.prototype.obtener_posicion_pantalla = function (x, y) {
        return this.camara.obtener_posicion_pantalla(x, y);
    };

    Base.prototype.obtener_posicion_escenario = function (x, y) {
        return this.camara.obtener_posicion_escenario(x, y);
    };
    return Base;
})();

/**
* @class Normal
*
* Escena básica de pilas.
*
* Si no se define ninguna escena, cuando se ejecuta:
*
*     @example
*     pilas.iniciar();
*
* esta es la escena que se muestra en la pantalla.
*
*/
var Normal = (function (_super) {
    __extends(Normal, _super);
    function Normal() {
        _super.apply(this, arguments);
    }
    Normal.prototype.iniciar = function () {
        this.fondo = new pilas.fondos.Plano();
    };
    return Normal;
})(Base);
var Interpolaciones = (function () {
    function Interpolaciones() {
    }
    Interpolaciones.prototype.interpolar = function (objeto, atributo, valor_o_valores, tiempo, tipo) {
        var tiempo = tiempo * 1000 || 1000;
        var step = tiempo / valor_o_valores.length;
        var tipo = tipo || createjs.Ease.none;
        var tween = createjs.Tween.get(objeto);

        for (var i = 0; i < valor_o_valores.length; i++) {
            var attr = atributo.toString();
            var diccionario = {};
            diccionario[attr] = valor_o_valores[i];
            tween = tween.to(diccionario, step, tipo);
        }
    };

    Interpolaciones.prototype.AceleracionGradual = function (objeto, atributo, valor_o_valores, tiempo) {
        return this.interpolar(objeto, atributo, valor_o_valores, tiempo, createjs.Ease.cubicin);
    };

    Interpolaciones.prototype.DesaceleracionGradual = function (objeto, atributo, valor_o_valores, tiempo) {
        return this.interpolar(objeto, atributo, valor_o_valores, tiempo, createjs.Ease.cubicOut);
    };

    Interpolaciones.prototype.ReboteInicial = function (objeto, atributo, valor_o_valores, tiempo) {
        return this.interpolar(objeto, atributo, valor_o_valores, tiempo, createjs.Ease.bounceIn);
    };

    Interpolaciones.prototype.ReboteFinal = function (objeto, atributo, valor_o_valores, tiempo) {
        return this.interpolar(objeto, atributo, valor_o_valores, tiempo, createjs.Ease.bounceOut);
    };

    Interpolaciones.prototype.ElasticoInicial = function (objeto, atributo, valor_o_valores, tiempo) {
        return this.interpolar(objeto, atributo, valor_o_valores, tiempo, createjs.Ease.elasticIn);
    };

    Interpolaciones.prototype.ElasticoFinal = function (objeto, atributo, valor_o_valores, tiempo) {
        return this.interpolar(objeto, atributo, valor_o_valores, tiempo, createjs.Ease.elasticOut);
    };
    return Interpolaciones;
})();
var PPM = 30;

var box2d = {
    b2Vec2: Box2D.Common.Math.b2Vec2,
    b2AABB: Box2D.Collision.b2AABB,
    b2BodyDef: Box2D.Dynamics.b2BodyDef,
    b2Body: Box2D.Dynamics.b2Body,
    b2FixtureDef: Box2D.Dynamics.b2FixtureDef,
    b2Fixture: Box2D.Dynamics.b2Fixture,
    b2World: Box2D.Dynamics.b2World,
    b2PolygonShape: Box2D.Collision.Shapes.b2PolygonShape,
    b2DebugDraw: Box2D.Dynamics.b2DebugDraw,
    b2MouseJointDef: Box2D.Dynamics.Joints.b2MouseJointDef
};

function convertir_a_metros(valor) {
    return valor / PPM;
}

function convertir_a_pixels(valor) {
    return valor * PPM;
}

var Figura = (function () {
    function Figura(fisica) {
        this.fisica = fisica;
        this.camara = fisica.camara;
        this.id = pilas.utils.obtener_uuid();
    }
    Object.defineProperty(Figura.prototype, "x", {
        get: function () {
            return this.obtener_posicion().x;
        },
        set: function (_x) {
            this.definir_posicion(_x, this.cuerpo.GetPosition().y);
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Figura.prototype, "y", {
        get: function () {
            return this.obtener_posicion().y;
        },
        set: function (_y) {
            this.definir_posicion(this.cuerpo.GetPosition().x, _y);
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Figura.prototype, "rotacion", {
        get: function () {
            return this.obtener_rotacion();
        },
        set: function (angulo) {
            this.definir_rotacion(angulo);
        },
        enumerable: true,
        configurable: true
    });


    Figura.prototype.obtener_posicion = function () {
        var posicion = this.cuerpo.GetPosition();
        var x = convertir_a_pixels(posicion.x);
        var y = convertir_a_pixels(posicion.y);

        return this.camara.convertir_de_posicion_fisica_a_relativa(x, y);
    };

    Figura.prototype.definir_posicion = function (x, y) {
        var v = this.cuerpo.GetPosition();
        var pos = this.camara.convertir_de_posicion_relativa_a_fisica(x, y);

        var _x = convertir_a_metros(pos.x);
        var _y = convertir_a_metros(pos.y);

        v.x = _x;
        v.y = _y;

        this.cuerpo.SetPosition(v);
        this.empujar(0, 0);
    };

    Figura.prototype.obtener_rotacion = function () {
        return (this.cuerpo.GetAngle() * 180) / Math.PI;
    };

    Figura.prototype.definir_rotacion = function (angulo) {
        this.cuerpo.SetAngle(pilas.utils.convertir_a_radianes(angulo));
    };

    Figura.prototype.empujar = function (dx, dy) {
        var v = this.cuerpo.GetLinearVelocity();
        v.x = convertir_a_metros(dx);
        v.y = convertir_a_metros(dy);
        this.cuerpo.SetLinearVelocity(v);
    };

    Figura.prototype.eliminar = function () {
        this.fisica.mundo.DestroyBody(this.cuerpo);
    };
    return Figura;
})();

var Rectangulo = (function (_super) {
    __extends(Rectangulo, _super);
    function Rectangulo(fisica, x, y, ancho, alto, opciones) {
        _super.call(this, fisica);

        var opciones = opciones || {};

        if (opciones.dinamico === undefined)
            opciones.dinamico = true;

        var bodyDef = new box2d.b2BodyDef;

        if (opciones.dinamico)
            bodyDef.type = box2d.b2Body.b2_dynamicBody;
        else
            bodyDef.type = box2d.b2Body.b2_staticBody;

        var pos = this.fisica.camara.convertir_de_posicion_relativa_a_fisica(x, y);
        bodyDef.position.Set(convertir_a_metros(pos.x), convertir_a_metros(pos.y));

        //bodyDef.userData=data;
        var polygonShape = new box2d.b2PolygonShape;
        polygonShape.SetAsBox(convertir_a_metros(ancho / 2), convertir_a_metros(alto / 2));

        var fixtureDef = new box2d.b2FixtureDef;
        fixtureDef.density = 1.0;
        fixtureDef.friction = 0.5;
        fixtureDef.restitution = 0.5;
        fixtureDef.shape = polygonShape;

        var body = this.fisica.mundo.CreateBody(bodyDef);
        body.CreateFixture(fixtureDef);

        this.cuerpo = body;
    }
    return Rectangulo;
})(Figura);

var Circulo = (function (_super) {
    __extends(Circulo, _super);
    function Circulo(fisica, x, y, radio, opciones) {
        _super.call(this, fisica);
        this._radio = convertir_a_metros(radio);
        this._escala = 1;

        var opciones = opciones || {};

        if (opciones.dinamico === undefined)
            opciones.dinamico = true;

        var fixDef = new Box2D.Dynamics.b2FixtureDef;

        fixDef.density = opciones.densidad || 1.0;
        fixDef.friction = opciones.friccion || 0.5;
        fixDef.restitution = opciones.restitucion || 0.2;

        fixDef.shape = new Box2D.Collision.Shapes.b2CircleShape(this._radio);

        // crear el body dinamico
        var bodyDef = new Box2D.Dynamics.b2BodyDef;

        var posicion = this.camara.convertir_de_posicion_relativa_a_fisica(x, y);
        posicion.x = convertir_a_metros(posicion.x);
        posicion.y = convertir_a_metros(posicion.y);

        bodyDef.position.x = posicion.x;
        bodyDef.position.y = posicion.y;

        if (opciones.dinamico)
            bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
        else
            bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;

        this.cuerpo = this.fisica.mundo.CreateBody(bodyDef);
        this.cuerpo.CreateFixture(fixDef);
    }
    Circulo.prototype.definir_radio = function () {
        var fixture = this.cuerpo.GetFixtureList();

        if (fixture) {
            var shape = fixture.GetShape();
            shape.SetRadius(this._radio);
        }
    };


    Object.defineProperty(Circulo.prototype, "radio", {
        get: function () {
            return convertir_a_pixels(this._radio);
        },
        set: function (radio) {
            if (radio instanceof Array) {
                pilas.interpolar(this, "radio", radio, 1);
            } else {
                this._escala = (this._escala * radio) / this.radio;
                this._radio = convertir_a_metros(radio);
                this.definir_radio();
            }
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Circulo.prototype, "escala", {
        get: function () {
            return this._escala;
        },
        set: function (escala) {
            if (escala instanceof Array) {
                pilas.interpolar(this, "escala", escala, 1);
            } else {
                this._radio = (this._radio * escala) / this.escala;
                this._escala = escala;
                this.definir_radio();
            }
        },
        enumerable: true,
        configurable: true
    });
    return Circulo;
})(Figura);

var Fisica = (function () {
    function Fisica(camara) {
        this.camara = camara;
        this.mundo = new box2d.b2World(new box2d.b2Vec2(0, 10), false);
        this.Rectangulo = Rectangulo; // TODO: separar fisica como Motor y Módulo, dos clases separadas.
        this.Circulo = Circulo; // TODO: separar fisica como Motor y Módulo, dos clases separadas.
        this.velocidad = 1.0;
        this.timeStep = this.velocidad / 120.0;

        // Bordes del escenario
        this.crear_rectangulo(0, -pilas.opciones.alto / 2, pilas.opciones.ancho, 5, { dinamico: false }); // abajo
        this.crear_rectangulo(0, pilas.opciones.alto / 2, pilas.opciones.ancho, 5, { dinamico: false }); // arriba
        this.crear_rectangulo(-pilas.opciones.ancho / 2, 0, 5, pilas.opciones.alto, { dinamico: false }); // izquierda
        this.crear_rectangulo(pilas.opciones.ancho / 2, 0, 5, pilas.opciones.alto, { dinamico: false }); // derecha
    }
    Fisica.prototype.actualizar = function () {
        this.mundo.Step(this.timeStep, 6, 3);
        this.mundo.ClearForces();
    };

    Fisica.prototype.definir_gravedad = function (dx, dy) {
        this.mundo.SetGravity(new box2d.b2Vec2(dx, dy));
    };

    Fisica.prototype.dibujar_figuras_sobre_lienzo = function (graphics) {
        for (var b = this.mundo.m_bodyList; b != null; b = b.m_next) {
            var fixture = b.GetFixtureList();

            if (fixture) {
                var x = b.GetPosition().x * PPM;
                var y = b.GetPosition().y * PPM;
                var shape = fixture.GetShape();

                // dibuja un circulo en el centro de la figura.
                //graphics.beginStroke("#FFF").
                //    drawCircle(
                //      x,
                //      y,
                //      5
                //    ).
                //endStroke();
                if (shape.GetRadius !== undefined) {
                    var radio = shape.GetRadius();
                    graphics.beginStroke("#FFF").drawCircle(x, y, convertir_a_pixels(radio)).endStroke();

                    var dx = Math.cos(b.GetAngle());
                    var dy = Math.sin(b.GetAngle());

                    graphics.beginStroke("white").moveTo(x, y).lineTo(x + convertir_a_pixels(dx * radio), y + convertir_a_pixels(dy * radio)).endStroke();
                }

                if (shape.b2PolygonShape !== undefined) {
                    var vertices = shape.GetVertices();
                    var v2 = {};

                    // TODO: reconstruir para que dibuje poligonos de cualquier cantidad
                    //       de vertices.
                    v2[0] = this.convertir_vector_relativo_a_pantalla(b, x, y, vertices[0]);
                    v2[1] = this.convertir_vector_relativo_a_pantalla(b, x, y, vertices[1]);
                    v2[2] = this.convertir_vector_relativo_a_pantalla(b, x, y, vertices[2]);
                    v2[3] = this.convertir_vector_relativo_a_pantalla(b, x, y, vertices[3]);

                    graphics.beginStroke("white").moveTo(v2[0].x, v2[0].y).lineTo(v2[1].x, v2[1].y).lineTo(v2[2].x, v2[2].y).lineTo(v2[3].x, v2[3].y).lineTo(v2[0].x, v2[0].y).endStroke();
                }
            }
        }
    };

    Fisica.prototype.convertir_vector_relativo_a_pantalla = function (cuerpo, x, y, v) {
        var vector_salida = cuerpo.GetWorldVector(v);
        return {
            x: vector_salida.x * PPM + x,
            y: vector_salida.y * PPM + y };
    };

    Fisica.prototype.createBox = function (width, height, pX, pY, type, data) {
        var bodyDef = new box2d.b2BodyDef;
        bodyDef.type = type;
        bodyDef.position.Set(pX / PPM, pY / PPM);

        //bodyDef.userData=data;
        var polygonShape = new box2d.b2PolygonShape;
        polygonShape.SetAsBox(width / 2 / PPM, height / 2 / PPM);

        var fixtureDef = new box2d.b2FixtureDef;
        fixtureDef.density = 1.0;
        fixtureDef.friction = 0.5;
        fixtureDef.restitution = 0.5;
        fixtureDef.shape = polygonShape;

        var body = this.mundo.CreateBody(bodyDef);
        body.CreateFixture(fixtureDef);

        return body;
    };

    Fisica.prototype.crear_rectangulo = function (x, y, ancho, alto, opciones) {
        return new this.Rectangulo(this, x, y, ancho, alto, opciones);
    };

    Fisica.prototype.crear_circulo = function (x, y, radio, opciones) {
        return new this.Circulo(this, x, y, radio, opciones);
    };
    return Fisica;
})();

var ConstanteDeMovimiento = (function () {
    function ConstanteDeMovimiento(figura, evento) {
        var def = new box2d.b2MouseJointDef();
        this.cuerpo_enlazado = pilas.escena_actual().fisica.createBox(8.5, 2, 1, 1, box2d.b2Body.b2_staticBody);
        def.bodyA = this.cuerpo_enlazado;
        def.bodyB = figura.cuerpo;
        var pos = pilas.escena_actual().camara.convertir_de_posicion_relativa_a_fisica(evento.x, evento.y);
        def.target = new box2d.b2Vec2(convertir_a_metros(pos.x), convertir_a_metros(pos.y));
        def.collideConnected = true;
        def.maxForce = 1000.0 * figura.cuerpo.GetMass();
        def.dampingRatio = 0;

        this.constante = pilas.escena_actual().fisica.mundo.CreateJoint(def);
        figura.cuerpo.SetAwake(true);
    }
    ConstanteDeMovimiento.prototype.mover = function (x, y) {
        var pos = pilas.escena_actual().camara.convertir_de_posicion_relativa_a_fisica(x, y);
        this.constante.SetTarget(new box2d.b2Vec2(convertir_a_metros(pos.x), convertir_a_metros(pos.y)));
    };

    ConstanteDeMovimiento.prototype.eliminar = function () {
        pilas.escena_actual().fisica.mundo.DestroyBody(this.cuerpo_enlazado);
    };
    return ConstanteDeMovimiento;
})();
/// <reference path="fisica.ts" />
/// <reference path="pilas.ts" />
/**
* @class Habilidad
*
* Representa una habilidad que un actor puede aprender.
*/
var Habilidad = (function () {
    function Habilidad(receptor, argumentos) {
        if (typeof argumentos === "undefined") { argumentos = null; }
        this.receptor = receptor;
        this.argumentos = argumentos;
    }
    Habilidad.prototype.actualizar = function () {
    };

    Habilidad.prototype.eliminar = function () {
    };
    return Habilidad;
})();

var Imitar = (function (_super) {
    __extends(Imitar, _super);
    function Imitar(receptor, argumentos) {
        _super.call(this, receptor, argumentos);
        this.objeto_a_imitar = this.argumentos.objeto_a_imitar;

        if (this.argumentos.con_rotacion === undefined) {
            this.argumentos.con_rotacion = true;
        }
        if (this.argumentos.con_escala === undefined) {
            this.argumentos.con_escala = true;
        }

        receptor.id = this.argumentos.objeto_a_imitar.id;
        receptor.figura = this.argumentos.objeto_a_imitar;
    }
    Imitar.prototype.actualizar = function () {
        this.receptor.x = this.objeto_a_imitar.x;
        this.receptor.y = this.objeto_a_imitar.y;
        if (this.argumentos.con_rotacion) {
            this.receptor.rotacion = this.objeto_a_imitar.rotacion;
        }
        if (this.argumentos.con_escala) {
            this.objeto_a_imitar.escala = this.receptor.escala;
        }
    };
    return Imitar;
})(Habilidad);

/**
* @class PuedeExplotar
*
* Hace que un actor se pueda hacer explotar invocando al metodo eliminar.
*/
var PuedeExplotar = (function (_super) {
    __extends(PuedeExplotar, _super);
    function PuedeExplotar(receptor) {
        var _this = this;
        _super.call(this, receptor);
        receptor.eliminar = function () {
            var explosion = new pilas.actores.Explosion();
            explosion.x = _this.receptor.x;
            explosion.y = _this.receptor.y;
            explosion.escala = _this.receptor.escala;
            pilas.actores.Actor.prototype.eliminar.call(_this.receptor);
        };
    }
    return PuedeExplotar;
})(Habilidad);

/**
* @class SeguirAlMouse
*
* Hace que un actor siga la posición del mouse en todo momento.
*/
var SeguirAlMouse = (function (_super) {
    __extends(SeguirAlMouse, _super);
    function SeguirAlMouse(receptor) {
        _super.call(this, receptor);
        pilas.escena_actual().mueve_mouse.conectar(this);
    }
    SeguirAlMouse.prototype.recibir = function (evento, tipo) {
        if (tipo == pilas.escena_actual().mueve_mouse) {
            this.mover(evento);
        }
    };

    SeguirAlMouse.prototype.mover = function (evento) {
        this.receptor.x = evento.x;
        this.receptor.y = evento.y;
    };
    return SeguirAlMouse;
})(Habilidad);

/**
* @class SeguirClicks
*
* Hace que el actor se coloque la posición del cursor cuando se hace click.
*/
var SeguirClicks = (function (_super) {
    __extends(SeguirClicks, _super);
    function SeguirClicks(receptor) {
        _super.call(this, receptor);
        pilas.escena_actual().click_de_mouse.conectar(this);
    }
    SeguirClicks.prototype.recibir = function (evento, tipo) {
        if (tipo == pilas.escena_actual().click_de_mouse) {
            this.moverse_a_este_punto(evento);
        }
    };

    SeguirClicks.prototype.moverse_a_este_punto = function (evento) {
        this.receptor.x = [evento.x], 0.5;
        this.receptor.y = [evento.y], 0.5;
    };
    return SeguirClicks;
})(Habilidad);

/**
* @class MoverseConElTeclado
*
* Hace que un actor cambie de posición con pulsar el teclado.
*/
var MoverseConElTeclado = (function (_super) {
    __extends(MoverseConElTeclado, _super);
    function MoverseConElTeclado(receptor) {
        _super.call(this, receptor);
        pilas.escena_actual().actualiza.conectar(this);
        this.en_movimiento = false;
    }
    MoverseConElTeclado.prototype.recibir = function (evento, tipo) {
        var x = 0;
        var y = 0;

        if (tipo == pilas.escena_actual().actualiza) {
            var control = pilas.escena_actual().control;
            var velocidad = this.receptor.velocidad || 5;

            if (control.izquierda)
                x = -velocidad;

            if (control.derecha)
                x = velocidad;

            if (control.arriba)
                y = velocidad;

            if (control.abajo)
                y = -velocidad;

            if (x != 0 || y != 0) {
                if (this.en_movimiento == false) {
                    this.en_movimiento = true;
                }
                this.mover(x, y);
            }
        }

        if (this.en_movimiento) {
            if (x == 0 && y == 0) {
                this.en_movimiento = false;
                this.receptor.detener_animacion();
            }
        }
    };

    MoverseConElTeclado.prototype.mover = function (x, y) {
        if (this.receptor.mover !== undefined) {
            this.receptor.mover(x, y);
        } else {
            this.receptor.x += x;
            this.receptor.y += y;
        }
    };
    return MoverseConElTeclado;
})(Habilidad);

var MoverseConElTecladoConRotacion = (function (_super) {
    __extends(MoverseConElTecladoConRotacion, _super);
    function MoverseConElTecladoConRotacion(receptor) {
        _super.call(this, receptor);
        pilas.escena_actual().actualiza.conectar(this);
    }
    MoverseConElTecladoConRotacion.prototype.recibir = function (evento, tipo) {
        if (tipo == pilas.escena_actual().actualiza) {
            var control = pilas.escena_actual().control;

            if (control.izquierda)
                this.receptor.rotacion -= 2;

            if (control.derecha)
                this.receptor.rotacion += 2;

            if (control.arriba)
                this.receptor.avanzar(1.5);
        }
    };
    return MoverseConElTecladoConRotacion;
})(Habilidad);

/**
* @class Arrastrable
*
* Hace que un objeto se pueda arrastrar con el puntero del mouse.
*
* Cuando comienza a mover al actor se llama al metodo
* ''comienza_a_arrastrar'' y cuando termina llama a
* ''termina_de_arrastrar''. Estos nombres de metodos se llaman para
* que puedas personalizar estos eventos, dado que puedes usar
* polimorfismo para redefinir el comportamiento de estos dos metodos.
*/
var Arrastrable = (function (_super) {
    __extends(Arrastrable, _super);
    function Arrastrable(receptor) {
        _super.call(this, receptor);
        pilas.escena_actual().click_de_mouse.conectar(this);
        pilas.escena_actual().mueve_mouse.conectar(this);
        this.debe_arrastrar = false;
    }
    Arrastrable.prototype.recibir = function (evento, tipo) {
        if (tipo == pilas.escena_actual().click_de_mouse) {
            this.cuando_intenta_arrastrar(evento);
        }
        if (tipo == pilas.escena_actual().cuando_termina_click) {
            this.cuando_termina_de_arrastrar(evento);
        }
        if (tipo == pilas.escena_actual().mueve_mouse) {
            this.cuando_arrastra(evento);
        }
    };

    Arrastrable.prototype.cuando_intenta_arrastrar = function (evento) {
        if (evento.boton == 1) {
            if (this.receptor.colisiona_con_un_punto(evento.x, evento.y)) {
                pilas.escena_actual().cuando_termina_click.conectar(this);
                this.comienza_a_arrastrar(evento);
            }
        }
    };

    Arrastrable.prototype.cuando_arrastra = function (evento) {
        // Muestra un cursor diferente si puede comenzar
        // a mover la figura.
        if (this.receptor.colisiona_con_un_punto(evento.x, evento.y))
            document.body.style.cursor = "move";
        else
            document.body.style.cursor = "default";

        if (this.debe_arrastrar === true) {
            if (this.receptor.tiene_fisica()) {
                this.constante.mover(evento.x, evento.y);
            } else {
                this.receptor.x = evento.x;
                this.receptor.y = evento.y;
            }
        }
    };

    Arrastrable.prototype.cuando_termina_de_arrastrar = function (evento) {
        pilas.escena_actual().cuando_termina_click.desconectar(this);
        pilas.escena_actual().mueve_mouse.desconectar(this);
        this.termina_de_arrastrar();
    };

    Arrastrable.prototype.comienza_a_arrastrar = function (evento) {
        if (this.receptor.tiene_fisica())
            this.constante = new ConstanteDeMovimiento(this.receptor.figura, evento);

        this.debe_arrastrar = true;
    };

    Arrastrable.prototype.termina_de_arrastrar = function () {
        if (this.receptor.tiene_fisica())
            this.constante.eliminar();

        this.debe_arrastrar = false;
    };
    return Arrastrable;
})(Habilidad);

var Disparar = (function (_super) {
    __extends(Disparar, _super);
    function Disparar(receptor) {
        this.contador = 0;
        _super.call(this, receptor);
        pilas.escena_actual().actualiza.conectar(this);
    }
    Disparar.prototype.recibir = function (evento, tipo) {
        if (this.contador < 1) {
            if (tipo == pilas.escena_actual().actualiza) {
                var control = pilas.escena_actual().control;

                if (control.boton) {
                    this.receptor.disparar();
                    this.contador = 30;
                }
            }
        } else {
            this.contador -= 1;
        }
    };
    return Disparar;
})(Habilidad);

var RebotarComoPelota = (function (_super) {
    __extends(RebotarComoPelota, _super);
    function RebotarComoPelota(receptor) {
        _super.call(this, receptor);
        var circulo = pilas.escena_actual().fisica.crear_circulo(receptor.x, receptor.y, receptor.radio_de_colision, {});
        receptor.imitar(circulo);
    }
    return RebotarComoPelota;
})(Habilidad);

var RebotarComoCaja = (function (_super) {
    __extends(RebotarComoCaja, _super);
    function RebotarComoCaja(receptor) {
        _super.call(this, receptor);
        var rectangulo = pilas.escena_actual().fisica.crear_rectangulo(receptor.x, receptor.y, receptor.radio_de_colision * 2, receptor.radio_de_colision * 2, {});
        receptor.imitar(rectangulo);
    }
    return RebotarComoCaja;
})(Habilidad);

var SeMantieneEnPantalla = (function (_super) {
    __extends(SeMantieneEnPantalla, _super);
    function SeMantieneEnPantalla(receptor) {
        _super.call(this, receptor);
        pilas.escena_actual().actualiza.conectar(this);
    }
    SeMantieneEnPantalla.prototype.recibir = function (evento, tipo) {
        if (tipo == pilas.escena_actual().actualiza) {
            if (this.receptor.izquierda > pilas.opciones.ancho / 2)
                this.receptor.derecha = -pilas.opciones.ancho / 2;

            if (this.receptor.derecha < -pilas.opciones.ancho / 2)
                this.receptor.izquierda = pilas.opciones.ancho / 2;

            if (this.receptor.abajo > pilas.opciones.alto / 2)
                this.receptor.arriba = -pilas.opciones.alto / 2;

            if (this.receptor.arriba < -pilas.opciones.alto / 2)
                this.receptor.abajo = pilas.opciones.alto / 2;
        }
    };
    return SeMantieneEnPantalla;
})(Habilidad);

/**
* @class Habilidades
*
* Representa todas las habilidades conocidas en pilas-engine.
*/
var Habilidades = (function () {
    function Habilidades() {
        this.Arrastrable = Arrastrable;
        this.PuedeExplotar = PuedeExplotar;
        this.SeguirAlMouse = SeguirAlMouse;
        this.SeguirClicks = SeguirClicks;
        this.MoverseConElTeclado = MoverseConElTeclado;
        this.MoverseConElTecladoConRotacion = MoverseConElTecladoConRotacion;
        this.SeMantieneEnPantalla = SeMantieneEnPantalla;
        this.Disparar = Disparar;
        this.RebotarComoPelota = RebotarComoPelota;
        this.RebotarComoCaja = RebotarComoCaja;
        this.Imitar = Imitar;
    }
    return Habilidades;
})();
/**
* @class Comportamiento
*
* Representa una habilidad que un actor puede aprender.
*/
var Comportamiento = (function () {
    function Comportamiento(argumentos) {
        this.argumentos = argumentos;
    }
    Comportamiento.prototype.iniciar = function (receptor) {
        this.receptor = receptor;
    };

    Comportamiento.prototype.actualizar = function () {
    };

    Comportamiento.prototype.eliminar = function () {
    };
    return Comportamiento;
})();

var AvanzarComoProyectil = (function (_super) {
    __extends(AvanzarComoProyectil, _super);
    function AvanzarComoProyectil() {
        _super.apply(this, arguments);
    }
    AvanzarComoProyectil.prototype.iniciar = function (receptor) {
        _super.prototype.iniciar.call(this, receptor);
        this.velocidad = this.argumentos.velocidad || 2;
        var rotacion_en_radianes = pilas.utils.convertir_a_radianes(-this.receptor.rotacion);
        this.dx = Math.cos(rotacion_en_radianes);
        this.dy = Math.sin(rotacion_en_radianes);
    };

    AvanzarComoProyectil.prototype.actualizar = function () {
        this.receptor.x += this.dx * this.velocidad;
        this.receptor.y += this.dy * this.velocidad;
    };
    return AvanzarComoProyectil;
})(Comportamiento);

var Avanzar = (function (_super) {
    __extends(Avanzar, _super);
    function Avanzar() {
        _super.apply(this, arguments);
    }
    Avanzar.prototype.iniciar = function (receptor) {
        _super.prototype.iniciar.call(this, receptor);
        this.pasos = Math.abs(this.argumentos.pasos);
        this.velocidad = this.argumentos.velocidad || 5;
        var rotacion_en_radianes = pilas.utils.convertir_a_radianes(-this.receptor.rotacion);
        this.dx = Math.cos(rotacion_en_radianes);
        this.dy = Math.sin(rotacion_en_radianes);
    };

    Avanzar.prototype.actualizar = function () {
        if (this.pasos > 0) {
            if (this.pasos - this.velocidad < 0) {
                var avance = this.pasos;
            } else {
                var avance = this.velocidad;
            }

            this.pasos -= avance;
            this.receptor.x += this.dx * avance;
            this.receptor.y += this.dy * avance;
        } else {
            return true;
        }
    };
    return Avanzar;
})(Comportamiento);

var Girar = (function (_super) {
    __extends(Girar, _super);
    function Girar() {
        _super.apply(this, arguments);
    }
    Girar.prototype.iniciar = function (receptor) {
        _super.prototype.iniciar.call(this, receptor);
        this.angulo = this.argumentos.angulo || 360;
        this.tiempo = this.argumentos.tiempo || 1;
        this.angulo_aux = this.receptor.rotacion + this.angulo;
    };

    Girar.prototype.actualizar = function () {
        pilas.interpolar(this.receptor, "rotacion", [this.angulo_aux], this.tiempo);
        if (this.angulo_aux == this.receptor.rotacion) {
            return true;
        }
    };
    return Girar;
})(Comportamiento);

var Saltar = (function (_super) {
    __extends(Saltar, _super);
    function Saltar() {
        _super.apply(this, arguments);
    }
    Saltar.prototype.iniciar = function (receptor) {
        this.receptor = receptor;
        this.suelo = this.receptor.y;
        this.velocidad_inicial = this.argumentos.velocidad_inicial || 10;
        this.velocidad = this.velocidad_inicial;
        this.velocidad_aux = this.velocidad_inicial;
        this.cuando_termina = this.argumentos.cuando_termina || null;
        this.sonido_saltar = pilas.sonidos.cargar('saltar.wav');
        this.sonido_saltar.reproducir();
    };

    Saltar.prototype.actualizar = function () {
        this.receptor.y += this.velocidad;
        this.velocidad -= 0.3;

        if (this.receptor.y <= this.suelo) {
            this.velocidad_aux /= 2.0;
            this.velocidad = this.velocidad_aux;

            if (this.velocidad_aux <= 1) {
                this.receptor.y = this.suelo;
                if (this.cuando_termina) {
                    this.cuando_termina.call(this.receptor);
                }
                return true;
            }
        }
    };
    return Saltar;
})(Comportamiento);

var Saltando = (function (_super) {
    __extends(Saltando, _super);
    function Saltando() {
        _super.apply(this, arguments);
    }
    Saltando.prototype.iniciar = function (receptor) {
        _super.prototype.iniciar.call(this, receptor);
        this.dy = 10;
        this.suelo = this.receptor.y;
        this.cuando_termina = this.argumentos.cuando_termina || null;
    };

    Saltando.prototype.actualizar = function () {
        this.receptor.y += this.dy;
        this.dy -= 0.3;

        if (this.receptor.y < this.suelo) {
            this.receptor.y = this.suelo;
            if (this.cuando_termina) {
                this.cuando_termina.call(this.receptor);
            }
            return true;
        }

        if (pilas.escena_actual().control.derecha)
            this.receptor.x += 1;
        else if (pilas.escena_actual().control.izquierda)
            this.receptor.x -= 1;
    };
    return Saltando;
})(Comportamiento);

var Orbitar = (function (_super) {
    __extends(Orbitar, _super);
    function Orbitar() {
        _super.apply(this, arguments);
    }
    Orbitar.prototype.iniciar = function (receptor) {
        this.receptor = receptor;
        this.punto_de_orbita_x = this.argumentos.punto_de_orbita_x || 0;
        this.punto_de_orbita_y = this.argumentos.punto_de_orbita_y || 0;
        this.radio = this.argumentos.radio || 10;
        this.velocidad = this.argumentos.velocidad || .0001;
        this.direccion = this.argumentos.direccion || "derecha";
        this.angulo = 0;

        if (this.direccion == "izquierda") {
            this.velocidad = -this.velocidad;
        } else if (this.direccion == "derecha") {
            this.velocidad;
        }
    };

    Orbitar.prototype.actualizar = function () {
        this.angulo += this.velocidad;
        this.mover_astro();
    };

    Orbitar.prototype.mover_astro = function () {
        this.receptor.x = this.punto_de_orbita_x + (Math.cos(pilas.utils.convertir_a_grados(this.angulo)) * this.radio);

        this.receptor.y = this.punto_de_orbita_y - (Math.sin(pilas.utils.convertir_a_grados(this.angulo)) * this.radio);
    };
    return Orbitar;
})(Comportamiento);

var OrbitarSobreActor = (function (_super) {
    __extends(OrbitarSobreActor, _super);
    function OrbitarSobreActor() {
        _super.apply(this, arguments);
    }
    OrbitarSobreActor.prototype.iniciar = function (receptor) {
        _super.prototype.iniciar.call(this, receptor);
        this.punto_de_orbita_x = this.argumentos.actor.x;
        this.punto_de_orbita_y = this.argumentos.actor.y;
    };

    OrbitarSobreActor.prototype.actualizar = function () {
        this.punto_de_orbita_x = this.argumentos.actor.x;
        this.punto_de_orbita_y = this.argumentos.actor.y;
        _super.prototype.actualizar.call(this);
    };
    return OrbitarSobreActor;
})(Orbitar);

var CaminarBase = (function (_super) {
    __extends(CaminarBase, _super);
    function CaminarBase() {
        _super.apply(this, arguments);
    }
    CaminarBase.prototype.iniciar = function (receptor) {
        this.receptor = receptor;
        this.pasos = this.argumentos.pasos || 1;
        this.velocidad = 1;
        var pasitos = 0.05;
        this.cantActualizaciones = Math.round(this.pasos / pasitos);
    };

    CaminarBase.prototype.actualizar = function () {
        this.mover();
        this.cantActualizaciones--;
        if (this.cantActualizaciones < 1) {
            this.receptor.detener_animacion();
            return true;
        }
    };

    CaminarBase.prototype.mover = function () {
    };
    return CaminarBase;
})(Comportamiento);

var CaminaArriba = (function (_super) {
    __extends(CaminaArriba, _super);
    function CaminaArriba() {
        _super.apply(this, arguments);
    }
    CaminaArriba.prototype.mover = function () {
        this.receptor.mover(0, this.velocidad);
    };
    return CaminaArriba;
})(CaminarBase);

var CaminaAbajo = (function (_super) {
    __extends(CaminaAbajo, _super);
    function CaminaAbajo() {
        _super.apply(this, arguments);
    }
    CaminaAbajo.prototype.mover = function () {
        this.receptor.mover(0, -this.velocidad);
    };
    return CaminaAbajo;
})(CaminarBase);

var CaminaIzquierda = (function (_super) {
    __extends(CaminaIzquierda, _super);
    function CaminaIzquierda() {
        _super.apply(this, arguments);
    }
    CaminaIzquierda.prototype.mover = function () {
        this.receptor.mover(-this.velocidad, 0);
    };
    return CaminaIzquierda;
})(CaminarBase);

var CaminaDerecha = (function (_super) {
    __extends(CaminaDerecha, _super);
    function CaminaDerecha() {
        _super.apply(this, arguments);
    }
    CaminaDerecha.prototype.mover = function () {
        this.receptor.mover(this.velocidad, 0);
    };
    return CaminaDerecha;
})(CaminarBase);

/**
* @class Secuencia
*
* Representa una secuencia de comportamientos que un actor realiza de forma ordenada.
*
* Espera una lista de comportamientos.
*/
var Secuencia = (function (_super) {
    __extends(Secuencia, _super);
    function Secuencia() {
        _super.apply(this, arguments);
    }
    Secuencia.prototype.iniciar = function (receptor) {
        _super.prototype.iniciar.call(this, receptor);
        this.secuencia = this.argumentos.secuencia;
        this.reiniciar = true;
    };

    Secuencia.prototype.actualizar = function () {
        if (this.reiniciar) {
            this.reiniciar = false;
            this.comando_actual = 0;
            if (this.secuencia.length > 0) {
                this.secuencia[0].iniciar(this.receptor);
            }
        }

        if (this.secuencia.length > 0 && this.comando_actual < this.secuencia.length) {
            var finished = this.secuencia[this.comando_actual].actualizar();
            if (finished) {
                this.comando_actual++;
                if (this.comando_actual < this.secuencia.length) {
                    this.secuencia[this.comando_actual].iniciar(this.receptor);
                }
            }
        } else {
            this.reiniciar = true; // para reiniciar la secuencia en la proxima ejecucion
            return true;
        }
    };
    return Secuencia;
})(Comportamiento);

/**
* @class Alternativa
*
* Representa un if-then-else entre dos comportamientos. Se ejecuta uno u otro dependiendo de una condicion.
*
* Recibe como argumentos dos comportamientos de tipo Secuencia y una funcion booleana a evaluar.
*/
var Alternativa = (function (_super) {
    __extends(Alternativa, _super);
    function Alternativa() {
        _super.apply(this, arguments);
    }
    Alternativa.prototype.iniciar = function (receptor) {
        _super.prototype.iniciar.call(this, receptor);
        this.rama_entonces = this.argumentos.entonces;
        this.rama_sino = this.argumentos.sino;
        this.condicion = this.argumentos.condicion;
        this.ejecutado = false;
    };

    Alternativa.prototype.actualizar = function () {
        if (!this.ejecutado) {
            this.ejecutado = true;
            if (this.condicion()) {
                this.rama_elegida = this.rama_entonces;
            } else {
                this.rama_elegida = this.rama_sino;
            }
            this.rama_elegida.iniciar(this.receptor);
        }

        var finished = this.rama_elegida.actualizar();
        if (finished) {
            // para que se vuelva a evaluar la condicion si vuelven a llamar a este comportamiento
            this.ejecutado = false;

            return true;
        }
    };
    return Alternativa;
})(Comportamiento);

/**
* @class RepetirHasta
*
* Representa un bucle condicional que repite un comportamiento hasta que se cumple cierta condicion.
*
* Recibe como argumento un comportamiento de tipo Secuencia y una funcion booleana a evaluar.
*/
var RepetirHasta = (function (_super) {
    __extends(RepetirHasta, _super);
    function RepetirHasta() {
        _super.apply(this, arguments);
    }
    RepetirHasta.prototype.iniciar = function (receptor) {
        _super.prototype.iniciar.call(this, receptor);
        this.secuencia = this.argumentos.secuencia;
        this.condicion = this.argumentos.condicion;
        this.secuencia.iniciar(receptor);
        this.evaluar_condicion = true;
    };

    RepetirHasta.prototype.actualizar = function () {
        if (this.evaluar_condicion) {
            this.evaluar_condicion = false;
            if (this.condicion()) {
                this.evaluar_condicion = true; // se resetea antes de salir, para volvese a evaluar
                return true;
            }
        }

        var termino = this.secuencia.actualizar();

        if (termino) {
            this.evaluar_condicion = true;
        }
    };
    return RepetirHasta;
})(Comportamiento);

/**
* @class RepetirN
*
* Representa un bucle que repite una cierta cantidad de veces un comportamiento
*
* Recibe como argumento un comportamiento de tipo Secuencia y una funcion booleana a evaluar.
*/
var RepetirN = (function (_super) {
    __extends(RepetirN, _super);
    function RepetirN() {
        _super.apply(this, arguments);
    }
    RepetirN.prototype.iniciar = function (receptor) {
        _super.prototype.iniciar.call(this, receptor);
        this.secuencia = this.argumentos.secuencia;
        this.cantidad = this.argumentos.cantidad;
        this.secuencia.iniciar(receptor);
        this.volver_a_evaluar = true;
    };

    RepetirN.prototype.actualizar = function () {
        if (this.volver_a_evaluar) {
            this.volver_a_evaluar = false;
            this.cantidad_actual = this.cantidad();
        }

        if (this.cantidad_actual == 0) {
            this.volver_a_evaluar = true;
            return true;
        }

        var termino = this.secuencia.actualizar();
        if (termino) {
            this.cantidad_actual--;
        }
    };
    return RepetirN;
})(Comportamiento);

/**
* @class CambiarAtributo
*
* Representa el cambio de un atributo del actor
*
* Recibe como argumento una funcion cuyo resultado sera guardado como valor del atributo
*/
var CambiarAtributo = (function (_super) {
    __extends(CambiarAtributo, _super);
    function CambiarAtributo() {
        _super.apply(this, arguments);
    }
    CambiarAtributo.prototype.iniciar = function (receptor) {
        _super.prototype.iniciar.call(this, receptor);
        this.nombre = this.argumentos.nombre;
        this.funcion_valor = this.argumentos.valor;
    };

    CambiarAtributo.prototype.actualizar = function () {
        this.receptor.set_atributo(this.nombre, this.funcion_valor());
        return true;
    };
    return CambiarAtributo;
})(Comportamiento);

/**
* @class CambiarVariableLocal
*
* Representa el cambio de una variable local del procedimiento actual
*
* Recibe como argumento una funcion cuyo resultado sera guardado como valor del atributo
*/
var CambiarVariableLocal = (function (_super) {
    __extends(CambiarVariableLocal, _super);
    function CambiarVariableLocal() {
        _super.apply(this, arguments);
    }
    CambiarVariableLocal.prototype.iniciar = function (receptor) {
        _super.prototype.iniciar.call(this, receptor);
        this.nombre = this.argumentos.nombre;
        this.funcion_valor = this.argumentos.valor;
    };

    CambiarVariableLocal.prototype.actualizar = function () {
        this.receptor.set_variable(this.nombre, this.funcion_valor());
        return true;
    };
    return CambiarVariableLocal;
})(Comportamiento);

/**
* @class LlamadaProcedimiento
*
* Representa una llamada a un procedimiento
*
* Recibe como argumentos el nombre del procedimiento y el contexto de
* definiciones
*/
var LlamadaProcedimiento = (function (_super) {
    __extends(LlamadaProcedimiento, _super);
    function LlamadaProcedimiento() {
        _super.apply(this, arguments);
    }
    LlamadaProcedimiento.prototype.iniciar = function (receptor) {
        _super.prototype.iniciar.call(this, receptor);
        this.nombre = this.argumentos.nombre;

        // consigue parametros y nombre de esta definicion
        var p = this.argumentos.procedimientos[this.nombre];

        // construye el scope para los argumentos
        var args_evaluados = {};
        for (var i = 0; i < p.parametros.length; i++) {
            var arg_evaluado = this.argumentos.argumentos[i]();
            args_evaluados[p.parametros[i]] = arg_evaluado;
        }
        this.receptor.push_parametros(args_evaluados);

        // inicializa el scope de variables locales
        this.receptor.push_variables({});

        // genera una nueva secuencia a ejecutar
        this.secuencia = new Secuencia({ secuencia: p.secuencia });
        this.secuencia.iniciar(this.receptor);
    };

    LlamadaProcedimiento.prototype.actualizar = function () {
        var termino = this.secuencia.actualizar();
        if (termino) {
            this.receptor.pop_parametros();
            this.receptor.pop_variables();
            return true;
        }
    };
    return LlamadaProcedimiento;
})(Comportamiento);

/**
* @class Expresion
*
* Representa la evaluacion de una expresion
*
* Recibe como argumento la expresión a evaluar
*/
var Expresion = (function (_super) {
    __extends(Expresion, _super);
    function Expresion() {
        _super.apply(this, arguments);
    }
    Expresion.prototype.iniciar = function (receptor) {
        _super.prototype.iniciar.call(this, receptor);
        this.expresion = this.argumentos.expresion;
    };

    Expresion.prototype.actualizar = function () {
        this.resultado = this.expresion();
        return true;
    };
    return Expresion;
})(Comportamiento);

/**
* @class LlamadaFuncion
*
* Representa una llamada a una funcion
*
* Recibe como argumentos el nombre de la funcion, el contexto de
* definiciones de funciones y la expresión a retornar
*/
var LlamadaFuncion = (function (_super) {
    __extends(LlamadaFuncion, _super);
    function LlamadaFuncion() {
        _super.apply(this, arguments);
    }
    LlamadaFuncion.prototype.iniciar = function (receptor) {
        _super.prototype.iniciar.call(this, receptor);
        this.nombre = this.argumentos.nombre;
        var s = this.argumentos.funciones[this.nombre].secuencia;
        this.secuencia = new Secuencia({ secuencia: s });
        this.secuencia.iniciar(this.receptor);
    };

    LlamadaFuncion.prototype.actualizar = function () {
        var termino = this.secuencia.actualizar();
        if (termino) {
            this.resultado = this.expresion();
            return true;
        }
    };
    return LlamadaFuncion;
})(Expresion);

/**
* @class ConstructorDePrograma
*
* Permite construir un comportamiento que representa un programa
*
**/
var ConstructorDePrograma = (function () {
    function ConstructorDePrograma() {
        this.stack_secuencias = [];
        this.procedimientos = {};
        this.funciones = {};
    }
    ConstructorDePrograma.prototype.empezar_secuencia = function () {
        this.stack_secuencias.push([]);
    };

    ConstructorDePrograma.prototype.hacer = function (comportamiento, argumentos) {
        this.stack_secuencias[this.stack_secuencias.length - 1].push(new comportamiento(argumentos));
    };

    ConstructorDePrograma.prototype.terminar_secuencia = function () {
        var s = this.stack_secuencias.pop();
        this.stack_secuencias.push(new Secuencia({ secuencia: s }));
    };

    ConstructorDePrograma.prototype.repetir_hasta = function (c) {
        this.terminar_secuencia();
        var s = this.stack_secuencias.pop();
        this.hacer(RepetirHasta, { secuencia: s, condicion: c });
    };

    ConstructorDePrograma.prototype.alternativa_si = function (c) {
        this.terminar_secuencia();
        var s = this.stack_secuencias.pop();
        this.hacer(Alternativa, { entonces: s, sino: new Secuencia({ secuencia: [] }), condicion: c });
    };

    ConstructorDePrograma.prototype.alternativa_sino = function (c) {
        this.terminar_secuencia();
        var s2 = this.stack_secuencias.pop();
        this.terminar_secuencia();
        var s1 = this.stack_secuencias.pop();
        this.hacer(Alternativa, { entonces: s1, sino: s2, condicion: c });
    };

    ConstructorDePrograma.prototype.repetirN = function (n) {
        this.terminar_secuencia();
        var s = this.stack_secuencias.pop();
        this.hacer(RepetirN, { secuencia: s, cantidad: n });
    };

    ConstructorDePrograma.prototype.def_proc = function (n, params) {
        // no creo un comportamiento de
        // tipo secuencia como en las estructuras de control
        // porque dicho objeto deberia crearse recien
        // en la llamada al procedimiento
        var s = this.stack_secuencias.pop();
        this.procedimientos[n] = { secuencia: s, parametros: params };
    };

    ConstructorDePrograma.prototype.llamada_proc = function (n, proc_args) {
        var procs = this.procedimientos;
        this.hacer(LlamadaProcedimiento, { nombre: n, procedimientos: procs, argumentos: proc_args });
    };

    ConstructorDePrograma.prototype.def_func = function (n) {
        var s = this.stack_secuencias.pop();
        this.funciones[n] = s;
    };

    ConstructorDePrograma.prototype.llamada_func = function (n, exp) {
        var funcs = this.funciones;
        this.hacer(LlamadaFuncion, { nombre: n, funciones: funcs, expresion: exp });
    };

    ConstructorDePrograma.prototype.cambio_atributo = function (n, f) {
        this.hacer(CambiarAtributo, { nombre: n, valor: f });
    };

    ConstructorDePrograma.prototype.cambio_variable = function (n, f) {
        this.hacer(CambiarVariableLocal, { nombre: n, valor: f });
    };

    ConstructorDePrograma.prototype.inyectar_scopes = function (actor) {
        this.inyectar_parametros(actor);
        this.inyectar_atributos(actor);
        this.inyectar_variables_locales(actor);
    };

    ConstructorDePrograma.prototype.inyectar_parametros = function (actor) {
        actor.scope_parametros = [{}];
        actor.scope_parametros_actual = {};

        actor.push_parametros = function (ids) {
            this.scope_parametros.push(ids);
            this.scope_parametros_actual = ids;
        };

        actor.pop_parametros = function () {
            this.scope_parametros_actual = this.scope_parametros.pop();
        };

        actor.parametro = function (n) {
            return this.scope_parametros_actual[n];
        };
    };

    ConstructorDePrograma.prototype.inyectar_variables_locales = function (actor) {
        actor.scope_var_locales = [{}];
        actor.scope_var_locales_actual = {};

        actor.push_variables = function (ids) {
            this.scope_var_locales.push(ids);
            this.scope_var_locales_actual = ids;
        };

        actor.pop_variables = function () {
            this.scope_var_locales_actual = this.scope_var_locales.pop();
        };

        actor.set_variable = function (v, x) {
            actor.scope_var_locales_actual[v] = x;
        };

        actor.variable = function (n) {
            return this.scope_var_locales_actual[n];
        };
    };

    ConstructorDePrograma.prototype.inyectar_atributos = function (actor) {
        actor.atributos_programa = {};

        actor.set_atributo = function (v, x) {
            actor.atributos_programa[v] = x;
        };

        actor.atributo = function (v) {
            return actor.atributos_programa[v];
        };
    };

    ConstructorDePrograma.prototype.ejecutar = function (actor) {
        // obtiene el programa
        this.terminar_secuencia();
        var p = this.stack_secuencias.pop();

        // inyecta scopes para atributos, variables locales y parametros
        this.inyectar_scopes(actor);
        actor.hacer_luego(Programa, { programa: p });
    };
    return ConstructorDePrograma;
})();

var Programa = (function (_super) {
    __extends(Programa, _super);
    function Programa() {
        _super.apply(this, arguments);
    }
    Programa.prototype.iniciar = function (receptor) {
        _super.prototype.iniciar.call(this, receptor);
        this.programa = this.argumentos.programa;
        this.programa.iniciar(this.receptor);
    };

    Programa.prototype.actualizar = function () {
        var programa_terminado = this.programa.actualizar();
        if (programa_terminado) {
            return true;
        }
    };
    return Programa;
})(Comportamiento);

/**
* @class Comportamientos
*
* Representa todos los comportamientos que puede hacer un actor en pilas-engine.
*/
var Comportamientos = (function () {
    function Comportamientos() {
        this.CaminarBase = CaminarBase;
        this.CaminaArriba = CaminaArriba;
        this.CaminaAbajo = CaminaAbajo;
        this.CaminaIzquierda = CaminaIzquierda;
        this.CaminaDerecha = CaminaDerecha;
        this.Orbitar = Orbitar;
        this.OrbitarSobreActor = OrbitarSobreActor;
        this.Saltar = Saltar;
        this.Girar = Girar;
        this.Avanzar = Avanzar;
        this.AvanzarComoProyectil = AvanzarComoProyectil;
        this.Saltando = Saltando;
        this.Secuencia = Secuencia;
        this.Alternativa = Alternativa;
        this.RepetirHasta = RepetirHasta;
        this.RepetirN = RepetirN;
        this.ConstructorDePrograma = ConstructorDePrograma;
        this.Programa = Programa;
    }
    return Comportamientos;
})();
var Colisiones = (function () {
    function Colisiones() {
        this.colisiones = [];
    }
    Colisiones.prototype.agregar = function (grupo_a, grupo_b, funcion_a_llamar, parent) {
        if (typeof parent === "undefined") { parent = undefined; }
        if (grupo_a.length === undefined)
            grupo_a = [grupo_a];

        if (grupo_b.length === undefined)
            grupo_b = [grupo_b];

        this.colisiones.push({ grupo_a: grupo_a, grupo_b: grupo_b, callback: funcion_a_llamar, parent: parent });
    };

    Colisiones.prototype.verificar_colisiones = function () {
        for (var i = 0; i < this.colisiones.length; i++) {
            this._verificar_colisiones_en_tupla(this.colisiones[i]);
        }
    };

    Colisiones.prototype._verificar_colisiones_en_tupla = function (tupla) {
        for (var i = 0; i < tupla.grupo_a.length; i++) {
            for (var j = 0; j < tupla.grupo_b.length; j++) {
                var actor_a = tupla.grupo_a[i];
                var actor_b = tupla.grupo_b[j];

                if (actor_a.vivo && actor_b.vivo && actor_a.colisiona_con(actor_b)) {
                    tupla.callback.call(tupla.parent, actor_a, actor_b);
                    if (!actor_a.vivo)
                        tupla.grupo_a.splice(i, 1);
                    if (!actor_b.vivo)
                        tupla.grupo_b.splice(j, 1);
                }
            }
        }
    };
    return Colisiones;
})();
var colores = (function () {
    function colores() {
        //Colores principales.
        this.negro = createjs.Graphics.getRGB(0, 0, 0);
        this.blanco = createjs.Graphics.getRGB(255, 255, 255);
        this.rojo = createjs.Graphics.getRGB(255, 0, 0);
        this.verde = createjs.Graphics.getRGB(0, 255, 0);
        this.azul = createjs.Graphics.getRGB(0, 0, 255);
        this.gris = createjs.Graphics.getRGB(128, 128, 128);

        //Colores secundarios
        this.amarillo = createjs.Graphics.getRGB(255, 255, 0);
        this.magenta = createjs.Graphics.getRGB(255, 0, 255);
        this.cyan = createjs.Graphics.getRGB(0, 255, 255);
        this.grisclaro = createjs.Graphics.getRGB(192, 192, 192);
        this.grisoscuro = createjs.Graphics.getRGB(100, 100, 100);
        this.verdeoscuro = createjs.Graphics.getRGB(0, 128, 0);
        this.azuloscuro = createjs.Graphics.getRGB(0, 0, 128);
        this.naranja = createjs.Graphics.getRGB(255, 200, 0);
        this.rosa = createjs.Graphics.getRGB(255, 175, 175);
        this.violeta = createjs.Graphics.getRGB(128, 0, 255);
        this.marron = createjs.Graphics.getRGB(153, 102, 0);

        //Colores transparentes
        this.negro_transparente = createjs.Graphics.getRGB(0, 0, 0, 0.5);
        this.blanco_transparente = createjs.Graphics.getRGB(255, 255, 255, 0.5);
        this.rojo_transparente = createjs.Graphics.getRGB(255, 0, 0, 0.5);
        this.verde_transparente = createjs.Graphics.getRGB(0, 255, 0, 0.5);
        this.azul_transparente = createjs.Graphics.getRGB(0, 0, 255, 0.5);
        this.gris_transparente = createjs.Graphics.getRGB(128, 128, 128, 0.5);
    }
    return colores;
})();
var tareas = (function () {
    function tareas() {
        this.Tareas = Tareas;
    }
    return tareas;
})();

var Tarea = (function () {
    function Tarea(tiempo, funcion, una_vez, parametros, parent) {
        this.tiempo = tiempo;
        this.tiempo_aux = tiempo;
        this.funcion = funcion;
        this.una_vez = una_vez;
        this.parametros = parametros;
        this.parent = parent;
    }
    Tarea.prototype.ejecutar = function () {
        this.funcion.call(this.parent, this.parametros);
    };
    return Tarea;
})();

var Tareas = (function () {
    function Tareas() {
        this.tareas_planificadas = [];
        this.contador_de_tiempo = 0;
    }
    Tareas.prototype._agregar_tarea = function (tarea) {
        this.tareas_planificadas.push(tarea);
    };

    Tareas.prototype.siempre = function (tiempo, funcion, parametros, parent) {
        var tarea = new Tarea(this.contador_de_tiempo + tiempo, funcion, false, parametros, parent);
        tarea.tiempo_aux = tiempo;
        this._agregar_tarea(tarea);
    };

    Tareas.prototype.una_vez = function (tiempo, funcion, parametros, parent) {
        var tarea = new Tarea(this.contador_de_tiempo + tiempo, funcion, true, parametros, parent);
        this._agregar_tarea(tarea);
    };

    Tareas.prototype.actualizar = function () {
        this.contador_de_tiempo += (1 / 60);
        for (var i = 0; i < this.tareas_planificadas.length; i++) {
            if (this.contador_de_tiempo > this.tareas_planificadas[i].tiempo) {
                this.tareas_planificadas[i].ejecutar();

                if (this.tareas_planificadas[i].una_vez) {
                    this.tareas_planificadas.splice(i, 1);
                } else {
                    this.tareas_planificadas[i].tiempo += this.tareas_planificadas[i].tiempo_aux;
                }
            }
        }
    };
    return Tareas;
})();
/*
*  Modulo sonidos:
*
*  Hay una instancia de la clase sonidos al momento de iniciar pilas
*  posteriormente para cargar y reproducir un sonido se debe de hacer lo siguiente:
*
*  1.- cargar el sonido en la función cargar_recursos() con ayuda de cargar_recurso(...)
*    Por ejemplo: cargar_recurso("smile.ogg")
*
*  2.- Simulamos la carga del sonido lo más parecido a la versión Python, así que:
*    cuando deseamos usar el sonido hacemos lo siguiente:
*    var mi_sonido = pilas.sonidos.cargar("smile.ogg")
*
*  3.- Por ultima para reproducir el sonido:
*    mi_sonido.reproducir()
*/
var Sonidos = (function () {
    function Sonidos(data_path) {
        this.recursos = [];
        this.preload = new createjs.LoadQueue(true, data_path + "/");
        this.preload.installPlugin(createjs.Sound);
        this.cargar_recursos();
    }
    Sonidos.prototype.cargar_recursos = function () {
        this.cargar_recurso('audio/smile.ogg');
        this.cargar_recurso('audio/shout.ogg');
        this.cargar_recurso('audio/saltar.wav');
        this.cargar_recurso('audio/blabla.wav');
        this.preload.loadManifest(this.recursos);
    };

    Sonidos.prototype.cargar_recurso = function (nombre) {
        this.recursos.push({ id: nombre, src: nombre });
    };

    Sonidos.prototype.cargar = function (nombre) {
        return new Sonido(nombre);
    };
    return Sonidos;
})();

var Sonido = (function () {
    function Sonido(nombre) {
        this.nombre = nombre;
    }
    Sonido.prototype.reproducir = function (repetir) {
        if (typeof repetir === "undefined") { repetir = false; }
        if (repetir) {
            return createjs.Sound.play(this.nombre, createjs.Sound.INTERRUPT_ANY, 0, 0, -1);
        } else {
            return createjs.Sound.play(this.nombre, createjs.Sound.INTERRUPT_ANY);
        }
    };

    Sonido.prototype.detener = function () {
        return createjs.Sound.stop(this.nombre);
    };
    return Sonido;
})();
var Rutinas = (function () {
    function Rutinas() {
        this.lista_de_rutinas = [];
    }
    Rutinas.prototype.observar_tareas = function (elemento_id, intervalo) {
        var el = document.getElementById(elemento_id);
        var ctx = this;

        function cargar_contenido() {
            var buffer = "";

            ctx.lista_de_rutinas.forEach(function (e) {
                buffer += e.nombre + " - contador: " + e.contador + "\n";
            });

            el.innerHTML = buffer;
            setTimeout(cargar_contenido, intervalo);
        }

        cargar_contenido();
    };

    Rutinas.prototype.agregar = function (nombre, actor, init, update) {
        var time = new Date();

        var rutina = {
            id: Math.random(),
            nombre: nombre,
            init: init,
            update: update,
            tiempo: time,
            actor: actor,
            contador: 0,
            contexto: { actor: actor },
            eliminada: false
        };

        console.log(rutina);

        init.call(rutina.contexto);
        this.lista_de_rutinas.push(rutina);
    };

    Rutinas.prototype.actualizar = function () {
        var a_eliminar = [];

        this.lista_de_rutinas.forEach(function (e) {
            e.contador += 1;
            var retorno = e.update.call(e.contexto);

            if (retorno === true) {
                e.eliminada = true;
            }
        });

        this.lista_de_rutinas = this.lista_de_rutinas.filter(function (item) {
            return (!item.eliminada);
        });
    };
    return Rutinas;
})();
/// <reference path="actores.ts" />
/// <reference path="utils.ts" />
/// <reference path="grupo.ts" />
/// <reference path="fondos.ts" />
/// <reference path="imagenes.ts" />
/// <reference path="mundo.ts" />
/// <reference path="escenas.ts" />
/// <reference path="interpolaciones.ts" />
/// <reference path="habilidades.ts" />
/// <reference path="comportamientos.ts" />
/// <reference path="colisiones.ts" />
/// <reference path="colores.ts" />
/// <reference path="tareas.ts" />
/// <reference path="sonidos.ts" />
/// <reference path="evento.ts" />
/// <reference path="rutinas.ts" />

/**
* @class Pilas
* @singleton
*
* Módulo pilas
* ============
*
* Pilas es una biblioteca para facilitar el desarrollo de videojuegos. Es útil para
* programadores principiantes o para el desarrollo de juegos casuales.
*
* Este módulo contiene las funciones principales para iniciar y ejecutar la biblioteca.
* {@img pilas-logo.png}
*
*     @example
*     pilas.iniciar({ancho: 320, alto: 240});
*     aceituna = new pilas.actores.Aceituna();
*/
var Pilas = (function () {
    function Pilas() {
    }
    /**
    * @method iniciar
    *
    * Inicia la ventana principal del juego con algunos detalles de funcionamiento.
    *
    * Ejemplo de invocación:
    *
    *     @example
    *     pilas.iniciar({ancho: 320, alto: 240, data_path: 'data/'});
    *
    * Parámetros:
    *
    * - data_path: La ruta hacia la carpeta donde están las imágenes de los actores. (Por defecto 'data/')
    *
    */
    Pilas.prototype.iniciar = function (opciones) {
        this.inicializar_opciones(opciones);
        this.actores = new Actores(this);
        this.habilidades = new Habilidades();
        this.comportamientos = new Comportamientos();
        this.obtener_canvas();
        this.definir_tamano_del_canvas();
        this.conectar_eventos();

        this.imagenes = new Imagenes(this.onready, this.opciones);
        this.fondos = new Fondos();
        this.mundo = new Mundo();
        this.interpolaciones = new Interpolaciones();
        this.utils = new Utils();
        this.grupo = new grupo();
        this.colisiones = new Colisiones();
        this.colores = new colores();
        this.sonidos = new Sonidos(this.opciones.data_path);
        this.escena = new escena();
        this.tareas = new tareas();
        this.rutinas = new Rutinas();

        this.mundo.gestor_escenas.cambiar_escena(new Normal());

        this.eventos = new ProxyEventos();

        // Deshabilita el interpolado de pixels.
        var ctx = this.canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        this.ready = false;
    };

    Pilas.prototype.observar_tareas = function (elemento_id, intervalo) {
        this.rutinas.observar_tareas(elemento_id, intervalo);
    };

    Pilas.prototype.reiniciar = function () {
        // TODO: hacer que el fondo sea un atributo de la escena y que
        // siempre se inicialice ahí, y no en la función onload del lado del
        // usuario como hace ahora...
        this.mundo.gestor_escenas.cambiar_escena(new Normal());
        var fondo = new pilas.fondos.Plano();
    };

    /**
    * @method escena_actual
    * Retorna la escena en curso.
    */
    Pilas.prototype.escena_actual = function () {
        if (this.mundo === undefined) {
            console.log("epa!");
        } else {
            var escena = this.mundo.gestor_escenas.escena_actual();
            return escena;
        }
    };

    /**
    * @method inicializar_opciones
    * @private
    *
    * Carga las opciones iniciales y define los valores por omisión si es necesario.
    */
    Pilas.prototype.inicializar_opciones = function (opciones) {
        this.opciones = opciones || {};
        this.opciones.ancho = this.opciones.ancho || 320;
        this.opciones.alto = this.opciones.alto || 240;
        this.opciones.data_path = this.opciones.data_path || 'data';
        this.opciones.canvas_id = this.opciones.canvas_id || 'canvas';
        this.opciones.canvas = this.opciones.canvas || null;
        this.opciones.imagenesExtra = this.opciones.imagenesExtra || [];
    };

    /**
    * @method definir_tamano_del_canvas
    * @private
    *
    * Cambia el tamaño del canvas HTML en base a las opciones iniciales.
    */
    Pilas.prototype.definir_tamano_del_canvas = function () {
        this.canvas.width = this.opciones.ancho;
        this.canvas.height = this.opciones.alto;
    };

    /**
    * @method obtener_codigo_y_texto_desde_evento
    * @private
    *
    * A partir del evento de teclado, obtiene su codigo y el texto de
    * la tecla presionada.
    */
    Pilas.prototype.obtener_codigo_y_texto_desde_evento = function (event) {
        var codigo;
        var texto;

        if (typeof event.which == "number") {
            codigo = event.which;
        } else {
            codigo = event.keyCode;
        }

        texto = String.fromCharCode(codigo);

        return { codigo: codigo, texto: texto };
    };

    /**
    * @method conectar_eventos
    * @private
    *
    * Conecta los eventos del mouse y teclado a los métodos manejadores
    * de eventos de la escena actual.
    */
    Pilas.prototype.conectar_eventos = function () {
        this.canvas.onmousedown = function (event) {
            var posicion = pilas.obtener_posicion_desde_evento(this, event);
            pilas.escena_actual().click_de_mouse.emitir(posicion);
        };

        this.canvas.onmouseup = function (event) {
            var posicion = pilas.obtener_posicion_desde_evento(this, event);
            pilas.escena_actual().cuando_termina_click.emitir(posicion);
        };

        this.canvas.onmousemove = function (event) {
            var posicion = pilas.obtener_posicion_desde_evento(this, event);
            pilas.escena_actual().mueve_mouse.emitir(posicion);
        };

        window.onkeydown = function (event) {
            var e = pilas.obtener_codigo_y_texto_desde_evento(event);
            pilas.escena_actual().pulsa_tecla.emitir(e);
        };

        window.onkeyup = function (event) {
            var e = pilas.obtener_codigo_y_texto_desde_evento(event);
            pilas.escena_actual().suelta_tecla.emitir(e);
        };
    };

    /**
    * @method obtener_posicion_desde_evento
    * @private
    *
    * A partir del evento del mouse, obtiene la posicion del puntero en
    * las coordenadas de Pilas.
    */
    Pilas.prototype.obtener_posicion_desde_evento = function (canvas, event) {
        var escena = pilas.escena_actual();
        var camara = escena.camara;
        var posicion = escena.obtener_posicion_escenario(escena.stage.mouseX, escena.stage.mouseY);
        posicion.boton = event.which;

        return posicion;
    };

    /**
    * @method obtener_canvas
    * @private
    *
    * Obtiene la referencia al elemento HTML canvas usando
    * el atributo *canvas_id* de las opciones iniciales.
    */
    Pilas.prototype.obtener_canvas = function () {
        if (this.opciones.canvas !== null)
            this.canvas = this.opciones.canvas;
        else
            this.canvas = document.getElementById(this.opciones.canvas_id);

        if (!this.canvas)
            throw new Error("No se encuentra el elemento canvas (id='" + this.opciones.canvas_id + "'), especificalo con opciones como {canvas_id: 'id_del_canvas'}");
    };

    /**
    * @method onready
    * Callback que se invoca una vez que pilas puede comenzar a funcionar.
    */
    Pilas.prototype.onready = function () {
        throw "pilas-engine ha iniciado, pero el metodo onready está vacío. Tienes que sobre-escribirlo...";
    };

    /**
    * @method ejecutar
    * Pone en funcionamiento el bucle principal.
    */
    Pilas.prototype.ejecutar = function () {
        var self = this;

        // TODO: Limpiar los listeners con un mensaje y
        //       no accediendo directamente a la propiedad.
        createjs.Ticker.setFPS(60);
        var my_tick = function (event) {
            self.actualizar();
        };
        createjs.Ticker.addEventListener('tick', my_tick);
    };

    /**
    * @method actualizar
    * Se ejecuta automáticamente 60 veces por segundo, para mantener el juego en funcionamiento.
    */
    Pilas.prototype.actualizar = function () {
        this.mundo.actualizar();
        this.rutinas.actualizar();
    };

    Pilas.prototype.interpolar = function (objeto, atributo, valor_o_valores, tiempo) {
        return this.interpolaciones.interpolar(objeto, atributo, valor_o_valores, tiempo);
    };

    Pilas.prototype.definir_modos = function (modos) {
        this.mundo.definir_modos(modos);
    };

    Pilas.prototype.mostrar_posiciones = function () {
        var modos = this.mundo.obtener_modos();
        modos.puntos_de_control = true;
        this.definir_modos(modos);
        return "Mostrando posiciones";
    };

    Pilas.prototype.ocultar_posiciones = function () {
        var modos = this.mundo.obtener_modos();
        modos.puntos_de_control = false;
        this.definir_modos(modos);
        return "Ocultando posiciones";
    };

    Pilas.prototype.mostrar_fisica = function () {
        var modos = this.mundo.obtener_modos();
        modos.fisica = true;
        this.definir_modos(modos);
        return "Mostrando fisica";
    };

    Pilas.prototype.ocultar_fisica = function () {
        var modos = this.mundo.obtener_modos();
        modos.fisica = false;
        this.definir_modos(modos);
        return "Ocultando fisica";
    };

    /**
    * @method obtener_actores_en
    * Se ejecuta para conseguir una lista de todos los actores que estén en una
    * coordenanda determinada de la pantalla.
    *
    * Opcionalmente se puede espeficiar una etiqueta a modo de filtro, con el
    * parámetro "con_etiqueta".
    *
    * ejemplos de invocaciones:
    *
    *     >>> pilas.obtener_actores_en(0, 0)
    *     [Actor, Mono, Fondo]
    *
    *     >>> pilas.obtener_actores_en(0, 0, 'Mono')
    *     [Mono]
    *
    */
    Pilas.prototype.obtener_actores_en = function (x, y, con_etiqueta) {
        if (typeof con_etiqueta === "undefined") { con_etiqueta = undefined; }
        var actores = [];

        for (var i = 0; i < this.escena_actual().actores.length; i++) {
            var actor = this.escena_actual().actores[i];

            if (actor.colisiona_con_un_punto(x, y)) {
                if (con_etiqueta) {
                    if (actor.tiene_etiqueta(con_etiqueta))
                        actores.push(actor);
                } else {
                    actores.push(actor);
                }
            }
        }

        return actores;
    };

    Pilas.prototype.obtener_actores_con_etiqueta = function (etiqueta) {
        var actores = [];

        for (var i = 0; i < this.escena_actual().actores.length; i++) {
            var actor = this.escena_actual().actores[i];

            if (actor.tiene_etiqueta(etiqueta))
                actores.push(actor);
        }

        return actores;
    };

    Pilas.prototype.izquierda = function () {
        return 0 - this.opciones.ancho / 2;
    };

    Pilas.prototype.derecha = function () {
        return this.opciones.ancho / 2;
    };

    Pilas.prototype.arriba = function () {
        return this.opciones.alto / 2;
    };

    Pilas.prototype.abajo = function () {
        return 0 - this.opciones.alto / 2;
    };
    return Pilas;
})();

pilas = new Pilas();

pilasengine = {
    iniciar: function iniciar(opciones) {
        window['pilas'] = new Pilas();

        window['pilas'].iniciar(opciones);
        return window['pilas'];
    }
};
/// <reference path="actor.ts"/>
/// <reference path="../pilas.ts"/>
var Aceituna = (function (_super) {
    __extends(Aceituna, _super);
    function Aceituna(x, y) {
        this.cuadro_normal = 'aceituna.png';
        this.cuadro_reir = 'aceituna_risa.png';
        this.cuadro_burlar = 'aceituna_burla.png';
        this.cuadro_gritar = 'aceituna_grita.png';

        _super.call(this, this.cuadro_normal, x, y);
        this.radio_de_colision = 20;
    }
    Aceituna.prototype.normal = function () {
        this.imagen = this.cuadro_normal;
    };

    Aceituna.prototype.reir = function () {
        this.imagen = this.cuadro_reir;
    };

    Aceituna.prototype.gritar = function () {
        this.imagen = this.cuadro_gritar;
    };

    Aceituna.prototype.burlarse = function () {
        this.imagen = this.cuadro_burlar;
    };

    Aceituna.prototype.saltar = function () {
        this.hacer(pilas.comportamientos.Saltar);
    };
    return Aceituna;
})(Actor);
/// <reference path="actor.ts"/>
var Bomba = (function (_super) {
    __extends(Bomba, _super);
    function Bomba(x, y) {
        var imagen = pilas.imagenes.cargar_grilla("bomba.png", 2);
        _super.call(this, imagen, x, y);
        this.radio_de_colision = 25;
        this.paso = 0;
        this.aprender(pilas.habilidades.PuedeExplotar);
    }
    Bomba.prototype.actualizar = function () {
        this.paso += 0.1;
        this._imagen.definir_cuadro(parseInt(this.paso) % 2);
    };
    return Bomba;
})(Actor);
/// <reference path="actor.ts"/>
var Nave = (function (_super) {
    __extends(Nave, _super);
    function Nave(x, y) {
        var imagen = pilas.imagenes.cargar_grilla("nave.png", 2);
        _super.call(this, imagen, x, y);
        this.paso = 0;
        this.enemigos = [];
        this.teclado_habilitado = false;
        this.aprender(pilas.habilidades.PuedeExplotar);
        this.aprender(pilas.habilidades.SeMantieneEnPantalla);
    }
    Nave.prototype.habilitar_teclado = function () {
        if (this.teclado_habilitado === false) {
            this.aprender(pilas.habilidades.MoverseConElTecladoConRotacion);
            this.aprender(pilas.habilidades.Disparar);
            this.teclado_habilitado = true;
            return "Habilitando el teclado";
        } else {
            return "El teclado ya estaba habilitado.";
        }
    };

    Nave.prototype.actualizar = function () {
        this.paso += 0.1;
        this._imagen.definir_cuadro(parseInt(this.paso) % 2);
        var control = pilas.escena_actual().control;
    };

    Nave.prototype.disparar = function () {
        var disparo = new pilas.actores.Proyectil(this.x, this.y, { rotacion: this.rotacion - 90 });
        disparo.enemigos = this.enemigos;
        return "Disparando ...";
    };

    Nave.prototype.avanzar = function (velocidad) {
        var rotacion_en_radianes;
        var dx;
        var dy;

        if (velocidad === undefined)
            velocidad = 10;

        var rotacion_en_radianes = pilas.utils.convertir_a_radianes(-this.rotacion + 90);

        dx = Math.cos(rotacion_en_radianes) * velocidad;
        dy = Math.sin(rotacion_en_radianes) * velocidad;

        this.x += dx;
        this.y += dy;
    };

    Nave.prototype.definir_enemigos = function (enemigos) {
        this.enemigos = enemigos;
        return "Definiendo enemigos.";
    };
    return Nave;
})(Actor);
/// <reference path="actor.ts"/>
var Explosion = (function (_super) {
    __extends(Explosion, _super);
    function Explosion(x, y) {
        var imagen = pilas.imagenes.cargar_grilla("explosion.png", 7);
        _super.call(this, imagen, x, y);
        this.paso = 0;
    }
    Explosion.prototype.actualizar = function () {
        this.paso += 0.1;

        if (this.paso > 1) {
            if (!this._imagen.avanzar())
                this.eliminar();
            this.paso = 0;
        }
    };
    return Explosion;
})(Actor);
/// <reference path="actor.ts"/>
var Proyectil = (function (_super) {
    __extends(Proyectil, _super);
    function Proyectil(x, y, atributos) {
        var imagen = pilas.imagenes.cargar_grilla("disparos/misil.png", 3);
        _super.call(this, imagen, x, y, atributos);
        this.hacer(pilas.comportamientos.AvanzarComoProyectil);
        this.paso = 0;
        this.enemigos = [];
    }
    Proyectil.prototype.actualizar = function () {
        this.paso += 0.1;
        this._imagen.definir_cuadro(parseInt(this.paso) % 2);

        this.analizar_colisiones();
    };

    Proyectil.prototype.analizar_colisiones = function () {
        for (var i = 0; i < this.enemigos.length; i++) {
            var enemigo = this.enemigos[i];

            if (enemigo.vivo && enemigo.colisiona_con_un_punto(this.x, this.y)) {
                enemigo.eliminar();
                this.eliminar();
            }
        }
    };
    return Proyectil;
})(Actor);
/// <reference path="actor.ts"/>
var Piedra = (function (_super) {
    __extends(Piedra, _super);
    function Piedra(x, y, tamano, dx, dy) {
        this.dx = dx || 0;
        this.dy = dy || 0;

        var tamano = tamano || "grande";
        var imagen = "piedra_" + tamano + ".png";

        _super.call(this, imagen, x, y);

        switch (tamano) {
            case 'chica':
                this.radio_de_colision = 10;
                break;

            case 'media':
                this.radio_de_colision = 15;
                break;

            case 'grande':
                this.radio_de_colision = 20;
                break;

            default:
                throw "El tamaño " + tamano + "no está permitido. Use 'chica', 'media' o 'grande'.";
                break;
        }

        this.rotacion = 0;
        this.aprender(pilas.habilidades.SeMantieneEnPantalla);
        this.aprender(pilas.habilidades.PuedeExplotar);
    }
    Piedra.prototype.actualizar = function () {
        this.x += this.dx;
        this.y += this.dy;
        this.rotacion += 1;
    };

    Piedra.prototype.empujar = function (dx, dy) {
        dx = dx || 0;
        dy = dy || 0;

        this.dx = dx / 10;
        this.dy = dy / 10;
        return "Empujando al actor";
    };

    Piedra.prototype.clonar = function (veces) {
        veces = veces || 0;
        veces = Math.min(veces, 5);

        for (var i = 0; i < veces; i++) {
            var dx = (Math.random() * 2) - 1;
            var dy = (Math.random() * 2) - 1;
            var tamano = this.obtener_tamano_al_azar();

            var tmp = new Piedra(this.x, this.y, tamano, 0, 0);
            tmp.empujar(dx, dy);

            if (window['enemigos'] === undefined) {
                window['enemigos'] = [this];
            }

            window['enemigos'].push(tmp);
        }

        return "Clonando el actor piedra.";
    };

    Piedra.prototype.obtener_tamano_al_azar = function () {
        var valores = ['chica', 'media', 'grande'];
        var max = 2;
        var min = 0;
        var indice = Math.floor((Math.random() * ((max + 1) - min)) + min);

        return valores[indice];
    };
    return Piedra;
})(Actor);
/// <reference path="actor.ts"/>
var Eje = (function (_super) {
    __extends(Eje, _super);
    function Eje(x, y) {
        var imagen = "ejes.png";
        _super.call(this, imagen, x, y);
    }
    return Eje;
})(Actor);
/// <reference path="actor.ts"/>
var Maton = (function (_super) {
    __extends(Maton, _super);
    function Maton(x, y) {
        var imagen = pilas.imagenes.cargar_grilla("rpg/maton.png", 3 * 4, 1);
        _super.call(this, imagen, x, y);
        this.paso = 0;
        this.aprender(pilas.habilidades.PuedeExplotar);
        this.cuadros = [
            [1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2],
            [4, 4, 4, 4, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5],
            [7, 7, 7, 7, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8],
            [10, 10, 10, 10, 9, 9, 9, 9, 10, 10, 10, 10, 11, 11, 11, 11]
        ];
        this.direccion = 0;
        this.velocidad = 1;
        window['maton'] = this;
        this.animar = false;
        this._imagen.definir_cuadro(7);
        this.obstaculos = [];
        this.teclado_habilitado = false;
    }
    Maton.prototype.actualizar = function () {
        if (this.animar)
            this.avanzar_animacion();
    };

    Maton.prototype.iniciar_animacion = function () {
        this.animar = true;
    };

    Maton.prototype.detener_animacion = function () {
        this.animar = false;
        this.paso = 0;
        this.avanzar_animacion();
    };

    Maton.prototype.avanzar_animacion = function () {
        this.paso += 0.3;

        if (this.paso >= this.cuadros[this.direccion].length) {
            this.paso = 0;
        }

        var cuadro_a_mostrar = this.cuadros[this.direccion][parseInt(this.paso, 10)];

        this._imagen.definir_cuadro(cuadro_a_mostrar);
    };

    Maton.prototype.mover = function (x, y) {
        if (x < 0)
            this.direccion = 3;

        if (x > 0)
            this.direccion = 1;

        if (y > 0)
            this.direccion = 0;

        if (y < 0)
            this.direccion = 2;

        if (this.puede_moverse_a(this.x + x * this.velocidad, this.y))
            this.x += x * this.velocidad;

        if (this.puede_moverse_a(this.x, this.y + y * this.velocidad))
            this.y += y * this.velocidad;

        this.avanzar_animacion(); // TODO:
        this.z = this.y;
    };

    Maton.prototype.puede_moverse_a = function (x, y) {
        for (var i = 0; i < this.obstaculos.length; i++) {
            if (this.obstaculos[i].colisiona_con_un_punto(x, y))
                return false;
        }

        return true;
    };

    Maton.prototype.caminar_arriba = function (pasos) {
        this.hacer(pilas.comportamientos.CaminaArriba, { pasos: pasos });
        return "caminando " + pasos + " pasos";
    };

    Maton.prototype.caminar_abajo = function (pasos) {
        this.hacer(pilas.comportamientos.CaminaAbajo, { pasos: pasos });
        return "caminando " + pasos + " pasos";
    };

    Maton.prototype.caminar_izquierda = function (pasos) {
        this.hacer(pilas.comportamientos.CaminaIzquierda, { pasos: pasos });
        return "caminando " + pasos + " pasos";
    };

    Maton.prototype.caminar_derecha = function (pasos) {
        this.hacer(pilas.comportamientos.CaminaDerecha, { pasos: pasos });
        return "caminando " + pasos + " pasos";
    };

    Maton.prototype.saludar = function () {
        this.decir("¡ Hola !");
        return "saludando ...";
    };

    Maton.prototype.habilitar_teclado = function () {
        if (this.teclado_habilitado === false) {
            this.aprender(pilas.habilidades.MoverseConElTeclado);
            this.teclado_habilitado = true;
            return "Habilitando el teclado";
        } else {
            return "El teclado ya estaba habilitado.";
        }
    };

    Maton.prototype.inspeccionar = function () {
        console.log("inspeccionando ...");

        return "Métodos del actor Maton: \n" + "\n" + "- saludar() \n" + "- caminar_arriba(pasos) \n" + "- caminar_abajo(pasos) \n" + "- caminar_izquierda(pasos) \n" + "- caminar_derecha(pasos) \n" + "- mover(x, y) \n" + "- habilitar_teclado() \n" + "";
    };
    return Maton;
})(Actor);
/// <reference path="actor.ts"/>
var Globo = (function (_super) {
    __extends(Globo, _super);
    function Globo(x, y, mensaje) {
        console.log(x, y, mensaje);
        _super.call(this, "globo.png", 0, 0);
        this.mensaje = mensaje;
        this.x = x;
        this.y = y;
        var mensaje = this.mensaje;

        this.actor_texto = new pilas.actores.Texto(x, y, mensaje);
        this.actor_texto.z = -1000;

        pilas.mundo.agregar_tarea_una_vez(3, this.eliminar, {}, this);
    }
    Globo.prototype.eliminar = function () {
        this.actor_texto.eliminar();
        _super.prototype.eliminar.call(this);
    };
    return Globo;
})(Actor);
/// <reference path="actor.ts"/>
var Texto = (function (_super) {
    __extends(Texto, _super);
    function Texto(x, y, texto, color) {
        var imagen = "invisible.png";
        _super.call(this, imagen, x, y);
        this.texto = texto || "Sin texto";
        this.color = color || "black";
        this.crear_texto();
        this.transparencia = 100;
    }
    Texto.prototype.crear_texto = function () {
        var s = new createjs.Text(this.texto, "12px Arial", this.color);

        this.alto = s.heightscale;
        var pos = pilas.escena_actual().obtener_posicion_pantalla(this.x, this.y);
        s.x = pos.x;
        s.y = pos.y;
        s.textBaseline = "alphabetic";
        s.textAlign = "right";
        pilas.escena_actual().stage.addChild(s);
        this.sprite_texto = s;
    };

    Texto.prototype.eliminar_texto = function () {
        pilas.escena_actual().stage.removeChild(this.sprite_texto);
    };

    Texto.prototype.eliminar = function () {
        this.eliminar_texto();
        _super.prototype.eliminar.call(this);
    };
    return Texto;
})(Actor);
/// <reference path="actor.ts"/>
var Bloque = (function (_super) {
    __extends(Bloque, _super);
    function Bloque(x, y, nombre_imagen) {
        var imagen = nombre_imagen || "bloque.png";
        _super.call(this, imagen, x, y);
        this.z = y;
    }
    return Bloque;
})(Actor);
/// <reference path="actor.ts"/>
var Manzana = (function (_super) {
    __extends(Manzana, _super);
    function Manzana(x, y) {
        var imagen = "manzana_chica.png";
        _super.call(this, imagen, x, y);
        this.radio_de_colision = 11;
    }
    return Manzana;
})(Actor);
/// <reference path="actor.ts"/>
var Cofre = (function (_super) {
    __extends(Cofre, _super);
    function Cofre(x, y) {
        var imagen = pilas.imagenes.cargar_grilla("cofre.png", 4);
        _super.call(this, imagen, x, y);
        this.z = y;
        this._imagen.definir_cuadro(0);
        this.paso = 0;
        this.esta_abierto = false;
    }
    Cofre.prototype.abrir = function () {
        this.esta_abierto = true;
    };

    Cofre.prototype.actualizar = function () {
        // TODO: temporal para el tutorial
        if (this.esta_abierto) {
            this.paso += 0.1;

            if (this.paso > 3)
                this.paso = 3;

            this._imagen.definir_cuadro(parseInt(this.paso));
        }
    };
    return Cofre;
})(Actor);
/// <reference path="actor.ts"/>
var Llave = (function (_super) {
    __extends(Llave, _super);
    function Llave(x, y) {
        var imagen = "llave.png";
        _super.call(this, imagen, x, y);
        this.z = y;
    }
    return Llave;
})(Actor);
/// <reference path="actor.ts"/>
var Caja = (function (_super) {
    __extends(Caja, _super);
    function Caja(x, y) {
        var imagen = "caja.png";
        _super.call(this, imagen, x, y);
        this.radio_de_colision = 25;

        this.aprender(pilas.habilidades.RebotarComoCaja);
    }
    return Caja;
})(Actor);
/// <reference path="actor.ts"/>
var Cesto = (function (_super) {
    __extends(Cesto, _super);
    function Cesto(x, y) {
        if (typeof x === "undefined") { x = 120; }
        if (typeof y === "undefined") { y = 0; }
        var ancho = 40;
        var imagen = "cesto.png";
        _super.call(this, imagen, x, y);
        this.centro_x = ancho;
        this.centro_y = ancho;
        this.radio_de_colision = 20;

        var fisica = pilas.escena_actual().fisica;

        this.figura1 = fisica.crear_rectangulo(x - ancho, 0, y + 10, 30, { dinamico: false });
        this.figura2 = fisica.crear_rectangulo(x + ancho - 15, y + 0, 20, 20, { dinamico: false });
        this.figura3 = fisica.crear_rectangulo(x + ancho - 5, y + 20, 5, 40, { dinamico: false });
    }
    return Cesto;
})(Actor);
/// <reference path="actor.ts"/>
var Pelota = (function (_super) {
    __extends(Pelota, _super);
    function Pelota(x, y) {
        var imagen = "pelota.png";
        _super.call(this, imagen, x, y);
        this.radio_de_colision = 25;

        this.aprender(pilas.habilidades.RebotarComoPelota);
    }
    Pelota.prototype.empujar = function (dx, dy) {
        this.figura.empujar(dx * 100, -dy * 100);
        return "empujando hacia (" + dx + ", " + dy + ") ...";
    };

    Pelota.prototype.posicion = function (x, y) {
        if (this.figura !== undefined) {
            this.figura.definir_posicion(x, y);
        } else {
            this.x = x;
            this.y = y;
        }
    };
    return Pelota;
})(Actor);
/// <reference path="actor.ts"/>
var Zanahoria = (function (_super) {
    __extends(Zanahoria, _super);
    function Zanahoria(x, y) {
        this.cuadro_normal = "zanahoria_normal.png";
        this.cuadro_sonrie = "zanahoria_sonrie.png";
        _super.call(this, this.cuadro_normal, x, y);
        this.radio_de_colision = 25;
    }
    Zanahoria.prototype.normal = function () {
        this.imagen = this.cuadro_normal;
    };

    Zanahoria.prototype.sonreir = function () {
        this.imagen = this.cuadro_sonrie;
    };

    Zanahoria.prototype.saltar = function () {
        this.sonreir();
        this.hacer(pilas.comportamientos.Saltar, { cuando_termina: this.normal });
    };

    Zanahoria.prototype.decir = function () {
        this.sonreir();
        _super.prototype.decir.call(this, "hola");
        pilas.mundo.agregar_tarea_una_vez(1, this.normal, {}, this);
    };
    return Zanahoria;
})(Actor);
var Boton = (function (_super) {
    __extends(Boton, _super);
    function Boton(x, y, ruta_normal, ruta_press, ruta_over) {
        if (typeof ruta_normal === "undefined") { ruta_normal = 'boton/boton_normal.png'; }
        if (typeof ruta_press === "undefined") { ruta_press = 'boton/boton_press.png'; }
        if (typeof ruta_over === "undefined") { ruta_over = 'boton/boton_over.png'; }
        this.ruta_normal = ruta_normal;
        this.ruta_press = ruta_press;
        this.ruta_over = ruta_over;

        this.funciones_normal = [];
        this.funciones_press = [];
        this.funciones_over = [];

        this.estado = true;

        _super.call(this, ruta_normal, x, y);

        pilas.escena_actual().click_de_mouse.conectar(this);
        pilas.escena_actual().mueve_mouse.conectar(this);
    }
    Boton.prototype.recibir = function (evento, tipo) {
        if (tipo == pilas.escena_actual().click_de_mouse) {
            this.detectar_clic(evento);
        }
        if (tipo == pilas.escena_actual().mueve_mouse) {
            this.detectar_movimiento(evento);
        }
    };

    Boton.prototype.conectar_normal = function (funcion, args) {
        if (typeof args === "undefined") { args = undefined; }
        var temp = [funcion, args];
        this.funciones_normal.push(temp);
    };

    Boton.prototype.conectar_presionado = function (funcion, args) {
        if (typeof args === "undefined") { args = undefined; }
        var temp = [funcion, args];
        this.funciones_press.push(temp);
    };

    Boton.prototype.conectar_sobre = function (funcion, args) {
        if (typeof args === "undefined") { args = undefined; }
        var temp = [funcion, args];
        this.funciones_over.push(temp);
    };

    Boton.prototype.desconectar_normal_todo = function () {
        this.funciones_normal = [];
    };

    Boton.prototype.desconectar_presionado_todo = function () {
        this.funciones_press = [];
    };

    Boton.prototype.desconectar_sobre_todo = function () {
        this.funciones_over = [];
    };

    Boton.prototype.desconectar_normal = function (funcion, args) {
        for (var i = 0; i < this.funciones_normal.length; i++) {
            if (this.funciones_normal[i][0] == funcion) {
                if (this.funciones_normal[i][1] == args) {
                    this.funciones_normal.splice(i, 1);
                }
            }
        }
    };

    Boton.prototype.desconectar_presionado = function (funcion, args) {
        for (var i = 0; i < this.funciones_press.length; i++) {
            if (this.funciones_press[i][0] == funcion) {
                if (this.funciones_press[i][1] == args) {
                    this.funciones_press.splice(i, 1);
                }
            }
        }
    };

    Boton.prototype.desconectar_sobre = function (funcion, args) {
        for (var i = 0; i < this.funciones_over.length; i++) {
            if (this.funciones_over[i][0] == funcion) {
                if (this.funciones_over[i][1] == args) {
                    this.funciones_over.splice(i, 1);
                }
            }
        }
    };

    Boton.prototype.ejecutar_funciones_normal = function () {
        if (this.estado) {
            for (var i = 0; i < this.funciones_normal.length; i++) {
                if (this.funciones_normal[i][1] == undefined) {
                    this.funciones_normal[i][0]();
                } else {
                    this.funciones_press[i][0](this.funciones_normal[i][1]);
                }
            }
        }
    };

    Boton.prototype.ejecutar_funciones_press = function () {
        if (this.estado) {
            for (var i = 0; i < this.funciones_press.length; i++) {
                if (this.funciones_press[i][1] == undefined) {
                    this.funciones_press[i][0]();
                } else {
                    this.funciones_press[i][0](this.funciones_press[i][1]);
                }
            }
        }
    };

    Boton.prototype.ejecutar_funciones_over = function () {
        if (this.estado) {
            for (var i = 0; i < this.funciones_over.length; i++) {
                if (this.funciones_over[i][1] == undefined) {
                    this.funciones_over[i][0]();
                } else {
                    this.funciones_over[i][0](this.funciones_over[i][1]);
                }
            }
        }
    };

    Boton.prototype.activar = function () {
        this.estado = true;
    };

    Boton.prototype.desactivar = function () {
        this.estado = false;
    };

    Boton.prototype.pintar_normal = function () {
        this.imagen = this.ruta_normal;
    };

    Boton.prototype.pintar_presionado = function () {
        this.imagen = this.ruta_press;
    };

    Boton.prototype.pintar_sobre = function () {
        this.imagen = this.ruta_over;
    };

    Boton.prototype.detectar_clic = function (click) {
        if (this.colisiona_con_un_punto(click.x, click.y)) {
            this.ejecutar_funciones_press();
        }
    };

    Boton.prototype.detectar_movimiento = function (evento) {
        if (this.colisiona_con_un_punto(evento.x, evento.y)) {
            this.ejecutar_funciones_over();
        } else {
            this.ejecutar_funciones_normal();
        }
    };
    return Boton;
})(Actor);
/// <reference path="actor.ts"/>
/// <reference path="texto.ts"/>
var Puntaje = (function (_super) {
    __extends(Puntaje, _super);
    function Puntaje(x, y, puntaje, color) {
        this.valor = puntaje || 0;
        _super.call(this, x, y, this.valor.toString(), color);
    }
    Puntaje.prototype.aumentar = function (aumento) {
        this.valor += aumento;
        this.texto = this.valor.toString();

        //Conservar la escala y el radio de colisión
        //TODO: es necesario mejorar el actor Texto
        var escala = this.escala;
        var radio_de_colision = this.radio_de_colision;

        this.eliminar_texto();
        this.crear_texto();
        this.escala = escala;
        this.radio_de_colision = radio_de_colision;
    };

    Puntaje.prototype.obtener = function () {
        return this.valor;
    };
    return Puntaje;
})(Texto);
/// <reference path="actor.ts"/>
var Mono = (function (_super) {
    __extends(Mono, _super);
    function Mono(x, y) {
        this.image_normal = 'monkey_normal.png';
        this.image_smile = 'monkey_smile.png';
        this.image_shout = 'monkey_shout.png';

        this.sound_smile = pilas.sonidos.cargar('smile.ogg');
        this.sound_shout = pilas.sonidos.cargar('shout.ogg');
        _super.call(this, this.image_normal, x, y);

        this.radio_de_colision = 50;
    }
    Mono.prototype.sonreir = function () {
        this.sound_smile.reproducir();
        this.imagen = this.image_smile;
        pilas.mundo.agregar_tarea_una_vez(1, this.normal, {}, this);
    };

    Mono.prototype.gritar = function () {
        this.sound_shout.reproducir();
        this.imagen = this.image_shout;
        pilas.mundo.agregar_tarea_una_vez(1, this.normal, {}, this);
    };

    Mono.prototype.normal = function () {
        this.imagen = this.image_normal;
    };

    Mono.prototype.decir = function (mensaje) {
        this.sonreir;
        _super.prototype.decir.call(this, mensaje);
    };

    Mono.prototype.saltar = function () {
        this.sonreir();
        this.hacer(pilas.comportamientos.Saltar);
    };
    return Mono;
})(Actor);
var Banana = (function (_super) {
    __extends(Banana, _super);
    function Banana(x, y) {
        if (typeof x === "undefined") { x = 0; }
        if (typeof y === "undefined") { y = 0; }
        var imagen = pilas.imagenes.cargar_grilla('banana.png', 2);
        _super.call(this, imagen, x, y);
        this._imagen.definir_cuadro(0);
    }
    Banana.prototype.cerrar = function () {
        this._imagen.definir_cuadro(0);
    };

    Banana.prototype.abrir = function () {
        this._imagen.definir_cuadro(1);
    };
    return Banana;
})(Actor);
var Tortuga = (function (_super) {
    __extends(Tortuga, _super);
    function Tortuga(x, y, dibuja) {
        if (typeof x === "undefined") { x = 0; }
        if (typeof y === "undefined") { y = 0; }
        if (typeof dibuja === "undefined") { dibuja = true; }
        var imagen = 'tortuga.png';
        _super.call(this, imagen, x, y);

        this.pizarra = new pilas.actores.Pizarra();

        if (dibuja)
            this.bajalapiz();
        else
            this.subelapiz();

        this.color = pilas.colores.negro;
    }
    Tortuga.prototype.avanzar = function (pasos) {
        this.hacer_luego(pilas.comportamientos.Avanzar, { pasos: pasos, velocidad: 2 });
    };

    Tortuga.prototype.girarderecha = function (delta) {
        this.hacer_luego(pilas.comportamientos.Girar, { angulo: delta, tiempo: .5 });
    };

    Tortuga.prototype.girarizquierda = function (delta) {
        this.hacer_luego(pilas.comportamientos.Girar, { angulo: -delta, tiempo: .5 });
    };

    Tortuga.prototype.actualizar = function () {
        if (this.x != this.anterior_x || this.y != this.anterior_y) {
            if (this.lapiz_bajo) {
                this.pizarra.linea(this.anterior_x, this.anterior_y, this.x, this.y, this.color, 4);
            }

            this.anterior_x = this.x;
            this.anterior_y = this.y;
        }
    };

    Tortuga.prototype.bajalapiz = function () {
        this.lapiz_bajo = true;
    };

    Tortuga.prototype.subelapiz = function () {
        this.lapiz_bajo = false;
    };

    Tortuga.prototype.crear_poligono = function (lados, escala, sentido) {
        if (typeof lados === "undefined") { lados = 3; }
        if (typeof escala === "undefined") { escala = 100; }
        if (typeof sentido === "undefined") { sentido = -1; }
        var rotacion = 360 / lados;

        for (var i = 0; i < lados; i++) {
            this.avanzar(escala);

            if (sentido == 1)
                this.girarderecha(rotacion);
            else
                this.girarizquierda(rotacion);
        }
    };

    Tortuga.prototype.crear_circulo = function (radio, sentido) {
        if (typeof sentido === "undefined") { sentido = -1; }
        for (var i = 0; i < 36; i++) {
            this.avanzar(radio);
            if (sentido == 1)
                this.girarderecha(10);
            else
                this.girarizquierda(10);
        }
    };


    Object.defineProperty(Tortuga.prototype, "color", {
        get: function () {
            return this._color;
        },
        set: function (_color) {
            this._color = _color;
        },
        enumerable: true,
        configurable: true
    });
    return Tortuga;
})(Actor);
var Pizarra = (function (_super) {
    __extends(Pizarra, _super);
    function Pizarra(x, y) {
        if (typeof x === "undefined") { x = 0; }
        if (typeof y === "undefined") { y = 0; }
        var imagen = 'invisible.png';
        _super.call(this, imagen, x, y);

        this._ancho = pilas.opciones.ancho;
        this._alto = pilas.opciones.alto;

        //crear lienzo
        this.container = new createjs.Container();
        this.lienzo = new createjs.Shape(this.x, this.y); // TODO: Permitir que acepte ancho y alto de la pizarra
        this.container.addChild(this.lienzo);
        pilas.escena_actual().stage.addChild(this.container);
    }
    Pizarra.prototype.dibujar_punto = function (x, y, color) {
        if (typeof color === "undefined") { color = pilas.colores.negro; }
        var pos = pilas.escena_actual().obtener_posicion_pantalla(x, y);

        this.lienzo.graphics.beginStroke(color);
        this.lienzo.graphics.beginFill(color);
        this.lienzo.graphics.drawCircle(pos.x, pos.y, 3).endStroke();
    };

    Pizarra.prototype.linea = function (x, y, x2, y2, color, grosor) {
        if (typeof color === "undefined") { color = pilas.colores.negro; }
        if (typeof grosor === "undefined") { grosor = 1; }
        var pos = pilas.escena_actual().obtener_posicion_pantalla(x, y);
        var pos2 = pilas.escena_actual().obtener_posicion_pantalla(x2, y2);

        this.lienzo.graphics.setStrokeStyle(grosor);
        this.lienzo.graphics.beginStroke(color);
        this.lienzo.graphics.moveTo(pos.x, pos.y);
        this.lienzo.graphics.lineTo(pos2.x, pos2.y).endStroke();
    };

    Pizarra.prototype.rectangulo = function (x, y, ancho, alto, color, relleno, grosor) {
        if (typeof color === "undefined") { color = pilas.colores.negro; }
        if (typeof relleno === "undefined") { relleno = false; }
        if (typeof grosor === "undefined") { grosor = 1; }
        if (!relleno)
            var color_relleno = createjs.Graphics.getRGB(255, 255, 255, 0);
        else
            var color_relleno = relleno;

        var pos = pilas.escena_actual().obtener_posicion_pantalla(x, y);

        this.lienzo.graphics.setStrokeStyle(grosor);
        this.lienzo.graphics.beginStroke(color);
        this.lienzo.graphics.beginFill(color_relleno);
        this.lienzo.graphics.drawRect(pos.x, pos.y, ancho, alto).endStroke();
    };

    Pizarra.prototype.poligono = function (puntos, color, grosor) {
        if (typeof color === "undefined") { color = pilas.colores.negro; }
        if (typeof grosor === "undefined") { grosor = 1; }
        for (var i = 1; i < puntos.length; i++) {
            this.linea(puntos[i - 1][0], puntos[i - 1][1], puntos[i][0], puntos[i][1], color = color, grosor = grosor);
        }
    };

    Pizarra.prototype.limpiar = function () {
        this.lienzo.graphics.clear();
    };

    Pizarra.prototype.pintar = function (color) {
        this.rectangulo(this.x - 320, this.y + 240, this._ancho, this._alto, color, color, 1);
    };
    return Pizarra;
})(Actor);
var Pingu = (function (_super) {
    __extends(Pingu, _super);
    function Pingu(x, y) {
        if (typeof x === "undefined") { x = 0; }
        if (typeof y === "undefined") { y = 0; }
        var imagen = pilas.imagenes.cargar_grilla('pingu.png', 10);
        _super.call(this, imagen, x, y);
        this._imagen.definir_cuadro(4);
        this.paso = 0;
        this.centro_y = 50;
        this.cuadros_correr = [5, 6, 7, 8, 9];
        this.saltando = false;
    }
    Pingu.prototype.actualizar = function () {
        if (!this.saltando) {
            if (pilas.escena_actual().control.derecha) {
                this.hacer(pilas.comportamientos.CaminaDerecha);
            } else if (pilas.escena_actual().control.izquierda) {
                this.hacer(pilas.comportamientos.CaminaIzquierda);
            }

            if (pilas.escena_actual().control.arriba) {
                this.saltando = true;
                this.hacer(pilas.comportamientos.Saltando, { cuando_termina: this.puede_saltar });
                this._imagen.definir_cuadro(0);
            }
        }
    };

    Pingu.prototype.puede_saltar = function () {
        this.saltando = false;
        this.detener_animacion();
    };

    Pingu.prototype.mover = function (x, y) {
        this.x += x;
        this.animacion_correr();
    };

    Pingu.prototype.animacion_correr = function () {
        this.paso += .3;
        if (this.paso > this.cuadros_correr.length) {
            this.paso = 0;
        }
        this._imagen.definir_cuadro(this.cuadros_correr[parseInt(this.paso)]);
    };

    Pingu.prototype.detener_animacion = function () {
        this._imagen.definir_cuadro(4);
    };
    return Pingu;
})(Actor);
// <reference path="comportamientos.ts />
var Alien = (function (_super) {
    __extends(Alien, _super);
    function Alien(x, y) {
        if (typeof x === "undefined") { x = 0; }
        if (typeof y === "undefined") { y = 0; }
        var imagen = pilas.imagenes.cargar_animacion('alien.png', 14);
        _super.call(this, imagen, x, y);

        window['alien'] = this;

        imagen.definir_animacion("parado", [11, 11], 5);
        imagen.definir_animacion("hablar", [12, 13, 11, 12, 11, 13], 15);
        imagen.definir_animacion("recoger", [12, 10, 10, 10, 10, 12], 5);
        imagen.definir_animacion("camina", [0, 1, 2, 3, 4, 3, 2, 1], 15);
        imagen.cargar_animacion("parado");

        this.radio_de_colision = 30;

        this.sonido_blabla = pilas.sonidos.cargar('blabla.wav');
        this.cuando_busca_recoger = undefined;
    }
    Alien.prototype.iniciar = function () {
        this.sombra = new pilas.actores.Sombra();
        this.sombra.escala = 0.5;
        this.limitar_movimientos = true;

        this.centro_y = 'abajo';
        this.centro_y -= 10;
    };

    Alien.prototype.decir = function (mensaje) {
        this.hacer_luego(Hablar, { mensaje: mensaje, tiempo: 1 });
    };

    Alien.prototype.super_decir = function (mensaje) {
        _super.prototype.decir.call(this, mensaje);
        this.sonido_blabla.reproducir();
    };

    Alien.prototype.actualizar = function () {
        this.z = this.y;

        this.sombra.x = this.x;
        this.sombra.y = this.y;
        this.sombra.z = this.z + 1;
    };

    Alien.prototype.avanzar_animacion = function () {
        return this._imagen.avanzar();
    };

    Alien.prototype.ir_derecha = function () {
        this.hacer_luego(MoverHaciaDerecha, { cantidad: 68, tiempo: 1 });
    };

    Alien.prototype.ir_izquierda = function () {
        this.hacer_luego(MoverHaciaIzquierda, { cantidad: 68, tiempo: 1 });
    };

    Alien.prototype.ir_arriba = function () {
        this.hacer_luego(MoverHaciaArriba, { cantidad: 80, tiempo: 1 });
    };

    Alien.prototype.ir_abajo = function () {
        this.hacer_luego(MoverHaciaAbajo, { cantidad: 80, tiempo: 1 });
    };

    Alien.prototype.esperar = function (tiempo) {
        if (typeof tiempo === "undefined") { tiempo = 2; }
        this.hacer_luego(Esperar, { tiempo: tiempo });
    };

    Alien.prototype.detener = function () {
        this.esperar(0);
    };

    Alien.prototype.recoger = function () {
        this.hacer_luego(Recoger, { tiempo: 1 });
    };

    Alien.prototype.colisiona_con_item = function (item_name) {
        var _this = this;
        return pilas.escena_actual().actores.filter(function (i) {
            return i.getClassName() === item_name;
        }).some(function (i) {
            return _this.colisiona_con(i);
        });
    };
    return Alien;
})(Actor);

var Movimiento = (function () {
    function Movimiento(argumentos) {
        this.argumentos = argumentos;
    }
    Movimiento.prototype.iniciar = function (receptor) {
        this.receptor = receptor;
        this.tiempo = this.argumentos.tiempo || 2;
        this.cantidad = this.argumentos.cantidad || 32;

        this._contador_de_tiempo = 0;
        this._velocidad = (this.cantidad / 60.0) / this.tiempo;
        this.iniciar_animacion();
    };

    Movimiento.prototype.iniciar_animacion = function () {
    };

    Movimiento.prototype.supero_el_tiempo = function () {
        return (this._contador_de_tiempo > this.tiempo * 60);
    };

    Movimiento.prototype.al_terminar = function () {
    };
    return Movimiento;
})();

var MoverHaciaDerecha = (function (_super) {
    __extends(MoverHaciaDerecha, _super);
    function MoverHaciaDerecha() {
        _super.apply(this, arguments);
    }
    MoverHaciaDerecha.prototype.iniciar_animacion = function () {
        this.receptor._imagen.cargar_animacion("camina");
        this.receptor.espejado = false;
    };

    MoverHaciaDerecha.prototype.actualizar = function () {
        this.receptor.avanzar_animacion();
        this.realizar_movimiento();

        if (this.supero_el_tiempo()) {
            this.receptor._imagen.cargar_animacion('parado');
            this.al_terminar();
            return true;
        }

        this._contador_de_tiempo += 1;
    };

    MoverHaciaDerecha.prototype.realizar_movimiento = function () {
        this.receptor.x += this._velocidad;
    };
    return MoverHaciaDerecha;
})(Movimiento);

var MoverHaciaIzquierda = (function (_super) {
    __extends(MoverHaciaIzquierda, _super);
    function MoverHaciaIzquierda() {
        _super.apply(this, arguments);
    }
    MoverHaciaIzquierda.prototype.iniciar_animacion = function () {
        this.receptor._imagen.cargar_animacion("camina");
        this.receptor.espejado = true;
    };

    MoverHaciaIzquierda.prototype.realizar_movimiento = function () {
        this.receptor.x -= this._velocidad;
    };
    return MoverHaciaIzquierda;
})(MoverHaciaDerecha);

var MoverHaciaArriba = (function (_super) {
    __extends(MoverHaciaArriba, _super);
    function MoverHaciaArriba() {
        _super.apply(this, arguments);
    }
    MoverHaciaArriba.prototype.iniciar_animacion = function () {
        this.receptor._imagen.cargar_animacion("camina");
    };

    MoverHaciaArriba.prototype.realizar_movimiento = function () {
        this.receptor.y += this._velocidad;
    };
    return MoverHaciaArriba;
})(MoverHaciaDerecha);

var MoverHaciaAbajo = (function (_super) {
    __extends(MoverHaciaAbajo, _super);
    function MoverHaciaAbajo() {
        _super.apply(this, arguments);
    }
    MoverHaciaAbajo.prototype.iniciar_animacion = function () {
        this.receptor._imagen.cargar_animacion("camina");
    };

    MoverHaciaAbajo.prototype.realizar_movimiento = function () {
        this.receptor.y -= this._velocidad;
    };
    return MoverHaciaAbajo;
})(MoverHaciaDerecha);

var Esperar = (function (_super) {
    __extends(Esperar, _super);
    function Esperar() {
        _super.apply(this, arguments);
    }
    Esperar.prototype.iniciar_animacion = function () {
        this.receptor._imagen.cargar_animacion("parado");
        this.receptor.espejado = true;
    };

    Esperar.prototype.realizar_movimiento = function () {
    };
    return Esperar;
})(MoverHaciaDerecha);

var Recoger = (function (_super) {
    __extends(Recoger, _super);
    function Recoger() {
        _super.apply(this, arguments);
    }
    Recoger.prototype.iniciar_animacion = function () {
        this.receptor._imagen.cargar_animacion("recoger");
    };

    Recoger.prototype.actualizar = function () {
        if (this.receptor.avanzar_animacion() === false) {
            this.receptor._imagen.cargar_animacion('parado');

            if (this.receptor.cuando_busca_recoger) {
                this.receptor.cuando_busca_recoger.call(this);
            }

            return true;
        }

        return false;
    };
    return Recoger;
})(Movimiento);

var Hablar = (function (_super) {
    __extends(Hablar, _super);
    function Hablar() {
        _super.apply(this, arguments);
    }
    Hablar.prototype.iniciar_animacion = function () {
        this.receptor._imagen.cargar_animacion("hablar");
        this.receptor.super_decir(this.argumentos.mensaje);
        this.contador = 0;
    };

    Hablar.prototype.realizar_movimiento = function () {
    };
    return Hablar;
})(MoverHaciaDerecha);
// <reference path="comportamientos.ts />
var AlienMarron = (function (_super) {
    __extends(AlienMarron, _super);
    function AlienMarron(x, y) {
        if (typeof x === "undefined") { x = 0; }
        if (typeof y === "undefined") { y = 0; }
        var imagen = pilas.imagenes.cargar_animacion('alien_marron.png', 14);
        _super.call(this, imagen, x, y);

        window['alien'] = this;

        imagen.definir_animacion("parado", [11, 11], 5);
        imagen.definir_animacion("hablar", [12, 13, 11, 12, 11, 13], 15);
        imagen.definir_animacion("recoger", [12, 10, 10, 10, 10, 12], 5);
        imagen.definir_animacion("camina", [0, 1, 2, 3, 4, 3, 2, 1], 15);
        imagen.cargar_animacion("parado");

        this.sonido_blabla = pilas.sonidos.cargar('blabla.wav');
        this.cuando_busca_recoger = undefined;
    }
    AlienMarron.prototype.iniciar = function () {
        this.sombra = new pilas.actores.Sombra();
        this.sombra.escala = 0.5;
        this.limitar_movimientos = true;

        this.centro_y = 'abajo';
        this.centro_y -= 10;
    };

    AlienMarron.prototype.decir = function (mensaje) {
        //this.hacer_luego(Hablar, {mensaje: mensaje, tiempo: 1});
    };

    AlienMarron.prototype.super_decir = function (mensaje) {
        _super.prototype.decir.call(this, mensaje);
        this.sonido_blabla.reproducir();
    };

    AlienMarron.prototype.actualizar = function () {
        this.z = this.y;

        this.sombra.x = this.x;
        this.sombra.y = this.y;
        this.sombra.z = this.z + 1;
    };

    AlienMarron.prototype.avanzar_animacion = function () {
        return this._imagen.avanzar();
    };

    AlienMarron.prototype.ir_derecha = function () {
        //this.hacer_luego(MoverHaciaDerecha, {cantidad: 68, tiempo: 1});
    };

    AlienMarron.prototype.ir_izquierda = function () {
        //this.hacer_luego(MoverHaciaIzquierda, {cantidad: 68, tiempo: 1});
    };

    AlienMarron.prototype.ir_arriba = function () {
        //this.hacer_luego(MoverHaciaArriba, {cantidad: 80, tiempo: 1});
    };

    AlienMarron.prototype.ir_abajo = function () {
        //this.hacer_luego(MoverHaciaAbajo, {cantidad: 80, tiempo: 1});
    };

    AlienMarron.prototype.esperar = function (tiempo) {
        if (typeof tiempo === "undefined") { tiempo = 2; }
        //this.hacer_luego(Esperar, {tiempo: tiempo});
    };

    AlienMarron.prototype.detener = function () {
        //this.esperar(0);
    };

    AlienMarron.prototype.recoger = function () {
        //this.hacer_luego(Recoger, {tiempo: 1});
    };
    return AlienMarron;
})(Actor);
/// <reference path="actor.ts"/>
var Tuerca = (function (_super) {
    __extends(Tuerca, _super);
    function Tuerca(x, y) {
        var imagen = "tuerca.png";
        _super.call(this, imagen, x, y);
        this.radio_de_colision = 11;
        this.y_original = y + 20;
        this.x = x + 10;
        this.contador = Math.random() * 3;
        this.sombra = new pilas.actores.Sombra();
        this.sombra.escala = 0.25;
    }
    Tuerca.prototype.actualizar = function () {
        this.contador += 0.025;
        this.y = this.y_original + Math.sin(this.contador) * 5;
        this.sombra.x = this.x;
        this.sombra.y = this.y_original - 20;
        this.sombra.z = this.z + 1;
    };
    return Tuerca;
})(Actor);
/// <reference path="actor.ts"/>
var Sombra = (function (_super) {
    __extends(Sombra, _super);
    function Sombra(x, y) {
        _super.call(this, "sombra.png", x, y);
        this.radio_de_colision = 20;
    }
    return Sombra;
})(Actor);
/// <reference path='actores/aceituna.ts' />
/// <reference path='actores/bomba.ts' />
/// <reference path='actores/nave.ts' />
/// <reference path='actores/explosion.ts' />
/// <reference path='actores/proyectil.ts' />
/// <reference path='actores/piedra.ts' />
/// <reference path='actores/eje.ts' />
/// <reference path='actores/maton.ts' />
/// <reference path='actores/globo.ts' />
/// <reference path='actores/texto.ts' />
/// <reference path='actores/bloque.ts' />
/// <reference path='actores/manzana.ts' />
/// <reference path='actores/cofre.ts' />
/// <reference path='actores/llave.ts' />
/// <reference path='actores/caja.ts' />
/// <reference path='actores/cesto.ts' />
/// <reference path='actores/pelota.ts' />
/// <reference path='actores/zanahoria.ts' />
/// <reference path='actores/boton.ts' />
/// <reference path='actores/puntaje.ts' />
/// <reference path='actores/mono.ts' />
/// <reference path='actores/banana.ts' />
/// <reference path='actores/tortuga.ts' />
/// <reference path='actores/pizarra.ts' />
/// <reference path='actores/pingu.ts' />
/// <reference path='actores/alien.ts' />
/// <reference path='actores/alien_marron.ts' />
/// <reference path='actores/tuerca.ts' />
/// <reference path='actores/sombra.ts' />
/**
* @class Actores
*
* Módulo Actores
* ==============
*
* Representa todos los actores conocidos en pilas-engine.
*/
var Actores = (function () {
    function Actores(pilas) {
        this.pilas = pilas;
        this.Aceituna = Aceituna;
        this.Actor = Actor;
        this.Bomba = Bomba;
        this.Nave = Nave;
        this.Explosion = Explosion;
        this.Proyectil = Proyectil;
        this.Piedra = Piedra;
        this.Eje = Eje;
        this.Maton = Maton;
        this.Globo = Globo;
        this.Texto = Texto;
        this.Bloque = Bloque; // TODO: eliminar, es solo para implementar tutorial.
        this.Manzana = Manzana;
        this.Cofre = Cofre;
        this.Llave = Llave;
        this.Caja = Caja;
        this.Cesto = Cesto;
        this.Pelota = Pelota;
        this.Zanahoria = Zanahoria;
        this.Boton = Boton;
        this.Puntaje = Puntaje;
        this.Mono = Mono;
        this.Banana = Banana;
        this.Tortuga = Tortuga;
        this.Pizarra = Pizarra;
        this.Pingu = Pingu;
        this.Alien = Alien;
        this.AlienMarron = AlienMarron;
        this.Tuerca = Tuerca;
        this.Sombra = Sombra;
    }
    return Actores;
})();
