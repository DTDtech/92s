<?php
include "config.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = mysqli_real_escape_string($conn, $_POST['name']);
    $address = mysqli_real_escape_string($conn, $_POST['address']);
    $contact = mysqli_real_escape_string($conn, $_POST['contact']);

    $sql = "INSERT INTO customers (name, address, contact) 
            VALUES ('$name', '$address', '$contact')";
    if (mysqli_query($conn, $sql)) {
        echo "Thêm thành công!";
    } else {
        echo "Lỗi: " . mysqli_error($conn);
    }
    mysqli_close($conn);
}
?>