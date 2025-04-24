"use client";

export async function translatePage(languageTo:string, languageFrom:string="en", landingPageToEN:boolean=false, haveButton=true) {
  // This only really happens on the landing page if the sessionStorage starts with a language other than english, which only really happens during testing.
  // I kept it because it takes like 0 time and can potentially skip wasteful calls to the API.
  if(languageTo===languageFrom)
    return;

  // This string is a constant used to store every element that can contain text on a page
  let stringOfElementsToSelect = 'p,span,h1,h2,h3,h4,h5,h6,button,label,option'
  if(!haveButton)
    stringOfElementsToSelect = 'p,span,h1,h2,h3,h4,h5,h6,label,option'


  // The landing page can be translated mutliple times, and translating multiple times causes the translations to be very inaccurate. 
  // So I have the hardcoded English values here whenever the customer wants to return to English.
  if(landingPageToEN) {
    // Getting all HTML elements on the current page that have text inside of them
    const everythingInWebpage = document.querySelectorAll(stringOfElementsToSelect);
    const englishStrings = ['Register','Login','Welcome to ShareTea','Click anywhere to get started','🌎Select Language:'
      ,'Chinese', 'English', 'French', 'Japanese', 'Spanish'
    ]
    for(let i=0; i<everythingInWebpage.length;i++) {
      const current = everythingInWebpage[i]
      current.innerHTML=englishStrings[i]
    }
    return;
  }

  // If are on the landing page, would've already translated via the above if statement.
  // All other pages start in English and only translate to a non-English language, so if languageTo = English,
  // can just skip translating because the page is guaranteed to be already in English.
  if(languageTo==='en')
      return;

  try {
    // Getting all HTML elements on the current page that have text inside of them
    const everythingInWebpage = document.querySelectorAll(stringOfElementsToSelect);
    // Adding all of the text to a string array
    let webpageStrings:string[]= []
    for(let i=0; i<everythingInWebpage.length;i++) {
      const current = everythingInWebpage[i]
      webpageStrings.push(current.innerHTML)
    }

    // Passing the string array and requested language to the API
    const response = await fetch(`/api/translate?stringArray=${encodeURIComponent(JSON.stringify(webpageStrings))}&langTo=${languageTo}&langFrom=${languageFrom}`);
    if (!response.ok)
        throw new Error("Failed to translate page"); 
    
    // Getting the translated string array
    const data = await response.json()
    const translatedStringArray = data.result
    
    // Updating text for all HTML elements whose text translated
    for(let i=0; i<everythingInWebpage.length;i++) {
      const current = everythingInWebpage[i]
      current.innerHTML=translatedStringArray[i]
    }
    
  } catch (error) {
    console.error("Error fetching translation:", error);
  }
}