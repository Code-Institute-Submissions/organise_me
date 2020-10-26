//CLIENTS PAGE

//1. addNewClient Function: This function should be called whenever the user clicks the SAVE NEW CLIENT button on the new clients form
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


//2. adding clients to HTML page
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


//DASHBOARD


//1. addNewClientToDay Function: This function should be called whenever the user clicks the SAVE NEW CLIENT button on the new clients to day form
function addClientToDay(current_day, new_client_to_day) {
     //checking to see if a client exists already or not
    let client_exists = 0;

    let clientsPerDay =  JSON.parse(window.localStorage.getItem(current_day)) || []
            
    clientsPerDay.forEach(function(client) {
        if  (new_client_to_day.name ===  client.name) {
            client_exists += 1
            // break
        } 
    });

    //if a client does already exist, an error message should pop up saying that the client already exists and cannot be added
    //user will need to add a different client

    if (client_exists == 0) {
        clientsPerDay.push(new_client_to_day);
        localStorage.setItem(current_day, JSON.stringify(clientsPerDay));
        location.reload()
    } else {
        console.log(new_client_to_day.name + " already exists, please choose a different client name")
    }

}


//2. addClientEventListener Function: Creating an event listener for the new client to day form submit button
//   This will take inputs from the form and check them in the addClientToDay function to make sure the client doesn't already exist
//   If the client doesn't exist in that day, then it will add it to the data, otherwise not.
function addClientEventListener() {
    let form = document.getElementById('new-client-to-day');
           

    form.addEventListener('submit', (event) => {
        event.preventDefault()
        let data = new FormData(form)
        let day_lookup = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        let current_day = day_lookup[new Date().getDay()]
        let clients = JSON.parse(localStorage.getItem("Clients")) || [];
  
        let client = clients.filter(client => client.name === data.get('name'))
        if (client.length === 0) {
          console.log('client not found')
          return
        } 
  
        let new_client_to_day = { "name": data.get('name'),
                                  "group": client[0].group,
                                  "seconds": 0 
                                }
      
        addClientToDay(current_day, new_client_to_day)         
  
        form.reset()
    })}
  