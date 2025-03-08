<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Đơn hàng - 92S Rental</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <style>
        .autocomplete-items {
            position: absolute;
            border: 1px solid #d4d4d4;
            border-bottom: none;
            border-top: none;
            z-index: 99;
            top: 100%;
            left: 0;
            right: 0;
        }

        .autocomplete-items div {
            padding: 10px;
            cursor: pointer;
            background-color: #fff;
            border-bottom: 1px solid #d4d4d4;
        }

        .autocomplete-items div:hover {
            background-color: #e9e9e9;
        }

        .autocomplete-active {
            background-color: DodgerBlue !important;
            color: #ffffff;
        }

        .autocomplete {
            position: relative;
        }

        .position-relative {
            position: relative;
        }

        .position-absolute {
            position: absolute;
        }

        .top-0 {
            top: 0;
        }

        .end-0 {
            right: 0;
        }
    </style>
</head>

<body>
    <div class="d-flex">
        <div class="sidebar bg-dark text-white p-4 vh-100">
            <h2 class="text-center">92S Rental</h2>
            <a href="../../index.php" class="d-block text-white py-2"><i class="fas fa-home"></i> Dashboard</a>
            <a href="../equipments/index.php" class="d-block text-white py-2"><i class="fas fa-tools"></i> Thiết bị</a>
            <a href="#" class="d-block text-white py-2 active"><i class="fas fa-shopping-cart"></i> Đơn hàng</a>
            <a href="../customers/index.php" class="d-block text-white py-2"><i class="fas fa-user"></i> Khách hàng</a>
            <a href="../calendar/index.php" class="d-block text-white py-2 active"><i class="fas fa-calendar"></i> Lịch đặt</a>
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
                                <div class="mb-2 autocomplete">
                                    <input id="customer_search" type="text" class="form-control" placeholder="Tìm khách hàng..." autocomplete="off">
                                    <input type="hidden" id="customer_id" name="customer_id">
                                </div>
                                <div id="equipment-list">
                                    <div class="equipment-item mb-2 position-relative">
                                        <select name="equipment_id[]" class="form-select mb-2" required>
                                            <option value="" disabled selected>Chọn thiết bị</option>
                                            <?php
                                            include "../config.php";
                                            $sql = "SELECT id, name, hourly_price, daily_price, weekly_price, monthly_price FROM equipments";
                                            $result = mysqli_query($conn, $sql);
                                            while ($row = mysqli_fetch_assoc($result)) {
                                                echo "<option value='{$row['id']}' data-hourly='{$row['hourly_price']}' data-daily='{$row['daily_price']}' data-weekly='{$row['weekly_price']}' data-monthly='{$row['monthly_price']}'>{$row['name']}</option>";
                                            }
                                            ?>
                                        </select>
                                        <input type="number" name="quantity[]" class="form-control mb-2" placeholder="Số lượng" required>
                                        <select name="rental_period[]" class="form-select mb-2" required>
                                            <option value="" disabled selected>Chọn thời gian thuê</option>
                                            <option value="hourly">Theo giờ</option>
                                            <option value="daily">Theo ngày</option>
                                            <option value="weekly">Theo tuần</option>
                                            <option value="monthly">Theo tháng</option>
                                        </select>
                                        <input type="number" name="discount[]" class="form-control mb-2" placeholder="Giảm giá (nếu có)">
                                        <div class="calculated-price mb-2">Giá thuê: <span>0</span></div>
                                        <button type="button" class="btn btn-danger btn-sm position-absolute top-0 end-0" onclick="removeEquipment(this)">Xóa</button>
                                    </div>
                                </div>
                                <button type="button" class="btn btn-secondary mb-2" onclick="addEquipmentToOrderForm()">+ Thêm thiết bị</button>
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
                        <th>Thiết bị (Số lượng x Giá thuê)</th>
                        <th>Ngày bắt đầu</th>
                        <th>Ngày kết thúc</th>
                        <th>Tổng giá</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    include "../config.php";

                    $sql = "
                        SELECT 
                            o.id AS order_id,
                            c.name AS customer,
                            GROUP_CONCAT(CONCAT(e.name, ' (', oe.quantity, ' x ', oe.rental_price, ')') SEPARATOR '<br>') AS equipment_details,
                            SUM(oe.quantity * oe.rental_price) AS total_price,
                            o.rental_start,
                            o.rental_end
                        FROM 
                            orders o 
                        JOIN 
                            customers c ON o.customer_id = c.id 
                        JOIN 
                            order_equipments oe ON o.id = oe.order_id 
                        JOIN 
                            equipments e ON oe.equipment_id = e.id
                        GROUP BY 
                            o.id
                    ";

                    $result = mysqli_query($conn, $sql);
                    if (!$result) {
                        die("Lỗi truy vấn: " . mysqli_error($conn));
                    }

                    while ($row = mysqli_fetch_assoc($result)) {
                        echo "<tr>
                                <td>{$row['customer']}</td>
                                <td>{$row['equipment_details']}</td>
                                <td>{$row['rental_start']}</td>
                                <td>{$row['rental_end']}</td>
                                <td>{$row['total_price']}</td>
                                <td><button class='btn btn-danger btn-sm' onclick='deleteItem(\"orders\", {$row['order_id']})'><i class='fas fa-trash'></i> Xóa</button></td>
                            </tr>";
                    }
                    ?>
                </tbody>
            </table>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="../../script.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const initialEquipmentItem = document.querySelector('.equipment-item');
            if (initialEquipmentItem) {
                setupEquipmentItem(initialEquipmentItem);
            }

            const customerSearch = document.getElementById('customer_search');
            if (customerSearch) {
                customerSearch.addEventListener('input', function() {
                    const searchTerm = this.value.trim();
                    if (searchTerm.length > 1) {
                        fetch(`search_customer.php?term=${encodeURIComponent(searchTerm)}`)
                            .then(response => response.json())
                            .then(data => {
                                let autocompleteList = document.querySelector('.autocomplete-items');
                                if (!autocompleteList) {
                                    autocompleteList = document.createElement('div');
                                    autocompleteList.setAttribute('class', 'autocomplete-items');
                                    document.querySelector('.autocomplete').appendChild(autocompleteList);
                                }

                                autocompleteList.innerHTML = '';

                                if (data.length === 0) {
                                    const div = document.createElement('div');
                                    div.innerHTML = `"${searchTerm}" không tìm thấy. Khách hàng mới sẽ được tạo khi đơn hàng được lưu.`;
                                    div.addEventListener('click', function() {
                                        customerSearch.value = searchTerm;
                                        document.getElementById('customer_id').value = 'new:' + searchTerm;
                                        autocompleteList.innerHTML = '';
                                    });
                                    autocompleteList.appendChild(div);
                                } else {
                                    data.forEach(customer => {
                                        const div = document.createElement('div');
                                        div.innerHTML = `${customer.name} - ${customer.contact || 'No contact'}`;
                                        div.addEventListener('click', function() {
                                            customerSearch.value = customer.name;
                                            document.getElementById('customer_id').value = customer.id;
                                            autocompleteList.innerHTML = '';
                                        });
                                        autocompleteList.appendChild(div);
                                    });
                                }
                            })
                            .catch(error => console.error('Error:', error));
                    } else {
                        const autocompleteList = document.querySelector('.autocomplete-items');
                        if (autocompleteList) {
                            autocompleteList.innerHTML = '';
                        }
                    }
                });

                // Close the dropdown if the user clicks outside of it
                document.addEventListener('click', function(e) {
                    if (e.target !== customerSearch) {
                        const autocompleteList = document.querySelector('.autocomplete-items');
                        if (autocompleteList) {
                            autocompleteList.innerHTML = '';
                        }
                    }
                });
            }
        });

        function setupEquipmentItem(equipmentItem) {
            const equipmentSelect = equipmentItem.querySelector('select[name="equipment_id[]"]');
            const rentalPeriodSelect = equipmentItem.querySelector('select[name="rental_period[]"]');
            const quantityInput = equipmentItem.querySelector('input[name="quantity[]"]');
            const discountInput = equipmentItem.querySelector('input[name="discount[]"]');
            const calculatedPriceSpan = equipmentItem.querySelector('.calculated-price span');

            const calculatePrice = () => {
                const equipmentId = equipmentSelect.value;
                const selectedOption = equipmentSelect.querySelector(`option[value="${equipmentId}"]`);
                const rentalPeriod = rentalPeriodSelect.value;
                const quantity = parseFloat(quantityInput.value) || 0;
                const discount = parseFloat(discountInput.value) || 0;

                if (!selectedOption || !rentalPeriod || quantity <= 0) {
                    calculatedPriceSpan.textContent = '0';
                    return;
                }

                // Get the price based on the selected rental period
                const pricePerPeriod = parseFloat(selectedOption.getAttribute(`data-${rentalPeriod}`)) || 0;
                let price = pricePerPeriod * quantity;

                // Apply discount
                price = price - (price * (discount / 100));
                console.log('Calculated Price:', price); // Debugging: Log the calculated price

                calculatedPriceSpan.textContent = price.toFixed(2);
            };

            // Attach event listeners
            equipmentSelect.addEventListener('change', calculatePrice);
            rentalPeriodSelect.addEventListener('change', calculatePrice);
            quantityInput.addEventListener('input', calculatePrice);
            discountInput.addEventListener('input', calculatePrice);

            // Trigger initial calculation
            calculatePrice();
        }

        async function addEquipmentToOrderForm() {
            const equipmentList = document.getElementById('equipment-list');
            const newItem = document.createElement('div');
            newItem.classList.add('equipment-item', 'mb-2', 'position-relative');

            // Fetch equipment options from the server
            const response = await fetch('get_equipments.php');
            const equipments = await response.json();

            // Generate the HTML for the new equipment item
            let options = '<option value="" disabled selected>Chọn thiết bị</option>';
            equipments.forEach(equipment => {
                options += `<option value="${equipment.id}" data-hourly="${equipment.hourly_price}" data-daily="${equipment.daily_price}" data-weekly="${equipment.weekly_price}" data-monthly="${equipment.monthly_price}">${equipment.name}</option>`;
            });

            newItem.innerHTML = `
                <select name="equipment_id[]" class="form-select mb-2" required>
                    ${options}
                </select>
                <input type="number" name="quantity[]" class="form-control mb-2" placeholder="Số lượng" required>
                <select name="rental_period[]" class="form-select mb-2" required>
                    <option value="" disabled selected>Chọn thời gian thuê</option>
                    <option value="hourly">Theo giờ</option>
                    <option value="daily">Theo ngày</option>
                    <option value="weekly">Theo tuần</option>
                    <option value="monthly">Theo tháng</option>
                </select>
                <input type="number" name="discount[]" class="form-control mb-2" placeholder="Giảm giá (nếu có)">
                <div class="calculated-price mb-2">Giá thuê: <span>0</span></div>
                <button type="button" class="btn btn-danger btn-sm position-absolute top-0 end-0" onclick="removeEquipment(this)">Xóa</button>
            `;

            // Add event listeners for dynamic price calculation
            setupEquipmentItem(newItem);

            equipmentList.appendChild(newItem);
        }

        function removeEquipment(button) {
            const equipmentItem = button.closest('.equipment-item');
            if (equipmentItem) {
                equipmentItem.remove();
            }
        }

        function addOrder(event) {
            event.preventDefault();

            const customerIdInput = document.getElementById('customer_id');
            const customerSearch = document.getElementById('customer_search').value.trim();
            const rentalStart = document.getElementById('rental_start').value;
            const rentalEnd = document.getElementById('rental_end').value;

            // Tự động tạo customer_id nếu người dùng nhập tên mà không chọn từ danh sách
            if (!customerIdInput.value && customerSearch) {
                customerIdInput.value = 'new:' + customerSearch;
            }

            // Kiểm tra các trường bắt buộc
            if (!customerIdInput.value || !rentalStart || !rentalEnd) {
                alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
                return;
            }

            // Collect equipment data
            const equipmentItems = document.querySelectorAll('.equipment-item');
            const equipmentData = [];
            equipmentItems.forEach(item => {
                const equipmentId = item.querySelector('select[name="equipment_id[]"]').value;
                const quantity = item.querySelector('input[name="quantity[]"]').value;
                const rentalPeriod = item.querySelector('select[name="rental_period[]"]').value;
                const discount = item.querySelector('input[name="discount[]"]').value;
                const calculatedPrice = item.querySelector('.calculated-price span').textContent;

                if (!equipmentId || !quantity || !rentalPeriod || !calculatedPrice) {
                    alert('Vui lòng điền đầy đủ thông tin cho từng thiết bị!');
                    return;
                }

                equipmentData.push({
                    equipment_id: equipmentId,
                    quantity: quantity,
                    rental_period: rentalPeriod,
                    discount: discount,
                    calculated_price: calculatedPrice
                });
            });

            // Prepare form data
            const formData = new FormData();
            formData.append('customer_id', customerIdInput.value);
            formData.append('rental_start', rentalStart);
            formData.append('rental_end', rentalEnd);
            equipmentData.forEach((item, index) => {
                formData.append(`equipment[${index}][equipment_id]`, item.equipment_id);
                formData.append(`equipment[${index}][quantity]`, item.quantity);
                formData.append(`equipment[${index}][rental_period]`, item.rental_period);
                formData.append(`equipment[${index}][discount]`, item.discount);
                formData.append(`equipment[${index}][calculated_price]`, item.calculated_price);
            });

            // Send data to the server
            fetch('save_order.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.text())
                .then(data => {
                    alert(data.includes('Error') ? data : 'Thêm đơn hàng thành công!');
                    hideOrderForm();
                    location.reload();
                })
                .catch(error => console.error('Lỗi:', error));
        }
    </script>
</body>

</html>