<?php
include "../config.php";

// Xử lý customer_id
$customer_id = $_POST['customer_id'] ?? '';
$rental_start = $_POST['rental_start'] ?? '';
$rental_end = $_POST['rental_end'] ?? '';
$equipment = $_POST['equipment'] ?? [];

// Kiểm tra dữ liệu đầu vào
if (empty($customer_id) || empty($rental_start) || empty($rental_end) || empty($equipment)) {
    die("Lỗi: Thiếu thông tin khách hàng, ngày bắt đầu, ngày kết thúc hoặc thiết bị.");
}

// Bắt đầu transaction
mysqli_begin_transaction($conn);

try {
    // Xử lý tạo khách hàng mới nếu cần
    if (strpos($customer_id, 'new:') === 0) {
        $new_customer_name = substr($customer_id, 4);
        $sql = "INSERT INTO customers (name) VALUES (?)";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "s", $new_customer_name);

        if (!mysqli_stmt_execute($stmt)) {
            throw new Exception("Lỗi khi tạo khách hàng: " . mysqli_error($conn));
        }

        $customer_id = mysqli_insert_id($conn);
        mysqli_stmt_close($stmt);
    }

    // Thêm đơn hàng vào database
    $sql = "INSERT INTO orders (customer_id, rental_start, rental_end) VALUES (?, ?, ?)";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "iss", $customer_id, $rental_start, $rental_end);

    if (!mysqli_stmt_execute($stmt)) {
        throw new Exception("Lỗi khi thêm đơn hàng: " . mysqli_error($conn));
    }

    $order_id = mysqli_insert_id($conn);
    mysqli_stmt_close($stmt);

    // Thêm từng thiết bị vào order_equipments
    foreach ($equipment as $item) {
        $equipment_id = $item['equipment_id'];
        $quantity = $item['quantity'];
        $rental_period = $item['rental_period'];
        $discount = $item['discount'];
        $calculated_price = $item['calculated_price'];

        // Kiểm tra số lượng tồn kho
        $sql = "SELECT quantity FROM equipments WHERE id = ?";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "i", $equipment_id);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_bind_result($stmt, $current_quantity);
        mysqli_stmt_fetch($stmt);
        mysqli_stmt_close($stmt);

        if ($current_quantity < $quantity) {
            throw new Exception("Lỗi: Không đủ số lượng thiết bị có sẵn!");
        }

        // Giảm số lượng thiết bị tồn kho
        $sql = "UPDATE equipments SET quantity = quantity - ? WHERE id = ?";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "ii", $quantity, $equipment_id);

        if (!mysqli_stmt_execute($stmt)) {
            throw new Exception("Lỗi khi cập nhật số lượng thiết bị: " . mysqli_error($conn));
        }
        mysqli_stmt_close($stmt);

        // Thêm vào order_equipments
        $sql = "INSERT INTO order_equipments (order_id, equipment_id, quantity, rental_period, discount, calculated_price) VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "iiisdd", $order_id, $equipment_id, $quantity, $rental_period, $discount, $calculated_price);

        if (!mysqli_stmt_execute($stmt)) {
            throw new Exception("Lỗi khi thêm thiết bị vào đơn hàng: " . mysqli_error($conn));
        }
        mysqli_stmt_close($stmt);
    }

    // Commit transaction nếu không có lỗi
    mysqli_commit($conn);
    echo "Thêm đơn hàng thành công!";
} catch (Exception $e) {
    // Rollback nếu có lỗi
    mysqli_rollback($conn);
    echo $e->getMessage();
}

// Đóng kết nối
mysqli_close($conn);
?>