import React, { useEffect } from "react";

function Suggestions({word}) {
  const [suggestions, setSuggestions] = React.useState([]);

  let arrSuggestions = [];

  async function getRhymes(word) {
    // const lastWord = transcript.split(" ").at(-1);
    // //if the transcript has ever read in the current word
    // console.log(rhymeSuggestions);
    // console.log('im straight', transcript.split(" ").slice(0, -1), lastWord);

    /*
    if (totalTranscript.slice(0, -1).includes(word)) {
      console.log("IM GAY.")
      rhymeSuggestions[word] += 5;
    } else {
      rhymeSuggestions[word] = 0;
    }
     */
    fetch("https://api.datamuse.com/words?rel_rhy=" + word)
      .then((response) => response.json())
      .then((data) =>
        data
          // .slice(rhymeSuggestions[lastWord], rhymeSuggestions[lastWord] + 5)
          .map((suggestion) => {
            setSuggestions((prev) => [...prev, suggestion.word]);
            // arrSuggestions.push(suggestion.word);
          })
      );
  }


  useEffect(() => {
    getRhymes(word);
    // const updatedArray = [arrSuggestions.0, arrSuggestions[1], arrSuggestions[2], arrSuggestions[3], arrSuggestions[4]];
    console.log(arrSuggestions);
    // console.log('updatedArray', updatedArray);
    // setSuggestions(updatedArray);
  }, []);

  return (
    <div>
      <h1>{word}</h1>
      {suggestions.slice(0, 5).map(suggestion => <div style={{textAlign: 'left'}}>{suggestion}</div>)}
    </div>
  );
}

export default Suggestions;
