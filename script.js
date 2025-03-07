function showForm() {
    const equipForm = document.getElementById("equipForm");
    const bsModal = new bootstrap.Modal(equipForm);
    bsModal.show();
}

function hideForm() {
    const equipForm = document.getElementById("equipForm");
    const bsModal = bootstrap.Modal.getInstance(equipForm);
    bsModal.hide();
}

function showCustomerForm() {
    const customerForm = document.getElementById("customerForm");
    const bsModal = new bootstrap.Modal(customerForm);
    bsModal.show();
}

function hideCustomerForm() {
    const customerForm = document.getElementById("customerForm");
    const bsModal = bootstrap.Modal.getInstance(customerForm);
    bsModal.hide();
}

function showOrderForm() {
    const orderForm = document.getElementById("orderForm");
    const bsModal = new bootstrap.Modal(orderForm);
    bsModal.show();
}

function hideOrderForm() {
    const orderForm = document.getElementById("orderForm");
    const bsModal = bootstrap.Modal.getInstance(orderForm);
    bsModal.hide();
}

function addEquipment(event) {
    event.preventDefault();
    let form = document.getElementById("equipForm").querySelector("form");
    let formData = new FormData(form);

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "save_equipment.php", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            location.reload();
        }
    };
    xhr.send(formData);
}

function addCustomer(event) {
    event.preventDefault();
    const name = document.getElementById("cust_name").value;
    const address = document.getElementById("address").value;
    const contact = document.getElementById("contact").value;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "save_customer.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            location.reload();
        }
    };
    xhr.send(`name=${name}&address=${address}&contact=${contact}`);
}

function addOrder(event) {
    event.preventDefault();
    const customer_id = document.getElementById("customer_id").value;
    const equipment_id = document.getElementById("equipment_id").value;
    const quantity = document.getElementById("quantity").value;
    const rental_price = document.getElementById("rental_price").value;
    const rental_start = document.getElementById("rental_start").value;
    const rental_end = document.getElementById("rental_end").value;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "save_order.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            location.reload();
        }
    };
    xhr.send(`customer_id=${customer_id}&equipment_id=${equipment_id}&quantity=${quantity}&rental_price=${rental_price}&rental_start=${rental_start}&rental_end=${rental_end}`);
}

function deleteItem(table, id) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "delete.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            location.reload();
        }
    };
    xhr.send(`table=${table}&id=${id}`);
}