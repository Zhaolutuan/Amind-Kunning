const submitButton = document.querySelector(".submit-button")
const inputElement = document.querySelector("#inputbox")
const imageElement = document.querySelector("#myImage");
function setImageSource(url) {
    var imageElement = document.getElementById('image-placeholder');
    imageElement.src = url;
}

// 示例: 动态设置图片源链接
const getImages = async () => {
    alert(inputElement.value);
    const options = {
        method: "POST",
        headers: {
            "Authorization":  `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "prompt": inputElement.value,
            "n": 1,
            "size": "512x512"
        })
    }
    try{
        const response = await fetch('https://api.openai.com/v1/images/generations',options)
        const data = await response.json()
        //imageElement.src = data['data'][0]['url'];
        setImageSource(data['data'][0]['url']);
    } catch(error){
        console.error(error)
    }
}
submitButton.addEventListener('click',getImages)
