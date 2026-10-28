function checkForm() {
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var subject = document.getElementById("subject").value;
    var message = document.getElementById("message").value;

    if (name == "" || email == "" || subject == "" || message == "") {
        document.getElementById("result").innerHTML = " ⚠️ Please fill in all fields.";
        return false;
    }
    else if (email.indexOf("@") == -1 || email.indexOf(".") == -1) {
        document.getElementById("result").innerHTML = " ⚠️ Please enter a valid email.";
        return false;
    }
    else {
        document.getElementById("result").innerHTML = " ✓ Thank you! Your form is valid.";
        return false;
    }
}