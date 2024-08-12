// Node structure for the linked list
export class HistoryNode {
  constructor(data, prev = null, next = null) {
    this.data = data;
    this.prev = prev;
    this.next = next;
  }
}

// Linked list to store the history of data states
export class HistoryLinkedList {
  constructor(initialData) {
    const initialNode = new HistoryNode(initialData);
    this.current = initialNode; // Start with the initial state
  }

  // Add a new snapshot of the data to the list
  addSnapshot(newData) {
    const newNode = new HistoryNode(newData, this.current);
    if (this.current) {
      this.current.next = newNode;
    }
    this.current = newNode;
  }

  // Move to the previous snapshot
  undo() {
    if (this.current && this.current.prev) {
      this.current = this.current.prev;
      return this.current.data;
    }
    return null; // No previous state
  }

  // Move to the next snapshot
  redo() {
    if (this.current && this.current.next) {
      this.current = this.current.next;
      return this.current.data;
    }
    return null; // No next state
  }

  // Check if undo is possible
  canUndo() {
    return this.current && this.current.prev;
  }

  // Check if redo is possible
  canRedo() {
    return this.current && this.current.next;
  }
}
