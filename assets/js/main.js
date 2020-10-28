window.intervalId = null
window.activeTimer = null

//CLIENTS PAGE

//1. addNewClient Function: This function should be called whenever the user clicks the button to add a new client
function addNewClient(newClient) {
    //checking to see if a client exists already or not
    let clientExists = 0;

    let clients = JSON.parse(localStorage.getItem("Clients")) || [];
            
    clients.forEach(function(client) {
        if  (newClient.name.toLowerCase() ===  client.name.toLowerCase()) {
            clientExists += 1
        } 
    });

    //if a client does already exist, an error message should pop up saying that the client already exists and cannot be added
    //user will need to add a different client

    if (clientExists === 0) {
        clients.push(newClient);
        localStorage.setItem("Clients", JSON.stringify(clients));
        location.reload()
    } else {
        console.log(newClient.name + " already exists, please choose a different client name")
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
        let newClient = {  "name": data.get('name'),
                            "ratingph": data.get('ratingph'),
                            "colour": data.get('colour'),
                            "group": data.get('group').toLowerCase()
                        }
    
        addNewClient(newClient)         

        form.reset()
        
    })
}


//3. adding client Divs to HTML page
function insertClientListAsHTML(parentElement) {
    let clients = JSON.parse(localStorage.getItem("Clients")) || [];

    if (clients.length === 0) {
        return
    }
    parentElement.innerHTML = ""

    let groups = _.groupBy(clients, 'group')
    Object.keys(groups).forEach(group => {

        let element = document.createElement('template')
        let html = `<div class="container-fluid">
                        
                                <h2 class="text-capitalize">${group}</h2>
                                <div class="d-flex flex-row flex-wrap">
                                `
        Array.from(groups[group]).forEach(client => {

            html += `
                    <div class="client_card p-2 ml-2 col-sm-4 col-md-2 mb-2"  style="color : ${client.colour}">

                        <div class="client_name">${client.name}</div> 
                        <div class="client_rating">€${client.ratingph} p/h</div>
                    </div>
                    `
                })
            html += ` </div>
                    </div>
                `

        element.innerHTML = html.trim()
        element = element.content.firstChild
        parentElement.appendChild(element)
    })
}

//HOME PAGE (INDEX)

//1. addNewClientToDay Function: This function should be called whenever the user clicks the SAVE NEW CLIENT button on the new clients to day form
function addClientToDay(currentDay, newClientToDay) {
     //checking to see if a client exists already or not
    let clientExists = 0;

    let clientsPerDay =  JSON.parse(window.localStorage.getItem(currentDay)) || []
            
    clientsPerDay.forEach(function(client) {
        if  (newClientToDay.name ===  client.name) {
            clientExists += 1
        } 
    });

    //if a client does already exist, an error message should pop up saying that the client already exists and cannot be added
    //user will need to add a different client

    if (clientExists == 0) {
        clientsPerDay.push(newClientToDay);
        localStorage.setItem(currentDay, JSON.stringify(clientsPerDay));
        location.reload()
    } else {
        console.log(newClientToDay.name + " already exists, please choose a different client name")
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
        let dayLookup = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        let currentDay = dayLookup[new Date().getDay()]
        let clients = JSON.parse(localStorage.getItem("Clients")) || [];
  
        let client = clients.filter(client => client.name === data.get('name'))
        if (client.length === 0) {
          console.log('client not found')
          return
        } 
  
        let newClientToDay = {  "name": data.get('name'),
                                "group": client[0].group,
                                "seconds": 0 
                                }
      
        addClientToDay(currentDay, newClientToDay)         
  
        form.reset()
    })}
  

//3. insertClientToDayAsHTML Function: adding clients from localstorage to Index.HTML page by day

//3.1 displaySecondsAsTime Function: displays the second recorded as time in HH:MM:SS format
function displaySecondsAsTime(seconds) {
    //https://stackoverflow.com/questions/1322732/convert-seconds-to-hh-mm-ss-with-javascript
    return new Date(seconds * 1000).toISOString().substr(11, 8)
}

function insertClientToDayAsHTML() {

    let dayLookup = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    dayLookup.forEach(day => {
       
        let dayContainer = document.getElementById(day)
        let clientsPerDay = JSON.parse(localStorage.getItem(day)) || [];

        let groups = _.groupBy(clientsPerDay, 'group')

        
        if (clientsPerDay.length > 0) {
            dayContainer.innerHTML = `<div class= " day_card">${day}</div>`
        } else {
            dayContainer.style.display = "none"
        }

        Object.keys(groups).forEach(group => {
            let group_element = document.createElement('div')
            group_element.innerHTML = `<h4 class="group_card">${group}  </h4><hr>`
            
            Array.from(groups[group]).forEach(client => {
                let client_element = document.createElement('div')
                client_element.className = 'client'
                client_element.onclick = (target) => {
                    activateClientTimer(client_element, client, day)
                }
                client_element.innerHTML = `
                    <div class="client-time-card d-flex flex-column p-2 ">
                        <div class="client-name">${client.name}</div>
                        <div class="timer">${displaySecondsAsTime(client.seconds)}</div>
                    </div>
                `
                group_element.appendChild(client_element)
            
            })
            dayContainer.appendChild(group_element)
        })
    })
}

// 4.   activateClientTimer Function: This function will activate the timer when clicking on a client
//      this is only possible for the current day!
function activateClientTimer(clientElement, client, day) {
    
    let clientsPerDay = JSON.parse(localStorage.getItem(day)) || [];
    let c = clientsPerDay.filter(x => x.name === client.name)[0]
    let timerElement = clientElement.querySelector(".timer")

    if (day !== getCurrentDay()) {
        return
    }
    document.querySelectorAll(".active-timer").forEach(x => x.classList.remove("active-timer"))

    // Disable current timer
    if (window.intervalId) {
        clearInterval(window.intervalId)
    }
    
    if (window.activeTimer === clientElement) {
        window.activeTimer = null
        return
    }

    clientElement.classList.add("active-timer")
    window.activeTimer = clientElement
    window.intervalId = setInterval(() => {
        c.seconds++
        timerElement.innerHTML = displaySecondsAsTime(c.seconds)
        localStorage.setItem(day, JSON.stringify(clientsPerDay));
    }, 1000);
}

// 5. Get current day as string
function getCurrentDay() {
    let dayLookup = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return dayLookup[new Date().getDay()]
}

// 6. insertAvailableClientListAsHTML Function: Populates options list for clients that have not already been selected for today's date 
function insertAvailableClientListAsHTML(parentElement) {
    let clients = JSON.parse(localStorage.getItem("Clients")) || [];
    let clientsInDay = (JSON.parse(localStorage.getItem(getCurrentDay())) || []).map(x => x.name)
    let allClients = (clients.map(client => client.name)).filter(x => clientsInDay.indexOf(x) === -1)

    if (clients.length === 0) {
        return
    }

    parentElement.innerHTML = "<option selected disabled>Select a Client</option>"

    allClients.forEach(client => {
        parentElement.innerHTML += `<option value="${client}" >${client}</option>` 
    })
    
}


