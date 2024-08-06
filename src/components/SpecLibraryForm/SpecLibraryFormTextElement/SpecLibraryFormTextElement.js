// DEPENDENCIES
import React, { useState, useEffect, useContext } from "react";

// CSS
import "./SpecLibraryFormTextElement.css";

// REACT COMPONENT
const SpecLibraryFormTextElement = (props) => {
  let [content, setContent] = useState("");
  let [type, setType] = useState("");
  let [marker, setMarker] = useState("");

  // USE EFFECT
  useEffect(() => {
    setContent(props.content ? props.content : "");
    setType(props.type ? props.type : "");
    setMarker(props.marker ? props.marker : "");
  }, [props]);

  // INPUT HANDLERS

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  // API FUNCTIONS

  // HELPER FUNCTIONS

  // RENDER
  return (
    <div className="SpecLibraryFormTextElement">
      <div className="SpecLibraryFormTextElementContent">
        <div className="SpecLibraryFormTextElementMarker">{marker}</div>
        <div className="SpecLibraryFormTextElementContentEditable">
          <textarea
            className="SpecLibraryFormTextElementContentEditableInput"
            rows="1"
            placeholder="Type here..."
            value={content}
            onChange={handleContentChange}
          />
        </div>
      </div>
    </div>
  );
};

// EXPORT
export default SpecLibraryFormTextElement;
