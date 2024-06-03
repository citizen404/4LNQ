import React, { useState, useEffect } from 'react';
import './Items.css';

function Items() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const userIdFromUrl = urlParams.get('userId');

        console.log('userId', userIdFromUrl);

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
                <table>
                    <thead>
                    <tr>
                        <th>Size</th>
                        <th>Weight</th>
                        <th>Value</th>
                        <th>Urgency</th>
                        <th>Departure</th>
                        <th>Arrival</th>
                    </tr>
                    </thead>
                    <tbody>
                    {items.map(item => (
                        <tr key={item._id}>
                            <td>{item.size}</td>
                            <td>{item.weight}</td>
                            <td>{item.value}</td>
                            <td>{item.urgency}</td>
                            <td>{item.departure}</td>
                            <td>{item.arrival}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>No items found.</p>
            )}
        </div>
    );
}

export default Items;