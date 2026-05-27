from sqlalchemy import column,VARCHAR,Integer
from database.database import base

class OverallStanding(base):
    __tablename__ = "overall_standing"

    rank = column(Integer)