(() => {
    const sectionLinks = [...document.querySelectorAll(
        '.dev-sidebar a[href^="#"], .dev-mobile-nav a[href^="#"]'
    )];
    const sections = [...document.querySelectorAll('.dev-guide h2[id]')];

    if (!sectionLinks.length || !sections.length) return;

    const setActiveSection = (id) => {
        sectionLinks.forEach((link) => {
            const isActive = link.hash === `#${id}`;
            link.classList.toggle('is-active', isActive);

            if (isActive) {
                link.setAttribute('aria-current', 'location');
            } else {
                link.removeAttribute('aria-current');
            }
        });

        const desktopLink = document.querySelector(`.dev-sidebar a[href="#${CSS.escape(id)}"]`);
        desktopLink?.scrollIntoView({ block: 'nearest' });
    };

    const updateActiveSection = () => {
        const headerOffset = 130;
        let current = sections[0];

        for (const section of sections) {
            if (section.getBoundingClientRect().top <= headerOffset) {
                current = section;
            } else {
                break;
            }
        }

        setActiveSection(current.id);
    };

    sectionLinks.forEach((link) => {
        link.addEventListener('click', () => {
            setActiveSection(link.hash.slice(1));

            const mobileMenu = link.closest('.dev-mobile-nav');
            if (mobileMenu) mobileMenu.open = false;
        });
    });

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(() => {
            updateActiveSection();
            ticking = false;
        });
    }, { passive: true });

    updateActiveSection();

    document.querySelectorAll('.dev-guide pre').forEach((pre) => {
        const code = pre.querySelector('code');
        if (!code || pre.closest('.code-frame')) return;

        const languageClass = [...code.classList].find((name) => name.startsWith('language-'));
        const language = languageClass ? languageClass.replace('language-', '') : 'code';
        const frame = document.createElement('div');
        const toolbar = document.createElement('div');
        const label = document.createElement('span');
        const copyButton = document.createElement('button');

        frame.className = 'code-frame';
        toolbar.className = 'code-toolbar';
        label.className = 'code-language';
        label.textContent = language;
        copyButton.className = 'code-copy';
        copyButton.type = 'button';
        copyButton.textContent = 'Copy';
        copyButton.setAttribute('aria-label', `Copy ${language} code`);

        pre.before(frame);
        frame.append(toolbar, pre);
        toolbar.append(label, copyButton);

        copyButton.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(code.textContent);
                copyButton.textContent = 'Copied';
                copyButton.classList.add('is-copied');
                window.setTimeout(() => {
                    copyButton.textContent = 'Copy';
                    copyButton.classList.remove('is-copied');
                }, 1600);
            } catch {
                copyButton.textContent = 'Select';
                const selection = window.getSelection();
                const range = document.createRange();
                range.selectNodeContents(code);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        });
    });
})();
