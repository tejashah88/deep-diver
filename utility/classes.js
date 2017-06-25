class Dive {
  constructor(title) {
    this.title = title;
    this.pages = [];
  }

  startRecording() {
    this.startTime = Date.now();
    this.id = "dive_" + this.startTime;
  }

  stopRecording() {
    this.endTime = Date.now();
  }

  addPage(page) {
    this.pages.push(page);
  }

  exportToJson() {
    var json = {
      title: this.title,
      id: this.id,
      startTime: this.startTime,
      endTime: this.endTime,
      pages: []
    }

    for (var page of this.pages) {
      json.pages.push(page.exportToJson());
    }
  }
}

class Page {
  constructor(params) {
    this.url = params.url;
    this.parentPageId = params.parentPageId;
    this.noteRefs = [];
  }

  addNoteRef(ref) {
    this.noteRefs.push(ref);
  }

  addNoteRefs(refs) {
    this.noteRefs.push(...refs);
  }

  exportToJson() {
    var json = {
      url: this.url,
      parentPageId: this.parentPageId,
      notes: []
    };

    for (var noteRef of this.noteRefs) {
      json.notes.push(noteRef.exportToJson());
    }

    return json;
  }
}

class Note {
  constructor(tag, content, pageId) {
    this.tag = tag;
    this.content = content;
    this.pageId = pageId;
    this.timestamp = Date.now();
  }

  exportToJson() {
    return {
      tag: this.tag,
      content: this.content,
      pageId: this.pageId,
      timestamp: this.timestamp
    };
  }
}