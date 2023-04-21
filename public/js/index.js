//I need to still have it say the correct date for onloaded photos and if the dates are the same not create another date div.

//Load up pre-uploaded images on a page loadup.
const loadImages = () => {
  fetch("/firstload")
    .then((response) => response.json())
    .then((data) => {
      const photos = document.getElementById("photoContainer");

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
  const formData = new FormData(form);
  loadingIcon.style.display = "block";
  fetch("/upload", {
    method: "POST",
    body: formData,
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


      //CHANGE THIS FUNCTION TO BE SIMILAR TO THE /firstload FUNCTION

      const photos = document.getElementById("photoContainer");

      const today = new Date();
      const month = today.getUTCMonth() + 1;
      const day = today.getUTCDate();
      const year = today.getUTCFullYear();
      const d = document.createElement("div");

      d.innerHTML = month + "/" + day + "/" + year;
      document.body.appendChild(d);
      data.id.forEach((linky) => {
        console.log(linky);
        const photo = document.createElement("img");
        photo.id = "newphoto";
        photo.src = "https://drive.google.com/uc?export=view&id=" + linky;
        photos.appendChild(photo);
      });
      /*for(var i = 0; i< data.link.length; i++){
            let photo = document.createElement("img")
            photo.id = "newphoto"
            photo.src = "https://drive.google.com/uc?export=view&id=" + data.link[i]
            photos.appendChild(photo)
          }
          */
    })
    .catch((error) => {
      console.log(error);
    });
};
window.addEventListener("load", loadImages);
