//https://localhost:3000/newTrip?userId=5122519517
import React, { useState, useEffect, useCallback } from 'react';
import './CreateTrip.css';
import { useTelegram } from "../../hooks/useTelegram";
import {airportsByCountry, formatDate} from "../utilities"

function CreateTrip() {
    const { tg } = useTelegram();
    const [departure, setDeparture] = useState('');
    const [arrival, setArrival] = useState('');
    const [date, setDate] = useState(formatDate(new Date()));
    const [userId, setUserId] = useState('');
    const [logs, setLogs] = useState([]);

    const addLog = (log) => {
        setLogs(prevLogs => [...prevLogs, log]);
    };

    const onSendData = useCallback(() => {
        const data = {
            departure,
            arrival,
            date,
            transporter_uid: userId,
        };

        //addLog(`Data to be sent: ${JSON.stringify(data)}`);

        fetch('https://localhost:3000/newTrip', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((err) => {
                        throw new Error(`Server error: ${err.message}`);
                    });
                }
                return response.json();
            })
            .then((result) => {
                //addLog(`Success: ${JSON.stringify(result)}`);
                tg.sendData(JSON.stringify(data));
                alert('Data saved successfully');
            })
            .catch((error) => {
                //addLog(`Error: ${error.message}`);
                alert('Error saving data: ' + error.message);
            });
    }, [date, departure, arrival, userId, tg]);

    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData);
        return () => {
            tg.offEvent('mainButtonClicked', onSendData);
        };
    }, [tg, onSendData]);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const userIdFromUrl = urlParams.get('userId');

        addLog(`userId: ${userIdFromUrl}`);

        tg.MainButton.setParams({
            text: 'Submit trip',
        });
        setUserId(userIdFromUrl);
    }, [tg]);

    useEffect(() => {
        if (!date || !departure || !arrival) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
        }
    }, [date, departure, arrival, tg.MainButton]);

    const handleDateClick = (e) => {
        setDate(e.target.value);
    };

    const handleSubmit = () => {
        onSendData();
    };

    return (
        <div className="CreateTrip">
            <div className="container">
                <div className="section">
                    <h2>Departure and Arrival</h2>
                    <div className="dropdown-container">
                        <select value={departure} onChange={(e) => setDeparture(e.target.value)} className="dropdown">
                            <option value="" disabled>From</option>
                            {Object.keys(airportsByCountry).map((country) => (
                                <optgroup key={country} label={country}>
                                    {airportsByCountry[country].map((airport) => (
                                        <option key={airport.code} value={airport.code}>
                                            {airport.code} - {airport.name}
                                        </option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                        <select value={arrival} onChange={(e) => setArrival(e.target.value)} className="dropdown">
                            <option value="" disabled>To</option>
                            {Object.keys(airportsByCountry).map((country) => (
                                <optgroup key={country} label={country}>
                                    {airportsByCountry[country].map((airport) => (
                                        <option key={airport.code} value={airport.code}>
                                            {airport.code} - {airport.name}
                                        </option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                    </div>
                    <div className="date-container">
                        <h2>Date</h2>
                        {/*<label htmlFor="date">Date:</label>*/}
                        <input
                            type="date"
                            id="date"
                            value={date}
                            onChange={handleDateClick}
                            className="date-input"
                        />
                    </div>
                </div>
                <button className="action-button" onClick={handleSubmit}>Submit</button>
            </div>
            {<div className="logs">
                <h2>Logs</h2>
                <pre>{logs.join('\n')}</pre>
            </div>}
        </div>
    );
}

export default CreateTrip;