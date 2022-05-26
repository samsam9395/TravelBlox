import React, { useState, useEffect } from 'react';
import { Editor } from 'slate-react';
// Import the Slate editor factory.
import { createEditor } from 'slate';

// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from 'slate-react';

function textEditor() {
  // Create a Slate editor object that won't change across renders.
  const [editor] = useState(() => withReact(createEditor()));

  return <Slate editor={editor} value={initialValue} />;
}

export default textEditor;
