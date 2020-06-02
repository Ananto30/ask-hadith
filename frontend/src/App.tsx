import "./App.css";

import {Container} from "semantic-ui-react";
import React from "react";
import SearchHadith from "./pages/SearchHadith";
import PwaInstallPrompt from "./components/PwaInstallPrompt";

class App extends React.Component {

  render() {
    return (
        <Container>
          <PwaInstallPrompt/>
          <SearchHadith/>
        </Container>
    );
  }
}

export default App;
