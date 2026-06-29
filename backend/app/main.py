import logging

from fastapi import FastAPI

from app.api.router import api_router
from app.core.config import settings
from app.core.exceptions import setup_exception_handlers
from app.core.logging import setup_logging
from app.middleware.cors import setup_cors
from app.middleware.request_logger import setup_request_logging

setup_logging()

logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.app_name,
    description="Backend API for SmartYatra",
    version=settings.app_version,
)

setup_cors(app)
setup_exception_handlers(app)
setup_request_logging(app)

app.include_router(api_router)

logger.info("SmartYatra API started successfully")


@app.get("/", tags=["Root"])
def root():
    return {
        "message": f"Welcome to {settings.app_name}"
    }