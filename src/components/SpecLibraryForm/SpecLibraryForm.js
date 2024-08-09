// DEPENDENCIES
import React, { useState, useEffect } from "react";

// CSS
import "./SpecLibraryForm.css";
import undo from "../../Assets/undo.png";
import redo from "../../Assets/redo.png";
import save from "../../Assets/save.png";
import SpecLibraryFormListElement from "./SpecLibraryFormListElement/SpecLibraryFormListElement";
import SpecLibraryFormTextElement from "./SpecLibraryFormTextElement/SpecLibraryFormTextElement";
import { generateUUID } from "../utils/UUIDGenerator";

// MUI ICONS

// CUSTOM COMPONENTS

// CONSTANTS

const SpecLibraryListTypes = [
  "list",
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
  }, [props.data]);

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
        currentItem = <SpecLibraryFormTextElement key={index} item={item} />;
      } else if (item.type !== "list") {
        currentItem = (
          <SpecLibraryFormListElement
            key={index}
            indent={getIndentAmount(item.type)}
            item={item}
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

  function findItemsSiblingList(uuid, list, depth = 0) {
    for (let item of list) {
      if (item.uuid === uuid) {
        return { siblingList: list, depth };
      }
      if (item.subList) {
        const result = findItemsSiblingList(uuid, item.subList, depth + 1);
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

  function DeleteSingleItemAndChildren(parent, targetUuid) {
    parent.subList = parent.subList.filter((item) => item.uuid !== targetUuid);
    updateSubListsTypesAndMarkers(parent, parent.type, parent.marker);
    return parent;
  }

  function DeleteSingleItem(item, parent, parentOfParent) {
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
      updatedSublist = updateSubListsTypesAndMarkers(item, newType, newMarker);
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

    return updatedParentSublist;
  }

  function DeleteAllCallback(item) {
    if (!(item.type === "partHeading" && item.relativeIndex === 0)) {
      const result = findItemsSiblingList(item.uuid, data);
      const { SiblingList, depth } = result;
      let parent = findParentOfItem(item);

      if (!item.subList) {
        parent.subList = null;
        console.log("parent: ", parent);
      } else {
        parent = DeleteSingleItemAndChildren(parent, item.marker);
        console.log("parent: ", parent);
      }
    }
  }

  function AddCallback(item) {
    const result = findItemsSiblingList(item.uuid, data);
    const { siblingList } = result;
    const parent = findParentOfItem(item);
    const parentOfParent = findParentOfItem(parent);

    const newMarker = getListMarker(
      item.type,
      item.relativeIndex + 1,
      parent ? parent.relativeIndex : 0
    );

    const newItem = {
      uuid: generateUUID(),
      marker: newMarker,
      relativeIndex: item.relativeIndex + 1,
      type: item.type, // same type as sibling
      content: "test default value",
      subList: null,
    };

    const currentItemParent = insertListItem(
      newItem,
      parent,
      item.relativeIndex + 1
    );

    console.log("newItem: ", newItem);
    console.log("Current Item Parent: ", currentItemParent);
  }

  function indentCallback(direction, item) {
    const result = findItemsSiblingList(item.uuid, data);
    if (!result) {
      console.error("Item not found");
      return;
    }
    const { siblingList } = result;
    const parent = findParentOfItem(item);
    const parentOfParent = findParentOfItem(parent);
    const parentSiblings = parentOfParent ? parentOfParent.subList : data;

    // console.log("item: ", item, " siblings: ", siblingList);

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

  function setSubListToNull(dataCopy, targetUuid) {
    // Helper function to search through the structure
    function findAndSetSubListToNull(items) {
      for (const item of items) {
        if (item.uuid === targetUuid) {
          item.subList = null;
          return true; // Element found and modified
        }

        if (item.subList) {
          const found = findAndSetSubListToNull(item.subList);
          if (found) {
            return true; // Stop searching if the element is found
          }
        }
      }
      return false; // Element not found in this branch
    }

    findAndSetSubListToNull(dataCopy);
    return dataCopy;
  }

  // insert items if they come in as an array (ex. sublist)
  function insertItemsAtIndex(dataCopy, newItems, relativeIndex, targetUuid) {
    // Helper function to search through the structure
    function findAndInsert(items) {
      for (const item of items) {
        if (item.uuid === targetUuid) {
          if (!item.subList) {
            // Initialize subList as an empty array if it doesn't exist
            item.subList = [];
          }

          // Insert each new item at the specified starting relative index
          newItems.forEach((newItem, index) => {
            item.subList.splice(relativeIndex + index, 0, newItem);
          });

          return true; // Element found and items inserted
        }

        if (item.subList) {
          const found = findAndInsert(item.subList);
          if (found) {
            return true; // Stop searching if the element is found
          }
        }
      }
      return false; // Element not found in this branch
    }

    findAndInsert(dataCopy);

    let dataCopyAfterTargetUuid = dataCopy;
    // update/fix all types and markers
    dataCopyAfterTargetUuid = updateSubListsTypesAndMarkers(
      dataCopy[relativeIndex],
      dataCopy[relativeIndex].type,
      dataCopy[relativeIndex].marker
    );

    console.log(dataCopy);

    return dataCopy;
  }

  function deleteOneCallback(item) {
    // deep copy
    let dataCopy = JSON.parse(JSON.stringify(data));
    if (!(item.type === "partHeading" && item.relativeIndex === 0)) {
      const result = findItemsSiblingList(item.uuid, dataCopy);
      const { siblingList, depth } = result;
      const parent = findParentOfItem(item);
      const parentOfParent = findParentOfItem(parent);
      const parentSiblings = parentOfParent ? parentOfParent.subList : dataCopy;

      if (!item.subList) {
        // parse through dataCopy until parent is found using uuid, set sublist to null
        if (parent) {
          setSubListToNull(dataCopy, parent.uuid);
          console.log(dataCopy);
          setData(dataCopy);
        }
      } else {
        // item.subList added to parent.subList at relative index
        insertItemsAtIndex(
          dataCopy,
          item.subList,
          item.relativeIndex,
          parent.uuid
        );

        // remove item from parentofparent.sublist
        DeleteSingleItemAndChildren(dataCopy[item.relativeIndex], item.uuid);

        console.log(dataCopy);
        setData(dataCopy);
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
