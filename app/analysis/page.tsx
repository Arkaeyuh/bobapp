'use client'
import React, {useEffect, useState, Suspense} from 'react'
import Link from 'next/link'
// https://www.npmjs.com/package/react-datepicker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

//https://www.chartjs.org/docs/latest/ and https://react-chartjs-2.js.org/
import 'chart.js/auto';
import { ChartData } from 'chart.js/auto';
import { Bar, Chart } from 'react-chartjs-2';

//TODO
// MAKE PAGE NOT UGLY
// MAKE CHART NOT UGLY
// MAKE BETTER NO DATA indicator for x/z report
// ADD GO BACK BUTTON TO MANAGER SELECTION PAGE
// DON'T IMPORT FROM chart.js/auto BECAUSE BAD; ONLY IMPORT REQUIRED STUFF: https://www.chartjs.org/docs/latest/getting-started/integration.html#bundlers-webpack-rollup-etc

interface sumAndDay {
  sum:number,
  day:string
}

export default function analysisPage()
{
   const [analysisStart, setAnalysisStart] = useState<Date>(new Date());
   const [analysisEnd, setAnalysisEnd] = useState<Date>(new Date());
   const [chartData, setChartData] = useState<ChartData<"bar", (number | [number, number] | null)[], unknown>>({
    labels: [""],
    datasets: [{
      label: 'Products Used',
      data: [],
      borderWidth: 1,
    }]
  });

  const options = {
    scales: {
      x: {
        title :{
          display:true,
          text: "Date"
        }
      },
      y: {
        beginAtZero: true,
        title :{
          display:true,
          text: "Products Used"
        }
      }
    },
    plugins: {
      title: {
        display:true,
        text: "Product Usage Report"
      },
      legend: {
        display:false
      }
    }
  }



   async function updateChart() {
      try {
      // Setting up strings for analysis start date
      const options: Intl.DateTimeFormatOptions = {
        month: "2-digit",
        day: "2-digit",
      }

      let analysisStartString = analysisStart.toLocaleString("en-US", options)
      analysisStartString = analysisStartString.replaceAll("/","-")
      analysisStartString = analysisStartString.replaceAll(",","")
      analysisStartString = analysisStart.getFullYear()+"-"+analysisStartString

      // Setting up string for analysis end date 
      let analysisEndString = analysisEnd.toLocaleString("en-US", options)
      analysisEndString = analysisEndString.replaceAll("/","-")
      analysisEndString = analysisEndString.replaceAll(",","")
      analysisEndString = analysisEnd.getFullYear()+"-"+analysisEndString

      // If want to set the date values for testing
      // analysisStartString="2023-08-01"
      // analysisEndString="2023-08-05"

      // Quering database
      const query = "SELECT SUM(numIngredientsUsed), transactiontime::timestamp::date AS day FROM transaction WHERE transactiontime BETWEEN '" + analysisStartString + " 00:00:00' AND '" + analysisEndString + " 23:59:59' GROUP BY day ORDER BY day";
      const response = await fetch(`/api/analysis?query=${encodeURIComponent(query)}`, {method: 'Get'});
      if (!response.ok)
          throw new Error("Failed to get inventory report");
      const data = await response.json();
      // console.log(data.totalPerHours)

      // Giving data a type to make mapping easier
      const queryResults:sumAndDay[] = data.totalPerHours
      // Setting chart data with results from query
      setChartData({
          labels: queryResults.map((sumAndDayValue) => sumAndDayValue.day.substring(0,10)),
          datasets: [{
            label: 'Products Used',
            data: queryResults.map((sumAndDayValue) => sumAndDayValue.sum),
            borderWidth: 1,
          }]
        })
      } catch (error) {
        console.error("Error making inventory report:", error);
      }
  }

  return(
    <>
    <div className="h-100">
      <Bar options={options} data={chartData}/>
    </div>
      <div className = "grid gap-y-2 justify-items-center">
        <Link href={{ pathname: "/analysis/xReport"}}>
              <button className="text-lg text-white bg-blue-500 rounded hover:bg-blue-600 px-4 py-2">Generate XReport</button>
        </Link>
        <Link href={{ pathname: "/analysis/zReport"}}>
              <button className="text-lg text-white bg-blue-500 rounded hover:bg-blue-600 px-4 py-2">Generate ZReport</button>
        </Link>
        <DatePicker selected={analysisStart} onChange={(date) => date && setAnalysisStart(date)}/>
        <DatePicker selected={analysisEnd} onChange={(date) => date && setAnalysisEnd(date)}/>
        <button onClick={()=>updateChart()} className="text-lg text-white bg-blue-500 rounded hover:bg-blue-600 px-4 py-2">Make Chart</button>
      </div>
    </>
  )
}