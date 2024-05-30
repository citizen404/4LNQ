import React, {useState, useEffect, useCallback} from 'react';
import './CreateItem.css';
import { useTelegram } from "../../hooks/useTelegram";

const airportCodes = ["JFK", "DXB", "LAX", "LHR", "CDG", "AMS", "FRA", "HND", "SYD", "ORD"];

function CreateItem() {
    const { tg } = useTelegram();
    //const { onToggleButton, tg } = useTelegram();
    const [size, setSize] = useState('');
    const [weight, setWeight] = useState('');
    const [value, setValue] = useState('');
    const [departure, setDeparture] = useState('');
    const [arrival, setArrival] = useState('');
    const [userId, setUserId] = useState('');

    const onSendData = useCallback(() => {
        const data = {
            weight,
            size,
            value,
            departure,
            arrival,
            sender_uid: userId,
        }

        // Save data to the backend
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
                // Send data to the Telegram chat
                tg.sendData(JSON.stringify(data));
                alert('Data saved successfully');
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('Error saving data' + error.message);
            });
    }, [])

    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData)
        return() => {
            tg.offEvent('mainButtonClicked', onSendData())
        }
    }, [])

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const userIdFromUrl = urlParams.get('userId');
        tg.MainButton.setParams({
            text: 'Submit item'
        })
        setUserId(userIdFromUrl);
    }, [tg]);

    useEffect(()=>{
        if(!size || !weight || !value || !departure || !arrival) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
        }
    }, [size, weight, value, departure, arrival])

    const handleSizeClick = (selectedSize) => {
        setSize(selectedSize);
    };

    const handleWeightClick = (selectedWeight) => {
        setWeight(selectedWeight);
    };

    const handleValueClick = (selectedValue) => {
        setValue(selectedValue);
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
                    <h2>Departure and Arrival</h2>
                    <div className="dropdown-container">
                        <select value={departure} onChange={(e) => setDeparture(e.target.value)} className="dropdown">
                            <option value="" disabled>From</option>
                            {airportCodes.map((code) => (
                                <option key={code} value={code}>{code}</option>
                            ))}
                        </select>
                        <select value={arrival} onChange={(e) => setArrival(e.target.value)} className="dropdown">
                            <option value="" disabled>To</option>
                            {airportCodes.map((code) => (
                                <option key={code} value={code}>{code}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateItem;