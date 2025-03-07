<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Đơn hàng - 92S Rental</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
</head>

<body>
    <div class="d-flex">
        <div class="sidebar bg-dark text-white p-4 vh-100">
            <h2 class="text-center">92S Rental</h2>
            <a href="index.php" class="d-block text-white py-2"><i class="fas fa-home"></i> Dashboard</a>
            <a href="equipments.php" class="d-block text-white py-2"><i class="fas fa-tools"></i> Thiết bị</a>
            <a href="orders.php" class="d-block text-white py-2 active"><i class="fas fa-shopping-cart"></i> Đơn hàng</a>
            <a href="customers.php" class="d-block text-white py-2 active"><i class="fas fa-user"></i> Khách hàng</a>
        </div>
        <div class="container mt-4">
            <h1 class="mb-3">Quản lý đơn hàng</h1>
            <button class="btn btn-primary mb-3" onclick="showOrderForm()">+ Thêm đơn hàng</button>

            <div id="orderForm" class="modal fade" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Thêm Đơn Hàng</h5>
                            <button type="button" class="btn-close" onclick="hideOrderForm()"></button>
                        </div>
                        <div class="modal-body">
                            <form onsubmit="addOrder(event)">
                                <div class="mb-2">
                                    <select id="customer_id" class="form-select" required>
                                        <option value="" disabled selected>Chọn khách hàng</option>
                                        <?php
                                        include "config.php";
                                        $sql = "SELECT id, name FROM customers";
                                        $result = mysqli_query($conn, $sql);
                                        while ($row = mysqli_fetch_assoc($result)) {
                                            echo "<option value='{$row['id']}'>{$row['name']}</option>";
                                        }
                                        ?>
                                    </select>
                                </div>
                                <div class="mb-2">
                                    <select id="equipment_id" class="form-select" required>
                                        <option value="" disabled selected>Chọn thiết bị</option>
                                        <?php
                                        $sql = "SELECT id, name FROM equipments";
                                        $result = mysqli_query($conn, $sql);
                                        while ($row = mysqli_fetch_assoc($result)) {
                                            echo "<option value='{$row['id']}'>{$row['name']}</option>";
                                        }
                                        ?>
                                    </select>
                                </div>
                                <div class="mb-2"><input type="number" id="quantity" class="form-control" placeholder="Số lượng" required></div>
                                <div class="mb-2"><input type="number" id="rental_price" class="form-control" placeholder="Giá thuê (riêng)" required></div>
                                <div class="mb-2"><input type="date" id="rental_start" class="form-control" placeholder="Ngày bắt đầu" required></div>
                                <div class="mb-2"><input type="date" id="rental_end" class="form-control" placeholder="Ngày kết thúc" required></div>
                                <div class="modal-footer">
                                    <button type="submit" class="btn btn-success">Lưu</button>
                                    <button type="button" class="btn btn-secondary" onclick="hideOrderForm()">Hủy</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <table class="table table-striped">
                <thead class="table-dark">
                    <tr>
                        <th>Khách hàng</th>
                        <th>Thiết bị</th>
                        <th>Số lượng</th>
                        <th>Giá thuê</th>
                        <th>Ngày bắt đầu</th>
                        <th>Ngày kết thúc</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    $sql = "SELECT o.id, c.name as customer, e.name as equipment, o.quantity, o.rental_price, o.rental_start, o.rental_end 
                            FROM orders o JOIN customers c ON o.customer_id = c.id JOIN equipments e ON o.equipment_id = e.id";
                    $result = mysqli_query($conn, $sql);
                    while ($row = mysqli_fetch_assoc($result)) {
                        echo "<tr>
                            <td>{$row['customer']}</td>
                            <td>{$row['equipment']}</td>
                            <td>{$row['quantity']}</td>
                            <td>{$row['rental_price']}</td>
                            <td>{$row['rental_start']}</td>
                            <td>{$row['rental_end']}</td>
                            <td><button class='btn btn-danger btn-sm' onclick='deleteItem(\"orders\", {$row['id']})'><i class='fas fa-trash'></i> Xóa</button></td>
                        </tr>";
                    }
                    mysqli_close($conn);
                    ?>
                </tbody>
            </table>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="script.js"></script>
</body>

</html>