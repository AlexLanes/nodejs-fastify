// Globals
  var root = `${window.location.protocol}://${window.location.hostname}`;

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

// After page load
window.onload = function() {
  const state = document.getElementById("current_state").getAttribute('state_name');
  
  // Change state
    replaceState(state);
  
  // Change active top nav
    let id = `topnav_${state}`;
    activeTopNav(id);
}