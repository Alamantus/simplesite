<?php
require('correctpassword.php');

$pw = $_POST['pw'];
$name = (isset($_POST['login_name']) && $_POST['login_name'] !== '') ? $_POST['login_name'] : 'stranger';
$pw_correct = ($pw !== '' && $pw === CORRECT_PASSWORD);
$login_required = (!$pw || !$pw_correct);
?>
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <title>Site Edit Console</title>

  <!-- jQuery UI CSS -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.min.css" />

  <!-- jQuery DateTimePicker CSS -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery-datetimepicker/2.5.4/jquery.datetimepicker.min.css" />

  <link rel="stylesheet" href="styles.css" />
</head>

<body>
<a href="./">&larr;Return to site</a>
<?php
if ($login_required) {
?>
  <div>
    <h2>Log In</h2>

<?php
  if (!$pw_correct) {
?>
    <h3 style="color:maroon">Incorrect Password!</h3>
<?php
  }
?>

    <form action="./admin.php" method="post">
      <label>
        <span>Name</span>
        <input type="text" name="login_name" />
      </label>
      <label>
        <span>Password</span>
        <input type="password" name="pw" />
      </label>
      <button type="submit">Log In</button>
    </form>

  </div>

<?php
// End if no password or incorrect.
} else {
?>
  <script>window.adminpw = '<?php echo $pw; ?>';</script>
  <div id="notifications" class="notification-box">
    <div class="notification-box-content">
      <button id="closeNotifications" class="right">&times;</button>
      <div id="notificationText"></div>
    </div>
  </div>

  <h3>Hi, <?php echo $name; ?>!</h3>

  <div id="admin"></div>

  <form id="changePassword" action="changepassword.php" method="post">
    <label><span>Change Admin Password</span>
      <small>This takes effect immediately, so you may need to log back in after changing it. Be careful!</small>
      <input name="newpw" type="text" />
      <input name="pw" type="hidden" value="<?php echo $pw; ?>" />
    </label>
    <button type="submit">Change Password</button>
  </form>

  <button id="saveChanges" class="save-button">Save Everything</button>
  
  <!-- jQuery + jQuery UI plugin -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.3/jquery.ui.touch-punch.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.15.1/moment-with-locales.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/tinymce/4.4.3/tinymce.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/tinymce/4.4.3/jquery.tinymce.min.js"></script>

  <!-- Page Control Scripts -->
  <script src="helpers.js"></script>
  <script src="admincontrol.js"></script>

<?php
// End else does have password
}
?>
</body>
</html>
