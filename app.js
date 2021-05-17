// Selectors
const textareaContainer = document.querySelector("#textarea-container");
const galleryContainer = document.querySelector("#gallery-container");
const topTextInput = document.getElementById('top-text');
const bottomTextInput = document.getElementById('bottom-text');
const toggleSwitch = document.querySelector('input[type="checkbox"]');
let imageInput = document.getElementById('image-input');
let generateBtn = document.getElementById('generate-btn');
let downloadBtn = document.getElementById('download');
let addBtn = document.getElementById('add');
let canvas = document.getElementById('meme-canvas');
let urlImageBtn = document.getElementById("urlImageBtn")
let ctx = canvas.getContext('2d');


const memes = JSON.parse(localStorage.getItem("memes")) || [];

// Functions
function init() {
    darkMode();
    introMeme();
    loadGallery(memes);
    canvas.width = canvas.heigth = 0;
}

function eventListners() {
    textareaContainer.addEventListener('input', function(e) {
        let clickedTextareas = e.target.parentNode.children;
        autoResize(clickedTextareas);
    }, false);

    generateBtn.addEventListener('click', function(e) {
        console.log(e);
        readTheFile(imageInput.files[0]);
        imageInput.value = "";
    });
    
    urlImageBtn.addEventListener('click', function(e) {
        let imageInput = document.getElementById("url-input");
        let image = new Image;
        image.src = imageInput.value;

        proxyForUrl(image); 
       
        image.onload = function() {
            generateMeme(image, topTextInput.value, bottomTextInput.value);
        };
        imageInput.value = "";
    });
    
    addBtn.addEventListener('click', function(e){
        e.preventDefault();
        save(canvas);
        try {
            addImageToGallery(memes[memes.length-1]);
        }
           
        catch(e) {
            alert("LocalStorage is full. Please delete a meme to the Gallery.");
        };
         
    });

    galleryContainer.addEventListener('click', function(e) {
        let clickedGalleryItem = e.target;
        let srcStr = clickedGalleryItem.src;

        if(memes.includes(srcStr) ) {
            const indexRetrieved = removeByIndex(memes, srcStr);
            localStorage.setItem("memes", JSON.stringify(memes));
            clickedGalleryItem.parentNode.parentNode.remove();
        }   
    });
}

function darkMode() {
    if (localStorage.getItem('darkModeEnabled')) {
        document.body.className = 'dark';
        toggleSwitch.checked = true;
      }
      
      // When we click the switch, update local storage & change the className on the body
      toggleSwitch.addEventListener('click', function (e) {
        const { checked } = toggleSwitch;
        if (checked) {
          localStorage.setItem('darkModeEnabled', true);
        } else {
          localStorage.removeItem('darkModeEnabled');
        }
        document.body.className = checked ? 'dark' : ''
      
      })
}

function introMeme() {
    let placeholderImg = new Image();
    placeholderImg.src = "assets/blackWidow.jpg";
    placeholderImg.onload = function() {
    generateMeme(placeholderImg, topTextInput.value, bottomTextInput.value);
    };
}
   
function generateMeme(img, topText, bottomText) {
    canvas.width = img.width;
    canvas.height = img.height;

    ctx.clearRect(0,0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    let fontSize = canvas.width / 15;
    ctx.font = fontSize + "px Impact";
    ctx.fillStyle = 'white';
    ctx.strokeStyle ='black';
    ctx.lineWidth = fontSize / 15;
    ctx.textAlign ='center';
    
    ctx.fillText(topText, canvas.width / 2, fontSize, canvas.width);
    ctx.strokeText(topText, canvas.width / 2, fontSize, canvas.width)
   
    ctx.fillText(bottomText, canvas.width / 2, canvas.height - fontSize, canvas.width);
    ctx.strokeText(bottomText, canvas.width / 2, canvas.height - fontSize, canvas.width);

    topTextInput.value = "";
    bottomTextInput.value = "";
}

function autoResize(targetArr) {   
    const textAreaScrollHeight = targetArr[0].scrollHeight;
    
    for (let item of targetArr){
        item.style.height = 'auto';
        item.style.height = toString(textAreaScrollHeight) + 'px';
    }
}

function readTheFile(file) {
    const reader = new FileReader();
    reader.onload = function() {
        let image = new Image;
        image.src = reader.result;
        image.onload = function() {
            generateMeme(image, topTextInput.value, bottomTextInput.value);          
        };
    }
    reader.readAsDataURL(imageInput.files[0]);
  }

function save(canvas) {
    const data = canvas.toDataURL('image/jpg');
    memes.push(data); 
    try {
        localStorage.setItem("memes", JSON.stringify(memes));
    }
    catch {
        alert("LocalStorage is full. Please delete a meme to the Gallery.");
    };
}
    
function proxyForUrl(image) {
    let proxyUrl = 'https://cors-proxy.htmldriven.com/?url=';
    let targetUrl = image.src;
    let concatUrl = proxyUrl + targetUrl;
    image.crossOrigin = "anonymous";
    image.src = concatUrl;
}

function addImageToGallery(image) {
    const newDiv = document.createElement("div");
    newDiv.classList.add("cell");
    const imgDiv = document.createElement("div");
    imgDiv.classList.add("child", "image", "fill");
    const imgEl = document.createElement("img");
    imgEl.classList.add("responsive-image", "fill");
    imgEl.setAttribute("crossorigin", "anonymous");
    imgEl.setAttribute("src", image);
    imgEl.style.minHeight = 400 + "px";
    imgEl.style.maxWidth = 400 + "px";
    imgEl.setAttribute("src", image);
    const btnDiv = document.createElement("div");
    btnDiv.classList.add("child", "overlay");
    const newBtn = document.createElement("button");
    newBtn.classList.add("myButton1", "child", "overlay");
    newBtn.setAttribute("type", "button");
    newBtn.classList.add("fill");
    newBtn.innerText = "DELETE";
    
    newDiv.appendChild(imgDiv);
    imgDiv.appendChild(imgEl);
    newDiv.appendChild(btnDiv);
    btnDiv.appendChild(newBtn);
    galleryContainer.appendChild(newDiv);
}

function loadGallery() {
     if (memes.length > 0) {
         for (let meme of memes) {
            addImageToGallery(meme);
         }
     }
}

function memesReset(arr) {
    for (let meme in arr) {
        arr.pop();
        console.log("meme: ", meme);
    }
}

//todo
function resetCanvas() {

}

function removeImageGallery(images) {
    memes = [];
    localStorage.setItem("memes", JSON.stringify(memes));
}

function removeByIndex(arr,str) {
	const index = arr.indexOf(str);
	if (index > -1) {arr.splice(index, 1)} return (arr);
}

  download_img = function(el) {
      console.log(el);
    var image = canvas.toDataURL("image/jpg");
    el.href = image;
  };
  

// Main

init();
eventListners();
