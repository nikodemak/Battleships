<?php
try
{
    if (!$conn = mysqli_connect("localhost", "Battleships", "SABCPEsTYXohmOWi", "Battleships"))
    {
        throw new Exception('Unable to connect');
    }
}
catch(Exception $e)
{
    echo $e->getMessage();
}
?>