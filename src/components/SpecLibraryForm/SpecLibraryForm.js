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

const SpecLibraryDummyData = [
  {
    type: "title",
    content: "test default value",
    subList: null,
  },
  {
    type: "subTitle",
    content: "test default value",
    subList: null,
  },
  {
    type: "partHeading",
    content: "test default value",
    subList: [
      {
        type: "sectionHeading",
        content: "test default value",
        subList: [
          {
            type: "subsection",
            content: "test default value",
            subList: [
              {
                type: "subsectionList",
                content: "test default value",
                subList: [
                  {
                    type: "subsectionListDetails",
                    content: "test default value",
                    subList: [
                      {
                        type: "subSubsectionListDetails",
                        content: "test default value",
                        subList: null,
                      },
                    ],
                  },
                ],
              },
              {
                type: "subsectionList",
                content: "test default value",
                subList: null,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    type: "endOfSection",
    content: "test default value",
    subList: null,
  },
];

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

  function getIndentAmount(type) {
    switch (type) {
      case "title":
        return 0;
      case "subTitle":
        return 0;
      case "partHeading":
        return 1;
      case "sectionHeading":
        return 2;
      case "subsection":
        return 3;
      case "subsectionList":
        return 4;
      case "subsectionListDetails":
        return 5;
      case "subSubsectionListDetails":
        return 6;
      case "endOfSection":
        return 0;
      default:
        return 0;
    }
  }

  const renderList = (items) => {
    return items.map((item, index) => {
      const commonProps = {
        key: index,
        type: item.type,
        content: item.content,
      };

      if (
        item.type === "title" ||
        item.type === "subTitle" ||
        item.type === "endOfSection"
      ) {
        return <SpecLibraryFormTextElement {...commonProps} />;
      } else {
        if (item.subList === null) {
          return <SpecLibraryFormListElement {...commonProps} />;
        } else {
          return (
            <div>
              <SpecLibraryFormListElement
                indent={getIndentAmount(item.type)}
                {...commonProps}
              />
              <div>{renderList(item.subList)}</div>
            </div>
          );
        }
      }
    });
  };

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
        {renderList(SpecLibraryDummyData)}
      </div>
    </div>
  );
};

// EXPORT
export default SpecLibraryForm;
