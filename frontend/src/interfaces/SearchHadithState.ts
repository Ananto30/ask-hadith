import {Hadith} from "./Hadith";
import {ReadList} from "./ReadList";

export interface SearchHadithState {
    hadiths: Hadith[],
    collections: Hadith[],
    filteredHadiths: Hadith[],
    filteredByCollection: Hadith[],
    isLoading: boolean,
    activeItem: string,
    isAll: boolean,
    isRead: boolean,
    isUnread: boolean,
    readList: ReadList
}