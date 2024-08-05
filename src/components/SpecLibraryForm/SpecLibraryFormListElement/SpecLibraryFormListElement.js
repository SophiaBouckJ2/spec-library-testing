// DEPENDENCIES
import React, { useState, useEffect, useContext } from "react";

// CSS
import "./SpecLibraryFormListElement.css";

import delete_all from "../../../Assets/delete_all.png";
import delete_one from "../../../Assets/delete_one.png";
import move_atw_left from "../../../Assets/move_atw_left.png";
import move_left from "../../../Assets/move_left.png";
import move_right from "../../../Assets/move_right.png";
import add_new from "../../../Assets/add_new.png";

// REACT COMPONENT
const SpecLibraryFormListElement = (props) => {
  let [indent, setIndent] = useState(0);
  let [content, setContent] = useState("");
  let [type, setType] = useState("");

  // USE EFFECT
  useEffect(() => {
    setIndent(props.indent ? props.indent : 0);
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
    <div className="SpecLibraryFormListElement">
      <div className="SpecLibraryFormListElementNavigation">
        <div className="SpecLibraryFormListElementNavigationButtonGroup">
          <div className="tooltip">
            <button className="SpecLibraryFormListElementNavigationButton">
              <img src={delete_all} alt="delete_all" />
            </button>
            <span className="tooltip-text">Delete All</span>
          </div>
          <div className="tooltip">
            <button className="SpecLibraryFormListElementNavigationButton">
              <img src={delete_one} alt="delete_one" />
            </button>
            <span className="tooltip-text">Delete</span>
          </div>
          <div className="tooltip">
            <button className="SpecLibraryFormListElementNavigationButton">
              <img src={move_atw_left} alt="move_atw_left" />
            </button>
            <span className="tooltip-text">Undo Indents</span>
          </div>
          <div className="tooltip">
            <button className="SpecLibraryFormListElementNavigationButton">
              <img src={move_left} alt="move_left" />
            </button>
            <span className="tooltip-text">Indent Left</span>
          </div>
          <div className="tooltip">
            <button className="SpecLibraryFormListElementNavigationButton">
              <img src={move_right} alt="move_right" />
            </button>
            <span className="tooltip-text">Indent Right</span>
          </div>
          <div className="tooltip">
            <button className="SpecLibraryFormListElementNavigationButton">
              <img src={add_new} alt="add_new" />
            </button>
            <span className="tooltip-text">Add</span>
          </div>
        </div>
      </div>
      {Array.from({ length: indent }).map((_, index) => (
        <div key={index} className="SpecLibraryFormListElementLineBox"></div>
      ))}
      <div className="SpecLibraryFormListElementContent">
        <div className="SpecLibraryFormListElementMarker">{type}</div>
        <div className="SpecLibraryFormListElementContentEditable">
          <textarea
            className="SpecLibraryFormListElementContentEditableInput"
            rows="2"
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
export default SpecLibraryFormListElement;
