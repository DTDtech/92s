<?php
include "models/config.php";

$table = $_POST['table'];
$id = $_POST['id'];

// Validate table to prevent SQL injection
$valid_tables = ['customers', 'equipments', 'orders'];
if (!in_array($table, $valid_tables)) {
    echo "Invalid table";
    exit;
}

$sql = "DELETE FROM $table WHERE id = $id";

if (mysqli_query($conn, $sql)) {
    echo "Record deleted successfully";
} else {
    echo "Error deleting record: " . mysqli_error($conn);
}

mysqli_close($conn);
?>