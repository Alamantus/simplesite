<?php
require('correctpassword.php');

if ($_POST['pw'] === CORRECT_PASSWORD) {
  $password_file = '<?php define(\'CORRECT_PASSWORD\', \'' . $_POST['newpw'] . '\');';

  if (file_put_contents('correctpassword.php', $password_file) !== false) {
    echo 'Password changed successfully!';
    echo '<script>setTimeout(function(){window.location = "./admin.php";}, 1000);</script>';
  } else {
    echo 'Could not change password. Please try again.';
  }
} else {
  echo 'Not logged in.';
}
?>