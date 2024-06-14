//http://localhost:3000/matches/665e0c0899120daeffda93bf

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function Matches() {
    const { itemId } = useParams();
    const [matches, setMatches] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!itemId) return;
        fetch(`/matches/${itemId}`)
            .then(response => response.json())
            //.then(data => setMatches(data.matches))
            .then(data => {
                if (data.matches) {
                    setMatches(data.matches);
                } else {
                    setError('No matches found.');
                }
            })
            .catch(error => setError('Error fetching matches: ' + error.message));
    }, [itemId]);

    const selectTrip = (tripId) => {
        fetch(`/selectTrip/${tripId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ itemId }),
        })
            .then(response => response.json())
            .then(data => {
                alert(`Contact the transporter with user ID: ${data.transporter_uid}`);
            })
            .catch(error => {
                setError('Error selecting trip: ' + error.message);
            });
    };

    return (
        <div className="Matches">
            <h2>Available Trips</h2>
            {error && <p className="error">{error}</p>}
            <ul>
                {matches.map(match => (
                    <li key={match._id}>
                        <button onClick={() => selectTrip(match._id)}>
                            {`Trip on ${new Date(match.date).toLocaleDateString()}`}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Matches;
