// DEPENDENCIES
import React, { useState, useEffect } from "react";

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

const SpecLibraryListTypes = [
  "partHeading",
  "sectionHeading",
  "subsection",
  "subsectionList",
  "subsectionListDetails",
  "subSubsectionListDetails",
];

// OTHER

// REACT COMPONENT
const SpecLibraryForm = (props) => {
  // STATES
  const [data, setData] = useState([]);

  // CONTEXT

  // USE EFFECT
  useEffect(() => {
    setData(props.data);
  }, []);

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

  function getListMarker(type, index, parentIndex = 1) {
    switch (type) {
      case "title": // Title
        return "Title";
      case "subTitle": // Subtitle
        return "Subtitle";
      case "partHeading": // PART 1.
        return `PART ${index + 1}.`;
      case "sectionHeading": // 1.1
        return `${parentIndex - 2}.${index + 1}`;
      case "subsection": // A.
        return `${String.fromCharCode(65 + index)}.`;
      case "subsectionList": // 1.
        return `${index + 1}.`;
      case "subsectionListDetails": // a.
        return `${String.fromCharCode(97 + index)}.`;
      case "subSubsectionListDetails": // 1)
        return `${index + 1})`;
      case "endOfSection": // End of Section
        return "End of Section";
      default:
        return "";
    }
  }

  function renderList(data) {
    return data.map((item, index) => {
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
            marker={item.marker}
            type={item.type}
          />
        );
      } else {
        currentItem = (
          <SpecLibraryFormListElement
            key={index}
            indent={getIndentAmount(item.type)}
            content={item.content}
            marker={item.marker}
            type={item.type}
            indentCallback={indentCallback}
          />
        );
      }

      // Render the sublist if it exists
      let renderedSubList = null;
      if (item.subList) {
        renderedSubList = renderList(item.subList);
      }

      return (
        <React.Fragment key={index}>
          {currentItem}
          {renderedSubList}
        </React.Fragment>
      );
    });
  }

  function findItemAndParentList(marker, list, depth = 0) {
    for (let item of list) {
      if (item.marker === marker) {
        return { parentList: list, item, depth };
      }
      if (item.subList) {
        depth++;
        const result = findItemAndParentList(marker, item.subList, depth);
        if (result) {
          return result;
        }
      }
    }
    return null;
  }

  function doesListItemHaveSibling(marker, list = data) {
    // Find the item and its parent list
    const result = findItemAndParentList(marker, list);

    if (!result) {
      console.error("Item not found");
      return false;
    }

    const { parentList, item } = result;

    // Check if there are other items in the same list
    return parentList.length > 1;
  }

  // Helper function to update the data with the modified parent list
  function updateDataWithNewList(currentData, modifiedList) {
    for (let i = 0; i < currentData.length; i++) {
      const item = currentData[i];

      // If we find the list that matches, replace it
      if (item.subList === modifiedList) {
        currentData[i] = { ...item, subList: modifiedList };
        return;
      }

      // Recursively check if the item's subList contains the modified list
      if (item.subList) {
        updateDataWithNewList(item.subList, modifiedList);
      }
    }
  }

  function indentCallback(indent, direction, marker, type) {
    console.log("Indent Callback: ", indent, direction, marker, type);

    const { parentList, item, depth } = findItemAndParentList(marker, data);
    const currentIndex = parentList.indexOf(item);
    let currentItem = item;

    if (
      direction === "right" &&
      doesListItemHaveSibling(marker) &&
      type !== "subSubsectionListDetails"
    ) {
      console.log("valid right indentation");

      console.log("Parent List: ", parentList);
      console.log("Item ", item);
      console.log("Depth: ", depth);
      console.log("Current Index: ", currentIndex);

      if (item.subList === null) {
        console.log("Item has no sublist");
        let nextType =
          SpecLibraryListTypes[SpecLibraryListTypes.indexOf(type) + 1];
        let markerIndex = 0;
        if (parentList[currentIndex - 1].subList) {
          markerIndex = parentList[currentIndex - 1].subList.length;
        }
        let nextMarker = getListMarker(nextType, markerIndex, currentIndex);

        currentItem.subList = null;
        currentItem.type = nextType;
        currentItem.marker = nextMarker;

        parentList.splice(currentIndex, 1);

        if (parentList[currentIndex - 1].subList) {
          parentList[currentIndex - 1].subList = [
            ...parentList[currentIndex - 1].subList,
            currentItem,
          ];
        } else {
          parentList[currentIndex - 1].subList = [currentItem];
        }
        console.log("Changed Parent List: ", parentList);

        // Update the data state with the modified parentList
        const updatedData = [...data];
        updateDataWithNewList(updatedData, parentList);

        // Set the updated data state
        setData(updatedData);
        return;
      } else {
        console.log("Item has a sublist");
        // add current item at end of its own sublist (only one level down)
        // add this sublist to the end of the next available siblings sublist
      }
      return;
    }
  }

  // RENDER
  return (
    <div className="SpecLibraryForm">
      {console.log("Data: ", data)}
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
      <div className="SpecLibraryFormContainer">{renderList(props.data)}</div>
    </div>
  );
};

// EXPORT
export default SpecLibraryForm;
