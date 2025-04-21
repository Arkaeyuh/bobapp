'use client'
import React, {useEffect, useState, Suspense} from 'react'
import Link from 'next/link'

interface totalAndHour {
  total:string
  hour:number
}

export default function zReportPage()
{
  const [loading, setLoading] = useState(true);
  const [queryResults, setQueryResults] = useState<totalAndHour[]>([]);

    useEffect(() => {
        getZReport();
    }, []);

    async function getZReport() {
      if(loading) {
        try {
          // Setting up string for the current time
          const currentTime = new Date()
          const options: Intl.DateTimeFormatOptions = {
            hour12:false,
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
          }

          let currentTimeString = currentTime.toLocaleString("en-US", options)
          currentTimeString = currentTimeString.replaceAll("/","-")
          currentTimeString = currentTimeString.replaceAll(",","")
          currentTimeString = currentTime.getFullYear()+"-"+currentTimeString

          // Quering database
          const query =  "SELECT SUM(totalamount) AS total, EXTRACT(HOUR FROM transactiontime) AS hour FROM transaction WHERE transactiontime BETWEEN (select transactiontime from transaction where employeeid=0 order by transactiontime desc limit 1) AND '" + currentTimeString + "' GROUP BY hour"
          const response = await fetch(`/api/analysis?query=${encodeURIComponent(query)}`, {method: 'Get'});
          if (!response.ok)
              throw new Error("Failed to get z report");
          const data = await response.json();
          
          setQueryResults(qR=>data.totalPerHours)
          setQueryResults(qR=>qR.toSorted((a,b) => a.hour - b.hour))

          // Adding dummy data for hours not in result
          setQueryResults(qR=>{
            let answer = [...qR]
            let currentHour=0
            for(let i=0; i<answer.length;i++){
              if(answer[i].total=="0.00")
                  answer[i].total="0"
              while(answer[i].hour!=currentHour) {
                answer.splice(i,0, {total:"0", hour:currentHour})
                currentHour++
                i++
              }
              currentHour++
            }
            while(currentHour!=24) {
                answer.push({total:"0", hour:currentHour})
                currentHour++;
            }
            return answer
          })

          // Updating last time ran z report
          const query2 =  "INSERT INTO transaction VALUES ((SELECT COUNT(transactionID) FROM transaction)+1, 0, '"+currentTimeString+"', 0, 0)"
          await fetch(`/api/analysis?query=${encodeURIComponent(query2)}`, {method: 'Post'})
          
          setLoading(false)
        } catch (error) {
          console.error("Error making z report:", error);
        }
      }
    }

    // This is used to display dummy info while waiting for the query to complete or if database returned no data
    const twentyFourElements:number[] = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]

    return(
      <div className="bg-gray-100 min-h-screen">
        <header className="w-full bg-blue-500 text-white py-6">
          <h1 className="text-4xl font-bold text-center">Z Report</h1>
          {/* <p className="text-center mt-2 text-lg">View statistics about the store</p> */}
        </header>
        <div className = "grid gap-y-2 justify-items-center">
          <div className = "grid grid-cols-2 grid-rows-1 justify-items-center grid-flow-col gap-x-2">
            <h2 className="text-xl font-semibold underline text-black">Hour</h2>
            <h2 className="text-xl font-semibold underline text-black">Total</h2>
          </div>
          <div className="grid grid-cols-2 grid-rows-24 justify-items-center grid-flow-col gap-x-2">
            
            {
              queryResults.length>0 ? 
                queryResults.map((qR, index) => <h1 className="text-black" key={index}>{qR.hour}</h1>)
                :twentyFourElements.map((_, index) => <h1 className="text-black" key={index}>{loading? "Loading" : "No data"}</h1>)
            }
            
            {
              queryResults.length>0 ? 
              queryResults.map((qR, index) => <h1 className="text-black" key={index}>${qR.total}</h1>)
              :twentyFourElements.map((_, index) => <h1 className="text-black" key={index}>{loading? "Loading" : "No data"}</h1>)
            }
          </div>
          <Link href={{ pathname: "/analysis"}}>
                <button className="text-lg text-white bg-blue-500 rounded hover:bg-blue-600 px-4 py-2">Go Back</button>
          </Link>
        </div>

        <footer className="w-full bg-blue-500 text-white py-4 mt-4">
          <p className="text-center">© 2025 ShareTea. All rights reserved.</p>
        </footer>
      </div>
    )
}