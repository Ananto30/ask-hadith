import React, {Component} from "react";

import {Button, Dimmer, Grid, Icon, Input, Item, Label, LabelProps, Loader,} from "semantic-ui-react";

import client from "../client";

type Hadith = {
    _id: string,
    chapter: string,
    hadith: string,
    narrator: string,
    content: string,
    hadith_number: string
}

type ReadList = {
    [hadithAndId: string]: boolean
}

type SearchHadithState = {
    hadiths: Hadith[],
    books: Hadith[],
    filteredHadiths: Hadith[],
    prevHadiths: Hadith[],
    isLoading: boolean,
    activeItem: string,
    isAll: boolean,
    readList: ReadList

}

class SearchHadith extends Component {
    state: SearchHadithState = {
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
        const readList: ReadList = JSON.parse(window.localStorage.getItem("readList") as string);
        if (readList) this.setState({readList: readList});
    }

    handleSearch = async (e: KeyboardEvent) => {
        this.setState({isLoading: true});
        try {
            const searchElement = e.target as HTMLInputElement
            let res = await client.Hadith.search(searchElement.value);
            this.setState({
                hadiths: res.data,
                filteredHadiths: res.data,
                isLoading: false,
                isAll: true,
            });
            var resArr: Hadith[] = [];
            res.data.filter(function (item: Hadith) {
                var i = resArr.findIndex((x) => x.hadith === item.hadith);
                if (i <= -1) {
                    resArr.push(item);
                }
                return null;
            });
            this.setState({books: resArr});
        } catch (error) {
            console.log(error);
        }
    };

    handleEnter = async (e: KeyboardEvent) => {
        if (e.key === "Enter" && e.target) {
            await this.handleSearch(e);
        }
    };

    handleFilterBooks = async (e: React.MouseEvent<HTMLElement>, data: LabelProps) => {
        let self = this;
        const {name} = data
        let newArray = this.state.hadiths.filter(function (el) {
            if (self.state.isAll) {
                return el.hadith === name;
            } else {
                return (
                    !(`${el.hadith}#${el._id}` in self.state.readList) &&
                    el.hadith === name
                );
            }
        });
        this.setState({activeItem: name, filteredHadiths: newArray});
    };

    handleFilterRead = (e: React.MouseEvent<HTMLButtonElement>) => {
        let self = this;
        let newArray = this.state.filteredHadiths.filter(function (el) {
            return !(`${el.hadith}#${el._id}` in self.state.readList);
        });
        this.setState({filteredHadiths: newArray, isAll: false});
    };

    handleFilterAll = (e: React.MouseEvent<HTMLButtonElement>) => {
        this.setState({
            filteredHadiths: this.state.hadiths,
            isAll: true,
            activeItem: "",
        });
    };

    handleCopy = (e: MouseEvent) => {
        // this.textArea.select();
        // document.execCommand("copy");
        console.log(e.target);
    };

    handleRead = (e: React.MouseEvent<HTMLButtonElement>) => {
        const readElement = e.target as HTMLButtonElement
        const val = readElement.value;
        let readList: ReadList = JSON.parse(window.localStorage.getItem("readList") as string);
        if (!readList) {
            let newMap: ReadList = {};
            newMap[val] = true;

            this.setState({readList: newMap});
            window.localStorage.setItem("readList", JSON.stringify(newMap));
        } else {
            if (val in readList) {
                delete readList[val];
            } else {
                readList[val] = true;
            }

            this.setState({readList: readList});
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
                    <br/>
                    <br/>
                    <h2>Ask Hadith</h2>
                </Grid.Row>
                <Grid.Row centered>
                    <Grid.Column width={8}>
                        <Input
                            fluid
                            icon={<Icon name="search"/>}
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
                            <Button.Or/>
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
                                <Loader inverted content="Loading"/>
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
