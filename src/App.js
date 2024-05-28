import React, { useState, useEffect } from 'react';
import './App.css';
import { useTelegram } from "./hooks/useTelegram";
import Header from "./components/Header/Header";

const airportCodes = ["JFK", "DXB", "LAX", "LHR", "CDG", "AMS", "FRA", "HND", "SYD", "ORD"];

function App() {
    const { onToggleButton, tg } = useTelegram();
    const [size, setSize] = useState('');
    const [weight, setWeight] = useState('');
    const [value, setValue] = useState('');
    const [departure, setDeparture] = useState('');
    const [arrival, setArrival] = useState('');

    useEffect(() => {
        tg.ready();
    }, [tg]);

    const handleSizeClick = (selectedSize) => {
        setSize(selectedSize);
    };

    const handleWeightClick = (selectedWeight) => {
        setWeight(selectedWeight);
    };

    const handleValueClick = (selectedValue) => {
        setValue(selectedValue);
    };

    const handleSubmit = () => {
        if (size && weight && value) {
            const data = { size, weight, value };
            fetch('/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
                .then((response) => response.json())
                .then((result) => {
                    console.log('Success:', result);
                    alert('Data saved successfully');
                })
                .catch((error) => {
                    console.error('Error:', error);
                    alert('Error saving data');
                });
        } else {
            alert('Please select all the options.');
        }
    };

    return (
        <div className="App">
            <Header />
            <div className="container">
                <div className="section">
                    <h2>Choose Size</h2>
                    <div className="grid-container">
                        <button
                            className={`option-button ${size === 'Pocket' ? 'selected' : ''}`}
                            onClick={() => handleSizeClick('Pocket')}
                        >
                            Pocket
                        </button>
                        <button
                            className={`option-button ${size === 'Handy' ? 'selected' : ''}`}
                            onClick={() => handleSizeClick('Handy')}
                        >
                            Handy
                        </button>
                        <button
                            className={`option-button ${size === 'Cabin' ? 'selected' : ''}`}
                            onClick={() => handleSizeClick('Cabin')}
                        >
                            Cabin
                        </button>
                        <button
                            className={`option-button ${size === 'Luggage' ? 'selected' : ''}`}
                            onClick={() => handleSizeClick('Luggage')}
                        >
                            Luggage
                        </button>
                    </div>
                </div>
                <div className="section">
                    <h2>Choose Weight</h2>
                    <div className="grid-container">
                        <button
                            className={`option-button ${weight === '1 KG' ? 'selected' : ''}`}
                            onClick={() => handleWeightClick('1 KG')}
                        >
                            less than 1 kg
                        </button>
                        <button
                            className={`option-button ${weight === '5 KG' ? 'selected' : ''}`}
                            onClick={() => handleWeightClick('5 KG')}
                        >
                            1-5 kg
                        </button>
                        <button
                            className={`option-button ${weight === '10 KG' ? 'selected' : ''}`}
                            onClick={() => handleWeightClick('10 KG')}
                        >
                            5+ kg
                        </button>
                        <button
                            className={`option-button ${weight === 'Heavy' ? 'selected' : ''}`}
                            onClick={() => handleWeightClick('Heavy')}
                        >
                            Heavy
                        </button>
                    </div>
                </div>
                <div className="section">
                    <h2>Choose Value</h2>
                    <div className="grid-container">
                        <button
                            className={`option-button ${value === '100' ? 'selected' : ''}`}
                            onClick={() => handleValueClick('100')}
                        >
                            less than $100
                        </button>
                        <button
                            className={`option-button ${value === '500' ? 'selected' : ''}`}
                            onClick={() => handleValueClick('500')}
                        >
                            $100-$500
                        </button>
                        <button
                            className={`option-button ${value === '1000' ? 'selected' : ''}`}
                            onClick={() => handleValueClick('1000')}
                        >
                            $500+
                        </button>
                        <button
                            className={`option-button ${value === '5000' ? 'selected' : ''}`}
                            onClick={() => handleValueClick('5000')}
                        >
                            $1000+
                        </button>
                    </div>
                </div>
                <div className="section">
                    <h2>Choose Departure and Arrival</h2>
                        <div className="dropdown-container">
                            <select value={departure} onChange={(e) => setDeparture(e.target.value)} className="dropdown">
                                <option value="" disabled>Select Departure</option>
                                {airportCodes.map((code) => (
                                    <option key={code} value={code}>{code}</option>
                                ))}
                            </select>
                            <select value={arrival} onChange={(e) => setArrival(e.target.value)} className="dropdown">
                                <option value="" disabled>Select Arrival</option>
                                {airportCodes.map((code) => (
                                    <option key={code} value={code}>{code}</option>
                                ))}
                            </select>
                        </div>
                </div>
                <button className={"action-button"} onClick={handleSubmit}>Submit</button>
                <button onClick={onToggleButton}>Toggle</button>
            </div>
        </div>
    );
}

export default App;
