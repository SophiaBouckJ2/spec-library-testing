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

  // USE EFFECT
  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  // HELPER FUNCTIONS

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

  // Returns deep copies of item and data, sibling list, parent, and parent of parent
  function getDetailsForCallback(item) {
    // return deep copy of item and data
    let itemCopy = JSON.parse(JSON.stringify(item));
    let dataCopy = JSON.parse(JSON.stringify(data));
    // return sibling list of item
    let siblingList = findItemsSiblingList(itemCopy.uuid, dataCopy);
    // return parent of item
    let parent = findParent(dataCopy, itemCopy.uuid);
    // return parent of parent of item
    let parentOfParent = findParent(dataCopy, parent.uuid);
    return {
      itemCopy: itemCopy,
      dataCopy: dataCopy,
      siblingList: siblingList,
      parent: parent,
      parentOfParent: parentOfParent,
    };
  }

  // Returns the sublist of the items parent given the uuid
  function findItemsSiblingList(uuid, list) {
    for (let item of list) {
      if (item.uuid === uuid) {
        return list;
      }
      if (item.subList) {
        const result = findItemsSiblingList(uuid, item.subList);
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

    // return list.subList;
  }

  //helper
  // Deletes the item and its children from the data structure using uuid
  function DeleteSingleItemAndChildren(dataCopy, targetUuid) {
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

    // return dataCopy;
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
    // return dataCopy;
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

    // return dataCopy;
  }

  // CALLBACKS

  // Callback function to delete all items
  function DeleteAllCallback(item) {
    const { dataCopy, parent } = getDetailsForCallback(item);
    if (!(item.type === "partHeading" && item.relativeIndex === 0)) {
      if (parent.subList.length === 1) {
        setSubListToNull(dataCopy, parent.uuid);
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
    const { dataCopy, parent } = getDetailsForCallback(item);

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
    const { itemCopy, dataCopy, siblingList, parent, parentOfParent } =
      getDetailsForCallback(item);

    if (direction === "right") {
      rightIndent(dataCopy, itemCopy, siblingList, parent);
    } else if (direction === "left") {
      leftIndent(dataCopy, itemCopy, parent, parentOfParent);
    }
  }

  //helper/callback
  // Indent the item to the left
  function leftIndent(dataCopy, itemCopy, parent, parentOfParent) {
    if (itemCopy.type !== "partHeading") {
      insertItemsAtIndex(
        dataCopy,
        [itemCopy],
        parent.relativeIndex + 1,
        parentOfParent.uuid
      );

      DeleteSingleItemAndChildren(dataCopy, itemCopy.uuid);

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

  //helper/callback
  // Indent the item to the right
  // TODO: Add a check for the last item in the list, edge case
  function rightIndent(dataCopy, itemCopy, siblingList, parent) {
    if (
      itemCopy.type !== "subSubsectionListDetails" &&
      itemCopy.marker !== "PART 1." &&
      itemCopy.relativeIndex !== 0
    ) {
      const nextSibling = siblingList[itemCopy.relativeIndex - 1];
      insertItemsAtIndex(
        dataCopy,
        [itemCopy],
        nextSibling.subList.length,
        nextSibling.uuid
      );

      DeleteSingleItemAndChildren(dataCopy, itemCopy.uuid);

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

  //callback
  // Delete the item and its children
  function deleteOneCallback(item) {
    // deep copy
    let dataCopy = JSON.parse(JSON.stringify(data));
    // deep copy of the item
    let itemCopy = JSON.parse(JSON.stringify(item));
    if (!(item.type === "partHeading" && item.relativeIndex === 0)) {
      const itemParent = findParent(dataCopy, item.uuid);

      if (item.subList) {
        // item.subList added to parent.subList at relative index
        // this step is the difference between delete all and delete one
        insertItemsAtIndex(
          dataCopy,
          itemCopy.subList,
          itemCopy.relativeIndex,
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
      <div className="SpecLibraryFormContainer">{renderList(data)}</div>
    </div>
  );
};

// EXPORT
export default SpecLibraryForm;
