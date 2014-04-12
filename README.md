[![Build Status](https://travis-ci.org/linn/backbone.hypermedia.svg?branch=master)](https://travis-ci.org/linn/backbone.hypermedia)
backbone.hypermedia
===================

Backbone plugin providing support for following hypermedia controls from Backbone models and collections.

## Basic Usage

Assuming a resource with a `links` property, something like this:

```language-javascript
{
	"name": {
		"first" : "Joe",
		"last": "Bloggs"
    },
    "links" : [
    	{ "rel": "country", "href": "/countries/GB" }
    ]
}
```

Define a corresponding Backbone model by extending `Backbone.HypermediaModel` (instead of `Backbone.Model`):

```language-javascript
var User = Backbone.HypermediaModel.extend({
   ...
});
```

Then define a `links` property for the model like this:

```language-javascript
links: {
	'country': Country,
	'timezone': TimeZone
}
```

Each key corresponds to the `rel` value of a link which may be present when the model is fetched from the server. The value defines the type of Backbone model you would like to be constructed based on that relation, so in this example `Country` and `TimeZone` are Backbone models (which must themselves extend `Backbone.HypermediaModel`).

`Backbone.HypermediaModel` overrides `fetch` so that for each link found in the response, if there is a corresponding value in the links property on your model, then the related model will also be fetched and a property added to your model under the same key. The return value of `fetch` is a promise which represents the collective fetch operations for the model and all related resources.

By using the promise returned from `fetch` you can wait until all related resources are fetched before rendering your view:

```language-javascript
user.fetch().then(function () {
	// show user view
});
```

You can also add a `links` property to each related resource and have those relations followed as well, if you need to.

`toJSON` will include any related models which have been added to your model as properties.

## NuGet
The package is available via [NuGet](https://www.nuget.org/packages/backbone.hypermedia/):

```
Install-Package backbone.hypermedia
```

## Contributors
 - [Sandy Cormie](https://github.com/mr-sandy)
 - [Jim Liddell](https://github.com/liddellj)
 - [Richard Phillips](https://github.com/richardiphillips)
 - [Barry Williams](https://github.com/bazwilliams)
 - [Henry Wilson](https://twitter.com/henryfcwilson)
