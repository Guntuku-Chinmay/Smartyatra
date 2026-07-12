from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ORMBaseSchema(BaseModel):
    """
    Base schema for all response models.
    """

    model_config = ConfigDict(from_attributes=True)


class TimestampSchema(ORMBaseSchema):
    created_at: datetime
    updated_at: datetime