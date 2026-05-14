/**
 * 供应链控制塔 - 模拟数据
 * Supply Chain Control Tower - Mock Data
 */

// ========== 预警事件数据 ==========
const alertEvents = [
    { time: '10:25', level: 'critical', type: '缺货', desc: '芯片 IC-2024-X 库存低于安全水位，缺口 5000pcs', status: '待处理' },
    { time: '10:18', level: 'warning', type: '延误', desc: '订单 SO-20250514-003 物流延误，预计延迟2天', status: '跟进中' },
    { time: '09:45', level: 'warning', type: '需求异常', desc: '客户 A公司 订单量环比增长180%，超出阈值', status: '待确认' },
    { time: '09:30', level: 'info', type: '合同', desc: '"华强电子" 框架协议将于5/20到期', status: '待续约' },
    { time: '08:50', level: 'critical', type: '质量', desc: '来料批次 B20250513-IQC02 FQC检验不合格', status: '已退供' },
    { time: '08:15', level: 'warning', type: '产能', desc: 'SMT产线3号机台稼动率低于75%', status: '维修中' },
    { time: '07:40', level: 'info', type: '交付', desc: '客户B PO-20250512-001 已签收POD', status: '已完成' },
];

// ========== 订单状态分布 ==========
const orderStatusData = {
    labels: ['已发货', '生产中', '待排程', '采购中', '已取消'],
    values: [245, 128, 86, 64, 12],
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

// ========== 供应商数据 ==========
const supplierData = {
    labels: ['华强电子', '立讯精密', '富士康', '比亚迪', '京东方', '其他'],
    values: [28, 22, 18, 14, 11, 7]
};

// ========== 流程节点详情数据 ==========
const nodeDetails = {
    '1.1': { name: '客户预测', desc: '接收并整合客户提供的滚动需求预测数据', status: '正常', count: 156, avgTime: '2h', trend: '+5%' },
    '1.2': { name: '内部预测', desc: '基于历史数据和算法模型生成内部需求预测', status: '正常', count: 89, avgTime: '4h', trend: '+2%' },
    '1.3': { name: '客户PO', desc: '客户正式下达的采购订单', status: '正常', count: 234, avgTime: '1h', trend: '+12%' },
    '1.4': { name: '销售订单SO', desc: '系统内创建的销售订单记录', status: '预警', count: 198, avgTime: '0.5h', trend: '+8%' },
    '1.5': { name: 'ATP交期承诺', desc: '可用量承诺计算与交期回复', status: '正常', count: 187, avgTime: '3h', trend: '-3%' },
    '1.6': { name: '需求预测管理', desc: '统一管理内外部需求预测，支持协同修正', status: '正常', count: '-', avgTime: '-', trend: '-' },

    '2.1': { name: 'S&OP计划', desc: '销售与运营协同计划，平衡供需', status: '正常', count: 24, avgTime: '8h', trend: '0%' },
    '2.2': { name: '产能负荷计划', desc: '评估各产线/工位产能利用率', status: '警告', count: 12, avgTime: '6h', trend: '+15%' },
    '2.3': { name: 'MDS主需求计划', desc: '综合后的主需求计划（核心节点）', status: '正常', count: 48, avgTime: '4h', trend: '+6%', highlight: true },
    '2.4': { name: 'MPS主生产计划', desc: '基于产能的主生产排程计划', status: '正常', count: 48, avgTime: '6h', trend: '+4%' },
    '2.5': { name: 'MRP物料需求计划', desc: '自动运算物料需求及采购建议', status: '正常', count: 96, avgTime: '2h', trend: '+1%' },
    '2.6': { name: 'CTB物料齐套', desc: '检查物料齐套率，识别缺料风险', status: '预警', count: 32, avgTime: '1h', trend: '-5%' },
    '2.7': { name: '外委外协计划', desc: '外协加工任务的计划与管理', status: '正常', count: 18, avgTime: '12h', trend: '+20%' },

    '3.1': { name: '采购订单', desc: '向供应商下达的采购订单', status: '正常', count: 567, avgTime: '2h', trend: '+9%' },
    '3.2': { name: '供应商协同', desc: '与供应商进行交期、数量等信息协同', status: '警告', count: 234, avgTime: '4h', trend: '-2%' },
    '3.3': { name: '备货与ASN指令', desc: '发送 ASN 预到货通知指令', status: '正常', count: 423, avgTime: '1h', trend: '+3%' },
    '3.4': { name: 'ASN到货预报', desc: '供应商反馈的到货预报信息', status: '正常', count: 398, avgTime: '30m', trend: '+7%' },
    '3.5': { name: '到料收货', desc: '实物到货验收与入库登记', status: '正常', count: 389, avgTime: '2h', trend: '+5%' },
    '3.6': { name: 'IQC来料检验', desc: '来料质量控制检验流程', status: '预警', count: 376, avgTime: '4h', trend: '+10%' },
    '3.7': { name: '入库上架', desc: '检验合格品入库至指定库位', status: '正常', count: 362, avgTime: '1h', trend: '+4%' },
    '3.8': { name: '原材料库存', desc: '原材料实时库存监控', status: '正常', count: '12,847', avgTime: '-', trend: '+3.2%' },
    '3.9': { name: '供应商对账与付款', desc: '月度对账及财务付款流程', status: '正常', count: 45, avgTime: '48h', trend: '0%' },
    '3.10': { name: '战略采购与供应商管理', desc: 'SRM 战略采购、供应商绩效评估', status: '正常', count: '-', avgTime: '-', trend: '-' },

    '4.1': { name: '生产排程', desc: '详细的生产作业排程计划', status: '正常', count: 96, avgTime: '3h', trend: '+2%' },
    '4.2': { name: '物料配送', desc: '生产线物料的准时化配送', status: '正常', count: 1200, avgTime: '30m', trend: '+1%' },
    '4.3': { name: '生产在制', desc: '在制品(WIP)的实时跟踪', status: '正常', count: '2,340', avgTime: '8h', trend: '+5%' },
    '4.4': { name: 'FQC检验', desc: '最终出货品质检验', status: '正常', count: 89, avgTime: '2h', trend: '-1%' },
    '4.5': { name: '包装入托', desc: '产品包装与托盘组码', status: '正常', count: 87, avgTime: '1h', trend: '+3%' },
    '4.6': { name: '成品入库', desc: '成品入仓登记', status: '正常', count: 85, avgTime: '1h', trend: '+4%' },
    '4.7': { name: '成品库存', desc: '成品实时库存监控', status: '正常', count: '3,256', avgTime: '-', trend: '+2.8%' },
    '4.8': { name: '存根加工', desc: '客制化后续加工工序', status: '正常', count: 34, avgTime: '4h', trend: '+8%' },

    '5.1': { name: '发货指令', desc: '生成出库发货指令单', status: '正常', count: 78, avgTime: '30m', trend: '+6%' },
    '5.2': { name: '出货拣配', desc: '按发货指令拣货配载', status: '正常', count: 76, avgTime: '2h', trend: '+2%' },
    '5.3': { name: '般关订舱', desc: '报关及船/舱位预订', status: '警告', count: 54, avgTime: '12h', trend: '+18%' },
    '5.4': { name: '发运离厂', desc: '货物离开工厂发运', status: '正常', count: 72, avgTime: '1h', trend: '+5%' },
    '5.5': { name: '在途可视', desc: '运输途中实时位置与状态追踪', status: '正常', count: 68, avgTime: '-', trend: '-' },
    '5.6': { name: '客户签收POD', desc: '客户签收凭证回传', status: '正常', count: 58, avgTime: '48h', trend: '+4%' },
    '5.7': { name: '对客开票与验收', desc: '开具发票并完成客户验收', status: '正常', count: 52, avgTime: '24h', trend: '+2%' },

    '6.1': { name: '客户退货接收', desc: '接收客户退回的产品', status: '正常', count: 12, avgTime: '2h', trend: '+15%' },
    '6.2': { name: '退检验与分拨', desc: '退货检验并分类(A/B/C)', status: '正常', count: 12, avgTime: '4h', trend: '+8%' },
    '6.3': { name: '修复翻新处理', desc: 'A类可翻新产品修复处理', status: '正常', count: 5, avgTime: '24h', trend: '0%' },
    '6.4': { name: '报废申请与处置', desc: 'C类报废品处置流程', status: '正常', count: 3, avgTime: '48h', trend: '-20%' },
    '6.5': { name: '退回或本核算', desc: 'B类放原材料可用品核算', status: '正常', count: 4, avgTime: '8h', trend: '+10%' },
};

// ========== 追踪列表数据 ==========
const trackingOrders = [
    { id: 'SO-20250514-001', desc: '华为通信模块 X200 - 1000pcs', status: '进行中', stage: 5 },
    { id: 'SO-20250514-002', desc: '小米IoT传感器套件 - 5000pcs', status: '进行中', stage: 4 },
    { id: 'SO-20250514-003', desc: 'OPPO手机配件组件 - 2000pcs', status: '异常', stage: 5 },
    { id: 'SO-20250513-001', desc: 'VIVO摄像头模组 - 800pcs', status: '已完成', stage: 7 },
    { id: 'SO-20250513-002', desc: '联想笔记本主板 - 300pcs', status: '已完成', stage: 7 },
    { id: 'SO-20250512-001', desc: '大疆无人机电调板 - 150pcs', status: '进行中', stage: 3 },
    { id: 'SO-20250512-002', desc: '蔚来汽车域控单元 - 50pcs', status: '进行中', stage: 2 },
    { id: 'SO-20250511-001', desc: '格力空调控制器 - 2000pcs', status: '已完成', stage: 7 },
];

// ========== 时间线模板数据 ==========
const timelineTemplate = [
    { step: 1, title: '需求->订单', time: '2025-05-01 09:00', detail: '客户PO已录入，SO编号：SO-20250514-001\n客户：华为技术有限公司\n产品：通信模块X200\n数量：1000pcs\n交期：2025-05-20', status: 'done' },
    { step: 2, title: '计划->备料', time: '2025-05-01 14:00', detail: 'MRP已运行，物料需求计划已发布\n关键缺料项：IC芯片(需紧急采购)\n齐套率：92%\n预计可齐套日期：2025-05-10', status: 'done' },
    { step: 3, title: '采购->入库', time: '2025-05-03 10:00', detail: '采购订单PO-20250503-001已下发\n供应商：华强电子\nASN已确认，预计到货：2025-05-08\n当前状态：IQC检验通过，已上架', status: 'done' },
    { step: 4, title: '生产->成品', time: '2025-05-10 08:00', detail: '生产排程已下达至SMT线体\n当前进度：WIP 600pcs / 总计 1000pcs\n良率：99.2%\n预计完工时间：2025-05-16', status: 'current' },
    { step: 5, title: '物流->客户', time: '预计 2025-05-17', detail: '待生产完成后触发发货\n承运商：顺丰速运（合同价）\n预计运输时效：3天', status: 'pending' },
    { step: 6, title: '交付验收', time: '预计 2025-05-20', detail: '目标交期：2025-05-20\n开票周期：T+3天\n回款周期：Net 30', status: 'pending' },
];

// ========== AI 回复模板 ==========
const aiResponses = {
    '预警': `根据当前系统数据分析，存在以下需要关注的预警：

**严重预警 (3条):**
1. 🔴 芯片 IC-2024-X 缺货 — 当前库存 120pcs，缺口 5000pcs，影响交付日期 06/01
2. 🔴 来料批次 B20250513-IQC02 FQC不合格 — 已发起退换货流程  
3. 🔴 SMT产线3号机台稼动率低于75% — 维修工程师已到场

**警告 (8条):**
- 🟡 SO-20250514-003 物流延误2天
- 🟡 客户A订单量异常波动 (+180%)
- 🟡 般关订舱等待时长增加

建议优先处理严重预警中的缺货问题，是否需要我生成详细的处置方案？`,

    '周转率': `📊 **本月库存周转率分析报告**

| 指标 | 本月 | 环比 | 同比 |
|------|------|------|------|
| 原材料周转天数 | 32天 | ↓3天 | ↓5天 |
| 在制品周转天数 | 8天 | ↑1天 | ↓2天 |
| 成品周转天数 | 12天 | ↓2天 | ↓4天 |
| **整体库存周转率** | **11.2次/年** | **↑0.8** | **↑1.5** |

**关键发现:**
✅ 原材料周转效率持续改善（得益于JIT策略）
⚠️ 在制品略有积压，建议关注产线平衡
💡 成品库存健康，无滞销风险

如需查看各SKU级别的明细，请告知具体产品线。`,

    '物流': `📍 **订单 SO-20250514-003 实时物流追踪**

**当前状态:** ⚠️ 运输延误中

| 节点 | 时间 | 状态 |
|------|------|------|
| 发货离厂 | 05-12 14:30 | ✅ 完成 |
| 到达转运中心 | 05-13 08:15 | ✅ 完成 |
| 出境报关 | 05-13 16:00 | ✅ 通过 |
| **航空运输中** | -- | 🔄 进行中 |
| 目的地清关 | 预计 05-15 | ⏳ 待到达 |

**延误原因:** 航班临时取消，已改签下一航班
**预计新到达时间:** 2025-05-16 10:00
**延误影响:** 延迟约2天

是否需要联系承运商或通知客户？`,

    '周报': `📋 **供应链健康度周报摘要 (05/09 - 05/15)**

━━━━━━━━━━━━━━━

**🎯 整体评分: 87/100 (良好)**

**核心KPI达成情况:**
- 订单履约率: **96.8%** ✅ (目标≥95%)
- 准时交付率: **94.2%** ⚠️ (目标≥96%)
- 库存准确率: **99.1%** ✅ (目标≥98%)
- 来料合格率: **97.8%** ✅ (目标≥96%)
- 产能利用率: **82%** ⚠️ (目标≥85%)

**本周亮点:**
🏆 新增客户"蔚来汽车"首单顺利交付
🏆 华为项目连续4周零缺陷
🏆 供应商协同效率提升12%

**需关注事项:**
⚠️ 3笔物流延误待处理
⚠️ 1个关键物料面临断供风险
⚠️ 2个产线稼动率不达标

**下周重点:**
1. 推进芯片备选供应商引入
2. 完成Q2供应商绩效评审
3. 启动旺季产能扩充准备

━━━━━━━━━━━━━━━`,
};

// ========== 分析图表数据 ==========
const analyticsData = {
    trendLabels: ['1月','2月','3月','4月','5月(预测)','6月(预测)'],
    actualValues: [85, 88, 91, 93, null, null],
    forecastValues: [null, null, null, null, 95, 97],
    efficiencyData: [88, 82, 95, 90, 78, 85],
    costLabels: ['原材料', '制造成本', '物流费用', '仓储成本', '管理费用', '其他'],
    costValues: [42, 28, 12, 9, 6, 3],
};
