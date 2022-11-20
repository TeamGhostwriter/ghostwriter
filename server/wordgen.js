const cohere = require("cohere-ai")

cohere.init("api_key");

cohere.init("api_key", "2021-11-08");

cohere.generate("generation", config);

(async () => {
  cohere.init(process.env.COHERE_API_KEY);

  // Hit the `generate` endpoint on the `large` model
  const generateResponse = await cohere.generate({
    model: "large",
    prompt:
      "This program will take words as input and produce 5 words that rhyme with the input word.\
       Input: great\
       Output: fate, late, mate, plate, state\
       Input: happy\
       Output: bappy, crappy, dappy, flappy, nappy\
       Input: sad\
       Output: bad, glad, mad, pad, rad\
       Input:" + transcript + "\
       Output:",
    max_tokens: 50,
    temperature: 1,
  });

  /*
  {
    statusCode: 200,
    body: {
      text: "Eldorado, the anointed monarchs of the ancient world and the ruling family were divided into three kingdoms, each of which was ruled by an individual leader."
    }
  }
  */
})();