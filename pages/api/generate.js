import { Configuration, OpenAIApi } from "openai";

const openaiConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(openaiConfig);

export default async function (req, res) {
  if (!openaiConfig.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const userInput = req.body.userInput || '';
  if (userInput.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid question",
      }
    });
    return;
  }

  try {
    // Chat - API call
    const chatCompletionResult = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {"role": "system", "content": "You are ChatGPT, a large language model trained by OpenAI. Answer as concisely as possible."},
        {"role": "user", "content": generatePrompt(userInput)},
      ],
      temperature: 0.6,
      max_tokens: 4000,
    });

    // Images - API call
    const imageResult = await openai.createImage({
      prompt: "An expressive oil painting, depicted as an explosion of a nebula, " + chatCompletionResult.data.choices[0].message.content,

      n: 3,
      size: "256x256",
    });

    const { content } = chatCompletionResult.data.choices[0].message;
    const { usage } = chatCompletionResult.data;
    const { data } = imageResult.data;
    res.status(200).json({ result: content, info: usage, image: data.map(({ url }) => url)});

  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(userInput) {
  const capitalizeduserInput = userInput[0].toUpperCase() + userInput.slice(1).toLowerCase();
  return `${capitalizeduserInput}`;
}
