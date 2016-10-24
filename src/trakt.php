<?php
    $url = "https://trakt.tv/users/rolle/history.atom?slurm=".getenv('TRAKT_SLURM')."";
    $rss = simplexml_load_file($url);
    $list = $rss->xpath("//@url");

    $preparedUrls = array();
    foreach($list as $item) {
      $item = parse_url($item);
      $preparedUrls[] = $item['scheme'] . '://' .  $item['host'] . '' .  $item['path'] . '';
    }
    $image = $preparedUrls[1];

    $trakt_image_filename = basename($image);

    if ( getenv( 'ENV' ) === 'development' ) :
      $paikallinen_traktkuva = '/var/www/peikko/images/' . $trakt_image_filename;
    else :
      $paikallinen_traktkuva = '/var/www/html/images/' . $trakt_image_filename;
    endif;

    copy($image, $paikallinen_traktkuva);
?>

<div class="trakt">
<div class="traktposter">
<a href="https://trakt.tv/user/rolle" title="<?php echo $rss->entry->title; ?>">

<img src="images/<?php echo $trakt_image_filename; ?>" alt="<?php echo $rss->entry->title; ?>" /></a>

</div>

<h2 class="item"><a href="<?php echo $rss->entry->children($namespaces['link'])->attributes()->href; ?>" title="<?php echo $rss->entry->title; ?> viimeksi katsottu serverillä"><?php echo $rss->entry->title; ?></a></h2>

<h3 class="item2"><?php echo $rss->entry->title; ?></h3>

<a class="nplogo" href="https://www.plexapp.com"><img src="images/plexnp.png" alt="Plex" /></a></div>
