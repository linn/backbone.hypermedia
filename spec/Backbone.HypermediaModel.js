define(function (require) {
    var $ = require('jquery');
    require('backbone-hypermedia');

    describe('Backbone.HypermediaModel', function () {
        var sut;

        beforeEach(function () {
            sut = new Backbone.HypermediaModel();
            sut.url = '/users/45';
        });

        describe('when fetch is called', function () {
            followFired = false;

            beforeEach(function () {
                spyOn(Backbone, 'sync').andCallFake(function () {
                    var d = $.Deferred();
                    d.resolve();
                    return d.promise();
                });

                sut.on('follow', function () {
                    followFired = true;
                });

                sut.fetch();
            });

            it('should fetch the model', function () {
                expect(Backbone.sync.argsForCall[0][1]).toBe(sut);
            });

            it('should not fire a follow event', function () {
                expect(followFired).toBe(false);
            });
        });

        describe('when sync is called', function () {
            var options;

            beforeEach(function () {
                options = {};

                spyOn(Backbone, 'sync').andCallFake(function () {
                    var d = $.Deferred();
                    d.resolve();
                    return d.promise();
                });

                sut.sync('read', sut, options);
            });

            it('should call Backbone.sync', function () {
                expect(Backbone.sync.argsForCall[0][1]).toBe(sut);
            });
        });

        describe('when a mediaType property is defined', function () {
            beforeEach(function () {
                sut.mediaType = 'application/vnd.company.thing';
            });

            describe('and sync is called', function () {
                var options;

                beforeEach(function () {
                    options = {};

                    spyOn(Backbone, 'sync').andCallFake(function () {
                        var d = $.Deferred();
                        d.resolve();
                        return d.promise();
                    });

                    sut.sync('read', sut, options);
                });

                it('should set the accepts option to the media type', function () {
                    expect(options.accepts.json).toBe(sut.mediaType);
                });
            });

            describe('and sync is called with method create', function () {
                var options;

                beforeEach(function () {
                    options = {};

                    spyOn(Backbone, 'sync').andCallFake(function () {
                        var d = $.Deferred();
                        d.resolve();
                        return d.promise();
                    });

                    sut.sync('create', sut, options);
                });

                it('should set the contentType option to the media type', function () {
                    expect(options.contentType).toBe(sut.mediaType);
                });
            });
        });

        describe('when the model declares a link', function () {
            beforeEach(function () {
                sut.links = {
                    'some-rel': Backbone.Model
                };
            });

            describe('and the response contains a corresponding link', function () {
                beforeEach(function () {
                    spyOn(Backbone, 'sync').andCallFake(function (method, model, options) {
                        var d = $.Deferred();
                        var data = {
                            links: [
                                { rel: 'some-rel', href: '/somewhere' }
                            ]
                        };
                        options.success(data);
                        d.resolve(data);
                        return d.promise();
                    });
                });

                describe('and fetch is called', function () {
                    var followFired = false;

                    beforeEach(function () {
                        sut.on('follow', function () {
                            followFired = true;
                        });
                        sut.fetch();
                    });

                    it('should fetch the model', function () {
                        expect(Backbone.sync.argsForCall[0][1]).toBe(sut);
                    });

                    it('should follow the link', function () {
                        var related = Backbone.sync.argsForCall[1][1];

                        expect(related instanceof Backbone.Model).toBeTruthy();
                    });

                    it('should use the correct url', function () {
                        expect(Backbone.sync.argsForCall[1][2].url).toBe('/somewhere');
                    });

                    it('should add the related model to the parent', function () {
                        expect(sut['some-rel']).toBeDefined();
                        expect(sut['some-rel'] instanceof Backbone.Model).toBeTruthy();
                    });

                    it('should fire a follow event', function () {
                        expect(followFired).toBe(true);
                    });

                    describe('and toJSON is called', function () {
                        var json;

                        beforeEach(function () {
                            json = sut.toJSON();
                        });

                        it('should include the related model', function () {
                            expect(json['some-rel']).toBeDefined();
                        });
                    });
                });
            });
        });

        describe('when the model declares a link within a nested scope', function () {
            beforeEach(function () {
                sut.links = {
                    'scope.some-rel': Backbone.Model
                };
            });

            describe('and the response contains a scope with a corresponding link', function () {
                beforeEach(function () {
                    spyOn(Backbone, 'sync').andCallFake(function (method, model, options) {
                        var d = $.Deferred();
                        var data = {
                            scope: {
                                links: [
                                    { rel: 'some-rel', href: '/somewhere' }
                                ]
                            }
                        };
                        options.success(data);
                        d.resolve(data);
                        return d.promise();
                    });
                });

                describe('and fetch is called', function () {
                    var followFired = false;

                    beforeEach(function () {
                        sut.on('follow', function () {
                            followFired = true;
                        });
                        sut.fetch();
                    });

                    it('should add the related model to the nested scope', function () {
                        expect(sut.get('scope')['some-rel']).toBeDefined();
                        expect(sut.get('scope')['some-rel'] instanceof Backbone.Model).toBeTruthy();
                    });
                });
            });

            // and the response contains an array with a corresponding link in each item
        });

        // when the model defines a link against a nested Backbone model

        // when the model defined a link against a nested Backbone collection

        // when the model declares the link as allowing multiple occurences

        // when multiple occurences of a link are encountered where only one was expected
    });
});