from dataclasses import dataclass


@dataclass
class Hadith:
    collection_id: str
    collection: str
    book_en: str
    book_no: str
    chapter_en: str
    chapter_no: str
    narrator_en: str
    body_en: str
    hadith_no: str
    book_ref_no: str
