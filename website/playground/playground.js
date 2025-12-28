/* global loadPyodide */

const PYODIDE_VERSION = 'v0.26.2';
const VLAAMSCODEX_VERSION = '0.2.5';
const VLAAMSCODEX_WHEEL_PATH = `../assets/py/vlaamscodex-${VLAAMSCODEX_VERSION}-py3-none-any.whl`;
const VLAAMSCODEX_WHEEL_CACHE_BUST = '2025-12-28-05';

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

function setStatus(text) {
    if (elements.runtimeStatus) elements.runtimeStatus.textContent = `Runtime: ${text}`;
}

function appendOutput(text) {
    if (!elements.output) return;
    elements.output.textContent += text;
}

function setOutput(text) {
    if (!elements.output) return;
    elements.output.textContent = text;
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

async function initFromQuery() {
    const { example } = getQuery();
    if (!example) {
        setStatus('idle');
        return;
    }

    try {
        if (elements.editorTitle) elements.editorTitle.textContent = `Code (${example})`;
        if (elements.hintLine) elements.hintLine.textContent = `Loaded example: ${example}`;
        const code = getExampleCode(example);
        if (elements.editor) elements.editor.value = code;
        elements.output.innerHTML = '<span class="empty-output">Loading...</span>';
        await handleRun();
    } catch (e) {
        setStatus('error');
        const errorInfo = parseCompilerError(e);
        const suggestionHtml = errorInfo.suggestions.map(s => `<li class="suggestion-item"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><path d="M17.66 11.34A8 8 0 0 0 0 9.83 14.17L12 14a8 8 0 0 0 0-9.83-14.17l7.66 0.17V11.34z"></path></svg> ${s}</li>`).join('');
        elements.output.innerHTML = `<div class="error-header"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="error-icon"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg><span class="error-title" style="color: #EF4444; font-weight: 700; font-size: 1.125rem;">${errorInfo.title}</span></div><div class="error-description" style="background: #FFF7ED; padding: 1.5rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;"><strong style="color: #2C3E50; display: block; margin-bottom: 0.5rem;">Error loading example:</strong><p style="margin: 0; color: #6B7280;">${errorInfo.description}</p></div><div class="error-details" style="background: #1F2937; padding: 1.5rem; border-radius: var(--radius-md); margin-bottom: 1rem;"><strong style="color: #9CA3AF; display: block; margin-bottom: 0.5rem;">Original error:</strong><code class="error-code" style="color: #E5E7EB; font-family: var(--font-mono); font-size: 0.875rem; line-height: 1.6; display: block; margin-top: 0.5rem;">${errorInfo.rawMessage}</code></div>`;
    }
}

function parseCompilerError(error) {
    const errorMsg = error.message || error.toString();

    const errorPatterns = [
        {
            pattern: /Cannot read properties of undefined.*includes/i,
            title: 'Execution Error',
            description: 'There was an issue running the code. Please check if all brackets and quotes are properly closed.',
            suggestions: ['Make sure all quotes are closed', 'Check that "plan doe" and "gedaan" are present', 'Try a simpler example first']
        },
        {
            pattern: /amen.*vergeten/i,
            title: 'Missing amen',
            description: 'You forgot to add "amen" at the end of a statement.',
            suggestions: ['Add "amen" at the end of each statement', 'Check that every line ends with "amen"']
        },
        {
            pattern: /onbekend.*identifier|is.*niet.*gedefinieerd/i,
            title: 'Unknown Variable',
            description: 'You are trying to use a variable that has not been defined yet.',
            suggestions: ['Check the variable spelling', 'Define the variable before using it', 'Make sure you use "zet" to define it first']
        },
        {
            pattern: /syntax.*fout|verwacht/i,
            title: 'Syntax Error',
            description: 'The code structure is not correct.',
            suggestions: ['Check for missing quotes around text', 'Make sure all brackets are closed', 'Check that keywords are spelled correctly']
        },
        {
            pattern: /klap|print/i,
            title: 'Print Statement Error',
            description: 'Issue with printing output.',
            suggestions: ['Use "klap tekst" to print', 'Make sure text is enclosed in "tekst" keyword']
        },
        {
            pattern: /funksie|function/i,
            title: 'Function Error',
            description: 'Problem with function definition or call.',
            suggestions: ['Functions start with "maak funksie"', 'Use "roep" to call functions', 'Check parameter syntax']
        }
    ];

    for (const pattern of errorPatterns) {
        if (pattern.pattern.test(errorMsg)) {
            return {
                title: pattern.title,
                description: pattern.description,
                suggestions: pattern.suggestions,
                rawMessage: errorMsg
            };
        }
    }

    return {
        title: 'Compiler Error',
        description: errorMsg,
        suggestions: ['Check your code syntax', 'Review the error message', 'Try simplifying your code'],
        rawMessage: errorMsg
    };
}

let pyodidePromise = null;

async function ensurePyodide() {
    if (pyodidePromise) return pyodidePromise;

    pyodidePromise = (async () => {
        setStatus('loading pyodide');
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

        setStatus('loading micropip');
        await pyodide.loadPackage('micropip');

        const wheelUrl = new URL(`${VLAAMSCODEX_WHEEL_PATH}?v=${encodeURIComponent(VLAAMSCODEX_WHEEL_CACHE_BUST)}`, window.location.href).toString();

        setStatus(`installing vlaamscodex ${VLAAMSCODEX_VERSION}`);
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

// Override the runPlats function to catch compiler errors better
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
        return '(no output)';
    }

    if (result.includes('COMPILER_ERROR:')) {
        const errorMsg = result.replace('COMPILER_ERROR: ', '');
        throw new Error(errorMsg);
    }

    return result || '(no output)';
}

async function handleRun() {
    const code = elements.editor?.value ?? '';
    if (!code.trim()) {
        setOutput('Please enter some code to run.');
        return;
    }

    elements.output.innerHTML = '';
    try {
        elements.runBtn.disabled = true;
        setStatus('running');
        const out = await runPlats(code);
        setOutput(out || '(no output)');
        setStatus('ready');
    } catch (e) {
        setStatus('error');
        const errorInfo = parseCompilerError(e);
        const suggestionHtml = errorInfo.suggestions.map(s => `<li class="suggestion-item"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><path d="M17.66 11.34A8 8 0 0 0 0 9.83 14.17L12 14a8 8 0 0 0 0-9.83-14.17l7.66 0.17V11.34z"></path></svg> ${s}</li>`).join('');

        elements.output.innerHTML = `<div class="error-header"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="error-icon"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg><span class="error-title" style="color: #EF4444; font-weight: 700; font-size: 1.125rem;">${errorInfo.title}</span></div><div class="error-description" style="background: #FFF7ED; padding: 1.5rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;"><strong style="color: #2C3E50; display: block; margin-bottom: 0.5rem;">What's wrong:</strong><p style="margin: 0; color: #6B7280;">${errorInfo.description}</p></div><div class="error-suggestions" style="padding: 1.5rem; margin-bottom: 1.5rem;"><strong style="color: #1E40AF; display: block; margin-bottom: 0.75rem;">How to fix it:</strong><ul style="margin: 0; padding-left: 1.5rem; color: #6B7280;">${suggestionHtml}</ul></div><div class="error-details" style="background: #1F2937; padding: 1.5rem; border-radius: var(--radius-md); margin-bottom: 1rem;"><strong style="color: #9CA3AF; display: block; margin-bottom: 0.5rem;">Original error:</strong><code class="error-code" style="color: #E5E7EB; font-family: var(--font-mono); font-size: 0.875rem; line-height: 1.6; display: block; margin-top: 0.5rem;">${errorInfo.rawMessage}</code></div>`;
    } finally {
        elements.runBtn.disabled = false;
    }
}

function wireUi() {
    if (elements.copyBtn && elements.editor) {
        elements.copyBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(elements.editor.value);
                elements.copyBtn.textContent = 'Copied!';
                setTimeout(() => { elements.copyBtn.textContent = 'Copy'; }, 1200);
            } catch {
                elements.copyBtn.textContent = 'Copy failed';
                setTimeout(() => { elements.copyBtn.textContent = 'Copy'; }, 1200);
            }
        });
    }

    if (elements.clearBtn) {
        elements.clearBtn.addEventListener('click', () => setOutput(''));
    }

    if (elements.runBtn) {
        elements.runBtn.addEventListener('click', handleRun);
    }
}

async function initFromQuery() {
    const { example } = getQuery();
    if (!example) {
        setStatus('idle');
        return;
    }

    try {
        if (elements.editorTitle) elements.editorTitle.textContent = `Code (${example})`;
        if (elements.hintLine) elements.hintLine.textContent = `Loaded example: ${example}`;
        const code = await fetchExampleCode(example);
        if (elements.editor) elements.editor.value = code;
        elements.output.innerHTML = '<span class="empty-output">Loading...</span>';
        await handleRun();
    } catch (e) {
        setStatus('error');
        const errorInfo = parseCompilerError(e);
        const suggestionHtml = errorInfo.suggestions.map(s => `<li class="suggestion-item"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><path d="M17.66 11.34A8 8 0 0 0 0 9.83 14.17L12 14a8 8 0 0 0 0-9.83-14.17l7.66 0.17V11.34z"></path></svg> ${s}</li>`).join('');
        elements.output.innerHTML = `<div class="error-header"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="error-icon"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg><span class="error-title" style="color: #EF4444; font-weight: 700; font-size: 1.125rem;">${errorInfo.title}</span></div><div class="error-description" style="background: #FFF7ED; padding: 1.5rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;"><strong style="color: #2C3E50; display: block; margin-bottom: 0.5rem;">Error loading example:</strong><p style="margin: 0; color: #6B7280;">${errorInfo.description}</p></div><div class="error-details" style="background: #1F2937; padding: 1.5rem; border-radius: var(--radius-md); margin-bottom: 1rem;"><strong style="color: #9CA3AF; display: block; margin-bottom: 0.5rem;">Original error:</strong><code class="error-code" style="color: #E5E7EB; font-family: var(--font-mono); font-size: 0.875rem; line-height: 1.6; display: block; margin-top: 0.5rem;">${errorInfo.rawMessage}</code></div>`;
    }
}

wireUi();

document.addEventListener('DOMContentLoaded', () => {
    if (elements.output && !getQuery().example) {
        elements.output.innerHTML = '<span class="empty-output">Run some code to see output here...</span>';
    }

    const { example } = getQuery();
    if (example) {
        elements.hintLine.textContent = 'Examples directory removed. Type code directly in editor.';
        elements.hintLine.style.background = '#F59E0B';
        elements.hintLine.style.color = 'white';
    }

    initFromQuery();
});
