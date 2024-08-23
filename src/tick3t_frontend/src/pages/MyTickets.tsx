import { Principal } from "@dfinity/principal";
import { tick3t_backend } from "declarations/tick3t_backend";
import React, { useEffect, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import TicketItem from "../components/MyTicket";

const MyTickets: React.FC = () => {
    const [greeting] = useLocalStorage('greeting', '');
    const [tickets, setTickets] = useState<any[]>([]); // Use any[] for generic typing

    useEffect(() => {
        const fetchEventTickets = async () => {
            try {
                // Convert greeting to Principal if needed
                const fetchedTickets = await tick3t_backend.getEventTicketsByOwner(greeting);
                // Process fetched tickets
                setTickets(fetchedTickets);
            } catch (error) {
                console.error("Failed to fetch tickets:", error);
            }
        };

        if (greeting) {
            fetchEventTickets();
        }
    }, [greeting]);

    return (
        <section
            className="h-screen flex items-center justify-center bg-gradient-to-r from-blue-800 via-black to-blue-900"
        >
            {tickets.map((ticket, index) => (
                <TicketItem key={index} item={ticket} /> // Use index if no unique ID available
            ))}
        </section>
    );
};

export default MyTickets;
