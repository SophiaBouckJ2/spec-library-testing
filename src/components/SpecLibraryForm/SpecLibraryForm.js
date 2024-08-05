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
                      {
                        type: "subSubsectionListDetails",
                        content: "test default value",
                        subList: null,
                      },
                    ],
                  },
                  {
                    type: "subsectionListDetails",
                    content: "test default value",
                    subList: null,
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
    subsectionListIndex,
    subSectionListDetailsIndex,
    subSubsectionListDetailsIndex
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
      case "subsection": // A.
        return `${String.fromCharCode(65 + subsectionIndex)}.`;
      case "subsectionList": // 1.
        return `${subsectionListIndex + 1}.`;
      case "subsectionListDetails": // a.
        return `${String.fromCharCode(97 + subSectionListDetailsIndex)}.`;
      case "subSubsectionListDetails": // 1)
        return `${subSubsectionListDetailsIndex + 1})`;
      default:
        return "";
    }
  }

  function renderList(
    items,
    partHeadingIndex,
    sectionHeadingIndex = 0,
    subsectionIndex = 0,
    subsectionListIndex = 0,
    subSectionListDetailsIndex = 0,
    subSubsectionListDetailsIndex = 0
  ) {
    return items.map((item, index) => {
      const marker = getListMarker(
        item.type,
        partHeadingIndex,
        sectionHeadingIndex,
        subsectionIndex,
        subsectionListIndex,
        subSectionListDetailsIndex,
        subSubsectionListDetailsIndex
      );

      let currentItem = null;

      if (
        item.type === "title" ||
        item.type === "subTitle" ||
        item.type === "endOfSection"
      ) {
        currentItem = (
          <SpecLibraryFormTextElement
            key={index}
            content={item.content}
            type={item.type}
          />
        );
      } else {
        currentItem = (
          <SpecLibraryFormListElement
            key={index}
            indent={getIndentAmount(item.type)}
            content={item.content}
            type={marker}
          />
        );
      }

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
              0,
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
              0,
              0,
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
              subsectionListIndex,
              0,
              0
            );
            break;
          case "subsectionListDetails":
            subSectionListDetailsIndex++;
            renderedSubList = renderList(
              item.subList,
              partHeadingIndex,
              sectionHeadingIndex,
              subsectionIndex,
              subsectionListIndex,
              subSectionListDetailsIndex,
              0
            );
            break;
          case "subSubsectionListDetails":
            subSubsectionListDetailsIndex++;
            renderedSubList = renderList(
              item.subList,
              partHeadingIndex,
              sectionHeadingIndex,
              subsectionIndex,
              subsectionListIndex,
              subSectionListDetailsIndex,
              subSubsectionListDetailsIndex
            );
          default:
            break;
        }
      } else {
        switch (item.type) {
          case "partHeading":
            partHeadingIndex++;
            break;
          case "sectionHeading":
            sectionHeadingIndex++;
            break;
          case "subsection":
            subsectionIndex++;
            break;
          case "subsectionList":
            subsectionListIndex++;
            break;
          case "subsectionListDetails":
            subSectionListDetailsIndex++;
            break;
          case "subSubsectionListDetails":
            subSubsectionListDetailsIndex++;
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
        {renderList(SpecLibraryDummyData, 0, 0, 0, 0, 0, 0)}
      </div>
    </div>
  );
};

// EXPORT
export default SpecLibraryForm;
