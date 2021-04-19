import * as React from "react";

interface CreateNewPlayerDialogProps {
  existingNames: string[],
  onCancel: () => void,
  onCreate: (name: string) => void
}

interface CreateNewPlayerDialogState {
  
}

export default class CreateNewPlayerDialog extends React.Component<CreateNewPlayerDialogProps, CreateNewPlayerDialogState> {
  render() {
    return (
      <div>
        <button onClick={this.props.onCancel} className="menu-button">Cancel</button>
        <button onClick={() => this.props.onCreate("aaa")} className="menu-button">Create</button>
      </div>
    )
  }
}