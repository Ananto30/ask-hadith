from pymongo import MongoClient
import functools
import random


class MongoHadithClient:
    """
    The legacy class that supports old searching and collections
    """

    DB_NAME = "news"  # emmm....you know legacy
    COLLECTION_NAMES = [
        "bukhari_sunnah",
        "muslim_sunnah",
        "abudawud_sunnah",
        "tirmidhi_sunnah",
        "nasai_sunnah",
        "ibnmajah_sunnah",
    ]

    def __init__(self, mongo_uri) -> None:
        client = MongoClient(mongo_uri)
        self.db = client[MongoHadithClient.DB_NAME]

    @functools.lru_cache(maxsize=512)
    def search_hadith(self, term, limit=50):
        total = []
        for collection in MongoHadithClient.COLLECTION_NAMES:
            search = self.db[collection].find(
                {"$text": {"$search": term}}, {"score": {"$meta": "textScore"}}
            )
            search.sort([("score", {"$meta": "textScore"})]).limit(limit)
            search = list(search)
            total = total + search
        return sorted(total, key=lambda k: k["score"], reverse=True)

    def random_hadith(self, limit=3, dbs=[]):
        total = []
        for collection in MongoHadithClient.COLLECTION_NAMES:
            hadiths = self.db[collection].aggregate(
                [{"$match": {"content": {"$ne": " "}}}, {"$sample": {"size": limit}}]
            )
            hadiths = list(hadiths)
            total = total + hadiths
        return sorted(total, key=lambda k: random.random())
