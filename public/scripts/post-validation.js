const postForm = document.querySelector('#post-form');
const title = document.querySelector('#title');
const description = document.querySelector('#description');
const text = document.querySelector('#text');
const message = document.querySelector('#message');

const setError = (field, message) => {
    const parent = field.parentElement;
    const msgField = parent.querySelector('#message');
    msgField.textContent = message;
    msgField.classList.add('error');
    field.classList.add('error-field');
}

const setSuccess = (field) => {
    const parent = field.parentElement;
    const msgField = parent.querySelector('#message');
    msgField.textContent = 'Looks good';
    msgField.classList.add('success')
    field.classList.add('success-field');
}


const validateTitle = ()=>{
    if(title.value.length < 3 || title.value.length > 100)
    {
        setError(title,'Title should be between 3 to 100 characters long');
        return false;
    }
    setSuccess(title);
    return true;
}

const validatedescription = ()=>{
    if(description.value.length < 3 || description.value.length > 100)
    {
        setError(description,'Description should be between 3 to 350 characters long');
        return false;
    }
    setSuccess(description);
    return true;
}

const validateText = ()=>{
    if(text.value.length < 3 || text.value.length < 10)
    {
        setError(text,'Text should be atleast 10 characters long');
        return false;
    }
    setSuccess(text);
    return true;
}

title.addEventListener('blur',validateTitle);
description.addEventListener('blur',validatedescription);
text.addEventListener('blur',validateText);

postForm.addEventListener('submit', (evt) => {
    let returnVal = true;
    if (!validateTitle())
        returnVal = false;
    if (!validatedescription())
        returnVal = false;

    if (!validateText())
        returnVal = false;

    if (!returnVal)
        evt.preventDefault();

})