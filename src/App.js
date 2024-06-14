import { Route, Routes } from 'react-router-dom';
import Header from "./components/Header/Header";
import CreateItem from './components/Item/CreateItem';
import CreateTrip from "./components/Trip/CreateTrip";
import Items from './components/ItemList/Items';
//import FindTrip from "./components/Matches/FindTrip.jsx";
import Matches from "./components/Matches/Matches";

function App() {
    return (
        <div className="App">
            <Header />
            <Routes>
                <Route index element={<CreateItem />} />
                <Route path="/newTrip" element={<CreateTrip />} />
                <Route path="/items" element={<Items />} />
                <Route path="/matches/:itemId" element={<Matches />} />
                <Route path="/selectTrip/:tripId" element={<Items />} />
            </Routes>
        </div>
    );
}

export default App;