import { getDb, putDb } from './database';
import { header } from './header';

// define the class with a name to improve code readability
class Editor {
  constructor() {
    // move the initialization of localData to a separate method
    this.initLocalData();

    // check if CodeMirror is loaded
    if (typeof CodeMirror === 'undefined') {
      throw new Error('CodeMirror is not loaded');
    }

    // extract the CodeMirror options to a constant
    const options = {
      value: '',
      mode: 'javascript',
      theme: 'monokai',
      lineNumbers: true,
      lineWrapping: true,
      autofocus: true,
      indentUnit: 2,
      tabSize: 2,
    };

    // initialize the editor with the options
    this.editor = CodeMirror(document.querySelector('#main'), options);

    // set the editor value from IndexedDB or local storage or the header
    this.setEditorValue();

    // listen for change events on the editor
    this.editor.on('change', this.handleEditorChange);

    // listen for blur events on the editor
    this.editor.on('blur', this.handleEditorBlur);
  }

  // extract the initialization of localData to a separate method
  initLocalData() {
    this.localData = localStorage.getItem('content');
  }

  // extract the setting of editor value to a separate method
  async setEditorValue() {
    const data = await getDb();
    console.info('Loaded data from IndexedDB, injecting into editor');
    this.editor.setValue(data || this.localData || header);
  }

  // extract the handling of editor change events to a separate method
  handleEditorChange = () => {
    localStorage.setItem('content', this.editor.getValue());
  };

  // extract the handling of editor blur events to a separate method
  handleEditorBlur = () => {
    console.log('The editor has lost focus');
    putDb(localStorage.getItem('content'));
  };
}

export default Editor;
