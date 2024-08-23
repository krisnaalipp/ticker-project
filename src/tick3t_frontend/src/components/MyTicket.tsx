import React from "react";

const TicketItem: React.FC<any> = (item) => {
    return (
        <div>
            <div className="flex gap-5 items-center justify-center">
                <div className="text-center flex flex-col gap-4">
                    <h2 className="text-sm font-bold">Event Name: {item.title}</h2>
                    <h2 className="text-sm font-bold">Description :{item.description}</h2>
                </div>
            </div>
        </div>
    );
};

export default TicketItem