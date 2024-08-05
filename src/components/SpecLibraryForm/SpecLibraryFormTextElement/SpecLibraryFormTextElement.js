// DEPENDENCIES
import React, { useState, useEffect, useContext } from "react";

// CSS
import "./SpecLibraryFormTextElement.css";

import delete_one from "../../../Assets/delete_one.png";
import add_new from "../../../Assets/add_new.png";

// REACT COMPONENT
const SpecLibraryFormTextElement = (props) => {
  let [content, setContent] = useState("");
  let [type, setType] = useState("");

  // USE EFFECT
  useEffect(() => {
    setContent(props.content ? props.content : "");
    setType(props.type ? props.type : "");
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
      <div className="SpecLibraryFormTextElementNavigation">
        <div className="tooltip">
          <button className="SpecLibraryFormTextElementNavigationButton">
            <img src={delete_one} alt="delete_one" />
          </button>
          <span className="tooltip-text">Delete</span>
        </div>
        <div className="tooltip">
          <button className="SpecLibraryFormTextElementNavigationButton">
            <img src={add_new} alt="add_new" />
          </button>
          <span className="tooltip-text">Add</span>
        </div>
      </div>
      <div className="SpecLibraryFormTextElementContent">
        <div className="SpecLibraryFormTextElementMarker">{type}</div>
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
