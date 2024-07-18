function changeLanguage(language) {
    localStorage.setItem('language', language);
    updateLanguage(language);
}

function updateLanguage(language) {
    if (!language) {
        language = localStorage.getItem('language') || 'en';
    }

    const articlesList = document.getElementById('articles-list');
    articlesList.innerHTML = '';

    fetch(`${language}/index.json`) // Carrega o arquivo index.json do idioma selecionado
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar os artigos.');
            }
            return response.json();
        })
        .then(articles => {
            if (articles && articles.length > 0) {
                articles.forEach(article => {
                    const li = document.createElement('li');
                    const a = document.createElement('a');
                    a.href = `${language}/${article.url}`;
                    a.textContent = article.title;
                    li.appendChild(a);
                    articlesList.appendChild(li);
                });
            } else {
                const li = document.createElement('li');
                li.textContent = "Nenhum artigo encontrado.";
                articlesList.appendChild(li);
            }
        })
        .catch(error => {
            console.error('Erro ao carregar artigos:', error);
            const li = document.createElement('li');
            li.textContent = "Erro ao carregar os artigos.";
            articlesList.appendChild(li);
        });
}

document.addEventListener('DOMContentLoaded', () => {
    updateLanguage();
});
