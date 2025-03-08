<?php
header('Content-Type: application/json');
include "../config.php";

$term = isset($_GET['term']) ? mysqli_real_escape_string($conn, $_GET['term']) : '';

if (empty($term)) {
    echo json_encode([]);
    exit;
}

$sql = "SELECT id, name, contact FROM customers WHERE name LIKE '%$term%' LIMIT 10";
$result = mysqli_query($conn, $sql);

$customers = [];
while ($row = mysqli_fetch_assoc($result)) {
    $customers[] = $row;
}

echo json_encode($customers);
mysqli_close($conn);
?>