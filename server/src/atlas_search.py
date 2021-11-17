import functools
import os
from pprint import pprint
from typing import List

from pymongo import MongoClient

from src.model import Hadith


class AtlasSearch:
    DB_NAME = "hadith"
    COLLECTION_NAME = "hadiths"

    def __init__(self, mongo_uri) -> None:
        client = MongoClient(mongo_uri)
        self.db = client[AtlasSearch.DB_NAME]
        self.cursor = self.db[AtlasSearch.COLLECTION_NAME]

    @functools.lru_cache(maxsize=512)
    def search_hadith(self, term: str) -> List[Hadith]:
        pipeline = [
            {
                "$search": {
                    "compound": {
                        "must": [
                            {
                                "text": {
                                    "query": term,
                                    "path": ["body_en", "chapter_en"],
                                    "fuzzy": {"maxEdits": 1, "maxExpansions": 10},
                                }
                            }
                        ],
                        "should": [
                            {
                                "phrase": {
                                    "query": term,
                                    "path": "body_en",
                                    "slop": 2,
                                }
                            }
                        ],
                    },
                    "highlight": {"path": ["body_en", "chapter_en"]},
                }
            },
            {"$limit": 50},
            {
                "$project": {
                    "_id": 0,
                    "collection_id": 1,
                    "collection": 1,
                    "hadith_no": 1,
                    "book_no": 1,
                    "book_en": 1,
                    "chapter_no": 1,
                    "chapter_en": 1,
                    "narrator_en": 1,
                    "body_en": 1,
                    "book_ref_no": 1,
                    "hadith_grade": 1,
                    "score": {"$meta": "searchScore"},
                    "highlights": {"$meta": "searchHighlights"},
                }
            },
        ]
        return list(self.cursor.aggregate(pipeline))

    @functools.lru_cache(maxsize=128)
    def get_hadiths_by_book(self, collection_id, book_no) -> List[Hadith]:
        return self.cursor.find({"collection_id": collection_id, "book_no": book_no})

    @functools.lru_cache(maxsize=512)
    def get_hadith_by_book_ref_no(self, collection_id, book_no, book_ref_no) -> Hadith:
        return self.cursor.find_one(
            {
                "collection_id": collection_id,
                "book_no": book_no,
                "book_ref_no": book_ref_no,
            },
            {"_id": False},
        )


def test_search():
    search_client = AtlasSearch(os.getenv("ATLAS_URL"))
    result = search_client.search_hadith("epidemic")

    for r in result:
        pprint(r)
