// DEPENDENCIES
import React, { useState, useEffect, useContext } from "react";

// CSS
import "./SpecLibraryForm.css";
import undo from "../../Assets/undo.png";
import redo from "../../Assets/redo.png";
import save from "../../Assets/save.png";
import SpecLibraryFormListElement from "./SpecLibraryFormListElement/SpecLibraryFormListElement";
import SpecLibraryFormTextElement from "./SpecLibraryFormTextElement/SpecLibraryFormTextElement";

// MUI ICONS

// CUSTOM COMPONENTS

// CONSTANTS

// OTHER

// REACT COMPONENT
const SpecLibraryForm = (props) => {
  // STATES

  // CONTEXT

  // USE EFFECT
  useEffect(() => {}, []);

  // INPUT HANDLERS

  // API FUNCTIONS

  // HELPER FUNCTIONS

  // RENDER
  return (
    <div className="SpecLibraryForm">
      <div className="SpecLibraryFormHeader">
        <div className="SpecLibraryFormHeaderTitle">Spec Library Form</div>
        <div className="SpecLibraryFormHeaderButtonGroup">
          <button className="SpecLibraryFormHeaderButton">
            <img src={undo} alt="undo" />
          </button>
          <button className="SpecLibraryFormHeaderButton">
            <img src={redo} alt="redo" />
          </button>
          <button className="SpecLibraryFormHeaderButton">
            <img src={save} alt="save" />
          </button>
        </div>
      </div>
      <div className="SpecLibraryFormContainer">
        <SpecLibraryFormTextElement type={"Title"} />
        <SpecLibraryFormTextElement type={"Sub-Title"} />
        <SpecLibraryFormListElement
          indent={0}
          type={"PART 1 - "}
          content={"test default value"}
        />
        <SpecLibraryFormListElement indent={1} type={"1.1 "} />
        <SpecLibraryFormListElement indent={2} type={"A. "} />
        <SpecLibraryFormListElement indent={3} type={"1. "} />
        <SpecLibraryFormListElement indent={4} type={"a. "} />
        <SpecLibraryFormListElement indent={5} type={"1) "} />
        <SpecLibraryFormListElement indent={2} type={"B. "} />
        <SpecLibraryFormTextElement type={"End of Section"} />

        {/* map through eventual datastructure of list fields etc */}
        {/* title, subtitle, dynamic list fields in between, and end of page */}
      </div>
    </div>
  );
};

// EXPORT
export default SpecLibraryForm;
