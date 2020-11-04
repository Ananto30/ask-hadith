import React from "react";
import { Icon, Input } from "semantic-ui-react";
import { Hadith } from "../interfaces/Hadith";
import client from "../client";

interface SearchProps {
    hadiths: Hadith[],
    collections: Hadith[],
    filteredHadiths: Hadith[],
    isAll: boolean,
    isLoading: boolean
}

const Search = ({ isLoading, hadiths, collections, filteredHadiths, isAll }: SearchProps) => {

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

            let resArr: Hadith[] = [];
            res.data.filter(function (item: Hadith) {
                var i = resArr.findIndex((x) => x.collection === item.collection);
                if (i <= -1) {
                    resArr.push(item);
                }
                return null;
            });
            collections = resArr;
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
            icon={<Icon name="search" />}
            loading={isLoading}
            placeholder="Search..."
            onKeyDown={handleEnter}
        />
    )
}
export default Search;