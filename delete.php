<?php
include "config.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $table = mysqli_real_escape_string($conn, $_POST['table']);
    $id = intval($_POST['id']);
    $sql = "DELETE FROM $table WHERE id = $id";
    if (mysqli_query($conn, $sql)) {
        echo "Xóa thành công!";
    } else {
        echo "Lỗi: " . mysqli_error($conn);
    }
    mysqli_close($conn);
}
?>