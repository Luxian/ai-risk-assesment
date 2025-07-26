let riskData = null;
let selectedInputData = null;
let selectedAiTool = null;
let translations = null;
let currentLanguage = 'en';

// Load translations data
async function loadTranslations() {
    try {
        const response = await fetch('assets/translations.json');
        translations = await response.json();
        return true;
    } catch (error) {
        console.error('Error loading translations:', error);
        return false;
    }
}

// Apply translations to the page
function applyTranslations(lang) {
    if (!translations || !translations[lang]) {
        console.error('Translations not loaded or language not found:', lang);
        return;
    }
    
    currentLanguage = lang;
    const langData = translations[lang];
    
    // Update all elements with data-i18n attributes
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = getNestedTranslation(langData, key);
        
        if (translation) {
            if (element.tagName === 'TITLE') {
                element.textContent = translation;
            } else {
                element.textContent = translation;
            }
        }
    });
    
    // Update document language attribute
    document.documentElement.lang = lang;
    
    // Rebuild form with translated content if risk data is loaded
    if (riskData) {
        buildForm();
    }
}

// Helper function to get nested translation values
function getNestedTranslation(obj, key) {
    return key.split('.').reduce((o, k) => o && o[k], obj);
}

// Language selector functionality
document.addEventListener('DOMContentLoaded', async function() {
    // Load translations first
    await loadTranslations();
    
    // Load saved language preference or default to 'en'
    const savedLang = localStorage.getItem('selectedLanguage') || 'en';
    
    // Apply initial translation
    applyTranslations(savedLang);
    
    // Set up language buttons
    const languageButtons = document.querySelectorAll('.language-btn');
    
    languageButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            languageButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Store selected language
            const selectedLang = this.getAttribute('data-lang');
            localStorage.setItem('selectedLanguage', selectedLang);
            
            // Apply translations
            applyTranslations(selectedLang);
        });
    });
    
    // Set active button based on current language
    const activeButton = document.querySelector(`[data-lang="${savedLang}"]`);
    if (activeButton) {
        languageButtons.forEach(btn => btn.classList.remove('active'));
        activeButton.classList.add('active');
    }
});

// Load risk categories data
async function loadRiskData() {
    try {
        const response = await fetch('assets/risk-categories.json');
        riskData = await response.json();
        buildForm();
    } catch (error) {
        console.error('Error loading risk data:', error);
        document.getElementById('app').innerHTML = '<p>Error loading risk assessment data. Please try again later.</p>';
    }
}

// Build the form with radio buttons
function buildForm() {
    buildInputDataOptions();
    buildAiToolsOptions();
    buildRiskMatrix();
}

// Build input data radio buttons
function buildInputDataOptions() {
    const container = document.getElementById('input-data-options');
    container.innerHTML = '';
    
    Object.entries(riskData.input_data).forEach(([key, data]) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'radio-option';
        
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.id = `input-${key}`;
        radio.name = 'input-data';
        radio.value = key;
        radio.addEventListener('change', onInputDataChange);
        
        const label = document.createElement('label');
        label.htmlFor = `input-${key}`;
        
        // Get translated name and description
        const translatedData = translations?.[currentLanguage]?.inputDataTypes?.[key];
        const displayName = translatedData?.name || key;
        const displayDescription = translatedData?.description || data.description;
        
        label.innerHTML = `
            <strong>${displayName}</strong> (Score: ${data.score})
            <br>
            <span class="description">${displayDescription}</span>
        `;
        
        wrapper.appendChild(radio);
        wrapper.appendChild(label);
        container.appendChild(wrapper);
    });
}

// Build AI tools radio buttons
function buildAiToolsOptions() {
    const container = document.getElementById('ai-tools-options');
    container.innerHTML = '';
    
    Object.entries(riskData.ai_tools).forEach(([key, data]) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'radio-option';
        
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.id = `ai-${key.replace(/\s+/g, '-')}`;
        radio.name = 'ai-tool';
        radio.value = key;
        radio.addEventListener('change', onAiToolChange);
        
        const label = document.createElement('label');
        label.htmlFor = `ai-${key.replace(/\s+/g, '-')}`;
        label.innerHTML = `
            <strong>${key}</strong> - Modifier: +${data.modifier}
            <br>
            <span class="description">${data.type}, ${data.provider}</span>
        `;
        
        wrapper.appendChild(radio);
        wrapper.appendChild(label);
        container.appendChild(wrapper);
    });
}

// Handle input data selection
function onInputDataChange(event) {
    selectedInputData = event.target.value;
    calculateRisk();
}

// Handle AI tool selection
function onAiToolChange(event) {
    selectedAiTool = event.target.value;
    calculateRisk();
}

// Calculate and display risk
function calculateRisk() {
    if (!selectedInputData || !selectedAiTool) {
        document.getElementById('results-section').style.display = 'none';
        return;
    }

    const inputScore = riskData.input_data[selectedInputData].score;
    const aiTool = riskData.ai_tools[selectedAiTool];
    const aiTypeScore = riskData.ai_type_scores[aiTool.type];
    const modifier = aiTool.modifier;
    
    const totalScore = inputScore + aiTypeScore + modifier;
    
    // Find risk level
    const riskLevel = riskData.risk_levels.find(level => 
        totalScore >= level.range[0] && totalScore <= level.range[1]
    );

    // Get translated content
    const translatedAction = translations?.[currentLanguage]?.riskActions?.[riskLevel.action] || riskLevel.action;
    const translatedApprover = translations?.[currentLanguage]?.approvers?.[riskLevel.approver] || riskLevel.approver;
    
    // Display results
    document.getElementById('risk-score').innerHTML = `<strong>Risk Score:</strong> ${totalScore}`;
    document.getElementById('risk-level').innerHTML = `<strong>Risk Level:</strong> ${riskLevel.level}`;
    document.getElementById('risk-action').innerHTML = `<strong>Action Required:</strong> ${translatedAction}`;
    document.getElementById('risk-approver').innerHTML = `<strong>Approver:</strong> ${translatedApprover}`;
    
    // Apply risk level styling
    const resultsSection = document.getElementById('results-section');
    resultsSection.className = `risk-${riskLevel.level.toLowerCase()}`;
    resultsSection.style.display = 'block';
}

// Build risk matrix table with all combinations
function buildRiskMatrix() {
    const tbody = document.getElementById('risk-matrix-body');
    tbody.innerHTML = '';

    Object.entries(riskData.input_data).forEach(([inputKey, inputData]) => {
        Object.entries(riskData.ai_tools).forEach(([aiKey, aiData]) => {
            const inputScore = inputData.score;
            const aiTypeScore = riskData.ai_type_scores[aiData.type];
            const modifier = aiData.modifier;
            const totalScore = inputScore + aiTypeScore + modifier;

            // Find risk level
            const riskLevel = riskData.risk_levels.find(level => 
                totalScore >= level.range[0] && totalScore <= level.range[1]
            );

            // Get translated content
            const translatedInputData = translations?.[currentLanguage]?.inputDataTypes?.[inputKey];
            const displayInputName = translatedInputData?.name || inputKey;
            const translatedAction = translations?.[currentLanguage]?.riskActions?.[riskLevel.action] || riskLevel.action;
            const translatedApprover = translations?.[currentLanguage]?.approvers?.[riskLevel.approver] || riskLevel.approver;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${displayInputName}</strong> (${inputScore})</td>
                <td><strong>${aiKey}</strong> (${aiData.type}, +${modifier})</td>
                <td>${totalScore}</td>
                <td>${riskLevel.level}</td>
                <td>${translatedAction}</td>
                <td>${translatedApprover}</td>
            `;
            
            // Apply risk level class
            row.className = `risk-${riskLevel.level.toLowerCase()}`;
            
            tbody.appendChild(row);
        });
    });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', loadRiskData);