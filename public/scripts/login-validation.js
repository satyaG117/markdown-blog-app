const loginForm = document.querySelector('#login-form');
const registerForm = document.querySelector('#register-form');
const username = document.querySelector('#username');
const password = document.querySelector('#password');

//length 3 - 20 only contains alphanumeric and _ and .
const usernameRegex = /^[a-zA-Z0-9_.]{3,20}$/g
//length 8 - 25 , atleast one lowercase , one uppercase ,one number and  optional special characters
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[\w~@#$%^&*+=`|{}:;!.?\"()\[\]-]{8,25}$/g

// set error message for the given input field
const setError = (field, message) => {
    const parent = field.parentElement;
    const msgField = parent.querySelector('#message');
    msgField.textContent = message;
    msgField.classList.add('error');
    field.classList.add('error-field');
}

// set success message for the given input field
const setSuccess = (field) => {
    const parent = field.parentElement;
    const msgField = parent.querySelector('#message');
    msgField.textContent = 'Looks good';
    msgField.classList.add('success')
    field.classList.add('success-field');
}

const validateUsername = () => {
    if (!username.value.match(usernameRegex)) {
        setError(username, 'Username must be between 3-20 characters long and can only contain alphabets , numbers , _ or .');
        return false;
    }
    setSuccess(username);
    return true;
}

const validatePassword = () => {
    if (!password.value.match(passwordRegex)) {
        setError(password, 'Password should be between 8-25 characters long and should contain atleast one lowercase , one uppercase , one number and any of the permitted characters : ~@#$%^&*+=`|{}:;!.?"()[]-');
        return false;
    }
    setSuccess(password);
    return true;
}

username.addEventListener('blur', validateUsername);
password.addEventListener('blur', validatePassword);



loginForm.addEventListener('submit', (evt) => {
    let returnVal = true;
    if (!validateUsername())
        returnVal = false;
    if (!validatePassword())
        returnVal = false;

    if (!returnVal)
        evt.preventDefault();

})
