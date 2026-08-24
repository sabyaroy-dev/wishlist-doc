(() => {
    const input = document.querySelector('.search input[type="search"]');
    const resultsBox = document.querySelector('#search-results');

    if (!input || !resultsBox) return;

    const pages = [...document.querySelectorAll('article.guide[id]')].map((article) => {
        const title = article.querySelector('h1')?.textContent.trim() || article.id;
        const headings = [...article.querySelectorAll('h2, h3')]
            .map((heading) => heading.textContent.trim())
            .join(' · ');
        const text = article.textContent.replace(/\s+/g, ' ').trim();

        return {
            id: article.id,
            title,
            headings,
            text,
            searchable: `${title} ${headings} ${text}`.toLowerCase()
        };
    });

    let matches = [];
    let activeIndex = -1;

    const closeResults = () => {
        resultsBox.hidden = true;
        resultsBox.replaceChildren();
        input.setAttribute('aria-expanded', 'false');
        input.removeAttribute('aria-activedescendant');
        activeIndex = -1;
    };

    const excerptFor = (page, terms) => {
        const lowerText = page.text.toLowerCase();
        const firstIndex = terms.reduce((best, term) => {
            const index = lowerText.indexOf(term);
            if (index < 0) return best;
            return best < 0 ? index : Math.min(best, index);
        }, -1);
        const start = Math.max(0, firstIndex - 55);
        const excerpt = page.text.slice(start, start + 150);
        return `${start > 0 ? '…' : ''}${excerpt}${start + 150 < page.text.length ? '…' : ''}`;
    };

    const updateActiveResult = (nextIndex) => {
        const links = [...resultsBox.querySelectorAll('.search-result')];
        links.forEach((link) => link.classList.remove('is-active'));
        activeIndex = nextIndex;

        if (activeIndex >= 0 && links[activeIndex]) {
            const active = links[activeIndex];
            active.classList.add('is-active');
            active.scrollIntoView({ block: 'nearest' });
            input.setAttribute('aria-activedescendant', active.id);
        } else {
            input.removeAttribute('aria-activedescendant');
        }
    };

    const openResult = (page) => {
        window.location.hash = page.id;
        input.value = '';
        document.body.classList.remove('search-open');
        document.querySelector('.search-toggle')?.setAttribute('aria-expanded', 'false');
        closeResults();
        document.querySelector(`#${CSS.escape(page.id)} h1`)?.focus?.();
    };

    const renderResults = () => {
        const query = input.value.trim().toLowerCase();
        const terms = query.split(/\s+/).filter(Boolean);

        if (!terms.length) {
            closeResults();
            return;
        }

        matches = pages
            .filter((page) => terms.every((term) => page.searchable.includes(term)))
            .map((page) => ({
                ...page,
                score: terms.reduce((score, term) => {
                    if (page.title.toLowerCase().includes(term)) return score + 5;
                    if (page.headings.toLowerCase().includes(term)) return score + 3;
                    return score + 1;
                }, 0)
            }))
            .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
            .slice(0, 8);

        resultsBox.replaceChildren();
        resultsBox.hidden = false;
        input.setAttribute('aria-expanded', 'true');
        activeIndex = -1;

        if (!matches.length) {
            const empty = document.createElement('div');
            empty.className = 'search-empty';
            empty.textContent = 'No documentation pages found.';
            resultsBox.append(empty);
            return;
        }

        matches.forEach((page, index) => {
            const link = document.createElement('a');
            link.className = 'search-result';
            link.id = `search-result-${index}`;
            link.href = `#${page.id}`;
            link.setAttribute('role', 'option');

            const title = document.createElement('strong');
            title.textContent = page.title;
            const excerpt = document.createElement('small');
            excerpt.textContent = excerptFor(page, terms);
            link.append(title, excerpt);
            link.addEventListener('click', (event) => {
                event.preventDefault();
                openResult(page);
            });
            resultsBox.append(link);
        });
    };

    input.setAttribute('aria-controls', 'search-results');
    input.setAttribute('aria-expanded', 'false');
    input.setAttribute('autocomplete', 'off');
    input.addEventListener('input', renderResults);
    input.addEventListener('focus', () => {
        if (input.value.trim()) renderResults();
    });
    input.addEventListener('keydown', (event) => {
        if (resultsBox.hidden && event.key !== 'Escape') return;

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            updateActiveResult(Math.min(activeIndex + 1, matches.length - 1));
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            updateActiveResult(Math.max(activeIndex - 1, 0));
        } else if (event.key === 'Enter' && matches.length) {
            event.preventDefault();
            openResult(matches[activeIndex >= 0 ? activeIndex : 0]);
        } else if (event.key === 'Escape') {
            closeResults();
        }
    });

    document.addEventListener('keydown', (event) => {
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
            event.preventDefault();
            document.body.classList.add('search-open');
            document.querySelector('.search-toggle')?.setAttribute('aria-expanded', 'true');
            input.focus();
            input.select();
        }
    });

    document.addEventListener('click', (event) => {
        if (!event.target.closest('.search')) closeResults();
    });
})();

(() => {
    const body = document.body;
    const sidebar = document.querySelector('#documentation-sidebar');
    const openButton = document.querySelector('.menu-toggle');
    const closeButton = document.querySelector('.sidebar-close');
    const backdrop = document.querySelector('.sidebar-backdrop');

    if (!sidebar || !openButton || !closeButton || !backdrop) return;

    const openMenu = () => {
        body.classList.remove('search-open');
        document.querySelector('.search-toggle')?.setAttribute('aria-expanded', 'false');
        body.classList.add('nav-open');
        openButton.setAttribute('aria-expanded', 'true');
        closeButton.focus();
    };

    const closeMenu = ({ restoreFocus = true } = {}) => {
        body.classList.remove('nav-open');
        openButton.setAttribute('aria-expanded', 'false');
        if (restoreFocus) openButton.focus();
    };

    openButton.addEventListener('click', openMenu);
    closeButton.addEventListener('click', () => closeMenu());
    backdrop.addEventListener('click', () => closeMenu());

    sidebar.addEventListener('click', (event) => {
        if (event.target.closest('a[href^="#"]')) {
            closeMenu({ restoreFocus: false });
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && body.classList.contains('nav-open')) {
            closeMenu();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 760 && body.classList.contains('nav-open')) {
            closeMenu({ restoreFocus: false });
        }
    });
})();

(() => {
    const body = document.body;
    const toggle = document.querySelector('.search-toggle');
    const input = document.querySelector('.search input[type="search"]');

    if (!toggle || !input) return;

    const closeSearch = () => {
        body.classList.remove('search-open');
        toggle.setAttribute('aria-expanded', 'false');
        input.value = '';
        input.dispatchEvent(new Event('input'));
    };

    toggle.addEventListener('click', () => {
        const willOpen = !body.classList.contains('search-open');
        body.classList.toggle('search-open', willOpen);
        toggle.setAttribute('aria-expanded', String(willOpen));

        if (willOpen) {
            body.classList.remove('nav-open');
            document.querySelector('.menu-toggle')?.setAttribute('aria-expanded', 'false');
            requestAnimationFrame(() => input.focus());
        } else {
            closeSearch();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && body.classList.contains('search-open')) {
            closeSearch();
            toggle.focus();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 760 && body.classList.contains('search-open')) {
            closeSearch();
        }
    });
})();
