import './style.css';


const toggleDarkModeBtn = document.getElementById("toggleDarkMode");

toggleDarkModeBtn?.addEventListener("click", () => {
  const html = document.documentElement;
  html.classList.toggle("dark");

  // Save user preference
  localStorage.setItem("theme", html.classList.contains("dark") ? "dark" : "light");

  // Optionally switch icon
  toggleDarkModeBtn.textContent = html.classList.contains("dark") ? "Light Mode" : "Dark Mode";
});

// On page load: apply saved theme
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
    toggleDarkModeBtn!.textContent = "Light Mode";
  } else {
    toggleDarkModeBtn!.textContent = "Dark Mode";
  }
});

