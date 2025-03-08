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

function addCustomer(event) {
    event.preventDefault();
    const name = document.getElementById("cust_name").value;
    const address = document.getElementById("address").value;
    const contact = document.getElementById("contact").value;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "save.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            location.reload();
        }
    };
    xhr.send(`name=${name}&address=${address}&contact=${contact}`);
}

function deleteItem(table, id) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "../../delete.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            location.reload();
        }
    };
    xhr.send(`table=${table}&id=${id}`);
}