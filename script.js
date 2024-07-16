const statesAndCities = {
    "Maharashtra": ["Mumbai", "Pune", "Nagpur"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara"],
    "Rajasthan": ["Jaipur", "Udaipur", "Jodhpur"],
    "Delhi": ["New Delhi", "Central Delhi", "West Delhi"]
};
const stateInput = $('#stateInput');
const cityInput = $('#cityInput');
const stateMsg = $('.state-msg')
cityInput.prop('disabled', true);
var selectedLanguages = [];

//#region phone-number
const phoneInput = document.getElementById("phone");
const validMsg = document.getElementById("validMsg");
const errorMsg = document.getElementById("errorMsg");
const phoneInputField = window.intlTelInput(phoneInput, {
    utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
    initialCountry: "in",
    separateDialCode: true,
});
const errorMap = [
    "Invalid number",
    "Invalid country code",
    "Too short",
    "Too long",
    "Invalid number",
];
const reset = () => {
    phoneInput.classList.remove("error");
    errorMsg.innerHTML = "";
    errorMsg.classList.add("hide");
};
function phoneValidation() {
    reset();
    if (phoneInput.value.trim()) {
        if (phoneInputField.isValidNumber()) {
            errorMsg.classList.remove("hide");
            $(errorMsg).css({ 'color': 'green' })
            errorMsg.innerHTML = "✓ Valid";
            return true;

        } else {
            phoneInput.classList.add("error");
            const errorCode = phoneInputField.getValidationError();
            errorMsg.innerHTML = "";
            errorMsg.innerHTML = errorMap[errorCode] || "Invalid number";
            errorMsg.classList.remove("hide");
            return false;
        }
    } else {
        phoneInput.classList.add("error");
        errorMsg.innerHTML = "Required";
        errorMsg.classList.remove("hide");
        return false;
    }
}
$('#phone').on("blur", phoneValidation);
phoneInput.addEventListener("change", reset);
phoneInput.addEventListener("keyup", reset);
//#endregion phone-number

$(document).ready(function () {
    //#region Common Validation
    function commonValidation(inputValue, regex, status, requiredMsg, failureMsg) {
        //Passing values to the common Validation and then applying conditions, returns true if conditions pass
        if (inputValue === '') {
            $(status).text(requiredMsg);
            return false;
        }
        else if (regex.test(inputValue)) {
            $(status).text('');
            return true;
        }
        else {
            $(status).text(failureMsg)
            return false;
        }
    }
    //#endregion

    //#region Name Validation
    function nameValidation() {
        const nameInput = $("#nameInput").val().trim();
        const pattern = /^[A-Za-z\s]+$/
        const nameMsg = $('#nameMsg');
        return commonValidation(nameInput, pattern, nameMsg, 'Please enter a name', 'Invalid name')
    }
    $('#nameInput').on('blur', nameValidation);
    //#endRegion

    //#region Email Validation
    function emailValidation() {
        const emailInput = $('#emailInput').val().trim();
        const errMsg = $('#emailMsg');
        const emailRegex = /[a-zA-Z0-9]+@[a-zA-Z]+\.[a-z]{2,3}/;
        return commonValidation(emailInput, emailRegex, errMsg, 'Please enter an email address', 'Invalid email address')
    }
    $('#emailInput').on('blur', emailValidation);
    //#endRegion

    //#region Password Validation
    $('.power-container').hide()
    var strength;
    $('#pwdInput').on('input', function () {
        $('.power-container').show()
        var content = 0;
        var power = $('#powerPoint')
        let widthPower = ["1%", "25%", "50%", "75%", "100%"];
        let colorPower = ["#D73F40", "#DC6551", "#F2B84F", "#BDE952", "#3ba62f"];
        const pwdInput = $(this).val().trim();
        const errMsg = $('#pwdMsg');
        //Based on password input
        //Based on every regex test, the content(strength of input), will increment, this value will allow the width of the password progress bar to increase or decrease itself, based on content value, if value remains strong or excellent, then only password input is perfect.
        if (pwdInput.length >= 6) {
            let arrayTest =
                [/[0-9]/, /[a-z]/, /[A-Z]/, /[^0-9a-zA-Z]/];
            arrayTest.forEach((item) => {
                if (item.test(pwdInput)) {
                    content += 1;
                }
            });
        }
        $(power).css({
            'width': widthPower[content],
            'background-color': colorPower[content]
        });
        if (content === 0) {
            strength = "Weak";
        } else if (content === 1 || content === 2) {
            strength = "Medium";
        } else if (content === 3) {
            strength = "Strong";
        } else if (content === 4) {
            strength = "Excellent";
        }
        errMsg.text("Strength of password: " + strength);
    });

    function passwordValidation() {
        const pwdInput = $('#pwdInput');
        const pwdMsg = $('#pwdMsg');
        if (pwdInput.val().trim() === '') {
            pwdMsg.text('Please enter a password');
            $('.power-container').hide()
            return false;
        }
        else if (strength === 'Weak' || strength === 'Medium') {
            return false;
        } else {
            pwdMsg.text('');
            return true
        }
    }
    $('#pwdInput').on('blur', passwordValidation)

    function confirmPasswordValidation() {
        const confirmInput = $('#confirmInput');
        const pwdInput = $('#pwdInput')
        const errMsg = $('#confirmMsg');
        if (confirmInput.val().trim() === '') {
            $(errMsg).text('Please enter password to confirm')
            return false;
        } else if (pwdInput.val().trim() != confirmInput.val().trim()) {
            $(errMsg).text('Both passwords do not match')
            return false
        }
        else {
            $(errMsg).text(' ')
            return true
        }
    }
    $('#confirmInput').on('blur', confirmPasswordValidation);
    //#endRegion

    //#region Date Validation
    function dateValidation() {
        var date = $('#dateInput').val()
        var dateMsg = $('.date-msg')
        if (date.trim() === "") {
            $(dateMsg).text("Date of birth is required")
            return false;
        }
        else {
            $(dateMsg).text(' ')
            return true
        }
    }
    $('#dateInput').on('blur', dateValidation)
    //#endRegion

    //#region Gender Validation
    const genderMsg = $('.gender-msg');
    function genderValdiation() {
        if (!$('input[name="gender"]:checked').length) {
            genderMsg.text('Please select a gender');
            return false;
        } else {

            return true;
        }
    }
    $('input[name="gender"]').on('click', function () {
        genderMsg.text('');
    });
    //#endRegion

    //#region State and City Validation
    Object.keys(statesAndCities).forEach(state => {
        stateInput.append(new Option(state, state));
    });
    // State change event
    function stateValidation() {
        const selectedState = $(stateInput).val();
        if (selectedState === "default") {
            $(stateMsg).text("Please select a state")
            cityMsg.text("Please select a city");
            cityInput.prop('disabled', true);
            return false;
        } else {
            return true;
        }
    }
    function addCity() {
        const selectedState = $(stateInput).val();
        cityInput.empty().append(new Option("Select city", ""));
        cityInput.prop('disabled', false);
        statesAndCities[selectedState].forEach(city => {
            cityInput.append(new Option(city, city));
        });
        $(stateMsg).text("");
    }
    stateInput.on('change', function () {
        const selectedState = $(stateInput).val();
        stateValidation();
        if (selectedState !== "default") {
            addCity();
        }
        else {
            cityInput.empty().append(new Option("Select city", ""));
            cityValidation()
        }
    });
    //City change event
    const cityMsg = $(".city-msg");
    function cityValidation() {
        if (cityInput.val() === "default") {
            cityMsg.text("Please select a city");
            return false;
        } else {
            cityMsg.text("");
            return true
        }

    }
    cityInput.on("change", cityValidation)
    //#endRegion

    //#region ZipCode Validation
    function zipValidation() {
        const zipInput = $('#zipInput').val().trim();
        const zipMsg = $('.zip-msg');
        const zipRegex = /^\d{6}$/;
        return commonValidation(zipInput, zipRegex, zipMsg, 'Please enter zip code', 'Invalid zip code')
    }
    $('#zipInput').on('blur', zipValidation);
    //#endRegion

    //#region Language Selection
    const langMsg = $('.lang-msg');
    function languageValidation() {
        if ($('.checkbox input[type="checkbox"]:checked').length === 0) {
            langMsg.text('Please select at least one language');
            return false;
        } else {
            langMsg.text('');
            return true
        }
    }
    $('input[type="checkbox"]').on('click', function () {
        langMsg.text('');
    });
    //#endRegion

    //#region Reset Event
    $('#reset').on('click', () => {
        const nameMsg = $('#nameMsg');
        const errMsg = $('#emailMsg');
        const pwdMsg = $('#pwdMsg');
        const confirmMsg = $('#confirmMsg');
        const dateMsg = $('.date-msg');
        const genderMsg = $(".gender-msg")
        const zipMsg = $('.zip-msg')
        const cityMsg = $(".city-msg");
        const langMsg = $('.lang-msg');
        $('.power-container').hide()
        errMsg.text('')
        pwdMsg.text('');
        nameMsg.text('')
        errorMsg.innerHTML = "";
        confirmMsg.text('')
        dateMsg.text("")
        genderMsg.text("");
        stateMsg.text("");
        zipMsg.text('')
        cityMsg.text('')
        langMsg.text('')
        cityInput.prop('disabled', true);
    })
    //#endRegion

    //#region Submit Event
    $('#submit').on('click', function (event) {
        event.preventDefault()
        let nameValidate = nameValidation.call($('#name-input')[0]);
        let phoneValidate = phoneValidation.call($('#phone')[0]);
        let emailValidate = emailValidation.call($('#email-input')[0]);
        let passwordValidate = passwordValidation.call($('#pwd-input')[0]);
        let confirmPasswordValidate = confirmPasswordValidation.call($('#confirm-input')[0]);
        let dateValidate = dateValidation.call($('#date-input')[0]);
        let genderValidate = genderValdiation.call($('input[name="gender"]:checked')[0]);
        let stateValidate = stateValidation.call($('#state-input')[0]);
        let cityValidate = cityValidation.call($('#city-input')[0]);
        let zipValidate = zipValidation.call($('#zip-input')[0]);
        let languageValidate = languageValidation.call($('.checkbox input[type="checkbox"]:checked')[0]);

        // Checking if all validations pass
        if (!nameValidate || !phoneValidate || !emailValidate || !passwordValidate || !confirmPasswordValidate || !dateValidate || !stateValidate || !cityValidate || !zipValidate || !genderValidate || !languageValidate) {
            return; // Exit the function if any validation fails
        } // Exit the function if any validation fails

        // If all validations pass, proceed to populate modal and display
        var nameInput = $('#nameInput').val().trim();
        var phoneInputNumber = $('#phone').val().trim();
        var emailInput = $('#emailInput').val().trim();
        var confirmInput = $('#confirmInput').val().trim();
        var index = confirmInput.length
        var resultPassword = '*'.repeat(index)
        var dateInput = $('#dateInput').val().trim();
        var selectGender = $('input[type="radio"][name="gender"]:checked').val();
        var stateInput = $('#stateInput').val().trim();
        var cityInput = $('#cityInput').val().trim()
        var zipInput = $('#zipInput').val().trim();
        $('.checkbox input[type="checkbox"]:checked').each(function () {
            selectedLanguages.push($(this).val());
        });
        // Populate modal content
        $('.modal-content .data').html(`
            <p><strong>Name:</strong> ${nameInput}</p>
            <p><strong>Phone:</strong> ${phoneInputNumber}</p>
            <p><strong>Email:</strong> ${emailInput}</p>
            <p><strong>Password:</strong> ${resultPassword}</p>
            <p><strong>Date of Birth:</strong> ${dateInput}</p>
            <p><strong>Gender:</strong> ${selectGender}</p>
            <p><strong>State:</strong> ${stateInput}</p>
            <p><strong>City:</strong> ${cityInput}</p>
            <p><strong>Languages:</strong> ${selectedLanguages.join(', ')}</p>
            <p><strong>Zip Code:</strong> ${zipInput}</p>
        `);
        // Display the modal
        $('.modal').css({ 'display': 'block' });
    });
    //#endRegion

    //#region Modal-submit-cancel event
    $('.submit-modal').on('click', function (event) {
        event.preventDefault()
        var nameInput = $('#nameInput').val().trim();
        var phoneInput = $('#phone').val().trim();
        var emailInput = $('#emailInput').val().trim();
        var confirmInput = $('#confirmInput').val().trim();
        var dateInput = $('#dateInput').val().trim();
        var selectGender = $('input[type="radio"][name="gender"]').val()
        var stateInput = $('#stateInput').val().trim();
        var cityInput = $('#cityInput').val().trim();
        var zipInput = $('#zipInput').val().trim();
        var formValues = [nameInput, phoneInput, emailInput, confirmInput, dateInput, selectGender, stateInput, cityInput, zipInput]
        localStorage.setItem('Form details', JSON.stringify(formValues))
        localStorage.setItem('Languages', JSON.stringify(selectedLanguages))
        window.location.href = 'details.html'
    })

    $('.cancel-modal').on('click', function () {
        localStorage.clear()
        selectedLanguages = [];
        $('.modal').css({ 'display': 'none' })
    })
});
//#endRegion

//#region Toggle password visibility
function togglePassword(id, icon) {
    const input = document.getElementById(id);
    if (input.type === "password") {
        input.type = "text";
    } else {
        input.type = "password";
    }
    icon.classList.toggle('slash');
}
//#endregion
