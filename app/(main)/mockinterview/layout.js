
import React, { Suspense } from "react";
import { FadeLoader } from "react-spinners";

const Layout = ({ children }) => {
  return (
    <div className="px-5">

      <Suspense
        fallback={
          <div className="mt-4 flex items-center justify-center w-full">
            <FadeLoader color="cyan" className="items-center-safe w-full mt-20"/>
          </div>
        }
      >
        {children}
      </Suspense>
    </div>
  );
};

export default Layout;
