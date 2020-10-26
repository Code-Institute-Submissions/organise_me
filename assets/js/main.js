
//addNewClient Function: This function should be called whenever the user clicks the SAVE NEW CLIENT button on the new clients form
function addNewClient(new_client) {
    //checking to see if a client exists already or not
    let client_exists = 0;

    let clients = JSON.parse(localStorage.getItem("Clients")) || [];
            
    clients.forEach(function(client) {
        if  (new_client.name ==  client.name) {
            client_exists += 1
            // break
        } 
    });

    //if a client does already exist, an error message should pop up saying that the client already exists and cannot be added
    //user will need to add a different client

    if (client_exists == 0) {
        clients.push(new_client);
        localStorage.setItem("Clients",JSON.stringify(clients));
        location.reload()
    } else {
        console.log(new_client.name + " already exists, please choose a different client name")
    }

}      



//adding clients
function insertClientListAsHTML(parentElement) {
    let clients = JSON.parse(localStorage.getItem("Clients")) || [];

    if (clients.length === 0) {
        return
    }
    parentElement.innerHTML = ""

    let groups = _.groupBy(clients, 'group')
    Object.keys(groups).forEach(group => {

        let element = document.createElement('template')
        let html = `<div class="container">
                        <div class="row justify-content-center">
                            <div class="col">
                                <h2>${group}</h2>`

        Array.from(groups[group]).forEach(client => {

            html += `<div class="d-flex flex-row justify-content-between" style="background : ${client.colour}">
                    <div class="p-2"><h4>${client.name}</h4> 
                    €${client.ratingph} p/h</div>
                    </div>`
                })
            html += `</div></div></div>`
        
        element.innerHTML = html.trim()
        element = element.content.firstChild
        parentElement.appendChild(element)
    })
}


