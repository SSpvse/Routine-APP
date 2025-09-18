import React, { useState } from "react";
import { Link } from "react-router-dom";

const Menu = () => {




    return (
        <nav style={{ padding: "1rem", borderBottom: "1px solid #ddd" }}>


                <ul style={{ listStyle: "none", padding: 0, marginTop: "1rem" }}>
                    <li>
                        <a href="#home">🏠 Home</a>
                    </li>
                    <li>
                            <Link to="/todo">📝 ToDo’s Today</Link>
                    </li>
                    <li>
                        <a href="#settings">⚙️ Settings</a>
                    </li>
                    <li>
                        <a href="#logout">🚪 Logout</a>
                    </li>
                </ul>

        </nav>
    );
};

export default Menu;
