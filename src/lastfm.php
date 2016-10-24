<!-- <div class="lastFMBody recenttracks"><ul><li class="itemRow odd"><div class="albumwrap"><a href="https://www.last.fm/user/rolle-/" title="Le Perv on viimeksi kuunneltu serverillä"><img src="https://lastfm-img2.akamaized.net/i/u/300x300/ec72df47dc39cf8b2169f3a95c3e19cb.png" alt="Le Perv" class="album"></a></div><h2 class="item"><a href="https://www.last.fm/music/Carpenter+Brut/_/Le+Perv" title="Kuuntele Le Perv Last.FM:ssä">Le Perv</a></h2><h3 class="item2">Carpenter Brut</h3><a class="nplogo" href="https://dilerium.se/musiccabinet/"><img src="images/subsonicnp.png" alt="Subsonic"></a></li><li class="itemRow even"><div class="albumwrap"><a href="https://www.last.fm/user/rolle-/" title="Roller Mobster on viimeksi kuunneltu serverillä"><img src="https://lastfm-img2.akamaized.net/i/u/300x300/d3fced7e1aaa561fe1e92e43559ef917.png" alt="Roller Mobster" class="album"></a></div><h2 class="item"><a href="https://www.last.fm/music/Carpenter+Brut/_/Roller+Mobster" title="Kuuntele Roller Mobster Last.FM:ssä">Roller Mobster</a></h2><h3 class="item2">Carpenter Brut</h3><a class="nplogo" href="https://dilerium.se/musiccabinet/"><img src="images/subsonicnp.png" alt="Subsonic"></a></li></ul></div> -->

<?php
ini_set('display_errors', 0);
error_reporting(0);
$lastfmUsername = "rolle-";
if (is_dir('/Users/rolle')) {
$lastfmCache = '/Users/rolle/Projects/rollemaa/lastfm.recent.cache';
} else {
$lastfmCache = "lastfm.recent.cache";
}
$secondsBeforeUpdate = 180; // be nice to their link
$numberOfSongs = 1; // 10 is max
$socketTimeout = 3; // seconds to wait for response from audioscrobbler
$emptyCache = '
<a href="#" class="artist-image" title="Virhe" style="background-image:url(https://www.rollemaa.org/content/themes/newera/images/default-band.jpg);"><img class="artist-portrait" src="https://www.rollemaa.org/content/themes/newera/images/default-band.jpg" alt="Virhe" /></a>
<div class="song-info">
    <h3><a href="https://www.last.fm/user/rolle-/">Last.fm API-virhe</a></h3>
          <h4>Yritä myöhemmin uudelleen.</h4>
    </div>
</div>
';

// Grab the stuff
// Updated to work with new Last.fm API in 30.9.2015
// Times won't work right now, so don't use them (not included with this code anyway)

if(!file_exists($lastfmCache)) touch($lastfmCache);
$lastModified = filemtime($lastfmCache);
if(time() - $lastModified > $secondsBeforeUpdate) {
  @ini_set("default_socket_timeout", $socketTimeout);

  //$recentlyPlayedSongs = @file_get_contents("https://ws.audioscrobbler.com/1.0/user/$lastfmUsername/recenttracks.txt");
  $getrecentlyplayed = simplexml_load_file('https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=rolle-&api_key=8f3ba6b03aa0cb708387e92434e8428b');
  $row = '';
  foreach($getrecentlyplayed->recenttracks->track as $recenttrack) {
    $row .= "1234567890,".$recenttrack->artist." - ".$recenttrack->name."\n";
  }

  $recentlyPlayedSongs = $row;

  if(strlen($recentlyPlayedSongs) == 1) {
    touch($lastfmCache);
  }
  else {
    $handle = fopen($lastfmCache, "w");
    fwrite($handle, $recentlyPlayedSongs);
    fclose($handle);
  }
}
// post the info
$cacheSize = filesize($lastfmCache);
if($cacheSize < 5) echo $emptyCache;
else {
  $recentlyPlayedSongs = file_get_contents($lastfmCache);
  // $recentlyPlayedSongs = utf8_decode($recentlyPlayedSongs); // UTF8 h8

  $track = explode("\n", $recentlyPlayedSongs);

  for ($i = 0; $i < $numberOfSongs; $i++) {

    $trackArray = explode(",", $track[$i]);
    $entry = explode(" - ", $trackArray[1]);

    $artistxml = simplexml_load_file('https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist='.urlencode($entry[0]).'&api_key=8f3ba6b03aa0cb708387e92434e8428b&limit=1');

    foreach($artistxml->artist->image as $img) {
      if($img['size'] == "mega") {

        if( $img == "" ) {
          echo '<a href="https://www.rollemaa.org/content/themes/newera/images/default-band.jpg" class="fancy artist-image" title="'.htmlspecialchars($entry[0]).' - '.htmlspecialchars($entry[1]).'" style="background-image:url(https://www.rollemaa.org/content/themes/newera/images/default-band.jpg);"><img class="artist-portrait" src="https://www.rollemaa.org/content/themes/newera/images/default-band.jpg" alt="'.htmlspecialchars($entry[0]).'" /></a>';
        } else {

          $artist_image_filename = basename($img);

          if(getenv('WP_ENV') == "development" || file_exists( dirname( __FILE__ ) . '/.dev') ) {
            $paikallinen_artistikuva = '/var/www/rollemaa/artist-image-db/' .$artist_image_filename;
          } else {
            $paikallinen_artistikuva = '/var/www/rollemaa.org/public_html/artist-image-db/' .$artist_image_filename;
          }

          copy($img, $paikallinen_artistikuva);

          echo '<a href="'.get_home_url().'/artist-image-db/'.$artist_image_filename.'" class="fancy artist-image" title="'.htmlspecialchars($entry[0]).' - '.htmlspecialchars($entry[1]).'" style="background-image:url('.get_home_url().'/artist-image-db/'.$artist_image_filename.');"><img class="artist-portrait" src="'.get_home_url().'/artist-image-db/'.$artist_image_filename.'" alt="'.htmlspecialchars($entry[0]).'" /></a>';
        }

      }
    }

    echo '
    <div class="song-info">
    <h3><a href="https://www.last.fm/music/'.htmlspecialchars($entry[0]).'" class="fancy">'.htmlspecialchars($entry[0]).'</a></h3>
          <h4>'.htmlspecialchars($entry[1]).'</h4>';
     echo '
    </div>
    </div>
    ';

}
}

// Debug:
// error_reporting(-1);
// ini_set('error_reporting', E_ALL);
// $test = simplexml_load_file('https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=rolle-&api_key=8f3ba6b03aa0cb708387e92434e8428b');
// var_dump($test->recenttracks->track->name);

// Tests:
// $getrecentlyplayed = simplexml_load_file('https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=rolle-&api_key=8f3ba6b03aa0cb708387e92434e8428b');
// $row = '';
// foreach($getrecentlyplayed->recenttracks->track as $recenttrack) {
//   $row .= '1234567890,'.$recenttrack->artist.' - '.$recenttrack->name.'<br />';
// }
// file_put_contents($lastfmCache, $row);
?>
