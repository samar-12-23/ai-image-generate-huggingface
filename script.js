const generateForm =  document.querySelector(".generate-form");
const imageGallery = document.querySelector(".image-gallery");


const OPENAI_API_KEY= "";
let isImageGenerating=false;



const updateImageCard = (imgDataArray) =>{
    imgDataArray.forEach((imgObject,index) => {
        const imgCard =  imageGallery.querySelectorAll(".img-card")[index];
        const imgElement = imgCard.querySelector("img");

        const downloadBtn = imgCard.querySelector(".download-btn");


        //Set the image source to the AI-generated images data 
        const aiGeneratedImg = `data:image/jpeg;base64,${imgObject.b64_json}`;
        imgElement.src = aiGeneratedImg;

        //when the image is loaded , remove the loading class
        imgElement.onload = () => {
            imgCard.classList.remove("loading");
            downloadBtn.setAttribute("href",aiGeneratedImg);
            downloadBtn.setAttribute("download",`${new Date().getTime()}.jpg`);
        }
        
    });

}


const generateAiImages = async(userPrompt,userImgQuantity) => {
    try{

        const response = await fetch("https://api.openai.com/v1/images/generations ",{
            method: "POST",
            headers:{
                
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body:JSON.stringify({
               
                prompt:userPrompt,
                n: parseInt(userImgQuantity),
                size:"512x512",
                response_format:"b64_json"
            })
        });

        if (!response.ok) throw new Error("Failed to generate images! Please Try Again..")


        const { data } =await response.json();
        console.log(data);

        updateImageCard([...data]);

    }catch (error){
        alert(error.message);

    } finally{
        isImageGenerating=false;
    }
}

const handleFormSubmission =  (e) =>{
    e.preventDefault();
    if(isImageGenerating) return;
    isImageGenerating=true;
    
    // Get user input and image quantity values from the form
    const userPrompt=e.srcElement[0].value;
    const userImgQuantity=e.srcElement[1].value;

    // console.log(userPrompt,userImgQuantity);

    // Creating HTML Markup for image cards with loading state
    const imgCardMarkup = Array.from({length: userImgQuantity},() =>

        `<div class="img-card loading">
            <img src="images/loader.svg" alt="image">
            <a href="#" class="download-btn">
                <img src="images/download.svg" alt="download icon">
            </a>
        </div>`
    ).join("");

    imageGallery.innerHTML= imgCardMarkup;
    generateAiImages(userPrompt,userImgQuantity);

}

generateForm.addEventListener("submit",handleFormSubmission);
