// Home.tsx
import { AuthClient } from "@dfinity/auth-client";
import * as React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState, FormEvent } from "react";
import { tick3t_backend } from "declarations/tick3t_backend";
import { Button } from "@web3uikit/core";
import useIntersectionObserver from "../hooks/useIntersectionObserver";
import useLocalStorage from "../hooks/useLocalStorage";
import EventCard from "../components/EventList";

const Home: React.FC = () => {
	const [greeting, setValue, removeItem] = useLocalStorage<string>('greeting', '');
	const [authClient, setAuthClient] = useState<AuthClient | null>(null);


	const sectionRef1 = React.useRef<HTMLDivElement | null>(null);
	const sectionRef2 = React.useRef<HTMLDivElement | null>(null);

	const isSection1InView = useIntersectionObserver(sectionRef1.current);
	const isSection2InView = useIntersectionObserver(sectionRef2.current);

	useEffect(() => {
		AuthClient.create().then(setAuthClient);
	}, []);

	async function handleSubmit(event: FormEvent) {
		event.preventDefault();

		if (!authClient) return;

		await new Promise<void>((resolve, reject) => {
			authClient.login({
				identityProvider: `http://${process.env.CANISTER_ID_INTERNET_IDENTITY}.localhost:4943`,
				onSuccess: resolve,
				onError: reject,
			});
		});
		const principal = await authClient.getIdentity().getPrincipal();
		setValue(principal.toText());
	}

	async function handleLogout(event: FormEvent) {
		event.preventDefault();

		if (!authClient) return;

		await authClient.logout();
		removeItem();
	}

	return (
		<main className="overflow-hidden">
			<section
				ref={sectionRef1}
				className={`h-screen flex items-center justify-center bg-gradient-to-r from-blue-800 via-black to-blue-900 ${isSection1InView ? 'fade-in' : ''}`}
			>
				<div className="text-center text-white">
					<h1 className="text-5xl font-bold mb-4">Meet ticker, when web3 provide tickets.</h1>
					<p className="text-xl mb-4">Secure your ticket as a limited nft merch for every concerts!</p>
					<div className="w-100 flex justify-center mt-10">
						{
							greeting ? (
								<div className="flex flex-col gap-3">
									<div className="text-lg font-bold mt-2">
										<p>Your Principal: {greeting}</p>
									</div>
									<Button text="Logout" theme="colored" color="red" size="xl" isFullWidth onClick={handleLogout} />
								</div>
							) : (

								<Button text="Login with Internet Identity" theme="outline" size="xl" isFullWidth onClick={handleSubmit} />
							)
						}
					</div>
				</div>
			</section>
			<section
				ref={sectionRef2}
				className={`h-screen flex items-center justify-center bg-gradient-to-r from-green-800 via-black to-teal-500 ${isSection2InView ? 'fade-in' : ''}`}
			>
				<div className="text-center text-white">
					<h1 className="text-5xl font-bold mb-5">Upcoming Events</h1>
					<div className="flex gap-10">
						<EventCard />
						<EventCard />
						<EventCard />
					</div>
				</div>
			</section>
			<footer className="h-[50%] bg-black text-white flex p-20 justify-center items-center">
				<p className="text-2xl font-semibold">Powered by tick3r</p>
			</footer>
		</main>
	);
};

export default Home;
