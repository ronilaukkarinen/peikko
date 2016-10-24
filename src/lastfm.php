<div class="lastFMBody recenttracks">
  <ul>
<?php
$lastfmUsername = "rolle-";
$lastfmCache = "lastfm.recent.cache";
$secondsBeforeUpdate = 180; // be nice to their link
$numberOfSongs = 1; // 10 is max
$socketTimeout = 3; // seconds to wait for response from audioscrobbler
$apikey = getenv('LASTFM_APIKEY');
$emptyCache = '
<li class="itemRow odd">
  <div class="albumwrap">
    <a href="#" title="Ei kuunneltuja biisejä">
      <img src="images/default-band.jpg" alt="Default band" class="album" />
    </a>
  </div>
  <h2 class="item">
    <a href="http://www.last.fm/user/rolle-/" title="Katso profiili">Ei kuunneltuja biisejä</a>
  </h2>
  <h3 class="item2">Last.fm:ssä tai koodissa jotain häikkää juuri nyt</h3>
  <a class="nplogo" href="http://www.last.fm/user/rolle-/">
    <img src="images/subsonicnp.png" alt="Subsonic">
  </a>
</li>
';

// Grab the stuff
// Updated to work with new Last.fm API in 30.9.2015
// Times won't work right now, so don't use them (not included with this code anyway)

if(!file_exists($lastfmCache)) touch($lastfmCache);
$lastModified = filemtime($lastfmCache);
if(time() - $lastModified > $secondsBeforeUpdate) {
  @ini_set("default_socket_timeout", $socketTimeout);

  //$recentlyPlayedSongs = @file_get_contents("https://ws.audioscrobbler.com/1.0/user/$lastfmUsername/recenttracks.txt");
  $getrecentlyplayed = simplexml_load_file("https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=rolle-&api_key=$apikey");
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

  for ($i = 0; $i < $numberOfSongs; $i++) { ?>

    <li class="itemRow odd">

    <?php $trackArray = explode(",", $track[$i]);
    $entry = explode(" - ", $trackArray[1]);

    $trackxml = simplexml_load_file("https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=rolle-&api_key=$apikey");

    $artistxml = simplexml_load_file('https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=' . urlencode( $entry[0] ) . '&api_key=' . $apikey . '&limit=1');

    // var_dump($trackxml->recenttracks->track);

    foreach($trackxml->recenttracks->track->image as $img) { ?>

      <?php if ( $img['size'] == 'large' ) {

        if( $img == "" ) { ?>

          <div class="albumwrap">
            <a href="https://www.last.fm/music/<?php echo htmlspecialchars($entry[0]); ?>" title="Viimeksi kuunneltu: <?php echo htmlspecialchars($entry[1]); ?>">
              <img src="images/default-band.jpg" alt="<?php echo htmlspecialchars($entry[0]); ?>" class="album" />
            </a>
          </div>

        <?php } else {

          $artist_image_filename = basename( $img );

          if ( getenv('ENV') == 'development' ) :
            $paikallinen_artistikuva = '/var/www/peikko/images/' . $artist_image_filename;
          else :
            $paikallinen_artistikuva = '/var/www/peikko/html/images/artist-image-db/' . $artist_image_filename;
          endif;

          copy( $img, $paikallinen_artistikuva ); ?>

          <div class="albumwrap">
            <a href="https://www.last.fm/music/<?php echo htmlspecialchars($entry[0]); ?>" title="Viimeksi kuunneltu: <?php echo htmlspecialchars($entry[1]); ?>">
              <img src="images/<?php echo $artist_image_filename; ?>" alt="<?php echo htmlspecialchars($entry[0]); ?>" class="album" />
            </a>
          </div>

        <?php }
      }
    }
  }
  ?>

  <h2 class="item">
    <a href="https://www.last.fm/music/<?php echo htmlspecialchars($entry[0]); ?>" title="Kuunneltu viimeksi: <?php echo htmlspecialchars($entry[0]); ?> - <?php echo htmlspecialchars($entry[1]); ?> "><?php echo htmlspecialchars($entry[0]); ?></a>
  </h2>
  <h3 class="item2"><?php echo htmlspecialchars($entry[1]); ?></h3>
  <a class="nplogo" href="http://www.last.fm/user/rolle-/">
    <img src="images/subsonicnp.png" alt="Subsonic">
  </a>

</li>
<?php
}
?>
</ul>
</div>
