import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  // Define all the necessary state variables using the useState hook
  const [submittedInput, setSubmittedInput] = useState("");
  const [userInput, setuserInput] = useState("");
  const [promptTokens, setPromptTokens] = useState("");
  const [result, setResult] = useState("");
  const [completionTokens, setCompletionTokens] = useState("");
  const [image, setImage] = useState("");

  async function onSubmit(event) {
    // This function will be called when the user submits the form
    event.preventDefault(); // prevent the default form submission behavior

    try {
      // Send a POST request to the API with user input as request body
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userInput: userInput }),
      });

      // Parse the response JSON data
      const data = await response.json();

      // Check if the response is successful
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      // If the response is successful, update the state variables
      setSubmittedInput(userInput);
      setuserInput("");
      setPromptTokens(data.info.prompt_tokens);
      setResult(data.result);
      setCompletionTokens(data.info.completion_tokens);
      setImage(data.image);
    } catch(error) {
      // If there is an error, log it to the console and show an alert to the user
      console.error(error);
      alert(error.message);
    }
  }
  return (
    <div className={styles.body}>
      <Head>
        <title>OpenAI - Testing</title>
        <link rel="icon" href="/chatGPT_icon.png" />
      </Head>

      <main className={styles.main}>
        <img src="/logo.jpeg" className={styles.icon} />
        <h1>api.openai.com - Testing</h1>
        <info className={styles.info}>
          model: <a target="_blank" href="https://platform.openai.com/docs/models/overview" className={styles.a}>gpt-3.5-turbo</a>,
          temperature: 0.6, max_tokens: 4000,
          images:  <a target="_blank" href="https://labs.openai.com/" className={styles.a}>DALL·E</a>
        </info>
        <p></p>
        {result && ( // Display the result if available
          <div className={styles.wrapper}>
            <div className={styles.speechbubble}>
              <p>
                {submittedInput}
                <span className={styles.username}>promptTokens: {promptTokens}</span>
              </p>
            </div>

            <div className={styles.speechbubble}>
              <p>
                {result.replace(/^(\n\n)/, '')}
                <span className={styles.username}>completionTokens: {completionTokens}</span>
              </p>
            </div>
            <div className={styles.imageContainer}>
              {image.map((url, index) => (
                <img key={index} src={url} alt="Image" className={styles.image} style={{ margin: "5px" }} />
              ))}
            </div>
          </div>

        )}
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="userInput"
            placeholder="Enter your question"
            value={userInput}
            onChange={(e) => setuserInput(e.target.value)}
          />
          <info className={styles.info} style={{ display: "flex", justifyContent: "center" }}>source code: <a target="_blank" href="https://github.com/Seevenup83/openAI" className={styles.a}>github</a></info>
        </form>
      </main>
    </div>
  );
}
