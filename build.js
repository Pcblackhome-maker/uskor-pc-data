const fs = require('fs');
const path = require('path');

// Загружаем контент из JSON
const data = JSON.parse(fs.readFileSync('./article/articles.json', 'utf8'));

// Функция для создания полного HTML одной статьи
function renderArticlePage(id, article, data) {
  // Здесь мы копируем стили и шапку из твоего index.html
  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${article.title} | Ускорь ПК</title>
  <meta name="description" content="${article.intro || 'Подробное руководство по ускорению компьютера.'}">
  <style>
    /* ВСТАВЬ СЮДА ВСЕ СТИЛИ ИЗ ТВОЕГО index.html (оставь как есть, без изменений) */
    ${fs.readFileSync('./style.css', 'utf8')} /* Лучше вынести стили в отдельный файл style.css */
  </style>
  <!-- Код Яндекс.Метрики (полный, без ограничений) -->
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
    <article class="content-box" style="display:block;">
      <h2>${article.title}</h2>
      ${article.intro ? `<p>${article.intro}</p>` : ''}
      ${article.steps ? article.steps.map(step => `
        <div class="accordion-item">
          <div class="accordion-header active" onclick="this.classList.toggle('active'); this.nextElementSibling.classList.toggle('open')">${step.strong}</div>
          <div class="accordion-body open">${step.text.replace(/\n/g, '<br>')}</div>
        </div>
      `).join('') : ''}
      ${article.faq ? `<div class="faq-section"><h3>❓ Часто задаваемые вопросы</h3>` + article.faq.map(item => `
        <div class="faq-item">
          <div class="faq-question">${item.q}</div>
          <div class="faq-answer">${item.a}</div>
        </div>
      `).join('') + `</div>` : ''}
      <!-- Сюда же можно добавить таблицы, кнопки доната, партнерские ссылки – оставлю тебе доработать по аналогии -->
    </article>
    <div class="site-footer">
      © 2026 <span>Ускорь ПК</span> · <a href="/privacy">Политика конфиденциальности</a>
    </div>
  </div>
  <script>
    // Скрипт для progress bar и аккордеонов (можно вынести в отдельный файл)
    window.addEventListener('scroll', () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      document.getElementById('readingProgress').style.width = (winScroll / height) * 100 + '%';
    });
    document.querySelectorAll('.faq-question').forEach(q => q.addEventListener('click', function() {
      this.parentElement.classList.toggle('open');
    }));
  </script>
</body>
</html>`;
}

// Создаём папку для статей, если её нет
if (!fs.existsSync('./articles')) {
  fs.mkdirSync('./articles');
}

// Генерируем страницы для каждой статьи из JSON
Object.keys(data.articles).forEach(articleId => {
  const article = data.articles[articleId];
  const html = renderArticlePage(articleId, article, data);
  fs.writeFileSync(path.join('./articles', `${articleId}.html`), html);
  console.log(`Создана страница: /articles/${articleId}.html`);
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
fs.writeFileSync('./sitemap.xml', sitemap);
console.log('Sitemap создан');
