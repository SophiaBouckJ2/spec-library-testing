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

  function getListMarker(type, index, parentIndex) {
    switch (type) {
      case "title": // Title
        return "Title";
      case "subTitle": // Subtitle
        return "Subtitle";
      case "partHeading": // PART 1.
        return `PART ${index + 1}.`;
      case "sectionHeading": // 1.1
        return `${parentIndex + 1}.${index + 1}`;
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
      let currentItem;

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
      } else if (item.type !== "list") {
        currentItem = (
          <SpecLibraryFormListElement
            key={index}
            indent={getIndentAmount(item.type)}
            content={item.content}
            marker={item.marker}
            type={item.type}
            relativeIndex={item.relativeIndex}
            indentCallback={indentCallback}
            addCallback={AddCallback}
            deleteAllCallback={DeleteAllCallback}
            deleteOneCallback={deleteOneCallback}
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

  function findItemAndSiblingList(marker, list, depth = 0) {
    for (let item of list) {
      if (item.marker === marker) {
        return { siblingList: list, item, depth };
      }
      if (item.subList) {
        const result = findItemAndSiblingList(marker, item.subList, depth + 1);
        if (result) {
          return result;
        }
      }
    }
    return null;
  }

  function updateSubListsTypesAndMarkers(list, lastType, lastMarker) {
    list.subList = list.subList.map((item, index) => {
      let parent = findParentOfItem(item);
      const newType =
        SpecLibraryListTypes[SpecLibraryListTypes.indexOf(lastType) + 1];
      const newMarker = getListMarker(
        newType,
        index,
        parent ? parent.relativeIndex : 0
      );

      item.type = newType;
      item.marker = newMarker;
      item.relativeIndex = index;

      if (item.subList) {
        updateSubListsTypesAndMarkers(item, newType, newMarker);
      }

      return item;
    });

    return list.subList;
  }

  // Finds the immediate parent of the given item in the nested list structure
  function findParentOfItem(item, list = data) {
    // Traverse each item in the list
    for (let current of list) {
      // Check if the current item's subList contains the target item
      if (current.subList && current.subList.includes(item)) {
        // Return the current item as it's the parent of the target item
        return current;
      }

      // Recursively search in the subList of the current item
      if (current.subList) {
        const parent = findParentOfItem(item, current.subList);
        if (parent) {
          // If the parent is found in the recursive call, return it
          return parent;
        }
      }
    }

    // Return null if no parent is found
    return null;
  }

  function insertListItem(item, parent, index) {
    if (parent.subList) {
      parent.subList.splice(index, 0, item);
      // Update the relative index, and marker of the items after the inserted item
      for (let i = index + 1; i < parent.subList.length; i++) {
        const sibling = parent.subList[i];
        sibling.relativeIndex = i;
        sibling.marker = getListMarker(
          sibling.type,
          sibling.relativeIndex,
          parent.relativeIndex
        );
      }
    } else {
      parent.subList = [item];
    }

    return parent;
  }

  function DeleteAllCallback(type, marker, relativeIndex) {
    if (!(type === "partHeading" && relativeIndex === 0)) {
      const result = findItemAndSiblingList(marker, data);
      const { parentList, item, depth } = result;
      const parent = findParentOfItem(item);

      if (!item.subList) {
        parent.subList = null;

        console.log("parent: ", parent);
      } else {
        parent.subList = parent.subList.filter(
          (item) => item.marker !== marker
        );
        updateSubListsTypesAndMarkers(parent, parent.type, parent.marker);

        console.log("parent: ", parent);
      }
    }
  }

  function AddCallback(type, marker, relativeIndex) {
    console.log(
      "type: ",
      type,
      "marker: ",
      marker,
      "relative Index: ",
      relativeIndex
    );
    const result = findItemAndSiblingList(marker, data);
    const { siblingList, item } = result;
    const parent = findParentOfItem(item);
    const parentOfParent = findParentOfItem(parent);

    const newMarker = getListMarker(
      type,
      relativeIndex + 1,
      parent ? parent.relativeIndex : 0
    );

    const newItem = {
      marker: newMarker,
      relativeIndex: relativeIndex + 1,
      type: type, // same type as sibling
      content: "test default value",
      subList: null,
    };

    const currentItemParent = insertListItem(
      newItem,
      parent,
      relativeIndex + 1
    );

    console.log("newItem: ", newItem);
    console.log("Current Item Parent: ", currentItemParent);
  }

  function indentCallback(direction, marker, type) {
    const result = findItemAndSiblingList(marker, data);
    if (!result) {
      console.error("Item not found");
      return;
    }
    const { siblingList, item } = result;
    const parent = findParentOfItem(item);
    const parentOfParent = findParentOfItem(parent);
    const parentSiblings = parentOfParent ? parentOfParent.subList : data;

    console.log("item: ", item, " siblings: ", siblingList);

    if (direction === "right") {
      rightIndent(item, siblingList);
    } else {
      leftIndent(item, siblingList, parent, parentOfParent, parentSiblings);
    }
  }

  function leftIndent(
    item,
    siblingList,
    parent,
    parentOfParent,
    parentSiblings
  ) {
    if (item.type !== "partHeading") {
      const newType =
        SpecLibraryListTypes[SpecLibraryListTypes.indexOf(item.type) - 1];
      const newMarker = getListMarker(
        newType,
        parent.relativeIndex + 1,
        parentOfParent ? parentOfParent.relativeIndex : 0
      );

      // Adjust the types and markers of items in the sublists
      let updatedSublist = null;
      if (item.subList) {
        updatedSublist = updateSubListsTypesAndMarkers(
          item,
          newType,
          newMarker
        );
      }

      const currentItem = {
        ...item,
        type: newType,
        marker: newMarker,
        relativeIndex: parent.relativeIndex + 1,
        subList: updatedSublist,
      };

      const currentItemParent = insertListItem(
        currentItem,
        parentOfParent,
        parent.relativeIndex + 1
      );

      console.log("Current Item Parent: ", currentItemParent);

      // traverse list until record with currentItemParent details is found(marker and relativeindex are the same?)
      // remove that record and replace it with currentItemParent

      // this could also mean replacing the parentparents sublist with currentItemParent

      // setData(updatedParentSiblings);
    }
  }

  function rightIndent(item, siblingList) {
    if (
      item.type !== "subSubsectionListDetails" &&
      item.marker !== "PART 1." &&
      item.relativeIndex !== 0
    ) {
      const newType =
        SpecLibraryListTypes[SpecLibraryListTypes.indexOf(item.type) + 1];

      const previousSiblingItem = siblingList[item.relativeIndex - 1];
      console.log("previousItem: ", previousSiblingItem);

      const markerIndex = previousSiblingItem.subList
        ? previousSiblingItem.subList.length
        : 0;

      const newMarker = getListMarker(
        newType,
        markerIndex,
        previousSiblingItem ? previousSiblingItem.relativeIndex : 0
      );

      // adjust the types and markers of items in the sublists if any
      let updatedSublist = null;
      if (item.subList) {
        updatedSublist = updateSubListsTypesAndMarkers(
          item,
          newType,
          newMarker
        );
      }

      const currentItem = {
        ...item,
        type: newType,
        marker: newMarker,
        relativeIndex: markerIndex,
        subList: updatedSublist,
      };

      console.log("currentItem: ", currentItem);
    }
  }

  function deleteOneCallback(marker, type, relativeIndex) {
    const result = findItemAndSiblingList(marker, data);
    if (!result) {
      console.error("Item not found");
      return;
    }
    const { siblingList, item } = result;
    const parent = findParentOfItem(item);
    const parentOfParent = findParentOfItem(parent);
    const parentSiblings = parentOfParent ? parentOfParent.subList : data;

    if (!(type === "partHeading" && relativeIndex === 0)) {
      const result = findItemAndSiblingList(marker, data);
      const { siblingList, item, depth } = result;
      const parent = findParentOfItem(item);

      if (!item.subList) {
        parent.subList = null;

        console.log("parent: ", parent);
      } else {
        const newType =
          SpecLibraryListTypes[SpecLibraryListTypes.indexOf(item.type) - 1];
        const newMarker = getListMarker(
          newType,
          parent.relativeIndex + 1,
          parentOfParent ? parentOfParent.relativeIndex : 0
        );

        // Adjust the types and markers of items in the sublists
        let updatedSublist = null;
        if (item.subList) {
          updatedSublist = updateSubListsTypesAndMarkers(
            item,
            newType,
            newMarker
          );
        }

        // Insert updated sublist into parent's sublist at relative index
        parent.subList.splice(parent.relativeIndex, 1, ...updatedSublist);

        // Update the relative index, and marker of the items after the inserted item
        let updatedParentSublist = parent.subList;
        updatedParentSublist = updateSubListsTypesAndMarkers(
          parent,
          parent.type,
          parent.marker
        );

        console.log("updatedParentSublist: ", updatedParentSublist);
      }
    }
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
      <div className="SpecLibraryFormContainer">{renderList(props.data)}</div>
    </div>
  );
};

// EXPORT
export default SpecLibraryForm;
