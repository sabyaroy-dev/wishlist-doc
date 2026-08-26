(() => {
    const root = document.documentElement;
    const themeToggle = document.querySelector('.theme-toggle');
    const guide = document.querySelector('.dev-guide');
    const mobileNav = document.querySelector('.dev-mobile-nav');
    const sidebar = document.querySelector('.dev-sidebar');
    const menuToggle = document.querySelector('.dev-menu-toggle');
    const menuClose = document.querySelector('.dev-sidebar-close');
    const menuBackdrop = document.querySelector('.dev-sidebar-backdrop');
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

    const closeNavigation = () => {
        document.body.classList.remove('dev-nav-open');
        menuToggle?.setAttribute('aria-expanded', 'false');
    };
    menuToggle?.addEventListener('click', () => {
        document.body.classList.add('dev-nav-open');
        menuToggle.setAttribute('aria-expanded', 'true');
        menuClose?.focus();
    });
    menuClose?.addEventListener('click', closeNavigation);
    menuBackdrop?.addEventListener('click', closeNavigation);
    sidebar?.addEventListener('click', (event) => {
        if (event.target.closest('a[href^="#"]')) closeNavigation();
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && document.body.classList.contains('dev-nav-open')) {
            closeNavigation();
            menuToggle?.focus();
        }
    });
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1000) closeNavigation();
    });

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

    const sectionDetails = {
        'project-overview': ['How the admin app, storefront runtime, theme extension, workers, and data layer fit together.', 'Which authentication model protects each application surface.', 'The architectural boundaries developers must preserve when adding features.'],
        'repository-layout': ['Where routes, services, database code, extensions, tests, scripts, and documentation live.', 'Which directories are generated and which should be edited directly.', 'How to locate the smallest responsible module before starting a change.'],
        'prerequisites': ['Required Node, Yarn, Docker, Shopify CLI, database, and operating-system tooling.', 'Access needed for Shopify development stores and external providers.', 'Version and environment checks that prevent inconsistent local builds.'],
        'first-time-setup': ['Repository cloning, dependency installation, and environment-file preparation.', 'Database creation, migration, seed, and generated-client steps.', 'The first verification commands to confirm the application is ready.'],
        'local-infrastructure': ['How the local database and supporting services are started and stopped.', 'Health checks, ports, container state, and persistent development data.', 'Safe reset and recovery steps when local services become inconsistent.'],
        'shopify-cli-and-app-configs': ['The purpose of each Shopify app configuration file.', 'How to select the correct development or production application context.', 'Commands and safeguards for keeping URLs, scopes, and redirect settings aligned.'],
        'local-development-tunnel': ['Why Shopify requires a public HTTPS endpoint during local development.', 'How tunnel URLs connect to app, callback, webhook, and proxy configuration.', 'Common tunnel failures and the checks needed after a URL changes.'],
        'database-and-prisma': ['Schema ownership, Prisma client generation, and migration workflow.', 'How to inspect data without bypassing application rules.', 'Recovery procedures and compatibility expectations for persisted merchant data.'],
        'admin-app-development': ['Authenticated route loaders, actions, services, and embedded-admin navigation.', 'How Shopify session context and merchant identity flow through requests.', 'UI, validation, error handling, and test expectations for admin features.'],
        'storefront-app-proxy-apis': ['Signed proxy request validation and shop/customer context.', 'Stable endpoint paths, request payloads, status codes, and response contracts.', 'Security and backward-compatibility rules for storefront consumers.'],
        'storefront-ui-and-theme-app-extension': ['Theme blocks, app embeds, storefront assets, and runtime responsibilities.', 'How wishlist controls initialize across product, collection, cart, and shared-list surfaces.', 'Build, preview, theme compatibility, accessibility, and browser QA requirements.'],
        'appearance-tokens-and-metafields': ['How merchant settings become normalized storefront design tokens.', 'Metafield namespaces, persistence behavior, defaults, and compatibility handling.', 'Safe CSS-variable and icon customization without leaking styles into the theme.'],
        'webhooks-and-privacy': ['Webhook authenticity, idempotency, retries, and event ordering.', 'Application uninstall and Shopify privacy-request processing.', 'Data minimization, deletion, logging, and operational evidence requirements.'],
        'background-workers': ['Worker entry points, schedules, queues, and job ownership.', 'Retry, idempotency, locking, batching, and failure-isolation behavior.', 'How to run jobs locally and investigate failed or delayed processing.'],
        'app-pricing-and-partner-api-client-setup': ['Partner API client creation and the credentials required for pricing work.', 'How Shopify-hosted plan configuration maps to application plan identifiers.', 'Readiness checks and evidence needed before billing tests or release.'],
        'plan-gates-and-entitlements': ['Where plan capabilities are defined and resolved for a shop.', 'Why server-side enforcement is required even when controls are hidden in the UI.', 'How to test upgrades, downgrades, limits, trials, and public pricing claims.'],
        'notifications-klaviyo-and-alerts': ['Provider credentials, templates, triggers, quiet hours, and sending limits.', 'Klaviyo metrics, profile properties, revenue-automation events, and replay operations.', 'Consent, deduplication, failure handling, and delivery-testing expectations.'],
        'analytics-and-exports': ['Event collection, aggregation, retention, and reporting boundaries.', 'Product performance, customer activity, conversion, revenue, and alert attribution.', 'Manual CSV, scheduled S3 delivery, privacy controls, and export verification.'],
        'testing-commands': ['Which focused tests to run for services, routes, database changes, and storefront code.', 'When lint, type checks, production builds, and broader regression suites are required.', 'How to interpret failures and record meaningful verification evidence.'],
        'browser-e2e-and-storefront-qa': ['Storefront scenarios covering guests, customers, devices, themes, and display modes.', 'Theme-editor setup, app-embed validation, proxy behavior, and interaction checks.', 'Evidence capture and release-signoff expectations for browser testing.'],
        'deployment-and-release': ['Pre-release checks for code, database, app configuration, extensions, and workers.', 'Deployment ordering, migration safety, smoke tests, and rollback preparation.', 'Post-release monitoring and documentation required for a defensible release.'],
        'security-and-privacy-checklist': ['Authentication and authorization checks for admin, proxy, webhook, and worker surfaces.', 'Secrets, logs, customer identifiers, provider credentials, and least-privilege access.', 'Privacy deletion, retention, incident prevention, and release-review requirements.'],
        'common-troubleshooting': ['Symptoms and causes for setup, build, tunnel, CLI, database, and authentication failures.', 'Storefront, theme-extension, provider, analytics, and background-job diagnostics.', 'A repeatable process for isolating configuration problems from code defects.'],
        'ai-agent-development-rules': ['Repository policies and instruction sources that AI coding agents must read first.', 'Scope, compatibility, safety, testing, and documentation boundaries for generated changes.', 'How agents should report verification, assumptions, deferred work, and known limits.'],
        'developer-workflow-checklist': ['How to understand the affected surface and confirm compatibility requirements.', 'The expected implementation, focused testing, build, browser QA, and documentation sequence.', 'What must be included in the final change summary before work is considered complete.']
    };

    const sectionVisuals = {
        'first-time-setup': {
            src: 'assets/images/shopify-app-install.png',
            alt: 'Shopify App Store add-app screen and Shopify Admin installation approval screen for Lonigma Wishlist',
            caption: 'After configuring the development app, install it on the selected Shopify development store and review the requested access before approval.'
        },
        'admin-app-development': {
            src: 'assets/images/install-navigation.png',
            alt: 'Lonigma Wishlist embedded application navigation inside Shopify Admin',
            caption: 'The embedded admin application runs inside Shopify Admin and exposes merchant workflows through the application navigation shown here.'
        },
        'storefront-ui-and-theme-app-extension': {
            src: 'assets/images/wishlist-app-embeds-v2.png',
            alt: 'Shopify theme editor showing the Lonigma Wishlist Appearance and Floating app embeds',
            caption: 'Theme app embeds provide the storefront runtime entry points for wishlist appearance and the floating launcher.'
        },
        'appearance-tokens-and-metafields': {
            src: 'assets/images/brand-visual-style.png',
            alt: 'Lonigma Wishlist visual style and branding controls',
            caption: 'Merchant-facing visual controls are normalized into appearance tokens before they are delivered to the storefront.'
        },
        'app-pricing-and-partner-api-client-setup': {
            src: 'assets/images/plans-shopify-selection.png',
            alt: 'Shopify-hosted Lonigma Wishlist plan selection interface',
            caption: 'The application plan identifiers and entitlement rules must remain aligned with Shopify-hosted plan configuration.'
        },
        'notifications-klaviyo-and-alerts': {
            src: 'assets/images/klaviyo-connection.png',
            alt: 'Lonigma Wishlist Klaviyo connection and event configuration',
            caption: 'Klaviyo connection settings control synchronization while enabled events create metrics on shopper profiles.',
            compact: true
        },
        'analytics-and-exports': {
            src: 'assets/images/analytics-engagement-saves.png',
            alt: 'Lonigma Wishlist engagement and saves analytics dashboard',
            caption: 'Analytics aggregates wishlist engagement by owner, addition, value, storefront surface, and conversion behavior.'
        },
        'browser-e2e-and-storefront-qa': {
            src: 'assets/images/display-side-drawer.png',
            alt: 'Wishlist side drawer open on a Shopify storefront product grid',
            caption: 'Browser QA should validate the complete shopper experience, including overlays, product actions, responsive layout, and background-page state.'
        }
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
            const summary = document.createElement('div');
            const summaryText = document.createElement('p');
            const detailsTitle = document.createElement('strong');
            const detailsList = document.createElement('ul');
            summary.className = 'section-summary';
            summaryText.textContent = descriptions[id] || 'Technical guidance, implementation details, and verification steps for this part of the application.';
            detailsTitle.textContent = 'What this section covers';
            (sectionDetails[id] || []).forEach((detail) => {
                const item = document.createElement('li');
                item.textContent = detail;
                detailsList.append(item);
            });
            summary.append(summaryText, detailsTitle, detailsList);
            currentPage.append(summary);

            const visual = sectionVisuals[id];
            if (visual) {
                const figure = document.createElement('figure');
                const image = document.createElement('img');
                const caption = document.createElement('figcaption');
                figure.className = `section-visual${visual.compact ? ' is-compact' : ''}`;
                image.src = visual.src;
                image.alt = visual.alt;
                image.loading = 'lazy';
                image.decoding = 'async';
                caption.textContent = visual.caption;
                figure.append(image, caption);
                currentPage.append(figure);
            }
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

    const pageTitle = (page) => page.classList.contains('dev-home')
        ? 'Guide Overview'
        : page.querySelector('h2')?.textContent.replace(/^\d+\.\s*/, '') || 'Developer Guide';

    pages.forEach((page, index) => {
        const pager = document.createElement('nav');
        pager.className = 'section-pager';
        pager.setAttribute('aria-label', 'Section navigation');

        const makePagerItem = (target, direction) => {
            if (!target) {
                const empty = document.createElement('span');
                empty.className = `pager-link pager-${direction} is-disabled`;
                empty.setAttribute('aria-hidden', 'true');
                return empty;
            }

            const link = document.createElement('a');
            const label = document.createElement('small');
            const title = document.createElement('strong');
            link.className = `pager-link pager-${direction}`;
            link.href = `#${target.id}`;
            label.textContent = direction === 'previous' ? '← Previous section' : 'Next section →';
            title.textContent = pageTitle(target);
            link.append(label, title);
            return link;
        };

        pager.append(
            makePagerItem(pages[index - 1], 'previous'),
            makePagerItem(pages[index + 1], 'next')
        );
        page.append(pager);
    });

    const showPage = (requestedId) => {
        const id = pageById.has(requestedId) ? requestedId : 'guide-overview';
        pages.forEach((page) => page.classList.toggle('is-active', page.id === id));
        links.forEach((link) => {
            const active = link.hash === `#${id}`;
            link.classList.toggle('is-active', active);
            if (active) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
        });
        mobileNav?.removeAttribute('open');
        closeNavigation();
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
