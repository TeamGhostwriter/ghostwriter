import {useEffect, useState} from "react";

function Suggestions({word}) {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    async function getRhymes() {
      console.log('getRhymes works!');
      fetch("https://api.datamuse.com/words?rel_rhy=" + word)
        .then((response) => response.json())
        .then((data) => {
          console.log(data.splice(0, 5).map((word) => word.word), word);
          setSuggestions(data.splice(0, 5).map((word) => word.word));
        });
    }
    getRhymes();
  }, []);

  return (
    <div>
      {suggestions.map((suggestion, index) => {
        return <div key={index} style={{color: 'gray'}}>{suggestion}</div>
      })}
    </div>
  );
}

export default Suggestions;
