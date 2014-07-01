[![Build Status](http://img.shields.io/travis/linn/backbone.hypermedia/master.svg?style=flat)](https://travis-ci.org/linn/backbone.hypermedia)
[![npm Version](http://img.shields.io/npm/v/backbone-hypermedia.svg?style=flat)](https://www.npmjs.org/package/backbone-hypermedia)
[![Nuget Version](http://img.shields.io/nuget/v/backbone.hypermedia.svg?style=flat)](https://www.nuget.org/packages/backbone.hypermedia/)
backbone.hypermedia
===================

Backbone plugin providing support for following hypermedia controls from Backbone models and collections.

## Basic Usage

Assuming a resource with a `links` property, something like this:

```javascript
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

```javascript
var User = Backbone.HypermediaModel.extend({
   ...
});
```

Then define a `links` property for the model like this:

```javascript
links: {
	'country': Country,
	'timezone': TimeZone
}
```

Each key corresponds to the `rel` value of a link which may be present when the model is fetched from the server. The value defines the type of Backbone model you would like to be constructed based on that relation, so in this example `Country` and `TimeZone` are Backbone models (which must themselves extend `Backbone.HypermediaModel`).

`Backbone.HypermediaModel` overrides `fetch` so that for each link found in the response, if there is a corresponding value in the links property on your model, then the related model will also be fetched and a property added to your model under the same key. The return value of `fetch` is a promise which represents the collective fetch operations for the model and all related resources.

By using the promise returned from `fetch` you can wait until all related resources are fetched before rendering your view:

```javascript
user.fetch().then(function () {
	// show user view
});
```

You can also add a `links` property to each related resource and have those relations followed as well, if you need to.

`toJSON` will include any related models which have been added to your model as properties.

## Installation
### [Bower](http://bower.io/search/?q=backbone-hypermedia)
```
bower install backbone-hypermedia
```

### [npm](https://www.npmjs.org/package/backbone-hypermedia) [![npm Version](http://img.shields.io/npm/v/backbone-hypermedia.svg?style=flat)](https://www.npmjs.org/package/backbone-hypermedia) [![npm Downloads](http://img.shields.io/npm/dm/backbone-hypermedia.svg?style=flat)](https://www.npmjs.org/package/backbone-hypermedia)
```
npm install backbone-hypermedia
```

### [NuGet](https://www.nuget.org/packages/backbone.hypermedia/) [![Nuget Version](http://img.shields.io/nuget/v/backbone.hypermedia.svg?style=flat)](https://www.nuget.org/packages/backbone.hypermedia/) [![Nuget Downloads](http://img.shields.io/nuget/dt/backbone.hypermedia.svg?style=flat)](https://www.nuget.org/packages/backbone.hypermedia/)

```
Install-Package backbone.hypermedia
```

## Publishing
Prior to publishing a new version of the package, you must run the following commands to configure your NuGet and npm credentials. You should only need to do this once.
```
npm adduser
grunt nugetkey --key=XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
```
Once you have entered your credentials, you can publish to npm and NuGet by running one of the following tasks:
 ```
grunt publish
```
Increments patch version in package.json, publishes to npm and NuGet. This is short-hand for `grunt publish:patch`.
```
grunt publish:minor
```
As before, but bumps minor version.
```
grunt publish:major
```
As before, but bumps major version.

The publish task will create an appropriate semver tag which Bower will detect as a new version.

## Contributors
 - [Sandy Cormie](https://github.com/mr-sandy)
 - [Jim Liddell](https://github.com/liddellj)
 - [Richard Phillips](https://github.com/richardiphillips)
 - [Barry Williams](https://github.com/bazwilliams)
 - [Henry Wilson](https://twitter.com/henryfcwilson)
