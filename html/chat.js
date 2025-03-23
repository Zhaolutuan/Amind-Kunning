// Kimi API配置
const BASE_URL = "https://api.moonshot.cn/v1";  
const API_KEY = "sk-9G4wSU3AgwCmYCDAhwJr534l6cjTzNKIjNCUcSetpOWlP3tb";  // 使用你的Kimi API密钥

// DOM元素
const submitButton = document.querySelector(".submit-button");
const inputElement = document.getElementById('inputbox');
const chatbox = document.getElementById('chatbox');

// 存储选中的关键词
let selectedKeywords = [];

// 发送消息函数（流式响应版本）
async function sendMessage() {
    const userInput = inputElement.value.trim();
    const keywords = selectedKeywords.length > 0 ? `[关键词: ${selectedKeywords.join(', ')}]` : '';

    // 如果用户没有输入文本，但选择了关键词，则将关键词作为消息内容
    const fullMessage = userInput ? `${userInput} ${keywords}` : keywords;

    if (fullMessage) {
        // 创建用户消息元素（只显示用户输入的内容，不显示关键词）
        const userMessage = document.createElement('div');
        userMessage.className = 'user-message';
        userMessage.textContent = userInput; // 只显示用户输入的内容
        chatbox.appendChild(userMessage);

        // 清空输入框和选中的关键词
        inputElement.value = '';
        clearSelectedKeywords();

        // 创建机器人回复元素（提前创建以支持流式显示）
        const botMessage = document.createElement('div');
        botMessage.className = 'bot-message';
        chatbox.appendChild(botMessage);

        try {
            console.log('开始发送请求...');
            const response = await fetch(`${BASE_URL}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    model: "moonshot-v1-8k", 
                    messages: [
                        {
                            role: 'system',
                            content: '你是一名专注于跨境电商领域的高级营销文案专家，具有丰富的国际市场经验，熟悉不同地区的文化差异、消费心理和语言风格。你的目标是为跨境电商客户提供精准、有吸引力且文化适配的营销文案，帮助提升品牌知名度、增加客户转化率和促进销量增长。'
                        },
                        {
                            role: 'user',
                            content: fullMessage // 发送完整消息（包含关键词）给 API
                        }
                    ],
                    stream: true  // 开启流式响应
                })
            });

            console.log('API响应状态:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API错误 (${response.status}): ${errorText}`);
            }

            // 获取响应的数据流
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let responseText = '';

            // 循环读取数据流
            while (true) {
                const {done, value} = await reader.read();
                if (done) break;

                // 解码二进制数据
                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                // 处理每一行数据
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            // 检查是否是结束标记
                            if (line.trim() === 'data: [DONE]') {
                                console.log('流式响应结束');
                                break; // 结束循环
                            }

                            // 解析 JSON 数据
                            const data = JSON.parse(line.slice(6));
                            if (data.choices[0].delta?.content) {
                                // 将新内容添加到响应文本中
                                responseText += data.choices[0].delta.content;
                                // 更新显示
                                botMessage.textContent = responseText;
                                // 自动滚动到最新消息
                                chatbox.scrollTop = chatbox.scrollHeight;
                            }
                        } catch (e) {
                            console.error('解析流式数据时出错:', e);
                        }
                    }
                }
            }

        } catch (error) {
            console.error('API调用错误:', error);
            const errorMessage = document.createElement('div');
            errorMessage.className = 'bot-message error';
            errorMessage.textContent = '机器人无法回复，请检查网络或API配置。';
            chatbox.appendChild(errorMessage);
        }

        // 滚动到最新消息
        chatbox.scrollTop = chatbox.scrollHeight;
    }
}

// 处理关键词按钮点击
document.addEventListener('DOMContentLoaded', function() {
    const keywordButtons = document.querySelectorAll('.keyword');
    
    keywordButtons.forEach((button) => {
        button.addEventListener('click', function() {
            const keyword = button.textContent.trim();
            
            if (selectedKeywords.includes(keyword)) {
                selectedKeywords = selectedKeywords.filter(k => k !== keyword);
                button.classList.remove('selected');
            } else {
                selectedKeywords.push(keyword);
                button.classList.add('selected');
            }
            
            // 更新输入框预览
            updateInputPreview();
        });
    });
});

// 更新输入框预览
function updateInputPreview() {
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
        button.classList.remove('selected');
    });
}

// 绑定发送按钮点击事件
submitButton.addEventListener('click', sendMessage);

// 绑定回车键发送
inputElement.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});
