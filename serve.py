#!/usr/bin/env python3
"""Serve the local SLP site and public research notes, excluding development files."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path, PurePosixPath
from urllib.parse import unquote, urlsplit
import argparse

ROOT = Path(__file__).resolve().parent

class PreviewHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def send_head(self):
        path = unquote(urlsplit(self.path).path)
        if path == "/":
            self.send_response(302)
            self.send_header("Location", "/docs/")
            self.end_headers()
            return None
        if path == "/favicon.ico":
            self.send_response(302)
            self.send_header("Location", "/site/assets/favicon.svg")
            self.end_headers()
            return None
        parts = PurePosixPath(path).parts
        if len(parts) < 2 or parts[1] != "docs" or ".." in parts:
            self.send_error(404, "This path is not part of the preview.")
            return None
        return super().send_head()

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, default=8803)
    args = parser.parse_args()
    print(f"SLP preview: http://127.0.0.1:{args.port}/docs/", flush=True)
    ThreadingHTTPServer(("127.0.0.1", args.port), PreviewHandler).serve_forever()
