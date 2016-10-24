
(function($){$.fn.lastfm=function(username,display,apikey,options){var defaults={limit:5,header:true,title:'',imagesize:'medium',image:true,noimage:'',name:true,artist:true,playcount:true,showerror:true};var options=$.extend(defaults,options);return this.each(function(i,e){var $e=$(e);if(!$e.hasClass('lastFM'))$e.addClass('lastFM');if(display=='lovedtracks'){options.title='Loved Tracks';var method='user.getLovedTracks';}else if(display=='recenttracks'){options.title='Recent Tracks';var method='user.getRecentTracks';}else if(display=='topalbums'){options.title='Top Albums';var method='user.getTopAlbums';}else if(display=='topartists'){options.title='Top Artists';var method='user.getTopArtists';}else if(display=='toptracks'){options.title='Top Tracks';var method='user.getTopTracks';}else{if(options.showerror)$e.html('<p>LastFM feed invalid</p>');return false;}
var api='https://ws.audioscrobbler.com/2.0/?method='+method+'&user='+username+'&api_key='+apikey+'&limit='+options.limit+'&format=json&callback=?';$.ajax({type:'GET',url:api,dataType:'json',success:function(data){if(data){if(display=='lovedtracks'){_callback(e,display,data.lovedtracks.track,options);}else if(display=='recenttracks'){_callback(e,display,data.recenttracks.track,options);}else if(display=='topalbums'){_callback(e,display,data.topalbums.album,options);}else if(display=='topartists'){_callback(e,display,data.topartists.artist,options);}else if(display=='toptracks'){_callback(e,display,data.toptracks.track,options);}}else{if(options.showerror)$e.html('<p>LastFM information unavailable</p>');}},error:function(data){if(options.showerror)$e.html('<p>LastFM request failed</p>');}});});};var _callback=function(e,display,feeds,options){var $e=$(e);var row='odd';var html='';html+='<div class="lastFMBody '+display+'">';if(feeds){html+='<ul>';var count=feeds.length;if(count>options.limit)count=options.limit;for(var i=0;i<count;i++){var item=feeds[i];html+='<li class="itemRow '+row+'">';var name=item.name;var url=_getValidURL(item.url)
var artist='';var imgurl='';var playcount=null;if(display=='lovedtracks'||display=='topalbums'||display=='toptracks'){artist='<a href="'+_getValidURL(item.artist.url)+'" title="More about '+item.artist.name+' on Last.FM">'+item.artist.name+'</a>';}else if(display=='recenttracks'){artist=item.artist['#text'];}
if(display=='topalbums'||display=='topartists'||display=='toptracks')playcount=item.playcount;if(options.image){if(item.image){if(options.imagesize=='small'){var imgindex=0;}else if(options.imagesize=='medium'){var imgindex=1;}else if(options.imagesize=='large'){var imgindex=2;}else if(options.imagesize=='extralarge'){var imgindex=3;}
imgurl=_getValidURL(item.image[imgindex]['#text']);}
if(imgurl=='')imgurl=options.noimage;if(imgurl!='')html+='<div class="albumwrap"><a href="https://www.last.fm/user/rolle-/" title="'+item.name+' on viimeksi kuunneltu serverillä"><img src="'+imgurl+'" alt="'+item.name+'" class="album" /></a></div>'}
if(options.name)html+='<h2 class="item"><a href="'+url+'" title="Kuuntele '+item.name+' Last.FM:ssä">'+item.name+'</a></h2>'
if(options.artist)html+='<h3 class="item2">'+artist+'</h3>';if(options.playcount&&playcount!=null)html+='<div class="itemPlaycount">'+playcount+' soittokertaa</div>'
html+='<a class="nplogo" href="https://dilerium.se/musiccabinet/"><img src="images/subsonicnp.png" alt="Subsonic" /></a>'
html+='</li>';if(row=='odd'){row='even';}else{row='odd';}}
html+='</ul>';}else{html+='<p>No items to display</p>';e};html+='</div>';$e.append(html);};var _getValidURL=function(u){var url=u;if(u!=''&&u.substr(0,7)!='http://')url='https://'+u;return url;};})(jQuery);
