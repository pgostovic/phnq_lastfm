var phnq_core = require("phnq_core");
var request = require("request");
var _ = require("underscore");

var BASE_URL = "http://ws.audioscrobbler.com/2.0/";

module.exports = phnq_core.clazz(
{
	init: function(apiKey, username)
	{
		if(!apiKey)
		{
			throw "You must supply a last.fm api key";
		}
		this.apiKey = apiKey;
		this.username = username;
	},
	
	req: function(method, params, fn)
	{
		params = params || {};
		params["api_key"] = this.apiKey;
		params["method"] = method;
		params["format"] = "json";
		request.get(BASE_URL, {qs:params, json:true}, function(err, res, body)
		{
			fn(err, body);
		});
	},
	
	artistSearch: function(q, fn)
	{
		var _this = this;
		this.req("artist.search", {"artist":q, "limit": 10}, function(err, body)
		{
			if(err)
			{
				return fn(err);
			}
			var artists = [];
			_.each(body.results.artistmatches.artist, function(artistData)
			{
				artists.push(new Artist(artistData, _this));
			});
			fn(null, artists);
		})
	},
	
	artistFind: function(arg, fn)
	{
		var _this = this;
		var params = arg.mbid ? {mbid:arg.mbid} : {artist:arg, autocorrect:1}
		if(this.username)
		{
			params.username = this.username;
		}
		this.req("artist.getinfo", params, function(err, respObj)
		{
			if(err)
			{
				return fn(err);
			}
			fn(null, new Artist(respObj.artist, _this));
		});
	}
});

var Artist = phnq_core.clazz(
{
	init: function(artistData, client)
	{
		this.client = client;
		phnq_core.extend(this, artistData);
	},
	
	loadArtistInfo: function(fn)
	{
		var _this = this;
		var arg = this.mbid ? {mbid:this.mbid} : this.name;
		
		this.client.artistFind(arg, function(err, artistInfo)
		{
			if(err)
			{
				return fn(err, null);
			}
			phnq_core.extend(_this, artistInfo);
			fn(null, _this);
		})
	}
});
