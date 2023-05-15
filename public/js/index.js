const createImageContainer = (image, containerid, dateBar) => {
  const photos = document.getElementById("photoContainer" + containerid);
  photos.className = "container";
  const imgBox = document.createElement("div");
  imgBox.className = "newphoto";
  photos.insertBefore(imgBox, photos.children[0]);
  const img = document.createElement("img");
  img.src = "https://drive.google.com/uc?export=view&id=" + image.id;
  img.addEventListener("load", () => {
    const link = document.createElement("link");
    link.href = "/main.css";
    link.rel = "stylesheet";
    link.type = "text/css";
    document.head.appendChild(link);
  });
  imgBox.appendChild(img);
  if (image.takenTime) {
    const popupid = document.createElement("div");
    popupid.className = "photo-overlay";
    popupid.setAttribute("data-id", "This was taken on " + image.takenTime);
    imgBox.appendChild(popupid);
  }
};

const loadImages = () => {
  fetch("/firstload")
    .then((response) => response.json())
    .then((data) => {
      let containerid = 0;
      let dateBar = null;
      
      data.forEach((image, index) => {
        const created = image.createdTime;
        const date = new Date(created);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        if (index != 0) {
          const previousDate = new Date(data[index - 1].createdTime);
          const day2 = previousDate.getDate();
          const month2 = previousDate.getMonth() + 1;
          const year2 = previousDate.getFullYear();
          if (day != day2 || month != month2 || year != year2) {
            console.log("Add a photo container");
            const prevCont = document.getElementById("photoContainer" + (containerid));
            const prevDate = document.getElementById("dateBar" + (containerid));
            const main = document.getElementById("main-feed");
            const photoContainer = document.createElement("div");
            dateBar = document.createElement("div");
            
            main.insertBefore(photoContainer, prevDate);
            main.insertBefore(dateBar, photoContainer);
            
            dateBar.className = "dateBar";
            dateBar.innerHTML = month + "/" + day + "/" + year;
            containerid++;
            dateBar.id = "dateBar" + containerid;
            photoContainer.id = "photoContainer" + containerid;
          }
          createImageContainer(image, containerid, dateBar);
        } else {
          const main = document.getElementById("main-feed");
          const photoContainer = document.createElement("div");
          const dateBar = document.createElement("div");
          main.appendChild(dateBar);
          main.appendChild(photoContainer);
          dateBar.className = "dateBar";
          dateBar.id = "dateBar" + containerid;
          dateBar.innerHTML = month + "/" + day + "/" + year;
          photoContainer.id = "photoContainer" + containerid;
          createImageContainer(image, containerid, dateBar);
        }
      });
      
    })
    .catch((error) => console.error(error));
};



const form = document.getElementById("form");
const loadingIcon = document.getElementById("loading");

//function for uploading photos
const uploadPhoto = (thePhotos) => {
  console.log("uploadPhoto started...")
  

  
  const photos = document.getElementsByClassName("container");

  const today = new Date();
  const month = today.getUTCMonth() + 1;
  const day = today.getUTCDate();
  const year = today.getUTCFullYear();
  const d = document.createElement("div");
  const todayDate = month + "/" + day + "/" + year;
  d.innerHTML = todayDate;
  
  
  thePhotos.forEach((image) => {
    const newestId = document.getElementsByClassName("dateBar").length - 1
    const dateBar = document.getElementById("dateBar" + newestId)
    const prevContainer = document.getElementById("photoContainer" + (newestId - 1));
    if(dateBar.innerHTML == todayDate){
      console.log("todayDate in datebar...")
      return createImageContainer(image, newestId, dateBar);
    }
    const main = document.getElementById("main-feed");
    const photoContainer = document.createElement("div");
    const dateBarNew = document.createElement("div");
    
    main.insertBefore(dateBarNew, dateBar);
    dateBarNew.className = "dateBar";
    dateBarNew.id = "dateBar" + (newestId + 1);
    dateBarNew.innerHTML =todayDate;
    
    main.insertBefore(photoContainer, dateBar);
    photoContainer.id = "photoContainer" + (newestId + 1);
    return createImageContainer(image, newestId + 1, dateBarNew);
  });
};





//On uploading a new photo
form.onsubmit = async (event) => {
  event.preventDefault();
  let unique = Date.now();
  const formData = new FormData(form);
  
  loadingIcon.style.display = "block";
  document.body.classList.add("loading");
  fetch(`/upload?unique=${unique}`, {
    method: "POST",
    body: formData,
    headers: {
      "Cache-Control": "no-cache",
    },
  })
    .then((response) => {
      if (!response.ok) {
        const reserr = document.getElementById("error");
        reserr.innerHTML =
          "Bad network connection. Please refresh and try again.";
        reserr.style.display = "block";
        throw new Error("Bad network connection (onsubmit)");
      }
      console.log("Response OK");

      return response.json();
    })
    .then((data) => {
      console.log("data", data);
      loadingIcon.style.display = "none";
      document.body.classList.remove("loading");
      uploadPhoto(data);
      form.reset();
    })
    .catch((error) => {
      console.log(error);
    });
};

//NAV ITEMS
const topNav = document.getElementById("top");
topNav.onclick = async (e) => {
  e.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const deleteButton = document.getElementById("delete");
const img = document.getElementsByClassName("newphoto");
const main = document.getElementById("main-feed");

let truthy = true;


//DELETE
deleteButton.onclick = async(e) =>{
  let random = async()=> {
    return Math.round(Math.random() * 20);
  }
  truthy = !truthy;
  deleteButton.style.color = "blue";
  for(var i=0; i< img.length; i++){
    const imgi = img[i];
    if(imgi && truthy === false){
      const random = Math.round(Math.random()*200);
      imgi.style.animationDelay = random + "ms";
      imgi.classList.add("shakey-delete");   
    } else {
      deleteButton.style.color = "black";
      imgi.style.animationDelay = null;
      imgi.classList.remove("shakey-delete")
    }
  }
}
    let deleteArr = {"ids": []};
    main.onclick = async(event) =>{
      const target = event.target;
      if(target.tagName === "IMG" && target.parentNode.classList.contains("shakey-delete")){
        target.style.animationDelay = null;
        target.parentNode.classList.remove("shakey-delete");
        target.parentNode.classList.add("delete-highlight");
        deleteArr.ids.push(target.currentSrc);
        
        const noButton = document.getElementById("no");
        const yesButton = document.getElementById("yes");
        noButton.style.display = "block";
        yesButton.style.display = "block";
        noButton.onclick = () =>{
          
          for(var i = 0; i < img.length; i++){
           
            img[i].classList.remove("shakey-delete")
            img[i].classList.remove("delete-highlight")
            
          }
          noButton.style.display = "none";
          yesButton.style.display = "none";
          deleteArr = {"ids": []};
          deleteButton.style.color = "black";
          truthy = true;
          
        }
        //DELETE ITEMS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!111
        const deletePhoto = (dataId) => {
          const arr = JSON.stringify(dataId);
          fetch("/delete", {
            method: "POST",
            headers : { 
              'Content-Type': 'application/json'
            },
            body: arr
          })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Bad network connection (on Delete)");
            }
            return response.json();
          })
          .then((data) => {
            console.log(data)
          })
          .catch((error) => {
            console.log("error", error)
          });
        }
        yesButton.onclick = async(event) => {
          
          await deletePhoto(deleteArr);
          
          for(var i = 0; i < img.length; i++){
            img[i].classList.remove("delete-highlight")
            img[i].classList.remove("shakey-delete")
          }
          noButton.style.display = "none";
          yesButton.style.display = "none";
          deleteButton.style.color = "black";
          
          truthy = true;
          deleteArr = {"ids": []};
          window.location.reload();
        }

      } else if(target.tagName === "IMG" && target.parentNode.classList.contains("delete-highlight")){
        target.parentNode.classList.remove("delete-highlight");
        target.parentNode.classList.add("shakey-delete");
        console.log(target.src)
        deleteArr.ids = deleteArr.ids.filter((photo) => { 
          return photo !== target.src;
        })
        console.log(deleteArr)
      } else {
        if(target.tagName === "IMG"){
          if(!target.parentNode.classList.contains("expand")){
            const main = document.getElementById("main-feed");
            const expandedImage = document.createElement('div');
            const clonedImage = target.cloneNode();
            expandedImage.classList.add('expand');
            clonedImage.style.width = '100%';
            clonedImage.style.height = '100%';
            expandedImage.appendChild(clonedImage);
            main.appendChild(expandedImage);
            document.body.style.overflow = "hidden";
          } else{
            target.parentNode.remove();
            document.body.style.overflow = "auto";
          }
        }
          
      } 
      
      
    }





window.addEventListener("load", loadImages);
