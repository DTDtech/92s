<?php
include "config.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = mysqli_real_escape_string($conn, $_POST['name']);
    $status = mysqli_real_escape_string($conn, $_POST['status']);

    $sql = "INSERT INTO rooms (name, status) VALUES ('$name', '$status')";
    if (mysqli_query($conn, $sql)) {
        echo "Thêm thành công!";
    } else {
        echo "Lỗi: " . mysqli_error($conn);
    }
    mysqli_close($conn);
}
?>