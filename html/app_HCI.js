let conversationHistory = []; // 用于记录对话历史
var cnt = 10;   //选择的个数，游戏长度
const myContent = document.getElementById('inputbox')
const prompt = "我们一起来玩一个文字冒险游戏吧，我希望获取沉浸式的体验，但我有几个要求。"
+"首先，你需要为我设置背景故事，和这个冒险故事的主线，其中包括开端，发展，高潮和结尾。背景故事是这个冒险故事的开端，我能够基于这个主线做出不同选择，并且沿着主线进行下去，最终达成结局"
+"同时你需要给予我四个可供选项，同时允许我自己做出不同于以上四个的选项，我希望在这个游戏过程中做出6-8个选择，并且能够完成这个故事，有一个结局。"
+"除此之外，我希望你返回给我的数据格式为一个JSON字符串,其中包括当前背景，场景的描述，和我的选择，其中场景描述用于我生成符合描述的图片。"
+"我为你演示我想要的数据格式，我希望你返回给我的JSON字符串为:{\"主线\":,\"背景\":,\"场景描述\":,\"选择\":['','','','']}。"
+"对于场景描述，你应该告诉我的是当前发生了什么。对于选择，使用数组的形式即可，并且选择和背景都用中文回答我。"
+"你可以直接开始以我所说的Json字符串的格式与我聊天，不需要说其他的话了。当我做出回复后，你需要根据我的回复为我构建下一个场景的描述和背景，你需要依然保持这个规则，即返回我对应格式的JSON字符串。"
var zhuxian = "" //主线任务
getMessage_prompt()
const title = document.getElementById('title')
const ch1 = document.getElementById('choice1')
const ch2 = document.getElementById('choice2')
const ch3 = document.getElementById('choice3')
const ch4 = document.getElementById('choice4')
const submitButton = document.getElementById('submit')
var bkg = ""
function setImageSource(url) {
    var imageElement = document.getElementById('myImage');
    imageElement.src = url;
}
function choice1(){
    getMessage(ch1.innerText)
}
function choice2(){
    getMessage(ch2.innerText)
}
function choice3(){
    getMessage(ch3.innerText)
}
function choice4(){
    getMessage(ch4.innerText)
}
function choice5(){
    getMessage(document.getElementById('inputbox').value)
}

async function getMessage(content){
    cnt--;
    conversationHistory.push({ role: 'user', content: "请根据我的选择和基于你之前对话中所述的背景和场景，为我叙述下一个背景、场景和我可以做出的新的选择。之前设置的主线是："+zhuxian+"。你应该时刻谨记着主线，我希望在+"+cnt.toString()+"个选择后结束这场游戏，你的叙述必须在那个时候来到结局。场景叙述的要求是与之前你设立的主线相扣合，并且能根据我做出的选择来生成不同的场景描述，上一个场景描述与下一个场景描述之间，要求逻辑合理且与选择有明确相关性，但这一切都需要建立在符合主线的基础上。你为我生成的叙述，依然需要通过JSON的格式返回给我，当游戏结束后，你直接把背景的返回值设立为游戏结束即可，以下是我做出的选择："+content });
    const options = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
        },
        body:JSON.stringify({
            model: "gpt-4o",
            messages: conversationHistory,
            //messages: [{role: "user", content: "请依旧以我上述的JSON字符串的格式返回给我,返回给我的数据格式为一个JSON字符串,其中包括当前背景，目前场景的描述，和我的选择，其中场景描述用于我生成符合描述的图片，我为你演示我想要的数据格式，我希望你返回给我的JSON字符串为:{\"背景\":,\"场景描述\":,\"选择\":['','','','']},对于场景描述，使用英文回答。对于选择，使用数组的形式即可，并且选择和背景都用中文回答我。"+"在此之前，请记住你之前为我提供的背景和我做出的选择"+bkg+"下面是我的回复"+content}],
            temperature: 0.7,
            max_tokens:512,
        })  
    }
    try{
        /*
        const Response = await fetch('https://api.openai.com/v1/chat/completions',options)
        const res = await Response.json();
        var datas = res['choices'][0]['message']['content'];
        console.log(res)
        var check = 0;
        var ans =""
        for(let i=0;i<datas.length;i++){
            if(datas[i]=="{"){
                check++;
            }
            else if(datas[i]=="}"){
                check--;
            }
            if(check != 0){
                ans+=datas[i]
                console.log(datas[i])
            }
        }
        ans+="}"
        console.log(ans)
        const jsonString = ans.trim();
        const jsonObject = JSON.parse(jsonString);
        console.log(jsonObject);
        
        title.innerText = jsonObject['背景']
        ch1.innerText = jsonObject['选择'][0]
        ch2.innerText = jsonObject['选择'][1]
        ch3.innerText = jsonObject['选择'][2]
        ch4.innerText = jsonObject['选择'][3]
        */
        const Response = await fetch('https://api.openai.com/v1/chat/completions',options)
        const res = await Response.json();
        var datas = res['choices'][0]['message']['content'];
        //console.log("datas = "+datas)
        var check = 0;
        var ans =""
        for(let i=0;i<datas.length;i++){
            if(datas[i]=="{"){
                check++;
            }
            else if(datas[i]=="}"){
                check--;
            }
            if(check != 0){
                ans+=datas[i]
            }
        }
        ans+="}"
        //console.log(ans)
        const jsonString = ans.trim();
        const jsonObject = JSON.parse(jsonString); 
        bkg = jsonObject['背景']      
        title.innerText = jsonObject['场景描述']
        getImages(jsonObject['场景描述'])
        ch1.innerText = jsonObject['选择'][0]
        ch2.innerText = jsonObject['选择'][1]
        ch3.innerText = jsonObject['选择'][2]
        ch4.innerText = jsonObject['选择'][3]
    }catch(error){
        console.error(error)
    }
}
async function getMessage_prompt(){
    conversationHistory.push({ role: 'user', content: prompt }); // 初始化时添加用户输入
    const options = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
        },
        body:JSON.stringify({
            model: "gpt-4o",
            messages: conversationHistory,
            //messages: [{role: "user", content: prompt}],
            temperature: 0.7,
            max_tokens:512,
        })  
    }
    try{
        const Response = await fetch('https://api.openai.com/v1/chat/completions',options)
        const res = await Response.json();
        var datas = res['choices'][0]['message']['content'];
        //console.log("datas = "+datas)
        var check = 0;
        var ans =""
        for(let i=0;i<datas.length;i++){
            if(datas[i]=="{"){
                check++;
            }
            else if(datas[i]=="}"){
                check--;
            }
            if(check != 0){
                ans+=datas[i]
            }
        }
        ans+="}"
        //console.log(ans)
        const jsonString = ans.trim();
        const jsonObject = JSON.parse(jsonString);        
        title.innerText = jsonObject['背景']
        getImages(jsonObject['场景描述'])
        zhuxian = jsonObject['主线']
        ch1.innerText = jsonObject['选择'][0]
        ch2.innerText = jsonObject['选择'][1]
        ch3.innerText = jsonObject['选择'][2]
        ch4.innerText = jsonObject['选择'][3]
    }catch(error){
        console.error(error)
    }
}
async function getImages(content) {
    const options = {
        method: "POST",
        headers: {
            "Authorization":  `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "prompt": content,
            "n": 1,
            "size": "512x512"
        })
    }
    try{
        const response = await fetch('https://api.openai.com/v1/images/generations',options)
        const data = await response.json()
        console.log(data)
        //imageElement.src = data['data'][0]['url'];
        setImageSource(data['data'][0]['url']);
    } catch(error){
        console.error(error)
    }
}
document.getElementById('submit').addEventListener('click',getImages)
//submitButton.addEventListener('click',getMessage)