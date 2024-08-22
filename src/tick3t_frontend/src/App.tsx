import { useEffect, useState, FormEvent } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { tick3t_backend } from 'declarations/tick3t_backend';

function App() {
  const [greeting, setGreeting] = useState<string>('');
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);

  useEffect(() => {
    AuthClient.create().then(setAuthClient);
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!authClient) return;

    await new Promise<void>((resolve, reject) => {
      authClient.login({
        identityProvider: `http://localhost:4943/?canisterId=${process.env.CANISTER_ID_INTERNET_IDENTITY}`,
        onSuccess: resolve,
        onError: reject
      })
    });

    const principal = await authClient.getIdentity().getPrincipal();
    setGreeting(principal.toText());
  }

  async function handleLogout(event: FormEvent) {
    event.preventDefault();

    if (!authClient) return;

    await authClient.logout();
    setGreeting('');
  }

  return (
    <main>
      <img src="/logo2.svg" alt="DFINITY logo" />
      <br />
      <br />
      <form action="#" onSubmit={handleSubmit}>
        <button type="submit">Login!</button>
      </form>
      <button onClick={handleLogout}>Logout</button>
      <section id="greeting">{greeting}</section>
    </main>
  );
}

export default App;