var assert = require("assert");
var LastfmClient = require("../phnq_lastfm");

var LAST_FM_API_KEY = process.env["LAST_FM_API_KEY"];
var MBID_PAINS_OF_BEING_PURE_AT_HEART = "46f4e349-ddec-4131-9367-91b630a821d0";

describe("phnq_lastfm", function()
{
	describe("instantiation", function()
	{
		it("should throw an error when instantiated without an api key", function()
		{
			assert.throws(function()
			{
				new LastfmClient();
			});
		});

		it("should not throw an error when instantiated with an api key", function()
		{
			assert.doesNotThrow(function()
			{
				new LastfmClient(LAST_FM_API_KEY);
			});
		});
	});
	
	describe("artist search", function()
	{
		it("should find the artist The Pains of Being Pure At Heart by searching, and then fully load the artist info.", function(done)
		{
			var client = new LastfmClient(LAST_FM_API_KEY);
			client.artistSearch("The Pains of Being Pure At Heart", function(err, artists)
			{
				assert.ifError(err);
				assert(artists.length > 0);

				var artist = artists[0];
				assert.equal("The Pains of Being Pure At Heart", artist.name)
				assert.ok(!artist.bio);
				
				artist.loadArtistInfo(function(err, theArtist)
				{
					assert.ifError(err);
					assert.equal(artist, theArtist);
					
					assert.ok(!!artist.bio);
					
					done();
				});
			});
		});
	});
	
	describe("artist find", function()
	{
		it("should find an artist by name", function(done)
		{
			var client = new LastfmClient(LAST_FM_API_KEY);
			client.artistFind("The Pains of Being Pure At Heart", function(err, artist)
			{
				assert.ifError(err);
				assert.equal("The Pains of Being Pure At Heart", artist.name);
				assert.equal(MBID_PAINS_OF_BEING_PURE_AT_HEART, artist.mbid);
				assert.ok(!!artist.bio);
				done();
			});
		});

		it("should find an artist by slightly incorrect name", function(done)
		{
			var client = new LastfmClient(LAST_FM_API_KEY);
			// Missing 's' on Pain(s)
			client.artistFind("The Pain of Being Pure At Heart", function(err, artist)
			{
				assert.ifError(err);
				assert.equal("The Pains of Being Pure At Heart", artist.name)
				assert.equal(MBID_PAINS_OF_BEING_PURE_AT_HEART, artist.mbid);
				assert.ok(!!artist.bio);
				done();
			});
		});
		
		it("should find an artist by mbid", function(done)
		{
			var client = new LastfmClient(LAST_FM_API_KEY);
			client.artistFind({mbid:MBID_PAINS_OF_BEING_PURE_AT_HEART}, function(err, artist)
			{
				assert.ifError(err);
				assert.equal("The Pains of Being Pure At Heart", artist.name);
				assert.equal(MBID_PAINS_OF_BEING_PURE_AT_HEART, artist.mbid);
				assert.ok(!!artist.bio);
				done();
			});
		});
	});
	
	describe("artist tags", function()
	{
		it("should get the top tags for an artist", function(done)
		{
			var client = new LastfmClient(LAST_FM_API_KEY);
			client.artistFind({mbid:MBID_PAINS_OF_BEING_PURE_AT_HEART}, function(err, artist)
			{
				assert.ifError(err);
				
				artist.getTopTags(function(err, topTags)
				{
					assert.ifError(err);
					for(var i=0; i<topTags.length; i++)
					{
						assert.ok(!!topTags[i].name);
					}
					done();
				});
			});
		});
	});
});

