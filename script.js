// Основной скрипт для PerioPlatforma
document.addEventListener('DOMContentLoaded', function() {
    // Управление модальным окном
    const modal = document.getElementById('patientModal');
    const openModalBtn = document.getElementById('addPatientBtn');
    const quickAddPatient = document.getElementById('quickAddPatient');
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
    if (openModalBtn) {
        openModalBtn.addEventListener('click', openModal);
    }
    
    if (quickAddPatient) {
        quickAddPatient.addEventListener('click', openModal);
    }

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
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(phone);
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

    // Поиск пациентов
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

    // Инициализация демо-данных
    initializeDemoData();
});

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
    const allPatients = [
        { id: 1, name: 'Иванов Петр Сергеевич', phone: '+79991234567', lastExam: '2023-12-15' },
        { id: 2, name: 'Петрова Анна Константиновна', phone: '+79991234568', lastExam: '2023-12-14' },
        { id: 3, name: 'Сидоров Михаил Владимирович', phone: '+79991234569', lastExam: '2023-12-13' },
        { id: 4, name: 'Кузнецова Елена Дмитриевна', phone: '+79991234570', lastExam: '2023-12-12' }
    ];
    
    return allPatients.filter(patient => 
        patient.name.toLowerCase().includes(query.toLowerCase()) ||
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
                <div class="patient-name">${patient.name}</div>
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

// Функция открытия карты пациента
function openPatientCard(patientId) {
    // В реальной системе здесь был бы переход на страницу пациента
    console.log('Открытие карты пациента:', patientId);
    showNotification(`Открыта карта пациента #${patientId}`, 'info');
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

// Функция инициализации демо-данных
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
    
    const activePatients = [
        {
            id: 1,
            name: 'Иванов Петр Сергеевич',
            age: 45,
            lastExam: '2023-12-15',
            ppd: 4.2,
            bop: 45,
            status: 'warning'
        },
        {
            id: 2,
            name: 'Петрова Анна Константиновна',
            age: 52,
            lastExam: '2023-12-14',
            ppd: 3.8,
            bop: 35,
            status: 'success'
        },
        {
            id: 3,
            name: 'Сидоров Михаил Владимирович',
            age: 38,
            lastExam: '2023-12-13',
            ppd: 5.1,
            bop: 62,
            status: 'danger'
        }
    ];
    
    activePatientsGrid.innerHTML = activePatients.map(patient => `
        <div class="patient-card">
            <div class="patient-header">
                <h4>${patient.name}</h4>
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
                <button class="btn btn-primary btn-small" onclick="continueExamination(${patient.id})">
                    Продолжить осмотр
                </button>
                <button class="btn btn-secondary btn-small" onclick="openPatientHistory(${patient.id})">
                    История
                </button>
            </div>
        </div>
    `).join('');
}

// Функция обновления таблицы последних осмотров
function updateRecentExaminations() {
    const examinationsTable = document.getElementById('examinationsTable');
    
    const recentExams = [
        {
            id: 1,
            patientName: 'Иванов П.С.',
            date: '2023-12-15',
            ppd: 3.8,
            bop: 35
        },
        {
            id: 2,
            patientName: 'Петрова А.К.',
            date: '2023-12-14',
            ppd: 4.2,
            bop: 42
        },
        {
            id: 3,
            patientName: 'Сидоров М.В.',
            date: '2023-12-13',
            ppd: 5.1,
            bop: 62
        },
        {
            id: 4,
            patientName: 'Кузнецова Е.Д.',
            date: '2023-12-12',
            ppd: 3.2,
            bop: 28
        }
    ];
    
    examinationsTable.innerHTML = recentExams.map(exam => `
        <tr>
            <td>${exam.patientName}</td>
            <td>${formatDate(exam.date)}</td>
            <td class="ppd-${getPPDStatus(exam.ppd)}">${exam.ppd}mm</td>
            <td class="bop-${getBOPStatus(exam.bop)}">${exam.bop}%</td>
            <td>
                <button class="btn btn-primary btn-small" onclick="openExamination(${exam.id})">
                    Открыть
                </button>
            </td>
        </tr>
    `).join('');
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
function continueExamination(patientId) {
    showNotification(`Продолжение осмотра пациента #${patientId}`, 'info');
}

function openPatientHistory(patientId) {
    showNotification(`Открытие истории пациента #${patientId}`, 'info');
}

function openExamination(examId) {
    showNotification(`Открытие осмотра #${examId}`, 'info');
}

// Добавляем CSS анимации для уведомлений
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .search-result-item {
        padding: 12px 15px;
        border-bottom: 1px solid var(--border);
        cursor: pointer;
        transition: background-color 0.2s ease;
    }
    
    .search-result-item:hover {
        background: var(--background);
    }
    
    .search-result-item:last-child {
        border-bottom: none;
    }
    
    .patient-name {
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 4px;
    }
    
    .patient-phone {
        color: var(--text-secondary);
        font-size: 14px;
        margin-bottom: 2px;
    }
    
    .patient-last-exam {
        color: var(--text-secondary);
        font-size: 12px;
    }
`;
document.head.appendChild(style);