import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useTelegram } from "./hooks/useTelegram";
import Header from "./components/Header/Header";
import CreateItem from './components/Item/CreateItem';
import Items from './components/ItemList/Items';

function App() {
    const { tg } = useTelegram();

    useEffect(() => {
        tg.ready();
    }, [tg]);

    return (
        <div className="App">
            <Header />
            <Routes>
                <Route index element={<CreateItem />} />
                <Route path="/items" element={<Items />} />
            </Routes>
        </div>
    );
}

export default App;