import React, { useState, useEffect } from "react";
import "./SpecLibraryFormListElement.css";

import menu from "../../../Assets/menu.png";
import delete_one from "../../../Assets/delete_one.png";
import move_left from "../../../Assets/move_left.png";
import move_right from "../../../Assets/move_right.png";
import add_new from "../../../Assets/add_new.png";

const SpecLibraryFormListElement = (props) => {
  const [indent, setIndent] = useState(0);
  const [content, setContent] = useState("");
  const [type, setType] = useState("");
  const [marker, setMarker] = useState("");
  const [showSubmenu, setShowSubmenu] = useState(false);

  useEffect(() => {
    setIndent(props.indent ? props.indent : 0);
    setContent(props.content ? props.content : "");
    setType(props.type ? props.type : "");
    setMarker(props.marker ? props.marker : "");
  }, [props]);

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const toggleSubmenu = () => {
    setShowSubmenu(!showSubmenu);
  };

  return (
    <div className="SpecLibraryFormListElement">
      <div className="SpecLibraryFormListElementNavigation">
        <div className="SpecLibraryFormListElementNavigationButtonGroup">
          <div className="tooltip">
            <button
              className="SpecLibraryFormListElementNavigationButton"
              onClick={toggleSubmenu}
            >
              <img src={menu} alt="menu" />
            </button>
            {showSubmenu && (
              <div className="SpecLibraryFormListElementSubmenu">
                <button className="SpecLibraryFormListElementSubmenuNavigationButton">
                  Delete All
                </button>
                <button className="SpecLibraryFormListElementSubmenuNavigationButton">
                  Undo Indents
                </button>
              </div>
            )}
          </div>
          <div className="tooltip">
            <button className="SpecLibraryFormListElementNavigationButton">
              <img src={delete_one} alt="delete_one" />
            </button>
            <span className="tooltip-text">Delete</span>
          </div>
          <div className="tooltip">
            <button
              className="SpecLibraryFormListElementNavigationButton GrayedOut"
              onClick={() =>
                props.indentCallback(
                  props.indent,
                  "left",
                  props.marker,
                  props.type
                )
              }
              // disabled={indent === 0}
            >
              <img src={move_left} alt="move_left" />
            </button>
            <span className="tooltip-text">Indent Left</span>
          </div>
          <div className="tooltip">
            <button
              className="SpecLibraryFormListElementNavigationButton GrayedOut"
              onClick={() =>
                props.indentCallback(
                  props.indent,
                  "right",
                  props.marker,
                  props.type
                )
              }
              // disabled={indent === 5 || marker === "PART 1."}
            >
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
        <div className="SpecLibraryFormListElementMarker">{marker}</div>
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

export default SpecLibraryFormListElement;
