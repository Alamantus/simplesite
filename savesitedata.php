<?php
require('correctpassword.php');

if ($_POST['pw'] === CORRECT_PASSWORD) {
  if (file_put_contents('sitedata.json', $_POST['sitedata']) !== false) {
    echo "Saved successfully!";
  } else {
    echo "Could not save. Please try again.";
  }
} else {
  echo "Not logged in.";
}
?>