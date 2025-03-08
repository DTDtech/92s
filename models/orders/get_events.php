<?php
header('Content-Type: application/json');
include "../config.php";

$sql = "SELECT o.id, c.name as customer, e.name as equipment, o.quantity, o.rental_start, o.rental_end 
        FROM orders o 
        JOIN customers c ON o.customer_id = c.id 
        JOIN equipments e ON o.equipment_id = e.id";
$result = mysqli_query($conn, $sql);

$events = [];
while ($row = mysqli_fetch_assoc($result)) {
    $events[] = [
        'id' => $row['id'],
        'title' => $row['customer'] . ' - ' . $row['equipment'] . ' (' . $row['quantity'] . ')',
        'start' => $row['rental_start'],
        'end' => $row['rental_end'],
        'allDay' => true,
        'backgroundColor' => '#007bff',
        'borderColor' => '#0056b3'
    ];
}

echo json_encode($events);
mysqli_close($conn);
?>