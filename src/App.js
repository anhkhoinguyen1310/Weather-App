
import {useEffect,useState} from 'react'
import { createApi } from 'unsplash-js'
import {Container, Nav, Navbar,  Button,NavDropdown} from 'react-bootstrap';
import React from 'react';
import './App.css';


const unsplash = createApi({
  accessKey: process.env.REACT_APP_UNSPLASH_KEY,
  //fetch: nodeFetch,
});
console.log({unsplash})


function NaviBar() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home">Weather</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#link">Link</Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

const Citties = [
  {
    lat: "-31.951492874835928",
    lon: "115.8466352159855",
    name: "Perth",
     
  },
  {
    lat: "10.815531705945357",
    lon: "106.67335277690101",
    name: "Ho Chi Minh",
  },
  {
    lat: "35.16465306839141",
    lon: "129.05116590381778",
    name: "Busan",
  },
  {
    lat: "48.864716",
    lon: "2.349014",
    name: "Paris",
  },
  {
    lat: "35.66874043344719",
    lon: "139.6969082235211",
    name: "Tokyo"
  },
  {
    lat: "61.91176852060433", 
    lon: "5.986028791933799",
    name: "Norway",
  },
  {
    lat: "47.37807366072915",
    lon:  "8.545320055922465",
    name: "Switzerland",
  },
]

function App() {

  const [weather, setWeather] = useState (null)
  const [backgroundImage, setBackgroundImage] = useState(null)
  //fetch api
  async function fetchWeather(lat, lon) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`);
    const data = await response.json()
    setWeather(data)
    getPicFromUnSplash(data.name)
    console.log({data})
  }
  const getPicFromUnSplash = async (city) => { 
  const go = await unsplash.search.getPhotos({
    query: city
  })
  console.log({go})
  setBackgroundImage(go.response.results[0].urls.full)
  console.log("This is go", setBackgroundImage); 
}

  useEffect( () => {
    console.log("getting geoLocation")
    navigator.geolocation.getCurrentPosition((pos)=> {
    const {latitude, longitude} = pos.coords
    fetchWeather(latitude,longitude);
  })
  },[])

  if(!weather) {
    return <div> Loading!</div>;
}
const capitalizeFirstLetter = (str) => {
   return str.split(' ').map(word => {
  const firstLetter = word.charAt(0).toUpperCase();
  const remainingLetters = word.slice(1);
   return (firstLetter + remainingLetters);
  }).join(' ');
}

return (
  <div className="App" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: '55% 85%'}}>
      
      <div className="navi-bar">
          <NaviBar />
      </div>
      
      {/* City Buttons */}
      <div className="city-buttons">
          {Citties.map((city) => {
              return <Button className="customButton" variant="outline-warning" onClick ={() => fetchWeather(city.lat, city.lon)}>{city.name}</Button>
          })}
      </div>
      
      {/* Weather Container */}
      <Container className="weather-container"> 
          <h1>☔ Weather App 🌦️</h1>
          <h3>{weather.name}</h3>
          <h3>{(weather.main.temp-273.15).toFixed(2)}°C/ {(((weather.main.temp-273.15) *9/5) + 32).toFixed(2)}°F</h3>
          <h3>{capitalizeFirstLetter(weather.weather[0].description)}</h3>
      </Container>
  </div>
);


}
export default App;
