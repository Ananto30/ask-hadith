import { Placeholder } from "semantic-ui-react";

import React from "react";

const ItemPlaceholder = () => (
  <>
    {Array.from({ length: 5 }, (_, k) => (
      <Placeholder key={k}>
        <Placeholder.Header image>
          <Placeholder.Line length="medium" />
          <Placeholder.Line length="full" />
        </Placeholder.Header>
        <Placeholder.Paragraph>
          <Placeholder.Line length="full" />
          <Placeholder.Line length="medium" />
        </Placeholder.Paragraph>
      </Placeholder>
    ))}
  </>
);

export default ItemPlaceholder;
