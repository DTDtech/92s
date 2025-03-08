<?php
include "../config.php";

$name = $_POST['name'];
$address = $_POST['address'];
$contact = $_POST['contact'];

$sql = "INSERT INTO customers (name, address, contact) VALUES ('$name', '$address', '$contact')";

if (mysqli_query($conn, $sql)) {
    echo "Customer added successfully";
} else {
    echo "Error: " . $sql . "<br>" . mysqli_error($conn);
}

mysqli_close($conn);
?>