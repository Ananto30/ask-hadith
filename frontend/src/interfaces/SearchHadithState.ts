import {Hadith} from "./Hadith";
import {ReadList} from "./ReadList";

export interface SearchHadithState {
    hadiths: Hadith[],
    books: Hadith[],
    filteredHadiths: Hadith[],
    filteredByBook: Hadith[],
    isLoading: boolean,
    activeItem: string,
    isAll: boolean,
    isRead: boolean,
    isUnread: boolean,
    readList: ReadList

}