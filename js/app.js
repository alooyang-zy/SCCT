/**
 * 歌尔供应链控制塔 - 主应用逻辑
 * Goertek Supply Chain Control Tower - Main Application
 */

// ========== 全局状态 ==========
const App = {
    currentPage: 'overview',
    charts: {},
};

// ========== 初始化 ==========
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initSidebar();
    initTimeDisplay();
    initKpiAnimation();
    initCharts();
    initFlowDiagram();
    initTracking();
    initChatInput();
    initSettingsNav();
    renderAlertTable();
});

// ========== 导航系统 ==========
function initNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.dataset.page;
            if (page) switchPage(page);
        });
    });
}

function switchPage(pageId) {
    // 更新导航高亮
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const activeNav = document.querySelector(`.nav-item[data-page="${pageId}"]`);
    if (activeNav) activeNav.classList.add('active');

    // 切换页面显示
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const targetPage = document.getElementById(`page-${pageId}`);
    if (targetPage) targetPage.classList.add('active');

    App.currentPage = pageId;

    // 更新标题和面包屑
    const titles = {
        overview: '全局概览',
        flow: '流程监控',
        tracking: '全程追踪',
        warning: '智能预警',
        analytics: '数据分析',
        inventory: '库存管理',
        logistics: '物流中心',
        'ai-assistant': 'AI助手',
        settings: '系统设置',
    };
    document.getElementById('pageTitle').textContent = titles[pageId] || pageId;
    document.getElementById('breadcrumbCurrent').textContent = titles[pageId] || pageId;

    // 页面切换时初始化对应图表
    if (pageId === 'analytics') initAnalyticsCharts();
    if (pageId === 'inventory') initInventoryCharts();
    if (pageId === 'logistics') initLogisticsCharts();
    if (pageId === 'settings') initSettingsData();
    if (pageId === 'flow') drawFlowLines();

    // 页面显示后延迟resize，确保布局完成后再计算画布尺寸
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            Object.keys(App.charts).forEach(key => {
                if (App.charts[key] && typeof App.charts[key].resize === 'function') {
                    App.charts[key].resize();
                }
            });
        });
    });
}

// ========== 侧边栏折叠 ==========
function initSidebar() {
    const toggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    toggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });

    // 移动端处理
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('collapsed');
            sidebar.classList.toggle('mobile-show');
        } else {
            sidebar.classList.remove('mobile-show');
        }
    });
}

// ========== 时间显示 ==========
function initTimeDisplay() {
    function updateTime() {
        const now = new Date();
        const el = document.getElementById('timeDisplay');
        if (el) {
            el.textContent = now.toLocaleString('zh-CN', {
                year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit', second: '2-digit'
            });
        }
    }
    updateTime();
    setInterval(updateTime, 1000);
}

// ========== KPI 动画 ==========
function initKpiAnimation() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateKpiValues();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    const kpiGrid = document.querySelector('.kpi-grid');
    if (kpiGrid) observer.observe(kpiGrid);
}

function animateKpiValues() {
    document.querySelectorAll('.kpi-value[data-target]').forEach(el => {
        const target = parseFloat(el.dataset.target);
        const isFloat = target % 1 !== 0;
        let current = 0;
        const step = target / 60;
        const timer = setInterval(() => {
            current += step;
            if (current >= target) { current = target; clearInterval(timer); }
            el.textContent = isFloat ? current.toFixed(1) : Math.floor(current).toLocaleString();
        }, 16);
    });
}

// ========== 图表初始化 ==========
function initCharts() {
    if (typeof Chart === 'undefined') { console.warn('Chart.js 未加载，图表将不显示'); return; }
    // 库存趋势图
    const trendData = generateInventoryTrendData();
    const invCtx = document.getElementById('inventoryTrendChart');
    if (invCtx) {
        App.charts.inventoryTrend = new Chart(invCtx, {
            type: 'line',
            data: {
                labels: trendData.labels,
                datasets: [
                    {
                        label: '库存量 (SKU)',
                        data: trendData.inventory,
                        borderColor: '#2a5298',
                        backgroundColor: 'rgba(42,82,152,0.08)',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 0,
                        pointHoverRadius: 5,
                        yAxisID: 'y',
                    },
                    {
                        label: '准时交付率 (%)',
                        data: trendData.logistics,
                        borderColor: '#28a745',
                        backgroundColor: 'transparent',
                        borderDash: [5, 3],
                        tension: 0.4,
                        pointRadius: 0,
                        pointHoverRadius: 5,
                        yAxisID: 'y1',
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { intersect: false, mode: 'index' },
                plugins: {
                    legend: { position: 'top', labels: { usePointStyle: true, padding: 15, font: { size: 11 } } },
                },
                scales: {
                    y: { position: 'left', title: { display: true, text: '库存量', font: { size: 11 } }, grid: { color: '#f0f0f0' } },
                    y1: { position: 'right', min: 70, max: 100, title: { display: true, text: '准时率%', font: { size: 11 } }, grid: { display: false } },
                    x: { grid: { display: false }, ticks: { maxRotation: 45, font: { size: 10 } } },
                },
            },
        });
    }

    // 订单状态饼图
    const orderCtx = document.getElementById('orderStatusChart');
    if (orderCtx) {
        App.charts.orderStatus = new Chart(orderCtx, {
            type: 'doughnut',
            data: {
                labels: orderStatusData.labels,
                datasets: [{
                    data: orderStatusData.values,
                    backgroundColor: orderStatusData.colors,
                    borderWidth: 0,
                    hoverOffset: 8,
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%',
                plugins: {
                    legend: { display: false },
                },
            },
        });
        // 自定义图例
        const legendEl = document.getElementById('orderStatusLegend');
        if (legendEl) {
            legendEl.innerHTML = orderStatusData.labels.map((l, i) =>
                `<div class="pie-legend-item"><span style="background:${orderStatusData.colors[i]}"></span>${l}: ${orderStatusData.values[i]}</div>`
            ).join('');
        }
    }

    // 供应商柱状图
    const supCtx = document.getElementById('supplierChart');
    if (supCtx) {
        App.charts.supplier = new Chart(supCtx, {
            type: 'bar',
            data: {
                labels: supplierData.labels,
                datasets: [{
                    label: '采购占比 (%)',
                    data: supplierData.values,
                    backgroundColor: [
                        'rgba(42,82,152,0.8)', 'rgba(40,167,69,0.8)',
                        'rgba(240,180,41,0.8)', 'rgba(23,162,184,0.8)',
                        'rgba(220,53,69,0.8)', 'rgba(150,150,150,0.6)',
                    ],
                    borderRadius: 4,
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { color: '#f0f0f0' }, ticks: { callback: v => v + '%' } },
                    y: { grid: { display: false } },
                },
            },
        });
    }
}

// ========== 分析页图表 ==========
function initAnalyticsCharts() {
    if (typeof Chart === 'undefined') return;
    // 趋势预测图
    const tfCtx = document.getElementById('trendForecastChart');
    if (tfCtx && !App.charts.trendForecast) {
        App.charts.trendForecast = new Chart(tfCtx, {
            type: 'line',
            data: {
                labels: analyticsData.trendLabels,
                datasets: [
                    {
                        label: '实际值',
                        data: analyticsData.actualValues,
                        borderColor: '#2a5298', backgroundColor: 'transparent',
                        tension: 0.4, pointRadius: 4, pointBackgroundColor: '#2a5298',
                    },
                    {
                        label: '预测值',
                        data: analyticsData.forecastValues,
                        borderColor: '#e6a23e', borderDash: [6, 4],
                        backgroundColor: 'transparent', tension: 0.4,
                        pointRadius: 4, pointBackgroundColor: '#e6a23e',
                    },
                ],
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { position: 'top' } },
                scales: { y: { beginAtZero: false, min: 80, grid: { color: '#f0f0f0' } }, x: { grid: { display: false } } },
            },
        });
    }

    // 效率雷达图
    const effCtx = document.getElementById('efficiencyRadarChart');
    if (effCtx && !App.charts.efficiency) {
        App.charts.efficiency = new Chart(effCtx, {
            type: 'radar',
            data: {
                labels: ['订单履约', '交付准时', '库存准确', '来料合格', '产能利用', '成本控制'],
                datasets: [{
                    label: '当前值 (%)',
                    data: analyticsData.efficiencyData,
                    fill: true, backgroundColor: 'rgba(42,82,152,0.15)',
                    borderColor: '#2a5298', pointBackgroundColor: '#2a5298',
                }],
            },
            options: { responsive: true, maintainAspectRatio: false, scales: { r: { min: 60, max: 100, ticks: { stepSize: 10 } } } },
        });
    }

    // 成本结构图
    const costCtx = document.getElementById('costStructureChart');
    if (costCtx && !App.charts.costStructure) {
        App.charts.costStructure = new Chart(costCtx, {
            type: 'polarArea',
            data: {
                labels: analyticsData.costLabels,
                datasets: [{
                    data: analyticsData.costValues,
                    backgroundColor: [
                        'rgba(42,82,152,0.7)', 'rgba(40,167,69,0.7)',
                        'rgba(23,162,184,0.7)', 'rgba(240,180,41,0.7)',
                        'rgba(220,53,69,0.7)', 'rgba(150,150,150,0.5)',
                    ],
                }],
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right' } } },
        });
    }

    // 滞留物料图
    const stagCtx = document.getElementById('stagnantMaterialChart');
    if (stagCtx && !App.charts.stagnant) {
        App.charts.stagnant = new Chart(stagCtx, {
            type: 'bar',
            data: {
                labels: ['IC-BES2300','MEM-KNOW01','OLED-MICRO','LED-WHITE','PKG-ESD','BOL-N004','CHE-THERMAL','MAT-R008','PCB-HDI009','CAS-AL6063'],
                datasets: [{
                    label: '滞留天数',
                    data: [120, 98, 85, 72, 65, 58, 52, 48, 44, 40],
                    backgroundColor: (ctx) => {
                        const val = ctx.raw;
                        return val > 90 ? 'rgba(220,53,69,0.7)' : val > 60 ? 'rgba(230,162,62,0.7)' : 'rgba(40,167,69,0.6)';
                    },
                    borderRadius: 3,
                }],
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                indexAxis: 'y', plugins: { legend: { display: false } },
                scales: { x: { title: { text: '天', display: true } }, y: { grid: { display: false } } },
            },
        });
    }

    // BG事业群绩效对比图
    const bgCtx = document.getElementById('bgPerformanceChart');
    if (bgCtx && !App.charts.bgPerf) {
        App.charts.bgPerf = new Chart(bgCtx, {
            type: 'bar',
            data: {
                labels: bgPerformanceData.labels,
                datasets: bgPerformanceData.datasets.map(ds => ({
                    label: ds.label,
                    data: ds.data,
                    backgroundColor: ds.color + 'B3',
                    borderRadius: 4,
                })),
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { position: 'top', labels: { usePointStyle: true, font: { size: 11 } } } },
                scales: {
                    y: { beginAtZero: false, min: 60, grid: { color: '#f0f0f0' } },
                    x: { grid: { display: false } },
                },
            },
        });
    }

    // 客户交付绩效表
    renderCustomerPerfTable();
}

// ========== 库存管理图表 ==========
function initInventoryCharts() {
    if (typeof Chart === 'undefined') return;
    // 库存历史趋势图
    const histCtx = document.getElementById('inventoryHistoryChart');
    if (histCtx && !App.charts.inventoryHistory) {
        App.charts.inventoryHistory = new Chart(histCtx, {
            type: 'line',
            data: {
                labels: inventoryData.history.labels,
                datasets: [
                    {
                        label: '原材料(芯片/声学)',
                        data: inventoryData.history.rawMaterial,
                        borderColor: '#2a5298',
                        backgroundColor: 'rgba(42,82,152,0.06)',
                        fill: true, tension: 0.4, pointRadius: 0, pointHoverRadius: 4,
                    },
                    {
                        label: '半成品(WIP)',
                        data: inventoryData.history.semiProduct,
                        borderColor: '#e6a23e',
                        backgroundColor: 'rgba(230,162,62,0.06)',
                        fill: true, tension: 0.4, pointRadius: 0, pointHoverRadius: 4,
                    },
                    {
                        label: '成品',
                        data: inventoryData.history.finishedGoods,
                        borderColor: '#28a745',
                        backgroundColor: 'rgba(40,167,69,0.06)',
                        fill: true, tension: 0.4, pointRadius: 0, pointHoverRadius: 4,
                    },
                ],
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                interaction: { intersect: false, mode: 'index' },
                plugins: {
                    legend: { position: 'top', labels: { usePointStyle: true, padding: 15, font: { size: 11 } } },
                },
                scales: {
                    y: { title: { display: true, text: '库存量 (SKU)', font: { size: 11 } }, grid: { color: '#f0f0f0' } },
                    x: { grid: { display: false }, ticks: { maxRotation: 45, font: { size: 10 } } },
                },
            },
        });
    }

    // ABC分类饼图
    const abcCtx = document.getElementById('abcPieChart');
    if (abcCtx && !App.charts.abcPie) {
        App.charts.abcPie = new Chart(abcCtx, {
            type: 'doughnut',
            data: {
                labels: inventoryData.abc.labels,
                datasets: [{
                    data: inventoryData.abc.values,
                    backgroundColor: inventoryData.abc.colors,
                    borderWidth: 0, hoverOffset: 8,
                }],
            },
            options: {
                responsive: true, maintainAspectRatio: false, cutout: '60%',
                plugins: { legend: { display: false } },
            },
        });
        const legendEl = document.getElementById('abcPieLegend');
        if (legendEl) {
            legendEl.innerHTML = inventoryData.abc.labels.map((l, i) =>
                `<div class="pie-legend-item"><span style="background:${inventoryData.abc.colors[i]}"></span>${l}: ${inventoryData.abc.values[i]}% <small style="color:#999">(${inventoryData.abc.desc[i]})</small></div>`
            ).join('');
        }
    }

    // 各类别库存分布柱状图
    const catCtx = document.getElementById('categoryStockChart');
    if (catCtx && !App.charts.categoryStock) {
        App.charts.categoryStock = new Chart(catCtx, {
            type: 'bar',
            data: {
                labels: inventoryData.category.labels,
                datasets: [{
                    label: '库存量 (SKU)',
                    data: inventoryData.category.values,
                    backgroundColor: inventoryData.category.colors,
                    borderRadius: 4,
                }],
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { title: { display: true, text: 'SKU', font: { size: 11 } }, grid: { color: '#f0f0f0' }, beginAtZero: true },
                    x: { grid: { display: false }, ticks: { font: { size: 10 } } },
                },
            },
        });
    }

    // 周转vs呆滞分析
    const turnCtx = document.getElementById('turnoverChart');
    if (turnCtx && !App.charts.turnover) {
        App.charts.turnover = new Chart(turnCtx, {
            type: 'bar',
            data: {
                labels: inventoryData.turnover.labels,
                datasets: [
                    {
                        label: '周转天数',
                        data: inventoryData.turnover.turnoverDays,
                        backgroundColor: 'rgba(40,167,69,0.7)',
                        borderRadius: 4, yAxisID: 'y',
                    },
                    {
                        label: '呆滞天数',
                        data: inventoryData.turnover.stagnantDays,
                        backgroundColor: 'rgba(220,53,69,0.7)',
                        borderRadius: 4, yAxisID: 'y',
                    },
                ],
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { position: 'top', labels: { usePointStyle: true, font: { size: 11 } } } },
                scales: {
                    y: { title: { display: true, text: '天数', font: { size: 11 } }, grid: { color: '#f0f0f0' }, beginAtZero: true },
                    x: { grid: { display: false }, ticks: { font: { size: 10 } } },
                },
            },
        });
    }

    // 渲染预警表格
    renderInventoryAlertTable();
}

function renderInventoryAlertTable() {
    const tbody = document.getElementById('inventoryAlertBody');
    if (!tbody) return;
    tbody.innerHTML = inventoryAlerts.map(item => {
        const statusMap = {
            critical: '<span class="inv-status critical">严重缺货</span>',
            low: '<span class="inv-status low">低于安全库存</span>',
            normal: '<span class="inv-status normal">正常</span>',
        };
        const stagnantText = item.stagnant > 0 ? `${item.stagnant}天` : '-';
        const stagnantClass = item.stagnant > 60 ? 'inv-status stagnant' : item.stagnant > 30 ? 'inv-status low' : '';
        const actionBtn = item.status === 'critical'
            ? '<button class="inv-action-btn danger" onclick="showToast(\'已发起紧急补货申请\',\'success\')">紧急补货</button>'
            : item.status === 'low'
            ? '<button class="inv-action-btn" onclick="showToast(\'已生成采购建议\',\'success\')">采购建议</button>'
            : item.stagnant > 60
            ? '<button class="inv-action-btn danger" onclick="showToast(\'已发起呆滞处置流程\',\'success\')">呆滞处置</button>'
            : '<button class="inv-action-btn" onclick="showToast(\'已打开物料详情\',\'info\')">详情</button>';
        return `
            <tr>
                <td><strong>${item.code}</strong></td>
                <td>${item.name}</td>
                <td>${item.cat}</td>
                <td><span class="badge" style="background:${item.abc==='A'?'var(--danger)':item.abc==='B'?'#e6a23e':'var(--success)'};padding:2px 8px;border-radius:4px;font-size:11px;">${item.abc}类</span></td>
                <td style="font-weight:600;color:${item.stock < item.safety ? 'var(--danger)' : 'var(--success)'}">${item.stock.toLocaleString()}</td>
                <td>${item.safety.toLocaleString()}</td>
                <td>${statusMap[item.status]}</td>
                <td>${item.lastOut}</td>
                <td><span class="${stagnantClass}" style="font-weight:600;">${stagnantText}</span></td>
                <td>${actionBtn}</td>
            </tr>`;
    }).join('');
}

// ========== 物流中心图表 ==========
function initLogisticsCharts() {
    if (typeof Chart === 'undefined') return;
    // 发运趋势
    const shipCtx = document.getElementById('shipmentTrendChart');
    if (shipCtx && !App.charts.shipmentTrend) {
        App.charts.shipmentTrend = new Chart(shipCtx, {
            type: 'line',
            data: {
                labels: logisticsData.shipment.labels,
                datasets: [
                    {
                        label: '国内发运 (票)',
                        data: logisticsData.shipment.domestic,
                        borderColor: '#2a5298',
                        backgroundColor: 'rgba(42,82,152,0.06)',
                        fill: true, tension: 0.4, pointRadius: 0,
                    },
                    {
                        label: '海外发运 (票)',
                        data: logisticsData.shipment.overseas,
                        borderColor: '#e6a23e',
                        backgroundColor: 'rgba(230,162,62,0.06)',
                        fill: true, tension: 0.4, pointRadius: 0,
                    },
                ],
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                interaction: { intersect: false, mode: 'index' },
                plugins: { legend: { position: 'top', labels: { usePointStyle: true, padding: 15, font: { size: 11 } } } },
                scales: {
                    y: { title: { display: true, text: '发运票数', font: { size: 11 } }, grid: { color: '#f0f0f0' }, beginAtZero: true },
                    x: { grid: { display: false }, ticks: { maxRotation: 45, font: { size: 10 } } },
                },
            },
        });
    }

    // 运输方式饼图
    const tmCtx = document.getElementById('transportModeChart');
    if (tmCtx && !App.charts.transportMode) {
        App.charts.transportMode = new Chart(tmCtx, {
            type: 'doughnut',
            data: {
                labels: logisticsData.transportMode.labels,
                datasets: [{
                    data: logisticsData.transportMode.values,
                    backgroundColor: logisticsData.transportMode.colors,
                    borderWidth: 0, hoverOffset: 8,
                }],
            },
            options: {
                responsive: true, maintainAspectRatio: false, cutout: '60%',
                plugins: { legend: { display: false } },
            },
        });
        const legendEl = document.getElementById('transportModeLegend');
        if (legendEl) {
            legendEl.innerHTML = logisticsData.transportMode.labels.map((l, i) =>
                `<div class="pie-legend-item"><span style="background:${logisticsData.transportMode.colors[i]}"></span>${l}: ${logisticsData.transportMode.values[i]}%</div>`
            ).join('');
        }
    }

    // 承运商绩效
    const carrierCtx = document.getElementById('carrierPerfChart');
    if (carrierCtx && !App.charts.carrierPerf) {
        App.charts.carrierPerf = new Chart(carrierCtx, {
            type: 'bar',
            data: {
                labels: logisticsData.carriers.labels,
                datasets: [
                    {
                        label: '准时率 (%)',
                        data: logisticsData.carriers.onTimeRate,
                        backgroundColor: 'rgba(40,167,69,0.7)',
                        borderRadius: 4, yAxisID: 'y',
                    },
                    {
                        label: '成本指数',
                        data: logisticsData.carriers.costIndex,
                        backgroundColor: 'rgba(230,162,62,0.7)',
                        borderRadius: 4, yAxisID: 'y1',
                    },
                ],
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { position: 'top', labels: { usePointStyle: true, font: { size: 11 } } } },
                scales: {
                    y: { position: 'left', title: { display: true, text: '准时率%', font: { size: 11 } }, min: 70, max: 100, grid: { color: '#f0f0f0' } },
                    y1: { position: 'right', title: { display: true, text: '成本指数', font: { size: 11 } }, grid: { display: false } },
                    x: { grid: { display: false }, ticks: { font: { size: 10 } } },
                },
            },
        });
    }

    // 目的地分布
    const destCtx = document.getElementById('destinationChart');
    if (destCtx && !App.charts.destination) {
        App.charts.destination = new Chart(destCtx, {
            type: 'bar',
            data: {
                labels: logisticsData.destinations.labels,
                datasets: [{
                    label: '发运占比 (%)',
                    data: logisticsData.destinations.values,
                    backgroundColor: logisticsData.destinations.colors,
                    borderRadius: 4,
                }],
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { title: { display: true, text: '%', font: { size: 11 } }, grid: { color: '#f0f0f0' }, beginAtZero: true },
                    x: { grid: { display: false }, ticks: { font: { size: 10 } } },
                },
            },
        });
    }

    // 在途订单表格
    renderLogisticsTrackTable();
}

function renderLogisticsTrackTable() {
    const tbody = document.getElementById('logisticsTrackBody');
    if (!tbody) return;
    const statusMap = {
        '在途': '<span class="inv-status" style="background:#cce5ff;color:#004085;">在途</span>',
        '延误': '<span class="inv-status critical">延误</span>',
        '已签收': '<span class="inv-status normal">已签收</span>',
    };
    const modeMap = {
        '空运': '<i class="fas fa-plane" style="color:#2a5298;margin-right:4px;"></i>空运',
        '海运': '<i class="fas fa-ship" style="color:#17a2b8;margin-right:4px;"></i>海运',
        '陆运': '<i class="fas fa-truck" style="color:#28a745;margin-right:4px;"></i>陆运',
        '铁运': '<i class="fas fa-train" style="color:#e6a23e;margin-right:4px;"></i>铁运',
    };
    tbody.innerHTML = logisticsTracking.map(item => `
        <tr>
            <td><strong>${item.id}</strong></td>
            <td>${item.customer}</td>
            <td>${item.product}</td>
            <td>${item.dest}</td>
            <td>${item.carrier}</td>
            <td>${modeMap[item.mode] || item.mode}</td>
            <td>${item.shipDate}</td>
            <td>${item.eta}</td>
            <td>${statusMap[item.status] || item.status}</td>
        </tr>`).join('');
}

// ========== 系统设置 ==========
function initSettingsNav() {
    document.querySelectorAll('.settings-nav-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.settings-nav-item').forEach(n => n.classList.remove('active'));
            item.classList.add('active');
            document.querySelectorAll('.settings-panel').forEach(p => p.classList.remove('active'));
            const panel = document.getElementById(`setting-${item.dataset.setting}`);
            if (panel) panel.classList.add('active');
        });
    });
}

function initSettingsData() {
    // 用户管理表格
    const userBody = document.getElementById('userMgmtBody');
    if (userBody && userBody.children.length === 0) {
        userBody.innerHTML = userMgmtData.map(u => `
            <tr>
                <td><strong>${u.username}</strong></td>
                <td>${u.name}</td>
                <td><span class="badge" style="background:${u.role==='超级管理员'?'var(--danger)':u.role==='系统账户'?'#764ba2':'var(--primary)'};padding:2px 8px;border-radius:4px;font-size:11px;">${u.role}</span></td>
                <td>${u.dept}</td>
                <td><span class="inv-status ${u.status==='活跃'?'normal':'low'}">${u.status}</span></td>
                <td>${u.lastLogin}</td>
                <td><button class="inv-action-btn" onclick="showToast('用户 ${u.name} 信息已更新','success')">编辑</button></td>
            </tr>`).join('');
    }

    // 数据源集成
    const intGrid = document.getElementById('integrationGrid');
    if (intGrid && intGrid.children.length === 0) {
        intGrid.innerHTML = integrationData.map(item => `
            <div class="integration-card">
                <div class="int-icon"><i class="fas ${item.icon}"></i></div>
                <div class="int-info">
                    <div class="int-name">${item.name}</div>
                    <div class="int-desc">${item.desc}</div>
                    <div class="int-meta">
                        <span class="int-status" style="color:${item.color}"><i class="fas fa-circle" style="font-size:8px;"></i> ${item.status}</span>
                        <span class="int-sync">最近同步: ${item.lastSync}</span>
                    </div>
                </div>
                <button class="inv-action-btn" onclick="showToast('${item.name} 连接测试成功','success')">测试</button>
            </div>`).join('');
    }

    // 预警规则
    const ruleList = document.getElementById('warningRuleList');
    if (ruleList && ruleList.children.length === 0) {
        ruleList.innerHTML = warningRules.map((rule, i) => `
            <div class="rule-item">
                <div class="rule-info">
                    <div class="rule-name">${rule.name}</div>
                    <div class="rule-desc">类型: ${rule.type} | 条件: ${rule.condition}</div>
                </div>
                <div class="rule-meta">
                    <span class="badge" style="background:${rule.level==='严重'?'var(--danger)':rule.level==='警告'?'#e6a23e':'var(--info)'};padding:2px 8px;border-radius:4px;font-size:11px;">${rule.level}</span>
                    <label class="switch"><input type="checkbox" ${rule.enabled?'checked':''} onchange="showToast('规则已${rule.enabled?'禁用':'启用'}','info')"><span class="slider"></span></label>
                </div>
            </div>`).join('');
    }

    // 系统日志
    const logBody = document.getElementById('systemLogBody');
    if (logBody && logBody.children.length === 0) {
        const levelColors = { INFO: 'var(--info)', WARN: '#e6a23e', ERROR: 'var(--danger)' };
        logBody.innerHTML = systemLogs.map(log => `
            <tr>
                <td style="font-family:Consolas,monospace;font-size:12px;">${log.time}</td>
                <td><span class="badge" style="background:${levelColors[log.level]};padding:2px 8px;border-radius:4px;font-size:11px;">${log.level}</span></td>
                <td>${log.module}</td>
                <td>${log.user}</td>
                <td style="max-width:320px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${log.content}">${log.content}</td>
            </tr>`).join('');
    }
}

// ========== 流程图交互 ==========
function initFlowDiagram() {
    document.querySelectorAll('.process-node, .side-module, .cat-process').forEach(node => {
        node.addEventListener('click', () => showNodeDetail(node.dataset.node));
    });

    // 底部模块点击
    document.querySelectorAll('.bmod').forEach(mod => {
        mod.addEventListener('click', () => {
            document.querySelectorAll('.bmod').forEach(m => m.classList.remove('bmod-active'));
            mod.classList.add('bmod-active');
            showToast(`${mod.textContent.trim()} 模块已激活`, 'success');
        });
    });
}

function drawFlowLines() {
    const svg = document.getElementById('flowLines');
    if (!svg) return;
    svg.innerHTML = '';
    // 连接线由CSS虚线边框模拟，此处可扩展SVG动态连线
}

function showNodeDetail(nodeKey) {
    const data = nodeDetails[nodeKey];
    if (!data) {
        showToast('该节点暂无详细信息', 'warning');
        return;
    }

    const statusClass = data.status === '正常' ? 'success' : data.status === '警告' ? 'warning' : data.status === '预警' ? 'info' : 'danger';
    const statusBadge = `<span style="display:inline-block;padding:2px 10px;border-radius:4px;font-size:12px;color:#fff;background:var(--${statusClass})">${data.status}</span>`;

    document.getElementById('modalTitle').textContent = `${nodeKey} ${data.name}`;
    document.getElementById('modalBody').innerHTML = `
        <div class="node-detail-grid">
            <div class="nd-item"><div class="nd-label">节点名称</div><div class="nd-value">${data.name}</div></div>
            <div class="nd-item"><div class="nd-label">当前状态</div><div class="nd-value">${statusBadge}</div></div>
            <div class="nd-item"><div class="nd-label">节点描述</div><div class="nd-value">${data.desc}</div></div>
            <div class="nd-item"><div class="nd-label">本月处理数</div><div class="nd-value">${data.count}</div></div>
            <div class="nd-item"><div class="nd-label">平均处理时长</div><div class="nd-value">${data.avgTime}</div></div>
            <div class="nd-item"><div class="nd-label">环比变化</div><div class="nd-value" style="color:${data.trend.startsWith('+') ? 'var(--success)' : data.trend.startsWith('-') ? 'var(--danger)' : '#666'}">
                <i class="fas fa-${data.trend.startsWith('+') ? 'arrow-up' : data.trend.startsWith('-') ? 'arrow-down' : 'minus'}"></i> ${data.trend}
            </div></div>
        </div>
        <div style="margin-top:20px;padding:14px;background:#f8f9fa;border-radius:8px;">
            <strong style="color:var(--primary);font-size:14px;"><i class="fas fa-lightbulb" style="color:var(--accent);margin-right:6px;"></i>AI 建议</strong>
            <p style="margin-top:8px;color:#555;line-height:1.7;font-size:13px;">
                ${generateAiSuggestion(data)}
            </p>
        </div>
    `;
    document.getElementById('nodeModal').classList.add('show');
}

function generateAiSuggestion(data) {
    if (data.status === '预警') {
        return `检测到该环节存在效率瓶颈，建议：<br>1. 排查近期异常订单，识别共性原因<br>2. 考虑增加SMT并行产线或延长班次<br>3. 与客户确认是否需要调整ATP承诺交期`;
    } else if (data.status === '警告') {
        return `该指标接近警戒阈值，建议关注近期趋势变化。如涉及产能/物料问题，可提前启动跨BG资源协调。`;
    } else if (data.highlight) {
        return `此为核心枢纽节点，其输出直接影响下游多个环节。建议保持较高监控频率，确保S&OP信息及时同步至各BG。`;
    }
    return `该节点运行状态良好，建议继续保持当前的流程规范和监控机制。`;
}

function closeModal() {
    document.getElementById('nodeModal').classList.remove('show');
}
document.getElementById('nodeModal').addEventListener('click', (e) => {
    if (e.target.id === 'nodeModal') closeModal();
});

// ========== 预警表格渲染 ==========
function renderAlertTable() {
    const tbody = document.getElementById('alertTableBody');
    if (!tbody) return;

    tbody.innerHTML = alertEvents.map(e => {
        const levelColors = { critical: 'danger', warning: 'warning', info: 'info' };
        const levelLabels = { critical: '严重', warning: '警告', info: '提示' };
        const statusColors = { '待处理': 'danger', '跟进中': 'warning', '待确认': 'warning', '已退供': 'success', '维修中': 'warning', '已完成': 'success', '待续约': '' };
        return `
            <tr>
                <td>${e.time}</td>
                <td><span class="badge" style="background:var(--${levelColors[e.level]});padding:2px 8px;border-radius:4px;">${levelLabels[e.level]}</span></td>
                <td>${e.type}</td>
                <td style="max-width:280px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${e.desc}">${e.desc}</td>
                <td><span style="color:${['已完成','已退供'].includes(e.status) ? 'var(--success)' : 'var(--warning)'};font-weight:600;">${e.status}</span></td>
            </tr>`;
    }).join('');
}

// ========== 全程追踪 ==========
function initTracking() {
    renderTrackList();
}

function renderTrackList(filter) {
    const listEl = document.getElementById('trackList');
    if (!listEl) return;
    const items = filter ? trackingOrders.filter(o => o.status === filter) : trackingOrders;

    listEl.innerHTML = items.map(o => `
        <div class="track-item" onclick="showTrackDetail('${o.id}')">
            <div class="track-id">${o.id}</div>
            <div class="track-desc">${o.desc}</div>
            <div style="margin-top:4px;">
                <span style="font-size:11px;padding:2px 8px;border-radius:10px;background:${
                    o.status === '已完成' ? '#d4edda;color:#155724' :
                    o.status === '进行中' ? '#cce5ff;color:#004085' :
                    '#fff3cd;color:#856404'}">${o.status}</span>
            </div>
        </div>`).join('');
}

function searchTracking() {
    const query = document.getElementById('trackSearchInput').value.trim().toLowerCase();
    if (!query) { renderTrackList(); return; }
    const filtered = trackingOrders.filter(o => o.id.toLowerCase().includes(query) || o.desc.toLowerCase().includes(query));
    const listEl = document.getElementById('trackList');
    if (!listEl) return;
    if (filtered.length === 0) {
        listEl.innerHTML = '<div style="text-align:center;color:#999;padding:20px;font-size:13px;">未找到匹配的订单</div>';
    } else {
        listEl.innerHTML = filtered.map(o => `
            <div class="track-item" onclick="showTrackDetail('${o.id}')">
                <div class="track-id">${o.id}</div>
                <div class="track-desc">${o.desc}</div>
            </div>`).join('');
    }
}

function showTrackDetail(orderId) {
    document.querySelectorAll('.track-item').forEach(el => el.classList.remove('active'));
    if (event && event.currentTarget) event.currentTarget.classList.add('active');

    const container = document.getElementById('timelineContainer');
    container.innerHTML = timelineTemplate.map(step => `
        <div class="timeline-step">
            <div class="timeline-line">
                <div class="tl-dot ${step.status}">${step.step}</div>
                <div class="tl-bar"></div>
            </div>
            <div class="timeline-info">
                <div class="tl-title">${step.title}</div>
                <div class="tl-time"><i class="far fa-clock"></i> ${step.time}</div>
                <div class="tl-detail">${step.detail.replace(/\n/g, '<br>')}</div>
            </div>
        </div>
    `).join('');
}

// 筛选芯片点击
document.querySelectorAll('.filter-chip')?.forEach(chip => {
    chip.addEventListener('click', () => {
        document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const text = chip.textContent.trim();
        if (text === '全部') renderTrackList();
        else renderTrackList(text);
    });
});

// ========== AI 聊天 ==========
function initChatInput() {
    const input = document.getElementById('chatInput');
    if (!input) return;
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });
    input.style.height = 'auto';
    input.addEventListener('input', () => {
        input.style.height = '44px';
        input.style.height = Math.min(input.scrollHeight, 120) + 'px';
    });
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const msg = input.value.trim();
    if (!msg) return;

    addChatMessage(msg, 'user');
    input.value = '';
    input.style.height = '44px';

    // 显示打字指示器
    showTypingIndicator();

    // 模拟AI回复
    setTimeout(() => {
        hideTypingIndicator();
        const reply = getAiReply(msg);
        addChatMessage(reply, 'ai');
    }, 1200 + Math.random() * 800);
}

function sendQuickMsg(msg) {
    document.getElementById('chatInput').value = msg;
    sendMessage();
}

function addChatMessage(text, sender) {
    const container = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = `chat-msg ${sender}-msg`;
    div.innerHTML = `
        <div class="msg-avatar"><i class="fas fa-${sender === 'ai' ? 'robot' : 'user'}"></i></div>
        <div class="msg-body">${formatMarkdown(text)}</div>`;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function formatMarkdown(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/`([^`]+)`/g, '<code style="background:#eee;padding:1px 5px;border-radius:3px;">$1</code>')
        .replace(/\n/g, '<br>')
        .replace(/━+/g, '<hr style="border:none;border-top:1px solid #eee;margin:8px 0;">')
        .replace(/\|(.+)\|/g, (match, p1) => {
            const cells = p1.split('|').map(c => c.trim());
            if (cells.every(c => /^[-:]+$/.test(c))) return '';
            return '<table style="width:100%;border-collapse:collapse;font-size:12px;margin:6px 0;">' +
                cells.map(c => `<td style="border:1px solid #eee;padding:4px 8px;">${c}</td>`).join('') +
                '</table>';
        })
        .replace(/<table/g, '<table')
        .replace(/<\/table>/g, '</table>');
}

function getAiReply(msg) {
    const lowerMsg = msg.toLowerCase();
    if (lowerMsg.includes('预警') || lowerMsg.includes('告警')) return aiResponses['预警'];
    if (lowerMsg.includes('周转')) return aiResponses['周转率'];
    if (lowerMsg.includes('物流') || lowerMsg.includes('追踪') || lowerMsg.includes('airpods')) return aiResponses['物流'];
    if (lowerMsg.includes('周报') || lowerMsg.includes('报告') || lowerMsg.includes('摘要')) return aiResponses['周报'];
    if (lowerMsg.includes('协同') || lowerMsg.includes('oc') || lowerMsg.includes('pc') || lowerMsg.includes('协调')) return aiResponses['协同'];
    if (lowerMsg.includes('齐套') || lowerMsg.includes('mc') || lowerMsg.includes('物料')) return aiResponses['齐套'];
    if (lowerMsg.includes('buyer') || lowerMsg.includes('采购') || lowerMsg.includes('跟进')) return aiResponses['物流'];

    // 默认回复
    return `感谢您的提问！关于 **"${msg}"** ，我来为您分析：

根据当前歌尔供应链数据，我已检索到相关信息。以下是关键洞察：

✅ **数据摘要**: 已关联到 **${Math.floor(Math.random()*50+10)}** 条相关记录  
⚡ **响应时效**: 数据更新于 **${new Date().toLocaleTimeString()}**  
🔗 **关联影响**: 可能涉及 **${['声学器件','VR/AR模组','芯片采购','SMT产能'][Math.floor(Math.random()*4)]}** 环节

如需更详细的分析或生成专项报告，请告诉我您关注的维度（如产品线、客户、BG等），我将为您提供定制化的分析结果。`;
}

function showTypingIndicator() {
    const container = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = 'chat-msg ai-msg';
    div.id = 'typingIndicator';
    div.innerHTML = `
        <div class="msg-avatar"><i class="fas fa-robot"></i></div>
        <div class="msg-body"><div class="typing-indicator"><span></span><span></span><span></span></div></div>`;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function hideTypingIndicator() {
    const el = document.getElementById('typingIndicator');
    if (el) el.remove();
}

// ========== 工具函数 ==========
function showToast(message, type = '') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'times-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i> ${message}`;
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(40px)'; setTimeout(() => toast.remove(), 300); }, 3000);
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        document.body.classList.add('fullscreen-mode');
        showToast('已进入大屏监控模式', 'success');
    } else {
        document.exitFullscreen();
        document.body.classList.remove('fullscreen-mode');
        showToast('已退出大屏模式', 'info');
    }
}

// 键盘快捷键
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// ========== 客户交付绩效表 ==========
function renderCustomerPerfTable() {
    const tbody = document.getElementById('customerPerfBody');
    if (!tbody || tbody.children.length > 0) return;
    const ratingColors = { 'A+': '#28a745', 'A': '#2a5298', 'B+': '#e6a23e', 'B': '#dc3545' };
    tbody.innerHTML = customerPerfData.map(c => {
        const otdColor = c.otd >= 95 ? 'var(--success)' : c.otd >= 90 ? 'var(--primary-light)' : '#e6a23e';
        return `
        <tr>
            <td><strong>${c.customer}</strong></td>
            <td>${c.product}</td>
            <td style="color:${otdColor};font-weight:600;">${c.otd}%</td>
            <td style="font-weight:600;">${c.perfectOrder}%</td>
            <td>${c.ofct}</td>
            <td style="color:${c.returnRate > 1 ? 'var(--danger)' : 'var(--success)'}">${c.returnRate}%</td>
            <td><span style="display:inline-block;padding:2px 12px;border-radius:4px;font-size:12px;font-weight:700;color:#fff;background:${ratingColors[c.rating]}">${c.rating}</span></td>
        </tr>`;
    }).join('');
}
