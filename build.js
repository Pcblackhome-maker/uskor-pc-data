const fs = require('fs');
const path = require('path');

// Загружаем JSON со статьями
const data = JSON.parse(fs.readFileSync('./article/articles.json', 'utf8'));
// Загружаем CSS (стили)
const styles = fs.readFileSync('./style.css', 'utf8');

// Функция для форматирования текста шагов (перевод строк в <br>)
function formatText(text) {
  if (!text) return '';
  return text.split(/\n\n+/).map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
}

// Генерация кода таблиц (software / hardware / table)
function generateTables(article) {
  let html = '';
  if (article.software) {
    html += `<h3 style="margin-top:25px;">🛠️ Программы</h3>
    <div class="table-wrapper"><table class="clean-table">
    <tr><th>Программа</th><th>Что делает</th><th>Цена</th><th>Ссылка</th></tr>`;
    article.software.forEach(row => {
      html += `<tr><td>${row.program}</td><td>${row.desc}</td><td>${row.price}</td>
      <td><a href="${row.affiliate_link || '#'}" class="btn-tilda affiliate-link">${row.btn_text}</a></td></tr>`;
    });
    html += `</table></div>`;
  }
  if (article.hardware) {
    html += `<h3 style="margin-top:25px;">💻 Железо и аксессуары</h3>
    <div class="table-wrapper"><table class="clean-table">
    <tr><th>Товар</th><th>Описание</th><th>Цена</th><th>Ссылка</th></tr>`;
    article.hardware.forEach(row => {
      html += `<tr><td>${row.product}</td><td>${row.desc}</td><td>${row.price}</td>
      <td><a href="${row.affiliate_link || '#'}" class="btn-tilda affiliate-link">${row.btn_text}</a></td></tr>`;
    });
    html += `</table></div>`;
  }
  if (article.table) {
    html += `<div class="table-wrapper"><table class="clean-table">
    <tr><th>Программа</th><th>Что делает</th><th>Цена</th><th>Ссылка</th></tr>`;
    article.table.forEach(row => {
      html += `<tr><td>${row.program}</td><td>${row.desc}</td><td>${row.price}</td>
      <td><a href="${row.affiliate_link || '#'}" class="btn-tilda affiliate-link">${row.btn_text}</a></td></tr>`;
    });
    html += `</table></div>`;
  }
  return html;
}

// Генерация отдельной страницы статьи
function renderArticlePage(id, article) {
  let content = '';
  // Шаги (аккордеоны)
  if (article.steps) {
    content += article.steps.map(step => `
      <div class="accordion-item">
        <div class="accordion-header active" onclick="this.classList.toggle('active'); this.nextElementSibling.classList.toggle('open')">
          ${step.strong}
        </div>
        <div class="accordion-body open">${formatText(step.text)}</div>
      </div>
    `).join('');
  }

  // Совет / предупреждение
  if (article.advice) content += `<div class="advice-block"><strong>💡 Совет</strong><br>${article.advice}</div>`;
  if (article.warning) content += `<div class="warning-block"><strong>⚠️ Важно</strong><br>${article.warning}</div>`;

  // Таблицы
  content += generateTables(article);

  // Продуктовая кнопка
  if (article.product_btn) {
    content += `<a href="${article.product_btn.affiliate_link || '#'}" class="btn-tilda affiliate-link" style="margin-top:20px;" target="_blank">${article.product_btn.text}</a>`;
  }

  // Донат
  if (article.donate_url) {
    content += `<a href="${article.donate_url}" class="donate-link" target="_blank">☕ Помогло? Угости автора кофе</a>`;
  }

  // FAQ
  if (article.faq) {
    content += `<div class="faq-section"><h3>❓ Часто задаваемые вопросы</h3>`;
    article.faq.forEach(item => {
      content += `<div class="faq-item"><div class="faq-question">${item.q}</div><div class="faq-answer">${item.a}</div></div>`;
    });
    content += `</div>`;
  }

  // Помощь
  if (article.help_text) {
    content += `<div style="margin-top:25px; background:#f0f8ff; padding:20px; border-radius:12px; text-align:center;"><strong>🤔 Остались вопросы?</strong><br>${article.help_text}</div>`;
  }

  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${article.title} | Ускорь ПК</title>
  <meta name="description" content="${article.intro || article.title + '. Бесплатные инструкции по ускорению ПК.'}">
  <link rel="stylesheet" href="/style.css">
  <!-- Яндекс.Метрика -->
  <script type="text/javascript">
    (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
    m[i].l=1*new Date();
    for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
    k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
    (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
    ym(109547393, "init", {
      clickmap:true,
      trackLinks:true,
      accurateTrackBounce:true,
      webvisor:true
    });
  </script>
  <noscript><div><img src="https://mc.yandex.ru/watch/109547393" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
</head>
<body>
  <div class="decor-spot spot-1"></div>
  <div class="decor-spot spot-2"></div>
  <div class="decor-spot spot-3"></div>
  <div class="reading-progress" id="readingProgress"></div>

  <div class="landing">
    <a href="/" class="back-btn"><span>←</span> На главную</a>
    <div class="content-box" style="display:block;">
      <h2>${article.title}</h2>
      ${article.intro ? `<p style="margin-bottom:20px; color:#555;">${article.intro}</p>` : ''}
      ${content}
    </div>
    <div class="site-footer">
      © 2026 <span>Ускорь ПК</span> · <a href="/privacy">Политика конфиденциальности</a>
    </div>
  </div>

  <button class="scroll-top-btn" id="scrollTopBtn" onclick="window.scrollTo({top:0,behavior:'smooth'})"><span>↑</span></button>
  <div class="cookie-consent" id="cookieConsent">
    <span>🍪 Мы используем куки и Яндекс.Метрику. <a href="/privacy">Подробнее</a></span>
    <button onclick="acceptCookies()">Принимаю</button>
  </div>

  <script>
    window.addEventListener('scroll', () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      document.getElementById('readingProgress').style.width = (winScroll / height) * 100 + '%';
      document.getElementById('scrollTopBtn').classList.toggle('visible', winScroll > 500);
    });
    function acceptCookies() {
      localStorage.setItem('cookie_accepted','true');
      document.getElementById('cookieConsent').classList.add('hidden');
    }
    if (localStorage.getItem('cookie_accepted') === 'true') {
      document.getElementById('cookieConsent').classList.add('hidden');
    }
    document.querySelectorAll('.faq-question').forEach(q => q.addEventListener('click', function() {
      this.parentElement.classList.toggle('open');
    }));
  </script>
</body>
</html>`;
}

// Создаём папку для статей, если её нет
const articlesDir = path.join(__dirname, 'articles');
if (!fs.existsSync(articlesDir)) {
  fs.mkdirSync(articlesDir);
}

// Генерируем каждую статью
Object.keys(data.articles).forEach(id => {
  const article = data.articles[id];
  const html = renderArticlePage(id, article);
  fs.writeFileSync(path.join(articlesDir, `${id}.html`), html);
  console.log(`Создана страница: /articles/${id}.html`);
});

// Генерируем sitemap.xml
let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://uskor-pc.ru/</loc></url>
  <url><loc>https://uskor-pc.ru/guide</loc></url>`;
Object.keys(data.articles).forEach(id => {
  sitemap += `\n  <url><loc>https://uskor-pc.ru/articles/${id}.html</loc></url>`;
});
sitemap += '\n</urlset>';
fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemap);
console.log('Sitemap создан');
