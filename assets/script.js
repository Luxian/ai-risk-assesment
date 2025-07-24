let riskData = null;
let selectedInputData = null;
let selectedAiTool = null;

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
        label.innerHTML = `
            <strong>${key}</strong> (Score: ${data.score})
            <br>
            <span class="description">${data.description}</span>
        `;
        
        wrapper.appendChild(radio);
        wrapper.appendChild(label);
        container.appendChild(wrapper);
    });
}

// Build AI tools radio buttons
function buildAiToolsOptions() {
    const container = document.getElementById('ai-tools-options');
    
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

    // Display results
    document.getElementById('risk-score').innerHTML = `<strong>Risk Score:</strong> ${totalScore}`;
    document.getElementById('risk-level').innerHTML = `<strong>Risk Level:</strong> ${riskLevel.level}`;
    document.getElementById('risk-action').innerHTML = `<strong>Action Required:</strong> ${riskLevel.action}`;
    document.getElementById('risk-approver').innerHTML = `<strong>Approver:</strong> ${riskLevel.approver}`;
    
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

            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${inputKey}</strong> (${inputScore})</td>
                <td><strong>${aiKey}</strong> (${aiData.type}, +${modifier})</td>
                <td>${totalScore}</td>
                <td>${riskLevel.level}</td>
                <td>${riskLevel.action}</td>
                <td>${riskLevel.approver}</td>
            `;
            
            // Apply risk level class
            row.className = `risk-${riskLevel.level.toLowerCase()}`;
            
            tbody.appendChild(row);
        });
    });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', loadRiskData);