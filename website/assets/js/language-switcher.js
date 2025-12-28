(function() {
    'use strict';

    const translations = {
        en: {
            features: 'Features',
            install: 'Install',
            docs: 'Docs',
            examples: 'Examples',
            community: 'Community',
            getStarted: 'Get Started',
            heroDescription: 'A programming language using Flemish dialect keywords that compiles to Python. Write in West-Vlaams, Antwerps, Limburgs, and more - then execute seamlessly!',
            dialects: 'Dialects',
            commands: 'Commands',
            free: 'Free',
            whyVlaamsCodex: 'Why Vlaams Codex?',
            whyVlaamsCodexSubtitle: 'Experience programming in your native Flemish dialect with powerful features',
            multiVlaamsDialects: 'Multi-Vlaams Dialects',
            multiVlaamsDescription: 'Write code in 7 Flemish dialects with 80+ command aliases. West-Vlaams, Antwerps, Limburgs, Brussels, Genks, and more!',
            exploreDialects: 'Explore Dialects →',
            magicMode: 'Magic Mode',
            magicModeDescription: 'Run .plats files directly with Python using custom encoding. No compilation step needed - it just works!',
            learnHow: 'Learn How →',
            interactiveRepl: 'Interactive REPL',
            interactiveReplDescription: 'Try Platskript in real-time with interactive REPL. Test your code instantly with live feedback.',
            startRepl: 'Start REPL →',
            pythonIntegration: 'Python Integration',
            pythonIntegrationDescription: 'Seamless transpilation to Python. Use any Python library and framework with Platskript syntax.',
            viewSpec: 'View Spec →',
            vscodeExtension: 'VS Code Extension',
            vscodeExtensionDescription: 'Full syntax highlighting, IntelliSense, and code snippets for best development experience.',
            installExtension: 'Install Extension →',
            easyInstallation: 'Easy Installation',
            easyInstallationDescription: 'One-line installation with pip. Supports pipx for isolated environments and development mode for contributors.',
            installNow: 'Install Now →',
            quickStart: 'Quick Start',
            quickStartSubtitle: 'Get started with Vlaams Codex in seconds',
            install: 'Install',
            runFirstProgram: 'Run Your First Program',
            orUseMagicMode: 'Or Use Magic Mode',
            installationOptions: 'Installation Options',
            recommended: 'Recommended',
            perfectForEndUsers: 'Perfect for end users. Keeps dependencies isolated.',
            standardInstallation: 'Standard installation. Works with existing Python setup.',
            forContributors: 'For contributors. Includes test suite and development tools.',
            multiVlaamsCommands: 'Multi-Vlaams Dialect Commands',
            multiVlaamsSubtitle: 'Every command works in 7 Flemish dialects! Use whichever feels most natural.',
            viewAllDialects: 'View All Dialects →',
            exploreExamples: 'Explore Examples',
            exploreExamplesSubtitle: 'Learn by doing with ready-to-run examples',
            viewAllExamples: 'View All Examples →',
            joinCommunity: 'Join Community',
            joinCommunitySubtitle: 'Connect with other Vlaams Codex developers',
            github: 'Star\'s repository, report issues, and contribute code',
            issueTracker: 'Report bugs, request features, and discuss improvements',
            contributing: 'Submit pull requests and help improve Vlaams Codex',
            documentation: 'Documentation',
            resources: 'Resources',
            community: 'Community'
        },
        vl: {
            features: 'Features',
            install: 'Installeer',
            docs: 'Docs',
            examples: 'Voorbeelden',
            community: 'Gemeenschap',
            getStarted: 'Start Nu',
            heroDescription: "'n Programmeertaal me Vlaamse dialek sleutelwoorden die compileert na Python. Schrijf in West-Vlaams, Antwerps, Limburgs, en meer - en voer 't uut!",
            dialects: 'Dialekten',
            commands: 'Commando\'s',
            free: 'Gratis',
            whyVlaamsCodex: 'Waarom Vlaams Codex?',
            whyVlaamsCodexSubtitle: 'Ervar het programmeren in uw eigen Vlaamse dialek me krachtige features',
            multiVlaamsDialects: 'Multi-Vlaams Dialekten',
            multiVlaamsDescription: 'Schrijf code in 7 Vlaamse dialekten met 80+ commando-aliassen. West-Vlaams, Antwerps, Limburgs, Brussels, Genks, en meer!',
            exploreDialects: 'Verken Dialekten →',
            magicMode: 'Magic Mode',
            magicModeDescription: 'Voer .plats bestanden direct uut me Python via custom encoding. Geen compilatie nodig - het werkt gewoon!',
            learnHow: 'Leer Hoe →',
            interactiveRepl: 'Interactieve REPL',
            interactiveReplDescription: 'Probeer Platskript in real-tijd me interactieve REPL. Test uw code direct me live feedback.',
            startRepl: 'Start REPL →',
            pythonIntegration: 'Python Integratie',
            pythonIntegrationDescription: 'Naadloze transpilatie na Python. Gebruik elke Python bibliotheek en framework me Platskript syntax.',
            viewSpec: 'Bekijk Spec →',
            vscodeExtension: 'VS Code Uitbreiding',
            vscodeExtensionDescription: 'Volledige syntax highlighting, IntelliSense, en code snippets voor de beste ontwikkelaarservaring.',
            installExtension: 'Installeer Uitbreiding →',
            easyInstallation: 'Makkelijke Installatie',
            easyInstallationDescription: 'Installatie met één regel via pip. Ondersteunt pipx voor geïsoleerde omgevingen en ontwikkelingsmodus voor bijdragers.',
            installNow: 'Installeer Nu →',
            quickStart: 'Snel Start',
            quickStartSubtitle: 'Begin in seconden me Vlaams Codex',
            install: 'Installeer',
            runFirstProgram: 'Run uw eerste programma',
            orUseMagicMode: 'Of Gebruik Magic Mode',
            installationOptions: 'Installatie Opties',
            recommended: 'Aanbevolen',
            perfectForEndUsers: 'Perfect voor eindgebruikers. Houdt afhankelijkheden geïsoleerd.',
            standardInstallation: 'Standaard installatie. Werkt me bestaande Python setup.',
            forContributors: 'Voor bijdragers. Inclusief testsuite en ontwikkelingstools.',
            multiVlaamsCommands: 'Multi-Vlaams Dialect Commando\'s',
            multiVlaamsSubtitle: 'Elk commando werkt in 7 Vlaamse dialekten! Gebruik wat voor u het beste voelt.',
            viewAllDialects: 'Bekijk Alle Dialekten →',
            exploreExamples: 'Verken Voorbeelden',
            exploreExamplesSubtitle: 'Leer door te doen me kant-en-klare voorbeelden',
            viewAllExamples: 'Bekijk Alle Voorbeelden →',
            joinCommunity: 'Sluit Aan',
            joinCommunitySubtitle: 'Verbind me andere Vlaams Codex ontwikkelaars',
            github: 'GitHub repository, rapporteer issues, en draag code bij',
            issueTracker: 'Rapporteer bugs, request features, en bespreek verbeteringen',
            contributing: 'Dien pull requests in en help Vlaams Codex verbeteren',
            documentation: 'Documentatie',
            resources: 'Bronnen',
            community: 'Gemeenschap'
        }
    };

    let currentLanguage = 'en';

    function initLanguageSwitcher() {
        const languageSelect = document.getElementById('languageSelect');
        if (!languageSelect) return;

        const savedLanguage = localStorage.getItem('language') || 'en';
        const urlParams = new URLSearchParams(window.location.search);
        const urlLanguage = urlParams.get('lang');

        if (urlLanguage && translations[urlLanguage]) {
            currentLanguage = urlLanguage;
        } else {
            currentLanguage = savedLanguage;
        }

        languageSelect.value = currentLanguage;
        applyLanguage(currentLanguage);

        languageSelect.addEventListener('change', function() {
            const newLanguage = this.value;
            currentLanguage = newLanguage;
            localStorage.setItem('language', newLanguage);
            applyLanguage(newLanguage);
        });
    }

    function applyLanguage(language) {
        const trans = translations[language];

        document.querySelectorAll('[data-lang]').forEach(element => {
            const key = element.getAttribute('data-lang');
            if (trans[key]) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = trans[key];
                } else {
                    element.textContent = trans[key];
                }
            }
        });

        document.querySelectorAll('[data-lang-placeholder]').forEach(element => {
            const key = element.getAttribute('data-lang-placeholder');
            if (trans[key]) {
                element.setAttribute('placeholder', trans[key]);
            }
        });

        document.documentElement.lang = language === 'vl' ? 'nl' : 'en';

        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('lang', language);
        const newUrl = window.location.pathname + '?' + urlParams.toString();
        window.history.replaceState({}, '', newUrl);
    }

    function switchLanguage(language) {
        if (!translations[language]) {
            console.warn(`Language ${language} not available`);
            return;
        }

        currentLanguage = language;
        localStorage.setItem('language', language);
        applyLanguage(language);

        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.value = language;
        }
    }

    function getCurrentLanguage() {
        return currentLanguage;
    }

    function translate(key) {
        return translations[currentLanguage][key] || key;
    }

    function addTranslation(key, translationsDict) {
        if (translations.en[key]) {
            console.warn(`Translation key ${key} already exists`);
            return;
        }

        translations.en[key] = translationsDict.en || key;
        translations.vl[key] = translationsDict.vl || translationsDict.en || key;
    }

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = {
            initLanguageSwitcher,
            switchLanguage,
            getCurrentLanguage,
            translate,
            addTranslation
        };
    } else {
        window.LanguageSwitcher = {
            initLanguageSwitcher,
            switchLanguage,
            getCurrentLanguage,
            translate,
            addTranslation
        };
    }

    document.addEventListener('DOMContentLoaded', function() {
        if (window.LanguageSwitcher) {
            window.LanguageSwitcher.initLanguageSwitcher();
        }
    });

})();
