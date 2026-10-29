"""Local-only demonstration API. No public auth or physical adapters."""
import argparse
import json
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse, parse_qs

from .bridge import EventBridge, golden_event


def make_server(bridge, address=("127.0.0.1", 8765)):
    class Handler(BaseHTTPRequestHandler):
        def reply(self, code, value):
            body = json.dumps(value, ensure_ascii=False).encode()
            self.send_response(code)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)

        def do_GET(self):
            route = urlparse(self.path)
            if route.path == "/health":
                return self.reply(200, {"status": "local-demo", "point": bridge.current()["point"]})
            if route.path == "/current":
                return self.reply(200, bridge.current())
            if route.path != "/sse":
                return self.reply(404, {"error": "unknown route"})
            try:
                seq = int(self.headers.get("Last-Event-ID") or parse_qs(route.query).get("after", ["0"])[0])
                if seq < 0:
                    raise ValueError("negative cursor")
            except ValueError:
                return self.reply(400, {"error": "cursor must be a nonnegative sequence"})
            self.send_response(200)
            self.send_header("Content-Type", "text/event-stream; charset=utf-8")
            self.send_header("Cache-Control", "no-cache")
            self.end_headers()
            try:
                while True:
                    with bridge.changed:
                        if bridge.closed:
                            return
                        rows = bridge.events_after(seq)
                        if not rows:
                            bridge.changed.wait(timeout=15)
                            if bridge.closed:
                                return
                            rows = bridge.events_after(seq)
                    for seq, event in rows:
                        frame = f"id: {seq}\nevent: golden\ndata: {json.dumps(event, ensure_ascii=False)}\n\n"
                        self.wfile.write(frame.encode())
                    if not rows:
                        self.wfile.write(b": heartbeat\n\n")
                    self.wfile.flush()
            except (BrokenPipeError, ConnectionResetError):
                return

        def do_POST(self):
            if self.path != "/select":
                return self.reply(404, {"error": "unknown route"})
            try:
                size = int(self.headers.get("Content-Length", "0"))
                if not 0 < size <= 65536:
                    raise ValueError("selection body must be 1..65536 bytes")
                request = json.loads(self.rfile.read(size))
                if not isinstance(request, dict):
                    raise ValueError("selection must be an object")
                receipt = bridge.select(request)
                self.reply(200, golden_event(receipt))
            except (ValueError, KeyError, TypeError) as error:
                self.reply(400, {"error": str(error)})
            except Exception:
                self.reply(503, {"error": "receipt commit failed"})

        def log_message(self, *args):
            pass

    server = ThreadingHTTPServer(address, Handler)
    server.daemon_threads = True
    return server


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--space", default="examples/octave-space.json")
    parser.add_argument("--database", default="local-events.sqlite")
    parser.add_argument("--port", type=int, default=8765)
    args = parser.parse_args()
    with open(args.space) as stream:
        config = json.load(stream)
    bridge = EventBridge(args.database, config["initial_point"], config["space"])
    server = make_server(bridge, ("127.0.0.1", args.port))
    try:
        server.serve_forever()
    finally:
        server.server_close()
        bridge.close()


if __name__ == "__main__":
    main()
