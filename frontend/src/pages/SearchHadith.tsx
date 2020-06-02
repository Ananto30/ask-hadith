import React, {Component} from "react";

import {Button, Dimmer, Grid, Icon, Input, Item, Label, LabelProps, Loader, Popup,} from "semantic-ui-react";

import client from "../client";
import {Hadith} from "../interfaces/Hadith";
import {ReadList} from "../interfaces/ReadList";
import {SearchHadithState} from "../interfaces/SearchHadithState";
import {HadithComponent} from "../components/Hadith";


class SearchHadith extends Component {
    state: SearchHadithState = {
        hadiths: [],
        books: [],
        filteredHadiths: [],
        filteredByBook: [],
        isLoading: false,
        activeItem: "",
        isAll: true,
        isRead: false,
        isUnread: false,
        readList: {},
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
                filteredByBook: res.data,
                isLoading: false,
                isAll: true,
                isUnread: false,
                isRead: false,
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

    handleFilterBooks = async (e: React.MouseEvent<HTMLElement>, {name}: LabelProps) => {
        let self = this;
        let newArray = this.state.hadiths.filter(function (el) {
            if (self.state.isAll) {
                return el.hadith === name;
            } else if (self.state.isRead) {
                return (
                    (`${el.hadith}#${el._id}` in self.state.readList) &&
                    el.hadith === name
                );
            } else {
                return (
                    !(`${el.hadith}#${el._id}` in self.state.readList) &&
                    el.hadith === name
                );
            }
        });
        this.setState({activeItem: name, filteredHadiths: newArray, filteredByBook: newArray});
    };

    handleFilterUnread = (e: React.MouseEvent<HTMLButtonElement>) => {
        let self = this;
        let newArray = this.state.filteredByBook.filter(function (el) {
            return !(`${el.hadith}#${el._id}` in self.state.readList);
        });
        this.setState({filteredHadiths: newArray, isAll: false, isRead: false, isUnread: true});
    };

    handleFilterRead = (e: React.MouseEvent<HTMLButtonElement>) => {
        let self = this;
        let newArray = this.state.filteredByBook.filter(function (el) {
            return (`${el.hadith}#${el._id}` in self.state.readList);
        });
        this.setState({filteredHadiths: newArray, isAll: false, isUnread: false, isRead: true});
    };

    handleFilterAll = (e: React.MouseEvent<HTMLButtonElement>) => {
        this.setState({
            filteredHadiths: this.state.hadiths,
            filteredByBook: this.state.hadiths,
            isAll: true,
            isUnread: false,
            isRead: false,
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
            isUnread,
            isRead,
            readList
        } = this.state;
        return (
            <Grid stackable>
                <Grid.Row centered>
                    <br/>
                    <br/>
                    <div>
                        <p style={{opacity: ".6"}}> Developed with <span role="img">❤️</span>️by <a
                            rel="noopener noreferrer" target="_blank"
                            href="https://github.com/Ananto30">Ananto</a>
                        </p>
                        <h2>Ask Hadith</h2>
                    </div>
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
                    {/*{filteredHadiths.length > 0 && (*/}
                    <Button.Group size="tiny">
                        <Button active={isAll} onClick={this.handleFilterAll}>
                            All
                        </Button>
                        <Button.Or/>
                        <Button active={isUnread} onClick={this.handleFilterUnread}>
                            Unread
                        </Button>
                        <Button.Or/>
                        <Button active={isRead} onClick={this.handleFilterRead}>
                            Read
                        </Button>

                    </Button.Group>

                    <Popup
                        content='Please note that read hadiths are saved in local cache, so if you delete your cache this history will be gone.'
                        trigger={<Icon style={{paddingTop: "5px", paddingLeft: "10px"}} name='info circle'/>}
                        position='right center'/>
                    {/*)}*/}
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
                                    <HadithComponent key={index} hadith={hadith} onClick={this.handleRead}
                                                     readList={readList}/>
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
