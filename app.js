// =============================================
// AquaFreight Shipment Management System - app.js
// =============================================

let toastTimer;

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    buildShipmentTable();
    // Charts will be initialized after login
});

// ====================== AUTH ======================
function doLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-pw').value;

    if (email && password.length >= 6) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('app').style.display = 'flex';
        
        // Initialize charts after successful login
        setTimeout(() => {
            initCharts();
        }, 300);
    } else {
        const errorEl = document.getElementById('login-error');
        errorEl.style.display = 'block';
        
        // Hide error after 4 seconds
        setTimeout(() => {
            errorEl.style.display = 'none';
        }, 4000);
    }
}

function doLogout() {
    document.getElementById('app').style.display = 'none';
    document.getElementById('login-screen').style.display = 'flex';
    
    // Clear any active charts to prevent memory leaks
    document.querySelectorAll('canvas').forEach(canvas => {
        const chart = Chart.getChart(canvas);
        if (chart) chart.destroy();
    });
}

function togglePw() {
    const pwInput = document.getElementById('login-pw');
    pwInput.type = pwInput.type === 'password' ? 'text' : 'password';
}

// ====================== NAVIGATION ======================
function showPage(pageName, clickedElement) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // Show selected page
    const targetPage = document.getElementById(`page-${pageName}`);
    if (targetPage) {
        targetPage.classList.add('active');
    }

    // Highlight clicked nav item
    if (clickedElement) {
        clickedElement.classList.add('active');
    }

    // Update topbar title
    const titles = {
        dashboard: 'Dashboard Overview',
        booking: 'Shipment Booking',
        ships: 'Ship Master',
        customers: 'Customer Master',
        shipments: 'Shipment Tracking'
    };

    document.getElementById('topbar-title').textContent = titles[pageName] || pageName.charAt(0).toUpperCase() + pageName.slice(1);
}

// ====================== SHIPMENT TABLE ======================
function buildShipmentTable() {
    const tbody = document.getElementById('shipment-table-body');
    if (!tbody) return;

    tbody.innerHTML = shipmentsData.map(shipment => `
        <tr>
            <td><span class="td-mono">${shipment.id}</span></td>
            <td><b>${shipment.cust}</b></td>
            <td>${shipment.ship}</td>
            <td style="font-size:12px">${shipment.route}</td>
            <td style="font-size:12px;color:var(--text-dim)">${shipment.cargo}</td>
            <td style="font-family:'JetBrains Mono';font-size:12px">${shipment.wt} MT</td>
            <td>${statusBadge(shipment.status)}</td>
            <td style="font-size:12px;color:var(--text-dim)">${shipment.eta}</td>
            <td style="display:flex;gap:6px;flex-wrap:wrap">
                <button class="btn-view" onclick="openTracking('${shipment.id}')">Track</button>
                <button class="btn-edit" onclick="openStatusModal('${shipment.id}')">Update</button>
            </td>
        </tr>
    `).join('');
}

// ====================== CHARTS ======================
function initCharts() {
    // Destroy existing charts to prevent duplicates
    document.querySelectorAll('canvas').forEach(canvas => {
        const existingChart = Chart.getChart(canvas);
        if (existingChart) existingChart.destroy();
    });

    // Line Chart - Shipment Trend
    new Chart(document.getElementById('lineChart'), {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Shipments',
                    data: [72, 89, 94, 110, 85, 128, 142, 135, 118, 156, 148, 167],
                    borderColor: '#f0a500',
                    borderWidth: 3,
                    fill: true,
                    backgroundColor: 'rgba(240,165,0,0.08)',
                    tension: 0.4,
                    pointRadius: 4
                },
                {
                    label: 'Delivered',
                    data: [68, 83, 90, 104, 80, 122, 136, 130, 112, 148, 142, 160],
                    borderColor: '#2ecc8a',
                    borderWidth: 2,
                    borderDash: [4, 3],
                    fill: false,
                    tension: 0.4,
                    pointRadius: 3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: { color: 'rgba(255,255,255,0.7)', boxWidth: 12, padding: 15 }
                }
            },
            scales: {
                x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: 'rgba(255,255,255,0.5)' } },
                y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: 'rgba(255,255,255,0.5)' }, beginAtZero: true }
            }
        }
    });

    // Pie Chart - Status Distribution
    new Chart(document.getElementById('pieChart'), {
        type: 'doughnut',
        data: {
            labels: ['Delivered', 'In Transit', 'Pending', 'Delayed', 'Arrived'],
            datasets: [{
                data: [1109, 127, 48, 18, 22],
                backgroundColor: [
                    'rgba(46,204,138,0.85)',
                    'rgba(0,200,224,0.85)',
                    'rgba(122,144,176,0.7)',
                    'rgba(232,86,86,0.85)',
                    'rgba(240,165,0,0.85)'
                ],
                borderColor: 'transparent',
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '68%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: 'rgba(255,255,255,0.7)', padding: 14, boxWidth: 10 }
                }
            }
        }
    });

    // Bar Chart - Ship-wise Volume
    new Chart(document.getElementById('barChart'), {
        type: 'bar',
        data: {
            labels: ['MV Titan', 'MV Neptune', 'MV Horizon', 'MV Orion', 'MV Atlas', 'MV Vega'],
            datasets: [{
                label: 'Shipments',
                data: [284, 198, 256, 142, 318, 86],
                backgroundColor: [
                    'rgba(240,165,0,0.75)',
                    'rgba(0,200,224,0.65)',
                    'rgba(46,204,138,0.65)',
                    'rgba(240,165,0,0.55)',
                    'rgba(0,200,224,0.75)',
                    'rgba(46,204,138,0.55)'
                ],
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { display: false }, ticks: { color: 'rgba(255,255,255,0.5)' } },
                y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: 'rgba(255,255,255,0.5)' }, beginAtZero: true }
            }
        }
    });
}

// ====================== MODALS ======================
function openModal(modalId) {
    document.getElementById(modalId).classList.add('open');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('open');
}

function openStatusModal(shipmentId) {
    document.getElementById('status-shp-id').textContent = shipmentId;
    openModal('modal-status');
}

function openTracking(shipmentId) {
    document.getElementById('tracking-shp-id').textContent = shipmentId;
    openModal('modal-tracking');
}

// ====================== FORM AUTO-FILL ======================
function autoFillShip(selectElement) {
    const value = selectElement.value;
    const shipData = ships[value];

    document.getElementById('ship-id-fill').textContent = value || '—';
    document.getElementById('ship-cap-fill').textContent = shipData ? shipData.cap : '—';
}

function autoFillCustomer(selectElement) {
    const value = selectElement.value;
    const customerData = customers[value];

    document.getElementById('cust-email-fill').textContent = customerData ? customerData.email : '—';
    document.getElementById('cust-phone-fill').textContent = customerData ? customerData.phone : '—';
    document.getElementById('cust-addr-fill').textContent = customerData ? customerData.addr : '—';
}

// ====================== BOOKING FORM ======================
function resetBooking() {
    const bookingPage = document.getElementById('page-booking');
    
    bookingPage.querySelectorAll('input, select, textarea').forEach(element => {
        if (element.tagName === 'SELECT') {
            element.selectedIndex = 0;
        } else if (element.type !== 'button') {
            element.value = '';
        }
    });

    // Reset auto-fill fields
    document.getElementById('ship-id-fill').textContent = '—';
    document.getElementById('ship-cap-fill').textContent = '—';
    document.getElementById('cust-email-fill').textContent = '—';
    document.getElementById('cust-phone-fill').textContent = '—';
    document.getElementById('cust-addr-fill').textContent = '—';
}

function submitBooking() {
    showToast('Shipment booked successfully! ID: SHP-2024-1285');
    // Redirect to shipments page
    showPage('shipments', document.querySelector('.nav-item[onclick*="shipments"]'));
}

// ====================== TOAST NOTIFICATION ======================
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-msg');

    toastMsg.textContent = message;
    toast.style.display = 'block';

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

// Close modals when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('open');
    }
});

// Allow pressing Enter in password field to login
document.getElementById('login-pw').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        doLogin();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    buildShipmentTable();
});

// ====================== AUTH ======================
function doLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-pw').value;

    if (email && password.length >= 6) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('app').style.display = 'flex';
        setTimeout(initCharts, 300);
    } else {
        const errorEl = document.getElementById('login-error');
        errorEl.style.display = 'block';
        setTimeout(() => errorEl.style.display = 'none', 4000);
    }
}

function doLogout() {
    document.getElementById('app').style.display = 'none';
    document.getElementById('login-screen').style.display = 'flex';
}

function togglePw() {
    const pw = document.getElementById('login-pw');
    pw.type = pw.type === 'password' ? 'text' : 'password';
}

// ====================== NAVIGATION ======================
function showPage(pageName, el) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    const page = document.getElementById(`page-${pageName}`);
    if (page) page.classList.add('active');

    if (el) el.classList.add('active');

    const titles = {
        dashboard: 'Dashboard Overview',
        booking: 'Shipment Booking',
        ships: 'Ship Master',
        customers: 'Customer Master',
        shipments: 'Shipment Tracking'
    };
    document.getElementById('topbar-title').textContent = titles[pageName] || pageName;
}

// ====================== TABLE ======================
function buildShipmentTable() {
    const tbody = document.getElementById('shipment-table-body');
    if (!tbody) return;

    tbody.innerHTML = shipmentsData.map(s => `
        <tr>
            <td><span class="td-mono">${s.id}</span></td>
            <td><b>${s.cust}</b></td>
            <td>${s.ship}</td>
            <td style="font-size:12px">${s.route}</td>
            <td style="font-size:12px;color:var(--text-dim)">${s.cargo}</td>
            <td style="font-family:'JetBrains Mono';font-size:12px">${s.wt} MT</td>
            <td>${statusBadge(s.status)}</td>
            <td style="font-size:12px;color:var(--text-dim)">${s.eta}</td>
            <td style="display:flex;gap:6px">
                <button class="btn-view" onclick="openTracking('${s.id}')">Track</button>
                <button class="btn-edit" onclick="openStatusModal('${s.id}')">Update</button>
            </td>
        </tr>
    `).join('');
}

// ====================== CHARTS ======================
function initCharts() {
    document.querySelectorAll('canvas').forEach(c => {
        if (Chart.getChart(c)) Chart.getChart(c).destroy();
    });

    // Line Chart
    new Chart(document.getElementById('lineChart'), {
        type: 'line',
        data: {
            labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
            datasets: [{
                label: 'Shipments',
                data: [72,89,94,110,85,128,142,135,118,156,148,167],
                borderColor: '#f0a500', borderWidth: 3, tension: 0.4,
                backgroundColor: 'rgba(240,165,0,0.08)'
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });

    // Pie Chart
    new Chart(document.getElementById('pieChart'), {
        type: 'doughnut',
        data: {
            labels: ['Delivered','In Transit','Pending','Delayed','Arrived'],
            datasets: [{
                data: [1109,127,48,18,22],
                backgroundColor: ['#2ecc8a','#00c8e0','#7a90b0','#e85656','#f0a500']
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, cutout: '65%' }
    });

    // Bar Chart
    new Chart(document.getElementById('barChart'), {
        type: 'bar',
        data: {
            labels: ['MV Titan','MV Neptune','MV Horizon','MV Orion','MV Atlas','MV Vega'],
            datasets: [{
                data: [284,198,256,142,318,86],
                backgroundColor: 'rgba(240,165,0,0.7)'
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

// ====================== MODALS ======================
function openModal(id) {
    document.getElementById(id).classList.add('open');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('open');
}

function openStatusModal(id) {
    document.getElementById('status-shp-id').textContent = id;
    openModal('modal-status');
}

function openTracking(id) {
    document.getElementById('tracking-shp-id').textContent = id;
    openModal('modal-tracking');
}

// ====================== ADD SHIP MODAL ======================
function saveNewShip() {
    const shipName = document.getElementById('new-ship-name').value.trim();
    if (!shipName) {
        showToast("Please enter ship name");
        return;
    }
    showToast(`New ship "${shipName}" added successfully!`);
    closeModal('modal-add-ship');
}

// ====================== ADD CUSTOMER MODAL ======================
function saveNewCustomer() {
    const custName = document.getElementById('new-customer-name').value.trim();
    if (!custName) {
        showToast("Please enter customer name");
        return;
    }
    showToast(`New customer "${custName}" added successfully!`);
    closeModal('modal-add-cust');
}

// ====================== BOOKING ======================
function autoFillShip(sel) {
    const v = sel.value;
    document.getElementById('ship-id-fill').textContent = v || '—';
    document.getElementById('ship-cap-fill').textContent = v && ships[v] ? ships[v].cap : '—';
}

function autoFillCustomer(sel) {
    const v = sel.value;
    const c = customers[v];
    document.getElementById('cust-email-fill').textContent = c ? c.email : '—';
    document.getElementById('cust-phone-fill').textContent = c ? c.phone : '—';
    document.getElementById('cust-addr-fill').textContent = c ? c.addr : '—';
}

function resetBooking() {
    document.querySelectorAll('#page-booking input, #page-booking select, #page-booking textarea').forEach(el => {
        if (el.tagName === 'SELECT') el.selectedIndex = 0;
        else el.value = '';
    });
    document.getElementById('ship-id-fill').textContent = '—';
    document.getElementById('ship-cap-fill').textContent = '—';
    document.getElementById('cust-email-fill').textContent = '—';
    document.getElementById('cust-phone-fill').textContent = '—';
    document.getElementById('cust-addr-fill').textContent = '—';
}

function submitBooking() {
    showToast('Shipment booked successfully! ID: SHP-2024-1285');
    showPage('shipments', document.querySelector('[onclick*="shipments"]'));
}

// ====================== TOAST ======================
function showToast(msg) {
    const toast = document.getElementById('toast');
    document.getElementById('toast-msg').textContent = msg;
    toast.style.display = 'block';

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('open');
    }
});

// Enter key support for login
document.getElementById('login-pw').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') doLogin();
});