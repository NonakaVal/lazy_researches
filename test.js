const translations = {
    en: {
        introductionTitle: "Personal AI Research Repository",
        introductionText: "Site created in 10 minutes to publish the results of some research I did using <a href=\"https://github.com/NonakaVal/lazy_research\">lazy research</a>.",
        sortOrderLabel: "Sort by date:",
        sortOptions: {
            desc: "Newest first",
            asc: "Oldest first"
        },
        categoryFilterLabel: "Filter by category:",
        clearFiltersButton: "Clear Filters",
        allCategories: "All",
        noArticlesFound: "No articles found."
    },
    pt: {
        introductionTitle: "Repositório pessoal de pesquisas com IA",
        introductionText: "Site criado em 10 minutos para publicar os resultados de algumas pesquisas que fiz usando <a href=\"https://github.com/NonakaVal/lazy_research\">lazy research</a>.",
        sortOrderLabel: "Ordenar por data:",
        sortOptions: {
            desc: "Mais recentes primeiro",
            asc: "Mais antigos primeiro"
        },
        categoryFilterLabel: "Filtrar por categoria:",
        clearFiltersButton: "Limpar Filtros",
        allCategories: "Todas",
        noArticlesFound: "Nenhum artigo encontrado."
    }
};

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

    fetch(`${language}/index.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar os artigos.');
            }
            return response.json();
        })
        .then(articles => {
            if (articles && articles.length > 0) {
                // Atualizar conteúdo da introdução
                const introductionTitle = document.querySelector('#introduction h1');
                const introductionText = document.querySelector('#introduction p');
                
                if (translations[language]) {
                    introductionTitle.textContent = translations[language].introductionTitle;
                    introductionText.innerHTML = translations[language].introductionText;

                    // Atualizar labels e botão dos filtros
                    document.querySelector('#filters label[for="sort-order"]').textContent = translations[language].sortOrderLabel;
                    document.querySelector('#filters label[for="category-filter"]').textContent = translations[language].categoryFilterLabel;
                    document.getElementById('clear-filters').textContent = translations[language].clearFiltersButton;

                    // Atualizar opções de ordenação
                    const sortOrderElement = document.getElementById('sort-order');
                    sortOrderElement.innerHTML = `
                        <option value="desc">${translations[language].sortOptions.desc}</option>
                        <option value="asc">${translations[language].sortOptions.asc}</option>
                    `;
                }

                // Preencher seletor de categorias
                const categories = [...new Set(articles.map(article => article.category))];
                const categoryFilterElement = document.getElementById('category-filter');
                categoryFilterElement.innerHTML = `<option value="all">${translations[language].allCategories}</option>`;
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
                    li.textContent = translations[language].noArticlesFound;
                    articlesList.appendChild(li);
                }
            } else {
                const li = document.createElement('li');
                li.textContent = translations[language].noArticlesFound;
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

function clearFilters() {
    document.getElementById('sort-order').value = 'desc';
    document.getElementById('category-filter').value = 'all';
    updateLanguage(localStorage.getItem('language') || 'en');
}

document.addEventListener('DOMContentLoaded', () => {
    updateLanguage(localStorage.getItem('language') || 'en');
});
