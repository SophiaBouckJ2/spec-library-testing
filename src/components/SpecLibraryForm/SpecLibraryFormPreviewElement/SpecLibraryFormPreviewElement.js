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
          PART {item.marker} - {item.content}
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

const renderList = (list) => {
  return list.map((item) => (
    <div key={item.uuid} style={{ marginLeft: item.relativeIndex * 20 + "px" }}>
      {renderContent(item)}
      {item.subList && (
        <div style={{ marginLeft: "20px" }}>{renderList(item.subList)}</div>
      )}
    </div>
  ));
};

export const SpecLibraryFormPreviewElement = ({ data }) => {
  return <div className="preview-container">{renderList(data)}</div>;
};
