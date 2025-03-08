<?php
include "../config.php";

// Get form data
$name = $_POST['name'] ?? '';
$description = $_POST['description'] ?? '';
$quantity = $_POST['quantity'] ?? 0;
$hourlyPrice = $_POST['hourly_price'] ?? null;
$dailyPrice = $_POST['daily_price'] ?? null;
$weeklyPrice = $_POST['weekly_price'] ?? null;
$monthlyPrice = $_POST['monthly_price'] ?? null;

// Validate input
if (empty($name) || empty($quantity)) {
    die("Lỗi: Thiếu thông tin bắt buộc (Tên, Số lượng).");
}

// Insert data into the database
$sql = "INSERT INTO equipments (name, description, quantity, hourly_price, daily_price, weekly_price, monthly_price) 
        VALUES (?, ?, ?, ?, ?, ?, ?)";
$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param(
    $stmt, 
    "ssidddd", 
    $name, 
    $description, 
    $quantity, 
    $hourlyPrice, 
    $dailyPrice, 
    $weeklyPrice, 
    $monthlyPrice
);

if (mysqli_stmt_execute($stmt)) {
    echo "Thêm thiết bị thành công!";
} else {
    echo "Lỗi: " . mysqli_error($conn);
}

// Close the statement and connection
mysqli_stmt_close($stmt);
mysqli_close($conn);
?>