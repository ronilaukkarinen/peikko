<?php
if ( getenv('ENV') != 'development' ) :
  function minify_output($buffer) {
      $search = array('/\>[^\S ]+/s','/[^\S ]+\</s','/(\s)+/s');
      $replace = array('>','<','\\1');
      if (preg_match("/\<html/i",$buffer) == 1 && preg_match("/\<\/html\>/i",$buffer) == 1) {
          $buffer = preg_replace($search, $replace, $buffer);
      }
      return $buffer;
  }

  $cachefile = 'cached-index.html';
  $cachetime = 1800;
  if (file_exists($cachefile) && time() - $cachetime < filemtime($cachefile)) {
      include($cachefile);
      echo "<!-- Amazing hand crafted super cache, generated ".date('H:i', filemtime($cachefile))." -->";
      exit;
  }
  ob_start('minify_output');
endif;
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

        <title>peikko.us | Rollen kotikone</title>

        <link rel="stylesheet" href="css/layout.css" />
        <link rel="shortcut icon" href="images/fedora.png" />

        <meta property="og:image" content="images/fedora.png">
        <meta property="og:image:type" content="image/png">
    </head>

    <body>

    <div id="wrapper">

      <div class="row">

        <div class="esittely">
          <h1 class="center"><span><?php echo gethostbyname('www.peikko.us'); ?></span>, tuttavallisemmin <b>peikko</b>.</h1>
          <h4 class="center"><a href="https://laukkarinen.info">Rollen</a> vaatekomerossa huriseva <span class="version"><?php
              require_once('vendor/autoload.php');
              $dotenv = new Dotenv\Dotenv('./');
              $dotenv->load();
              ini_set('display_errors', 0);
              $release = shell_exec('cat /etc/redhat-release |head -1');
              $versionongintaa = explode("Fedora release ", $release);
              $versionongintaaa = explode("(", $versionongintaa[1]);
              $versio = $versionongintaaa[0];
          ?>
          <span class="opacity"><a href="https://getfedora.org/en/server/" class="fedoramini"><?php echo $versio; ?></a></span></span>-palvelintietokone.</h4>

        </div>

<div class="tapahtumat">

  <div id="np" class="event">
    <?php include('src/lastfm.php'); ?>
  </div>

  <div id="trakt" class="event">
    <?php include('src/trakt.php'); ?>
  </div>

  <div id="irc" class="event"><blockquote><?php

  $find = array("#(^|[\n ])([\w]+?://[\w\#$%&~/.\-;:=,?@\[\]+]*)#is",'/\< .*\> /','/<\@.*\> /','/\<\+.*\> /','/^([\d]{1,2})\:([\d]{2})$/','/[0-9][0-9]:[0-5][0-9]/','-!-');
  $replace = array("\\1<a href=\"\\2\" target=\"_blank\">\\2</a>",'','','','','','');

  $logi = shell_exec("tail -1 /var/www/html/latest-irc.log");
  $rivi = preg_replace($find,$replace,$logi);

  echo strip_tags($rivi);
   ?></blockquote></div>

   <div class="ircnote nplogo"><a href="https://www.pulina.fi">IRC</a></div>

</div>



<!-- New terminal -->
<div class="browser-window">

  <div class="top-bar">
    <div class="circles">
      <div class="circle circle-red"></div>
      <div class="circle circle-yellow"></div>
      <div class="circle circle-green"></div>
    </div>
  </div>
  <div class="window-content dark-code">

    <div class="code adminlabs">

      <iframe src="https://www.adminlabs.com/status/show/id/2d080c4c-7a17-11e4-8471-ce6124683663" frameborder="0"></iframe>

    </div>
  </div>

</div>


<!-- New terminal -->
<div class="browser-window">

  <div class="top-bar">
    <div class="circles">
      <div class="circle circle-red"></div>
      <div class="circle circle-yellow"></div>
      <div class="circle circle-green"></div>
    </div>
  </div>
  <div class="window-content dark-code">

    <div class="code">

        <b><span class="server">peikko</span><span class="mato"> ~ $</span></b> head -5 <a href="/motd.php">/etc/motd</a><br />
        <?php $motd = nl2br(shell_exec("head -5 /etc/motd"));

      $m = '|([\w\d]*)\s?(https?://([\d\w\.-]+\.[\w\.]{2,6})[^\s\]\[\<\>]*/?)|i';
      $r = '$1 <a href="$2">$2</a>';

      $motd = preg_replace($m,$r,$motd);
      echo $motd;

      ?>
        <div class="cursor"></div>

    </div>
  </div>

</div>




<!-- New terminal -->
<div class="browser-window">

  <div class="top-bar">
    <div class="circles">
      <div class="circle circle-red"></div>
      <div class="circle circle-yellow"></div>
      <div class="circle circle-green"></div>
    </div>
  </div>
  <div class="window-content dark-code">

    <div class="code sysmon">

      <b><span class="server">peikko</span><span class="mato"> ~ $</span></b> sysmon --realtime<br />

          <div class="row">

            <div class="grid_12 sysmon">

                  <ul>
                    <li><span id="connecting"></span>uptime: <span id="uptime">?</span></li>
                    <li><span id="users">?</span> käyttäjää, <span id="processes">?</span> prosessia</li>
                  </ul>

                  <div id="cpu" class="r t l b"></div>
                  <div id="mem" class="t r">
                    <div id="virt" class="p b"></div>
                    <div id="swap" class="p"></div>
                  </div>

                  <div id="cpu_times" class="r t b">

               <div id="cpu_time_legend" class="p">user
      system
      idle
      nice
      iowait
      irq
      softirq
      steal
      guest</div>
                <div id="cpu_time_values" class="p"></div>
                <div id="cpu_time_bars" class="p"></div>
            </div>

            <div id="io" class="r b">

                <div id="io_legend" class="p">Network
      Bytes in
      Bytes out

      Disk
      Reads
      Writes</div>
                <div id="io_values" class="p"></div>

                    </div>


                  </div><!-- /grid -->

          </div><!-- /row -->

      <div class="cursor"></div>

    </div>
  </div>

</div>

        <div class="services">
          <!-- Not updated since forever, can't generate SVG images here... legacy shit. -->
          <img src="images/logo-subsonic.png" alt="Subsonic" title="Subsonic/Musiccabinet" />
          <img src="images/logo-couchpotato.png" alt="Couchpotato" title="Couchpotato" />
          <img src="images/logo-sickbeard.png" alt="Sick-Beard" title="Sick-Beard" />
          <img src="images/logo-plex.png" alt="Plex Media Server" title="PLEX" />
          <img src="images/logo-dropbox.png" alt="Dropbox" title="Dropbox" />
          <img src="images/logo-btsync.png" alt="Bittorrent Sync" title="BTsync" />
          <img src="images/logo-bitlbee.png" alt="BitlBee" title="bitlbee" />
          <img src="images/logo-irssi.png" alt="Irssi" title="irssi" />
          <img src="images/logo-ddwrt.png" alt="dd-wrt" title="dd-wrt" />
          <img src="images/logo-mediagoblin.png" alt="Mediagoblin" title="Mediagoblin" />
        </div>


    </div><!-- /wrapper -->

     <script src="js/all.js"></script>

    </body>
</html>
<?php
if ( getenv('ENV') != 'development' ) :
  $fp = fopen($cachefile, 'w');
  fwrite($fp, ob_get_contents());
  fclose($fp);
  ob_end_flush();
endif;
