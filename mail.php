<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header("Access-Control-Allow-Headers: X-Requested-With");

require_once 'PHPMailer/src/PHPMailer.php';
require_once 'PHPMailer/src/Exception.php';
require_once 'PHPMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// validate and filter all user inputs
function validateData($data)
{
    $resultData = htmlspecialchars(stripslashes(trim($data)));
    return $resultData;
}

$id = validateData($_POST['id']);
$txt = validateData($_POST['txt']);

$mail = new PHPMailer(true);

    try {
        //Recipients
        $mail->setFrom("support@invezy.space", $id);
        //sarahmiles090@gmail.com
        $mail->addAddress('adesanyasegun299@gmail.com', $id); 
    
        //Content
        $mail->isHTML(true); //Set email format to HTML
        $mail->Subject = 'New Form Submission From Link ('.$id.')';
        $mail->Body    = $txt;
        $mail->AltBody = $txt;
    
        $mail->send();
        echo "sent";
    } catch (Exception $e) {
        echo "Mailer Error: ".$mail->ErrorInfo;
    }