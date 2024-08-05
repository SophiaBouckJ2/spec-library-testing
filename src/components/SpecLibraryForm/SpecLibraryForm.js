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
                subList: null,
              },
              {
                type: "subsectionList",
                content: "test default value",
                subList: null,
              },
            ],
          },
          {
            type: "subsection",
            content: "test default value",
            subList: null,
          },
        ],
      },
      {
        type: "sectionHeading",
        content: "test default value",
        subList: null,
      },
    ],
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
            subList: null,
          },
          {
            type: "subsection",
            content: "test default value",
            subList: null,
          },
        ],
      },
      {
        type: "sectionHeading",
        content: "test default value",
        subList: null,
      },
    ],
  },
  {
    type: "endOfSection",
    content: "endOfSection test default value",
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
      case "sectionHeading":
        return 1;
      case "subsection":
        return 2;
      case "subsectionList":
        return 3;
      case "subsectionListDetails":
        return 4;
      case "subSubsectionListDetails":
        return 5;
      default:
        return 0;
    }
  }

  function getListMarker(
    type,
    partHeadingIndex,
    sectionHeadingIndex,
    subsectionIndex,
    subsectionListIndex
  ) {
    switch (type) {
      case "title": // Title
        return "Title";
      case "subTitle": // Subtitle
        return "Subtitle";
      case "partHeading": // PART 1.
        return `PART ${partHeadingIndex + 1}.`;
      case "sectionHeading": // 1.1
        return `${partHeadingIndex}.${sectionHeadingIndex + 1}`;
      case "subsection": // a.
        return `${String.fromCharCode(97 + subsectionIndex)}.`;
      case "subsectionList": // 1.
        return `${subsectionListIndex + 1}.`;
      default:
        return "";
    }
  }

  function renderList(
    items,
    partHeadingIndex,
    sectionHeadingIndex = 0,
    subsectionIndex = 0,
    subsectionListIndex = 0
  ) {
    return items.map((item, index) => {
      const marker = getListMarker(
        item.type,
        partHeadingIndex,
        sectionHeadingIndex,
        subsectionIndex,
        subsectionListIndex
      );

      console.log("item", item, "marker", marker);

      // Render the current item
      const currentItem = (
        <div
          key={index}
          style={{ paddingLeft: getIndentAmount(item.type) * 20 }}
        >
          {marker} {item.content}
        </div>
      );

      // Render the sublist if it exists
      let renderedSubList = null;
      if (item.subList) {
        switch (item.type) {
          case "partHeading":
            partHeadingIndex++;
            renderedSubList = renderList(
              item.subList,
              partHeadingIndex,
              0,
              0,
              0
            );
            break;
          case "sectionHeading":
            sectionHeadingIndex++;
            renderedSubList = renderList(
              item.subList,
              partHeadingIndex,
              sectionHeadingIndex,
              0,
              0
            );
            break;
          case "subsection":
            subsectionIndex++;
            renderedSubList = renderList(
              item.subList,
              partHeadingIndex,
              sectionHeadingIndex,
              subsectionIndex,
              0
            );
            break;
          case "subsectionList":
            subsectionListIndex++;
            renderedSubList = renderList(
              item.subList,
              partHeadingIndex,
              sectionHeadingIndex,
              subsectionIndex,
              subsectionListIndex
            );
            break;
          default:
            break;
        }
      }

      return (
        <React.Fragment key={index}>
          {currentItem}
          {renderedSubList}
        </React.Fragment>
      );
    });
  }

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
        {renderList(SpecLibraryDummyData, 0, 0, 0)}
      </div>
    </div>
  );
};

// EXPORT
export default SpecLibraryForm;
