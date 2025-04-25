'use client'
import React, {createContext, useState, useContext, ReactNode} from 'react';
import { useCart} from '@/components/cartContext'

export default function LanguagePicker() {
    const {language, changeLanguage} = useCart()

    function setNewLanguage(event: React.ChangeEvent<HTMLSelectElement >) {
        changeLanguage(event.target.value)
    }

    return (
        // Need the stop propogation because this is used in the landing page where clicking anywhere logs you in as a gust
        <div className="relative flex items-center min-h-1/12 justify-end bg-gray-100" onClick={(e)=>e.stopPropagation()}>
            {/* Drop-down menu to select the language */}
            <label className="text-black" htmlFor="languageToTranslateTo">🌎Select Language:</label>
            <select className="text-black" name="languageToTranslateTo" onChange={setNewLanguage} defaultValue="en">
                <option className="text-black" value="zh-CN">Chinese</option>
                <option className="text-black" value="en">English</option>
                <option className="text-black" value="fr">French</option>
                <option className="text-black" value="ja">Japanese</option>
                <option className="text-black" value="es">Spanish</option>
            </select>
        </div>
    )
 
}