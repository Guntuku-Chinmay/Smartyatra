import logging
import time

from fastapi import FastAPI, Request

logger = logging.getLogger(__name__)


def setup_request_logging(app: FastAPI) -> None:
    @app.middleware("http")
    async def log_requests(request: Request, call_next):
        start = time.time()

        response = await call_next(request)

        duration = (time.time() - start) * 1000

        logger.info(
            "%s %s | %s | %.2f ms",
            request.method,
            request.url.path,
            response.status_code,
            duration,
        )

        return response