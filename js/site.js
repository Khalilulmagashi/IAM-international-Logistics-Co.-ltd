(function () {
  var PDF = "./files/IAM_INTERNATIONAL_LOGISTICS_CO_LTD_COMPANY_PROFILE.pdf";

  function track(name, extra) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: name }, extra || {}));
  }

  function ui(key, en) {
    if (window.IAM_I18N && IAM_I18N.ui) return IAM_I18N.ui(key, en);
    return en;
  }

  function langSwitch() {
    var lang = window.IAM_I18N && IAM_I18N.lang ? IAM_I18N.lang() : "en";
    return (
      '<div class="lang-switch" data-no-i18n="1" role="group" aria-label="' + ui("lang.group", "Language") + '">' +
      '<button type="button" data-set-lang="zh" aria-pressed="' + (lang === "zh" ? "true" : "false") + '">中文</button>' +
      '<span aria-hidden="true">/</span>' +
      '<button type="button" data-set-lang="en" aria-pressed="' + (lang === "en" ? "true" : "false") + '">EN</button>' +
      "</div>"
    );
  }

  function navHtml(page) {
    function cur(href) {
      return page === href ? ' aria-current="page"' : "";
    }
    return (
      '<div class="iam-nav-inner">' +
      '<a class="iam-brand" href="./index.html">' +
      '<div class="iam-mark" aria-hidden="true">IAM</div>' +
      "<div><strong>" + ui("brand.main", "IAM INTERNATIONAL") + "</strong><span>" + ui("brand.sub", "Logistics Co., Ltd.") + "</span></div></a>" +
      '<ul class="iam-links">' +
      "<li><a href=\"./index.html\"" + cur("index") + ">" + ui("nav.home", "Home") + "</a></li>" +
      "<li><a href=\"./about.html\"" + cur("about") + ">" + ui("nav.about", "About") + "</a></li>" +
      '<li class="iam-drop"><button type="button" aria-expanded="false">' + ui("nav.trading", "Trading & Supply") + "</button>" +
      '<div class="iam-drop-panel">' +
      '<a href="./products.html">' + ui("nav.overview", "Overview") + "</a>" +
      '<a href="./products-steel.html"' + cur("steel") + ">" + ui("nav.steel", "Steel") + "</a>" +
      '<a href="./products-machinery.html"' + cur("machinery") + ">" + ui("nav.machinery", "Machinery") + "</a>" +
      '<a href="./products-construction.html"' + cur("construction") + ">" + ui("nav.construction", "Construction & Hardware") + "</a>" +
      '<a href="./products-household.html"' + cur("household") + ">" + ui("nav.household", "Household & Consumer Goods") + "</a>" +
      "</div></li>" +
      "<li><a href=\"./import-logistics.html\"" + cur("import") + ">" + ui("nav.import", "Import & Logistics") + "</a></li>" +
      "<li><a href=\"./chinese-suppliers.html\"" + cur("suppliers") + ">" + ui("nav.suppliers", "For Suppliers") + "</a></li>" +
      "<li><a href=\"./nigerian-buyers.html\"" + cur("buyers") + ">" + ui("nav.buyers", "For Buyers") + "</a></li>" +
      "<li><a href=\"./contact.html\"" + cur("contact") + ">" + ui("nav.contact", "Contact") + "</a></li>" +
      "</ul>" +
      langSwitch() +
      '<a class="btn btn-gold iam-cta-desktop" href="./quote.html" data-track="quote_nav">' + ui("nav.quote", "Request a quote") + "</a>" +
      '<button class="ham" id="hamburger" type="button" aria-label="' + ui("nav.open", "Open menu") + '" aria-controls="mobile-menu" aria-expanded="false">' +
      '<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M4 6h16M4 12h16M4 18h16"/></svg>' +
      "</button></div>" +
      '<div id="mobile-menu">' +
      '<a href="./index.html">' + ui("nav.home", "Home") + "</a>" +
      '<a href="./about.html">' + ui("nav.about", "About") + "</a>" +
      "<details><summary>" + ui("nav.trading", "Trading & Supply") + "</summary>" +
      '<a href="./products.html">' + ui("nav.overview", "Overview") + "</a>" +
      '<a href="./products-steel.html">' + ui("nav.steel", "Steel") + "</a>" +
      '<a href="./products-machinery.html">' + ui("nav.machinery", "Machinery") + "</a>" +
      '<a href="./products-construction.html">' + ui("nav.construction", "Construction & Hardware") + "</a>" +
      '<a href="./products-household.html">' + ui("nav.household", "Household & Consumer Goods") + "</a></details>" +
      '<a href="./import-logistics.html">' + ui("nav.import", "Import & Logistics") + "</a>" +
      '<a href="./chinese-suppliers.html">' + ui("nav.suppliers", "For Suppliers") + "</a>" +
      '<a href="./nigerian-buyers.html">' + ui("nav.buyers", "For Buyers") + "</a>" +
      '<a href="./contact.html">' + ui("nav.contact", "Contact") + "</a>" +
      '<a class="btn btn-gold" href="./quote.html">' + ui("nav.quote", "Request a quote") + "</a>" +
      "</div>"
    );
  }

  function footerHtml() {
    return (
      '<div class="wrap ft-grid">' +
      "<div>" +
      '<a class="iam-brand" href="./index.html" style="margin-bottom:0.8rem">' +
      '<div class="iam-mark">IAM</div><div><strong>' + ui("brand.main", "IAM INTERNATIONAL") + "</strong><span>" + ui("brand.sub", "Logistics Co., Ltd.") + "</span></div></a>" +
      "<p>" + ui("foot.line", "China–Nigeria trading, import and supply.") + "</p>" +
      '<p><a href="' + PDF + '" download>' + ui("foot.pdf", "Company profile (PDF)") + "</a></p></div>" +
      "<div><h4>" + ui("foot.company", "Company") + "</h4><ul>" +
      '<li><a href="./about.html">' + ui("nav.about", "About") + "</a></li>" +
      '<li><a href="./services.html">' + ui("foot.capabilities", "Capabilities") + "</a></li>" +
      '<li><a href="./import-logistics.html">' + ui("foot.import", "Import & logistics") + "</a></li>" +
      '<li><a href="./project-bulk.html">' + ui("foot.project", "Project & bulk") + "</a></li>" +
      '<li><a href="./chinese-suppliers.html">' + ui("foot.suppliers", "For suppliers") + "</a></li>" +
      '<li><a href="./nigerian-buyers.html">' + ui("foot.buyers", "For buyers") + "</a></li>" +
      "</ul></div>" +
      "<div><h4>" + ui("foot.divisions", "Trading divisions") + "</h4><ul>" +
      '<li><a href="./products-steel.html">' + ui("foot.steel", "Steel") + "</a></li>" +
      '<li><a href="./products-machinery.html">' + ui("foot.machinery", "Machinery") + "</a></li>" +
      '<li><a href="./products-construction.html">' + ui("foot.construction", "Construction & hardware") + "</a></li>" +
      '<li><a href="./products-household.html">' + ui("foot.household", "Household & consumer goods") + "</a></li>" +
      "</ul></div>" +
      "<div><h4>" + ui("nav.contact", "Contact") + "</h4><ul>" +
      '<li><a href="./contact.html">' + ui("nav.contact", "Contact") + "</a></li>" +
      '<li><a href="./quote.html">' + ui("nav.quote", "Request a quote") + "</a></li>" +
      '<li><a href="mailto:info@iamcorperate.com" data-track="email_click">info@iamcorperate.com</a></li>' +
      '<li><a href="mailto:Ibrahimkhalilmagashi@gmail.com" data-track="email_click">Ibrahimkhalilmagashi@gmail.com</a></li>' +
      '<li><a href="tel:+2348101771640" data-track="phone_click">+234 810 177 1640</a></li>' +
      '<li><a href="tel:+2349020272115" data-track="phone_click">+234 902 027 2115</a></li>' +
      '<li><a href="tel:+2347037060269" data-track="phone_click">+234 703 706 0269</a></li>' +
      "<li>" + ui("foot.address", "Gwale, Gwale LGA, Kano State, Nigeria") + "</li>" +
      "</ul></div></div>" +
      '<div class="wrap ft-copy"><span>' + ui("foot.copy", "© 2026 IAM International Logistics Co. Ltd. All rights reserved. RC 9490657.") + "</span>" +
      "<span>iamcorperate.com</span></div>"
    );
  }

  window.IAM = {
    track: track,
    pdf: PDF,
    page: "",
    mount: function () {
      var page = IAM.page || "";
      var nav = document.getElementById("iam-nav");
      var foot = document.getElementById("iam-footer");
      if (nav) {
        nav.setAttribute("data-no-i18n", "1");
        nav.innerHTML = navHtml(page);
      }
      if (foot) {
        foot.setAttribute("data-no-i18n", "1");
        foot.innerHTML = footerHtml();
      }
      var ham = document.getElementById("hamburger");
      var menu = document.getElementById("mobile-menu");
      if (ham && menu) {
        ham.addEventListener("click", function () {
          var open = menu.classList.toggle("open");
          ham.setAttribute("aria-expanded", String(open));
          ham.setAttribute("aria-label", open ? ui("nav.close", "Close menu") : ui("nav.open", "Open menu"));
        });
      }
    },
    init: function (page) {
      IAM.page = page || "";
      if (!IAM._trackBound) {
        IAM._trackBound = true;
        document.addEventListener("click", function (e) {
          var t = e.target.closest("[data-track]");
          if (t) track(t.getAttribute("data-track"), { href: t.getAttribute("href") || "" });
        });
      }
      if (window.IAM_I18N) IAM_I18N.start();
      else IAM.mount();
    },
  };
})();
