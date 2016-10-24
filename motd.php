<html>
<head>
<title>MOTD: peikko</title>
<style>
body {
background: #272a32;
color: #bbb;
font-family: Menlo, Consolas, Courier, Courier New;
margin: 0;
padding: 4rem;
line-height: 1.55;
font-size: 1em;
}
html {
font-size: 80%;
}
strong {
color: #fff;
}
</style>
</head>
<body>
<div class="motd" style="width: 40%">
<?php
$output = shell_exec('cat /etc/motd');
$output = nl2br($output);
$output = preg_replace('/^\d{2}.\d{2}.\d{4}/m','<strong>$0</strong>', $output);
echo $output;
?>
</div>
</body>
</html>
