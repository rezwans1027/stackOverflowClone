import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main className="flex min-h-screen w-full items-center justify-center border-8 border-solid border-black">
            {children}
        </main>
    );
};

export default Layout;
