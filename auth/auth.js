// Страница, куда ведут ссылки из писем Wattermelon: подтверждение почты и «Забыл пароль».
// Общий файл для /auth/ и /ru/auth/; тексты берутся из самой страницы (data-атрибуты).
// Встроенных скриптов на странице нет - правило Content-Security-Policy разрешает только этот файл.
(function () {
  var raw = (location.hash || "").replace(/^#/, "") || (location.search || "").replace(/^\?/, "");
  var params = new URLSearchParams(raw);
  var ok = document.getElementById("ok");
  var fail = document.getElementById("fail");
  var desktop = document.getElementById("desktop");
  var failed = params.get("error") || params.get("error_code");

  if (failed) {
    ok.hidden = true;
    fail.hidden = false;
    document.title = fail.getAttribute("data-title");
  } else if (params.get("access_token")) {
    // Ключи входа передаём в приложение - оно само проверит их и войдёт.
    document.getElementById("open").href = "wattermelon://auth-callback#" + raw;
    if (params.get("type") === "recovery") {
      // Ссылка из письма «Забыл пароль»: новый пароль выбирают в приложении.
      var word = document.getElementById("okWord");
      var accent = document.getElementById("okAccent");
      word.textContent = word.getAttribute("data-recovery");
      accent.textContent = accent.getAttribute("data-recovery");
      document.getElementById("okText").textContent = ok.getAttribute("data-recovery-sub");
      desktop.textContent = ok.getAttribute("data-recovery-desktop");
      document.title = ok.getAttribute("data-recovery-title");
    }
  }

  // Ключи не оставляем в адресной строке.
  if (raw) { history.replaceState(null, "", location.pathname); }

  // Смена языка не теряет ключи: они уходят на вторую страницу так же, во фрагменте.
  var links = document.querySelectorAll(".lang a");
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener("click", function () {
      if (raw) { this.href = this.getAttribute("href") + "#" + raw; }
    });
  }

  var mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (!mobile) { desktop.hidden = false; }
})();
