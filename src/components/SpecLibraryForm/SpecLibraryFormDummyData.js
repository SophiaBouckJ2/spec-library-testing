export const SpecLibraryDummyData = [
  {
    marker: "Title",
    type: "title",
    content: "test default value",
    subList: null,
  },
  {
    marker: "Subtitle",
    type: "subTitle",
    content: "test default value",
    subList: null,
  },
  {
    marker: "PART 1.",
    type: "partHeading",
    content: "test default value",
    subList: [
      {
        marker: "1.1",
        type: "sectionHeading",
        content: "test default value",
        subList: [
          {
            marker: "A.",
            type: "subsection",
            content: "test default value",
            subList: [
              {
                marker: "1.",
                type: "subsectionList",
                content: "test default value",
                subList: [
                  {
                    marker: "a.",
                    type: "subsectionListDetails",
                    content: "test default value",
                    subList: [
                      {
                        marker: "1)",
                        type: "subSubsectionListDetails",
                        content: "test default value",
                        subList: null,
                      },
                    ],
                  },
                  {
                    marker: "b.",
                    type: "subsectionListDetails",
                    content: "test default value",
                    subList: null,
                  },
                ],
              },
              {
                marker: "2.",
                type: "subsectionList",
                content: "test default value",
                subList: null,
              },
            ],
          },
          {
            marker: "B.",
            type: "subsection",
            content: "test default value",
            subList: null,
          },
        ],
      },
      {
        marker: "1.2",
        type: "sectionHeading",
        content: "test default value",
        subList: null,
      },
    ],
  },
  {
    marker: "PART 2.",
    type: "partHeading",
    content: "test default value",
    subList: null,
  },
  {
    marker: "PART 3.",
    type: "partHeading",
    content: "test default value",
    subList: null,
  },
  {
    marker: "End Of Section",
    type: "endOfSection",
    content: "endOfSection test default value",
    subList: null,
  },
];
