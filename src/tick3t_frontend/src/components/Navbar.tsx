import * as React from "react";
import { Link } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalStorage";

const Navbar: React.FC = () => {
    const [greeting, setValue, removeItem] = useLocalStorage<string>('greeting', '');

    return (
        <nav className="bg-gradient-to-r bg-gradient-to-r from-blue-800 via-black to-blue-900 p-4 shadow-md sticky top-0 z-8 overflow-hidden">
            <div className="container mx-auto flex items-center justify-around pl-4">
                <Link to="/" className="text-white text-4xl font-bold hover:text-gray-300 transition duration-300">
                    tick3r
                </Link>
                {
                    greeting && (
                        <Link to="/myTickets" className="text-white text-xl hover:text-gray-300 hover:underline transition duration-300">
                            My Tickets
                        </Link>
                    )
                }
            </div>
        </nav>
    );
};

export default Navbar;
