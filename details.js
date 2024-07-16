var formResults = JSON.parse(localStorage.getItem('Form details'))
var selectedLanguages = JSON.parse(localStorage.getItem('Languages'))
const selectors = ['#name', '#phone', '#email', '#pwd', '#date', '#gender', '#state', '#city', '#zip'];
const results = formResults.slice(0, 9); 
console.log(results)
// Setting text for elements based on selectors and results
selectors.forEach((selector, index) => {
    $(selector).text(results[index]);
});

$('#selectedLangs').text(selectedLanguages)

$('.back').on("click", function () {
    localStorage.clear()
    window.location.href = 'index.html'
})
