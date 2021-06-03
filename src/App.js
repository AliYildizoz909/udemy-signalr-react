import { useEffect, useState } from "react";
import Chart from "react-google-charts";
import * as signalR from "@microsoft/signalr";

function App() {

  const [data, setData] = useState([]);

  const connection = new signalR.HubConnectionBuilder().withUrl("https://localhost:44364/CovidHub").build();
  connection.on("ReceiveCovidList",
    (covidList) => {
      console.log(covidList);
      var arr = [];

      for (var i = 0; i < covidList.length; i++) {
        var data = covidList[i];
        arr.push([data.covidDate, ...data.counts])
      }
      setData(arr);
    });

  useEffect(() => {
    connection.start().then(() => {
      connection.invoke("GetCovidList").catch((err) => console.log(err));
    });
  }, [])


  return (
    <div className="App">
      <div style={{ display: 'flex', maxWidth: 2000 }}>
        <Chart
          width={2000}
          height={'400px'}
          chartType="LineChart"
          loader={<div>Loading Chart</div>}
          data={[['Date', 'Istanbul', 'Ankara', 'Izmir', 'Konya', 'Antalya'], ...data]}
          options={{
            title: 'Company Performance',
            hAxis: { title: 'Year', titleTextStyle: { color: '#333' } },
            vAxis: { minValue: 0 },
            // For the legend to fit, we make the chart area smaller
            chartArea: { width: '50%', height: '70%' },
            // lineWidth: 25
          }}
        />


      </div>
    </div>
  );
}

export default App;
