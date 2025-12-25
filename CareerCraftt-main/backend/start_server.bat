@echo off
uvicorn main:app --reload > server_log.txt 2>&1
