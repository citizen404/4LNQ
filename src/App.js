import React, { useState } from 'react';
import './App.css'; // Import the CSS file

function App() {
    const [step, setStep] = useState(1);
    const [itemSize, setItemSize] = useState('');
    const [itemWeight, setItemWeight] = useState('');

    const handleSizeClick = (size) => {
        setItemSize(size);
    };

    const handleWeightClick = (weight) => {
        setItemWeight(weight);
    };

    const handleNext = () => {
        setStep(step + 1);
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    const handleSave = () => {
        // Send data to backend
        console.log('Item Size:', itemSize);
        console.log('Item Weight:', itemWeight);
        // You can replace this with an actual API call
    };

    const renderOptions = () => {
        if (step === 1) {
            return (
                <div className="center-container">
                    <h2>Choose Size</h2>
                    <div className="grid-container">
                        <button
                            className={`option-button ${itemSize === 'Pocket' ? 'selected' : ''}`}
                            onClick={() => handleSizeClick('Pocket')}
                        >
                            <span className="icon">🔹</span>
                            <span className="label">Pocket</span>
                        </button>
                        <button
                            className={`option-button ${itemSize === 'Handy' ? 'selected' : ''}`}
                            onClick={() => handleSizeClick('Handy')}
                        >
                            <span className="icon">🔸</span>
                            <span className="label">Handy</span>
                        </button>
                        <button
                            className={`option-button ${itemSize === 'Cabin' ? 'selected' : ''}`}
                            onClick={() => handleSizeClick('Cabin')}
                        >
                            <span className="icon">🔷</span>
                            <span className="label">Cabin</span>
                        </button>
                        <button
                            className={`option-button ${itemSize === 'Luggage' ? 'selected' : ''}`}
                            onClick={() => handleSizeClick('Luggage')}
                        >
                            <span className="icon">🔶</span>
                            <span className="label">Luggage</span>
                        </button>
                    </div>
                    <div>
                        <button className="button" onClick={handleNext} disabled={!itemSize}>Next</button>
                        <button className="button">Close</button>
                    </div>
                </div>
            );
        } else if (step === 2) {
            return (
                <div className="center-container">
                    <h2>Choose Weight</h2>
                    <div className="grid-container">
                        <button
                            className={`option-button ${itemWeight === 'Light' ? 'selected' : ''}`}
                            onClick={() => handleWeightClick('Light')}
                        >
                            <span className="icon">⚖️</span>
                            <span className="label">Light</span>
                        </button>
                        <button
                            className={`option-button ${itemWeight === 'Moderate' ? 'selected' : ''}`}
                            onClick={() => handleWeightClick('Moderate')}
                        >
                            <span className="icon">⚖️</span>
                            <span className="label">Moderate</span>
                        </button>
                        <button
                            className={`option-button ${itemWeight === 'Heavy' ? 'selected' : ''}`}
                            onClick={() => handleWeightClick('Heavy')}
                        >
                            <span className="icon">⚖️</span>
                            <span className="label">Heavy</span>
                        </button>
                        <button
                            className={`option-button ${itemWeight === 'Very Heavy' ? 'selected' : ''}`}
                            onClick={() => handleWeightClick('Very Heavy')}
                        >
                            <span className="icon">⚖️</span>
                            <span className="label">Very Heavy</span>
                        </button>
                    </div>
                    <div>
                        <button className="button" onClick={handleBack}>Back</button>
                        <button className="button" onClick={handleNext} disabled={!itemWeight}>Next</button>
                    </div>
                </div>
            );
        } else if (step === 3) {
            return (
                <div className="center-container">
                    <h2>Review and Save</h2>
                    <p>Item Size: {itemSize}</p>
                    <p>Item Weight: {itemWeight}</p>
                    <div>
                        <button className="button" onClick={handleBack}>Back</button>
                        <button className="button" onClick={handleSave}>Save</button>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="App">
            {renderOptions()}
        </div>
    );
}

export default App;
