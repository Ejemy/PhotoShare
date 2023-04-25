//DECIDE HOW I WANT TO DO DATES ON THE RIGHT SIDE OF THE SCREEN?? 
const loadImages = () => {
  
  fetch("/firstload")
    .then((response) =>  response.json())
    .then((data) => {
      console.log(typeof data)
      const photos = document.getElementById("photoContainer");
      console.log("firstload data", data)
      data.forEach((image) => {
        const imgBox = document.createElement("div");
        imgBox.className = "newphoto";
        photos.appendChild(imgBox);
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
          popupid.setAttribute(
            "data-id",
            "This was taken on " + image.takenTime
          );
          imgBox.appendChild(popupid);
        }
      });
    })
    .catch((error) => console.error(error));
};
const topNav = document.getElementById("top");
topNav.onclick = async (e) => {
  e.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const form = document.getElementById("form");
const loadingIcon = document.getElementById("loading");

//On uploading a new photo
form.onsubmit = async (event) => {
  event.preventDefault();
  let unique = Date.now();

  const formData = new FormData(form);
  loadingIcon.style.display = "block";

  fetch(`/upload?unique=${unique}`, {
    method: "POST",
    body: formData
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
      console.log("data", data)
      loadingIcon.style.display = "none";

      const photos = document.getElementById("photoContainer");

      

      const today = new Date();
      const month = today.getUTCMonth() + 1;
      const day = today.getUTCDate();
      const year = today.getUTCFullYear();
      const d = document.createElement("div");
      d.innerHTML = month + "/" + day + "/" + year;

      data.forEach((image) => {
        const imgBox = document.createElement("div");
        imgBox.className = "newphoto";
        photos.insertBefore(imgBox, photos.children[0]);
        const img = document.createElement("img");
        img.src = "https://drive.google.com/uc?export=view&id=" + image.link;
        imgBox.appendChild(img);
        if(image.link == data[0].link){
          imgBox.appendChild(d);
        };
        if (image.imageMediaMetadata.time) {
          const popupid = document.createElement("div");
          popupid.className = "photo-overlay";
          popupid.setAttribute(
            "data-id",
            "This was taken on " + image.imageMediaMetadata.time
          );
          imgBox.appendChild(popupid);
        }
      });
    })
    .catch((error) => {
      console.log(error);
    });
  form.reset();
  
};
window.addEventListener("load", loadImages);
