<?php $url = 'http://sendgrid.com/';
$user = 'danielduan';
$pass = 'a1b2c3';

$message = '<html><body>'.$_GET['email'].'</body></html>';

$params = array(
    'api_user'  => $user,
    'api_key'   => $pass,
    'to'        => $_GET['email'],
    'subject'   => 'Your SpotiCLI Log',
    'html'      => $message,
    'from'      => 'spoticli@sendgrid.com',
  );


$request =  $url.'api/mail.send.json';

// Generate curl request
$session = curl_init($request);
// Tell curl to use HTTP POST
curl_setopt ($session, CURLOPT_POST, true);
// Tell curl that this is the body of the POST
curl_setopt ($session, CURLOPT_POSTFIELDS, $params);
// Tell curl not to return headers, but do return the response
curl_setopt($session, CURLOPT_HEADER, false);
curl_setopt($session, CURLOPT_RETURNTRANSFER, true);

// obtain response
$response = curl_exec($session);
curl_close($session);

// print everything out
print_r($response);