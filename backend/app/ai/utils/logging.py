import functools
import time
import logging

logger = logging.getLogger("app.ai")

def log_ai_function(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.perf_counter()
        # Clean arguments display (limit long string outputs)
        args_str = str(args)[:300] + ("..." if len(str(args)) > 300 else "")
        kwargs_str = str(kwargs)[:300] + ("..." if len(str(kwargs)) > 300 else "")
        
        logger.info(f"AI: Calling '{func.__name__}' | args={args_str} | kwargs={kwargs_str}")
        try:
            result = func(*args, **kwargs)
            elapsed = time.perf_counter() - start_time
            logger.info(f"AI: Done '{func.__name__}' in {elapsed:.4f}s")
            return result
        except Exception as e:
            elapsed = time.perf_counter() - start_time
            logger.error(f"AI: Error in '{func.__name__}' after {elapsed:.4f}s - {type(e).__name__}: {str(e)}", exc_info=True)
            raise e
    return wrapper
