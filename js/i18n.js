(function () {
  var KEY = "iam-lang";
  var current = "en";
  var started = false;

  function ui(key, en) {
    var row = window.IAM_UI && IAM_UI[key];
    if (!row) return en;
    return current === "zh" ? row[1] : row[0];
  }

  function text(en) {
    if (current !== "zh" || !en) return en;
    var map = window.IAM_ZH || {};
    return Object.prototype.hasOwnProperty.call(map, en) ? map[en] : en;
  }

  function readStored() {
    try {
      var saved = localStorage.getItem(KEY);
      if (saved === "zh" || saved === "en") return saved;
    } catch (e) {}
    return "";
  }

  function resolve() {
    var q = new URLSearchParams(location.search).get("lang");
    if (q === "zh" || q === "en") return q;
    return readStored();
  }

  function remember(lang) {
    try { localStorage.setItem(KEY, lang); } catch (e) {}
  }

  function writeUrl(lang) {
    var url = new URL(location.href);
    if (lang === "en") url.searchParams.delete("lang");
    else url.searchParams.set("lang", "zh");
    history.replaceState({}, "", url.pathname + url.search + url.hash);
  }

  function pageName() {
    var path = location.pathname.split("/").pop() || "index.html";
    if (!path || path.indexOf(".") === -1) return "index.html";
    return path;
  }

  function applyMeta() {
    var name = pageName();
    var row = window.IAM_META && IAM_META[name];
    document.documentElement.lang = current === "zh" ? "zh-CN" : "en";
    if (!row) return;
    var title = current === "zh" ? row.title[1] : row.title[0];
    var description = current === "zh" ? row.description[1] : row.description[0];
    document.title = title;
    ["description", "og:title", "og:description"].forEach(function (key) {
      var sel = key.indexOf("og:") === 0
        ? 'meta[property="' + key + '"]'
        : 'meta[name="' + key + '"]';
      var el = document.querySelector(sel);
      if (!el) return;
      if (key === "og:title") el.setAttribute("content", title);
      else if (key === "description" || key === "og:description") el.setAttribute("content", description);
    });
    ensureHreflang();
  }

  function ensureHreflang() {
    if (document.querySelector('link[data-hreflang="1"]')) return;
    var url = new URL(location.href);
    url.searchParams.delete("lang");
    url.hash = "";
    var base = url.origin + url.pathname;
    var pairs = [
      ["en", base + "?lang=en"],
      ["zh-CN", base + "?lang=zh"],
      ["x-default", base]
    ];
    pairs.forEach(function (pair) {
      var link = document.createElement("link");
      link.rel = "alternate";
      link.hreflang = pair[0];
      link.href = pair[1];
      link.setAttribute("data-hreflang", "1");
      document.head.appendChild(link);
    });
  }

  function lockOptionValues(root) {
    root.querySelectorAll("select option").forEach(function (opt) {
      if (opt.getAttribute("value") === null) opt.setAttribute("value", opt.textContent.trim());
    });
  }

  function applyText(node) {
    if (!Object.prototype.hasOwnProperty.call(node, "_iamEn")) node._iamEn = node.nodeValue;
    var full = node._iamEn;
    if (current === "en") {
      node.nodeValue = full;
      return;
    }
    var trim = full.replace(/\s+/g, " ").trim();
    var lead = (full.match(/^\s*/) || [""])[0];
    var trail = (full.match(/\s*$/) || [""])[0];
    if (trim === ".") {
      node.nodeValue = lead + "。" + trail;
      return;
    }
    if (!trim || !window.IAM_ZH || !Object.prototype.hasOwnProperty.call(IAM_ZH, trim)) return;
    node.nodeValue = lead + IAM_ZH[trim] + trail;
  }

  function applyAttr(el, name) {
    var key = "data-iam-" + name;
    if (!el.hasAttribute(key)) el.setAttribute(key, el.getAttribute(name) || "");
    var original = el.getAttribute(key);
    el.setAttribute(name, text(original));
  }

  function walk(root) {
    if (!root || root.nodeType !== 1) return;
    if (root.hasAttribute("data-no-i18n") || root.tagName === "SCRIPT" || root.tagName === "STYLE") return;
    if (root.hasAttribute("placeholder")) applyAttr(root, "placeholder");
    if (root.hasAttribute("alt")) applyAttr(root, "alt");
    var nodes = root.childNodes;
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      if (node.nodeType === 3) applyText(node);
      else if (node.nodeType === 1) walk(node);
    }
  }

  function apply() {
    lockOptionValues(document.body);
    walk(document.body);
    applyMeta();
  }

  function modal() {
    var el = document.createElement("div");
    el.className = "lang-modal";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.setAttribute("aria-labelledby", "lang-modal-title");
    el.innerHTML =
      '<div class="lang-modal-card" data-no-i18n="1">' +
      '<h2 id="lang-modal-title">选择语言</h2>' +
      '<p class="lang-en-label">Select Language</p>' +
      '<div class="lang-choices">' +
      '<button type="button" data-set-lang="zh"><strong>中文</strong><span>中文网站</span></button>' +
      '<button type="button" data-set-lang="en"><strong>English</strong><span>English Website</span></button>' +
      "</div></div>";
    document.body.appendChild(el);
    var first = el.querySelector("button");
    if (first) first.focus();
    return el;
  }

  function setLang(lang) {
    if (lang !== "zh" && lang !== "en") return;
    current = lang;
    remember(lang);
    writeUrl(lang);
    var box = document.querySelector(".lang-modal");
    if (box) box.remove();
    if (window.IAM && IAM.mount) IAM.mount();
    apply();
  }

  function start() {
    if (!started) {
      started = true;
      document.addEventListener("click", function (e) {
        var btn = e.target.closest("[data-set-lang]");
        if (!btn) return;
        e.preventDefault();
        setLang(btn.getAttribute("data-set-lang"));
      });
      var chosen = resolve();
      if (chosen) {
        current = chosen;
        remember(chosen);
      } else {
        current = "en";
        modal();
      }
    }
    if (window.IAM && IAM.mount) IAM.mount();
    apply();
  }

  window.IAM_I18N = {
    lang: function () { return current; },
    ui: ui,
    text: text,
    setLang: setLang,
    start: start,
    apply: apply
  };
})();
