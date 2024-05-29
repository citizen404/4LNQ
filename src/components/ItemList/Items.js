import React, { useState, useEffect } from 'react';
import './Items.css';

function Items() {
    const [items, setItems] = useState([]);
    const [userId, setUserId] = useState('');

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const userIdFromUrl = urlParams.get('userId');
        setUserId(userIdFromUrl);

        if (userIdFromUrl) {
            fetch(`/items?userId=${userIdFromUrl}`)
                .then(response => response.json())
                .then(data => setItems(data))
                .catch(error => console.error('Error fetching items:', error));
        }
    }, []);

    return (
        <div className="Items">
            <h2>My Items</h2>
            {items.length > 0 ? (
                <ul>
                    {items.map(item => (
                        <li key={item._id}>
                            <p>Size: {item.size}</p>
                            <p>Weight: {item.weight}</p>
                            <p>Value: {item.value}</p>
                            <p>Departure: {item.departure}</p>
                            <p>Arrival: {item.arrival}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No items found.</p>
            )}
        </div>
    );
}

export default Items;