<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thiết bị - 92S Rental</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
</head>

<body>
    <div class="d-flex">
        <div class="sidebar bg-dark text-white p-4 vh-100">
            <h2 class="text-center">92S Rental</h2>
            <a href="index.php" class="d-block text-white py-2"><i class="fas fa-home"></i> Dashboard</a>
            <a href="equipments.php" class="d-block text-white py-2 active"><i class="fas fa-tools"></i> Thiết bị</a>
            <a href="orders.php" class="d-block text-white py-2"><i class="fas fa-shopping-cart"></i> Đơn hàng</a>
            <a href="customers.php" class="d-block text-white py-2 active"><i class="fas fa-user"></i> Khách hàng</a>
        </div>
        <div class="container mt-4">
            <h1 class="mb-3">Quản lý thiết bị</h1>
            <button class="btn btn-primary mb-3" data-bs-toggle="modal" data-bs-target="#equipForm">
                + Thêm thiết bị
            </button>

            <div id="equipForm" class="modal fade" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Thêm Thiết Bị</h5>
                            <button type="button" class="btn-close" onclick="hideForm()"></button>
                        </div>
                        <div class="modal-body">
                            <form enctype="multipart/form-data" onsubmit="addEquipment(event)">
                                <div class="mb-2"><input type="text" name="code" class="form-control" placeholder="Mã thiết bị" required></div>
                                <div class="mb-2"><input type="text" name="name" class="form-control" placeholder="Tên thiết bị" required></div>
                                <div class="mb-2"><input type="text" name="type" class="form-control" placeholder="Loại thiết bị"></div>
                                <div class="mb-2">
                                    <select name="status" class="form-select" required>
                                        <option value="Available">Sẵn sàng</option>
                                        <option value="Rented">Đang thuê</option>
                                        <option value="Maintenance">Bảo trì</option>
                                    </select>
                                </div>
                                <div class="mb-2"><textarea name="specs" class="form-control" placeholder="Thông số kỹ thuật"></textarea></div>
                                <div class="mb-2"><input type="number" name="quantity" class="form-control" placeholder="Số lượng" required></div>
                                <div class="mb-2"><input type="text" name="location" class="form-control" placeholder="Vị trí lưu trữ"></div>
                                <div class="mb-2"><input type="date" name="next_maintenance" class="form-control"></div>
                                <div class="mb-2"><input type="number" name="maintenance_cost" class="form-control" placeholder="Chi phí bảo trì" step="0.01"></div>
                                <div class="mb-2"><input type="file" name="image" class="form-control" accept="image/*"></div>
                                <div class="mb-2"><input type="file" name="docs" class="form-control" accept=".pdf"></div>
                                <div class="modal-footer">
                                    <button type="submit" class="btn btn-success">Lưu</button>
                                    <button type="button" class="btn btn-secondary" onclick="hideForm()">Hủy</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <table class="table table-striped">
                <thead class="table-dark">
                    <tr>
                        <th>Mã</th>
                        <th>Tên</th>
                        <th>Loại</th>
                        <th>Tình trạng</th>
                        <th>Số lượng</th>
                        <th>Vị trí</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    include "config.php";
                    $sql = "SELECT * FROM equipments";
                    $result = mysqli_query($conn, $sql);
                    while ($row = mysqli_fetch_assoc($result)) {
                        echo "<tr>
                            <td>{$row['code']}</td>
                            <td>{$row['name']}</td>
                            <td>{$row['type']}</td>
                            <td>{$row['status']}</td>
                            <td>{$row['quantity']}</td>
                            <td>{$row['location']}</td>
                            <td><button class='btn btn-danger btn-sm' onclick='deleteItem(\"equipments\", {$row['id']})'><i class='fas fa-trash'></i> Xóa</button></td>
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