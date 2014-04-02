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
            beforeEach(function () {
                spyOn(Backbone, 'sync').andCallFake(function () {
                    var d = $.Deferred();
                    d.resolve();
                    return d.promise();
                });

                sut.fetch();
            });

            it('should fetch the model', function () {
                expect(Backbone.sync.argsForCall[0][1]).toBe(sut);
            });
        });

        describe('when the model has a link', function () {
            beforeEach(function () {
                sut.links = {
                    'some-rel': Backbone.Model
                };
            });

            describe('and the response contains a matching link', function () {
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
                    beforeEach(function () {
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
                });
            });
        });
    });
});