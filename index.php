<?php
$site_data = json_decode(file_get_contents('sitedata.json'), true);
?>
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <title><?php echo $site_data['siteTitle']; ?></title>
  <meta property="description" content="<?php echo $site_data['siteTagline']; ?>" />

  <meta property="og:title" content="<?php echo $site_data['siteTitle']; ?>" />
  <meta property="og:description" content="<?php echo $site_data['siteTagline']; ?>" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="http://<?php echo $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI']; ?>" />

  <!-- jQuery UI CSS -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.min.css" />

  <link rel="stylesheet" href="styles.css" />
</head>

<body>
  <div id="site"></div>
  
  <!-- jQuery + jQuery UI plugin -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.3/jquery.ui.touch-punch.min.js"></script>

  <!-- Page Control Scripts -->
  <script src="helpers.js"></script>
  <script src="sitecontrol.js"></script>
</body>
</html>