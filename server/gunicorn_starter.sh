#!/bin/bash
gunicorn src.app:app -w 2 --threads 2 -b 0.0.0.0:$PORT --access-logfile "-" --log-file "-" --log-level info