'use client'
import React, {useEffect, useState, Suspense} from 'react'
import { useCart} from '@/components/cartContext'
import Link from 'next/link'

interface totalAndHour {
  total:string
  hour:number
}

export default function zReportPage()
{
    const {lastTimeRanZReport, setZReportTime}  = useCart();
    const [queryResults, setQueryResults] = useState<totalAndHour[]>([]);

    useEffect(() => {
        getZReport();
    }, []);

    async function getZReport() {
      try {
        // Setting up string for the current time
        const currentTime = new Date()
        const options: Intl.DateTimeFormatOptions = {
          hour12:false,
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit"
        }

        let currentTimeString = currentTime.toLocaleString("en-US", options)
        currentTimeString = currentTimeString.replaceAll("/","-")
        currentTimeString = currentTimeString.replaceAll(",","")
        currentTimeString = currentTime.getFullYear()+"-"+currentTimeString

        // Setting up string for the previous time ran z report 
        let lastZReportTimeString = lastTimeRanZReport.toLocaleString("en-US", options)
        lastZReportTimeString = lastZReportTimeString.replaceAll("/","-")
        lastZReportTimeString = lastZReportTimeString.replaceAll(",","")
        lastZReportTimeString = lastTimeRanZReport.getFullYear()+"-"+lastZReportTimeString

        // If want to set the date values for testing
        // currentTimeString="2023-08-01 23:00"
        // lastZReportTimeString="2023-08-01 00:00"

        // Quering database
        const query =  "SELECT SUM(totalamount) AS total, EXTRACT(HOUR FROM transactiontime) AS hour FROM transaction WHERE transactiontime BETWEEN '" + lastZReportTimeString + "' AND '" + currentTimeString + "' GROUP BY hour"
        const response = await fetch(`/api/analysis?query=${encodeURIComponent(query)}`, {method: 'Get'});
        if (!response.ok)
            throw new Error("Failed to get z report");
        const data = await response.json();
        setQueryResults(qR=>data.totalPerHours)
        setQueryResults(qR=>qR.toSorted((a,b) => a.hour - b.hour))
        setZReportTime(currentTime)
    
      } catch (error) {
        console.error("Error making z report:", error);
      }
    }

    // This is used to display dummy info while waiting for the query to complete or if database returned no data
    const twentyFourElements:number[] = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]

    return(
      <div className = "grid gap-y-2 justify-items-center">
        <h1>Z Report</h1>
        <div className="grid grid-cols-2 grid-rows-25 justify-items-center grid-flow-col gap-x-2">
          <h2>Hour</h2>
          {
            queryResults.length>0 ? 
              queryResults.map((qR, index) => <h1 key={index}>{qR.hour}</h1>)
              :twentyFourElements.map((_, index) => <h1 key={index}>No data</h1>)
          }
          <h2>Total</h2>
          {
            queryResults.length>0 ? 
            queryResults.map((qR, index) => <h1 key={index}>{qR.total}</h1>)
            :twentyFourElements.map((_, index) => <h1 key={index}>No data</h1>)
          }
        </div>
        <Link href={{ pathname: "/analysis"}}>
              <button className="text-lg text-white bg-blue-500 rounded hover:bg-blue-600 px-4 py-2">Go Back</button>
        </Link>
      </div>
    )
}