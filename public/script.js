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
  }

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
    
}