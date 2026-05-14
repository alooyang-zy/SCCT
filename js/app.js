/**
 * 供应链控制塔 - 主应用逻辑
 * Supply Chain Control Tower - Main Application
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
    if (pageId === 'flow') drawFlowLines();
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
                        label: '物流准时率 (%)',
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
                height: 280,
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
                labels: ['IC-A001','IC-B002','CAP-C003','RES-D004','MEM-E005','CONN-F006','DIS-G007','LED-H008','PCB-I009','CASE-J010'],
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
        return `检测到该环节存在效率瓶颈，建议：<br>1. 排查近期异常订单，识别共性原因<br>2. 考虑增加并行处理资源<br>3. 与相关方确认SLA是否需要调整`;
    } else if (data.status === '警告') {
        return `该指标接近警戒阈值，建议关注近期趋势变化，必要时提前介入协调资源。`;
    } else if (data.highlight) {
        return `此为核心枢纽节点，其输出直接影响下游多个环节。建议保持较高监控频率，确保信息及时同步。`;
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
                <td><span style="color:${['已完成'].includes(e.status) ? 'var(--success)' : 'var(--warning)'};font-weight:600;">${e.status}</span></td>
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
    if (lowerMsg.includes('物流') || lowerMsg.includes('追踪')) return aiResponses['物流'];
    if (lowerMsg.includes('周报') || lowerMsg.includes('报告') || lowerMsg.includes('摘要')) return aiResponses['周报'];

    // 默认回复
    return `感谢您的提问！关于 **"${msg}"** ，我来为您分析：

根据当前供应链数据，我已检索到相关信息。以下是关键洞察：

✅ **数据摘要**: 已关联到 **${Math.floor(Math.random()*50+10)}** 条相关记录  
⚡ **响应时效**: 数据更新于 **${new Date().toLocaleTimeString()}**  
🔗 **关联影响**: 可能涉及 **${['采购','生产','物流','库存'][Math.floor(Math.random()*4)]}** 环节

如需更详细的分析或生成专项报告，请告诉我您关注的维度（如时间范围、产品线、客户等），我将为您提供定制化的分析结果。`;
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
