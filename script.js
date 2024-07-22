function changeLanguage(language) {
    localStorage.setItem('language', language);
    updateLanguage(language);
}

function updateLanguage(language) {
    if (!language) {
        language = localStorage.getItem('language') || 'en';
    }

    const articlesList = document.getElementById('articles-list');
    const sortOrder = document.getElementById('sort-order').value || 'desc';
    const categoryFilter = document.getElementById('category-filter').value || 'all';
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
                // Preencher seletor de categorias
                const categories = [...new Set(articles.map(article => article.category))];
                const categoryFilterElement = document.getElementById('category-filter');
                categoryFilterElement.innerHTML = '<option value="all">Todas</option>';
                categories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category;
                    option.textContent = category;
                    categoryFilterElement.appendChild(option);
                });

                // Filtrar e ordenar os artigos
                const filteredArticles = articles
                    .filter(article => categoryFilter === 'all' || article.category === categoryFilter)
                    .sort((a, b) => {
                        const dateA = new Date(a.date);
                        const dateB = new Date(b.date);

                        if (sortOrder === 'asc') {
                            return dateA - dateB;
                        } else {
                            return dateB - dateA;
                        }
                    });

                filteredArticles.forEach(article => {
                    const li = document.createElement('li');
                    const a = document.createElement('a');
                    a.href = `${language}/${article.url}`;
                    a.textContent = article.title;
                    li.appendChild(a);
                    articlesList.appendChild(li);
                });

                if (filteredArticles.length === 0) {
                    const li = document.createElement('li');
                    li.textContent = "Nenhum artigo encontrado.";
                    articlesList.appendChild(li);
                }
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
