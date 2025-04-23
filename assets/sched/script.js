// Global variables to store user inputs
let subjects = [];
let schedule = {};
let daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
let userParams = {};

// Step 1: Create subject name inputs based on count
function createSubjectInputs() {
    const subjectCount = parseInt(document.getElementById('subjectCount').value);
    if (isNaN(subjectCount) || subjectCount < 1) {
        alert('Please enter a valid number of subjects');
        return;
    }
    
    const subjectInputsDiv = document.getElementById('subjectInputs');
    subjectInputsDiv.innerHTML = '';
    
    for (let i = 0; i < subjectCount; i++) {
        const div = document.createElement('div');
        div.className = 'subject-box';
        
        const label = document.createElement('label');
        label.textContent = `Subject ${i + 1} Name:`;
        
        const input = document.createElement('input');
        input.type = 'text';
        input.id = `subject-${i}`;
        input.placeholder = `Enter subject ${i + 1} name`;
        input.required = true;
        
        div.appendChild(label);
        div.appendChild(input);
        subjectInputsDiv.appendChild(div);
    }
    
    document.getElementById('step1').classList.add('hidden');
    document.getElementById('step2').classList.remove('hidden');
}

// Step 2: Save subject names and proceed to schedule creation
function saveSubjects() {
    const subjectCount = parseInt(document.getElementById('subjectCount').value);
    subjects = [];
    
    for (let i = 0; i < subjectCount; i++) {
        const subjectName = document.getElementById(`subject-${i}`).value.trim();
        if (!subjectName) {
            alert(`Please enter a name for Subject ${i + 1}`);
            return;
        }
        subjects.push(subjectName);
    }
    
    // Initialize schedule with empty arrays for each day
    daysOfWeek.forEach(day => {
        schedule[day] = [];
    });
    
    document.getElementById('step2').classList.add('hidden');
    document.getElementById('step3').classList.remove('hidden');
    createScheduleInputs();
}

// Step 3: Create schedule inputs for each day
function createScheduleInputs() {
    const scheduleDiv = document.getElementById('schedule');
    scheduleDiv.innerHTML = '';
    
    daysOfWeek.forEach(day => {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day-row';
        
        const dayLabel = document.createElement('div');
        dayLabel.className = 'day-label';
        dayLabel.textContent = day;
        
        const subjectSelector = document.createElement('div');
        subjectSelector.className = 'subject-selector';
        subjectSelector.id = `selector-${day}`;
        
        // Add initial dropdown
        addSubjectDropdown(day, subjectSelector);
        
        dayDiv.appendChild(dayLabel);
        dayDiv.appendChild(subjectSelector);
        scheduleDiv.appendChild(dayDiv);
    });
}

// Helper function to add a subject dropdown
function addSubjectDropdown(day, container) {
    const dropdownDiv = document.createElement('div');
    dropdownDiv.className = 'subject-dropdown';
    
    const select = document.createElement('select');
    select.onchange = function() {
        if (this.value && this.nextElementSibling === null) {
            // Add another dropdown if this one has a value selected
            addSubjectDropdown(day, container);
        }
    };
    
    // Add empty option
    const emptyOption = document.createElement('option');
    emptyOption.value = '';
    emptyOption.textContent = '-- Select Subject --';
    select.appendChild(emptyOption);
    
    // Add subject options
    subjects.forEach(subject => {
        const option = document.createElement('option');
        option.value = subject;
        option.textContent = subject;
        select.appendChild(option);
    });
    
    dropdownDiv.appendChild(select);
    container.appendChild(dropdownDiv);
}

// Step 3: Save the weekly schedule
function saveSchedule() {
    // Clear previous schedule
    daysOfWeek.forEach(day => {
        schedule[day] = [];
    });
    
    // Get selected subjects for each day
    daysOfWeek.forEach(day => {
        const selectorDiv = document.getElementById(`selector-${day}`);
        const selects = selectorDiv.querySelectorAll('select');
        
        selects.forEach(select => {
            if (select.value) {
                schedule[day].push(select.value);
            }
        });
    });
    
    document.getElementById('step3').classList.add('hidden');
    document.getElementById('step4').classList.remove('hidden');
    createAdditionalInputs();
}

// Step 4: Create inputs for holidays, planned leaves, etc.
function createAdditionalInputs() {
    const holidayInputsDiv = document.getElementById('holidayInputs');
    holidayInputsDiv.innerHTML = '';
    
    const plannedLeavesDiv = document.getElementById('plannedLeavesInputs');
    plannedLeavesDiv.innerHTML = '';
    
    const takenLeavesDiv = document.getElementById('takenLeavesInputs');
    takenLeavesDiv.innerHTML = '';
    
    // Create holiday inputs for each day
    daysOfWeek.forEach(day => {
        const div = document.createElement('div');
        div.className = 'param-row';
        
        const label = document.createElement('div');
        label.className = 'param-label';
        label.textContent = `Holidays on ${day}:`;
        
        const input = document.createElement('input');
        input.type = 'number';
        input.id = `holiday-${day}`;
        input.className = 'param-input';
        input.min = '0';
        input.value = '0';
        
        div.appendChild(label);
        div.appendChild(input);
        holidayInputsDiv.appendChild(div);
    });
    
    // Create planned leaves inputs for each day
    daysOfWeek.forEach(day => {
        const div = document.createElement('div');
        div.className = 'param-row';
        
        const label = document.createElement('div');
        label.className = 'param-label';
        label.textContent = `Planned leaves on ${day}:`;
        
        const input = document.createElement('input');
        input.type = 'number';
        input.id = `planned-${day}`;
        input.className = 'param-input';
        input.min = '0';
        input.value = '0';
        
        div.appendChild(label);
        div.appendChild(input);
        plannedLeavesDiv.appendChild(div);
    });
    
    // Create taken leaves inputs for each subject
    subjects.forEach(subject => {
        const div = document.createElement('div');
        div.className = 'param-row';
        
        const label = document.createElement('div');
        label.className = 'param-label';
        label.textContent = `Leaves already taken for ${subject}:`;
        
        const input = document.createElement('input');
        input.type = 'number';
        input.id = `taken-${subject.replace(/\s+/g, '-')}`;
        input.className = 'param-input';
        input.min = '0';
        input.value = '0';
        
        div.appendChild(label);
        div.appendChild(input);
        takenLeavesDiv.appendChild(div);
    });
}

// Step 4: Calculate potential leaves
function calculateLeaves() {
    // Get all parameters
    userParams = {
        weeks: parseInt(document.getElementById('weeks').value),
        minPercentage: parseInt(document.getElementById('minPercentage').value) / 100,
        holidays: {},
        plannedLeaves: {},
        takenLeaves: {}
    };
    
    if (isNaN(userParams.weeks)) {
        alert('Please enter a valid number of weeks');
        return;
    }
    
    // Get holidays for each day
    daysOfWeek.forEach(day => {
        userParams.holidays[day] = parseInt(document.getElementById(`holiday-${day}`).value) || 0;
    });
    
    // Get planned leaves for each day
    daysOfWeek.forEach(day => {
        userParams.plannedLeaves[day] = parseInt(document.getElementById(`planned-${day}`).value) || 0;
    });
    
    // Get taken leaves for each subject
    subjects.forEach(subject => {
        const id = `taken-${subject.replace(/\s+/g, '-')}`;
        userParams.takenLeaves[subject] = parseInt(document.getElementById(id).value) || 0;
    });
    
    // Calculate results
    const results = calculatePotentialLeaves();
    
    // Display results
    displayResults(results);
    
    document.getElementById('step4').classList.add('hidden');
    document.getElementById('results').classList.remove('hidden');
}

// Core calculation function
function calculatePotentialLeaves() {
    const results = {};
    
    // Calculate total classes per subject
    const totalClasses = {};
    subjects.forEach(subject => {
        totalClasses[subject] = 0;
    });
    
    daysOfWeek.forEach(day => {
        const classesPerDay = schedule[day];
        const totalDayOccurrences = userParams.weeks;
        const holidays = userParams.holidays[day];
        const actualDays = totalDayOccurrences - holidays;
        
        classesPerDay.forEach(subject => {
            totalClasses[subject] += actualDays;
        });
    });
    
    // Calculate potential leaves for each subject
    subjects.forEach(subject => {
        const total = totalClasses[subject];
        const taken = userParams.takenLeaves[subject] || 0;
        const minRequired = Math.ceil(total * userParams.minPercentage);
        const maxLeavesAllowed = total - minRequired;
        
        // Calculate planned leaves for this subject
        let plannedLeaves = 0;
        daysOfWeek.forEach(day => {
            if (schedule[day].includes(subject)) {
                plannedLeaves += parseInt(userParams.plannedLeaves[day] || 0);
            }
        });
        
        const potentialLeaves = Math.max(0, maxLeavesAllowed - taken - plannedLeaves);
        
        results[subject] = {
            totalClasses: total,
            minRequired: minRequired,
            maxLeavesAllowed: maxLeavesAllowed,
            takenLeaves: taken,
            plannedLeaves: plannedLeaves,
            potentialLeaves: potentialLeaves
        };
    });
    
    return results;
}

// Display results in a table
function displayResults(results) {
    const resultsTable = document.getElementById('resultsTable');
    resultsTable.innerHTML = '';
    
    const table = document.createElement('table');
    
    // Create header
    const header = table.createTHead();
    const headerRow = header.insertRow();
    const headers = [
        'Subject', 
        'Total Classes', 
        'Minimum Required', 
        'Max Leaves Allowed', 
        'Leaves Taken',
        'Planned Leaves',
        'Potential Leaves Left'
    ];
    
    headers.forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        headerRow.appendChild(th);
    });
    
    // Create body
    const body = table.createTBody();
    
    subjects.forEach(subject => {
        const row = body.insertRow();
        const data = results[subject];
        
        const cells = [
            subject,
            data.totalClasses,
            data.minRequired,
            data.maxLeavesAllowed,
            data.takenLeaves,
            data.plannedLeaves,
            data.potentialLeaves
        ];
        
        cells.forEach((text, index) => {
            const cell = row.insertCell();
            cell.textContent = text;
            
            // Highlight columns
            if (index === 6) { // Potential Leaves column
                if (data.potentialLeaves <= 0) {
                    cell.style.color = '#ff5555';
                } else {
                    cell.style.color = '#55ff55';
                }
                cell.style.fontWeight = 'bold';
            }
            if (index === 5) { // Planned Leaves column
                cell.style.color = '#00e0e0';
                cell.style.fontWeight = 'bold';
            }
        });
    });
    
    resultsTable.appendChild(table);
}

// Reset the form to start over
function resetForm() {
    // Clear all data
    subjects = [];
    schedule = {};
    userParams = {};
    
    // Reset UI
    document.getElementById('subjectCount').value = '1';
    document.getElementById('subjectInputs').innerHTML = '';
    document.getElementById('schedule').innerHTML = '';
    document.getElementById('holidayInputs').innerHTML = '';
    document.getElementById('plannedLeavesInputs').innerHTML = '';
    document.getElementById('takenLeavesInputs').innerHTML = '';
    document.getElementById('resultsTable').innerHTML = '';
    
    // Show first step
    document.getElementById('results').classList.add('hidden');
    document.getElementById('step1').classList.remove('hidden');
}