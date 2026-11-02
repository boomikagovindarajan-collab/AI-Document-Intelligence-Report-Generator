import sys
import os
import time
import webbrowser
import threading

# Add backend directory to sys.path
backend_dir = os.path.join(os.path.dirname(__file__), 'backend')
sys.path.insert(0, backend_dir)

from app import create_app

def open_browser(target_url):
    time.sleep(1.2)
    try:
        print(f"[+] Opening {target_url} in your default browser...")
        webbrowser.open(target_url)
    except Exception as e:
        print(f"[-] Could not open browser automatically: {e}")

if __name__ == '__main__':
    print("=" * 70)
    print("      DOCUINTELLECT AI — DOCUMENT INTELLIGENCE & REPORT GENERATOR")
    print("      Full-Stack Platform | KPR Institute of Engineering and Technology")
    print("=" * 70)
    print("\n[+] Initializing Flask Application and SQLite Database...")
    app = create_app()

    port = int(os.environ.get('PORT', 5000))
    url = f"http://127.0.0.1:{port}"
    print(f"[+] Full-Stack Server running at: {url}")
    print("[+] All API endpoints available under /api/")
    print("[+] React Production SPA served directly at root /")
    print("=" * 70)

    # Automatically open browser
    threading.Thread(target=open_browser, args=(url,), daemon=True).start()

    try:
        app.run(host='0.0.0.0', port=port, debug=False)
    except OSError as e:
        if "Address already in use" in str(e) or "10048" in str(e):
            alt_port = 5050
            alt_url = f"http://127.0.0.1:{alt_port}"
            print(f"[!] Port {port} busy, switching to {alt_url}...")
            threading.Thread(target=open_browser, args=(alt_url,), daemon=True).start()
            app.run(host='0.0.0.0', port=alt_port, debug=False)
        else:
            raise
