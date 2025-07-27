// Wait for DOM to be fully loaded
window.addEventListener('load', function() {
    console.log('Page fully loaded - initializing create_interview.js');
    
    // Get all elements
    const roundsContainer = document.getElementById('rounds-container');
    const addRoundBtn = document.getElementById('add-round-btn');
    const form = document.getElementById('interview-form');

    let roundCounter = 0;

    // Add Round Function
    function addRoundField() {
        const roundIndex = roundCounter++;
        const roundFieldGroup = document.createElement('div');
        roundFieldGroup.className = 'interview-round-group mb-4 border rounded p-3';
        roundFieldGroup.dataset.roundIndex = roundIndex;

        roundFieldGroup.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="mb-0">Round ${roundIndex + 1}</h5>
                <button type="button" class="btn-close remove-round-btn" aria-label="Close"></button>
            </div>
            <div class="row">
                <div class="col-md-4 mb-3">
                    <label class="form-label">Round Name</label>
                    <input type="text" class="form-control round-name" placeholder="e.g., Technical Round 1" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">Round Start Date & Time</label>
                    <input type="datetime-local" class="form-control round-start" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">Round End Date & Time</label>
                    <input type="datetime-local" class="form-control round-end" required>
                </div>
            </div>
            <hr>
            <h6>Questions for this Round</h6>
            <div class="questions-container ms-2"></div>
            <button type="button" class="btn btn-secondary btn-sm mt-2 add-question-btn">+ Add Question</button>
        `;
        
        roundsContainer.appendChild(roundFieldGroup);
    }

    // Add Question Function
    function addQuestionField(questionsContainer, roundIndex) {
        const questionFieldGroup = document.createElement('div');
        questionFieldGroup.className = 'question-field-group mb-3 border rounded p-3 bg-light';

        questionFieldGroup.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="mb-0">Question</h6>
                <button type="button" class="btn-close btn-close-sm remove-question-btn" aria-label="Remove Question"></button>
            </div>
            <div class="row">
                <div class="col-md-6 mb-2">
                    <label class="form-label small">Question Name</label>
                    <input type="text" class="form-control form-control-sm question-name" placeholder="e.g., Two Sum Problem" required>
                </div>
                <div class="col-md-6 mb-2">
                    <label class="form-label small">Question Type</label>
                    <select class="form-select form-select-sm question-type" required>
                        <option value="Coding">Coding (Algorithm)</option>
                        <option value="Behavioral">Behavioral</option>
                        <option value="System Design">System Design</option>
                        <option value="Database">Database</option>
                        <option value="Technical">Technical Knowledge</option>
                    </select>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <label class="form-label small">Question Description</label>
                    <textarea class="form-control form-control-sm question-description" rows="3" 
                        placeholder="Enter the detailed question description here..." required></textarea>
                </div>
            </div>
        `;
        
        questionsContainer.appendChild(questionFieldGroup);
    }
    
    // Event Listeners
    if (addRoundBtn) {
        addRoundBtn.addEventListener('click', function() {
            addRoundField();
        });
    }
    
    // Delegate event handling for dynamic elements
    if (roundsContainer) {
        roundsContainer.addEventListener('click', function(event) {
            // Remove round
            if (event.target.classList.contains('remove-round-btn')) {
                event.target.closest('.interview-round-group').remove();
            }
            
            // Add question
            if (event.target.classList.contains('add-question-btn')) {
                const roundGroup = event.target.closest('.interview-round-group');
                const questionsContainer = roundGroup.querySelector('.questions-container');
                const roundIndex = roundGroup.dataset.roundIndex;
                addQuestionField(questionsContainer, roundIndex);
            }
            
            // Remove question
            if (event.target.classList.contains('remove-question-btn')) {
                event.target.closest('.question-field-group').remove();
            }
        });
    }

    // Add one round by default
    addRoundField();

    // Form submission
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submitted');

            // Gather form data
            const location_id = document.getElementById('location').value;
            const position_open = document.getElementById('roleName').value.trim();
            const job_description = document.getElementById('jobDescription').value.trim();
            const start_date = document.getElementById('applicationDate').value;
            const job_type = document.getElementById('jobType').value;

            // Gather rounds data
            const rounds = [];
            document.querySelectorAll('.interview-round-group').forEach(function(roundGroup) {
                const round_name = roundGroup.querySelector('.round-name').value.trim();
                const start_datetime = roundGroup.querySelector('.round-start').value;
                const end_datetime = roundGroup.querySelector('.round-end').value;
                
                // Gather questions for this round
                const questions = [];
                roundGroup.querySelectorAll('.question-field-group').forEach(function(questionGroup) {
                    const question_name = questionGroup.querySelector('.question-name').value.trim();
                    const question_type = questionGroup.querySelector('.question-type').value;
                    const question_description = questionGroup.querySelector('.question-description').value.trim();
                    
                    if (question_name && question_description) {
                        questions.push({
                            question_name: question_name,
                            type: question_type,
                            description: question_description
                        });
                    }
                });
                
                if (round_name && start_datetime && end_datetime) {
                    rounds.push({
                        round_name: round_name,
                        start: start_datetime,
                        end: end_datetime,
                        questions: questions
                    });
                }
            });

            // Validate at least one round
            if (rounds.length === 0) {
                alert('Please add at least one interview round');
                return;
            }

            // Build payload
            const payload = {
                location_id: location_id,
                position_open: position_open,
                job_description: job_description,
                start: start_date,
                job_type: job_type,
                rounds: rounds
            };

            console.log('Sending payload:', payload);

            // Send via AJAX
            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'http://localhost/Server/create_interview.php', true);
            xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

            xhr.onreadystatechange = function() {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    console.log('Response status:', xhr.status, 'Response:', xhr.responseText);
                    
                    const statusDiv = document.getElementById('submit-status');
                    
                    if (xhr.status >= 200 && xhr.status < 300) {
                        try {
                            const data = JSON.parse(xhr.responseText);
                            
                            if (data.status === 'success') {
                                statusDiv.innerHTML = `
                                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                                        <strong>Success!</strong> ${data.message}
                                        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                                    </div>
                                `;
                                
                                // Reset form
                                form.reset();
                                roundsContainer.innerHTML = '';
                                roundCounter = 0;
                                addRoundField();
                                
                                // Scroll to top
                                window.scrollTo(0, 0);
                            } else {
                                statusDiv.innerHTML = `
                                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                                        <strong>Error!</strong> ${data.message}
                                        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                                    </div>
                                `;
                            }
                        } catch (e) {
                            console.error('Parse error:', e);
                            statusDiv.innerHTML = `
                                <div class="alert alert-warning alert-dismissible fade show" role="alert">
                                    <strong>Warning!</strong> Server response error. Check console.
                                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                                </div>
                            `;
                        }
                    } else {
                        statusDiv.innerHTML = `
                            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                                <strong>Error!</strong> Server error: ${xhr.status}
                                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                            </div>
                        `;
                    }
                }
            };

            xhr.onerror = function() {
                document.getElementById('submit-status').innerHTML = `
                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                        <strong>Error!</strong> Network error. Make sure the server is running.
                        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                    </div>
                `;
            };

            xhr.send(JSON.stringify(payload));
        });
    }
});

// Also try with DOMContentLoaded as a fallback
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded fired - create_interview.js');
    if (document.readyState === 'complete') {
        window.dispatchEvent(new Event('load'));
    }
});