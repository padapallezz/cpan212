import {Link } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
const Home =() => {
    return(
        <div>
            <h1>Welcome to BTracker</h1>
            <nav>
                <ul>
                    <li><Link to="/bep">Break-even Analysis</Link></li>
                    <li><Link to="/forecast">Forecast</Link></li>
                    <li><Link to="/revenue">Revenue</Link></li>
                    <li><Link to="/whatif">What-If Analysis</Link></li>
                </ul>
            </nav>
        </div>

    )
};
export default Home;
