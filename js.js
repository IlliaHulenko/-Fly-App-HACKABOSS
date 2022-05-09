//Form in index.html
let flyForm = document.forms.fly;

//Function to clear inputs
const ClearInputValue = () => {
  flyForm.elements.from.value = "";
  flyForm.elements.to.value = "";
};

const toInput = flyForm.elements.to;
console.log(toInput.value);

//Date
let today = new Date();
let day = `${today.getDate().length < 2 ? day + "0" : ""}${
  today.getDate() + 1
}`;
let month = `${today.getMonth() < 10 ? "0" : ""}${today.getMonth() + 1}`;
let year = today.getFullYear();
let nextDate = `${year}-${month}-${day}`;

//Button in Form in index.html
let button = document.getElementById("form");
//console.log(button, "Hola");

//API

//Variables of API_KEY
const API_KEY = "SAGXKXaS5kdd59dO19FEoimfBXO9LCYv";
const API_SECRET = "xTlXYcBHmomUxq7b";

const getAccessToken = async () => {
  const res = await fetch(
    "https://test.api.amadeus.com/v1/security/oauth2/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: API_KEY,
        client_secret: API_SECRET,
      }),
    }
  );
  const body = await res.json();
  return body.access_token;
};

const getDataAirlines = async () => {
  let fromValue = flyForm.elements.from.value.toUpperCase();
  let toValue = flyForm.elements.to.value.toUpperCase(); 
  let token = await getAccessToken();
  let response = await fetch(
    `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${fromValue}&destinationLocationCode=${toValue}&departureDate=${nextDate}&adults=1&nonStop=false&max=3`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`, // notice the Bearer before your token
      },
    }
  );
  const data = await response.json();
  return data;
};

const documentClear = document.querySelector("#fly-remove");
const showDataAirlines = async () => {
  let documents = document.querySelectorAll(".fly-cart p");
  const airlinesData = await getDataAirlines();

  try {
    let getAllPrices = airlinesData.data.map((item) => item.price.total);
    console.log(getAllPrices);
    let minPrice = Math.min(...getAllPrices);
    
    const flytoShow = airlinesData.data.find(
      (item) => (item.price.total = minPrice)
    );
    console.log(flytoShow);

    //API data
    //Departure
    let departure = flytoShow.itineraries[0].segments[0].departure.iataCode;
    console.log(
      "departure : " + flytoShow.itineraries[0].segments[0].departure
    );
    let terminalDeparture =
      flytoShow.itineraries[0].segments[0].departure.terminal;
    console.log("terminalDeparture: " + terminalDeparture);
    let dateDeparture = flytoShow.itineraries[0].segments[0].departure.at;
    console.log("dateDeparture: " + dateDeparture);

    //Arrival
    let codeArrival = flytoShow.itineraries[0].segments[0].arrival.iataCode;
    console.log("arrival: " + codeArrival);

    let termianalArrival =
      flytoShow.itineraries[0].segments[0].arrival.terminal;
    console.log("termianalArrival: " + termianalArrival);

    let dateArrival = flytoShow.itineraries[0].segments[0].arrival.at;
    console.log("dateArrival: " + dateArrival);

    let priceTicket = document.createElement("p");
    let origin = document.createElement("p");
    let terminalOrigin = document.createElement("p");
    let flyDatelOrigin = document.createElement("p");
    let arrival = document.createElement("p");
    let iataCodeArrival = document.createElement("p");
    let arrivalTerm = document.createElement("p");
    let arrivalDate = document.createElement("p");

    let getElementToShow = document.querySelector(".fly-cart");

    getElementToShow.append(priceTicket);
    getElementToShow.append(origin);
    getElementToShow.append(terminalOrigin);
    getElementToShow.append(flyDatelOrigin);
    getElementToShow.append(arrival);
    getElementToShow.append(iataCodeArrival);
    getElementToShow.append(arrivalTerm);
    getElementToShow.append(arrivalDate);

    //Showing of departures data
    origin.textContent = `Origen de salida : ${departure}`;
    priceTicket.textContent = `Precio total : ${flytoShow.price.total}`;
    if (terminalOrigin === undefined) {
      terminalOrigin.textContent = `Terminal de salida no se conoce`;
    } else {
      terminalOrigin.textContent = `Terminal de salida : ${terminalDeparture}`;
    }
    flyDatelOrigin.textContent = `Día y hora de salida : ${dateDeparture}`;
    arrival.textContent = `-------------- INFORMACION DE LLEGADA --------------`;
    iataCodeArrival.textContent = `Origen de llegada : ${codeArrival}`;
    if (termianalArrival === undefined) {
      arrivalTerm.textContent = `Terminal de llegada no se conoce`;
    } else {
      arrivalTerm.textContent = `Terminal de llegada : ${termianalArrival}`;
    }
    arrivalDate.textContent = `Día y hora de llegada : ${dateArrival}`;
    
    //Showing of arrivels data    
  } catch (error) {
    alert(
      `${airlinesData?.errors[0].title}, Comprueba los datos que has introducido`
    );
  }
};

button.addEventListener("submit", (e) => {
  console.log("Estoy buscando...");
  e.preventDefault();
  showDataAirlines();
  ClearInputValue();
});

let input = document.querySelector("form #from");

input.addEventListener("focus", (e) => {
  let elements = document.querySelectorAll("p");

  for (let i = 0; i < elements.length; i++) {
    elements[i].remove();
  }
});
