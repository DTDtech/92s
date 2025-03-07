<?php
include "config.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $customer_id = intval($_POST['customer_id']);
    $equipment_id = intval($_POST['equipment_id']);
    $quantity = intval($_POST['quantity']);
    $rental_price = floatval($_POST['rental_price']);
    $rental_start = mysqli_real_escape_string($conn, $_POST['rental_start']);
    $rental_end = mysqli_real_escape_string($conn, $_POST['rental_end']);
    $status = "active";

    $sql = "INSERT INTO orders (customer_id, equipment_id, quantity, rental_price, rental_start, rental_end, status) 
            VALUES ($customer_id, $equipment_id, $quantity, $rental_price, '$rental_start', '$rental_end', '$status')";
    if (mysqli_query($conn, $sql)) {
        echo "Thêm thành công!";
    } else {
        echo "Lỗi: " . mysqli_error($conn);
    }
    mysqli_close($conn);
}
?>