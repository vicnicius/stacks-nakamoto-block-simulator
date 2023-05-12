import React, { FC } from "react";
import { Header } from "./ui/components/header/Header";
import { Canvas } from "./ui/Canvas";
import "./App.css";

export const App: FC = () => {
  return (
    <main className="App">
      <Header />
      <Canvas />
    </main>
  );
};
