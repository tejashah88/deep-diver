import * as React from 'react';
import * as ReactDOM from 'react-dom';
import SortableTree from 'react-sortable-tree';

interface Page {
  parentPageID: number | null;
  notes: number[];
}

interface Note {
  tag: string;
  content: string;
  timestamp: number;
  pageUrl: string;
}

function loadDataFromChromeStorage(callback) {
  const dive_id = location.href.split("?dive_id=")[1];
  chrome.storage.sync.get(['notes', 'pages', 'dives'], (results) => {
    const callbackData = {
      dive: results.dives[dive_id],
      notes: results.notes[dive_id],
      pages: results.pages[dive_id],
    };
    callback(callbackData);
  });
}

function makeNoteNode(note: Note, pages: Page[]): object {
  return {
    title: note.content,
    subtitle: note.pageUrl,
    expanded: true,
  };
}

function makeTagNode(tag: string, pages: Page[], initialNote?: Note) {
  let children = [];
  if (initialNote) {
    children.push(makeNoteNode(initialNote, pages));
  }
  return {
    title: tag,
    children: children,
    expanded: true,
  }
}

function makeTagNodes(notes: Note[], pages: Page[]): object {
  const tagNodes = {};
  for (const note of notes) {
    // Let's just organize all notes by tag for now
    if (note.tag in tagNodes) {
      const noteNode = makeNoteNode(note, pages)
      const tagNode = tagNodes[note.tag];
      tagNode.children.push(noteNode);
    } else {
      const tagNode = makeTagNode(note.tag, pages, note);
      tagNodes[note.tag] = tagNode;
    }
  }
  return tagNodes;
}

function makeTreeDataFromTagNodes(title: string, tagNodes: object): object[] {
  const tagChildren = [];
  for (const key of Object.keys(tagNodes)) {
    tagChildren.push(tagNodes[key]);
  }
  return [{
    title: title,
    children: tagChildren,
    expanded: true,
  }];
}

loadDataFromChromeStorage((data) => {
  const tagNodes = makeTagNodes(data.notes, data.pages);
  const treeData = makeTreeDataFromTagNodes(data.dive.title, tagNodes);
  ReactDOM.render(
    <Root
      initialTreeData={treeData}
    />,
    document.getElementById('react-root')
  );
});

interface RootProps {
  initialTreeData: object[];
}

interface RootState {
  treeData: object[];
}

class Root extends React.Component<RootProps, RootState> {
  constructor(props: RootProps) {
    super(props);
    this.state = {
      treeData: this.props.initialTreeData,
    };
  }
  componentDidUpdate(prevProps: RootProps, prevState: RootState) {
    const links = document.getElementsByClassName("rst__rowSubtitle");
    for (let i = 0; i < links.length; i++) {
      links[i].onclick = (e) => {
         console.log('link clicked!');
         window.open(e.target.innerText);
      }
    }
  }
  render() {
    return (
    <div style={{ height: 1000 }}>
      <img src="../images/diver.png" width={400} />
      <SortableTree
        treeData={this.state.treeData}
        onChange={treeData => this.setState({ treeData })}
      />
    </div>);
  }
}
