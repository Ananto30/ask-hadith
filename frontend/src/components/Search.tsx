import React, {useState} from "react";
import {Icon, Input} from "semantic-ui-react";
import {Hadith} from "../interfaces/Hadith";
import client from "../client";

interface SearchProps {
    hadiths: Hadith[],
    books: Hadith[],
    filteredHadiths: Hadith[],
    isAll: boolean,
    isLoading: boolean
}

const Search = ({isLoading, hadiths, books, filteredHadiths, isAll}: SearchProps) => {
    const [loading, setLoading] = useState(isLoading);


    // TODO: There can be a search button to use handleSearch
    const handleSearch = async (e: KeyboardEvent) => {
        isLoading = true;

        try {
            const searchElement = e.target as HTMLInputElement
            let res = await client.Hadith.search(searchElement.value);

            hadiths = res.data;
            filteredHadiths = res.data;
            isLoading = false;
            isAll = true;

            console.log("mama")

            let resArr: Hadith[] = [];
            res.data.filter(function (item: Hadith) {
                var i = resArr.findIndex((x) => x.hadith === item.hadith);
                if (i <= -1) {
                    resArr.push(item);
                }
                return null;
            });
            books = resArr;
        } catch (error) {
            console.log(error);
        }
    };

    const handleEnter = async (e: KeyboardEvent) => {
        if (e.key === "Enter" && e.target) {
            await handleSearch(e);
        }
    };

    return (
        <Input
            fluid
            icon={<Icon name="search"/>}
            loading={isLoading}
            placeholder="Search..."
            onKeyDown={handleEnter}
        />
    )
}
export default Search;