import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Step_1 from "./Pages/Step_1";

import Step_2 from "./Pages/Step_2";
import Step_3 from "./Pages/Step_3";
import Step_4 from "./Pages/Step_4";
import SuccessPage from "./Pages/SuccessPage";

import Dashboard from "./Pages/Dashboard";



function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Step_1 />} />
                <Route path="/step_1" element={<Step_1 />} />

                <Route path="/step_2" element={<Step_2 />} />

                <Route path="/step_3" element={<Step_3 />} />
                <Route path="/step_4" element={<Step_4 />} />
                <Route path="/success" element={<SuccessPage />} /> 
                <Route path="/dashboard" element={<Dashboard />} /> 

            </Routes>
        </Router>
    );
}

export default App;
