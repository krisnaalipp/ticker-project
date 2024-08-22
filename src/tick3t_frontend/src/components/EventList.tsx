import { Button, Modal, NftCard } from "@web3uikit/core";
import React, { useState } from "react";

const EventCard: React.FC = () => {
    const [show, setShow] = useState(false);
    const dummyEvent = {
        title: "Rock Fest 2024",
        date: "August 30, 2024",
        venue: "Jakarta Convention Center",
        imageUrl:
            "https://cdn1-production-images-kly.akamaized.net/lx2RyJzu8bIJ1IsrSx0bZsGaZpk=/640x360/smart/filters:quality(75):strip_icc():format(webp)/kly-media-production/medias/711562/original/oasis-1-yos-140721.jpg",
    };

    return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <img
                className="w-full h-48 object-cover"
                src={dummyEvent.imageUrl}
                alt={dummyEvent.title}
            />
            <div className="p-4">
                <h2 className="text-2xl text-black font-bold mb-2">
                    {dummyEvent.title}
                </h2>
                <p className="text-gray-600 mb-2">{dummyEvent.date}</p>
                <p className="text-gray-500">{dummyEvent.venue}</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-blue-800 to-black to-70% flex justify-between items-center">
                <span className="text-lg text-white font-semibold">18 ICP</span>
                <Button
                    onClick={() => setShow(true)}
                    text="Book!"
                    theme="colored"
                    color="green"
                    size="large"
                />
            </div>
            <Modal
                isVisible={show}
                onCloseButtonPressed={() => (setShow(false))}
                isCentered
                width="580px"
                hasCancel={false}
                headerHasBottomBorder={false}
                hasFooter={false}
            >
                <div className="pb-8">
                    <p className="text-black text-xl font-bold mb-5">
                        Book now and get the NFTs limited merch ticket!
                    </p>
                    <div className="flex gap-5 items-center justify-center">
                        <img
                            className="h-36 object-contain"
                            src={dummyEvent.imageUrl}
                            alt={dummyEvent.title}
                        />
                        <div className="text-start flex flex-col gap-4">
                            <h2 className="text-sm font-bold">Event Name: {dummyEvent.title}</h2>
                            <h2 className="text-sm font-bold">Place :{dummyEvent.venue}</h2>
                            <h2 className="text-sm font-bold">Date :{dummyEvent.date}</h2>
                        </div>
                    </div>
                    <div className="flex gap-5 justify-center items-center">

                        <p className="text-black text-xl font-bold my-5">
                            Limited Merch Ticket:
                        </p>
                        <p className="text-xl ">John Lennon Guitar Pic 1964</p>
                    </div>
                    <div className="flex w-100 justify-center">
                        <img className="h-64 w-40 object-cover" src="https://faroutmagazine.co.uk/static/uploads/1/2022/10/Looking-at-the-life-of-John-Lennon-through-his-guitars.jpg" />
                    </div>
                    <div className="flex w-100 justify-center mt-5">
                        <Button theme="moneyPrimary" text="Process (12 ICP)" isFullWidth />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default EventCard;
