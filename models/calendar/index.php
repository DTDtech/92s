<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lịch đặt - 92S Rental</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/fullcalendar@5.10.0/main.min.css">
    <script src="https://cdn.jsdelivr.net/npm/fullcalendar@5.10.0/main.min.js"></script>
    <style>
        .calendar-container {
            height: 80vh;
            margin-top: 20px;
        }
    </style>
</head>

<body>
    <div class="d-flex">
        <div class="sidebar bg-dark text-white p-4 vh-100">
            <h2 class="text-center">92S Rental</h2>
            <a href="../../index.php" class="d-block text-white py-2"><i class="fas fa-home"></i> Dashboard</a>
            <a href="../equipments/index.php" class="d-block text-white py-2"><i class="fas fa-tools"></i> Thiết bị</a>
            <a href="../orders/index.php" class="d-block text-white py-2"><i class="fas fa-shopping-cart"></i> Đơn hàng</a>
            <a href="../customers/index.php" class="d-block text-white py-2"><i class="fas fa-user"></i> Khách hàng</a>
            <a href="#" class="d-block text-white py-2 active"><i class="fas fa-calendar"></i> Lịch đặt</a>
        </div>
        <div class="container mt-4">
            <h1 class="mb-3">Lịch đặt thiết bị</h1>
            <!-- <div class="calendar-container" id="calendar"></div> -->
            <div>
                <iframe src="https://calendar.google.com/calendar/embed?src=92studio.manager%40gmail.com&ctz=Asia%2FHo_Chi_Minh" style="border: 0" width="800" height="600" frameborder="0" scrolling="no"></iframe>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const calendarEl = document.getElementById('calendar');

            const calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'dayGridMonth',
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,listWeek'
                },
                events: fetchEvents
            });

            calendar.render();

            function fetchEvents(info, successCallback, failureCallback) {
                fetch('get_events.php')
                    .then(response => response.json())
                    .then(data => {
                        successCallback(data);
                    })
                    .catch(error => {
                        failureCallback(error);
                    });
            }
        });
    </script>
</body>

</html>