import React from "react";
import PreLoader from "../assets/Preloader.gif";

interface LoaderProps {
  isLoading: boolean;
  children: React.ReactNode;
}

function Loader({ isLoading, children }: LoaderProps) {
  return isLoading ? (
    <div className="loading">
      <h1>Loading Data</h1>
      <img src={PreLoader} />
    </div>
  ) : (
    <>{children}</>
  );
}

export default Loader;
