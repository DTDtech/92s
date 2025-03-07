<?php
include "config.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $code = mysqli_real_escape_string($conn, $_POST['code']);
    $name = mysqli_real_escape_string($conn, $_POST['name']);
    $type = mysqli_real_escape_string($conn, $_POST['type']);
    $status = mysqli_real_escape_string($conn, $_POST['status']);
    $specs = mysqli_real_escape_string($conn, $_POST['specs']);
    $quantity = intval($_POST['quantity']);
    $location = mysqli_real_escape_string($conn, $_POST['location']);
    $next_maintenance = $_POST['next_maintenance'] ? "'".mysqli_real_escape_string($conn, $_POST['next_maintenance'])."'" : "NULL";
    $maintenance_cost = floatval($_POST['maintenance_cost']) ?: 0;

    // Xử lý file upload
    $image = "";
    if (isset($_FILES['image']) && $_FILES['image']['name']) {
        $image = "equip_".time()."_".$_FILES['image']['name'];
        move_uploaded_file($_FILES['image']['tmp_name'], "assets/".$image);
    }
    $docs = "";
    if (isset($_FILES['docs']) && $_FILES['docs']['name']) {
        $docs = "doc_".time()."_".$_FILES['docs']['name'];
        move_uploaded_file($_FILES['docs']['tmp_name'], "assets/".$docs);
    }

    $sql = "INSERT INTO equipments (code, name, type, status, specs, quantity, location, next_maintenance, maintenance_cost, image, docs) 
            VALUES ('$code', '$name', '$type', '$status', '$specs', $quantity, '$location', $next_maintenance, $maintenance_cost, '$image', '$docs')";
    if (mysqli_query($conn, $sql)) {
        echo "Thêm thành công!";
    } else {
        echo "Lỗi: " . mysqli_error($conn);
    }
    mysqli_close($conn);
}
?>