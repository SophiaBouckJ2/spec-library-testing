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

  // TODO: is this needed?
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

  // //callback
  // function DeleteAllCallback(item) {
  //   // deep copy
  //   let dataCopy = JSON.parse(JSON.stringify(data));
  //   if (!(item.type === "partHeading" && item.relativeIndex === 0)) {
  //     // TODO: parse through dataCopy until parent is found using uuid, use parent to complete the cases below

  //     if (!item.subList) {
  //       setSubListToNull(dataCopy, itemParent.uuid);
  //       console.log(dataCopy);
  //       setData(dataCopy);
  //     } else {
  //       DeleteSingleItemAndChildren(dataCopy, itemParent.uuid);

  //       // update all types and markers
  //       updateSubListsTypesAndMarkers(
  //         dataCopy[2],
  //         dataCopy[2].type,
  //         dataCopy[2].marker
  //       );

  //       console.log(dataCopy);
  //       setData(dataCopy);
  //       // parent = DeleteSingleItemAndChildren(parent, item.marker);
  //       // console.log("parent: ", parent);
  //     }
  //   }
  // }

  // Callback function to delete all items
  function DeleteAllCallback(item) {
    console.log("deleting all...");
    // Deep copy of the data
    let dataCopy = JSON.parse(JSON.stringify(data));

    if (!(item.type === "partHeading" && item.relativeIndex === 0)) {
      // Helper function to find the parent using the item's uuid
      function findParent(items, targetUuid) {
        for (const currentItem of items) {
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

      // Find the parent of the item using its uuid
      const itemParent = findParent(dataCopy, item.uuid);

      if (itemParent) {
        if (!item.subList) {
          // Set the parent's sublist to null if the item has no sublist
          setSubListToNull(dataCopy, itemParent.uuid);
          console.log(dataCopy);
          setData(dataCopy);
        } else {
          // Delete the item and its children if it has a sublist
          DeleteSingleItemAndChildren(dataCopy, itemParent.uuid);

          // // Update all types and markers
          // updateSubListsTypesAndMarkers(
          //   dataCopy[2],
          //   dataCopy[2].type,
          //   dataCopy[2].marker
          // );

          console.log(dataCopy);
          setData(dataCopy);
        }
      }
    }
  }

  //callback
  // Add a new item after the current item at the same list level
  function AddCallback(item) {
    // deep copy
    let dataCopy = JSON.parse(JSON.stringify(data));
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

    insertItemsAtIndex(
      dataCopy,
      [newItem],
      item.relativeIndex + 1,
      parent.uuid
    );

    // update all types and markers
    updateSubListsTypesAndMarkers(
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

  //helper
  // Indent the item to the left
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

  //helper
  // Indent the item to the right
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
      const result = findItemsSiblingList(item.uuid, dataCopy);
      const { siblingList, depth } = result;
      const parent = findParentOfItem(item);
      const parentOfParent = findParentOfItem(parent);
      const parentSiblings = parentOfParent ? parentOfParent.subList : dataCopy;

      if (item.subList) {
        // item.subList added to parent.subList at relative index
        insertItemsAtIndex(
          dataCopy,
          item.subList,
          item.relativeIndex,
          parent.uuid
        );
      }

      if (parent.subList.length === 1) {
        setSubListToNull(dataCopy, parent.uuid);
      } else {
        // remove item from parentofparent.sublist
        DeleteSingleItemAndChildren(dataCopy, item.uuid);
      }

      // update all types and markers
      updateSubListsTypesAndMarkers(
        dataCopy[2],
        dataCopy[2].type,
        dataCopy[2].marker
      );

      console.log(dataCopy);
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
