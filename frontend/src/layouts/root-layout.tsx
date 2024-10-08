import { Link, Outlet, useNavigate } from "react-router-dom";
import { ClerkProvider, SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import NameChangePage from "../routes/namechange";
import SignOut from "../routes/sign-out";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY){
    throw new Error('Missing Publishable Key');
};

export default function RootLayout(){
    const navigate = useNavigate();

    return (
        <ClerkProvider
        routerPush={(to) => navigate(to)}
        routerReplace={(to) => navigate(to, {replace:true})}
        publishableKey={PUBLISHABLE_KEY}
        >
            <header>
                <div>
                    <SignedIn>
                        <UserButton />
                        <NameChangePage/>
                        <SignOut/>
                    </SignedIn>
                    <SignedOut>
                        <Link to="/sign-in">Sign In</Link>
                    </SignedOut>
                </div>
            </header>
            <main>
                <Outlet />
            </main>
        </ClerkProvider>
    )
}