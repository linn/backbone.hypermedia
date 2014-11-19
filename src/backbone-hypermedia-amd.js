/*!
 * backbone-hypermedia (https://github.com/linn/backbone.hypermedia
 * Licensed under MIT (https://github.com/linn/backbone.hypermedia/blob/master/LICENSE)
 */

(function (factory) {
    if (typeof exports === 'object') {
        module.exports = factory(require('backbone'), require('underscore'), require('jquery'));
    } else if (typeof define === 'function' && define.amd) {
        define(['backbone', 'underscore', 'jquery'], factory);
    }
} (function (Backbone, _, $) {
    Backbone.HypermediaModel = Backbone.Model.extend({
        initialize: function () {
            this.followed = false;
        },

        follow: function (relsToFollow) {
            var promises = [];
            var self = this;

            if (this.links) {
                var keys = _.keys(this.links);

                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    var context;
                    var links;

                    if (!relsToFollow || _.contains(relsToFollow, key)) {
                        if (key.split('.').length > 1) {
                            var item;
                            var attr = key.split('.')[0];
                            key = key.split('.')[1];

                            context = this.get(attr);

							// allows for following links on child objects within a hetereogenous collection
							// where some elements in the collection may have the child, and others may not
							if (!context) {
                                continue;
                            }

                            if (context instanceof Array) {
                                for (var a = 0; a < context.length; a++) {
                                    item = context[a];
                                    links = item.links;

                                    addPromises(promises, links, model(self.links[keys[i]]), item, key, options(self.links[keys[i]]));
                                }

                                continue;
                            } else if (context instanceof Backbone.Collection) {
                                for (var b = 0; b < context.length; b++) {
                                    item = context[b];
                                    links = item.get('links');

                                    addPromises(promises, links, model(self.links[keys[i]]), item, key, options(self.links[keys[i]]));
                                }

                                continue;
                            } else if (context instanceof Backbone.Model) {
                                links = context.get('links');
                            } else {
                                links = context.links;
                            }
                        } else {
                            context = this;
                            links = this.get('links');
                        }

                        addPromises(promises, links, model(this.links[keys[i]]), context, key, options(this.links[keys[i]]));
                    }
                }
            }

            if (promises.length) {
                return $.when.apply($, promises)
                .then(function () {
                    self.followed = true;
                    self.trigger('follow', self);
                });
            } else {
                var d = $.Deferred();
                d.resolve();
                return d.promise();
            }
        },

        fetch: function (options) {
            var self = this;

            return Backbone.Model.prototype.fetch.call(this, options)
                .then(function () {
                    return options ? self.follow(options.follow) : self.follow();
                });
        },

        sync: function (method, model, options) {
            if (this.mediaType) {
                options.accepts = { json: this.mediaType };

                if (method === 'create' || method === 'update' || method === 'patch') {
                    options.contentType = this.mediaType;
                }
            }

            return Backbone.sync(method, model, options);
        },

        toJSON: function () {
            var json = Backbone.Model.prototype.toJSON.apply(this, arguments);

            // use extend to create a deep copy, otherwise complex properties
            // are copied by reference, and any subsequent changes
            // are made against the model
            json = $.extend(true, {}, json);

            if (this.links) {
                var keys = _.keys(this.links);
                var self = this;

                _.each(keys, function (key) {
                    var context;
                    var jsonContext;

                    if (key.split('.').length > 1) {
                        var attr = key.split('.')[0];
                        key = key.split('.')[1];
                        context = self.get(attr);
                        jsonContext = json[attr];
                    } else {
                        context = self;
                        jsonContext = json;
                    }

                    var isArray = key.indexOf('[]', key.length - 2) !== -1;

                    if (isArray) {
                        key = key.substr(0, key.length - 2);
                    }

                    if (context && context[key]) {
                        if (isArray) {
                            jsonContext[key] = [];

                            for (var i = 0; i < context[key].length; i++) {
                                jsonContext[key].push(context[key][i].toJSON());
                            }
                        } else {
                            jsonContext[key] = context[key].toJSON();
                        }
                    }
                });
            }

            return json;
        }
    });

    Backbone.HypermediaCollection = Backbone.Collection.extend({
        fetch: function (options) {
            var self = this;

            return Backbone.Collection.prototype.fetch.call(this, options).then(function () {
                return $.when.apply($, self.chain()
                    .filter(function (model) {
                        return model instanceof Backbone.HypermediaModel;
                    })
                    .map(function (model) {
                        if (options && options.follow){
                            return model.follow(options.follow);
                        }

                        return model.follow();
                    })
                    .value());
            })
            .then(function () {
                self.trigger('follow', self);
            });
        },

        sync: function (method, model, options) {
            if (this.mediaType) {
                options.accepts = { json: this.mediaType };
            }

            return Backbone.sync(method, model, options);
        }
    });

    var model = function (thing) {
        if (_.isFunction(thing)) {
            return thing;
        }
        if (thing) {
            return thing.model;
        }
    };

    var options = function (thing) {
        if (_.isFunction(thing)) {
            return {};
        }
        if (thing) {
            return thing.options;
        }
    };

    var addPromises = function (promises, links, model, context, key, options) {
        var isArray = key.indexOf('[]', key.length - 2) !== -1;

        if (isArray) {
            key = key.substr(0, key.length - 2);
        }

        var rels = _.filter(links, function (l) {
            return l.rel == key;
        });

        if (rels.length > 1 && !isArray) {
            throw new Error('Found more than one link with rel \'' + key + '\', but the link was not specified as allowing multiple values. To allow multiple values, suffix the link key with \'[]\'.');
        }

        for (var i = 0; i < rels.length; i++) {
            var related = new model(),
                    urlFactory = _.isFunction(related.urlFactory) ? related.urlFactory : _.identity;

            if (isArray) {
                if (!context[key]) {
                    context[key] = [];
                }

                context[key].push(related);
            } else {
                context[key] = related;
            }

            var fetchOptions = _.extend({}, options, { url: urlFactory.call(related, rels[i].href) });

            promises.push(related.fetch(fetchOptions));
        }
    };
}));
