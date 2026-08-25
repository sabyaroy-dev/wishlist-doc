(() => {
    const root = document.documentElement;
    const themeToggle = document.querySelector('.theme-toggle');
    const guide = document.querySelector('.dev-guide');
    let savedTheme = null;
    try { savedTheme = localStorage.getItem('developer-guide-theme'); } catch {}
    if (savedTheme === 'light' || savedTheme === 'dark') root.dataset.theme = savedTheme;

    const currentTheme = () => root.dataset.theme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const updateThemeButton = () => {
        if (!themeToggle) return;
        const dark = currentTheme() === 'dark';
        themeToggle.querySelector('span').textContent = dark ? '☀' : '☾';
        themeToggle.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`);
    };
    themeToggle?.addEventListener('click', () => {
        const nextTheme = currentTheme() === 'dark' ? 'light' : 'dark';
        root.dataset.theme = nextTheme;
        try { localStorage.setItem('developer-guide-theme', nextTheme); } catch {}
        updateThemeButton();
    });
    updateThemeButton();
    if (!guide) return;

    const descriptions = {
        'project-overview': 'Understand the application surfaces, runtimes, authentication boundaries, and core technology choices before changing the codebase.',
        'repository-layout': 'Use this directory map to find application routes, services, Prisma data, theme-extension code, workers, tests, and operational documentation.',
        'prerequisites': 'Install and verify the supported development tools, runtime versions, Shopify access, and platform accounts required by the project.',
        'first-time-setup': 'Clone the repository, configure environment values, install dependencies, prepare the database, and complete the initial application bootstrap.',
        'local-infrastructure': 'Run and inspect the local database, supporting containers, health checks, and the services the application expects during development.',
        'shopify-cli-and-app-configs': 'Choose the correct Shopify application configuration and use the CLI safely across local, staging, and production environments.',
        'local-development-tunnel': 'Expose the local application to Shopify through a stable HTTPS tunnel and keep callback and application URLs synchronized.',
        'database-and-prisma': 'Work with the Prisma schema, migrations, generated client, data inspection, and database recovery procedures.',
        'admin-app-development': 'Build authenticated embedded-admin routes and services while preserving Shopify session, navigation, and UI conventions.',
        'storefront-app-proxy-apis': 'Develop signed storefront endpoints with the correct proxy paths, request validation, response contracts, and customer context.',
        'storefront-ui-and-theme-app-extension': 'Build, preview, and validate wishlist storefront components delivered through the Shopify Theme App Extension.',
        'appearance-tokens-and-metafields': 'Manage merchant appearance settings, normalized design tokens, metafield persistence, and storefront style delivery.',
        'webhooks-and-privacy': 'Process Shopify lifecycle and privacy webhooks securely, idempotently, and within the required compliance boundaries.',
        'background-workers': 'Operate scheduled and asynchronous jobs, understand retry behavior, and diagnose worker or queue failures.',
        'app-pricing-and-partner-api-client-setup': 'Prepare the Partner API client and pricing configuration needed to test billing plans and Shopify App Pricing readiness.',
        'plan-gates-and-entitlements': 'Apply server-side plan gates consistently and keep feature availability aligned with billing entitlements and public claims.',
        'notifications-klaviyo-and-alerts': 'Configure notification providers, Klaviyo synchronization, product triggers, templates, limits, and delivery safeguards.',
        'analytics-and-exports': 'Understand analytics collection, retention, product and customer reporting, CSV generation, and scheduled exports.',
        'testing-commands': 'Choose the correct focused, integration, lint, build, and regression commands for the surface being changed.',
        'browser-e2e-and-storefront-qa': 'Validate real storefront behavior across themes, devices, customer states, app embeds, and browser-driven workflows.',
        'deployment-and-release': 'Prepare, verify, deploy, and monitor application and extension releases using the project release checklist.',
        'security-and-privacy-checklist': 'Review authentication, secrets, customer data, logging, webhook validation, and least-privilege requirements before release.',
        'common-troubleshooting': 'Diagnose frequent setup, tunnel, database, Shopify CLI, storefront, worker, and test failures using known recovery paths.',
        'ai-agent-development-rules': 'Follow repository-specific boundaries for AI-assisted development, verification, documentation, and safe implementation.',
        'developer-workflow-checklist': 'Use the final end-to-end checklist to scope work, implement safely, run evidence-based verification, and document results.'
    };

    const sourceNodes = [...guide.children];
    const pages = [];
    const overview = document.createElement('section');
    overview.className = 'dev-page dev-home';
    overview.id = 'guide-overview';
    overview.setAttribute('aria-labelledby', 'lonigma-wishlist-developer-guide');
    pages.push(overview);
    let currentPage = overview;

    sourceNodes.forEach((node) => {
        if (node.matches('h2[id]')) {
            const id = node.id;
            currentPage = document.createElement('section');
            currentPage.className = 'dev-page';
            currentPage.id = id;
            currentPage.setAttribute('aria-labelledby', `${id}-title`);
            node.id = `${id}-title`;
            currentPage.append(node);
            const summary = document.createElement('p');
            summary.className = 'section-summary';
            summary.textContent = descriptions[id] || 'Technical guidance, implementation details, and verification steps for this part of the application.';
            currentPage.append(summary);
            pages.push(currentPage);
        } else {
            currentPage.append(node);
        }
    });
    guide.replaceChildren(...pages);

    document.querySelectorAll('.dev-sidebar, .dev-mobile-nav nav').forEach((nav) => {
        const link = document.createElement('a');
        link.href = '#guide-overview';
        link.textContent = 'Guide Overview';
        nav.prepend(link);
    });

    const links = [...document.querySelectorAll('.dev-sidebar a[href^="#"], .dev-mobile-nav a[href^="#"]')];
    const pageById = new Map(pages.map((page) => [page.id, page]));
    const showPage = (requestedId) => {
        const id = pageById.has(requestedId) ? requestedId : 'guide-overview';
        pages.forEach((page) => page.classList.toggle('is-active', page.id === id));
        links.forEach((link) => {
            const active = link.hash === `#${id}`;
            link.classList.toggle('is-active', active);
            if (active) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
        });
        document.querySelector('.dev-mobile-nav')?.removeAttribute('open');
        document.title = id === 'guide-overview' ? 'Lonigma Wishlist Developer Guide' : `${pageById.get(id).querySelector('h2')?.textContent || 'Developer Guide'} | Lonigma Wishlist`;
        window.scrollTo(0, 0);
    };

    document.addEventListener('click', (event) => {
        const link = event.target.closest('a[href^="#"]');
        if (!link || !pageById.has(link.hash.slice(1))) return;
        event.preventDefault();
        const id = link.hash.slice(1);
        history.pushState(null, '', `#${id}`);
        showPage(id);
    });
    window.addEventListener('hashchange', () => showPage(location.hash.slice(1)));
    window.addEventListener('popstate', () => showPage(location.hash.slice(1)));
    showPage(location.hash.slice(1));

    document.querySelectorAll('.dev-guide pre').forEach((pre) => {
        const code = pre.querySelector('code');
        if (!code || pre.closest('.code-frame')) return;
        const languageClass = [...code.classList].find((name) => name.startsWith('language-'));
        const language = languageClass ? languageClass.replace('language-', '') : 'code';
        const frame = document.createElement('div');
        const toolbar = document.createElement('div');
        const label = document.createElement('span');
        const button = document.createElement('button');
        frame.className = 'code-frame'; toolbar.className = 'code-toolbar'; label.className = 'code-language';
        label.textContent = language; button.className = 'code-copy'; button.type = 'button'; button.textContent = 'Copy';
        button.setAttribute('aria-label', `Copy ${language} code`);
        pre.before(frame); frame.append(toolbar, pre); toolbar.append(label, button);
        button.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(code.textContent);
                button.textContent = 'Copied'; button.classList.add('is-copied');
                window.setTimeout(() => { button.textContent = 'Copy'; button.classList.remove('is-copied'); }, 1600);
            } catch {
                button.textContent = 'Select';
                const selection = window.getSelection(); const range = document.createRange();
                range.selectNodeContents(code); selection.removeAllRanges(); selection.addRange(range);
            }
        });
    });
})();
