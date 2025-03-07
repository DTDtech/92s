<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Calendar - 92S Rental</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
</head>

<body>
    <div class="d-flex">
        <div class="sidebar bg-dark text-white p-4 vh-100">
            <h2 class="text-center">92S Rental</h2>
            <a href="index.php" class="d-block text-white py-2"><i class="fas fa-home"></i> Dashboard</a>
            <a href="equipments.php" class="d-block text-white py-2"><i class="fas fa-tools"></i> Thiết bị</a>
            <a href="orders.php" class="d-block text-white py-2"><i class="fas fa-shopping-cart"></i> Đơn hàng</a>
            <a href="customers.php" class="d-block text-white py-2"><i class="fas fa-users"></i> Khách hàng</a>
            <a href="booking_calendar.php" class="d-block text-white py-2 active"><i class="fas fa-calendar"></i> Lịch đặt</a>
        </div>
        <div class="container mt-4">
            <h1 class="mb-4">Booking Calendar</h1>
            <div class="card">
                <div class="card-body">
                    <iframe src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=Asia%2FHo_Chi_Minh&showPrint=0&src=OTJzdHVkaW8ubWFuYWdlckBnbWFpbC5jb20&color=%23D50000" style="border:0" width="100%" height="600" frameborder="0" scrolling="no"></iframe>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="script.js"></script>
</body>

</html>