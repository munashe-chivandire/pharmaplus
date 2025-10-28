// API Configuration
// Automatically detects if running locally or in production
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : (window.API_BASE_URL || 'http://localhost:3000'); // Can be overridden by setting window.API_BASE_URL

const API_URL = `${API_BASE_URL}/api/applications`;
const PHOTO_API_URL = `${API_BASE_URL}/api/photo`;

let applicationsData = [];
let selectedApplication = null;

function showError(message) {
    const errorEl = document.getElementById('error');
    errorEl.textContent = message;
    errorEl.classList.remove('hidden');
}

function hideError() {
    document.getElementById('error').classList.add('hidden');
}

function showLoading() {
    document.getElementById('loading').classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loading').classList.add('hidden');
}

async function loadApplications() {
    hideError();
    showLoading();
    document.getElementById('applicationsList').classList.add('hidden');
    document.getElementById('applicationDetail').classList.add('hidden');

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        applicationsData = Array.isArray(data) ? data : [data];

        hideLoading();

        // Update stats
        document.getElementById('appCount').textContent = applicationsData.length;
        document.getElementById('stats').classList.remove('hidden');

        // Log the data structure for debugging
        console.log('Applications loaded:', applicationsData.length);
        console.log('First application structure:', applicationsData[0]);

        displayApplicationsList(applicationsData);
    } catch (error) {
        hideLoading();
        showError(`Error loading applications: ${error.message}. Make sure the proxy server is running (node proxy-server.js)`);
        console.error('Error:', error);
    }
}

function displayApplicationsList(applications) {
    const listEl = document.getElementById('applicationsList');

    if (applications.length === 0) {
        listEl.innerHTML = '<p>No applications found.</p>';
        listEl.classList.remove('hidden');
        return;
    }

    listEl.innerHTML = `
        <h2 style="margin-bottom: 15px;">Applications (${applications.length})</h2>
        ${applications.map((app, index) => `
            <div class="app-card" onclick="selectApplication(${index})">
                <strong>${app.firstName || 'N/A'} ${app.lastName || 'N/A'}</strong> -
                ${app.email || 'No email'} -
                ${app.phoneNumber || 'No phone'} -
                <small>${app.dateSubmitted || app.createdAt || 'No date'}</small>
            </div>
        `).join('')}
    `;
    listEl.classList.remove('hidden');
}

function selectApplication(index) {
    selectedApplication = applicationsData[index];

    // Update selected state
    document.querySelectorAll('.app-card').forEach((card, i) => {
        if (i === index) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    });

    displayQuestForm(selectedApplication);
    document.getElementById('printBtn').disabled = false;
    document.getElementById('jsonToggleBtn').disabled = false;
}

function toggleJsonView() {
    const jsonSection = document.getElementById('jsonSection');
    if (jsonSection) {
        jsonSection.classList.toggle('hidden');
    }
}

// Helper functions
function formatValue(value) {
    if (value === null || value === undefined || value === '') return '';
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return value;
}

function formatDate(dateString) {
    if (!dateString) return { d: '', m: '', y: '' };
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return { d: '', m: '', y: '' };

    return {
        d: String(date.getDate()).padStart(2, '0'),
        m: String(date.getMonth() + 1).padStart(2, '0'),
        y: String(date.getFullYear())
    };
}

function displayQuestForm(app) {
    const detailEl = document.getElementById('applicationDetail');

    // Debug: Log photo and signature fields
    console.log('[DEBUG] Application photo field:', app.photo);
    console.log('[DEBUG] Application signature field:', app.signature);
    console.log('[DEBUG] Full application object:', app);

    const dob = formatDate(app.dateOfBirth);
    const regDate = formatDate(app.registrationStartDate);

    // Count dependents by type
    const dependents = app.dependents || [];
    const adultCount = dependents.filter(d => d.type === 'Adult').length;
    const childCount = dependents.filter(d => d.type === 'Child').length;
    const totalCount = dependents.length;

    detailEl.innerHTML = `
        <div class="quest-form">
            <!-- PAGE 1 -->
            <div class="form-page">
                <!-- Form Header -->
                <div class="form-header">
                    <div class="form-logo">
                        <img src="assets/images/questLogo.jpg" alt="Quest Vitality Logo" style="width: 100%; height: 100%; object-fit: contain;">
                    </div>
                    <div class="form-title">
                        <h1>Membership<br>Application Form</h1>
                        <div class="form-subtitle">Quest Vitality Medical Scheme</div>
                    </div>
                    <div class="form-contact">
                        <strong>Contact Information</strong>
                        0242-783451-2, 762888<br>
                        0772 156 091<br><br>
                        membership@questvitalitymed.com<br>
                        www.questvitalitymed.com<br>
                        questvitalitymed<br><br>
                        06 Rochester Crescent<br>
                        Alexandra Park<br>
                        Harare, Zimbabwe
                    </div>
                </div>

                <!-- Personal Details -->
                <div class="personal-details">
                    <h2>Personal Details</h2>
                    <div class="checkbox-grid">
                        <div class="checkbox-item">
                            <div class="checkbox-box" style="${app.applicationReason === 'new' ? 'background: #0066b2;' : ''}"></div>
                            <div class="checkbox-label">
                                <strong>New member application</strong>
                                <small>Complete All Sections</small>
                            </div>
                        </div>
                        <div class="checkbox-item">
                            <div class="checkbox-box" style="${app.applicationReason === 'change-personal-details' ? 'background: #0066b2;' : ''}"></div>
                            <div class="checkbox-label">
                                <strong>Change of personal details</strong>
                                <small>Complete Section 1,2,3,4,5,6</small>
                            </div>
                        </div>
                        <div class="checkbox-item">
                            <div class="checkbox-box" style="${app.applicationReason === 'change-banking' ? 'background: #0066b2;' : ''}"></div>
                            <div class="checkbox-label">
                                <strong>Change of banking details</strong>
                                <small>Complete Section 1,2,3,5</small>
                            </div>
                        </div>
                        <div class="checkbox-item">
                            <div class="checkbox-box" style="${app.applicationReason === 'dependent-termination' ? 'background: #0066b2;' : ''}"></div>
                            <div class="checkbox-label">
                                <strong>Dependent termination</strong>
                                <small>Complete Section 1,2,3,4,5</small>
                            </div>
                        </div>
                        <div class="checkbox-item">
                            <div class="checkbox-box" style="${app.applicationReason === 'change-package' ? 'background: #0066b2;' : ''}"></div>
                            <div class="checkbox-label">
                                <strong>Change of Package</strong>
                                <small>Complete Section 1,2,3,4,5,8</small>
                            </div>
                        </div>
                        <div class="checkbox-item">
                            <div class="checkbox-box" style="${app.applicationReason === 'change-marital-status' ? 'background: #0066b2;' : ''}"></div>
                            <div class="checkbox-label">
                                <strong>Change of marital status</strong>
                                <small>Complete Section 1,2,3,6</small>
                            </div>
                        </div>
                        <div class="checkbox-item">
                            <div class="checkbox-box" style="${app.applicationReason === 'dependent-registration' ? 'background: #0066b2;' : ''}"></div>
                            <div class="checkbox-label">
                                <strong>Dependent registration</strong>
                                <small>Complete Section 1,2,3,4,5,8</small>
                            </div>
                        </div>
                        <div class="checkbox-item">
                            <div class="checkbox-box" style="${app.applicationReason === 'change-employer' ? 'background: #0066b2;' : ''}"></div>
                            <div class="checkbox-label">
                                <strong>Change of Employer</strong>
                                <small>Complete Section 1,2,3,4,5,8</small>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Section 1: Package Selection -->
                <div class="section-header">
                    Section 1: Package Selection | Please Indicate The Package you wish to join
                </div>
                <div class="package-grid">
                    <div class="package-option">
                        <div class="checkbox-box" style="${app.packageType === 'QUEST ACCESS' ? 'background: #0066b2;' : ''}"></div>
                        <span>QUEST ACCESS</span>
                    </div>
                    <div class="package-option">
                        <div class="checkbox-box" style="${app.packageType === 'QUEST PREMIUM' ? 'background: #0066b2;' : ''}"></div>
                        <span>QUEST PREMIUM</span>
                    </div>
                    <div class="package-option">
                        <div class="checkbox-box" style="${app.packageType === 'QUEST PREMIUM PLUS' ? 'background: #0066b2;' : ''}"></div>
                        <span>QUEST PREMIUM PLUS</span>
                    </div>
                    <div class="package-option">
                        <div class="checkbox-box" style="${app.packageType === 'QUEST EXCELLENCE' ? 'background: #0066b2;' : ''}"></div>
                        <span>QUEST EXCELLENCE</span>
                    </div>
                    <div class="package-option">
                        <div class="checkbox-box" style="${app.packageType === 'QUEST STANDARD' ? 'background: #0066b2;' : ''}"></div>
                        <span>QUEST STANDARD</span>
                    </div>
                    <div class="package-option">
                        <div class="checkbox-box" style="${app.packageType === 'QUEST STUDENT' ? 'background: #0066b2;' : ''}"></div>
                        <span>QUEST STUDENT</span>
                    </div>
                </div>

                <!-- Section 2: Employer Information -->
                <div class="section-header">
                    Section 2: Employer Information | This section must be completed by the employer or account holder
                </div>
                <div class="form-row cols-1">
                    <div class="form-field">
                        <label>Name of Employer/Account Holder</label>
                        <input type="text" value="${formatValue(app.employerName)}">
                    </div>
                </div>
                <div class="form-row cols-2">
                    <div class="form-field">
                        <label>Employer/Account Number</label>
                        <input type="text" value="${formatValue(app.accountNumber)}">
                    </div>
                    <div class="form-field">
                        <label>Payroll/Employee Number</label>
                        <input type="text" value="${formatValue(app.payrollNumber)}">
                    </div>
                </div>
                <div class="form-row cols-3">
                    <div class="form-field">
                        <label>Registration Start Date (D D / M M / Y Y Y Y)</label>
                        <div class="date-input">
                            <input type="text" value="${regDate.d[0] || ''}" maxlength="1">
                            <input type="text" value="${regDate.d[1] || ''}" maxlength="1">
                            <span class="date-separator">/</span>
                            <input type="text" value="${regDate.m[0] || ''}" maxlength="1">
                            <input type="text" value="${regDate.m[1] || ''}" maxlength="1">
                            <span class="date-separator">/</span>
                            <input type="text" value="${regDate.y[0] || ''}" maxlength="1">
                            <input type="text" value="${regDate.y[1] || ''}" maxlength="1">
                            <input type="text" value="${regDate.y[2] || ''}" maxlength="1">
                            <input type="text" value="${regDate.y[3] || ''}" maxlength="1">
                        </div>
                    </div>
                    <div class="form-field" style="grid-column: span 2;">
                        <label>Company Stamp</label>
                        <div class="stamp-box">Company Stamp Area</div>
                    </div>
                </div>

                <table class="form-table" style="margin-top: 10px;">
                    <tr>
                        <th>No of Dependents</th>
                        <th>Adult</th>
                        <th>Child</th>
                        <th>Other</th>
                        <th>Total</th>
                    </tr>
                    <tr>
                        <td></td>
                        <td><input type="text" value="${adultCount}"></td>
                        <td><input type="text" value="${childCount}"></td>
                        <td><input type="text" value="0"></td>
                        <td><input type="text" value="${totalCount}"></td>
                    </tr>
                </table>

                <table class="form-table">
                    <tr>
                        <th colspan="5">Plan Contributions</th>
                    </tr>
                    <tr>
                        <td><input type="text" value="${formatValue(app.planContributions)}"></td>
                    </tr>
                </table>

                <div class="section-instructions" style="margin-top: 10px;">
                    We confirm that the applicant is employed by us and contributions are being deducted according to the Scheme Rules and plan chosen. All sections of the application form have been completed.
                </div>

                <div class="form-row cols-2" style="margin-top: 15px;">
                    <div class="form-field">
                        <label>Name of Salary Administrator</label>
                        <input type="text" value="${formatValue(app.salaryAdministrator)}">
                    </div>
                    <div class="form-field">
                        <label>Signature of Salary Administrator</label>
                        <div class="signature-box">
                            <span class="signature-label">Signature</span>
                        </div>
                    </div>
                </div>
                <div class="form-row cols-2" style="margin-top: -2rem;">
                    <div class="form-field">
                        <label>Date Signed (D D / M M / Y Y Y Y)</label>
                        <div class="date-input">
                            <input type="text" maxlength="1">
                            <input type="text" maxlength="1">
                            <span class="date-separator">/</span>
                            <input type="text" maxlength="1">
                            <input type="text" maxlength="1">
                            <span class="date-separator">/</span>
                            <input type="text" maxlength="1">
                            <input type="text" maxlength="1">
                            <input type="text" maxlength="1">
                            <input type="text" maxlength="1">
                        </div>
                    </div>
                </div>

                <!-- Section 3: Details Of Principal Member -->
                <div class="section-header">
                    Section 3: Details Of Principal Member | This section is mandatory
                </div>
                <div class="form-row cols-4">
                    <div class="form-field">
                        <label>Title</label>
                        <input type="text" value="${formatValue(app.title)}">
                    </div>
                    <div class="form-field" style="grid-column: span 2;">
                        <label>Surname</label>
                        <input type="text" value="${formatValue(app.surname)}">
                    </div>
                    <div class="form-field">
                        <label>Passport Photo</label>
                        ${app.photo ? `
                            <div class="photo-placeholder" style="padding: 0; background: white;">
                                <img src="${PHOTO_API_URL}?path=${encodeURIComponent(app.photo)}"
                                     alt="Passport Photo"
                                     style="width: 100%; height: 100%; object-fit: cover;"
                                     onerror="this.style.display='none'; this.parentElement.style.padding=''; this.parentElement.style.background=''; this.parentElement.textContent='Passport Size Photo';">
                            </div>
                        ` : `
                            <div class="photo-placeholder">Passport Size Photo</div>
                        `}
                    </div>
                </div>
                <div class="form-row cols-3">
                    <div class="form-field">
                        <label>First Name</label>
                        <input type="text" value="${formatValue(app.firstName)}">
                    </div>
                    <div class="form-field">
                        <label>Date Of Birth (D D / M M / Y Y Y Y)</label>
                        <div class="date-input">
                            <input type="text" value="${dob.d[0] || ''}" maxlength="1">
                            <input type="text" value="${dob.d[1] || ''}" maxlength="1">
                            <span class="date-separator">/</span>
                            <input type="text" value="${dob.m[0] || ''}" maxlength="1">
                            <input type="text" value="${dob.m[1] || ''}" maxlength="1">
                            <span class="date-separator">/</span>
                            <input type="text" value="${dob.y[0] || ''}" maxlength="1">
                            <input type="text" value="${dob.y[1] || ''}" maxlength="1">
                            <input type="text" value="${dob.y[2] || ''}" maxlength="1">
                            <input type="text" value="${dob.y[3] || ''}" maxlength="1">
                        </div>
                    </div>
                    <div class="form-field">
                        <label>Ethnic Group</label>
                        <input type="text" value="${formatValue(app.ethnicGroup)}">
                    </div>
                </div>
                <div class="form-row cols-2">
                    <div class="form-field">
                        <label>I.D Number</label>
                        <input type="text" value="${formatValue(app.idNumber)}">
                    </div>
                    <div class="form-field">
                        <label>Membership N.o</label>
                        <input type="text" value="${formatValue(app.membershipNumber || app.id)}">
                    </div>
                </div>
                <div class="form-row cols-2">
                    <div class="form-field">
                        <label>Telephone (H)</label>
                        <input type="text" value="${formatValue(app.phoneHome)}">
                    </div>
                    <div class="form-field">
                        <label>Cell Number</label>
                        <input type="text" value="${formatValue(app.cellNumber)}">
                    </div>
                </div>
                <div class="form-row cols-2">
                    <div class="form-field">
                        <label>Telephone (W)</label>
                        <input type="text" value="${formatValue(app.phoneWork)}">
                    </div>
                    <div class="form-field">
                        <label>Email</label>
                        <input type="text" value="${formatValue(app.email)}">
                    </div>
                </div>
                <div class="form-row cols-2">
                    <div class="form-field">
                        <label>Physical Address</label>
                        <textarea>${formatValue(app.physicalAddress)}</textarea>
                    </div>
                    <div class="form-field">
                        <label>Postal Address</label>
                        <input type="text" value="${formatValue(app.postalAddress)}">
                    </div>
                </div>
                <div class="form-row cols-2">
                    <div class="form-field">
                        <label>GP Nomination - Name</label>
                        <input type="text" value="${formatValue(app.gpName)}">
                    </div>
                    <div class="form-field">
                        <label>GP Nomination - Contact Details</label>
                        <input type="text" value="${formatValue(app.gpPhone)}">
                    </div>
                </div>

                <div class="form-footer">
                    STEP INTO HEALTH AND WELLNESS
                </div>
            </div>

            <!-- PAGE 2 -->
            ${generatePage2(app)}

            <!-- PAGE 3 -->
            ${generatePage3(app)}

            <!-- PAGE 4 -->
            ${generatePage4(app)}
        </div>
    `;

    detailEl.classList.remove('hidden');
    detailEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function generatePage2(app) {
    return `
        <div class="form-page">
            <!-- Section 4: Registration Or Addition Of Dependents -->
            <div class="section-header">
                Section 4: Registration Or Addition Of Dependents Spouse/Child/New-born/Adult dependent
            </div>
            <div class="section-instructions">
                Adult rates apply to any dependent who is 18 years and older. Child rates apply to full time students aged between 18-25 years provided proof is attached to the application form for the current academic studies. Acceptance of the dependents will be in accordance with the rules of the Scheme.
            </div>

            <table class="form-table">
                <tr>
                    <th>First Name</th>
                    <th>Surname</th>
                    <th colspan="8">Date Of Birth (D D M M Y Y Y Y)</th>
                    <th>Relationship</th>
                    <th colspan="2">Gender</th>
                    <th>I.D Number</th>
                    <th>Contact Number</th>
                </tr>
                ${generateDependentRows(app.dependents, 6)}
            </table>

            <div class="section-instructions">
                I hereby instruct Quest Vitality Scheme to deposit claim refunds using the information provided below and authorize the Scheme to reverse any erroneous transactions and/or rectify any electronic fund transfer errors without prior notice.
            </div>

            <!-- Section 5: Banking Details -->
            <div class="section-header">
                Section 5: Banking Details
                <label style="float: right; font-weight: normal;">
                    <input type="checkbox" style="margin-left: 10px;"> Use This Account For Claims Refunds
                </label>
            </div>
            <div class="form-row cols-1">
                <div class="form-field">
                    <label>Name of Bank</label>
                    <input type="text" value="${formatValue(app.bankName)}">
                </div>
            </div>
            <div class="form-row cols-2">
                <div class="form-field">
                    <label>Bank Account Number (ZiG)</label>
                    <input type="text" value="${formatValue(app.bankAccountNumberZIG)}">
                </div>
                <div class="form-field">
                    <label>Branch Code</label>
                    <input type="text" value="${formatValue(app.bankBranchCodeZIG)}">
                </div>
            </div>
            <div class="form-row cols-2">
                <div class="form-field">
                    <label>Bank Account Number (FCA)</label>
                    <input type="text" value="${formatValue(app.bankAccountNumberUSD)}">
                </div>
                <div class="form-field">
                    <label>Branch Code</label>
                    <input type="text" value="${formatValue(app.bankBranchCodeUSD)}">
                </div>
            </div>
            <div class="form-row cols-2">
                <div class="form-field">
                    <label>Branch</label>
                    <input type="text" value="${formatValue(app.bankBranch)}">
                </div>
                <div class="form-field">
                    <label>Mobile Banking Details</label>
                    <input type="text" value="${formatValue(app.mobileBankingDetails)}">
                </div>
            </div>

            <!-- Section 6: Amendment Of Dependants -->
            <div class="section-header">
                Section 6: Amendment Of Dependants | Change of details or Termination of Dependents
            </div>
            <div class="section-instructions">
                Please attach certified copies of Marriage Certificate/ ID for change of surname or DOB. Attach a copy of death certificate if termination is due to death.
            </div>

            <table class="form-table">
                <tr>
                    <th>Full Name</th>
                    <th colspan="8">Date Of Birth (D D M M Y Y Y Y)</th>
                    <th>Amend</th>
                    <th>Remove</th>
                    <th colspan="8">Deletion Date (D D M M Y Y Y Y)</th>
                </tr>
                ${generateAmendmentRows(5)}
            </table>

            <div class="form-row cols-1" style="margin-top: 10px;">
                <div class="form-field">
                    <label>Reason for Amendment/Termination</label>
                    <textarea>${formatValue(app.amendmentReason)}</textarea>
                </div>
            </div>

            <!-- Section 7: Details Of Previous Medical Aid -->
            <div class="section-header" style="page-break-before: always;">
                Section 7: Details Of Previous Medical Aid | Please attach certificate of last medical aid if any.
            </div>
            <div class="section-instructions">
                Have condition specific waiting periods, exclusions or late joiner penalties ever been imposed on the member or dependent on application for membership of any other medical aid scheme.
            </div>

            <table class="form-table">
                <tr>
                    <th>Name of Medical Aid Insurance</th>
                    <th>Scheme/Package</th>
                    <th>Membership Number</th>
                    <th colspan="8">Date Joined (D D M M Y Y Y Y)</th>
                    <th colspan="8">Date Left (D D M M Y Y Y Y)</th>
                </tr>
                ${generatePreviousMedicalRows(app, 3)}
            </table>

            <div class="form-footer">
                STEP INTO HEALTH AND WELLNESS
            </div>
        </div>
    `;
}

function generatePage3(app) {
    // Helper to find question by ID
    const findQuestion = (id) => {
        return (app.medicalHistoryQuestions || []).find(q => q.id === id);
    };

    const chronicQ = findQuestion('chronic-illnesses');
    const digestiveQ = findQuestion('digestive-disorders');
    const muscleBoneQ = findQuestion('muscle-bone-disorders');
    const urinaryQ = findQuestion('urinary-gynaecological');
    const earNoseQ = findQuestion('ear-nose-throat-eye');
    const pregnancyQ = findQuestion('pregnancy');
    const surgeryQ = findQuestion('surgery');

    return `
        <div class="form-page">
            <div class="section-header">
                SECTION 8: MEDICAL HISTORY
            </div>
            <div class="section-instructions">
                Please note: It is compulsory to answer each question. Failure to disclose medical conditions could limit and/or exclude you or your dependents from receiving certain benefits or result in termination of your membership.
            </div>

            ${generateMedicalQuestion(1, 'Any Chronic illnesses. Cardio and Vascular conditions, Obstructive lung diseases, Diabetes, High or Low blood pressure, Raised Cholesterol Asthma, Depression, Anxiety, Systematic lupus erythematosus, Epilepsy, Thyroid disorders? If yes, please provide details.', chronicQ, app)}

            ${generateMedicalQuestion(2, 'Digestive system or Stomach disorders? Liver failure, Gall bladder or pancreas, Stomach or duodenal ulcer, Hiatus hernia, Crohn\'s disease, Irritable bowel syndrome, Rectal bleeding, Hepatitis. If yes, please provide details.', digestiveQ, app)}

            ${generateMedicalQuestion(3, 'Muscle, Bone, Dental, Orthodontic condition, Skin or nerve illness or disorders. Acne, Eczema or psoriasis, Multiple sclerosis, Back injury/neck or joint problems or replacements, Arthritis, Prosthetic limbs, Gout, Stroke, Blackouts, Migraine, Alzheimer\'s etc. If yes, please provide details.', muscleBoneQ, app)}

            ${generateMedicalQuestion(4, 'Urinary tract, genital /Gynaecological disorders? e.g. UTI, Kidney stones, Kidney Failure, Prostatitis, Ovarian cysts, Fibroids, etc., If yes please provide details.', urinaryQ, app)}

            ${generateMedicalQuestion(5, 'Any Chronic illnesses. Cardio and Vascular conditions, Obstructive lung diseases, Diabetes, High or Low blood pressure, Raised Cholesterol Asthma, Depression, Anxiety, Systematic lupus erythematosus, Epilepsy, Thyroid disorders? If yes, please provide details.', chronicQ, app)}

            ${generateMedicalQuestion(6, 'Ear, Nose, Throat or Eye disorders? Defective vision, Cataracts, Glaucoma, Blindness, Retinitis, wear spectacles or contact lenses, Hearing loss, Ear discharge, Allergies, recurrent Tonsillitis, etc. If yes, please provide details.', earNoseQ, app)}

            ${generatePregnancyQuestion(app, pregnancyQ)}

            ${generateMedicalQuestion(8, 'Have you or any of your dependents had surgery in the past 12 months, or are you planning to have surgical procedure in the next 12 months? Or any other condition not stated above? If yes, please provide details', surgeryQ, app)}

            <div class="form-footer">
                STEP INTO HEALTH AND WELLNESS
            </div>
        </div>
    `;
}

function generatePage4(app) {
    return `
        <div class="form-page" style="page-break-before: always;">
            <div class="section-header">
                TERMS & CONDITIONS
            </div>

            <div class="terms-section">
                <div class="terms-content">
                    This form should be completed by applicants (I) joining Quest Vitality Medical Scheme for the first time, (ii) adding or terminating dependents, (iii) changing personal details, marital status, banking details, migrating or switching to new packages. Please note, all sections are mandatory for new applicants.
                </div>

                <h3>Section 1: Package Selection</h3>
                <div class="terms-content">
                    Quest Vitality Medical Scheme offers a variety of packages. Please tick the appropriate package you wish to join. This should be approved by employer if joining through an employer.
                </div>

                <h3>Section 2: Employer /Account Holder Information</h3>
                <div class="terms-content">
                    This section should be completed by the person who will be responsible for paying contributions either the account holder or your employer. designated officer or person responsible for remitting contributions to Quest Vitality Medical Scheme. Employer or member firms need to check filled details, sign and stamp to authorise the form for applicant to be registered on Quest Vitality Medical Scheme.
                </div>

                <h3>Section 3: Details Of Principal Members</h3>
                <div class="terms-content">
                    The details of the Principal member must be entered here. Settlement Advice statements and refunds will be made out to the principal member only. Please enter these details as they appear on your identity document. Please note, you may be asked to produce this together with membership card when accessing treatment by providers of health services. Ethnic group is required for statistical purposes only. State e.g. African, Asian, European, etc.
                </div>

                <h3>Section 4: Member Banking Details</h3>
                <div class="terms-content">
                    The Scheme has an Electronic Funds Transfer facility that allows members claims refunds to be paid directly into their bank account or mobile bank account. Refunds will be made out only to the principal member.
                </div>

                <h3>Section 5: Registration Of Dependants</h3>
                <div class="terms-content">
                    You can add people who rely on you for financial support to your medical aid, especially a family member (i.e. spouse, children, in certain circumstances Other/Adult dependents. The Scheme may request a medical report before accepting other family members as dependants. Relationship to members describes the relationship of the dependent to the principal member, Spouse or child are normal dependents. Other/Adult Dependent" refers to anyone who is not a direct dependent e.g. mother, father etc. Adult rates apply to any dependent who is 18 years and older. Child rates apply to full time students aged between 18-25 years provided proof is attached to the application form.
                </div>

                <h3>Section 6: Amendment Of Dependants</h3>
                <div class="terms-content">
                    This section must be completed when terminating dependents from Quest Vitality Medical Scheme or when changing details of dependent such as names e.g. due to marriage, certified copies of ID, marriage certificate etc. should be attached.
                </div>

                <h3>Section 7: Details Of Previous Medical Aid</h3>
                <div class="terms-content">
                    If you have been a member of another medical aid society or was on another health insurance cover, please provide details
                </div>

                <h3>Section 8: Medical History</h3>
                <div class="terms-content">
                    You need to inform the Scheme, if you or any of the family members you are registering are currently undergoing or likely to require medical treatment. It is very important that you disclose all information here as failure to do so may result in your membership being terminated. Nomination of a Family Practitioner is important so that we can register their details for Managed Care purposes.
                </div>

                <h3>Acknowledgment</h3>
                <div class="terms-content">
                    I undertake to familiarize myself with the Quest Vitality Medical Scheme Constitution, Quest Vitality Medical Scheme Membership Rules and regulations. I will ensure that I am familiar with the benefits of my chosen package and fully understand the terms and conditions of enjoying or accessing those benefits BEFORE signing this form. As the Quest Vitality Medical Scheme constitution, Quest Vitality Medical Scheme Membership Rules and regulations, package benefits and the terms and conditions of accessing these packages change from time to time, it is my responsibility as a member to constantly track and understand these changes throughout my membership period. Every member on joining the Scheme is deemed to be aware and in agreement with the Quest Vitality Medical Scheme Constitution, Quest Vitality Medical Scheme Membership Rules and regulations, package benefits and attending terms and conditions of accessing the same.
                </div>

                <h3>Declaration and Signature</h3>
                <div class="terms-content">
                    I hereby certify that the information given above is correct in all aspects. I agree that should this application be accepted, the contract between myself and the Scheme shall be strictly governed by the Quest Vitality Medical Scheme Constitution and the Quest Vitality Medical Scheme Membership Rules, and Regulations, as amended from time to time by the Scheme. I have familiarized myself with all these documents and make this application in light thereof. I also confirm that I have fully familiarized myself with the benefits that I am entitled to in my chosen package together with the terms and conditions of accessing the same. I authorize monthly deduction of subscriptions from my salary due in respect of myself and my dependents. I also authorize Quest Vitality Medical Scheme to access my medical records from any health service provider for any reason whatsoever. I further declare that these dependents do not suffer from any conditions not declared. NB: Please read the notes on section 8 and acknowledgment above before signing this form.
                </div>
            </div>

            <div class="signature-row" style="margin-top: 6rem;">
                <div class="signature-box" style="position: relative;">
                    ${app.signature ? `
                        <img src="${PHOTO_API_URL}?path=${encodeURIComponent(app.signature)}"
                             alt="Signature"
                             style="position: absolute; top: 1.5rem; right: calc(10px + 6rem); width: 120px; height: auto; object-fit: contain;"
                             onerror="this.style.display='none'; this.nextElementSibling.textContent='[Signature not available]'; this.nextElementSibling.style.position='absolute'; this.nextElementSibling.style.top='1.5rem'; this.nextElementSibling.style.right='calc(10px + 6rem)'; this.nextElementSibling.style.fontSize='0.9rem'; this.nextElementSibling.style.color='#999';">
                    ` : `
                        <span style="position: absolute; top: 1.5rem; right: calc(10px + 6rem); font-size: 0.9rem; color: #999;">[Signature not available]</span>
                    `}
                    <span class="signature-label">Signature of Principal Member</span>
                </div>
                <div class="form-field">
                    <label>Date Signed (D D / M M / Y Y Y Y)</label>
                    <div class="date-input">
                        ${(() => {
                            const today = new Date();
                            const day = String(today.getDate()).padStart(2, '0');
                            const month = String(today.getMonth() + 1).padStart(2, '0');
                            const year = String(today.getFullYear());
                            return `
                                <input type="text" value="${day[0]}" maxlength="1">
                                <input type="text" value="${day[1]}" maxlength="1">
                                <span class="date-separator">/</span>
                                <input type="text" value="${month[0]}" maxlength="1">
                                <input type="text" value="${month[1]}" maxlength="1">
                                <span class="date-separator">/</span>
                                <input type="text" value="${year[0]}" maxlength="1">
                                <input type="text" value="${year[1]}" maxlength="1">
                                <input type="text" value="${year[2]}" maxlength="1">
                                <input type="text" value="${year[3]}" maxlength="1">
                            `;
                        })()}
                    </div>
                </div>
            </div>

            <div class="checklist" style="page-break-before: always;">
                <h3>To avoid delays in processing your application, please provide the following documents where applicable and use the check list to make sure you have completed your application form in full.</h3>
                <div class="checklist-item">
                    <span>Have you completed all fields on the application form?</span>
                    <div class="checklist-box"></div>
                </div>
                <div class="checklist-item">
                    <span>Has your employer signed or stamped your application form?</span>
                    <div class="checklist-box"></div>
                </div>
                <div class="checklist-item">
                    <span>Have you provided us with your banking details?</span>
                    <div class="checklist-box"></div>
                </div>
                <div class="checklist-item">
                    <span>Have you ticked the Plan you wish to be registered on?</span>
                    <div class="checklist-box"></div>
                </div>
                <div class="checklist-item">
                    <span>Have you signed the form? (Unsigned forms will not be processed and may be returned for your signature)</span>
                    <div class="checklist-box"></div>
                </div>
                <div class="checklist-item">
                    <span>Have you attach copy of marriage certificate/Affidavit for change of Surname?</span>
                    <div class="checklist-box"></div>
                </div>
                <div class="checklist-item">
                    <span>Have you attached proof of Studentship for child dependents above 18?</span>
                    <div class="checklist-box"></div>
                </div>
                <div class="checklist-item">
                    <span>Have you attached proof of previous medical insurance? (certificate of membership with end date)</span>
                    <div class="checklist-box"></div>
                </div>
                <div class="checklist-item">
                    <span>Attach photos for all beneficiaries. (Write full names of beneficiary at the back of the passport size photo)</span>
                    <div class="checklist-box"></div>
                </div>
            </div>

            <div class="form-footer">
                STEP INTO HEALTH AND WELLNESS
            </div>
        </div>
    `;
}

function generateDependentRows(dependents, count) {
    let rows = '';
    const deps = dependents || [];

    for (let i = 0; i < count; i++) {
        const dep = deps[i] || {};
        const dob = formatDate(dep.dateOfBirth);

        // Derive gender from title field
        const title = dep.title ? dep.title.toLowerCase() : '';
        const isMale = title === 'mr' || title === 'master';
        const isFemale = title === 'miss' || title === 'mrs' || title === 'ms';

        rows += `
            <tr>
                <td><input type="text" value="${formatValue(dep.firstName)}"></td>
                <td><input type="text" value="${formatValue(dep.surname)}"></td>
                <td><input type="text" value="${dob.d[0] || ''}" maxlength="1" style="width: 20px;"></td>
                <td><input type="text" value="${dob.d[1] || ''}" maxlength="1" style="width: 20px;"></td>
                <td><input type="text" value="${dob.m[0] || ''}" maxlength="1" style="width: 20px;"></td>
                <td><input type="text" value="${dob.m[1] || ''}" maxlength="1" style="width: 20px;"></td>
                <td><input type="text" value="${dob.y[0] || ''}" maxlength="1" style="width: 20px;"></td>
                <td><input type="text" value="${dob.y[1] || ''}" maxlength="1" style="width: 20px;"></td>
                <td><input type="text" value="${dob.y[2] || ''}" maxlength="1" style="width: 20px;"></td>
                <td><input type="text" value="${dob.y[3] || ''}" maxlength="1" style="width: 20px;"></td>
                <td><input type="text" value="${formatValue(dep.relationship)}"></td>
                <td style="text-align: center; ${isMale ? 'background: #0066b2; color: white; font-weight: bold;' : ''}">M</td>
                <td style="text-align: center; ${isFemale ? 'background: #0066b2; color: white; font-weight: bold;' : ''}">F</td>
                <td style="width: 150px;"><input type="text" value="${formatValue(dep.idNumber)}" style="width: 100%;"></td>
                <td><input type="text" value="${formatValue(dep.contactNumber)}"></td>
            </tr>
        `;
    }

    return rows;
}

function generateAmendmentRows(count) {
    let rows = '';

    for (let i = 0; i < count; i++) {
        rows += `
            <tr>
                <td><input type="text"></td>
                <td><input type="text" maxlength="1" style="width: 20px;"></td>
                <td><input type="text" maxlength="1" style="width: 20px;"></td>
                <td><input type="text" maxlength="1" style="width: 20px;"></td>
                <td><input type="text" maxlength="1" style="width: 20px;"></td>
                <td><input type="text" maxlength="1" style="width: 20px;"></td>
                <td><input type="text" maxlength="1" style="width: 20px;"></td>
                <td><input type="text" maxlength="1" style="width: 20px;"></td>
                <td><input type="text" maxlength="1" style="width: 20px;"></td>
                <td style="text-align: center;"></td>
                <td style="text-align: center;"></td>
                <td><input type="text" maxlength="1" style="width: 20px;"></td>
                <td><input type="text" maxlength="1" style="width: 20px;"></td>
                <td><input type="text" maxlength="1" style="width: 20px;"></td>
                <td><input type="text" maxlength="1" style="width: 20px;"></td>
                <td><input type="text" maxlength="1" style="width: 20px;"></td>
                <td><input type="text" maxlength="1" style="width: 20px;"></td>
                <td><input type="text" maxlength="1" style="width: 20px;"></td>
                <td><input type="text" maxlength="1" style="width: 20px;"></td>
            </tr>
        `;
    }

    return rows;
}

function generatePreviousMedicalRows(app, count) {
    let rows = '';

    for (let i = 0; i < count; i++) {
        rows += `
            <tr>
                <td><input type="text"></td>
                <td><input type="text"></td>
                <td><input type="text"></td>
                <td><input type="text" maxlength="1" style="width: 20px;"></td>
                <td><input type="text" maxlength="1" style="width: 20px;"></td>
                <td><input type="text" maxlength="1" style="width: 20px;"></td>
                <td><input type="text" maxlength="1" style="width: 20px;"></td>
                <td><input type="text" maxlength="1" style="width: 20px;"></td>
                <td><input type="text" maxlength="1" style="width: 20px;"></td>
                <td><input type="text" maxlength="1" style="width: 20px;"></td>
                <td><input type="text" maxlength="1" style="width: 20px;"></td>
                <td><input type="text" maxlength="1" style="width: 20px;"></td>
                <td><input type="text" maxlength="1" style="width: 20px;"></td>
                <td><input type="text" maxlength="1" style="width: 20px;"></td>
                <td><input type="text" maxlength="1" style="width: 20px;"></td>
                <td><input type="text" maxlength="1" style="width: 20px;"></td>
                <td><input type="text" maxlength="1" style="width: 20px;"></td>
                <td><input type="text" maxlength="1" style="width: 20px;"></td>
                <td><input type="text" maxlength="1" style="width: 20px;"></td>
            </tr>
        `;
    }

    return rows;
}

function generateMedicalQuestion(number, question, questionData, app) {
    const answer = questionData?.answer || '';
    const conditions = questionData?.conditions || [];

    // Helper to get beneficiary name
    const getBeneficiaryName = (dependentId) => {
        if (dependentId === 'self') {
            return `${app.firstName || ''} ${app.surname || ''}`.trim() || 'Principal Member';
        }

        const match = dependentId.match(/dependent-(\d+)/);
        if (match && app.dependents) {
            const index = parseInt(match[1]);
            const dependent = app.dependents[index];
            if (dependent) {
                return `${dependent.firstName || ''} ${dependent.surname || ''}`.trim();
            }
        }
        return '';
    };

    // Generate rows for conditions or empty row
    const conditionRows = conditions.length > 0 ? conditions.map(condition => `
        <tr>
            <td><input type="text" value="${formatValue(getBeneficiaryName(condition.dependentId))}"></td>
            <td><input type="text" value="${formatValue(condition.nameOfCondition)} - ${formatValue(condition.dateDiagnosed)}"></td>
            <td style="text-align: center;">${condition.currentlyReceivingTreatment === 'yes' ? 'Y' : condition.currentlyReceivingTreatment === 'no' ? 'N' : 'Y / N'}</td>
            <td><input type="text" value="${formatValue(condition.dateOfLastTreatment || condition.treatment)}"></td>
            <td><input type="text" value="${formatValue(condition.nameOfMedication)}"></td>
            <td><input type="text" value="${formatValue(condition.attendingGPSpecialist)}"></td>
        </tr>
    `).join('') : `
        <tr>
            <td><input type="text"></td>
            <td><input type="text"></td>
            <td style="text-align: center;">Y / N</td>
            <td><input type="text"></td>
            <td><input type="text"></td>
            <td><input type="text"></td>
        </tr>
    `;

    return `
        <div class="medical-question">
            <div class="medical-question-header">
                <div class="question-number">${number}</div>
                <div class="question-text">${question}</div>
                <div class="yn-toggle">
                    <div class="yn-option" style="${answer === 'yes' ? 'background: #0066b2; color: white;' : ''}">Y</div>
                    <div class="yn-option" style="${answer === 'no' ? 'background: #0066b2; color: white;' : ''}">N</div>
                </div>
            </div>
            <table class="form-table" style="margin: 0;">
                <tr>
                    <th>Name Of Beneficiary</th>
                    <th>Name Of Condition And Date Diagnosed</th>
                    <th>Are You Currently Receiving Treatments?</th>
                    <th>Date Of Last Treatment</th>
                    <th>Name Of Medication</th>
                    <th>Attending GP/Specialist</th>
                </tr>
                ${conditionRows}
            </table>
        </div>
    `;
}

function generatePregnancyQuestion(app, questionData) {
    const answer = questionData?.answer || '';
    const conditions = questionData?.conditions || [];

    // Helper to get beneficiary name
    const getBeneficiaryName = (dependentId) => {
        if (dependentId === 'self') {
            return `${app.firstName || ''} ${app.surname || ''}`.trim() || 'Principal Member';
        }

        const match = dependentId.match(/dependent-(\d+)/);
        if (match && app.dependents) {
            const index = parseInt(match[1]);
            const dependent = app.dependents[index];
            if (dependent) {
                return `${dependent.firstName || ''} ${dependent.surname || ''}`.trim();
            }
        }
        return '';
    };

    // Generate rows for pregnancy details or empty row
    const pregnancyRows = conditions.length > 0 ? conditions.map(condition => `
        <tr>
            <td><input type="text" value="${formatValue(getBeneficiaryName(condition.dependentId))}"></td>
            <td><input type="text" value="${formatValue(condition.expectedDateOfDelivery)}"></td>
            <td><input type="text" value="${formatValue(condition.attendingDoctor || condition.attendingGPSpecialist)}"></td>
        </tr>
    `).join('') : `
        <tr>
            <td><input type="text"></td>
            <td><input type="text"></td>
            <td><input type="text"></td>
        </tr>
    `;

    return `
        <div class="medical-question">
            <div class="medical-question-header">
                <div class="question-number">7</div>
                <div class="question-text">Are you or any of your dependents pregnant? If yes, please provide details</div>
                <div class="yn-toggle">
                    <div class="yn-option" style="${answer === 'yes' ? 'background: #0066b2; color: white;' : ''}">Y</div>
                    <div class="yn-option" style="${answer === 'no' ? 'background: #0066b2; color: white;' : ''}">N</div>
                </div>
            </div>
            <table class="form-table" style="margin: 0;">
                <tr>
                    <th>Name Of Beneficiary</th>
                    <th>Expected Date Of Delivery</th>
                    <th>Attending Doctor</th>
                </tr>
                ${pregnancyRows}
            </table>
        </div>
    `;
}
