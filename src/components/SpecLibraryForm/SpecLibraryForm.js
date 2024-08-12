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

  // Returns the amount of indentation for the given type
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

  // Returns the marker for the given type, index. Parent index used for section headings (1.1, 1.2, etc)
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

  // Renders the list of items
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

  // Returns the sublist of the items parent given the uuid
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

  // Cleans up the data structure by updating the types, markers, etc of the items
  // To clean up entire data structure call with data[2] as the list
  function updateSubListsTypesAndMarkers(dataCopy, list, lastType, lastMarker) {
    list.subList = list.subList.map((item, index) => {
      let parent = findParent(dataCopy, item.uuid);
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
        updateSubListsTypesAndMarkers(dataCopy, item, newType, newMarker);
      }

      return item;
    });

    return list.subList;
  }

  //helper
  // Deletes the item and its children from the data structure using uuid
  function DeleteSingleItemAndChildren(dataCopy, targetUuid) {
    console.log("deleting...");

    function findAndDelete(items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].uuid === targetUuid) {
          items.splice(i, 1);
          return true;
        }

        if (items[i].subList) {
          const found = findAndDelete(items[i].subList);
          if (found) {
            return true;
          }
        }
      }
      return false;
    }

    findAndDelete(dataCopy);

    return dataCopy;
  }

  // Helper function to find the parent using the item's uuid
  function findParent(dataCopy, targetUuid) {
    for (const currentItem of dataCopy) {
      if (currentItem.subList) {
        for (const subItem of currentItem.subList) {
          if (subItem.uuid === targetUuid) {
            return currentItem; // Parent found
          }
        }

        // Recursively search in sublists
        const parent = findParent(currentItem.subList, targetUuid);
        if (parent) {
          return parent; // Stop searching if the parent is found
        }
      }
    }
    return null; // Parent not found
  }

  // Callback function to delete all items
  function DeleteAllCallback(item) {
    console.log("deleting all...");
    // Deep copy of the data
    let dataCopy = JSON.parse(JSON.stringify(data));

    if (!(item.type === "partHeading" && item.relativeIndex === 0)) {
      // Find the parent of the item using its uuid
      const itemParent = findParent(dataCopy, item.uuid);

      if (itemParent.subList.length === 1) {
        setSubListToNull(dataCopy, itemParent.uuid);
      } else {
        // remove item from parentofparent.sublist
        DeleteSingleItemAndChildren(dataCopy, item.uuid);
      }

      // update all types and markers
      updateSubListsTypesAndMarkers(
        dataCopy,
        dataCopy[2],
        dataCopy[2].type,
        dataCopy[2].marker
      );

      console.log(dataCopy);
      setData(dataCopy);
    }
  }

  //callback
  // Add a new item after the current item at the same list level
  function AddCallback(item) {
    // deep copy
    let dataCopy = JSON.parse(JSON.stringify(data));
    const parent = findParent(dataCopy, item.uuid);

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

    insertItemsAtIndex(
      dataCopy,
      [newItem],
      item.relativeIndex + 1,
      parent.uuid
    );

    // update all types and markers
    updateSubListsTypesAndMarkers(
      dataCopy,
      dataCopy[2],
      dataCopy[2].type,
      dataCopy[2].marker
    );

    console.log(dataCopy);
    setData(dataCopy);
  }

  //callback
  // Indent the item to the right or left
  function indentCallback(direction, item) {
    // deep copy
    let dataCopy = JSON.parse(JSON.stringify(data));
    const result = findItemsSiblingList(item.uuid, data);
    if (!result) {
      console.error("Item not found");
      return;
    }
    const { siblingList } = result;
    const parent = findParent(dataCopy, item.uuid);
    const parentOfParent = findParent(dataCopy, parent.uuid);
    const parentSiblings = parentOfParent ? parentOfParent.subList : data;

    // console.log("item: ", item, " siblings: ", siblingList);

    if (direction === "right") {
      rightIndent(item, siblingList, parent);
    } else {
      leftIndent(
        dataCopy,
        item,
        siblingList,
        parent,
        parentOfParent,
        parentSiblings
      );
    }
  }

  //helper
  // Indent the item to the left
  function leftIndent(
    dataCopy,
    item,
    siblingList,
    parent,
    parentOfParent,
    parentSiblings
  ) {
    if (item.type !== "partHeading") {
      insertItemsAtIndex(
        dataCopy,
        [item],
        parent.relativeIndex + 1,
        parentOfParent.uuid
      );

      DeleteSingleItemAndChildren(dataCopy, item.uuid);

      // update all types and markers
      updateSubListsTypesAndMarkers(
        dataCopy,
        dataCopy[2],
        dataCopy[2].type,
        dataCopy[2].marker
      );

      console.log("dataCopy: ", dataCopy);
      setData(dataCopy);
    }
  }

  //helper
  // Indent the item to the right
  function rightIndent(item, siblingList, parent) {
    console.log("indenting right...");
    // Deep copy of the data
    let dataCopy = JSON.parse(JSON.stringify(data));
    // Deep copy of the item
    let itemCopy = JSON.parse(JSON.stringify(item));
    if (
      item.type !== "subSubsectionListDetails" &&
      item.marker !== "PART 1." &&
      item.relativeIndex !== 0
    ) {
      console.log("siblings: ", siblingList);
      const nextSibling = siblingList[item.relativeIndex - 1];
      console.log("nextSibling: ", nextSibling);
      console.log("length: ", nextSibling.subList.length);
      insertItemsAtIndex(
        dataCopy,
        [itemCopy],
        nextSibling.subList.length,
        nextSibling.uuid
      );

      DeleteSingleItemAndChildren(dataCopy, item.uuid);

      // update all types and markers
      updateSubListsTypesAndMarkers(
        dataCopy,
        dataCopy[2],
        dataCopy[2].type,
        dataCopy[2].marker
      );

      console.log("dataCopy: ", dataCopy);
      setData(dataCopy);
    }
  }

  //helper
  // Set the sublist of the item with the given uuid to null
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

  //helper
  // insert items if they come in as an array (ex. sublist, [one record])
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
            // Give a new UUID to the new item
            newItem.uuid = generateUUID();
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

    return dataCopy;
  }

  //callback
  // Delete the item and its children
  function deleteOneCallback(item) {
    console.log("deleting one...");
    // deep copy
    let dataCopy = JSON.parse(JSON.stringify(data));
    if (!(item.type === "partHeading" && item.relativeIndex === 0)) {
      const itemParent = findParent(dataCopy, item.uuid);

      if (item.subList) {
        // item.subList added to parent.subList at relative index
        // this step is the difference between delete all and delete one
        insertItemsAtIndex(
          dataCopy,
          item.subList,
          item.relativeIndex,
          itemParent.uuid
        );
      }

      if (itemParent.subList.length === 1) {
        setSubListToNull(dataCopy, itemParent.uuid);
      } else {
        // remove item from parentofparent.sublist
        DeleteSingleItemAndChildren(dataCopy, item.uuid);
      }

      // update all types and markers
      updateSubListsTypesAndMarkers(
        dataCopy,
        dataCopy[2],
        dataCopy[2].type,
        dataCopy[2].marker
      );

      console.log(dataCopy);
      setData(dataCopy);
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
