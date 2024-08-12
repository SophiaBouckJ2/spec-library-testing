// DEPENDENCIES
import React, { useState, useEffect } from "react";

// CSS
import "./SpecLibraryFormTextElement.css";

// REACT COMPONENT
const SpecLibraryFormTextElement = (props) => {
  let [content, setContent] = useState("");
  let [type, setType] = useState("");
  let [marker, setMarker] = useState("");

  // USE EFFECT
  useEffect(() => {
    setContent(props.item.content ? props.item.content : "");
    setType(props.item.type ? props.item.type : "");
    setMarker(props.item.marker ? props.item.marker : "");
  }, [props]);

  // INPUT HANDLERS

  const handleContentChange = (event, item) => {
    setContent(event.target.value);
    props.onContentChangeCallback(event.target.value, item);
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
            onChange={(event) => handleContentChange(event, props.item)}
          />
        </div>
      </div>
    </div>
  );
};

// EXPORT
export default SpecLibraryFormTextElement;
