const THEME_STORAGE_KEY = "theme";
const themeToggle = document.querySelector("#theme-toggle");

const getSavedTheme = () => {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

  return savedTheme === "light" || savedTheme === "dark" ? savedTheme : null;
};

const getPreferredTheme = () => {
  const savedTheme = getSavedTheme();

  if (savedTheme) {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const applyTheme = (theme) => {
  document.documentElement.dataset.theme = theme;

  if (themeToggle) {
    const isDarkTheme = theme === "dark";
    const themeToggleLabel = isDarkTheme ? "Use light theme" : "Use dark theme";

    themeToggle.setAttribute("aria-pressed", String(isDarkTheme));
    themeToggle.setAttribute("aria-label", themeToggleLabel);
    themeToggle.textContent = themeToggleLabel;
  }
};

const toggleTheme = () => {
  const nextTheme = document.documentElement.dataset.theme === "dark"
    ? "light"
    : "dark";

  localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  applyTheme(nextTheme);
};

applyTheme(getPreferredTheme());

if (themeToggle) {
  themeToggle.addEventListener("click", toggleTheme);
}
