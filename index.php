<?php
$site_data = json_decode(file_get_contents('sitedata.json'), true);

$page = isset($_GET['page']) ? $_GET['page'] : false;
$page_exists = $page !== false && isset($site_data['pages']) && isset($site_data['pages'][$page]);
?>
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title><?php echo $site_data['siteTitle'] . ($page_exists ? $site_data['pages'][$page]['title'] : ''); ?></title>
  <meta property="description" content="<?php echo isset($site_data['siteTagline']) ? $site_data['siteTagline'] : ''; ?>" />

  <meta property="og:title" content="<?php echo $site_data['siteTitle']; ?>" />
  <meta property="og:description" content="<?php echo isset($site_data['siteTagline']) ? $site_data['siteTagline'] : ''; ?>" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="http://<?php echo $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI']; ?>" />

  <!-- jQuery UI CSS -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.min.css" />
  <!-- jQuery Perfect Scrollbar CSS -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery.perfect-scrollbar/0.6.12/css/perfect-scrollbar.min.css" />

  <!-- Google Raleway Font -->
  <link href="https://fonts.googleapis.com/css?family=Raleway" rel="stylesheet">

  <link rel="stylesheet" href="styles.css" />

  <!-- jQuery + jQuery UI plugin -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.3/jquery.ui.touch-punch.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.perfect-scrollbar/0.6.12/js/perfect-scrollbar.jquery.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.15.1/moment-with-locales.min.js"></script>
</head>
<body>
<?php
if ($page !== false && isset($site_data['pages']) && isset($site_data['pages'][$page])) {
  echo html_entity_decode($site_data['pages'][$page]['content']);
} else {
?>

  <div id="site"></div>

  <!-- Page Control Scripts -->
  <script src="helpers.js"></script>
  <script src="sitecontrol.js"></script>
<?php
}
?>
</body>
</html>