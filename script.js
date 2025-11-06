// Основной скрипт для PerioPlatforma
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация системы
    initializeSystem();
    
    // Управление навигацией
    setupNavigation();
    
    // Управление модальными окнами
    setupModals();
    
    // Инициализация демо-данных
    initializeDemoData();
});

// Инициализация системы
function initializeSystem() {
    // Бургер-меню для мобильных устройств
    const burgerMenu = document.getElementById('burgerMenu');
    const sidebar = document.querySelector('.sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    if (burgerMenu && sidebar && sidebarOverlay) {
        burgerMenu.addEventListener('click', function() {
            this.classList.toggle('active');
            sidebar.classList.toggle('active');
            sidebarOverlay.classList.toggle('active');
        });

        sidebarOverlay.addEventListener('click', function() {
            burgerMenu.classList.remove('active');
            sidebar.classList.remove('active');
            this.classList.remove('active');
        });
    }

    // Обработка изменения размера окна
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            const burger = document.getElementById('burgerMenu');
            const sidebar = document.querySelector('.sidebar');
            const overlay = document.getElementById('sidebarOverlay');
            
            if (burger) burger.classList.remove('active');
            if (sidebar) sidebar.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
        }
    });
}

// Настройка навигации между страницами
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('data-page');
            
            // Скрываем все страницы
            pages.forEach(page => page.classList.remove('active'));
            
            // Показываем целевую страницу
            const targetElement = document.getElementById(`${targetPage}-page`);
            if (targetElement) {
                targetElement.classList.add('active');
            }
            
            // Обновляем активный пункт меню
            navLinks.forEach(nav => nav.parentElement.classList.remove('active'));
            this.parentElement.classList.add('active');
            
            // Закрываем мобильное меню
            if (window.innerWidth <= 768) {
                const burger = document.getElementById('burgerMenu');
                const sidebar = document.querySelector('.sidebar');
                const overlay = document.getElementById('sidebarOverlay');
                
                if (burger) burger.classList.remove('active');
                if (sidebar) sidebar.classList.remove('active');
                if (overlay) overlay.classList.remove('active');
            }
            
            // Загружаем данные для страницы
            loadPageData(targetPage);
        });
    });
}

// Загрузка данных для конкретной страницы
function loadPageData(page) {
    switch(page) {
        case 'patients':
            loadAllPatients();
            break;
        case 'examinations':
            loadAllExaminations();
            break;
        case 'reports':
            loadReports();
            break;
        case 'settings':
            loadSettings();
            break;
        default:
            // Главная страница уже загружена
            break;
    }
}

// Настройка модальных окон
function setupModals() {
    setupPatientModal();
    setupExamModal();
    setupPatientCardModal();
    setupSearch();
}

// Модальное окно добавления пациента
function setupPatientModal() {
    const modal = document.getElementById('patientModal');
    const openModalBtns = document.querySelectorAll('#addPatientBtn, #addPatientBtn2, #quickAddPatient');
    const closeModalBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const patientForm = document.getElementById('patientForm');

    // Функции открытия/закрытия модального окна
    function openModal() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        patientForm.reset();
        clearErrors();
    }

    // Обработчики событий для открытия модального окна
    openModalBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', openModal);
        }
    });

    // Обработчики событий для закрытия модального окна
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }

    // Закрытие по клику вне модального окна
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Закрытие по ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Валидация формы
    function validateForm() {
        let isValid = true;
        const requiredFields = patientForm.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                showError(field.id + 'Error', true);
                field.classList.add('error');
                isValid = false;
            } else {
                showError(field.id + 'Error', false);
                field.classList.remove('error');
            }
        });

        // Валидация email
        const email = document.getElementById('email');
        if (email.value && !isValidEmail(email.value)) {
            showError('emailError', true);
            email.classList.add('error');
            isValid = false;
        }

        // Валидация телефона
        const phone = document.getElementById('phone');
        if (phone.value && !isValidPhone(phone.value)) {
            showError('phoneError', true);
            phone.classList.add('error');
            isValid = false;
        }

        return isValid;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidPhone(phone) {
        // Простая валидация телефона - минимум 10 цифр
        const phoneDigits = phone.replace(/\D/g, '');
        return phoneDigits.length >= 10;
    }

    function showError(errorId, show) {
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.classList.toggle('show', show);
        }
    }

    function clearErrors() {
        const errorMessages = patientForm.querySelectorAll('.error-message');
        const errorFields = patientForm.querySelectorAll('.error');
        
        errorMessages.forEach(msg => msg.classList.remove('show'));
        errorFields.forEach(field => field.classList.remove('error'));
    }

    // Обработка отправки формы
    patientForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            // Сбор данных формы
            const formData = new FormData(patientForm);
            const patientData = Object.fromEntries(formData.entries());
            
            // Добавление пациента в систему
            addPatientToSystem(patientData);
            
            // Закрытие модального окна
            closeModal();
        }
    });

    // Реальная валидация в реальном времени
    const realTimeValidateFields = patientForm.querySelectorAll('input, select');
    realTimeValidateFields.forEach(field => {
        field.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                showError(this.id + 'Error', true);
                this.classList.add('error');
            } else {
                showError(this.id + 'Error', false);
                this.classList.remove('error');
            }
        });
    });

    // Маска для телефона
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            // Форматирование номера
            if (value.length > 0) {
                let formattedValue = value;
                if (value.length > 3) {
                    formattedValue = value.substring(0, 3) + ' ' + value.substring(3);
                }
                if (value.length > 6) {
                    formattedValue = formattedValue.substring(0, 7) + '-' + formattedValue.substring(7);
                }
                if (value.length > 8) {
                    formattedValue = formattedValue.substring(0, 10) + '-' + formattedValue.substring(10);
                }
                e.target.value = formattedValue;
            }
        });
    }
}

// Модальное окно выбора пациента для осмотра
function setupExamModal() {
    const modal = document.getElementById('examModal');
    const openModalBtn = document.getElementById('quickNewExam');
    const closeModalBtn = document.getElementById('closeExamModal');
    const searchInput = document.getElementById('examPatientSearch');

    function openModal() {
        loadPatientsForExam();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        if (searchInput) searchInput.value = '';
    }

    if (openModalBtn) {
        openModalBtn.addEventListener('click', openModal);
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Поиск пациентов в модальном окне
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase();
            filterPatientsInExamModal(query);
        });
    }
}

// Модальное окно карточки пациента
function setupPatientCardModal() {
    const modal = document.getElementById('patientCardModal');
    const closeModalBtn = document.getElementById('closePatientCardModal');

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// Настройка поиска
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    if (searchInput && searchResults) {
        searchInput.addEventListener('input', function(e) {
            const query = e.target.value.trim();
            
            if (query.length >= 2) {
                const results = searchPatients(query);
                displaySearchResults(results);
            } else {
                searchResults.style.display = 'none';
            }
        });

        // Закрытие результатов поиска при клике вне области
        document.addEventListener('click', function(e) {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.style.display = 'none';
            }
        });
    }
}

// Функция для добавления пациента в систему
function addPatientToSystem(patientData) {
    // В реальной системе здесь был бы AJAX запрос к серверу
    console.log('Добавление пациента:', patientData);
    
    // Показываем уведомление об успехе
    showNotification('Пациент успешно добавлен в систему!', 'success');
    
    // Обновляем статистику
    updateStatistics();
    
    // Обновляем список активных пациентов
    updateActivePatients();
}

// Функция поиска пациентов
function searchPatients(query) {
    // В реальной системе здесь был бы AJAX запрос к серверу
    const allPatients = getDemoPatients();
    
    return allPatients.filter(patient => 
        patient.fullName.toLowerCase().includes(query.toLowerCase()) ||
        patient.phone.includes(query)
    );
}

// Функция отображения результатов поиска
function displaySearchResults(results) {
    const searchResults = document.getElementById('searchResults');
    
    if (results.length === 0) {
        searchResults.innerHTML = '<div class="search-result-item">Пациенты не найдены</div>';
    } else {
        searchResults.innerHTML = results.map(patient => `
            <div class="search-result-item" data-patient-id="${patient.id}">
                <div class="patient-name">${patient.fullName}</div>
                <div class="patient-phone">${patient.phone}</div>
                <div class="patient-last-exam">Последний осмотр: ${formatDate(patient.lastExam)}</div>
            </div>
        `).join('');
        
        // Добавляем обработчики клика на результаты
        document.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', function() {
                const patientId = this.getAttribute('data-patient-id');
                openPatientCard(patientId);
                searchResults.style.display = 'none';
                document.getElementById('searchInput').value = '';
            });
        });
    }
    
    searchResults.style.display = 'block';
}

// Функция загрузки пациентов для осмотра
function loadPatientsForExam() {
    const patientsListModal = document.getElementById('patientsListModal');
    const patients = getDemoPatients();
    
    patientsListModal.innerHTML = patients.map(patient => `
        <div class="patient-exam-item" data-patient-id="${patient.id}">
            <div class="patient-exam-info">
                <h4>${patient.fullName}</h4>
                <p>Возраст: ${patient.age} лет | Телефон: ${patient.phone}</p>
                <p>Последний осмотр: ${formatDate(patient.lastExam)}</p>
            </div>
            <button class="btn btn-primary" onclick="startExamination(${patient.id})">Выбрать</button>
        </div>
    `).join('');
}

// Функция фильтрации пациентов в модальном окне осмотра
function filterPatientsInExamModal(query) {
    const patients = getDemoPatients();
    const filteredPatients = patients.filter(patient => 
        patient.fullName.toLowerCase().includes(query.toLowerCase()) ||
        patient.phone.includes(query)
    );
    
    const patientsListModal = document.getElementById('patientsListModal');
    patientsListModal.innerHTML = filteredPatients.map(patient => `
        <div class="patient-exam-item" data-patient-id="${patient.id}">
            <div class="patient-exam-info">
                <h4>${patient.fullName}</h4>
                <p>Возраст: ${patient.age} лет | Телефон: ${patient.phone}</p>
                <p>Последний осмотр: ${formatDate(patient.lastExam)}</p>
            </div>
            <button class="btn btn-primary" onclick="startExamination(${patient.id})">Выбрать</button>
        </div>
    `).join('');
}

// Функция открытия карточки пациента
function openPatientCard(patientId) {
    const patient = getPatientById(patientId);
    if (!patient) return;
    
    const patientCardContent = document.getElementById('patientCardContent');
    const modal = document.getElementById('patientCardModal');
    
    patientCardContent.innerHTML = `
        <div class="patient-details-section">
            <h3>Личные данные</h3>
            <div class="detail-row">
                <span class="detail-label">ФИО:</span>
                <span class="detail-value">${patient.fullName}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Дата рождения:</span>
                <span class="detail-value">${formatDate(patient.birthDate)}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Возраст:</span>
                <span class="detail-value">${patient.age} лет</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Телефон:</span>
                <span class="detail-value">${patient.phone}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span class="detail-value">${patient.email || 'Не указан'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Пол:</span>
                <span class="detail-value">${patient.gender === 'male' ? 'Мужской' : patient.gender === 'female' ? 'Женский' : 'Не указан'}</span>
            </div>
        </div>
        
        <div class="patient-details-section">
            <h3>Последний осмотр</h3>
            <div class="detail-row">
                <span class="detail-label">Дата осмотра:</span>
                <span class="detail-value">${formatDate(patient.lastExam)}</span>
            </div>
            <div class="examination-results">
                <div class="exam-metric">
                    <span class="metric-label">PPD средний:</span>
                    <span class="metric-value ppd-${getPPDStatus(patient.ppd)}">${patient.ppd} мм</span>
                </div>
                <div class="exam-metric">
                    <span class="metric-label">BOP:</span>
                    <span class="metric-value bop-${getBOPStatus(patient.bop)}">${patient.bop}%</span>
                </div>
                <div class="exam-metric">
                    <span class="metric-label">CAL средний:</span>
                    <span class="metric-value">${patient.cal} мм</span>
                </div>
            </div>
            <div class="detail-row">
                <span class="detail-label">Статус:</span>
                <span class="detail-value">
                    <span class="diagnosis-badge ${patient.status}">${getStatusText(patient.status)}</span>
                </span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Примечания:</span>
                <span class="detail-value">${patient.notes || 'Нет примечаний'}</span>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Функция показа уведомлений
function showNotification(message, type = 'info') {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Стили для уведомления
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    // Цвета в зависимости от типа
    const colors = {
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6'
    };
    
    notification.style.background = colors[type] || colors.info;
    
    // Добавляем в DOM
    document.body.appendChild(notification);
    
    // Удаляем через 5 секунд
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Инициализация демо-данных
function initializeDemoData() {
    updateStatistics();
    updateActivePatients();
    updateRecentExaminations();
}

// Функция обновления статистики
function updateStatistics() {
    document.getElementById('totalPatients').textContent = '1,247';
    document.getElementById('monthlyExams').textContent = '34';
    document.getElementById('completionRate').textContent = '89%';
}

// Функция обновления активных пациентов
function updateActivePatients() {
    const activePatientsGrid = document.getElementById('activePatientsGrid');
    const patients = getDemoPatients().filter(p => p.status !== 'success');
    
    activePatientsGrid.innerHTML = patients.map(patient => `
        <div class="patient-card" onclick="openPatientCard(${patient.id})">
            <div class="patient-header">
                <h4>${patient.fullName}</h4>
                <span class="patient-age">${patient.age} лет</span>
            </div>
            <div class="patient-info">
                <div class="info-row">
                    <span>Последний осмотр:</span>
                    <span>${formatDate(patient.lastExam)}</span>
                </div>
                <div class="info-row">
                    <span>PPD средний:</span>
                    <span class="ppd-${getPPDStatus(patient.ppd)}">${patient.ppd}mm</span>
                </div>
                <div class="info-row">
                    <span>BOP:</span>
                    <span class="bop-${getBOPStatus(patient.bop)}">${patient.bop}%</span>
                </div>
            </div>
            <div class="diagnosis-badge ${patient.status}">
                ${getStatusText(patient.status)}
            </div>
            <div class="patient-actions">
                <button class="btn btn-primary btn-small" onclick="event.stopPropagation(); startExamination(${patient.id})">
                    Начать осмотр
                </button>
                <button class="btn btn-secondary btn-small" onclick="event.stopPropagation(); openPatientHistory(${patient.id})">
                    История
                </button>
            </div>
        </div>
    `).join('');
}

// Функция обновления таблицы последних осмотров
function updateRecentExaminations() {
    const examinationsTable = document.getElementById('examinationsTable');
    const patients = getDemoPatients().slice(0, 5);
    
    examinationsTable.innerHTML = patients.map(patient => `
        <tr>
            <td>${patient.fullName}</td>
            <td>${formatDate(patient.lastExam)}</td>
            <td class="ppd-${getPPDStatus(patient.ppd)}">${patient.ppd}mm</td>
            <td class="bop-${getBOPStatus(patient.bop)}">${patient.bop}%</td>
            <td>
                <button class="btn btn-primary btn-small" onclick="openPatientCard(${patient.id})">
                    Открыть
                </button>
            </td>
        </tr>
    `).join('');
}

// Загрузка всех пациентов
function loadAllPatients() {
    const allPatientsList = document.getElementById('allPatientsList');
    const patients = getDemoPatients();
    
    allPatientsList.innerHTML = patients.map(patient => `
        <div class="patient-card" onclick="openPatientCard(${patient.id})">
            <div class="patient-header">
                <h4>${patient.fullName}</h4>
                <span class="patient-age">${patient.age} лет</span>
            </div>
            <div class="patient-info">
                <div class="info-row">
                    <span>Телефон:</span>
                    <span>${patient.phone}</span>
                </div>
                <div class="info-row">
                    <span>Последний осмотр:</span>
                    <span>${formatDate(patient.lastExam)}</span>
                </div>
                <div class="info-row">
                    <span>PPD средний:</span>
                    <span class="ppd-${getPPDStatus(patient.ppd)}">${patient.ppd}mm</span>
                </div>
            </div>
            <div class="diagnosis-badge ${patient.status}">
                ${getStatusText(patient.status)}
            </div>
            <div class="patient-actions">
                <button class="btn btn-primary btn-small" onclick="event.stopPropagation(); startExamination(${patient.id})">
                    Осмотр
                </button>
                <button class="btn btn-secondary btn-small" onclick="event.stopPropagation(); openPatientHistory(${patient.id})">
                    История
                </button>
            </div>
        </div>
    `).join('');
}

// Загрузка всех осмотров
function loadAllExaminations() {
    const fullExaminationsTable = document.getElementById('fullExaminationsTable');
    const patients = getDemoPatients();
    
    fullExaminationsTable.innerHTML = patients.map(patient => `
        <tr>
            <td>${patient.fullName}</td>
            <td>${formatDate(patient.lastExam)}</td>
            <td class="ppd-${getPPDStatus(patient.ppd)}">${patient.ppd}mm</td>
            <td class="bop-${getBOPStatus(patient.bop)}">${patient.bop}%</td>
            <td>
                <span class="diagnosis-badge ${patient.status}">${getStatusText(patient.status)}</span>
            </td>
            <td>
                <button class="btn btn-primary btn-small" onclick="openPatientCard(${patient.id})">
                    Карточка
                </button>
                <button class="btn btn-secondary btn-small" onclick="openExaminationDetails(${patient.id})">
                    Детали
                </button>
            </td>
        </tr>
    `).join('');
}

// Демо-данные
function getDemoPatients() {
    return [
        {
            id: 1,
            fullName: 'Иванов Петр Сергеевич',
            birthDate: '1978-05-15',
            age: 45,
            phone: '+7 (999) 123-45-67',
            email: 'ivanov@example.com',
            gender: 'male',
            lastExam: '2023-12-15',
            ppd: 4.2,
            bop: 45,
            cal: 3.8,
            status: 'warning',
            notes: 'Пациент требует наблюдения из-за повышенных показателей BOP'
        },
        {
            id: 2,
            fullName: 'Петрова Анна Константиновна',
            birthDate: '1971-11-23',
            age: 52,
            phone: '+7 (999) 123-45-68',
            email: 'petrova@example.com',
            gender: 'female',
            lastExam: '2023-12-14',
            ppd: 3.8,
            bop: 35,
            cal: 3.2,
            status: 'success',
            notes: 'Состояние стабильное'
        },
        {
            id: 3,
            fullName: 'Сидоров Михаил Владимирович',
            birthDate: '1985-08-30',
            age: 38,
            phone: '+7 (999) 123-45-69',
            email: 'sidorov@example.com',
            gender: 'male',
            lastExam: '2023-12-13',
            ppd: 5.1,
            bop: 62,
            cal: 4.5,
            status: 'danger',
            notes: 'Критическое состояние, требуется срочное лечение'
        },
        {
            id: 4,
            fullName: 'Кузнецова Елена Дмитриевна',
            birthDate: '1990-03-12',
            age: 33,
            phone: '+7 (999) 123-45-70',
            email: 'kuznetsova@example.com',
            gender: 'female',
            lastExam: '2023-12-12',
            ppd: 3.2,
            bop: 28,
            cal: 2.9,
            status: 'success',
            notes: 'Профилактический осмотр'
        },
        {
            id: 5,
            fullName: 'Новиков Алексей Петрович',
            birthDate: '1965-12-05',
            age: 58,
            phone: '+7 (999) 123-45-71',
            email: 'novikov@example.com',
            gender: 'male',
            lastExam: '2023-12-10',
            ppd: 4.8,
            bop: 51,
            cal: 4.1,
            status: 'warning',
            notes: 'Ухудшение показателей по сравнению с предыдущим осмотром'
        }
    ];
}

function getPatientById(id) {
    return getDemoPatients().find(patient => patient.id == id);
}

// Вспомогательные функции
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
}

function getPPDStatus(ppd) {
    if (ppd <= 3) return 'normal';
    if (ppd <= 5) return 'warning';
    return 'danger';
}

function getBOPStatus(bop) {
    if (bop <= 10) return 'normal';
    if (bop <= 25) return 'warning';
    return 'danger';
}

function getStatusText(status) {
    const statusMap = {
        success: 'Стабильное состояние',
        warning: 'Требует наблюдения',
        danger: 'Критическое состояние'
    };
    return statusMap[status] || 'Не определено';
}

// Глобальные функции для кнопок
function startExamination(patientId) {
    const patient = getPatientById(patientId);
    if (patient) {
        showNotification(`Начало осмотра пациента: ${patient.fullName}`, 'success');
        
        // Закрываем модальное окно выбора пациента, если оно открыто
        const examModal = document.getElementById('examModal');
        if (examModal) {
            examModal.classList.remove('active');
        }
        
        // Здесь можно добавить переход на страницу осмотра
        // window.location.href = `/examination.html?patientId=${patientId}`;
    }
}

function openPatientHistory(patientId) {
    const patient = getPatientById(patientId);
    if (patient) {
        showNotification(`Открытие истории пациента: ${patient.fullName}`, 'info');
        // Здесь можно добавить переход на страницу истории
    }
}

function openExaminationDetails(examId) {
    showNotification(`Детали осмотра #${examId}`, 'info');
    // Здесь можно добавить переход на страницу деталей осмотра
}

function loadReports() {
    // Загрузка данных для страницы отчетов
    showNotification('Загрузка отчетов...', 'info');
}

function loadSettings() {
    // Загрузка данных для страницы настроек
    showNotification('Загрузка настроек...', 'info');
}
