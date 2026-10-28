
import { useState } from "react";
import "./App.css";

const API_URL = "http://localhost:8080";

function App() {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [trains, setTrains] = useState([]);
  const [message, setMessage] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  const [selectedTrain, setSelectedTrain] = useState(null);
  const [passengerName, setPassengerName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");

  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [confirmation, setConfirmation] = useState(null);

  const searchTrains = async (e) => {
    e.preventDefault();

    setSearchLoading(true);
    setMessage("");
    setTrains([]);
    setSelectedTrain(null);
    setConfirmation(null);
    setBookingError("");

    try {
      const url =
        `${API_URL}/api/trains/search?source=${encodeURIComponent(source.trim())}` +
        `&destination=${encodeURIComponent(destination.trim())}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Train search failed (${response.status}).`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Unexpected response from train search API.");
      }

      setTrains(data);
      setMessage(
        data.length
          ? `${data.length} train${data.length === 1 ? "" : "s"} found for your journey`
          : "No trains found for this route. Try different stations."
      );
    } catch (error) {
      setMessage(
        error.message === "Failed to fetch"
          ? "Cannot connect to the backend. Make sure Spring Boot is running."
          : error.message || "Unable to search trains."
      );
    } finally {
      setSearchLoading(false);
    }
  };

  const openBookingForm = (train) => {
    setSelectedTrain(train);
    setPassengerName("");
    setAge("");
    setGender("Male");
    setBookingError("");
    setConfirmation(null);
  };

  const bookTicket = async (e) => {
    e.preventDefault();

    if (!selectedTrain || bookingLoading) return;

    setBookingLoading(true);
    setBookingError("");

    const bookingData = {
      passengerName: passengerName.trim(),
      age: Number(age),
      gender,
      trainNumber: String(selectedTrain.trainNumber),
      trainName: selectedTrain.trainName,
      source: selectedTrain.source,
      destination: selectedTrain.destination,
    };

    try {
      const response = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const responseText = await response.text();
      let data = {};

      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            `Booking failed with status ${response.status}.`
        );
      }

      if (!data.pnr) {
        throw new Error(
          "Booking response did not contain a PNR. Check the backend response."
        );
      }

      setConfirmation(data);
      setSelectedTrain(null);
      setMessage("");
    } catch (error) {
      setBookingError(
        error.message === "Failed to fetch"
          ? "Cannot connect to the booking API. Check that Spring Boot is running."
          : error.message || "Unable to complete the booking."
      );
    } finally {
      setBookingLoading(false);
    }
  };

  const resetBooking = () => {
    setConfirmation(null);
    setSelectedTrain(null);
    setPassengerName("");
    setAge("");
    setGender("Male");
    setBookingError("");
  };

  return (
    <div className="app-shell">
      <header className="navbar">
        <a
          className="brand"
          href="#home"
          aria-label="RailBook home"
          onClick={() => {
            setConfirmation(null);
            setSelectedTrain(null);
          }}
        >
          <span className="brand-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="5" y="2.5" width="14" height="17" rx="4" />
              <path d="M8 6h8M8 10h8M8 19.5l-2 2M16 19.5l2 2M8 15h.01M16 15h.01" />
            </svg>
          </span>
          <span>
            <strong>RailBook</strong>
            <small>YOUR JOURNEY, SIMPLIFIED</small>
          </span>
        </a>

        <nav className="nav-right">
          <a href="#search">Find trains</a>
          <span className="secure-label">
            <span className="secure-dot" />
            Railway Reservation
          </span>
        </nav>
      </header>

      <main id="home">
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">
              <span className="eyebrow-line" />
              TRAVEL SMARTER
            </span>
            <h1>
              Every journey
              <br />
              begins <span>with a plan.</span>
            </h1>
            <p>
              Find your train, choose your route, and book your next journey
              with ease.
            </p>

            <div className="hero-benefits">
              <span>
                <span className="benefit-check">✓</span> Simple booking
              </span>
              <span>
                <span className="benefit-check">✓</span> PNR confirmation
              </span>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="visual-orbit orbit-one" />
            <div className="visual-orbit orbit-two" />
            <div className="visual-station station-one">
              <span />
            </div>
            <div className="visual-station station-two">
              <span />
            </div>
            <svg className="hero-train" viewBox="0 0 340 190">
              <path
                d="M47 133 L47 69 Q47 31 88 31 H245 Q280 31 290 66 L310 133 Z"
                fill="#ffffff"
              />
              <path
                d="M57 67 Q57 42 88 42 H122 V88 H57 Z"
                fill="#c8e1ff"
              />
              <path d="M133 42 H176 V88 H133 Z" fill="#c8e1ff" />
              <path d="M187 42 H230 Q252 42 265 66 L276 88 H187 Z" fill="#c8e1ff" />
              <path d="M47 103 H299 L310 133 H47 Z" fill="#1769d2" />
              <path d="M58 114 H293" stroke="#ffffff" strokeWidth="3" />
              <circle cx="91" cy="139" r="18" fill="#153d70" />
              <circle cx="91" cy="139" r="8" fill="#dbeafe" />
              <circle cx="258" cy="139" r="18" fill="#153d70" />
              <circle cx="258" cy="139" r="8" fill="#dbeafe" />
              <path d="M35 159 H316" stroke="#b5d3fa" strokeWidth="4" strokeLinecap="round" />
              <path d="M55 169 H296" stroke="#b5d3fa" strokeWidth="2" strokeLinecap="round" strokeDasharray="8 9" />
            </svg>
            <div className="route-chip">
              <span className="route-chip-icon">↗</span>
              <span>
                <strong>Your next adventure</strong>
                <small>Starts right here</small>
              </span>
            </div>
          </div>
        </section>

        <section className="booking-section" id="search">
          <div className="section-heading">
            <div>
              <span className="section-kicker">PLAN YOUR TRIP</span>
              <h2>Where would you like to go?</h2>
              <p>Enter your departure and destination stations to get started.</p>
            </div>
            <span className="step-indicator">
              <span>01</span> SEARCH TRAINS
            </span>
          </div>

          <form className="search-card" onSubmit={searchTrains}>
            <div className="station-field">
              <label htmlFor="source">FROM</label>
              <div className="field-control">
                <span className="field-icon departure-icon">↗</span>
                <input
                  id="source"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="Departure station"
                  autoComplete="off"
                  required
                />
              </div>
            </div>

            <div className="route-divider" aria-hidden="true">
              <span>→</span>
            </div>

            <div className="station-field">
              <label htmlFor="destination">TO</label>
              <div className="field-control">
                <span className="field-icon arrival-icon">⌖</span>
                <input
                  id="destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Destination station"
                  autoComplete="off"
                  required
                />
              </div>
            </div>

            <button
              className="primary-button search-button"
              type="submit"
              disabled={searchLoading}
            >
              {searchLoading ? (
                <>
                  <span className="spinner" /> Searching...
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="10.8" cy="10.8" r="6.8" />
                    <path d="m16 16 4.5 4.5" />
                  </svg>
                  Search trains
                </>
              )}
            </button>
          </form>
        </section>

        {message && (
          <div
            className={`notice ${message.includes("found for your journey") ? "notice-success" : ""}`}
            role="status"
          >
            <span className="notice-icon">
              {message.includes("found for your journey") ? "✓" : "i"}
            </span>
            {message}
          </div>
        )}

        {trains.length > 0 && (
          <section className="results-section">
            <div className="results-heading">
              <div>
                <span className="section-kicker">AVAILABLE OPTIONS</span>
                <h2>Choose your train</h2>
                <p>
                  {source} <span className="inline-arrow">→</span> {destination}
                </p>
              </div>
              <span className="results-count">
                {trains.length} {trains.length === 1 ? "train" : "trains"}
              </span>
            </div>

            <div className="train-list">
              {trains.map((train, index) => (
                <article className="train-card" key={train.trainNumber ?? index}>
                  <div className="train-symbol">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <rect x="5" y="2.5" width="14" height="17" rx="4" />
                      <path d="M8 6h8M8 10h8M8 19.5l-2 2M16 19.5l2 2M8 15h.01M16 15h.01" />
                    </svg>
                  </div>

                  <div className="train-info">
                    <h3>{train.trainName}</h3>
                    <span className="train-number">
                      TRAIN NO. {train.trainNumber}
                    </span>
                    <div className="train-route">
                      <span>{train.source}</span>
                      <span className="route-track">
                        <span />
                        <i>→</i>
                        <span />
                      </span>
                      <span>{train.destination}</span>
                    </div>
                  </div>

                  <div className="train-action">
                    <button
                      className="primary-button"
                      type="button"
                      onClick={() => openBookingForm(train)}
                    >
                      Book ticket <span aria-hidden="true">→</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {selectedTrain && (
          <section className="form-section" id="passenger-form">
            <div className="section-heading">
              <div>
                <span className="section-kicker">PASSENGER INFORMATION</span>
                <h2>Complete your booking</h2>
                <p>Enter the passenger details to book your ticket.</p>
              </div>
              <span className="step-indicator">
                <span>02</span> PASSENGER DETAILS
              </span>
            </div>

            <div className="selected-train-banner">
              <div className="selected-train-icon">🚆</div>
              <div>
                <strong>{selectedTrain.trainName}</strong>
                <span>Train No. {selectedTrain.trainNumber}</span>
              </div>
              <div className="selected-route">
                <span>{selectedTrain.source}</span>
                <span aria-hidden="true">→</span>
                <span>{selectedTrain.destination}</span>
              </div>
            </div>

            <form className="passenger-card" onSubmit={bookTicket}>
              <div className="form-title">
                <span className="form-title-icon">01</span>
                <div>
                  <h3>Passenger details</h3>
                  <p>All fields are required.</p>
                </div>
              </div>

              <div className="form-grid">
                <div className="input-group full-width">
                  <label htmlFor="passengerName">Full name</label>
                  <input
                    id="passengerName"
                    value={passengerName}
                    onChange={(e) => setPassengerName(e.target.value)}
                    placeholder="Enter passenger's full name"
                    maxLength={100}
                    autoComplete="name"
                    required
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="age">Age</label>
                  <input
                    id="age"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Age in years"
                    min="1"
                    max="120"
                    required
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="gender">Gender</label>
                  <select
                    id="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {bookingError && (
                <div className="booking-error" role="alert">
                  <span>!</span>
                  <p>{bookingError}</p>
                </div>
              )}

              <div className="form-actions">
                <button
                  className="secondary-button"
                  type="button"
                  disabled={bookingLoading}
                  onClick={() => {
                    setSelectedTrain(null);
                    setBookingError("");
                  }}
                >
                  Cancel
                </button>

                <button
                  className="primary-button confirm-button"
                  type="submit"
                  disabled={bookingLoading}
                >
                  {bookingLoading ? (
                    <>
                      <span className="spinner" /> Processing...
                    </>
                  ) : (
                    <>Confirm booking <span aria-hidden="true">→</span></>
                  )}
                </button>
              </div>

              <p className="form-footnote">
                Your booking details will be submitted to the railway
                reservation system.
              </p>
            </form>
          </section>
        )}

        {confirmation && (
          <section className="confirmation-section" aria-live="polite">
            <div className="success-header">
              <div className="success-icon">✓</div>
              <span className="section-kicker">BOOKING CONFIRMED</span>
              <h2>Your journey is booked!</h2>
              <p>Your booking has been saved successfully.</p>
            </div>

            <article className="ticket-card">
              <div className="ticket-top">
                <div className="ticket-brand">
                  <span className="ticket-brand-icon">🚆</span>
                  <span>
                    <strong>RailBook</strong>
                    <small>TRAVEL TICKET</small>
                  </span>
                </div>
                <span className="confirmed-label">
                  <span /> CONFIRMED
                </span>
              </div>

              <div className="ticket-pnr">
                <span>YOUR BOOKING REFERENCE / PNR</span>
                <strong>{confirmation.pnr}</strong>
              </div>

              <div className="ticket-route">
                <div>
                  <span className="ticket-label">FROM</span>
                  <h3>{confirmation.source}</h3>
                </div>
                <div className="ticket-route-line" aria-hidden="true">
                  <span>→</span>
                </div>
                <div className="ticket-destination">
                  <span className="ticket-label">TO</span>
                  <h3>{confirmation.destination}</h3>
                </div>
              </div>

              <div className="ticket-divider">
                <span />
                <span />
              </div>

              <div className="ticket-details">
                <div>
                  <span>PASSENGER</span>
                  <strong>{confirmation.passengerName}</strong>
                </div>
                <div>
                  <span>TRAIN NAME</span>
                  <strong>{confirmation.trainName}</strong>
                </div>
                <div>
                  <span>TRAIN NUMBER</span>
                  <strong>{confirmation.trainNumber}</strong>
                </div>
                <div>
                  <span>AGE / GENDER</span>
                  <strong>
                    {confirmation.age} / {confirmation.gender}
                  </strong>
                </div>
              </div>

              <div className="ticket-footer">
                <span>Keep your PNR for future reference.</span>
                <button
                  className="print-button"
                  type="button"
                  onClick={() => window.print()}
                >
                  Print ticket
                </button>
              </div>
            </article>

            <button
              className="primary-button another-booking"
              type="button"
              onClick={resetBooking}
            >
              + Book another ticket
            </button>
          </section>
        )}

        <footer className="footer">
          <div className="footer-brand">
            <span className="footer-brand-icon">🚆</span>
            <strong>RailBook</strong>
          </div>
          <p>A simpler way to plan your railway journeys.</p>
          <span className="footer-copy">Railway Reservation System</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
