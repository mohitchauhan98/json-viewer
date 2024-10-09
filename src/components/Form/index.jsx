import React, { useState } from "react";
import "./index.css";
import { marked } from "marked";

const Form = () => {
  const [inputValue, setInputValue] = useState("");
  const [jsonData, setJsonData] = useState("");
  const [renderedOutput, setRenderedOutput] = useState("");
  const [outputFormat, setOutputFormat] = useState("html");
  const [statusMessage, setStatusMessage] = useState("");

  const handleGetRequest = async () => {
    try {
      const response = await fetch(inputValue);
      const data = await response.json();
      const jsonDataString = JSON.stringify(data, null, 2);
      setJsonData(jsonDataString);
      setStatusMessage("Data fetched successfully!");
    } catch (err) {
      setStatusMessage(
        "Error: Unable to fetch data from the provided endpoint"
      );
      console.log(err);
    }
  };

  const handleRender = () => {
    try {
      const parsedJson = JSON.parse(jsonData);

      if (outputFormat === "html") {
        if (Array.isArray(parsedJson)) {
          const htmlContent = parsedJson
            .map((user) => {
              return `
                <div class="user-card">
                  <h2>${user.name}</h2>
                  <p><strong>Email:</strong> ${user.email}</p>
                  <p><strong>Username:</strong> ${user.username}</p>
                  <p><strong>Phone:</strong> ${user.phone}</p>
                </div>
              `;
            })
            .join("");

          setRenderedOutput(htmlContent);
        } else {
          setStatusMessage(
            "Error: Expected an array of users, but received an object"
          );
        }
      } else if (outputFormat === "markdown") {
        const markdownContent = parsedJson
          .map(
            (user) =>
              `## ${user.name}\n- **Email**: ${user.email}\n- **Username**: ${user.username}\n- **Phone**: ${user.phone}\n- **Website**: [${user.website}](http://${user.website})\n- **Company**: ${user.company.name}\n- **Address**: ${user.address.street}, ${user.address.city}`
          )
          .join("\n\n");
        const htmlFromMarkdown = marked(markdownContent);
        setRenderedOutput(htmlFromMarkdown);
      }

      setStatusMessage("Rendered successfully!");
    } catch (error) {
      setStatusMessage("Error: Invalid JSON format");
      console.error(error);
    }
  };

  return (
    <>
      <div className="form">
        <div className="heading">
          <h1>API JSON Viewer.</h1>
        </div>
        <div className="form-container">
          <div>
            <label>Api Endpoint : </label>
            <div className="form-input">
              <input
                type="text"
                placeholder="Enter API Endpoint URL"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button onClick={handleGetRequest}>GET</button>
            </div>
            <div className="form-text">
              <textarea
                placeholder="JSON data will appear here..."
                value={jsonData}
              />
            </div>
          </div>
          <div>
            <label>Output Format : </label>
            <div className="form-dropdown">
              <select
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value)}
              >
                <option value="html">HTML</option>
                <option value="markdown">Markdown</option>
              </select>
              <button onClick={handleRender}>Convert</button>
            </div>
            <div
              className="rendered-output"
              dangerouslySetInnerHTML={{ __html: renderedOutput }}
            ></div>
          </div>
        </div>
        <div className="status-message">{statusMessage}</div>
      </div>
    </>
  );
};

export default Form;
