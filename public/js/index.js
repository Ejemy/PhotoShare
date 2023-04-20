//I need to still have it say the correct date for onloaded photos and if the dates are the same not create another date div.

const loadImages = () => {
    fetch('/firstload')
    .then(response => response.json())
    .then(data => {
      console.log(data)
      const photos = document.getElementById("photoContainer")
      data.forEach(image => {
        const img = document.createElement('img')
        img.src = "https://drive.google.com/uc?export=view&id=" + image.id
        img.id = "newphoto"
        img.addEventListener('load', () => {
         //CREATE CORRECT DATES FOR TIME CREATED FOR FIRSTLOAD IMAGES
          const link = document.createElement('link')
          link.href = '/main.css'
          link.rel = 'stylesheet'
          link.type = "text/css"
          document.head.appendChild(link)
        });
        photos.appendChild(img)
      });
    })
    .catch(error => console.error(error));
    };
const topNav = document.getElementById("top")
topNav.onclick = async(e)=>{
  e.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
};

const form = document.getElementById("form");
const loadingIcon = document.getElementById("loading");
form.onsubmit = async (event) => {
    event.preventDefault()
    loadingIcon.style.display = "block";
    const formData = new FormData(form);
      loadingIcon.style.display = "block"
      fetch("/upload", {
        method: "POST",
        body: formData
      })
      .then(response => {
        if(!response.ok){
          throw new Error ("Bad network connection (onsubmit)")
        }
        return response.json()
      })
      .then(data =>{
        console.log(data)
        loadingIcon.style.display = "none";

        const photos = document.getElementById("photoContainer")
        if(data.status){
          const today = new Date()
          const month = today.getUTCMonth() + 1;
          const day = today.getUTCDate()
          const year = today.getUTCFullYear()
          let d = document.createElement("div")
        
          d.innerHTML = month + "/" + day + "/" + year
          document.body.appendChild(d)
          for(var i = 0; i< data.link.length; i++){
            let photo = document.createElement("img")
            photo.id = "newphoto"
            photo.src = "https://drive.google.com/uc?export=view&id=" + data.link[i]
            photos.appendChild(photo)
          }
          
        }
      })
      .catch(error=>{
        console.log(error)
      })
    }
window.addEventListener('load', loadImages);
    