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
      "<li><a href=\"./about.html\"" + cur("about") + ">About IAM</a></li>" +
      '<li class="iam-drop"><button type="button" aria-expanded="false">Services</button>' +
      '<div class="iam-drop-panel">' +
      '<a href="./services.html">All services</a>' +
      '<a href="./import-logistics.html"' + cur("import") + '>Import &amp; Customs Clearance</a>' +
      '<a href="./services.html#procurement">Procurement &amp; Sourcing</a>' +
      '<a href="./services.html#import">Import &amp; Export overview</a>' +
      '<a href="./services.html#logistics">Logistics</a>' +
      '<a href="./services.html#industrial">Industrial Supply</a>' +
      '<a href="./services.html#project">Project Supply</a>' +
      '<a href="./services.html#supply-chain">Supply Chain Support</a>' +
      "</div></li>" +
      '<li class="iam-drop"><button type="button" aria-expanded="false">Products &amp; Supply</button>' +
      '<div class="iam-drop-panel">' +
      '<a href="./products.html">Overview</a>' +
      '<a href="./products-construction.html">Construction Materials</a>' +
      '<a href="./products-hardware.html">Hardware &amp; Tools</a>' +
      '<a href="./products-steel.html">Steel Products</a>' +
      '<a href="./products-machinery.html">Machinery &amp; Equipment</a>' +
      '<a href="./products-household.html">Household &amp; Consumer Goods</a>' +
      '<a href="./products-ppe.html">PPE &amp; Safety</a>' +
      '<a href="./products-electrical.html">Electrical &amp; Industrial Supplies</a>' +
      "</div></li>" +
      "<li><a href=\"./china-sourcing.html\"" + cur("china") + ">China Sourcing</a></li>" +
      "<li><a href=\"./project-bulk.html\"" + cur("project") + ">Project &amp; Bulk</a></li>" +
      "<li><a href=\"./how-we-work.html\"" + cur("work") + ">How we work</a></li>" +
      '<li class="iam-drop"><button type="button">More</button>' +
      '<div class="iam-drop-panel">' +
      '<a href="./chinese-suppliers.html">For Chinese suppliers</a>' +
      '<a href="./nigerian-buyers.html">For Nigerian buyers</a>' +
      '<a href="./quality.html">Quality &amp; compliance</a>' +
      '<a href="./sectors.html">Sectors</a>' +
      '<a href="' + PDF + '" download>Company profile (PDF)</a>' +
      "</div></li>" +
      "<li><a href=\"./contact.html\"" + cur("contact") + ">Contact</a></li>" +
      "</ul>" +
      '<a class="btn btn-gold iam-cta-desktop" href="./quote.html" data-track="quote_nav">Request a quote</a>' +
      '<button class="ham" id="hamburger" type="button" aria-label="Open menu" aria-controls="mobile-menu" aria-expanded="false">' +
      '<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M4 6h16M4 12h16M4 18h16"/></svg>' +
      "</button></div>" +
      '<div id="mobile-menu">' +
      '<a href="./index.html">Home</a>' +
      '<a href="./about.html">About IAM</a>' +
      "<details><summary>Services</summary>" +
      '<a href="./services.html">All services</a>' +
      '<a href="./import-logistics.html">Import &amp; Customs Clearance</a>' +
      '<a href="./services.html#procurement">Procurement &amp; Sourcing</a>' +
      '<a href="./services.html#import">Import &amp; Export overview</a>' +
      '<a href="./services.html#logistics">Logistics</a>' +
      '<a href="./services.html#industrial">Industrial Supply</a>' +
      '<a href="./services.html#project">Project Supply</a>' +
      '<a href="./services.html#supply-chain">Supply Chain Support</a></details>' +
      "<details><summary>Products &amp; Supply</summary>" +
      '<a href="./products.html">Overview</a>' +
      '<a href="./products-construction.html">Construction Materials</a>' +
      '<a href="./products-hardware.html">Hardware &amp; Tools</a>' +
      '<a href="./products-steel.html">Steel Products</a>' +
      '<a href="./products-machinery.html">Machinery &amp; Equipment</a>' +
      '<a href="./products-household.html">Household &amp; Consumer Goods</a>' +
      '<a href="./products-ppe.html">PPE &amp; Safety</a>' +
      '<a href="./products-electrical.html">Electrical &amp; Industrial Supplies</a></details>' +
      '<a href="./china-sourcing.html">China Sourcing</a>' +
      '<a href="./project-bulk.html">Project &amp; Bulk Supply</a>' +
      '<a href="./chinese-suppliers.html">For Chinese Suppliers</a>' +
      '<a href="./nigerian-buyers.html">For Nigerian Buyers</a>' +
      '<a href="./how-we-work.html">How we work</a>' +
      '<a href="./quality.html">Quality &amp; Compliance</a>' +
      '<a href="./sectors.html">Sectors</a>' +
      '<a href="./contact.html">Contact</a>' +
      '<a href="' + PDF + '" download>Company profile (PDF)</a>' +
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
      "<p>China–Nigeria procurement, import, industrial supply and logistics partner for companies moving goods into Nigeria.</p>" +
      '<p><a href="' + PDF + '" download>Download company profile (PDF)</a></p></div>' +
      "<div><h4>Company</h4><ul>" +
      '<li><a href="./about.html">About IAM</a></li>' +
      '<li><a href="./how-we-work.html">How we work</a></li>' +
      '<li><a href="./quality.html">Quality &amp; compliance</a></li>' +
      '<li><a href="./sectors.html">Sectors</a></li>' +
      '<li><a href="./chinese-suppliers.html">For Chinese suppliers</a></li>' +
      '<li><a href="./nigerian-buyers.html">For Nigerian buyers</a></li>' +
      "</ul></div>" +
      "<div><h4>Services &amp; products</h4><ul>" +
      '<li><a href="./services.html">Services</a></li>' +
      '<li><a href="./import-logistics.html">Import &amp; customs clearance</a></li>' +
      '<li><a href="./china-sourcing.html">China sourcing</a></li>' +
      '<li><a href="./project-bulk.html">Project &amp; bulk supply</a></li>' +
      '<li><a href="./products-steel.html">Steel products</a></li>' +
      '<li><a href="./products-machinery.html">Machinery</a></li>' +
      '<li><a href="./products-construction.html">Construction materials</a></li>' +
      "</ul></div>" +
      "<div><h4>Contact</h4><ul>" +
      '<li><a href="./contact.html">Contact</a></li>' +
      '<li><a href="./quote.html">Request a quote</a></li>' +
      '<li><a href="mailto:info@iamcorperate.com" data-track="email_click">info@iamcorperate.com</a></li>' +
      '<li><a href="mailto:Ibrahimkhalilmagashi@gmail.com" data-track="email_click">Ibrahimkhalilmagashi@gmail.com</a></li>' +
      '<li><a href="tel:+2348101771640" data-track="phone_click">+234 810 177 1640</a></li>' +
      '<li><a href="https://wa.me/2348101771640" data-track="whatsapp_click">WhatsApp</a></li>' +
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
