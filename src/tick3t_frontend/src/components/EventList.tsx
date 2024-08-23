import { Button, Input, Loading, Modal, NftCard } from "@web3uikit/core";
import React, { useState } from "react";
import { natToICP } from "../helpers";
import useLocalStorage from "../hooks/useLocalStorage";
import { tick3t_backend } from "declarations/tick3t_backend";
import { toast } from "react-toastify";
import { Principal } from "@dfinity/principal";

const EventCard: React.FC<any> = ({ item, greeting }) => {
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);

    const [username, setUsername] = useState<string>('');

    const handleBookClick = () => {
        if (!greeting) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            setShow(true);
        }
    };
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleBuy = async () => {
        if (!username) {
            setErrorMessage("This field is required")
        } else {
            setLoading(true)
            const result: any = await tick3t_backend.buyTicket(item.id, username, Principal.fromText(greeting));
            if (!result.err) {
                toast.success("Purchase Success!")
                setShow(false)
                setErrorMessage('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            setLoading(false);
        }
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setUsername(value);

        // Reset error message when the input changes
        if (errorMessage) {
            setErrorMessage('');
        }
    };

    return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-4">
                <h2 className="text-2xl text-black font-bold mb-2">
                    {item.title}
                </h2>
                <p className="text-gray-600 mb-2">{item.description}</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-blue-800 to-black to-70% flex gap-4 justify-between items-center">
                <span className="text-lg text-white font-semibold">{natToICP(item.price)} ICP</span>
                <Button
                    onClick={handleBookClick}
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
                    <div className="flex gap-5 items-center justify-center">
                        <div className="text-center flex flex-col gap-4">
                            <h2 className="text-sm font-bold">Event Name: {item.title}</h2>
                            <h2 className="text-sm font-bold">Description :{item.description}</h2>
                        </div>
                    </div>
                    <div className="flex w-100 justify-center gap-4 mt-5">
                        <div>
                            <Input
                                label="Username"
                                name="username"
                                placeholder="Please enter your username"
                                value={username}
                                onChange={handleInputChange}
                                state={errorMessage ? "error" : "initial"}
                                errorMessage={errorMessage}
                            />
                        </div>
                        {
                            loading ? (<Loading
                                size={12}
                                spinnerColor="#2E7DAF"
                                spinnerType="wave"
                            />) : (

                                <Button theme="moneyPrimary" onClick={handleBuy} disabled={!!errorMessage} text={`Process ${natToICP(item.price)} ICP`} isFullWidth />
                            )
                        }
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default EventCard;
