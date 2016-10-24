$(function(){

	// url: https://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=rolle-&api_key=8f3ba6b03aa0cb708387e92434e8428b&limit=1&format=json&callback=?

	$('#np').lastfm('rolle-','recenttracks','8f3ba6b03aa0cb708387e92434e8428b', {
		imagesize: 'extralarge',
		noimage: 'images/vinyl.png',
		limit: 2
	});



// parametrit: https://trakt.tv/api-docs/activity-user
// url: https://api.trakt.tv/activity/user.json/addddddb526608d7639d3b07e176f2ea/rolle/all/?callback=?

//     $.ajax({
//       type: "GET",
//       url: 'https://api.trakt.tv/activity/user.json/addddddb526608d7639d3b07e176f2ea/rolle/?callback=?',
//       dataType: "json",

//       success: function(data){ 

//       	//console.log(data.activity[0].episode.title);

// 		//$.each(data.activity[0], function(index, data) { });

// 			//console.log(data);

// 			if (typeof data.activity[0].movie == "undefined") { 

// 			var div_data = '<div class="trakt"><div class="traktposter"><a href="https://trakt.tv/user/rolle" title="'+data.activity[0].show.title+':n jakso '+data.activity[0].episode.title+' on viimeksi katsottu serverillä"><img src="'+data.activity[0].show.images.poster+'" alt="'+data.activity[0].show.title+'" /></a></div><h2 class="item"><a href='+data.activity[0].show.url+' title="'+data.activity[0].episode.title+' on viimeksi katsottu serverillä">'+data.activity[0].show.title+'</a></h2><h3 class="item2">'+data.activity[0].episode.title+'</h3><a class="nplogo" href="https://www.plexapp.com"><img src="img/plexnp.png" alt="Plex" /></a></div>';

// 			} else {

// 			var div_data = '<div class="trakt"><div class="traktposter"><a href="https://trakt.tv/user/rolle" title="'+data.activity[0].movie.title+' on viimeksi katsottu serverillä"><img src="'+data.activity[0].movie.images.poster+'" alt="'+data.activity[0].movie.title+'" /></a></div><h2 class="item"><a href='+data.activity[0].movie.url+' title="'+data.activity[0].movie.title+' on viimeksi katsottu serverillä">'+data.activity[0].movie.title+'</a></h2><h3 class="item2">'+data.activity[0].movie.genres+'</h3><a class="nplogo" href="https://www.plexapp.com"><img src="img/plexnp.png" alt="Plex" /></a></div>';


//           		//$("#trakt").append("" + data.movie.title + "");

//           	}

// 			$(div_data).appendTo("#trakt");

		


// 	}

// });

//     return false;

    });
