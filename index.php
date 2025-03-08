<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>92S Rental - Dashboard</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>

<body>
    <div class="d-flex">
        <div class="sidebar bg-dark text-white p-4 vh-100">
            <h2 class="text-center">92S Rental</h2>
            <a href="index.php" class="d-block text-white py-2 active"><i class="fas fa-home"></i> Dashboard</a>
            <a href="models/equipments/index.php" class="d-block text-white py-2"><i class="fas fa-tools"></i> Thiết bị</a>
            <a href="models/orders/index.php" class="d-block text-white py-2"><i class="fas fa-shopping-cart"></i> Đơn hàng</a>
            <a href="models/customers/index.php" class="d-block text-white py-2"><i class="fas fa-user"></i> Khách hàng</a>
            <a href="models/calendar/index.php" class="d-block text-white py-2"><i class="fas fa-user"></i> Lịch</a>
        </div>
        <div class="container mt-4">
            <h1 class="mb-4">Dashboard</h1>

            <!-- Overall Stats -->
            <section class="mb-5">
                <h2 class="mb-3">Overall Stats</h2>
                <div class="row">
                    <div class="col-md-3 mb-3">
                        <div class="card bg-primary text-white">
                            <div class="card-body">
                                <h3 class="card-title">Số đơn hàng</h3>
                                <p class="card-text fs-1">10</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3 mb-3">
                        <div class="card bg-success text-white">
                            <div class="card-body">
                                <h3 class="card-title">Tổng thiết bị thuê</h3>
                                <p class="card-text fs-1">25</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3 mb-3">
                        <div class="card bg-warning text-dark">
                            <div class="card-body">
                                <h3 class="card-title">Sắp Pickup</h3>
                                <p class="card-text fs-1">3</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3 mb-3">
                        <div class="card bg-danger text-white">
                            <div class="card-body">
                                <h3 class="card-title">Sắp trả</h3>
                                <p class="card-text fs-1">5</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Charts Container -->
            <section class="row mb-4">
                <div class="col-md-6 mb-3">
                    <div class="card">
                        <div class="card-header">
                            <h2 class="card-title">Stats Overview</h2>
                        </div>
                        <div class="card-body">
                            <canvas id="statsChart"></canvas>
                        </div>
                    </div>
                    <script>
                        const statsCtx = document.getElementById('statsChart').getContext('2d');
                        new Chart(statsCtx, {
                            type: 'pie',
                            data: {
                                labels: ['Số đơn hàng', 'Tổng thiết bị thuê', 'Sắp Pickup', 'Sắp trả'],
                                datasets: [{ data: [10, 25, 3, 5], backgroundColor: ['#007bff', '#28a745', '#ffc107', '#dc3545'] }]
                            },
                            options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { position: 'bottom' } } }
                        });
                    </script>
                </div>
                <div class="col-md-6 mb-3">
                    <div class="card">
                        <div class="card-header">
                            <h2 class="card-title">Doanh thu 30 ngày qua</h2>
                        </div>
                        <div class="card-body">
                            <canvas id="revenueChart"></canvas>
                        </div>
                    </div>
                    <script>
                        const revenueCtx = document.getElementById('revenueChart').getContext('2d');
                        new Chart(revenueCtx, {
                            type: 'bar',
                            data: {
                                labels: ['2025-02-01', '2025-02-15', '2025-03-01'],
                                datasets: [{ label: 'Doanh thu (VNĐ)', data: [500000, 700000, 900000], backgroundColor: '#007bff' }]
                            },
                            options: {
                                responsive: true,
                                maintainAspectRatio: true,
                                scales: { x: { title: { display: true, text: 'Ngày' } }, y: { title: { display: true, text: 'Doanh thu' } } }
                            }
                        });
                    </script>
                </div>
            </section>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="script.js"></script>
</body>

</html>