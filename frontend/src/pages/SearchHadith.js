import React, { Component } from "react";

import {
  Grid,
  Dimmer,
  Item,
  Label,
  Input,
  Icon,
  Loader,
  Button,
} from "semantic-ui-react";

import client from "../client";
// import ItemPlaceholder from "../components/ItemPlaceholder";

class SearchHadith extends Component {
  state = {
    hadiths: [],
    books: [],
    isLoading: false,
    activeItem: "",
    filteredHadiths: [],
    isAll: true,
    readList: {},
    prevHadiths: [],
  };
  async componentDidMount() {

    let readList = JSON.parse(window.localStorage.getItem("readList"));
    if (readList) this.setState({ readList: readList });
  }

  handleSearch = async (e) => {
    this.setState({ isLoading: true });
    try {
      let res = await client.Hadith.search(e.target.value);
      this.setState({
        hadiths: res.data,
        filteredHadiths: res.data,
        isLoading: false,
        isAll: true,
      });
      var resArr = [];
      res.data.filter(function (item) {
        var i = resArr.findIndex((x) => x.hadith === item.hadith);
        if (i <= -1) {
          resArr.push(item);
        }
        return null;
      });
      this.setState({ books: resArr });
    } catch (error) {
      console.log(error);
    }
  };

  handleEnter = async (e) => {
    if (e.key === "Enter") {
      e.target.blur();
      await this.handleSearch(e);
    }
  };

  handleFilterBooks = async (e, { name }) => {
    let self = this;
    var newArray = this.state.hadiths.filter(function (el) {
      if (self.state.isAll) {
        return el.hadith === name;
      } else {
        return (
          !(`${el.hadith}#${el._id}` in self.state.readList) &&
          el.hadith === name
        );
      }
    });
    this.setState({ activeItem: name, filteredHadiths: newArray });
  };

  handleFilterRead = (e) => {
    let self = this;
    var newArray = this.state.filteredHadiths.filter(function (el) {
      return !(`${el.hadith}#${el._id}` in self.state.readList);
    });
    this.setState({ filteredHadiths: newArray, isAll: false });
  };

  handleFilterAll = (e) => {
    this.setState({
      filteredHadiths: this.state.hadiths,
      isAll: true,
      activeItem: "",
    });
  };

  handleCopy = (e) => {
    // this.textArea.select();
    // document.execCommand("copy");
    console.log(e.target);
  };

  handleRead = (e) => {
    const val = e.target.value;
    let readList = JSON.parse(window.localStorage.getItem("readList"));
    if (!readList) {
      let newMap = {};
      newMap[val] = true;

      this.setState({ readList: newMap });
      window.localStorage.setItem("readList", JSON.stringify(newMap));
    } else {
      if (val in readList) {
        delete readList[val];
      } else {
        readList[val] = true;
      }

      this.setState({ readList: readList });
      window.localStorage.setItem("readList", JSON.stringify(readList));
    }
  };

  render() {
    const {
      filteredHadiths,
      books,
      isLoading,
      activeItem,
      isAll,
      readList,
    } = this.state;
    return (
      <Grid stackable>
        <Grid.Row centered>
          <br />
          <br />
          <h2>Ask Hadith</h2>
        </Grid.Row>
        <Grid.Row centered>
          <Grid.Column width={8}>
            <Input
              fluid
              icon={<Icon name="search" />}
              loading={isLoading}
              placeholder="Search..."
              onKeyDown={this.handleEnter}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row centered>
          {filteredHadiths.length > 0 && (
            <Button.Group size="tiny">
              <Button active={isAll} onClick={this.handleFilterAll}>
                All
              </Button>
              <Button.Or />
              <Button active={!isAll} onClick={this.handleFilterRead}>
                Unread
              </Button>
            </Button.Group>
          )}
        </Grid.Row>
        <Grid.Column width={16}>
          <Label.Group circular>
            {books.map((hadith, index) => (
              <Label
                key={index}
                as="a"
                active={activeItem === hadith.hadith}
                name={hadith.hadith}
                onClick={this.handleFilterBooks}
              >
                {hadith.hadith}
              </Label>
            ))}
          </Label.Group>
          <Item.Group divided>
            {isLoading ? (
              <Dimmer active inverted>
                <Loader inverted content="Loading" />
              </Dimmer>
            ) : (
              <>
                {filteredHadiths.map((hadith, index) => (
                  <Item key={index}>
                    <Item.Content>
                      <Item.Header as="a">{hadith.chapter}</Item.Header>
                      <Item.Meta>{hadith.hadith}</Item.Meta>
                      <Item.Description>{hadith.narrator}</Item.Description>
                      <Item.Description>{hadith.content}</Item.Description>
                      <Item.Extra>
                        {hadith.hadith_number}

                        <Button
                          size="mini"
                          floated="right"
                          value={`${hadith.hadith}#${hadith._id}`}
                          onClick={this.handleRead}
                        >
                          {`${hadith.hadith}#${hadith._id}` in readList
                            ? "Unread"
                            : "Read"}
                        </Button>
                      </Item.Extra>
                      <Item.Extra></Item.Extra>
                    </Item.Content>
                  </Item>
                ))}
              </>
            )}
          </Item.Group>
        </Grid.Column>
      </Grid>
    );
  }
}

export default SearchHadith;
