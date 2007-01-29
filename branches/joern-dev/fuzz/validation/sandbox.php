<?php
$user = $_REQUEST['user'];
$email = $_REQUEST['email'];
$email2 = $_REQUEST['email2'];
$password = $_REQUEST['password'];
$birthdate = $_REQUEST['birthdate'];
$message = "Your form submission contains errors, please correct them.<br/>";
$message .= $user ? "Hello " . $user . "<br/>" : "Please specify your username" . "<br/>";
$message .= $email ? "" : "Please specify your email address<br/>";
$message .= $email2 == $email ? "" : "Please repeat your email address<br/>";
$message .= strlen($password) >= 5 ? "" : "Please specify a password with at least 5 characters<br/>";
$message .= strtotime($birthdate) ? "" : "Please specify your birthday<br/>";

include "validationSandbox.html";
?>