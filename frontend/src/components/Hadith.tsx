import {Hadith} from "../interfaces/Hadith";
import React from "react";
import {ReadList} from "../interfaces/ReadList";
import {Button, Item} from "semantic-ui-react";

export const HadithComponent = (props: { hadith: Hadith, onClick: (e: React.MouseEvent<HTMLButtonElement>) => void, readList: ReadList }) => {
    return <Item>
        <Item.Content>
            <Item.Header as="a">{props.hadith.chapter}</Item.Header>
            <Item.Meta>{props.hadith.hadith}</Item.Meta>
            <Item.Description>{props.hadith.narrator}</Item.Description>
            <Item.Description>{props.hadith.content}</Item.Description>
            <Item.Extra>
                {props.hadith.hadith_number}

                <Button
                    size="mini"
                    floated="right"
                    value={`${props.hadith.hadith}#${props.hadith._id}`}
                    onClick={props.onClick}
                >
                    {`${props.hadith.hadith}#${props.hadith._id}` in props.readList
                        ? "Unread"
                        : "Read"}
                </Button>
            </Item.Extra>
            <Item.Extra/>
        </Item.Content>
    </Item>;
}
