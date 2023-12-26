const apiKey = "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";

const maxImages = 10; //number of genarate images for one prompt
let selectedImageNumber = null;

//genarate random number between min max
function getRandomNumber(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//disable generate button during generating
function disableGenerateButton(){
    document.getElementById("generate").disabled = true;
}

//enable generate button after generate
function enableGenerateButton(){
    document.getElementById("generate").disabled = false;
}

//clear image grid
function clearImageGrid(){
    const imageGrid = document.getElementById("image-grid");
    imageGrid.innerHTML = "";
}

//genarate images
async function generateImages(input){
    disableGenerateButton();
    clearImageGrid();

    const loading = document.getElementById("loading");
    loading.style.display = "block";

    const imageUrls = [];

    for(let i = 0; i < maxImages; i++){
        //generate random number between 1 to 10000 and append in to prompt
        const randomNumber = getRandomNumber(1, 10000);
        const prompt = `${input} ${randomNumber}`;
        //added random number to prompt to create different result
        const response = await fetch(
            "https://api-inference.huggingface.co/models/prompthero/openjourney",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`,
                },
                body: JSON.stringify({ inputs: prompt}),
            }
            );

            if(!response.ok){
                alert("Failed to generate image!");
            }

            const blob = await response.blob();
            const imgUrl = URL.createObjectURL(blob);
            imageUrls.push(imgUrl);

            const img = document.createElement("img");
            img.src = imgUrl;
            img.alt = `art-${i + 1}`;
            img.onclick = () => downloadImage(imgUrl, i);
            document.getElementById("image-grid").appendChild(img);
    }

    loading.style.display = "none";
    enableGenerateButton();

    selectedImageNumber = null; //reset selected number
}

document.getElementById("generate").addEventListener('click', () =>{
    const input = document.getElementById("user-prompt").value;
    generateImages(input);
});

function downloadImage(imgUrl, imageNumber){
    const link = document.createElement("a");
    link.href = imgUrl;
    //set filename
    link.download = `image-${imageNumber + 1}.jpg`;
    link.click();
}