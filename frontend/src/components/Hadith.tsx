import { Hadith, Highlight } from "../interfaces/Hadith";
import React from "react";
import { ReadList } from "../interfaces/ReadList";
import { Button, Item } from "semantic-ui-react";

export const HadithComponent = (props: { hadith: Hadith, onClick: (e: React.MouseEvent<HTMLButtonElement>) => void, readList: ReadList }) => {
    const readHadithUniqueId = `${props.hadith.collection}#${props.hadith.book_no}#${props.hadith.book_ref_no}`;
    return <Item>
        <Item.Content>
            <Item.Header as="a" style={{ fontSize: "1.1em" }}>Book: {props.hadith.book_en}</Item.Header>
            {props.hadith.chapter_en ? <Item.Meta ><b>Chapter: {props.hadith.chapter_en}</b></Item.Meta> : null}
            <Item.Meta>{props.hadith.collection} (Book {props.hadith.book_no}, Hadith {props.hadith.book_ref_no} [Reference {props.hadith.hadith_no}])</Item.Meta>
            <Item.Description>{props.hadith.narrator_en}</Item.Description>
            <Item.Description>{props.hadith.body_en}</Item.Description>

            {formatHighlights(props.hadith.highlights)}
            
            <Item.Extra>
                Grade: {props.hadith.hadith_grade}
                <Button
                    size="mini"
                    floated="right"
                    value={readHadithUniqueId}
                    onClick={props.onClick}
                >
                    {readHadithUniqueId in props.readList
                        ? "Unread"
                        : "Read"}
                </Button>
            </Item.Extra>
            <Item.Extra />
        </Item.Content>
    </Item>;
}

function formatHighlights(highlights: Array<Highlight>) {

    return <Item.Description>
        <i>
            <b>Search matched lines: </b>
            {
                highlights.filter(highlight =>
                    highlight.path === "body_en")
                    .map(highlight => highlight.texts)
                    .map(texts => texts.map(text =>
                        text.type === "hit" ?
                            <u style={{ backgroundColor: "yellow" }}>{text.value}</u>
                            : <>{text.value}</>)
                    )
            }
        </i>
    </Item.Description>

}