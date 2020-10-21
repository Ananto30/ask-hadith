import os
from pprint import pprint
from typing import List

from pymongo import MongoClient

from model import Hadith


class AtlasSearch:
    DB_NAME = "hadith"
    COLLECTION_NAME = "hadiths"

    def __init__(self, mongo_uri) -> None:
        client = MongoClient(mongo_uri)
        self.db = client[AtlasSearch.DB_NAME]
        self.cursor = self.db[AtlasSearch.COLLECTION_NAME]

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
                            {"phrase": {"query": term, "path": "body_en", "slop": 2,}}
                        ],
                    },
                    "highlight": {"path": ["body_en", "chapter_en"]},
                }
            },
            {
                "$project": {
                    "collection_id": 1,
                    "collection": 1,
                    "hadith_no": 1,
                    "book_no": 1,
                    "book_en": 1,
                    "chapter_no": 1,
                    "chapter_en": 1,
                    "narrator_en": 1,
                    "body_en": 1,
                    "score": {"$meta": "searchScore"},
                    "highlights": {"$meta": "searchHighlights"},
                }
            },
        ]
        return list(self.cursor.aggregate(pipeline))


def test_search():
    search_client = AtlasSearch(os.getenv("ATLAS_URL"))
    result = search_client.search_hadith("epidemic")

    for r in result:
        pprint(r)
