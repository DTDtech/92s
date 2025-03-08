<?php
include "../config.php";

$sql = "SELECT id, name FROM equipments";
$result = mysqli_query($conn, $sql);

$equipments = [];
while ($row = mysqli_fetch_assoc($result)) {
    $equipments[] = $row;
}

echo json_encode($equipments);

mysqli_close($conn);
?>