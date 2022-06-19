// Current root
const root  = `${window.location.protocol}://${window.location.hostname}`;
// Returns the path and filename of the current page
const path  = window.location.pathname;

window.onload = function() {
  // Globals
  const state = document.getElementById("current_state").getAttribute('state_name');
  
  replaceState(state);
  activeTopNav(state);
}

function replaceState(state){
  // Current view state
  window.history.replaceState({}, "", state);
};

function activeTopNav(state){
  // Current view state
  console.log(state);
};