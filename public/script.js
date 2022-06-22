// Functions
  function replaceState(state){
    // Current view state
    window.history.replaceState({}, "", `/${state}`);
  };
  function activeTopNav(id){
    // Active top nav
    let topnav = document.getElementById(id);
    topnav != null && topnav != undefined
      ? topnav.setAttribute("class", "active")
      : {};
  };
  function togglePassword(eye){
    let input_password = document.getElementById("password"); 
    let toogle_type = input_password.getAttribute("type") == "password"
      ? "text" 
      : "password";
    input_password.setAttribute("type", toogle_type);
    // Toggle the eye slash icon
    eye.classList.toggle("fa-eye-slash");
  };
  function addDays(date, days) {
    var result = new Date(date);
    days = parseInt(days);
    result.setDate(result.getDate() + days);
    // Return date + days
    return result;
  };
  function parseDate(date) {
    let day = date.getDate().toString().padStart(2, "0");
    let mon = (date.getMonth() + 1).toString().padStart(2, "0");
    // Parse date to string dd/mm/yyyy
    return `${day}/${mon}/${date.getFullYear()}`;
  };
  function confirmRentCreation(book_name, days){
    let date = addDays(new Date(), days);
    let confirm = window.confirm(`Irei devolver o livro "${book_name}" até ${parseDate(date)} !`);
    return confirm;
  };
  function confirmRentDeletion(book_name){
    let confirm = window.confirm(`Está pronto para devolver o livro "${book_name}"?`);
    return confirm;
  };
  function showActionDiv(div_id){
    // Get div from action
    let div = document.getElementById(div_id);
    // Show the div
    return div.style.display = "block";
  };
  function hideActionDiv(div_id){
    // Get div from action
    let div = document.getElementById(div_id);
    // Hide the div
    return div.style.display = "none";
  };

// After page load
window.onload = function() {
  const state = document.getElementById("current_state").getAttribute('state_name');
  
  // Change state
    replaceState(state);
  
  // Change active top nav
    activeTopNav(`topnav_${state}`);
  
  // Events listener
    // Toogle password
      var eye_listener = document.getElementById("eye");
      eye_listener != null && eye_listener != undefined
        ? eye_listener.onclick = function(){ togglePassword(this); }
        : {};
    // Create rent confirmation
      var create_rent_listener = document.getElementById("form_create_rent");
      create_rent_listener != null && create_rent_listener != undefined
        ? create_rent_listener.onsubmit = function(){ 
            let select = this.childNodes[0].parentNode[1];
            return confirmRentCreation( select.options[select.selectedIndex].text, this.childNodes[0].parentNode[0].value ); 
          }
        : {};
    // Delete rent confirmation
      var delete_rent_listener = document.getElementById("form_delete_rent");
      delete_rent_listener != null && delete_rent_listener != undefined
        ? delete_rent_listener.onsubmit = function(){ return confirmRentDeletion(this.childNodes[0].parentNode[0].getAttribute("book_name")); }
        : {};
    // Admin action change
      var admin_action_listener = document.getElementById("admin_action");
      if( admin_action_listener != null && admin_action_listener != undefined ){
        // On page load, show first action
          showActionDiv(admin_action_listener.value);
          var previous_action = admin_action_listener.value;
        // Change of <select> value
          admin_action_listener.onchange = function(){
            // Hide previous action
            hideActionDiv(previous_action);
            // Show current action
            showActionDiv(this.value)
            // Current Action = next previous_action
            previous_action = this.value;
            return; 
          }
      }

}