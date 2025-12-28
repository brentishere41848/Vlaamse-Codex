/* global loadPyodide */

const PYODIDE_VERSION = 'v0.26.2';
const VLAAMSCODEX_VERSION = '0.2.5';
const VLAAMSCODEX_WHEEL_PATH = `../assets/py/vlaamscodex-${VLAAMSCODEX_VERSION}-py3-none-any.whl`;
const VLAAMSCODEX_WHEEL_CACHE_BUST = '2025-12-28-05';

const I18N = {
    en: {
        runtimePrefix: 'Runtime',
        status: {
            idle: 'idle',
            running: 'running',
            ready: 'ready',
            error: 'error',
            loadingPyodide: 'loading pyodide',
            loadingMicropip: 'loading micropip',
            installing: (version) => `installing vlaamscodex ${version}`,
        },
        hintDefault: 'Play your first Platskript code in the browser!',
        hintLoadedExample: (example) => `Loaded example: ${example}`,
        outputEmpty: 'Output will appear here...',
        outputLoading: 'Loading...',
        outputNoCode: 'Please enter some code to run.',
        outputNoOutput: '(no output)',
        copy: 'Copy',
        copied: 'Copied!',
        copyFailed: 'Copy failed',
        errorLoadingExample: 'Error loading example:',
        errorWhatsWrong: "What's wrong:",
        errorHowToFix: 'How to fix it:',
        errorOriginal: 'Original error:',
        errorPatterns: [
            {
                pattern: /missing 'amen' statement terminator/i,
                title: 'Missing amen',
                description: 'You forgot to add "amen" at the end of a statement.',
                suggestions: ['Add "amen" at the end of each statement', 'Check that every line ends with "amen"'],
            },
            {
                pattern: /onbekend.*identifier|is.*niet.*gedefinieerd/i,
                title: 'Unknown Variable',
                description: 'You are trying to use a variable that has not been defined yet.',
                suggestions: ['Check the variable spelling', 'Define the variable before using it', 'Make sure you use "zet" to define it first'],
            },
            {
                pattern: /syntax.*fout|verwacht/i,
                title: 'Syntax Error',
                description: 'The code structure is not correct.',
                suggestions: ['Check for missing quotes around text', 'Make sure all brackets are closed', 'Check that keywords are spelled correctly'],
            },
            {
                pattern: /can only concatenate str.*to str/i,
                title: 'Type Error',
                description: 'You tried to combine text with a number without converting it to text first.',
                suggestions: ['Convert numbers to text before plakt', 'Double-check your variables are the expected type'],
            },
            {
                pattern: /Cannot read properties of undefined.*includes/i,
                title: 'Execution Error',
                description: 'There was an issue running the code. Please check if all brackets and quotes are properly closed.',
                suggestions: ['Make sure all quotes are closed', 'Check that "plan doe" and "gedaan" are present', 'Try a simpler example first'],
            },
            {
                pattern: /funksie|function/i,
                title: 'Function Error',
                description: 'Problem with function definition or call.',
                suggestions: ['Functions start with "maak funksie"', 'Use "roep" to call functions', 'Check parameter syntax'],
            },
        ],
        errorDefaultTitle: 'Compiler Error',
        errorDefaultSuggestions: ['Check your code syntax', 'Review the error message', 'Try simplifying your code'],
    },
    vl: {
        runtimePrefix: 'Runtime',
        status: {
            idle: 'idle',
            running: 'bezig',
            ready: 'klaar',
            error: 'fout',
            loadingPyodide: 'pyodide aan ’t laden',
            loadingMicropip: 'micropip aan ’t laden',
            installing: (version) => `vlaamscodex ${version} aan ’t installeren`,
        },
        hintDefault: 'Probeer uw eerste Platskript-code in de browser!',
        hintLoadedExample: (example) => `Voorbeeld ingeladen: ${example}`,
        outputEmpty: 'Output komt hier te staan...',
        outputLoading: 'Bezig met laden...',
        outputNoCode: 'Zet eerst wa code in de editor om te runnen.',
        outputNoOutput: '(geen output)',
        copy: 'Kopieer',
        copied: 'Gekopieerd!',
        copyFailed: 'Kopiëren mislukt',
        errorLoadingExample: 'Fout bij het laden van het voorbeeld:',
        errorWhatsWrong: 'Wa scheelt er:',
        errorHowToFix: 'Hoe fixte da:',
        errorOriginal: 'Originele fout:',
        errorPatterns: [
            {
                pattern: /missing 'amen' statement terminator/i,
                title: 'Amen vergeten',
                description: 'Ge zijt "amen" vergeten op het einde van een statement.',
                suggestions: ['Zet "amen" op het einde van elke statement', 'Check of elke lijn eindigt met "amen"'],
            },
            {
                pattern: /onbekend.*identifier|is.*niet.*gedefinieerd/i,
                title: 'Onbekende variabele',
                description: 'Ge gebruikt een variabele die nog nie is aangemaakt.',
                suggestions: ['Check de spelling', 'Zet de variabele eerst met "zet"', 'Check of ge "da <naam>" gebruikt waar het moet'],
            },
            {
                pattern: /syntax.*fout|verwacht/i,
                title: 'Syntaxfout',
                description: 'De structuur van uw code klopt nie.',
                suggestions: ['Check of ge quotes rond tekst hebt', 'Check of alle haakskes gesloten zijn', 'Check de sleutelwoorden op typfouten'],
            },
            {
                pattern: /can only concatenate str.*to str/i,
                title: 'Typefout',
                description: 'Ge probeert tekst en een getal te plakken zonder eerst naar tekst om te zetten.',
                suggestions: ['Zet getallen om naar tekst voor plakt', 'Check of uw variabelen het juiste type hebben'],
            },
            {
                pattern: /Cannot read properties of undefined.*includes/i,
                title: 'Uitvoerfout',
                description: 'Er ging iets mis bij het uitvoeren. Check of al uw haakskes en quotes proper gesloten zijn.',
                suggestions: ['Check of alle quotes dicht zijn', 'Check of "plan doe" en "gedaan" erbij staan', 'Probeer eerst een simpeler stuk code'],
            },
            {
                pattern: /funksie|function/i,
                title: 'Functiefout',
                description: 'Er is een probleem met uw functie-definitie of oproep.',
                suggestions: ['Functies starten met "maak funksie"', 'Gebruik "roep" om een functie op te roepen', 'Check uw parametersyntax'],
            },
        ],
        errorDefaultTitle: 'Compilerfout',
        errorDefaultSuggestions: ['Check uw code syntax', 'Lees de foutmelding', 'Maak uw voorbeeld kleiner en probeer opnieuw'],
    },
};

const elements = {
    editor: document.getElementById('editor'),
    output: document.getElementById('output'),
    runBtn: document.getElementById('runBtn'),
    copyBtn: document.getElementById('copyBtn'),
    clearBtn: document.getElementById('clearBtn'),
    runtimeStatus: document.getElementById('runtimeStatus'),
    editorTitle: document.getElementById('editorTitle'),
    hintLine: document.getElementById('hintLine'),
};

const EXAMPLES = new Map([
    ['hello', `# coding: vlaamsplats
plan doe
  klap tekst gdag aan weeireld amen
gedaan
`],
    ['greeting', `# coding: vlaamsplats
plan doe
  zet naam op tekst weeireld amen

  maak funksie groet met wie doe
    klap tekst gdag plakt spatie plakt da wie amen
  gedaan

  roep groet met da naam amen
gedaan
`],
    ['calculator', `# coding: vlaamsplats
plan doe
  zet x op getal 10 amen
  zet y op getal 5 amen

  zet som op da x derbij da y amen
  klap da som amen

  zet verschil op da x deraf da y amen
  klap da verschil amen

  zet product op da x keer da y amen
  klap da product amen
gedaan
`],
    ['functions', `# coding: vlaamsplats
plan doe
  maak funksie zeghallo met naam doe
    klap tekst hallo plakt spatie plakt da naam amen
  gedaan

  roep zeghallo met tekst Vlaanderen amen
  roep zeghallo met tekst Antwerpen amen
  roep zeghallo met tekst Brussel amen
gedaan
`],
    ['fibonacci', `# coding: vlaamsplats
plan doe
  zet a op getal 0 amen
  zet b op getal 1 amen

  klap da a amen
  klap da b amen

  zet c op da a derbij da b amen
  klap da c amen
  zet a op da b amen
  zet b op da c amen

  zet c op da a derbij da b amen
  klap da c amen
  zet a op da b amen
  zet b op da c amen

  zet c op da a derbij da b amen
  klap da c amen
gedaan
`],
    ['fortune', `# coding: vlaamsplats
plan doe
  maak funksie toon_fortune met doe
    klap tekst wie nie waagt die nie wint amen
  gedaan

  roep toon_fortune amen
gedaan
`],
    ['strings', `# coding: vlaamsplats
plan doe
  zet stad op tekst Antwerpen amen
  zet zin op tekst ik plakt spatie plakt tekst zen van plakt spatie plakt da stad amen
  klap da zin amen
gedaan
`],
]);

function getLanguage() {
    const urlParams = new URLSearchParams(window.location.search);
    const urlLanguage = urlParams.get('lang');
    if (urlLanguage && (urlLanguage === 'en' || urlLanguage === 'vl')) return urlLanguage;
    const saved = localStorage.getItem('language');
    if (saved && (saved === 'en' || saved === 'vl')) return saved;
    return 'en';
}

function i18n() {
    return I18N[getLanguage()] || I18N.en;
}

function setStatus(statusKey, arg) {
    if (!elements.runtimeStatus) return;
    const tr = i18n();
    const prefix = tr.runtimePrefix;
    let statusText = statusKey;
    if (statusKey === 'installing') statusText = tr.status.installing(arg);
    else if (tr.status[statusKey]) statusText = tr.status[statusKey];
    elements.runtimeStatus.textContent = `${prefix}: ${statusText}`;
}

function setOutputText(text) {
    if (!elements.output) return;
    elements.output.textContent = text;
}

function setOutputHtml(html) {
    if (!elements.output) return;
    elements.output.innerHTML = html;
}

function getQuery() {
    const params = new URLSearchParams(window.location.search);
    return {
        example: params.get('example') || '',
    };
}

function getExampleCode(example) {
    const code = EXAMPLES.get(example);
    if (!code) throw new Error(`Example not found: ${example}`);
    return code;
}

function parseCompilerError(error) {
    const tr = i18n();
    const errorMsg = error?.message || error?.toString?.() || String(error);

    for (const p of tr.errorPatterns) {
        if (p.pattern.test(errorMsg)) {
            return {
                title: p.title,
                description: p.description,
                suggestions: p.suggestions,
                rawMessage: errorMsg,
            };
        }
    }

    return {
        title: tr.errorDefaultTitle,
        description: errorMsg,
        suggestions: tr.errorDefaultSuggestions,
        rawMessage: errorMsg,
    };
}

function renderErrorBox({ title, description, suggestions, rawMessage }, contextKey) {
    const tr = i18n();
    const suggestionHtml = (suggestions || [])
        .map(s => `<li class="suggestion-item"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><path d="M17.66 11.34A8 8 0 0 0 4 9.83a8 8 0 0 0 14.17 7.66"></path></svg> ${s}</li>`)
        .join('');

    const contextTitle = contextKey === 'loadingExample' ? tr.errorLoadingExample : tr.errorWhatsWrong;

    return `
<div class="error-header">
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="error-icon">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="15" y1="9" x2="9" y2="15"></line>
    <line x1="9" y1="9" x2="15" y2="15"></line>
  </svg>
  <span class="error-title">${title}</span>
</div>
<div class="error-description">
  <strong>${contextTitle}</strong>
  <p>${description}</p>
</div>
<div class="error-suggestions">
  <strong>${tr.errorHowToFix}</strong>
  <ul>${suggestionHtml}</ul>
</div>
<div class="error-details">
  <strong>${tr.errorOriginal}</strong>
  <code class="error-code">${rawMessage}</code>
</div>`;
}

let pyodidePromise = null;

async function ensurePyodide() {
    if (pyodidePromise) return pyodidePromise;

    pyodidePromise = (async () => {
        setStatus('loadingPyodide');
        if (!window.loadPyodide) {
            await new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = `https://cdn.jsdelivr.net/pyodide/${PYODIDE_VERSION}/full/pyodide.js`;
                script.onload = resolve;
                script.onerror = () => reject(new Error('Failed to load Pyodide script'));
                document.head.appendChild(script);
            });
        }

        const pyodide = await window.loadPyodide({
            indexURL: `https://cdn.jsdelivr.net/pyodide/${PYODIDE_VERSION}/full/`,
        });

        setStatus('loadingMicropip');
        await pyodide.loadPackage('micropip');

        const wheelUrl = new URL(`${VLAAMSCODEX_WHEEL_PATH}?v=${encodeURIComponent(VLAAMSCODEX_WHEEL_CACHE_BUST)}`, window.location.href).toString();

        setStatus('installing', VLAAMSCODEX_VERSION);
        try {
            await pyodide.runPythonAsync(`
import micropip
await micropip.install(${JSON.stringify(wheelUrl)})
            `.trim());
        } catch {
            await pyodide.runPythonAsync(`
import micropip
await micropip.install("vlaamscodex==${VLAAMSCODEX_VERSION}")
            `.trim());
        }

        setStatus('ready');
        return pyodide;
    })();

    return pyodidePromise;
}

async function runPlats(code) {
    const pyodide = await ensurePyodide();
    const escaped = JSON.stringify(code);

    const result = await pyodide.runPythonAsync(`
import io
import sys
from contextlib import redirect_stdout, redirect_stderr
from vlaamscodex.compiler import compile_plats

try:
    _src = ${escaped}
    _py = compile_plats(_src)

    _out = io.StringIO()
    _err = io.StringIO()
    _globals = {}

    with redirect_stdout(_out), redirect_stderr(_err):
        exec(_py, _globals, _globals)

    _output = _out.getvalue() + _err.getvalue()
    _output
except Exception as e:
    sys.stdout.write("COMPILER_ERROR: " + str(e))
    sys.exit(1)
    `.trim());

    if (!result || typeof result !== 'string') {
        return i18n().outputNoOutput;
    }

    if (result.includes('COMPILER_ERROR:')) {
        const errorMsg = result.replace('COMPILER_ERROR: ', '');
        throw new Error(errorMsg);
    }

    return result || i18n().outputNoOutput;
}

async function handleRun() {
    const tr = i18n();
    const code = elements.editor?.value ?? '';
    if (!code.trim()) {
        setOutputText(tr.outputNoCode);
        return;
    }

    setOutputHtml('');
    try {
        if (elements.runBtn) elements.runBtn.disabled = true;
        setStatus('running');
        const out = await runPlats(code);
        setOutputText(out || tr.outputNoOutput);
        setStatus('ready');
    } catch (e) {
        setStatus('error');
        const errorInfo = parseCompilerError(e);
        setOutputHtml(renderErrorBox(errorInfo));
    } finally {
        if (elements.runBtn) elements.runBtn.disabled = false;
    }
}

function wireUi() {
    if (elements.copyBtn && elements.editor) {
        elements.copyBtn.addEventListener('click', async () => {
            const tr = i18n();
            try {
                await navigator.clipboard.writeText(elements.editor.value);
                elements.copyBtn.textContent = tr.copied;
                setTimeout(() => { elements.copyBtn.textContent = tr.copy; }, 1200);
            } catch {
                elements.copyBtn.textContent = tr.copyFailed;
                setTimeout(() => { elements.copyBtn.textContent = tr.copy; }, 1200);
            }
        });
    }

    if (elements.clearBtn) {
        elements.clearBtn.addEventListener('click', () => setOutputText(''));
    }

    if (elements.runBtn) {
        elements.runBtn.addEventListener('click', handleRun);
    }
}

wireUi();

document.addEventListener('DOMContentLoaded', () => {
    const tr = i18n();
    if (elements.hintLine) elements.hintLine.textContent = tr.hintDefault;
    if (elements.output) elements.output.innerHTML = `<span class="empty-output">${tr.outputEmpty}</span>`;
    setStatus('idle');

    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.addEventListener('change', () => {
            const t2 = i18n();
            if (elements.hintLine) elements.hintLine.textContent = t2.hintDefault;
            if (elements.output && elements.output.querySelector('.empty-output')) {
                elements.output.innerHTML = `<span class="empty-output">${t2.outputEmpty}</span>`;
            }
            setStatus('idle');
        });
    }

    const { example } = getQuery();
    if (example) {
        try {
            const code = getExampleCode(example);
            if (elements.editorTitle) elements.editorTitle.textContent = `Code (${example})`;
            if (elements.hintLine) elements.hintLine.textContent = tr.hintLoadedExample(example);
            if (elements.editor) elements.editor.value = code;
            setOutputHtml(`<span class="empty-output">${tr.outputLoading}</span>`);
            handleRun();
        } catch (e) {
            setStatus('error');
            const errorInfo = parseCompilerError(e);
            setOutputHtml(renderErrorBox(errorInfo, 'loadingExample'));
        }
    }
});

