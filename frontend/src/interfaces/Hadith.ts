export interface Hadith {
    collection_id: string
    collection: string
    book_en: string
    book_no: string
    chapter_en: string
    chapter_no: string
    narrator_en: string
    body_en: string
    hadith_no: string
    book_ref_no: string
    hadith_grade: string
    in_book_ref: string
    book_ref_en: string
    book_ref_ar: string
    highlights: Array<Highlight>
}

export interface Highlight {
    path: string
    score: number
    texts: Array<Text>
}

export interface Text {
    type: string
    value: string
}