(() => {
  const normalize = (value) => {
    const candidate = value?.toLowerCase();
    if (candidate?.startsWith("zh-hant") || candidate?.startsWith("zh-tw") || candidate?.startsWith("zh-hk")) return "zh-Hant";
    if (candidate?.startsWith("zh")) return "zh-Hans";
    if (candidate?.startsWith("en")) return "en";
    if (candidate?.startsWith("ja")) return "ja";
    if (candidate?.startsWith("es")) return "es";
    if (candidate?.startsWith("de")) return "de";
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
    document.querySelectorAll("[data-language-section], [data-language-label]").forEach((element) => {
      element.dataset.languageActive = String(
        element.dataset.languageSection === language || element.dataset.languageLabel === language
      );
    });

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
      home: { en: "HourNote", "zh-Hans": "HourNote", "zh-Hant": "HourNote", ja: "HourNote", es: "HourNote", de: "HourNote" },
      privacy: { en: "Privacy Policy — HourNote", "zh-Hans": "隐私政策 — HourNote", "zh-Hant": "隱私政策 — HourNote", ja: "プライバシーポリシー — HourNote", es: "Política de privacidad — HourNote", de: "Datenschutzrichtlinie — HourNote" },
      terms: { en: "Terms of Service — HourNote", "zh-Hans": "服务条款 — HourNote", "zh-Hant": "服務條款 — HourNote", ja: "利用規約 — HourNote", es: "Términos del servicio — HourNote", de: "Nutzungsbedingungen — HourNote" },
      support: { en: "Support — HourNote", "zh-Hans": "支持 — HourNote", "zh-Hant": "支援 — HourNote", ja: "サポート — HourNote", es: "Soporte — HourNote", de: "Support — HourNote" },
      automation: { en: "App tracking automation — HourNote", "zh-Hans": "App 自动追踪设置 — HourNote", "zh-Hant": "App 自動追蹤設定 — HourNote", ja: "App使用記録のオートメーション — HourNote", es: "Automatización de seguimiento de apps — HourNote", de: "Automation zur App-Erfassung — HourNote" }
    };
    document.title = (titles[page] ?? titles.home)[language];
    document.querySelector("nav")?.setAttribute(
      "aria-label",
      ({
        en: "Main navigation",
        "zh-Hans": "主导航",
        "zh-Hant": "主導覽",
        ja: "メインナビゲーション",
        es: "Navegación principal",
        de: "Hauptnavigation"
      })[language]
    );
  });
})();
