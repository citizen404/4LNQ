import React, { useState, useEffect, useCallback } from 'react';
import './CreateItem.css';
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

const fetchTonRate = async () => {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=the-open-network&vs_currencies=usd');
    const data = await response.json();
    return data['the-open-network'].usd;
};

const tonRate = await fetchTonRate();

const calculateEstimate = async (size, weight, value, urgency, departure, arrival) => {
    if (!size || !weight || !value || !urgency || !departure || !arrival) return "Please select all options";

    // Dummy estimate calculation logic, replace with actual logic
    const sizeFactor = size === 'Pocket' ? 1 : size === 'Handy' ? 1.2 : size === 'Cabin' ? 2 : 3;
    const weightFactor = weight === '1 KG' ? 1 : weight === '5 KG' ? 1.2 : weight === '10 KG' ? 2 : 3;
    const valueFactor = value === '100' ? 0.5 : value === '500' ? 1.2 : value === '1000' ? 1.7 : 2;
    const urgencyFactor = urgency === 'ASAP' ? 1.17 : urgency === '3 days' ? 1.15 : urgency === 'A week' ? 1.05 : 1;

    const baseCost = 0.5 * 30; // Base cost in USD - delete 0.5 !
    const estimate = baseCost * sizeFactor * weightFactor * valueFactor * urgencyFactor;

//    const tonRate = await fetchTonRate();
    const estimateTON = estimate / tonRate;

    return `$${estimate.toFixed(2)} (${estimateTON.toFixed(2)} TON)`;
};

function CreateItem() {
    const { tg } = useTelegram();
    const [size, setSize] = useState('');
    const [weight, setWeight] = useState('');
    const [value, setValue] = useState('');
    const [urgency, setUrgency] = useState('');
    const [departure, setDeparture] = useState('');
    const [arrival, setArrival] = useState('');
    const [estimate, setEstimate] = useState('');
    const [userId, setUserId] = useState('');
    let date = formatDate(new Date());
    const [logs, setLogs] = useState([]);

    const addLog = (log) => {
        setLogs(prevLogs => [...prevLogs, log]);
    };

    const onSendData = useCallback(() => {
        const data = {
            size,
            weight,
            value,
            urgency,
            departure,
            arrival,
            date,
            estimate,
            sender_uid: userId,
        };

        addLog(`Data to be sent: ${JSON.stringify(data)}`);

        fetch('/save', {
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
    }, [size, weight, value, departure, arrival, urgency, date, userId, estimate, tg]);

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
            text: 'Submit item',
        });
        setUserId(userIdFromUrl);
    }, [tg]);

    useEffect(() => {
        if (!size || !weight || !value || !urgency || !departure || !arrival) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
        }
        const updateEstimate = async () => {
            const estimate = await calculateEstimate(size, weight, value, urgency, departure, arrival);
            setEstimate(estimate);
        };
        updateEstimate();
        //setEstimate(calculateEstimate(size, weight, value, urgency, departure, arrival));
    }, [size, weight, value, urgency, departure, arrival, tg.MainButton]);

    const handleSizeClick = (selectedSize) => {
        setSize(selectedSize);
    };

    const handleWeightClick = (selectedWeight) => {
        setWeight(selectedWeight);
    };

    const handleValueClick = (selectedValue) => {
        setValue(selectedValue);
    };

    const handleUrgencyClick = (selectedUrgency) => {
        setUrgency(selectedUrgency);
    };

    const handleSubmit = () => {
        onSendData();
    };

    return (
        <div className="CreateItem">
            <div className="container">
                <div className="section">
                    <h2>Size</h2>
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
                    <h2>Weight</h2>
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
                    <h2>Value</h2>
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
                    <h2>Urgency</h2>
                    <div className="grid-container">
                        <button
                            className={`option-button ${urgency === 'ASAP' ? 'selected' : ''}`}
                            onClick={() => handleUrgencyClick('ASAP')}
                        >
                            ASAP
                        </button>
                        <button
                            className={`option-button ${urgency === '3 days' ? 'selected' : ''}`}
                            onClick={() => handleUrgencyClick('3 days')}
                        >
                            3 days
                        </button>
                        <button
                            className={`option-button ${urgency === 'A week' ? 'selected' : ''}`}
                            onClick={() => handleUrgencyClick('A week')}
                        >
                            A week
                        </button>
                        <button
                            className={`option-button ${urgency === 'More' ? 'selected' : ''}`}
                            onClick={() => handleUrgencyClick('More')}
                        >
                            More
                        </button>
                    </div>
                </div>
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
                </div>
                <div className="section">
                    <h2>Estimated Cost</h2>
                    <div className="estimate">
                        <h3>{estimate}</h3>
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

export default CreateItem;
