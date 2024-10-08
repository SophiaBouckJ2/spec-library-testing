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
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [addDisabled, setAddDisabled] = useState(true);
  const [indentRightDisabled, setIndentRightDisabled] = useState(true);
  const [indentLeftDisabled, setIndentLeftDisabled] = useState(true);
  const [deleteDisabled, setDeleteDisabled] = useState(true);
  const [deleteAllDisabled, setDeleteAllDisabled] = useState(true);

  useEffect(() => {
    setIndent(props.indent ? props.indent : 0);
    setContent(props.item.content ? props.item.content : "");
    setType(props.item.type ? props.item.type : "");
    setMarker(props.item.marker ? props.item.marker : "");
    setAddDisabled(props.buttonState.addDisabled);
    setIndentRightDisabled(props.buttonState.indentRightDisabled);
    setIndentLeftDisabled(props.buttonState.indentLeftDisabled);
    setDeleteDisabled(props.buttonState.deleteDisabled);
    setDeleteAllDisabled(props.buttonState.deleteAllDisabled);
  }, [props, props.buttonState]);

  const handleContentChange = (event, item) => {
    setContent(event.target.value);
    props.onContentChangeCallback(event.target.value, item);
  };

  const toggleSubmenu = () => {
    setShowSubmenu(!showSubmenu);
  };

  function handleDeleteAll() {
    setIsPopupVisible(true);
  }

  function confirmDeleteAll() {
    props.deleteAllCallback(props.item);
    setIsPopupVisible(false);
  }

  function cancelDeleteAll() {
    setIsPopupVisible(false);
  }

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
                <button
                  className="SpecLibraryFormListElementSubmenuNavigationButton"
                  onClick={() => {
                    setShowSubmenu(false);
                    handleDeleteAll();
                  }}
                  disabled={deleteAllDisabled}
                >
                  Delete All
                </button>
              </div>
            )}
          </div>
          <div className="tooltip">
            <button
              className="SpecLibraryFormListElementNavigationButton"
              onClick={() => props.deleteOneCallback(props.item)}
              disabled={deleteDisabled}
            >
              <img src={delete_one} alt="delete_one" />
            </button>
            <span className="tooltip-text">Delete</span>
          </div>
          <div className="tooltip">
            <button
              className="SpecLibraryFormListElementNavigationButton GrayedOut"
              onClick={() => props.indentCallback("left", props.item)}
              disabled={indentLeftDisabled}
            >
              <img src={move_left} alt="move_left" />
            </button>
            <span className="tooltip-text">Indent Left</span>
          </div>
          <div className="tooltip">
            <button
              className="SpecLibraryFormListElementNavigationButton GrayedOut"
              onClick={() => props.indentCallback("right", props.item)}
              disabled={indentRightDisabled}
            >
              <img src={move_right} alt="move_right" />
            </button>
            <span className="tooltip-text">Indent Right</span>
          </div>
          <div className="tooltip">
            <button
              className="SpecLibraryFormListElementNavigationButton"
              onClick={() => props.addCallback(props.item)}
              disabled={addDisabled}
            >
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
            onChange={(event) => handleContentChange(event, props.item)}
          />
        </div>
      </div>
      {isPopupVisible && (
        <div className="SpecLibraryFormListElementPopup">
          <div className="SpecLibraryFormListElementPopupContent">
            <div className="SpecLibraryFormListElementPopupMessage">
              Are you sure you want to delete this element and all it's children
              elements?
            </div>
            <div className="SpecLibraryFormListElementPopupButtonGroup">
              <button
                className="SpecLibraryFormListElementPopupButton"
                onClick={cancelDeleteAll}
              >
                Cancel
              </button>
              <button
                className="SpecLibraryFormListElementPopupButton"
                onClick={confirmDeleteAll}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpecLibraryFormListElement;
