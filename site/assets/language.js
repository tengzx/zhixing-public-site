(() => {
  const normalize = (value) => {
    const candidate = value?.toLowerCase();
    if (candidate?.startsWith("zh")) return "zh-Hans";
    if (candidate?.startsWith("en")) return "en";
    return null;
  };

  const queryLanguage = normalize(new URLSearchParams(window.location.search).get("lang"));
  const browserLanguage = (navigator.languages ?? [navigator.language])
    .map(normalize)
    .find(Boolean);
  const language = queryLanguage ?? browserLanguage ?? "en";

  document.documentElement.lang = language;
  document.documentElement.dataset.language = language;

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-language-link]").forEach((link) => {
      const selectedLanguage = link.dataset.languageLink;
      if (selectedLanguage === language) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    document.querySelectorAll("a[href]").forEach((link) => {
      if (link.dataset.languageLink) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      url.searchParams.set("lang", language);
      link.href = url.href;
    });

    const page = window.location.pathname.split("/").filter(Boolean).at(-1) ?? "home";
    const titles = {
      home: { en: "HourNote", "zh-Hans": "HourNote" },
      privacy: { en: "Privacy Policy — HourNote", "zh-Hans": "隐私政策 — HourNote" },
      terms: { en: "Terms of Service — HourNote", "zh-Hans": "服务条款 — HourNote" },
      support: { en: "Support — HourNote", "zh-Hans": "支持 — HourNote" }
    };
    document.title = (titles[page] ?? titles.home)[language];
    document.querySelector("nav")?.setAttribute(
      "aria-label",
      language === "zh-Hans" ? "主导航" : "Main navigation"
    );
  });
})();
