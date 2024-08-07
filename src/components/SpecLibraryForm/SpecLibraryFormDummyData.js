export const SpecLibraryDummyData = [
  {
    marker: "Title",
    relativeIndex: 0,
    type: "title",
    content: "test default value",
    subList: null,
  },
  {
    marker: "Subtitle",
    relativeIndex: 1,
    type: "subTitle",
    content: "test default value",
    subList: null,
  },
  {
    marker: "List",
    relativeIndex: 2,
    type: "list",
    content: null,
    subList: [
      {
        marker: "PART 1.",
        relativeIndex: 0,
        type: "partHeading",
        content: "test default value",
        subList: [
          {
            marker: "1.1",
            relativeIndex: 0,
            type: "sectionHeading",
            content: "test default value",
            subList: [
              {
                marker: "A.",
                relativeIndex: 0,
                type: "subsection",
                content: "test default value",
                subList: [
                  {
                    marker: "1.",
                    relativeIndex: 0,
                    type: "subsectionList",
                    content: "test default value",
                    subList: [
                      {
                        marker: "a.",
                        relativeIndex: 0,
                        type: "subsectionListDetails",
                        content: "test default value",
                        subList: [
                          {
                            marker: "1)",
                            relativeIndex: 0,
                            type: "subSubsectionListDetails",
                            content: "test default value",
                            subList: null,
                          },
                        ],
                      },
                      {
                        marker: "b.",
                        relativeIndex: 1,
                        type: "subsectionListDetails",
                        content: "test default value",
                        subList: null,
                      },
                    ],
                  },
                  {
                    marker: "2.",
                    relativeIndex: 1,
                    type: "subsectionList",
                    content: "test default value",
                    subList: null,
                  },
                ],
              },
              {
                marker: "B.",
                relativeIndex: 1,
                type: "subsection",
                content: "test default value",
                subList: null,
              },
            ],
          },
          {
            marker: "1.2",
            relativeIndex: 1,
            type: "sectionHeading",
            content: "test default value",
            subList: null,
          },
        ],
      },
      {
        marker: "PART 2.",
        relativeIndex: 1,
        type: "partHeading",
        content: "test default value test",
        subList: [
          {
            marker: "2.1",
            relativeIndex: 0,
            type: "sectionHeading",
            content: "test default value testtest",
            subList: null,
          },
        ],
      },
    ],
  },
  {
    marker: "End Of Section",
    relativeIndex: 3,
    type: "endOfSection",
    content: "endOfSection test default value",
    subList: null,
  },
];
