import React, { useState, useEffect, useCallback } from 'react';
import './CreateTrip.css';
import { useTelegram } from "../../hooks/useTelegram";

const airportCodes = [
    "JFK - New York, USA 🇺🇸",
    "DXB - Dubai, UAE 🇦🇪",
    "LAX - Los Angeles, USA 🇺🇸",
    "LHR - London, UK 🇬🇧",
    "CDG - Paris, France 🇫🇷",
    "AMS - Amsterdam, Netherlands 🇳🇱",
    "FRA - Frankfurt, Germany 🇩🇪",
    "HND - Tokyo, Japan 🇯🇵",
    "SYD - Sydney, Australia 🇦🇺",
    "ORD - Chicago, USA 🇺🇸"
];

const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

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

        addLog(`Data to be sent: ${JSON.stringify(data)}`);

        fetch('/newTrip', {
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
                addLog(`Success: ${JSON.stringify(result)}`);
                tg.sendData(JSON.stringify(data));
                alert('Data saved successfully');
            })
            .catch((error) => {
                addLog(`Error: ${error.message}`);
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
                            {airportCodes.map((code) => {
                                const airportCode = code.substring(0, 3); // Extract the first three characters
                                return (
                                    <option key={airportCode} value={airportCode}>{code}</option>
                                );
                            })}
                        </select>
                        <select value={arrival} onChange={(e) => setArrival(e.target.value)} className="dropdown">
                            <option value="" disabled>To</option>
                            {airportCodes.map((code) => {
                                const airportCode = code.substring(0, 3); // Extract the first three characters
                                return (
                                    <option key={airportCode} value={airportCode}>{code}</option>
                                );
                            })}
                        </select>
                    </div>
                    <div className="date-container">
                        <h2>Date</h2>
                        <label htmlFor="date">Date:</label>
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
            <div className="logs">
                <h2>Logs</h2>
                <pre>{logs.join('\n')}</pre>
            </div>
        </div>
    );
}

export default CreateTrip;