//http://localhost:3000/?userId=5122519517, 5752400541 - insert in browser after run, test purposes only
import React, { useState, useEffect, useCallback } from 'react';
import {CheckOutlined, CloseOutlined} from '@ant-design/icons';
import { Switch, Row, Col } from 'antd';
import './CreateItem.css';
import { useTelegram } from "../../hooks/useTelegram";
import { airportsByCountry, formatDate} from "../utilities"

const fetchTonRate = async () => {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=the-open-network&vs_currencies=usd');
    const data = await response.json();
    return data['the-open-network'].usd;
};
const tonRate = await fetchTonRate();

const calculateEstimate = async (size, weight, value, urgency, departure, arrival, insurance, courier) => {
    if (!size || !weight || !value || !urgency || !departure || !arrival) return "Please select all options";

    // Dummy estimate calculation logic, replace with actual logic
    const sizeFactor = size === 'Pocket' ? 1 : size === 'Handy' ? 1.2 : size === 'Cabin' ? 2 : 3;
    const weightFactor = weight === '1 KG' ? 1 : weight === '5 KG' ? 1.2 : weight === '10 KG' ? 2 : 3;
    const valueFactor = value === '100' ? 0.5 : value === '500' ? 1.2 : value === '1000' ? 1.7 : 2;
    const urgencyFactor = urgency === 'ASAP' ? 1.3 : urgency === '3 days' ? 1.15 : urgency === 'A week' ? 1.05 : 1;
    const insuranceFactor = insurance === 1 ? 1.3 : 1;
    const courierFactor = courier === 1 ? 25 * sizeFactor * weightFactor * valueFactor : 1;

    const baseCost = 0.5 * 30; // Base cost in USD - delete 0.5 !
    const estimate = baseCost * sizeFactor * weightFactor * valueFactor * urgencyFactor * insuranceFactor + courierFactor;
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
    const [courier, setCourier] = useState(0);
    const [insurance, setInsurance] = useState(0);
    /*const [logs, setLogs] = useState([]);
    const addLog = (log) => {
        setLogs(prevLogs => [...prevLogs, log]);
    };*/

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

        //addLog(`Data to be sent: ${JSON.stringify(data)}`);

        //fetch(''+'/newItem' - then it sends requests to the same port
        fetch('https://localhost:3000/newItem', {
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

        //addLog(`userId: ${userIdFromUrl}`);

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
            const estimate = await calculateEstimate(size, weight, value, urgency, departure, arrival, insurance, courier);
            setEstimate(estimate);
        };
        updateEstimate();
        //setEstimate(calculateEstimate(size, weight, value, urgency, departure, arrival));
    }, [size, weight, value, urgency, departure, arrival, tg.MainButton, insurance, courier]);

    const handleSizeClick = (sizeValue) => {
        setSize((prevSize) => (prevSize === sizeValue ? '' : sizeValue));
    };

    const handleWeightClick = (weightValue) => {
        setWeight((prevWeight) => (prevWeight === weightValue ? '' : weightValue));
    };

    const handleValueClick = (valueValue) => {
        setValue((prevValue) => (prevValue === valueValue ? '' : valueValue));
    };

    const handleUrgencyClick = (urgencyValue) => {
        setUrgency((prevUrgency) => (prevUrgency === urgencyValue ? '' : urgencyValue));
    };

    const handleSubmit = () => {
        onSendData();
    };

    return (
        <div className="CreateItem">
            <div className="container">
                <div className="section">
                    <h2>Size</h2>
                    <div className="flex-container">
                        <button
                            className={`option-button flex-item ${size === 'Pocket' ? 'selected' : ''}`}
                            onClick={() => handleSizeClick('Pocket')}
                        >
                            Pocket
                        </button>
                        <button
                            className={`option-button flex-item ${size === 'Handy' ? 'selected' : ''}`}
                            onClick={() => handleSizeClick('Handy')}
                        >
                            Handy
                        </button>
                        <button
                            className={`option-button flex-item ${size === 'Cabin' ? 'selected' : ''}`}
                            onClick={() => handleSizeClick('Cabin')}
                        >
                            Cabin
                        </button>
                        <button
                            className={`option-button flex-item ${size === 'Luggage' ? 'selected' : ''}`}
                            onClick={() => handleSizeClick('Luggage')}
                        >
                            Luggage
                        </button>
                    </div>
                </div>
                <div className="section">
                    <h2>Weight</h2>
                    <div className="flex-container">
                        <button
                            className={`option-button flex-item ${weight === '1 KG' ? 'selected' : ''}`}
                            onClick={() => handleWeightClick('1 KG')}
                        >
                            Small
                        </button>
                        <button
                            className={`option-button flex-item ${weight === '5 KG' ? 'selected' : ''}`}
                            onClick={() => handleWeightClick('5 KG')}
                        >
                            1-5 kg
                        </button>
                        <button
                            className={`option-button flex-item ${weight === '10 KG' ? 'selected' : ''}`}
                            onClick={() => handleWeightClick('10 KG')}
                        >
                            5+ kg
                        </button>
                        <button
                            className={`option-button flex-item ${weight === 'Heavy' ? 'selected' : ''}`}
                            onClick={() => handleWeightClick('Heavy')}
                        >
                            Heavy
                        </button>
                    </div>
                </div>
                <div className="section">
                    <h2>Urgency</h2>
                    <div className="flex-container">
                        <button
                            className={`option-button flex-item ${urgency === 'ASAP' ? 'selected' : ''}`}
                            onClick={() => handleUrgencyClick('ASAP')}
                        >
                            ASAP
                        </button>
                        <button
                            className={`option-button flex-item ${urgency === '3 days' ? 'selected' : ''}`}
                            onClick={() => handleUrgencyClick('3 days')}
                        >
                            3 days
                        </button>
                        <button
                            className={`option-button flex-item ${urgency === 'A week' ? 'selected' : ''}`}
                            onClick={() => handleUrgencyClick('A week')}
                        >
                            A week
                        </button>
                        <button
                            className={`option-button flex-item ${urgency === 'More' ? 'selected' : ''}`}
                            onClick={() => handleUrgencyClick('More')}
                        >
                            More
                        </button>
                    </div>
                </div>
                <div className="section">
                    <h2>Value</h2>
                    <div className="flex-container">
                        <button
                            className={`option-button flex-item ${value === '100' ? 'selected' : ''}`}
                            onClick={() => handleValueClick('100')}
                        >
                            up to $100
                        </button>
                        <button
                            className={`option-button flex-item ${value === '500' ? 'selected' : ''}`}
                            onClick={() => handleValueClick('500')}
                        >
                            $100-$500
                        </button>
                        <button
                            className={`option-button flex-item ${value === '1000' ? 'selected' : ''}`}
                            onClick={() => handleValueClick('1000')}
                        >
                            $500+
                        </button>
                        <button
                            className={`option-button flex-item ${value === '5000' ? 'selected' : ''}`}
                            onClick={() => handleValueClick('5000')}
                        >
                            $1000+
                        </button>
                    </div>
                </div>
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
                </div>
                <div className="section">
                    <Row align="middle" gutter={16}>
                        <Col span={18}>
                            <span className={`switch-label ${courier === 1 ? 'selected' : ''}`}>Collect my item</span>
                        </Col>
                        <Col span={6}>
                            <Switch
                                checked={courier === 1}
                                onChange={(checked) => setCourier(checked ? 1 : 0)} // assuming setCourier is the state updater
                                checkedChildren={<CheckOutlined />}
                                unCheckedChildren={<CloseOutlined />}
                                //checked={false}
                                disabled
                            />
                        </Col>
                    </Row>
                </div>
                <div className="section">
                    <Row align="middle" gutter={16}>
                        <Col span={18}>
                            <span className="switch-label">I want be covered</span>
                        </Col>
                        <Col span={6}>
                            <Switch
                                checked={insurance === 1}
                                onChange={(checked) => setInsurance(checked ? 1 : 0)}
                                checkedChildren={<CheckOutlined />}
                                unCheckedChildren={<CloseOutlined />}
                                //checked={false}
                                disabled
                            />
                        </Col>
                    </Row>
                </div>
                <div className="section">
                    <h2>Estimated Cost</h2>
                    <div className="estimate">
                        <h3>{estimate}</h3>
                    </div>
                </div>
                <button className="action-button" onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    );
}

export default CreateItem;
