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
            <a href="../../index.php" class="d-block text-white py-2"><i class="fas fa-home"></i> Dashboard</a>
            <a href="#" class="d-block text-white py-2 active"><i class="fas fa-tools"></i> Thiết bị</a>
            <a href="../orders/index.php" class="d-block text-white py-2"><i class="fas fa-shopping-cart"></i> Đơn hàng</a>
            <a href="../customers/index.php" class="d-block text-white py-2"><i class="fas fa-user"></i> Khách hàng</a>
            <a href="../calendar/index.php" class="d-block text-white py-2 active"><i class="fas fa-calendar"></i> Lịch đặt</a>
        </div>
        <div class="container mt-4">
            <h1 class="mb-3">Quản lý thiết bị</h1>
            <button class="btn btn-primary mb-3" onclick="showForm()">+ Thêm thiết bị</button>

            <div id="equipForm" class="modal fade" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Thêm Thiết Bị</h5>
                            <button type="button" class="btn-close" onclick="hideForm()"></button>
                        </div>
                        <div class="modal-body">
                            <form onsubmit="addEquipment(event)">
                                <div class="mb-2"><input type="text" id="name" class="form-control" placeholder="Tên thiết bị" required></div>
                                <div class="mb-2"><input type="text" id="description" class="form-control" placeholder="Mô tả"></div>
                                <div class="mb-2"><input type="number" id="quantity" class="form-control" placeholder="Số lượng" required></div>
                                <div class="mb-2"><input type="number" id="hourly_price" class="form-control" placeholder="Giá theo giờ"></div>
                                <div class="mb-2"><input type="number" id="daily_price" class="form-control" placeholder="Giá theo ngày"></div>
                                <div class="mb-2"><input type="number" id="weekly_price" class="form-control" placeholder="Giá theo tuần"></div>
                                <div class="mb-2"><input type="number" id="monthly_price" class="form-control" placeholder="Giá theo tháng"></div>
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
                        <th>Tên</th>
                        <th>Mô tả</th>
                        <th>Số lượng</th>
                        <th>Giá thuê</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    include "../config.php";
                    $sql = "SELECT * FROM equipments";
                    $result = mysqli_query($conn, $sql);
                    while ($row = mysqli_fetch_assoc($result)) {
                        echo "<tr>
                                <td>{$row['name']}</td>
                                <td>{$row['description']}</td>
                                <td>{$row['quantity']}</td>
                                <td>
                                    Giờ: " . ($row['hourly_price'] ?? 'N/A') . "<br>
                                    Ngày: " . ($row['daily_price'] ?? 'N/A') . "<br>
                                    Tuần: " . ($row['weekly_price'] ?? 'N/A') . "<br>
                                    Tháng: " . ($row['monthly_price'] ?? 'N/A') . "
                                </td>
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
    <script src="../../script.js"></script>
    <script>
        function addEquipment(event) {
            event.preventDefault(); // Prevent the form from submitting normally

            // Get form data
            const name = document.getElementById('name').value;
            const description = document.getElementById('description').value;
            const quantity = document.getElementById('quantity').value;
            const hourlyPrice = document.getElementById('hourly_price').value;
            const dailyPrice = document.getElementById('daily_price').value;
            const weeklyPrice = document.getElementById('weekly_price').value;
            const monthlyPrice = document.getElementById('monthly_price').value;

            // Validate input
            if (!name || !quantity) {
                alert("Vui lòng điền đầy đủ thông tin bắt buộc (Tên, Số lượng).");
                return;
            }

            // Create a FormData object
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('quantity', quantity);
            formData.append('hourly_price', hourlyPrice);
            formData.append('daily_price', dailyPrice);
            formData.append('weekly_price', weeklyPrice);
            formData.append('monthly_price', monthlyPrice);

            // Send data to the server using Fetch API
            fetch('save_equipment.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.text())
                .then(data => {
                    alert(data); // Show success or error message
                    hideForm(); // Hide the form
                    location.reload(); // Reload the page to show the updated list
                })
                .catch(error => {
                    console.error('Lỗi:', error);
                    alert("Đã xảy ra lỗi khi thêm thiết bị.");
                });
        }
    </script>
</body>

</html>