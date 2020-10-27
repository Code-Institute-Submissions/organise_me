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



//2. addNewClientEventListener Function: Creating an event listener for the new client form submit button
//   This will take inputs from the form and check them in the addNewClient function to make sure the client doesn't already exist
//   If the client doesn't exist in local Storage, then it will add it to the data, otherwise not.
 
function addNewClientEventListener() {

    let form = document.getElementById('new-client');
            
    //creating event listener for submitting the new client form (new-client)
    form.addEventListener('submit', (event) => {
        event.preventDefault()
        let data = new FormData(form)
        let new_client = {  "name": data.get('name'),
                            "ratingph": data.get('ratingph'),
                            "colour": data.get('colour'),
                            "group": data.get('group')
                        }
    
        addNewClient(new_client)         

        console.log("The submit button has been clicked!")
        form.reset()
        
    })
}


//3. adding clients to HTML page
function insertClientListAsHTML(parentElement) {
    let clients = JSON.parse(localStorage.getItem("Clients")) || [];

    if (clients.length === 0) {
        return
    }
    parentElement.innerHTML = ""

    let groups = _.groupBy(clients, 'group')
    Object.keys(groups).forEach(group => {

        let element = document.createElement('template')
        let html = `<div class="container-fluid col-6">
                         <div class="row">
                            <div class="col">
                                <h2>${group}</h2>`

        Array.from(groups[group]).forEach(client => {

            html += `<div class="col-xs-6" style="background : ${client.colour}">
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


//HOME PAGE (INDEX)


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
  

//3. adding clients from localstorage to Index.HTML page by day

// function to display the second recorded as time in HH:MM:SS format
function displaySecondsAsTime(seconds) {
    //https://stackoverflow.com/questions/1322732/convert-seconds-to-hh-mm-ss-with-javascript
    return new Date(seconds * 1000).toISOString().substr(11, 8)
}

function insertClientToDayAsHTML() {
    let day_lookup = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    day_lookup.forEach(day => {
        console.log(day)

        let clients_per_day = JSON.parse(localStorage.getItem(day)) || [];

        let groups = _.groupBy(clients_per_day, 'group')
        Object.keys(groups).forEach(group => {
            let group_element = document.createElement('div')
            
            Array.from(groups[group]).forEach(client => {
                let client_element = document.createElement('div')
                client_element.className = 'client'
                client_element.onclick = function(){
// TO UPDATE: starting the timer for the client that is clicked will happen in here                    
                    alert(client.name)

                    }
                    client_element.innerHTML = `${client.name} ${displaySecondsAsTime(client.seconds)}`
                    group_element.appendChild(client_element)
            
            })
            document.getElementById(day).appendChild(group_element)
        })
        })
}


