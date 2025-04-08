'use client'
import React, {useEffect, useState, Suspense} from 'react'
import Link from 'next/link'

export default function analysisPage()
{
    return(
      <div className = "grid gap-y-2 justify-items-center">
        <Link href={{ pathname: "/analysis/xReport"}}>
              <button className="text-lg text-white bg-blue-500 rounded hover:bg-blue-600 px-4 py-2">Generate XReport</button>
        </Link>
        <Link href={{ pathname: "/analysis/zReport"}}>
              <button className="text-lg text-white bg-blue-500 rounded hover:bg-blue-600 px-4 py-2">Generate ZReport</button>
        </Link>
      </div>
    )
}