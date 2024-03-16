function checkPassword() {
    let pw = document.getElementById('password').value;
    let confirm = document.getElementById('confirm').value;
    let pwMsg = document.getElementById('pwMsg');

    if (pw !== confirm) {
        pwMsg.innerText = "Passwords do not match";
        pwMsg.className = "text-danger";
        return false;
    }
    else {
        pwMsg.innerText = "";
        pwMsg.className = "";
        return true;
    }
};
