
//addNewClient Function: This function should be called whenever the user clicks the SAVE NEW CLIENT button on the new clients form
function addNewClient(new_client) {
    //checking to see if a client exists already or not
    let client_exists = 0;

    let clients = JSON.parse(localStorage.getItem("Clients")) || [];
            
    clients.forEach(function(client){
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
    } else {
        console.log(new_client.name + " already exists, please choose a different client name")
    }

}      


