document.addEventListener("DOMContentLoaded", () => {
  const headerThemeBtn = document.getElementById("headerThemeToggle");
  const hiddenThemeCheckbox = document.getElementById("themeToggle");
  const htmlElement = document.documentElement;

  if (!headerThemeBtn || !hiddenThemeCheckbox) return;

  // 1. Sync the hidden checkbox with the starting theme
  if (htmlElement.getAttribute("data-theme") === "dark") {
    hiddenThemeCheckbox.checked = true;
  }

  // 2. The Bulletproof Toggle Logic
  headerThemeBtn.addEventListener("click", () => {
    // Check current state
    const isDark = htmlElement.getAttribute("data-theme") === "dark";
    const newTheme = isDark ? "light" : "dark";

    // Force the CSS to update instantly
    htmlElement.setAttribute("data-theme", newTheme);

    // Keep the hidden engine checkbox perfectly in sync and trigger its save logic
    hiddenThemeCheckbox.checked = !isDark;
    hiddenThemeCheckbox.dispatchEvent(new Event("change", { bubbles: true }));

    // Swap the icon visually (Moon for Dark, Sun for Light)
    if (newTheme === "dark") {
      headerThemeBtn.innerHTML =
        '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
    } else {
      headerThemeBtn.innerHTML =
        '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
    }
  });
  // Create a persistent connection to the background to announce the panel is open
  chrome.runtime.connect({ name: "lumina-sidepanel" });
});
