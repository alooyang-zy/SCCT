/**
 * 歌尔供应链控制塔 - 模拟数据
 * Goertek Supply Chain Control Tower - Mock Data
 * 行业：消费电子（声学器件/VR/AR/智能穿戴）
 */

// ========== 预警事件数据 ==========
const alertEvents = [
    { time: '10:25', level: 'critical', type: '缺货', desc: '主控芯片 BES2300 库存低于安全水位，缺口 8000pcs，影响Meta Quest项目', status: '待处理' },
    { time: '10:18', level: 'warning', type: '延误', desc: 'SO-GT20250514-003 发往Apple Cupertino 空运延误1天，DHL航班调整', status: '跟进中' },
    { time: '09:45', level: 'warning', type: '需求异常', desc: 'Sony WH-1000XM6 耳机订单量环比增长150%，需确认需求真实性', status: '待确认' },
    { time: '09:30', level: 'info', type: '合同', desc: '"瑞声科技" 声学组件框架协议将于05/20到期', status: '待续约' },
    { time: '08:50', level: 'critical', type: '质量', desc: '来料批次 B20250513-IQC02 MEMS麦克风FQC不合格率3.2%', status: '已退供' },
    { time: '08:15', level: 'warning', type: '产能', desc: 'SMT-A3线体稼动率低于78%，影响AirPods Pro交付节奏', status: '维修中' },
    { time: '07:40', level: 'info', type: '交付', desc: 'Samsung Galaxy Buds Pro2 订单已签收POD回传', status: '已完成' },
];

// ========== 订单状态分布 ==========
const orderStatusData = {
    labels: ['已发货', '生产中', '待排程', '采购中', '已取消'],
    values: [312, 186, 92, 74, 8],
    colors: ['#28a745', '#2a5298', '#f0b429', '#17a2b8', '#dc3545']
};

// ========== 库存趋势数据 (30天) ==========
function generateInventoryTrendData() {
    const labels = [];
    const inventory = [];
    const logistics = [];
    const baseDate = new Date('2025-04-15');
    for (let i = 0; i < 30; i++) {
        const d = new Date(baseDate);
        d.setDate(d.getDate() + i);
        labels.push(`${d.getMonth()+1}/${d.getDate()}`);
        inventory.push(12000 + Math.floor(Math.random() * 1500) - 400);
        logistics.push(85 + Math.random() * 13);
    }
    return { labels, inventory, logistics };
}

// ========== 供应商数据（歌尔供应链） ==========
const supplierData = {
    labels: ['瑞声科技', '立讯精密', '楼氏电子', '歌尔微电子', '台积电(代工)', '其他'],
    values: [25, 20, 16, 14, 12, 13]
};

// ========== 流程节点详情数据（歌尔电子行业） ==========
const nodeDetails = {
    '1.1': { name: '客户预测', desc: '接收Apple/Meta/Sony等客户的滚动需求预测，通常为13周滚动', status: '正常', count: 156, avgTime: '2h', trend: '+5%' },
    '1.2': { name: '内部预测', desc: '基于历史数据和ML模型生成内部需求预测，考虑NPI/MP/EOL阶段', status: '正常', count: 89, avgTime: '4h', trend: '+2%' },
    '1.3': { name: '客户PO', desc: '客户正式下达的采购订单，Apple PO需EDI对接', status: '正常', count: 234, avgTime: '1h', trend: '+12%' },
    '1.4': { name: '销售订单SO', desc: 'ERP内创建的销售订单，关联产品料号和客户项目号', status: '预警', count: 198, avgTime: '0.5h', trend: '+8%' },
    '1.5': { name: 'ATP交期承诺', desc: '可用量承诺计算与交期回复，考虑SMT产能和物料齐套', status: '正常', count: 187, avgTime: '3h', trend: '-3%' },
    '1.6': { name: '需求预测管理', desc: '统一管理内外部需求预测，支持跨BG差异化协同修正', status: '正常', count: '-', avgTime: '-', trend: '-' },

    '2.1': { name: 'S&OP计划', desc: '销售与运营协同计划，平衡声学/VR/穿戴三大BG供需', status: '正常', count: 24, avgTime: '8h', trend: '0%' },
    '2.2': { name: '产能负荷计划', desc: '评估SMT/组装/测试各产线产能利用率，含NPI产线预留', status: '警告', count: 12, avgTime: '6h', trend: '+15%' },
    '2.3': { name: 'MDS主需求计划', desc: '综合后的主需求计划（核心节点），区分NPI与MP需求', status: '正常', count: 48, avgTime: '4h', trend: '+6%', highlight: true },
    '2.4': { name: 'MPS主生产计划', desc: '基于SMT产能的主生产排程，含AOI检测节拍', status: '正常', count: 48, avgTime: '6h', trend: '+4%' },
    '2.5': { name: 'MRP物料需求计划', desc: '自动运算BOM展开及芯片/声学器件采购建议', status: '正常', count: 96, avgTime: '2h', trend: '+1%' },
    '2.6': { name: 'CTB物料齐套', desc: '检查芯片/PCB/声学组件齐套率，识别缺料风险', status: '预警', count: 32, avgTime: '1h', trend: '-5%' },
    '2.7': { name: '外委外协计划', desc: '外协SMT贴片/注塑/表面处理任务计划', status: '正常', count: 18, avgTime: '12h', trend: '+20%' },

    '3.1': { name: '采购订单', desc: '向芯片/声学/结构件供应商下达采购订单', status: '正常', count: 567, avgTime: '2h', trend: '+9%' },
    '3.2': { name: '供应商协同', desc: '与瑞声/立讯/楼氏等进行交期/数量协同', status: '警告', count: 234, avgTime: '4h', trend: '-2%' },
    '3.3': { name: '备货与ASN指令', desc: '发送ASN预到货通知指令，含MSL等级管控', status: '正常', count: 423, avgTime: '1h', trend: '+3%' },
    '3.4': { name: 'ASN到货预报', desc: '供应商反馈到货预报，含批次追溯码', status: '正常', count: 398, avgTime: '30m', trend: '+7%' },
    '3.5': { name: '到料收货', desc: '实物到货验收与入库登记，含ESD防护检查', status: '正常', count: 389, avgTime: '2h', trend: '+5%' },
    '3.6': { name: 'IQC来料检验', desc: '来料质量控制检验，MEMS/芯片需100%批次检测', status: '预警', count: 376, avgTime: '4h', trend: '+10%' },
    '3.7': { name: '入库上架', desc: '检验合格品入库至指定温湿度管控库位', status: '正常', count: 362, avgTime: '1h', trend: '+4%' },
    '3.8': { name: '原材料库存', desc: '芯片/声学器件/PCB等原材料实时库存', status: '正常', count: '12,847', avgTime: '-', trend: '+3.2%' },
    '3.9': { name: '供应商对账与付款', desc: '月度对账及财务付款流程，含多币种结算', status: '正常', count: 45, avgTime: '48h', trend: '0%' },
    '3.10': { name: '战略采购与供应商管理', desc: 'SRM战略采购、供应商绩效评估，含AVL管理', status: '正常', count: '-', avgTime: '-', trend: '-' },

    '4.1': { name: '生产排程', desc: 'SMT贴片/组装/测试详细作业排程', status: '正常', count: 96, avgTime: '3h', trend: '+2%' },
    '4.2': { name: '物料配送', desc: '产线SMD/声学组件准时化配送(JIT/Kanban)', status: '正常', count: 1200, avgTime: '30m', trend: '+1%' },
    '4.3': { name: '生产在制', desc: 'WIP在制品实时跟踪，含SMT/波峰焊/组装工站', status: '正常', count: '2,340', avgTime: '8h', trend: '+5%' },
    '4.4': { name: 'FQC检验', desc: '最终出货品质检验，含声学性能测试(频响曲线)', status: '正常', count: 89, avgTime: '2h', trend: '-1%' },
    '4.5': { name: '包装入托', desc: '产品包装与托盘组码，含Apple/Meta定制包装', status: '正常', count: 87, avgTime: '1h', trend: '+3%' },
    '4.6': { name: '成品入库', desc: '成品入仓登记，含SN序列号绑定', status: '正常', count: 85, avgTime: '1h', trend: '+4%' },
    '4.7': { name: '成品库存', desc: 'AirPods/Quest VR/智能手表成品实时库存', status: '正常', count: '3,256', avgTime: '-', trend: '+2.8%' },
    '4.8': { name: '客制加工', desc: 'Apple/Meta客制化后续加工工序(镭雕/贴标等)', status: '正常', count: 34, avgTime: '4h', trend: '+8%' },

    '5.1': { name: '发货指令', desc: '生成出库发货指令单，含客户特殊要求备注', status: '正常', count: 78, avgTime: '30m', trend: '+6%' },
    '5.2': { name: '出货拣配', desc: '按发货指令拣货配载，含FIFO先进先出管控', status: '正常', count: 76, avgTime: '2h', trend: '+2%' },
    '5.3': { name: '报关订舱', desc: '出口报关及空运/海运舱位预订', status: '警告', count: 54, avgTime: '12h', trend: '+18%' },
    '5.4': { name: '发运离厂', desc: '货物离开工厂发运，含GPS追踪激活', status: '正常', count: 72, avgTime: '1h', trend: '+5%' },
    '5.5': { name: '在途可视', desc: '运输途中实时位置与温湿度状态追踪', status: '正常', count: 68, avgTime: '-', trend: '-' },
    '5.6': { name: '客户签收POD', desc: '客户签收凭证回传，Apple需VMI系统同步', status: '正常', count: 58, avgTime: '48h', trend: '+4%' },
    '5.7': { name: '对客开票与验收', desc: '开具发票并完成客户验收，含Net60/90账期', status: '正常', count: 52, avgTime: '24h', trend: '+2%' },

    '6.1': { name: '客户退货接收', desc: '接收客户退回的RMA产品，含DOA分析', status: '正常', count: 12, avgTime: '2h', trend: '+15%' },
    '6.2': { name: '退检与分拨', desc: '退货检验并分类(A/B/C)，含声学性能复测', status: '正常', count: 12, avgTime: '4h', trend: '+8%' },
    '6.3': { name: '修复翻新处理', desc: 'A类可翻新产品修复处理，含固件升级', status: '正常', count: 5, avgTime: '24h', trend: '0%' },
    '6.4': { name: '报废申请与处置', desc: 'C类报废品处置流程，含环保合规(RoHS)审核', status: '正常', count: 3, avgTime: '48h', trend: '-20%' },
    '6.5': { name: '退回成本核算', desc: 'B类放原材料可用品核算，含残值评估', status: '正常', count: 4, avgTime: '8h', trend: '+10%' },
};

// ========== 追踪列表数据（歌尔客户） ==========
const trackingOrders = [
    { id: 'SO-GT20250514-001', desc: 'Apple AirPods Pro 3 代 - 50000pcs', status: '进行中', stage: 5 },
    { id: 'SO-GT20250514-002', desc: 'Meta Quest 4 VR头显 - 8000pcs', status: '进行中', stage: 4 },
    { id: 'SO-GT20250514-003', desc: 'Sony WH-1000XM6 降噪耳机 - 15000pcs', status: '异常', stage: 5 },
    { id: 'SO-GT20250513-001', desc: 'Samsung Galaxy Buds Pro2 - 20000pcs', status: '已完成', stage: 7 },
    { id: 'SO-GT20250513-002', desc: 'Pico 4 Ultra VR一体机 - 3000pcs', status: '已完成', stage: 7 },
    { id: 'SO-GT20250512-001', desc: '华为 FreeBuds Pro 4 - 25000pcs', status: '进行中', stage: 3 },
    { id: 'SO-GT20250512-002', desc: '小米 Buds 5 Pro - 18000pcs', status: '进行中', stage: 2 },
    { id: 'SO-GT20250511-001', desc: 'OPPO Enco X3 - 12000pcs', status: '已完成', stage: 7 },
];

// ========== 时间线模板数据（歌尔订单） ==========
const timelineTemplate = [
    { step: 1, title: '需求->订单', time: '2025-05-01 09:00', detail: '客户PO已录入，SO编号：SO-GT20250514-001\n客户：Apple Inc.\n产品：AirPods Pro 3代 (A2998)\n数量：50000pcs\n交期：2025-05-28', status: 'done' },
    { step: 2, title: '计划->备料', time: '2025-05-01 14:00', detail: 'MRP已运行，BOM展开完成\n关键缺料项：BES2300蓝牙芯片(需紧急采购)\n齐套率：89%\n预计可齐套日期：2025-05-10', status: 'done' },
    { step: 3, title: '采购->入库', time: '2025-05-03 10:00', detail: '采购订单PO-GT20250503-001已下发\n供应商：楼氏电子(Knowles)\nASN已确认，预计到货：2025-05-08\nIQC检验通过，MEMS麦克风已上架', status: 'done' },
    { step: 4, title: '生产->成品', time: '2025-05-10 08:00', detail: 'SMT-A1线体排程已下达\n当前进度：WIP 32000pcs / 总计 50000pcs\n声学测试良率：99.4%\nAOI检测通过率：99.8%\n预计完工：2025-05-22', status: 'current' },
    { step: 5, title: '物流->客户', time: '预计 2025-05-23', detail: '待生产完成后触发发货\n目的地：Apple Cupertino (美国)\n运输方式：空运 (DHL)\n报关：一般贸易出口\n预计运输时效：2天', status: 'pending' },
    { step: 6, title: '交付验收', time: '预计 2025-05-28', detail: '目标交期：2025-05-28\n开票周期：T+3天\n回款周期：Net 60\nVMI系统同步：需在48h内完成', status: 'pending' },
];

// ========== AI 回复模板（歌尔行业化） ==========
const aiResponses = {
    '预警': `根据当前歌尔供应链控制塔数据分析，存在以下需要关注的预警：

**严重预警 (3条):**
1. 🔴 BES2300蓝牙芯片缺货 — 当前库存800pcs，缺口8000pcs，影响Meta Quest 4交付
2. 🔴 MEMS麦克风来料不合格率3.2% — 已发起楼氏电子退换货流程
3. 🔴 SMT-A3线体稼动率低于78% — 影响AirPods Pro交付节奏

**警告 (8条):**
- 🟡 SO-GT20250514-003 发往Sony空运延误1天
- 🟡 Sony WH-1000XM6订单异常波动 (+150%)
- 🟡 出口报关等待时长增加

建议优先处理BES2300芯片缺货问题，是否需要我生成备选供应商引入方案？`,

    '周转率': `📊 **歌尔本月库存周转率分析报告**

| 指标 | 本月 | 环比 | 同比 |
|------|------|------|------|
| 声学器件周转天数 | 18天 | ↓2天 | ↓4天 |
| VR/AR模组周转天数 | 25天 | ↑3天 | ↓1天 |
| 芯片/IC周转天数 | 28天 | ↓1天 | ↓3天 |
| **整体库存周转率** | **8.6次/年** | **↑0.4** | **↑1.2** |

**关键发现:**
✅ 声学器件周转效率持续改善（得益于JIT/Kanban策略）
⚠️ VR/AR模组在制品略有积压，建议关注产线平衡
💡 芯片库存健康，但需关注BES2300单一来源风险

**行业对标:**
歌尔库存周转率 8.6次/年，优于消费电子行业均值 6.2次/年，低于立讯精密 9.1次/年

如需查看各SKU级别的明细，请告知具体产品线。`,

    '物流': `📍 **订单 SO-GT20250514-003 实时物流追踪**

**客户:** Sony Corporation
**产品:** WH-1000XM6 降噪耳机 - 15000pcs

| 节点 | 时间 | 状态 |
|------|------|------|
| 发货离厂(潍坊) | 05-12 14:30 | ✅ 完成 |
| 到达青岛机场 | 05-12 18:15 | ✅ 完成 |
| 出境报关 | 05-13 08:00 | ✅ 通过 |
| **空运运输中** | -- | 🔄 进行中 |
| 到达成田机场 | 预计 05-15 | ⏳ 待到达 |
| 日本清关+配送 | 预计 05-16 | ⏳ 待到达 |

**延误原因:** DHL航班临时调整，已改签CI020航班
**预计新到达时间:** 2025-05-16 14:00
**延误影响:** 延迟约1天，仍在Sony交期容许范围内

是否需要联系承运商或通知客户？`,

    '周报': `📋 **歌尔供应链健康度周报 (05/09 - 05/15)**

━━━━━━━━━━━━━━━

**🎯 整体评分: 87/100 (良好)**

**核心KPI达成情况 (SCOR指标):**
- 完美订单率: **93.2%** ✅ (目标≥90%)
- 订单履约周期(OFCT): **18天** ⚠️ (目标≤16天)
- 库存周转率(ITO): **8.6次/年** ✅ (目标≥8次)
- 现金周转周期(C2C): **42天** ✅ (目标≤45天)
- 来料合格率: **97.8%** ✅ (目标≥96%)

**本周亮点:**
🏆 Apple AirPods Pro 3首批量产良率达99.4%
🏆 Meta Quest 4 VR头显NPI转入MP阶段
🏆 供应商协同效率提升12%（EDI对接优化）

**需关注事项:**
⚠️ BES2300蓝牙芯片面临断供风险，需启动备选方案
⚠️ SMT-A3线体稼动率不达标，已安排周末维保
⚠️ 出口报关时效增加，影响3票在途订单

**下周重点:**
1. 推进BES2300备选供应商（恒玄科技）引入
2. 完成Q2供应商绩效评审（瑞声/立讯/楼氏）
3. 启动Q3旺季产能扩充准备（SMT-D5线体投产）

━━━━━━━━━━━━━━━`,

    '协同': `🤝 **多角色协同调度 — 歌尔供应链控制塔**

**当前协同场景：Meta Quest 4 交期确认**

| 角色 | 职责 | 当前状态 | 需要动作 |
|------|------|---------|---------|
| OC(订单协调) | 客户交期承诺 | 🟡 待确认 | 向Meta回复ATP交期 |
| PC(计划协调) | 产能排程调整 | 🟢 已排产 | SMT-B2线体已预留 |
| MC(物料协调) | 物料齐套保障 | 🔴 缺料 | BES2300缺口8000pcs |
| Buyer(采购) | 紧急采购执行 | 🟡 进行中 | 恒玄科技报价评估中 |

**AI建议：**
1. ⚡ MC优先确认BES2300替代方案，楼氏电子备选料号BK2700已通过验证
2. 📞 OC先回复Meta部分交期(60%按时,40%延后3天)
3. 🔄 Buyer加速恒玄科技采购流程，目标05-20到料
4. 📊 PC同步调整MPS，确保已齐套部分优先排产

**关键路径：** BES2300到料 → SMT贴片 → AOI检测 → 成品入库 → 发运
**预计可完全齐套日期：** 2025-05-20

是否需要我自动发起跨角色协同会议？`,

    '齐套': `📦 **MC物料齐套分析报告**

**当前订单：** Meta Quest 4 VR — SO-GT20250514-002
**BOM层级：** 3级 | **物料项数：** 247项

**齐套概览：**
- ✅ 已齐套：219项 (88.7%)
- 🟡 部分齐套：18项 (7.3%) — 在途/部分到货
- 🔴 缺料：10项 (4.0%) — 需紧急处理

**Top 5 缺料项：**
| 物料编号 | 名称 | 需求量 | 当前库存 | 缺口 | 预计到料 |
|---------|------|-------|---------|------|---------|
| IC-BES2300 | BES2300蓝牙芯片 | 8000 | 800 | 7200 | 05-20 |
| OLED-MICRO | Micro-OLED显示屏 | 200 | 65 | 135 | 05-18 |
| MEM-KNOW01 | MEMS麦克风(楼氏) | 8000 | 3500 | 4500 | 05-17 |
| PCB-HDI009 | HDI高密度板 | 300 | 80 | 220 | 05-19 |
| IC-QCC5181 | QCC5181蓝牙SoC | 600 | 200 | 400 | 05-21 |

**MC建议：**
1. 优先释放已齐套219项对应的生产工单
2. Buyer加速楼氏电子交货（已在跟进中）
3. 评估Micro-OLED替代供应商（索尼半导体）

是否需要MC自动触发紧急采购申请？`,
};

// ========== 分析图表数据 ==========
const analyticsData = {
    trendLabels: ['1月','2月','3月','4月','5月(预测)','6月(预测)'],
    actualValues: [85, 88, 91, 93, null, null],
    forecastValues: [null, null, null, null, 95, 97],
    efficiencyData: [88, 82, 95, 90, 78, 85],
    costLabels: ['原材料(芯片/声学)', '制造成本(SMT)', '物流费用', '仓储成本', '管理费用', '其他'],
    costValues: [42, 28, 12, 9, 6, 3],
};

// BG事业群绩效数据
const bgPerformanceData = {
    labels: ['声学BG', 'VR/AR BG', '智能穿戴BG', '半导体BG'],
    datasets: [
        { label: 'OTD准时率(%)', data: [95.2, 91.8, 93.5, 88.7], color: '#28a745' },
        { label: '库存周转率(次)', data: [9.2, 7.8, 8.5, 6.3], color: '#2a5298' },
        { label: 'FPY合格率(%)', data: [98.5, 96.2, 97.8, 94.1], color: '#e6a23e' },
    ],
};

// 客户交付绩效对比
const customerPerfData = [
    { customer:'Apple', product:'AirPods Pro 3', otd:96.5, perfectOrder:94.2, ofct:15, returnRate:0.3, rating:'A+' },
    { customer:'Meta', product:'Quest 4 VR', otd:93.8, perfectOrder:91.5, ofct:22, returnRate:0.8, rating:'A' },
    { customer:'Sony', product:'WH-1000XM6', otd:91.2, perfectOrder:89.8, ofct:20, returnRate:0.5, rating:'A' },
    { customer:'Samsung', product:'Galaxy Buds Pro2', otd:94.5, perfectOrder:92.1, ofct:18, returnRate:0.4, rating:'A' },
    { customer:'华为', product:'FreeBuds Pro 4', otd:97.1, perfectOrder:95.8, ofct:12, returnRate:0.2, rating:'A+' },
    { customer:'小米', product:'Buds 5 Pro', otd:89.5, perfectOrder:87.2, ofct:25, returnRate:1.1, rating:'B+' },
];

// ========== 库存管理数据（歌尔电子行业） ==========
const inventoryData = {
    // ABC分类
    abc: {
        labels: ['A类(高价值芯片/声学)', 'B类(结构件/PCB)', 'C类(包材/辅料)'],
        values: [15, 35, 50],
        colors: ['#dc3545', '#f0b429', '#28a745'],
        desc: ['占总价值70%，占SKU 15%', '占总价值25%，占SKU 35%', '占总价值5%，占SKU 50%'],
    },
    // 各类别库存分布
    category: {
        labels: ['芯片/IC', '声学器件', 'PCB/电路板', '结构件', '光学模组', '成品', '包材辅料'],
        values: [3200, 2800, 1600, 1400, 1200, 3100, 547],
        colors: ['#2a5298','#e6a23e','#28a745','#17a2b8','#764ba2','#667eea','#aab2bd'],
    },
    // 库存历史趋势
    history: {
        labels: Array.from({length:30}, (_,i) => {
            const d = new Date('2025-04-15');
            d.setDate(d.getDate()+i);
            return `${d.getMonth()+1}/${d.getDate()}`;
        }),
        rawMaterial: Array.from({length:30}, (_,i) => 6200 + Math.sin(i/5)*400 + (Math.random()-0.4)*300),
        semiProduct: Array.from({length:30}, (_,i) => 1800 + Math.sin(i/4+1)*200 + (Math.random()-0.5)*150),
        finishedGoods: Array.from({length:30}, (_,i) => 4400 + Math.sin(i/3+2)*300 + (Math.random()-0.3)*250),
    },
    // 周转分析
    turnover: {
        labels: ['芯片/IC', '声学器件', 'PCB/电路板', '光学模组', '结构件', '成品', '包材辅料'],
        turnoverDays: [8, 12, 15, 22, 18, 6, 25],
        stagnantDays: [45, 20, 30, 60, 25, 10, 55],
    },
};

// 低库存/呆滞预警清单（歌尔物料）
const inventoryAlerts = [
    { code:'IC-BES2300', name:'BES2300蓝牙芯片', cat:'芯片/IC', abc:'A', stock:800, safety:8000, status:'critical', lastOut:'2025-05-10', stagnant:0 },
    { code:'MEM-KNOW01', name:'MEMS麦克风(楼氏)', cat:'声学器件', abc:'A', stock:3500, safety:8000, status:'low', lastOut:'2025-05-08', stagnant:0 },
    { code:'PCB-HDI009', name:'HDI高密度板', cat:'PCB/电路板', abc:'B', stock:80, safety:300, status:'critical', lastOut:'2025-05-12', stagnant:0 },
    { code:'SPK-40mm', name:'40mm动圈扬声器', cat:'声学器件', abc:'A', stock:5000, safety:12000, status:'low', lastOut:'2025-05-06', stagnant:0 },
    { code:'IC-QCC5181', name:'QCC5181蓝牙SoC', cat:'芯片/IC', abc:'A', stock:200, safety:600, status:'critical', lastOut:'2025-05-11', stagnant:0 },
    { code:'CAS-AL6063', name:'铝合金外壳(阳极)', cat:'结构件', abc:'B', stock:180, safety:400, status:'low', lastOut:'2025-04-28', stagnant:0 },
    { code:'CON-USB-C', name:'USB-C连接器', cat:'芯片/IC', abc:'C', stock:2500, safety:500, status:'normal', lastOut:'2025-03-15', stagnant:60 },
    { code:'OLED-MICRO', name:'Micro-OLED显示屏', cat:'光学模组', abc:'A', stock:65, safety:200, status:'critical', lastOut:'2025-05-13', stagnant:0 },
    { code:'LED-WHITE', name:'白光LED模组', cat:'光学模组', abc:'C', stock:1800, safety:400, status:'normal', lastOut:'2025-02-20', stagnant:85 },
    { code:'PKG-ESD', name:'防静电包装袋', cat:'包材辅料', abc:'C', stock:30000, safety:5000, status:'normal', lastOut:'2025-03-01', stagnant:72 },
    { code:'CHE-THERMAL', name:'导热硅脂', cat:'包材辅料', abc:'C', stock:800, safety:300, status:'normal', lastOut:'2025-04-15', stagnant:30 },
    { code:'CABLE-FFC', name:'FFC柔性排线', cat:'芯片/IC', abc:'C', stock:150, safety:500, status:'critical', lastOut:'2025-05-09', stagnant:0 },
    { code:'SCREW-M2', name:'M2不锈钢螺丝组', cat:'结构件', abc:'C', stock:15000, safety:2000, status:'normal', lastOut:'2025-03-20', stagnant:55 },
    { code:'SPRING-0.5', name:'0.5mm精密弹簧', cat:'结构件', abc:'B', stock:200, safety:450, status:'low', lastOut:'2025-05-07', stagnant:0 },
    { code:'EMI-SHIELD', name:'EMI屏蔽罩', cat:'芯片/IC', abc:'B', stock:320, safety:600, status:'low', lastOut:'2025-05-05', stagnant:0 },
    { code:'ADH-3M', name:'3M工业胶带', cat:'包材辅料', abc:'C', stock:95, safety:400, status:'critical', lastOut:'2025-05-14', stagnant:0 },
    { code:'PAD-THERM', name:'导热垫片', cat:'包材辅料', abc:'C', stock:500, safety:300, status:'normal', lastOut:'2025-04-01', stagnant:42 },
    { code:'BOX-AP', name:'AirPods定制包装盒', cat:'包材辅料', abc:'B', stock:4500, safety:1000, status:'normal', lastOut:'2025-05-13', stagnant:0 },
];

// ========== 物流中心数据 ==========
const logisticsData = {
    // 发运趋势
    shipment: {
        labels: Array.from({length:30}, (_,i) => {
            const d = new Date('2025-04-15');
            d.setDate(d.getDate()+i);
            return `${d.getMonth()+1}/${d.getDate()}`;
        }),
        domestic: Array.from({length:30}, (_,i) => 12 + Math.sin(i/4)*3 + Math.floor(Math.random()*4)),
        overseas: Array.from({length:30}, (_,i) => 8 + Math.sin(i/5+1)*2 + Math.floor(Math.random()*3)),
    },
    // 运输方式占比
    transportMode: {
        labels: ['空运', '海运', '陆运', '铁运(中欧班列)'],
        values: [42, 28, 22, 8],
        colors: ['#2a5298', '#17a2b8', '#28a745', '#e6a23e'],
    },
    // 承运商绩效
    carriers: {
        labels: ['DHL', '顺丰速运', 'FedEx', '中远海运', 'UPS', '中铁快运'],
        onTimeRate: [95, 92, 93, 88, 94, 85],
        costIndex: [85, 72, 82, 55, 88, 48],
    },
    // 目的地分布
    destinations: {
        labels: ['北美', '东南亚', '欧洲', '日韩', '国内'],
        values: [35, 25, 20, 12, 8],
        colors: ['#2a5298', '#28a745', '#e6a23e', '#17a2b8', '#764ba2'],
    },
};

// 在途订单追踪
const logisticsTracking = [
    { id:'AWB-DHL-2025051401', customer:'Apple', product:'AirPods Pro 3', dest:'Cupertino, US', carrier:'DHL', mode:'空运', shipDate:'05-14', eta:'05-16', status:'在途' },
    { id:'AWB-FEX-2025051302', customer:'Meta', product:'Quest 4 VR', dest:'Menlo Park, US', carrier:'FedEx', mode:'空运', shipDate:'05-13', eta:'05-16', status:'在途' },
    { id:'AWB-DHL-2025051203', customer:'Sony', product:'WH-1000XM6', dest:'东京, 日本', carrier:'DHL', mode:'空运', shipDate:'05-12', eta:'05-15', status:'延误' },
    { id:'CNTR-COS-2025051004', customer:'Samsung', product:'Galaxy Buds Pro2', dest:'首尔, 韩国', carrier:'中远海运', mode:'海运', shipDate:'05-10', eta:'05-18', status:'在途' },
    { id:'AWB-SF-2025051305', customer:'华为', product:'FreeBuds Pro 4', dest:'深圳, 中国', carrier:'顺丰速运', mode:'陆运', shipDate:'05-13', eta:'05-14', status:'已签收' },
    { id:'CNTR-COS-2025050906', customer:'Xiaomi', product:'Buds 5 Pro', dest:'慕尼黑, 德国', carrier:'中远海运', mode:'海运', shipDate:'05-09', eta:'05-25', status:'在途' },
    { id:'AWB-UPS-2025051207', customer:'OPPO', product:'Enco X3', dest:'雅加达, 印尼', carrier:'UPS', mode:'空运', shipDate:'05-12', eta:'05-15', status:'在途' },
    { id:'CR-ZT-2025051108', customer:'Pico', product:'Pico 4 Ultra', dest:'华沙, 波兰', carrier:'中铁快运', mode:'铁运', shipDate:'05-11', eta:'05-28', status:'在途' },
    { id:'AWB-DHL-2025051009', customer:'Apple', product:'HomePod mini 3', dest:'Cork, 爱尔兰', carrier:'DHL', mode:'空运', shipDate:'05-10', eta:'05-13', status:'已签收' },
    { id:'CNTR-COS-2025050810', customer:'Meta', product:'Quest 4配件', dest:'新加坡', carrier:'中远海运', mode:'海运', shipDate:'05-08', eta:'05-20', status:'在途' },
];

// ========== 系统设置数据 ==========
const userMgmtData = [
    { username:'admin', name:'张明远', role:'超级管理员', dept:'IT信息部', status:'活跃', lastLogin:'2025-05-15 09:30' },
    { username:'wangjg', name:'王建国', role:'供应链总监', dept:'供应链管理部', status:'活跃', lastLogin:'2025-05-15 08:45' },
    { username:'liuyan', name:'刘燕', role:'计划经理', dept:'计划部', status:'活跃', lastLogin:'2025-05-14 17:20' },
    { username:'chenwei', name:'陈伟', role:'采购经理', dept:'采购部', status:'活跃', lastLogin:'2025-05-15 10:05' },
    { username:'zhaoli', name:'赵丽', role:'物流主管', dept:'物流部', status:'活跃', lastLogin:'2025-05-14 16:30' },
    { username:'sunqiang', name:'孙强', role:'质量工程师', dept:'质量管理部', status:'停用', lastLogin:'2025-04-20 14:10' },
    { username:'ai_agent', name:'AI助手', role:'系统账户', dept:'IT信息部', status:'活跃', lastLogin:'2025-05-15 01:00' },
];

const integrationData = [
    { name:'SAP ERP', icon:'fa-database', status:'已连接', desc:'歌尔SAP S/4HANA主数据源', color:'#28a745', lastSync:'2025-05-15 10:25' },
    { name:'MES系统', icon:'fa-microchip', status:'已连接', desc:'SMT产线MES实时数据', color:'#28a745', lastSync:'2025-05-15 10:24' },
    { name:'WMS仓储', icon:'fa-warehouse', status:'已连接', desc:'智能仓储管理系统', color:'#28a745', lastSync:'2025-05-15 10:20' },
    { name:'SRM供应商平台', icon:'fa-handshake', status:'已连接', desc:'供应商关系管理', color:'#28a745', lastSync:'2025-05-15 09:00' },
    { name:'DHL物流API', icon:'fa-plane', status:'已连接', desc:'DHL国际空运追踪接口', color:'#28a745', lastSync:'2025-05-15 10:25' },
    { name:'Apple VMI', icon:'fa-apple-whole', status:'部分连接', desc:'Apple VMI库存同步（仅读取）', color:'#e6a23e', lastSync:'2025-05-15 08:00' },
    { name:'TMS运输', icon:'fa-truck', status:'已连接', desc:'运输管理系统', color:'#28a745', lastSync:'2025-05-15 10:15' },
    { name:'QMS质量', icon:'fa-clipboard-check', status:'已连接', desc:'质量管理系统(IQC/FQC)', color:'#28a745', lastSync:'2025-05-15 10:10' },
];

const warningRules = [
    { name:'芯片库存低于安全水位', type:'库存', condition:'当前库存 < 安全库存 × 50%', level:'严重', enabled:true },
    { name:'物流延误超48小时', type:'物流', condition:'实际到达 - 预计到达 > 48h', level:'严重', enabled:true },
    { name:'来料不合格率超3%', type:'质量', condition:'IQC不合格率 > 3%', level:'严重', enabled:true },
    { name:'SMT稼动率低于80%', type:'产能', condition:'线体稼动率 < 80%', level:'警告', enabled:true },
    { name:'订单需求异常波动', type:'需求', condition:'环比变化 > 100%', level:'警告', enabled:true },
    { name:'供应商交付延迟超3天', type:'采购', condition:'实际交付 - 承诺交付 > 3天', level:'警告', enabled:true },
    { name:'合同即将到期', type:'合同', condition:'到期日 - 今天 < 7天', level:'提示', enabled:true },
    { name:'呆滞物料超90天', type:'库存', condition:'最后出库 > 90天 且 库存>安全库存', level:'提示', enabled:false },
];

const systemLogs = [
    { time:'2025-05-15 10:25:03', level:'INFO', module:'库存', user:'系统', content:'库存数据同步完成，更新 1,247 条记录' },
    { time:'2025-05-15 10:20:15', level:'WARN', module:'物流', user:'系统', content:'DHL航班CI020调整，影响3票在途订单' },
    { time:'2025-05-15 09:45:22', level:'WARN', module:'订单', user:'王建国', content:'修改SO-GT20250514-003交期：05-28 → 06-01' },
    { time:'2025-05-15 09:30:00', level:'INFO', module:'系统', user:'admin', content:'系统启动，数据源连接正常' },
    { time:'2025-05-15 08:50:14', level:'ERROR', module:'质量', user:'系统', content:'IQC检验批次B20250513-IQC02不合格率3.2%，触发退供流程' },
    { time:'2025-05-15 08:15:30', level:'WARN', module:'系统', user:'系统', content:'SMT-A3线体稼动率78.3%，低于阈值80%' },
    { time:'2025-05-14 17:20:45', level:'INFO', module:'订单', user:'刘燕', content:'创建新销售订单 SO-GT20250515-001' },
    { time:'2025-05-14 16:30:10', level:'INFO', module:'物流', user:'赵丽', content:'确认发运 AWB-DHL-2025051401' },
];
