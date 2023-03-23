// import React from "react";
import BarCharts from "./components/BarCharts";
export default function App() {
  const dataName = ["Temperature", "Precipitation"];
  const dataBar = [
    2.6, 5.9, 9.0, 26.4, 28.7, 7.7, 17.6, 18.2, 8.7, 18.8, 6.0, 2.3,
  ];
  const dataLine = [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3];
  return (
    <div>
      <h2>BarCharts</h2>
      <BarCharts dataName={dataName} dataBar={dataBar} dataLine={dataLine} />
    </div>
  );
}
