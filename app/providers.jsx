    // "use client";

    // import { SessionProvider } from "next-auth/react";

    // export default function Providers({ children }) {
    //   return <SessionProvider>{children}</SessionProvider>;
    // }
    import { ClerkProvider } from '@clerk/nextjs'

    export default function Providers({ children }) {
      return <ClerkProvider>{children}</ClerkProvider>;
    }