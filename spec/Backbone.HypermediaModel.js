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
                expect(Backbone.sync).toHaveBeenCalled();
            });
        });
    });
});