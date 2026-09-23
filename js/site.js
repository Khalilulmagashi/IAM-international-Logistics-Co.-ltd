(function () {
  var PDF = "./files/IAM_INTERNATIONAL_LOGISTICS_CO_LTD_COMPANY_PROFILE.pdf";

  function track(name, extra) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: name }, extra || {}));
  }

  function navHtml(page) {
    function cur(href) {
      return page === href ? ' aria-current="page"' : "";
    }
    return (
      '<div class="iam-nav-inner">' +
      '<a class="iam-brand" href="./index.html">' +
      '<div class="iam-mark" aria-hidden="true">IAM</div>' +
      "<div><strong>IAM INTERNATIONAL</strong><span>Logistics Co., Ltd.</span></div></a>" +
      '<ul class="iam-links">' +
      "<li><a href=\"./index.html\"" + cur("index") + ">Home</a></li>" +
      "<li><a href=\"./about.html\"" + cur("about") + ">About</a></li>" +
      '<li class="iam-drop"><button type="button" aria-expanded="false">Trading &amp; Supply</button>' +
      '<div class="iam-drop-panel">' +
      '<a href="./products.html">Overview</a>' +
      '<a href="./products-steel.html"' + cur("steel") + ">Steel</a>" +
      '<a href="./products-machinery.html"' + cur("machinery") + ">Machinery</a>" +
      '<a href="./products-construction.html"' + cur("construction") + ">Construction &amp; Hardware</a>" +
      '<a href="./products-household.html"' + cur("household") + ">Household &amp; Consumer Goods</a>" +
      "</div></li>" +
      "<li><a href=\"./import-logistics.html\"" + cur("import") + ">Import &amp; Logistics</a></li>" +
      "<li><a href=\"./chinese-suppliers.html\"" + cur("suppliers") + ">For Suppliers</a></li>" +
      "<li><a href=\"./nigerian-buyers.html\"" + cur("buyers") + ">For Buyers</a></li>" +
      "<li><a href=\"./contact.html\"" + cur("contact") + ">Contact</a></li>" +
      "</ul>" +
      '<a class="btn btn-gold iam-cta-desktop" href="./quote.html" data-track="quote_nav">Request a quote</a>' +
      '<button class="ham" id="hamburger" type="button" aria-label="Open menu" aria-controls="mobile-menu" aria-expanded="false">' +
      '<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M4 6h16M4 12h16M4 18h16"/></svg>' +
      "</button></div>" +
      '<div id="mobile-menu">' +
      '<a href="./index.html">Home</a>' +
      '<a href="./about.html">About</a>' +
      "<details><summary>Trading &amp; Supply</summary>" +
      '<a href="./products.html">Overview</a>' +
      '<a href="./products-steel.html">Steel</a>' +
      '<a href="./products-machinery.html">Machinery</a>' +
      '<a href="./products-construction.html">Construction &amp; Hardware</a>' +
      '<a href="./products-household.html">Household &amp; Consumer Goods</a></details>' +
      '<a href="./import-logistics.html">Import &amp; Logistics</a>' +
      '<a href="./chinese-suppliers.html">For Suppliers</a>' +
      '<a href="./nigerian-buyers.html">For Buyers</a>' +
      '<a href="./contact.html">Contact</a>' +
      '<a class="btn btn-gold" href="./quote.html">Request a quote</a>' +
      "</div>"
    );
  }

  function footerHtml() {
    return (
      '<div class="wrap ft-grid">' +
      "<div>" +
      '<a class="iam-brand" href="./index.html" style="margin-bottom:0.8rem">' +
      '<div class="iam-mark">IAM</div><div><strong>IAM INTERNATIONAL</strong><span>Logistics Co., Ltd.</span></div></a>' +
      '<p class="tagline">WE CONNECT. WE MOVE. WE DELIVER.</p>' +
      "<p>China–Nigeria trading, import, industrial supply and logistics.</p>" +
      '<p><a href="' + PDF + '" download>Company profile (PDF)</a></p></div>' +
      "<div><h4>Company</h4><ul>" +
      '<li><a href="./about.html">About</a></li>' +
      '<li><a href="./services.html">Capabilities</a></li>' +
      '<li><a href="./import-logistics.html">Import &amp; logistics</a></li>' +
      '<li><a href="./project-bulk.html">Project &amp; bulk</a></li>' +
      '<li><a href="./chinese-suppliers.html">For suppliers</a></li>' +
      '<li><a href="./nigerian-buyers.html">For buyers</a></li>' +
      "</ul></div>" +
      "<div><h4>Trading divisions</h4><ul>" +
      '<li><a href="./products-steel.html">Steel</a></li>' +
      '<li><a href="./products-machinery.html">Machinery</a></li>' +
      '<li><a href="./products-construction.html">Construction &amp; hardware</a></li>' +
      '<li><a href="./products-household.html">Household &amp; consumer goods</a></li>' +
      "</ul></div>" +
      "<div><h4>Contact</h4><ul>" +
      '<li><a href="./contact.html">Contact</a></li>' +
      '<li><a href="./quote.html">Request a quote</a></li>' +
      '<li><a href="mailto:info@iamcorperate.com" data-track="email_click">info@iamcorperate.com</a></li>' +
      '<li><a href="mailto:Ibrahimkhalilmagashi@gmail.com" data-track="email_click">Ibrahimkhalilmagashi@gmail.com</a></li>' +
      '<li><a href="tel:+2348101771640" data-track="phone_click">+234 810 177 1640</a></li>' +
      '<li><a href="tel:+2349020272115" data-track="phone_click">+234 902 027 2115</a></li>' +
      '<li><a href="tel:+2347037060269" data-track="phone_click">+234 703 706 0269</a></li>' +
      "<li>Gwale, Gwale LGA, Kano State, Nigeria</li>" +
      "</ul></div></div>" +
      '<div class="wrap ft-copy"><span>&copy; 2026 IAM International Logistics Co. Ltd. All rights reserved. RC 9490657.</span>' +
      "<span>iamcorperate.com</span></div>"
    );
  }

  window.IAM = {
    track: track,
    pdf: PDF,
    init: function (page) {
      var nav = document.getElementById("iam-nav");
      var foot = document.getElementById("iam-footer");
      if (nav) nav.innerHTML = navHtml(page || "");
      if (foot) foot.innerHTML = footerHtml();

      var ham = document.getElementById("hamburger");
      var menu = document.getElementById("mobile-menu");
      if (ham && menu) {
        ham.addEventListener("click", function () {
          var open = menu.classList.toggle("open");
          ham.setAttribute("aria-expanded", String(open));
          ham.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        });
      }

      document.addEventListener("click", function (e) {
        var t = e.target.closest("[data-track]");
        if (t) track(t.getAttribute("data-track"), { href: t.getAttribute("href") || "" });
      });
    },
  };
})();
