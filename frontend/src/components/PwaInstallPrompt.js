import {Button, Header, Icon, Modal} from "semantic-ui-react";
import React from "react";

class PwaInstallPrompt extends React.Component {
  state = {
    installButton: false,
  };
  installPrompt = null;

  componentDidMount() {
    console.log("Listening for Install prompt");
    window.addEventListener("beforeinstallprompt", (e) => {
      // For older browsers
      e.preventDefault();
      console.log("Install Prompt fired");
      this.installPrompt = e;
      // See if the app is already installed, in that case, do nothing
      if (
        (window.matchMedia &&
          window.matchMedia("(display-mode: standalone)").matches) ||
        window.navigator.standalone === true
      ) {
        return false;
      }
      // Set the state variable to make button visible
      this.setState({
        installButton: true,
      });
    });
  }

  installApp = async () => {
    if (!this.installPrompt) return false;
    this.installPrompt.prompt();
    let outcome = await this.installPrompt.userChoice;
    if (outcome.outcome === "accepted") {
      console.log("App Installed");
    } else {
      console.log("App not installed");
    }
    // Remove the event reference
    this.installPrompt = null;
    // Hide the button
    this.setState({
      installButton: false,
    });
  };

  handleClose = () => this.setState({installButton: false});

  render() {
    return (
      <>
        {this.state.installButton && (
          <Modal
            defaultOpen={this.state.installButton}
            open={this.state.installButton}
            basic
            size="small"
          >
            <Header icon="archive" content="Install as App"/>
            <Modal.Content>
              <p>
                You can install this website as app in your mobile, do you want
                to install it?
              </p>
            </Modal.Content>
            <Modal.Actions>
              <Button onClick={this.handleClose} basic color="red" inverted>
                <Icon name="remove"/> No
              </Button>
              <Button onClick={this.installApp} color="green" inverted>
                <Icon name="checkmark"/> Yes
              </Button>
            </Modal.Actions>
          </Modal>
        )}
      </>
    );
  }
}

export default PwaInstallPrompt;
