import React, { useEffect, useState } from 'react';
import './App.css'; // External CSS for styling
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { Carousel } from 'react-bootstrap'; // Import Bootstrap Carousel

const App = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [ActiveCatagories, setActiveCatagories] = useState('All');
  const [Catagories, setCatagories] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [popupImages, setPopupImages] = useState([]);
  const fetchEvents = async (catagory) => {
    try {
      setLoading(true)
      let apiUrl = 'https://light-kindness-b960c080bb.strapiapp.com/api/events?populate=*'
      if(catagory){
        setActiveCatagories(catagory.Name)
        apiUrl = apiUrl + `&filters[Catagory][$eq]=${catagory.id}`
      }
      const response = await axios.get(apiUrl);
      setEvents(response.data.data);
      setLoading(false)
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };
  const fetchCatagories = async () => {
    try {
      const response = await axios.get('https://light-kindness-b960c080bb.strapiapp.com/api/events-catagories');
      setCatagories(response.data.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };
  // Fetch events from Strapi
  useEffect(() => {
   
    fetchCatagories()
    fetchEvents();
  }, []);

  // Handle popup open
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setPopupImages(event.Images); // Fallback if multiple images are not available
  };

  // Handle popup close
  const closePopup = () => {
    console.log('k')
    setSelectedEvent(null);
    setPopupImages([]);
  };

  return (
    <div className="events-page">
      <header className="header">
        <img src="logo-placeholder.png" alt="Logo" className="logo" />
        <nav className="nav">
          <a href="#">The School</a>
          <a href="#">Academics</a>
          <a href="#">Life @ DBTR</a>
          <a href="#">Contact Us</a>
          <a href="#" className="cta">CSR</a>
          <a href="#" className="cta">Donate</a>
        </nav>
      </header>

      <div className="hero">
        <h1>Our Events Gallery</h1>
        <p>Events at DBTR are filled with joyous occasions, cultural gatherings, and learning opportunities that bring us all together.</p>
      </div>
      <div className="filter-buttons">
      <button className={ActiveCatagories === "All" ? "active" : ''} onClick={()=>{
        fetchEvents()
        setActiveCatagories('All')
      }}>All</button>
      { Catagories.map((cat, index)=>{
      return(
        <button key={index} className={ActiveCatagories === cat.Name ? "active" : ''} onClick={()=>fetchEvents(cat)}>{cat.Name}</button>
      )
    })}

  </div>
      <div className="events-container">
        {loading ? <h1>Loading...</h1> : events.length ? events.map((event) => (
          <div key={event.id} className="event-card" onClick={() => handleEventClick(event)}>
            <img src={event.Images[0].url} className="event-image" />
            <div className="event-content">
              <h3>{event.Name}</h3>
              <p>{event.Posted_date}</p>
            </div>
          </div>
        )) : <h1>No Event Found</h1>}
      </div>

      {selectedEvent && (
        <div className="popup">
          <div className="popup-content">
            <button className="close-btn" onClick={closePopup}>X</button>
            <Carousel>
              {popupImages.map((img, index) => (
                <Carousel.Item key={index}>
                  <img className="d-block w-100 popup-image" src={img.url} alt={`Slide ${index + 1}`} />
                  <Carousel.Caption>
                  </Carousel.Caption>
                </Carousel.Item>
              ))}
            </Carousel>
          </div>
        </div>
      )}

      <footer className="footer">
        <p>&copy; 2023 DBTR. All rights reserved.</p>
        <p>Quick Links: <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a></p>
      </footer>
    </div>
  );
};

export default App;
