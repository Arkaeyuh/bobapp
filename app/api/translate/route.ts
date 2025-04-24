import { NextResponse } from "next/server";
import { Translator } from "google-translate-api-x";

export async function GET(request: Request) {
  // The comment in the catch block explains reasoning for triedOnce and the while loop
  let triedOnce = false
  while(true) {
    try {
      // Grab some params from the URL
      const { searchParams } = new URL(request.url);
      const JSONStringArray = searchParams.get("stringArray")
      const languageTo = searchParams.get("langTo")
      const languageFrom = searchParams.get("langFrom")
      
      // If the URL was passed in correctly, all of these should not be undefined
      if(JSONStringArray && languageTo && languageFrom)
      {
        // console.log(languageTo + " "+languageFrom)
        const stringArray:string[] = JSON.parse(JSONStringArray);
        // console.log(stringArray)
        
        // Calling the API
        const translator = new Translator({from: languageFrom, to: languageTo, forceBatch: false});
        const translatedResult = await translator.translate(stringArray);
        
        // Appending result from the API to a string array
        let translatedStringArray:string[] = []
        for(let i=0; i<translatedResult.length;i++) {
            translatedStringArray.push(translatedResult[i].text)
        }
        // console.log(translatedStringArray)
        
        return NextResponse.json({ success: true, result:translatedStringArray});
      }
      throw Error("URL passed to translate function is invalid")
    } catch (error) {
      // Are basically giving the google translate another try to work if encounter an error. 
      // Sometimes the first time try to do a translation will timeout, and this fixes that.
      if(!triedOnce) {
        triedOnce=true
        continue
      }
      console.error("Error translating page:", error);
      return NextResponse.json({ success: false, error: "Failed to translate" }, { status: 500 });
    }
  }
}