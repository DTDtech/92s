<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Khách hàng - 92S Rental</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
</head>

<body>
    <div class="d-flex">
        <div class="sidebar bg-dark text-white p-4 vh-100">
            <h2 class="text-center">92S Rental</h2>
            <a href="../../index.php" class="d-block text-white py-2"><i class="fas fa-home"></i> Dashboard</a>
            <a href="../equipments/index.php" class="d-block text-white py-2"><i class="fas fa-tools"></i> Thiết bị</a>
            <a href="../orders/index.php" class="d-block text-white py-2"><i class="fas fa-shopping-cart"></i> Đơn hàng</a>
            <a href="#" class="d-block text-white py-2 active"><i class="fas fa-user"></i> Khách hàng</a>
            <a href="../calendar/index.php" class="d-block text-white py-2 active"><i class="fas fa-calendar"></i> Lịch đặt</a>
        </div>
        <div class="container mt-4">
            <h1 class="mb-3">Quản lý khách hàng</h1>
            <button class="btn btn-primary mb-3" onclick="showCustomerForm()">+ Thêm khách hàng</button>

            <div id="customerForm" class="modal fade" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Thêm Khách Hàng</h5>
                            <button type="button" class="btn-close" onclick="hideCustomerForm()"></button>
                        </div>
                        <div class="modal-body">
                            <form onsubmit="addCustomer(event)">
                                <div class="mb-2"><input type="text" id="cust_name" class="form-control" placeholder="Tên khách hàng" required></div>
                                <div class="mb-2"><input type="text" id="address" class="form-control" placeholder="Địa chỉ"></div>
                                <div class="mb-2"><input type="text" id="contact" class="form-control" placeholder="Số điện thoại"></div>
                                <div class="modal-footer">
                                    <button type="submit" class="btn btn-success">Lưu</button>
                                    <button type="button" class="btn btn-secondary" onclick="hideCustomerForm()">Hủy</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <table class="table table-striped">
                <thead class="table-dark">
                    <tr>
                        <th>Tên</th>
                        <th>Địa chỉ</th>
                        <th>Liên hệ</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    include "../config.php";
                    $sql = "SELECT * FROM customers";
                    $result = mysqli_query($conn, $sql);
                    while ($row = mysqli_fetch_assoc($result)) {
                        echo "<tr>
                            <td>{$row['name']}</td>
                            <td>{$row['address']}</td>
                            <td>{$row['contact']}</td>
                            <td><button class='btn btn-danger btn-sm' onclick='deleteItem(\"customers\", {$row['id']})'><i class='fas fa-trash'></i> Xóa</button></td>
                        </tr>";
                    }
                    mysqli_close($conn);
                    ?>
                </tbody>
            </table>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="../../script.js"></script>
</body>

</html>