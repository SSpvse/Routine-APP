
import ToDo from "./ToDo.tsx";
import Menu from "./Menu.tsx";
import { Routes , Route } from "react-router-dom";


const Content = () => {


    return (
        <main>
            <Routes>
                <Route path="/" element={<Menu />} />
                <Route path="/todo" element={<ToDo />} />
            </Routes>
        </main>
    );
};

export default Content;
