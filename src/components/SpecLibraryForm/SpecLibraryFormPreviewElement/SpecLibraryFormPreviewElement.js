import React from "react";
import "./SpecLibraryFormPreviewElement.css";

const renderContent = (item) => {
  switch (item.type) {
    case "title":
      return <h1>{item.content}</h1>;
    case "subTitle":
      return <h2>{item.content}</h2>;
    case "partHeading":
      return (
        <h3>
          {item.marker} {item.content}
        </h3>
      );
    case "sectionHeading":
      return (
        <h4>
          {item.marker} {item.content}
        </h4>
      );
    case "subsection":
      return (
        <h5>
          {item.marker} {item.content}
        </h5>
      );
    case "subsectionList":
      return (
        <p className="subsection-list">
          {item.marker} {item.content}
        </p>
      );
    case "subsectionListDetails":
      return (
        <p className="subsection-list-details">
          {item.marker} {item.content}
        </p>
      );
    case "subSubsectionListDetails":
      return (
        <p className="sub-subsection-list-details">
          {item.marker} {item.content}
        </p>
      );
    case "endOfSection":
      return <div className="end-of-section">{item.content}</div>;
    default:
      return <p>{item.content}</p>;
  }
};

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

function renderList(items) {
  return items.map((item, index) => {
    let currentItem = renderContent(item);

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

export const SpecLibraryFormPreviewElement = ({ data }) => {
  return <div className="preview-container">{renderList(data)}</div>;
};
