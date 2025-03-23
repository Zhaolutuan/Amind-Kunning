// 关键词字典
const KeyWordDictionary = {
    input: {
        category1: [
            "目标市场分析",
            "消费者行为研究",
            "竞争对手分析",
            "市场细分策略",
            "品牌定位",
            "产品生命周期分析",
            "SWOT分析",
            "PEST分析",
            "相关关键词",
            "相关关键词",
            "相关关键词",
            "相关关键词",
            "相关关键词",
            "相关关键词",
            "相关关键词",
            "相关关键词"
        ],
        category2: [
            "用户画像",
            "客户旅程地图",
            "需求挖掘",
            "痛点分析",
            "购买动机",
            "用户反馈分析",
            "客户满意度调查",
            "用户体验优化",
            "相关关键词",
            "相关关键词",
            "相关关键词",
            "相关关键词",
            "相关关键词",
            "相关关键词",
            "相关关键词",
            "相关关键词"
        ]
    },
    output: {
        category1: [
            "营销策略制定",
            "品牌传播计划",
            "广告创意设计",
            "社交媒体营销",
            "内容营销策略",
            "搜索引擎优化",
            "电子邮件营销",
            " influencer营销",
            "相关关键词",
            "相关关键词",
            "相关关键词",
            "相关关键词",
            "相关关键词",
            "相关关键词",
            "相关关键词",
            "相关关键词"
        ],
        category2: [
            "销售渠道优化",
            "促销活动策划",
            "价格策略调整",
            "客户关系管理",
            "忠诚度计划",
            "数据分析与报告",
            "ROI优化",
            "营销自动化",
            "相关关键词",
            "相关关键词",
            "相关关键词",
            "相关关键词",
            "相关关键词",
            "相关关键词",
            "相关关键词",
            "相关关键词"
        ]
    }
};

// 存储选中的关键词
let selectedKeywords = [];

// 处理关键词按钮点击事件
function monitor(event) {
    const button = event.target;
    const keyword = button.textContent.trim(); // 获取按钮的文本内容作为关键词

    if (keyword) {
        // 如果已选中，移除关键词；否则添加关键词
        if (selectedKeywords.includes(keyword)) {
            selectedKeywords = selectedKeywords.filter((k) => k !== keyword);
        } else {
            selectedKeywords.push(keyword);
        }
    }

    // 切换按钮的激活状态
    button.classList.toggle("selected");

    // 更新输入框预览
    updateInputPreview();
}

// 更新输入框预览
function updateInputPreview() {
    const inputElement = document.getElementById('inputbox');
    const currentInput = inputElement.value.trim();
    const baseInput = currentInput.replace(/\s*\[关键词:.*\]/, '');

    if (selectedKeywords.length > 0) {
        inputElement.value = `${baseInput} [关键词: ${selectedKeywords.join(', ')}]`;
    } else {
        inputElement.value = baseInput;
    }
}

// 清除选中的关键词
function clearSelectedKeywords() {
    selectedKeywords = [];
    document.querySelectorAll('.keyword').forEach(button => {
        button.classList.remove("selected");
    });
}

// 初始化关键词按钮事件
function initKeywordButtons() {
    const inputCategory1Buttons = document.querySelectorAll('.input-category1 .keyword');
    const inputCategory2Buttons = document.querySelectorAll('.input-category2 .keyword');
    const outputCategory1Buttons = document.querySelectorAll('.output-category1 .keyword');
    const outputCategory2Buttons = document.querySelectorAll('.output-category2 .keyword');

    inputCategory1Buttons.forEach(button => button.addEventListener('click', monitor));
    inputCategory2Buttons.forEach(button => button.addEventListener('click', monitor));
    outputCategory1Buttons.forEach(button => button.addEventListener('click', monitor));
    outputCategory2Buttons.forEach(button => button.addEventListener('click', monitor));
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initKeywordButtons);