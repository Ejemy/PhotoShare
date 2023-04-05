const form = document.getElementById("form");
const errorMes = document.getElementById("error.message");


form.onsubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    let ob = {};
    for (const [key,value] of formData.entries()) {
        ob[key] = value;
    };
    fetch("/login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ob)
        
    })
    .then(response => {
        if(!response.ok){
            throw new Error("Bad network response")
        }
        return response.json();
    })
    .then(data => {
        if(!data.value){
            errorMes.style.visibility = "visible";
            errorMes.innerHTML(data.error);
        }
        window.location = "/main";
    })
    .catch(error =>{
        console.log(error);
    })
}
