import * as React from "react";
import { Link } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalStorage";

interface Props {
    greeting: string;
}

const Navbar: React.FC<Props> = (props) => {
    const { greeting } = props;

    return (
        <nav className="bg-gradient-to-r bg-gradient-to-r from-blue-800 via-black to-blue-900 p-4 shadow-md sticky top-0 z-8 overflow-hidden">
            <div className={`container mx-auto flex items-center ${greeting ? 'justify-between' : ''} pl-4`}>
                <Link to="/" className="text-white text-4xl font-bold hover:text-gray-300 transition duration-300">
                    tick3r
                </Link>
                {
                    greeting && (
                        <Link to="/my-tickets" className="text-white text-xl hover:text-gray-300 hover:underline transition duration-300">
                            My Tickets
                        </Link>
                    )
                }
            </div>
        </nav>
    );
};

export default Navbar;
