// Wait for DOM to be fully loaded
window.addEventListener('load', function() {
    console.log('Page fully loaded - initializing create_contest.js');
    
    // Get all elements
    const problemsContainer = document.getElementById('problems-container');
    const addProblemBtn = document.getElementById('add-problem-btn');
    const companyProblemsContainer = document.getElementById('company-problems-container');
    const addCompanyProblemBtn = document.getElementById('add-company-problem-btn');
    const form = document.querySelector('form');

    // Debug: Check if elements are found
    console.log('Elements found:', {
        problemsContainer: !!problemsContainer,
        addProblemBtn: !!addProblemBtn,
        companyProblemsContainer: !!companyProblemsContainer,
        addCompanyProblemBtn: !!addCompanyProblemBtn,
        form: !!form
    });

    let problemCount = 0;
    let companyProblemCount = 0;

    // Existing Problems Function
    function addProblemField() {
        console.log('Adding problem field...');
        problemCount++;
        const problemFieldGroup = document.createElement('div');
        problemFieldGroup.className = 'problem-field-group mb-3';

        problemFieldGroup.innerHTML = `
            <div class="row align-items-end">
                <div class="col-md-4">
                    <label class="form-label">Problem Title</label>
                    <input type="text" class="form-control" name="problem_titles[]" placeholder="Problem ${String.fromCharCode(64 + problemCount)} Title" required>
                </div>
                <div class="col-md-3">
                    <label class="form-label">Problem ID</label>
                    <input type="text" class="form-control" name="problem_ids[]" placeholder="e.g., 1" required>
                </div>
                <div class="col-md-3">
                    <label class="form-label">Score</label>
                    <input type="number" class="form-control" name="problem_scores[]" placeholder="100" value="100" required>
                </div>
                <div class="col-md-2">
                    <button type="button" class="btn btn-danger w-100 remove-problem-btn">Remove</button>
                </div>
            </div>
        `;

        problemsContainer.appendChild(problemFieldGroup);

        // Add remove functionality
        const removeBtn = problemFieldGroup.querySelector('.remove-problem-btn');
        removeBtn.addEventListener('click', function() {
            problemFieldGroup.remove();
            problemCount--;
            console.log('Problem removed, count:', problemCount);
        });
    }

    // Company Problems Function
    function addCompanyProblemField() {
        console.log('Adding company problem field...');
        companyProblemCount++;
        const problemFieldGroup = document.createElement('div');
        problemFieldGroup.className = 'company-problem-field-group mb-3';

        problemFieldGroup.innerHTML = `
            <div class="row align-items-end">
                <div class="col-md-4">
                    <label class="form-label">Problem Title</label>
                    <input type="text" class="form-control" name="company_problem_titles[]" placeholder="Company Problem ${companyProblemCount} Title" required>
                </div>
                <div class="col-md-3">
                    <label class="form-label">Problem Name</label>
                    <select class="form-select" name="company_problem_names[]" required>
                        <option value="">Select Problem</option>
                        <option value="ALGO_CHALLENGE_1">Algorithm Challenge 1</option>
                        <option value="DATA_STRUCT_1">Data Structure 1</option>
                        <option value="DYNAMIC_PROG_1">Dynamic Programming 1</option>
                        <option value="GRAPH_PROB_1">Graph Problem 1</option>
                        <option value="STRING_MANIP_1">String Manipulation 1</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <label class="form-label">Score</label>
                    <input type="number" class="form-control" name="company_problem_scores[]" placeholder="100" value="100" required>
                </div>
                <div class="col-md-2">
                    <button type="button" class="btn btn-danger w-100 remove-company-problem-btn">Remove</button>
                </div>
            </div>
        `;

        companyProblemsContainer.appendChild(problemFieldGroup);

        // Add remove functionality
        const removeBtn = problemFieldGroup.querySelector('.remove-company-problem-btn');
        removeBtn.addEventListener('click', function() {
            problemFieldGroup.remove();
            companyProblemCount--;
            console.log('Company problem removed, count:', companyProblemCount);
        });
    }

    // Attach event listeners to buttons
    if (addProblemBtn) {
        addProblemBtn.onclick = function(e) {
            e.preventDefault();
            addProblemField();
        };
        console.log('Add Problem button ready');
    }
    
    if (addCompanyProblemBtn) {
        addCompanyProblemBtn.onclick = function(e) {
            e.preventDefault();
            addCompanyProblemField();
        };
        console.log('Add Company Problem button ready');
    }

    // Add one problem field by default
    if (problemsContainer) {
        addProblemField();
    }

    // Form submission
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submitted');

            // Gather form data
            const contestName = document.getElementById('contestName').value.trim();
            const contestDescription = document.getElementById('contestDescription').value.trim();
            const startTime = document.getElementById('startTime').value;
            const endTime = document.getElementById('endTime').value;

            // Gather existing problems
            const problems = Array.from(document.querySelectorAll('.problem-field-group')).map(group => {
                return {
                    title: group.querySelector('[name="problem_titles[]"]').value.trim(),
                    id: group.querySelector('[name="problem_ids[]"]').value.trim(),
                    score: parseInt(group.querySelector('[name="problem_scores[]"]').value, 10)
                };
            });

            // Gather company problems
            const companyProblems = Array.from(document.querySelectorAll('.company-problem-field-group')).map(group => {
                return {
                    title: group.querySelector('[name="company_problem_titles[]"]').value.trim(),
                    name: group.querySelector('[name="company_problem_names[]"]').value.trim(),
                    score: parseInt(group.querySelector('[name="company_problem_scores[]"]').value, 10)
                };
            });

            // Build payload
            const payload = {
                contestName,
                contestDescription,
                startTime,
                endTime,
                problems,
                companyProblems
            };

            console.log('Sending payload:', payload);

            // Send via AJAX
            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'http://localhost/server/create_contest.php', true);
            xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

            xhr.onreadystatechange = function() {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    console.log('Response status:', xhr.status, 'Response:', xhr.responseText);
                    
                    if (xhr.status >= 200 && xhr.status < 300) {
                        try {
                            const data = JSON.parse(xhr.responseText);
                            
                            if (data.status === 'success') {
                                alert('Contest created successfully!');
                                // Reset form
                                form.reset();
                                problemsContainer.innerHTML = '';
                                companyProblemsContainer.innerHTML = '';
                                problemCount = 0;
                                companyProblemCount = 0;
                                addProblemField();
                            } else {
                                alert('Error: ' + (data.message || 'Unknown error'));
                            }
                        } catch (e) {
                            console.error('Parse error:', e);
                            alert('Server response error. Check console.');
                        }
                    } else {
                        alert('Server error: ' + xhr.status);
                    }
                }
            };

            xhr.onerror = function() {
                alert('Network error. Make sure the server is running.');
            };

            xhr.send(JSON.stringify(payload));
        });
    }
});

// Also try with DOMContentLoaded as a fallback
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded fired');
    // If window.load hasn't fired yet, this will ensure our code runs
    if (document.readyState === 'complete') {
        window.dispatchEvent(new Event('load'));
    }
});