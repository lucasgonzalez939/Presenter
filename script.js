// Presenter - Main Script

// DOM elements
const textInput = document.getElementById('textInput');
const textContent = document.getElementById('textContent');
const tabsContainer = document.querySelector('.tabs');
const newTabBtn = document.getElementById('newTabBtn');
const clearBtn = document.getElementById('clearBtn');
const toggleMenuBtn = document.getElementById('toggleMenuBtn');
const header = document.querySelector('.header');
const showMenuBtn = document.getElementById('showMenuBtn');
const decreaseFontBtn = document.getElementById('decreaseFontBtn');
const increaseFontBtn = document.getElementById('increaseFontBtn');
const resetFontBtn = document.getElementById('resetFontBtn');
const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
const importFile = document.getElementById('importFile');
const configBtn = document.getElementById('configBtn');
const configModal = document.getElementById('configModal');
const prevKeyInput = document.getElementById('prevKeyInput');
const nextKeyInput = document.getElementById('nextKeyInput');
const closeConfigBtn = document.getElementById('closeConfigBtn');
const darkModeToggle = document.getElementById('darkModeToggle');
const helpBtn = document.getElementById('helpBtn');
const helpModal = document.getElementById('helpModal');
const closeHelpBtn = document.getElementById('closeHelpBtn');
const downloadTemplateBtn = document.getElementById('downloadTemplateBtn');
const body = document.body;

// Constants
const DEFAULT_TEXT = "¡Bienvenido! Este texto se ajusta automáticamente al tamaño de la pantalla.\n\n*Texto en negrita* | #red#Rojo# | #blue#Azul# | #green#Verde#\n\n*#white#Negrita blanca#* | *#yellow#Negrita amarilla#*\n\nHaz clic en ❓ para ver la guía de formato";
const FONT_SIZE_INCREMENT = 0.5;
const MIN_FONT_SIZE = 1;
const MAX_FONT_SIZE = 10;

// State variables
let texts = {};
let activeTab = null;
let config = {
    prevKey: 'ArrowLeft',
    nextKey: 'ArrowRight',
    isDarkMode: true
};

let draggingTab = null;
let manualFontSize = null; // Track if user manually adjusted font size

// Function to auto-scale text to fit viewport
const autoScaleText = () => {
    // Skip auto-scaling if user has manually adjusted the font size
    if (manualFontSize !== null) {
        textContent.style.fontSize = `${manualFontSize}rem`;
        return;
    }

    const container = textContent.parentElement;
    const containerHeight = container.clientHeight;
    const containerWidth = container.clientWidth;
    
    // Start with a large font size
    let fontSize = 10; // rem
    textContent.style.fontSize = `${fontSize}rem`;
    
    // Reduce font size until content fits both horizontally and vertically
    while (fontSize > 0.5) {
        const contentHeight = textContent.scrollHeight;
        const contentWidth = textContent.scrollWidth;
        
        // Check if content fits within container (with some padding margin)
        if (contentHeight <= containerHeight && contentWidth <= containerWidth) {
            break;
        }
        
        fontSize -= 0.1;
        textContent.style.fontSize = `${fontSize}rem`;
    }
};

// LocalStorage functions
const loadFromLocalStorage = () => {
    const storedData = localStorage.getItem('textsData');
    const storedConfig = localStorage.getItem('configData');
    if (storedData) {
        const data = JSON.parse(storedData);
        texts = data.texts;
        activeTab = data.activeTab;
    } else {
        texts = { 'tab1': DEFAULT_TEXT };
        activeTab = 'tab1';
    }
    if (storedConfig) {
        config = JSON.parse(storedConfig);
    }
};

const saveToLocalStorage = () => {
    localStorage.setItem('textsData', JSON.stringify({ texts, activeTab }));
    localStorage.setItem('configData', JSON.stringify(config));
};

// Text formatting function
const formatText = (text) => {
    let formattedText = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    formattedText = formattedText.replace(/\n/g, '<br>');
    
    // Bold text with *text* - keeps original color
    formattedText = formattedText.replace(/\*(.*?)\*/g, '<strong class="bold">$1</strong>');
    
    // Color formatting: #color#text#
    formattedText = formattedText.replace(/#red#(.*?)#/g, '<span class="red">$1</span>');
    formattedText = formattedText.replace(/#blue#(.*?)#/g, '<span class="blue">$1</span>');
    formattedText = formattedText.replace(/#green#(.*?)#/g, '<span class="green">$1</span>');
    formattedText = formattedText.replace(/#yellow#(.*?)#/g, '<span class="yellow">$1</span>');
    formattedText = formattedText.replace(/#orange#(.*?)#/g, '<span class="orange">$1</span>');
    formattedText = formattedText.replace(/#purple#(.*?)#/g, '<span class="purple">$1</span>');
    formattedText = formattedText.replace(/#white#(.*?)#/g, '<span class="white">$1</span>');
    
    // Background highlight with ##text##
    formattedText = formattedText.replace(/##(.*?)##/g, '<span class="bg-highlight">$1</span>');
    
    // Center text with #center#text#end#
    formattedText = formattedText.replace(/#center#(.*?)#end#/g, '<span class="center-text">$1</span>');
    
    // Multiple line breaks with |||
    formattedText = formattedText.replace(/\|\|\|/g, '<br><br><br>');
    
    if (formattedText.trim() === '' || formattedText === '<br>') {
        return DEFAULT_TEXT;
    }
    return formattedText;
};

// Tab management functions
const renderTabs = () => {
    tabsContainer.querySelectorAll('.tab-button:not(#newTabBtn)').forEach(btn => btn.remove());
    const tabKeys = Object.keys(texts);
    tabKeys.forEach(key => {
        const tabButton = document.createElement('button');
        tabButton.className = `tab-button ${key === activeTab ? 'active' : ''}`;
        tabButton.dataset.tab = key;
        const tabName = typeof texts[key] === 'object' && texts[key].name
            ? texts[key].name
            : `Pestaña ${key.slice(3)}`;
        tabButton.textContent = tabName;
        
        if (tabKeys.length > 1) {
            const closeBtn = document.createElement('span');
            closeBtn.className = 'tab-close-btn';
            closeBtn.innerHTML = '&times;';
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                closeTab(key);
            });
            tabButton.appendChild(closeBtn);
        }

        tabButton.draggable = true;
        tabButton.addEventListener('dragstart', (e) => {
            draggingTab = tabButton;
            setTimeout(() => {
                tabButton.classList.add('dragging');
                body.classList.add('dragging-tab');
            }, 0);
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData('text/plain', key);
        });
        tabButton.addEventListener('dragend', () => {
            if (draggingTab) {
                draggingTab.classList.remove('dragging');
            }
            body.classList.remove('dragging-tab');
            // Remove drag-over class from all tabs
            tabsContainer.querySelectorAll('.tab-button').forEach(tab => {
                tab.classList.remove('drag-over');
            });
            draggingTab = null;
        });
        tabButton.addEventListener('dragover', (e) => {
            e.preventDefault();
            const target = e.target.closest('.tab-button');
            if (target && target !== draggingTab) {
                // Remove drag-over from all other tabs
                tabsContainer.querySelectorAll('.tab-button').forEach(tab => {
                    if (tab !== target) {
                        tab.classList.remove('drag-over');
                    }
                });
                target.classList.add('drag-over');
            }
        });
        tabButton.addEventListener('dragleave', (e) => {
            const target = e.target.closest('.tab-button');
            // Only remove if we're actually leaving the tab
            if (target && !target.contains(e.relatedTarget)) {
                target.classList.remove('drag-over');
            }
        });
        tabButton.addEventListener('drop', (e) => {
            e.preventDefault();
            const dropTarget = e.target.closest('.tab-button');
            if (dropTarget) {
                dropTarget.classList.remove('drag-over');
            }
            
            if (draggingTab && dropTarget && draggingTab !== dropTarget) {
                const draggedKey = draggingTab.dataset.tab;
                const dropKey = dropTarget.dataset.tab;
                
                const keys = Object.keys(texts);
                const draggedIndex = keys.indexOf(draggedKey);
                const dropIndex = keys.indexOf(dropKey);
                
                const newTexts = {};
                keys.splice(draggedIndex, 1);
                keys.splice(dropIndex, 0, draggedKey);
                keys.forEach(k => newTexts[k] = texts[k]);
                texts = newTexts;
                
                updateUI();
            }
        });
        
        tabsContainer.insertBefore(tabButton, newTabBtn);
    });
    setupTabListeners();
};

const setupTabListeners = () => {
    tabsContainer.querySelectorAll('.tab-button:not(#newTabBtn)').forEach(button => {
        button.addEventListener('click', () => {
            activeTab = button.dataset.tab;
            updateUI();
        });
        button.addEventListener('dblclick', (e) => {
            const tabKey = button.dataset.tab;
            const currentName = typeof texts[tabKey] === 'object' && texts[tabKey].name
                              ? texts[tabKey].name
                              : `Pestaña ${tabKey.slice(3)}`;
            const newName = prompt("Introduce un nuevo nombre para la pestaña:", currentName);
            if (newName !== null && newName.trim() !== "") {
                if (typeof texts[tabKey] === 'string') {
                    texts[tabKey] = { content: texts[tabKey], name: newName };
                } else {
                    texts[tabKey].name = newName;
                }
                updateUI();
            }
        });
    });
};

const createNewTab = () => {
    const tabKeys = Object.keys(texts);
    const nextTabId = tabKeys.length > 0
        ? Math.max(...tabKeys.map(k => parseInt(k.slice(3)))) + 1
        : 1;
    const newTabKey = `tab${nextTabId}`;
    texts[newTabKey] = "";
    activeTab = newTabKey;
    updateUI();
};

const closeTab = (key) => {
    delete texts[key];
    if (Object.keys(texts).length === 0) {
        createNewTab();
    } else {
        const tabKeys = Object.keys(texts);
        activeTab = tabKeys[tabKeys.length - 1];
    }
    updateUI();
};

const nextTab = () => {
    const tabKeys = Object.keys(texts);
    if (tabKeys.length <= 1) return;
    const currentIndex = tabKeys.indexOf(activeTab);
    const nextIndex = (currentIndex + 1) % tabKeys.length;
    activeTab = tabKeys[nextIndex];
    updateUI();
};

const previousTab = () => {
    const tabKeys = Object.keys(texts);
    if (tabKeys.length <= 1) return;
    const currentIndex = tabKeys.indexOf(activeTab);
    const prevIndex = (currentIndex - 1 + tabKeys.length) % tabKeys.length;
    activeTab = tabKeys[prevIndex];
    updateUI();
};

// Font size functions
const updateFontSize = (direction) => {
    const currentSize = parseFloat(getComputedStyle(textContent).fontSize);
    let newSize;
    if (direction === 'increase') {
        newSize = currentSize + FONT_SIZE_INCREMENT * 16;
    } else {
        newSize = currentSize - FONT_SIZE_INCREMENT * 16;
    }
    const newSizeRem = newSize / 16;
    if (newSizeRem >= MIN_FONT_SIZE && newSizeRem <= MAX_FONT_SIZE) {
        manualFontSize = newSizeRem; // Track manual adjustment
        textContent.style.fontSize = `${newSizeRem}rem`;
    }
};

// Reset to auto-scaling mode
const resetFontSize = () => {
    manualFontSize = null;
    autoScaleText();
};

// Import/Export functions
const exportData = () => {
    const dataStr = JSON.stringify({ texts, activeTab, config }, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sesion_texto.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

const downloadTemplate = () => {
    const templateData = {
        "_instructions": {
            "purpose": "This is a template for the Presenter web application. Share this file with an LLM to automatically generate formatted presentations.",
            "how_to_use": [
                "1. Share this JSON file with an LLM (ChatGPT, Claude, etc.)",
                "2. Tell the LLM: 'Using this template, create a presentation about [TOPIC] with [N] slides'",
                "3. The LLM will generate a new JSON with your content",
                "4. Download the generated JSON file",
                "5. Import it into Presenter using the 'Import JSON' button"
            ],
            "formatting_syntax": {
                "*text*": "Makes text bold (preserves color)",
                "#color#text#color#": "Colors text - Available: red, blue, green, yellow, orange, purple, white",
                "##text##": "Adds yellow background highlight",
                "#center#text#end#": "Centers a block of text",
                "|||": "Adds multiple line breaks (spacing)",
                "combining": "You can combine formats: *#red#bold and red#red#*"
            },
            "structure": {
                "texts": "Object with tab1, tab2, tab3, etc. Each has 'name' (tab label) and 'content' (formatted text)",
                "activeTab": "Which tab to show first (usually 'tab1')",
                "config": {
                    "prevKey": "Keyboard key for previous slide (default: 'ArrowLeft')",
                    "nextKey": "Keyboard key for next slide (default: 'ArrowRight')",
                    "isDarkMode": "true for dark theme, false for light theme"
                }
            },
            "example_prompt": "Create a presentation about 'Machine Learning Basics' with 5 slides using this template. Include: 1) Title slide with centered welcome, 2) What is ML with key points, 3) Types of ML with colored categories, 4) Applications with examples, 5) Thank you slide. Use formatting syntax for emphasis and visual appeal.",
            "tips": [
                "Use #center# for titles and important statements",
                "Use ||| to add breathing room between sections",
                "Use colors to categorize or emphasize points",
                "Use *bold* for key terms and headings",
                "Keep text concise - this is for presentations, not documents",
                "Tab names should be short (1-3 words)"
            ]
        },
        "texts": {
            "tab1": {
                "name": "Welcome",
                "content": "#center#*Welcome to Presenter*#end#\n|||\n#blue#A modern presentation tool#blue#\n|||\nPress → or click right to continue"
            },
            "tab2": {
                "name": "Text Formatting",
                "content": "#center#*Text Formatting Options*#end#\n|||\n*Bold text* with asterisks\n|||\n#red#Red#red# #blue#Blue#blue# #green#Green#green# #yellow#Yellow#yellow#\n#orange#Orange#orange# #purple#Purple#purple# #white#White#white#\n|||\n##Background highlight##"
            },
            "tab3": {
                "name": "Advanced Features",
                "content": "#center#*Advanced Features*#end#\n|||\n✓ Auto-scaling text\n✓ Multiple tabs\n✓ Drag & drop reorder\n✓ Dark/Light theme\n✓ Export/Import sessions"
            },
            "tab4": {
                "name": "Example Slide",
                "content": "*#blue#Main Title#blue#*\n|||\nKey Point 1: #green#Important information#green#\nKey Point 2: ##Highlighted text##\nKey Point 3: *Emphasized message*\n|||\n#center#Thank you!#end#"
            }
        },
        "activeTab": "tab1",
        "config": {
            "prevKey": "ArrowLeft",
            "nextKey": "ArrowRight",
            "isDarkMode": true
        }
    };
    
    const dataStr = JSON.stringify(templateData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'presentation-template.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const importedData = JSON.parse(e.target.result);
            
            // Remove _instructions field if present (it's just metadata for LLMs)
            if (importedData._instructions) {
                delete importedData._instructions;
            }
            
            if (importedData.texts && importedData.activeTab) {
                texts = importedData.texts;
                activeTab = importedData.activeTab;
                config = importedData.config || config;
                updateUI();
                alert('Datos importados correctamente.');
            } else {
                alert('Formato de archivo JSON inválido. Asegúrese de que contenga "texts" y "activeTab".');
            }
        } catch (error) {
            alert('Error al leer el archivo JSON.');
        }
    };
    reader.readAsText(file);
};

// UI update function
const updateUI = () => {
    renderTabs();
    const currentText = typeof texts[activeTab] === 'object'
        ? texts[activeTab].content
        : texts[activeTab];
    textInput.value = currentText || "";
    
    // Trigger animation by removing and re-adding animation
    textContent.style.animation = 'none';
    setTimeout(() => {
        textContent.innerHTML = formatText(currentText || "");
        textContent.style.animation = '';
    }, 10);
    
    saveToLocalStorage();
    
    // Auto-scale text to fit viewport after a short delay to ensure DOM is updated
    setTimeout(() => autoScaleText(), 50);
};

// Menu toggle function
const toggleMenus = () => {
    const isHidden = header.classList.toggle('hidden');
    tabsContainer.classList.toggle('hidden');
    toggleMenuBtn.textContent = isHidden ? '▼☰' : '▲☰';
    showMenuBtn.classList.toggle('visible', isHidden);
};

// Event listeners
textInput.addEventListener('input', (e) => {
    if (typeof texts[activeTab] === 'string') {
        const originalText = texts[activeTab];
        texts[activeTab] = { content: originalText, name: `Pestaña ${activeTab.slice(3)}` };
    }
    texts[activeTab].content = e.target.value;
    textContent.innerHTML = formatText(e.target.value);
    saveToLocalStorage();
    
    // Auto-scale text as user types
    setTimeout(() => autoScaleText(), 50);
});

clearBtn.addEventListener('click', () => {
    if (typeof texts[activeTab] === 'string') {
        texts[activeTab] = "";
    } else {
        texts[activeTab].content = "";
    }
    updateUI();
});

decreaseFontBtn.addEventListener('click', () => updateFontSize('decrease'));
increaseFontBtn.addEventListener('click', () => updateFontSize('increase'));
resetFontBtn.addEventListener('click', resetFontSize);
exportBtn.addEventListener('click', exportData);
importBtn.addEventListener('click', () => importFile.click());
importFile.addEventListener('change', importData);
downloadTemplateBtn.addEventListener('click', downloadTemplate);

toggleMenuBtn.addEventListener('click', toggleMenus);
showMenuBtn.addEventListener('click', toggleMenus);

configBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    prevKeyInput.value = config.prevKey;
    nextKeyInput.value = config.nextKey;
    configModal.style.display = 'flex';
});

closeConfigBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    configModal.style.display = 'none';
});

helpBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    helpModal.style.display = 'flex';
});

closeHelpBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    helpModal.style.display = 'none';
});

document.body.addEventListener('click', (e) => {
    // Check if the click is on the config modal or its trigger button
    if (e.target.closest('#configModal') || e.target.closest('#configBtn')) {
        return;
    }
    if (configModal.style.display === 'flex') {
        configModal.style.display = 'none';
    }
    
    // Check if the click is on the help modal or its trigger button
    if (e.target.closest('#helpModal') || e.target.closest('#helpBtn')) {
        return;
    }
    if (helpModal.style.display === 'flex') {
        helpModal.style.display = 'none';
    }
});

const handleKeypressForConfig = (e) => {
    const key = e.key;
    if (document.activeElement === prevKeyInput) {
        config.prevKey = key;
        prevKeyInput.value = key;
    } else if (document.activeElement === nextKeyInput) {
        config.nextKey = key;
        nextKeyInput.value = key;
    }
    saveToLocalStorage();
};

prevKeyInput.addEventListener('keydown', handleKeypressForConfig);
nextKeyInput.addEventListener('keydown', handleKeypressForConfig);

darkModeToggle.addEventListener('click', () => {
    config.isDarkMode = !config.isDarkMode;
    body.classList.toggle('dark-mode', config.isDarkMode);
    body.classList.toggle('light-mode', !config.isDarkMode);
    darkModeToggle.textContent = config.isDarkMode ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro';
    saveToLocalStorage();
});

window.addEventListener('keydown', (e) => {
    // Close modals with Escape key
    if (e.key === 'Escape') {
        if (configModal.style.display === 'flex') {
            configModal.style.display = 'none';
            return;
        }
        if (helpModal.style.display === 'flex') {
            helpModal.style.display = 'none';
            return;
        }
    }
    
    if (configModal.style.display === 'flex' || helpModal.style.display === 'flex') {
        return; // Do not process keydown if any modal is open
    }
    if (e.key === config.prevKey) {
        previousTab();
    } else if (e.key === config.nextKey) {
        nextTab();
    }
});

document.body.addEventListener('click', (e) => {
    if (!e.target.closest('button, input, .config-modal')) {
        const x = e.clientX;
        const bodyWidth = document.body.offsetWidth;
        if (x < bodyWidth / 2) {
            previousTab();
        } else {
            nextTab();
        }
    }
});

// Auto-scale text when window is resized
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => autoScaleText(), 100);
});

// Initialization
loadFromLocalStorage();
body.classList.toggle('dark-mode', config.isDarkMode);
body.classList.toggle('light-mode', !config.isDarkMode);
darkModeToggle.textContent = config.isDarkMode ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro';
updateUI();
newTabBtn.addEventListener('click', createNewTab);
