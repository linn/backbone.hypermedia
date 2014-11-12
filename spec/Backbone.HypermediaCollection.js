define(function (require) {
	require('backbone-hypermedia');

    describe('Backbone.HypermediaCollection', function() {
    	var sut;

        beforeEach(function () {
            sut = new Backbone.HypermediaCollection();
            sut.model = new Backbone.HypermediaModel();
        });

        describe('when fetch is called', function () {
            followFired = false;

            beforeEach(function () {
                stubSync();

                sut.on('follow', function () {
                    followFired = true;
                });

                sut.fetch();
            });

            it('should fetch the collection', function () {
                expect(Backbone.sync.argsForCall[0][1]).toBe(sut);
            });

            it('should call follow on any hypermedia models', function () {
                expect(followFired).toBe(true);
            });
        });
    });

    var stubSync = function (data) {
        spyOn(Backbone, 'sync').andCallFake(function (method, model, options) {
            var d = $.Deferred();
            options.success(data);
            d.resolve(data);
            return d.promise();
        });
    };
});