(function () {
  function tr(en) {
    if (window.IAM_I18N && IAM_I18N.text) return IAM_I18N.text(en);
    return en;
  }

  function setMsg(el, en, ok) {
    if (!el) return;
    el.textContent = tr(en);
    if (el.firstChild) el.firstChild._iamEn = en;
    el.className = "form-msg " + (ok ? "ok" : "err");
  }

  function setButtonText(btn, en) {
    btn.textContent = tr(en);
    if (btn.firstChild) btn.firstChild._iamEn = en;
  }

  function readFileAsBase64(file) {
    return new Promise(function (resolve, reject) {
      if (!file) return resolve(null);
      if (file.size > 6 * 1024 * 1024) {
        reject(new Error(tr("Attachment must be under 6 MB.")));
        return;
      }
      var reader = new FileReader();
      reader.onload = function () {
        var result = String(reader.result || "");
        var parts = result.split(",");
        resolve({ name: file.name, type: file.type, data: parts[1] || "" });
      };
      reader.onerror = function () {
        reject(new Error(tr("Could not read the attachment.")));
      };
      reader.readAsDataURL(file);
    });
  }

  function collect(form) {
    var data = {};
    new FormData(form).forEach(function (value, key) {
      if (value instanceof File) return;
      data[key] = String(value).trim();
    });
    return data;
  }

  async function submitEnquiry(form, type, required) {
    var msg = form.querySelector(".form-msg");
    var btn = form.querySelector('[type="submit"]');
    var data = collect(form);
    var missing = (required || []).filter(function (k) {
      return !data[k];
    });
    if (missing.length) {
      setMsg(msg, "Please complete the required fields.", false);
      return;
    }
    var fileInput = form.querySelector('input[type="file"]');
    var file = fileInput && fileInput.files && fileInput.files[0];
    try {
      if (btn) {
        btn.disabled = true;
        var labelNode = btn.firstChild;
        btn.dataset.label = labelNode && labelNode._iamEn
          ? labelNode._iamEn.replace(/\s+/g, " ").trim()
          : btn.textContent;
        setButtonText(btn, "Sending…");
      }
      var attachment = await readFileAsBase64(file);
      var payload = Object.assign({ type: type }, data);
      if (attachment) payload.attachment = attachment;

      var res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      var body = {};
      var raw = await res.text();
      if (raw) {
        try {
          body = JSON.parse(raw);
        } catch (e) {
          throw new Error("Server returned an invalid response.");
        }
      }
      if (!res.ok || !body.ok) throw new Error(body.error || "Failed to send.");
      if (window.IAM) IAM.track(type + "_submit", { category: data.category || "" });
      setMsg(
        msg,
        body.message ||
          "Thank you. Your request has been received by IAM International Logistics. Our team will review the details and contact you shortly.",
        true
      );
      form.reset();
    } catch (err) {
      var text = err && err.message ? err.message : "Could not send.";
      if (text === "Failed to fetch" || text === "Load failed") {
        text = "Could not reach the server. Open this site via http://localhost:3000, or email info@iamcorperate.com / WhatsApp +234 810 177 1640.";
      }
      setMsg(msg, text, false);
    } finally {
      if (btn) {
        btn.disabled = false;
        setButtonText(btn, btn.dataset.label || "Submit");
      }
    }
  }

  document.addEventListener("invalid", function (e) {
    var el = e.target;
    if (!el || !el.form || !el.form.hasAttribute("data-enquiry")) return;
    if (el.validity.valueMissing) el.setCustomValidity(tr("Please complete the required fields."));
    else if (el.validity.typeMismatch) el.setCustomValidity(tr("Please enter a valid email address."));
  }, true);
  document.addEventListener("input", function (e) {
    if (e.target && e.target.setCustomValidity) e.target.setCustomValidity("");
  }, true);

  window.IAMForms = {
    bind: function () {
      document.querySelectorAll("form[data-enquiry]").forEach(function (form) {
        form.addEventListener("submit", function (e) {
          e.preventDefault();
          var type = form.getAttribute("data-enquiry") || "quote";
          var intentInput = form.querySelector('[name="intent"]');
          if (type === "quote" && intentInput && intentInput.value === "import") type = "import_logistics";
          var required = (form.getAttribute("data-required") || "").split(",").filter(Boolean);
          submitEnquiry(form, type, required);
        });
      });
      function applyCategory(form) {
        var sel = form.querySelector('[name="category"]');
        var value = sel ? sel.value : "";
        form.querySelectorAll("[data-for-category]").forEach(function (block) {
          var allowed = block.getAttribute("data-for-category").split("|");
          var show = allowed.indexOf(value) !== -1;
          block.hidden = !show;
          block.querySelectorAll("input, select, textarea").forEach(function (input) {
            input.disabled = !show;
          });
        });
      }
      document.querySelectorAll("form[data-enquiry]").forEach(function (form) {
        var sel = form.querySelector('[name="category"]');
        if (!sel) return;
        sel.addEventListener("change", function () { applyCategory(form); });
        applyCategory(form);
      });
      var params = new URLSearchParams(location.search);
      if (params.get("intent") === "import") {
        document.querySelectorAll('form[data-enquiry="quote"]').forEach(function (form) {
          var intent = form.querySelector('[name="intent"]');
          if (intent) intent.value = "import";
        });
      }
      var cat = params.get("category");
      var product = params.get("product");
      if (cat) {
        var sel = document.querySelector('[name="category"]');
        if (sel) {
          sel.value = cat;
          var form = sel.closest("form");
          if (form) applyCategory(form);
        }
      }
      if (product) {
        var pr = document.querySelector('[name="product"]');
        if (pr && !pr.value) pr.value = product;
      }
    },
  };
})();
