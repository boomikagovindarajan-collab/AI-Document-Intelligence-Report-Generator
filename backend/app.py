import os
from flask import Flask, jsonify, send_from_directory, send_file
from flask_cors import CORS
from config import Config
from database import db
from routes import register_routes
from init_samples import init_demo_database

def create_app(config_class=Config):
    # Point static and template folder to built frontend dist if it exists
    frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend', 'dist'))

    app = Flask(__name__, static_folder=os.path.join(frontend_dist, 'assets'), static_url_path='/assets')
    app.config.from_object(config_class)

    # Enable CORS for all routes (supporting development on 5173 / localhost)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Ensure required directories exist
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    os.makedirs(app.config['GENERATED_REPORTS_FOLDER'], exist_ok=True)
    os.makedirs(app.config['SAMPLES_FOLDER'], exist_ok=True)
    os.makedirs(os.path.join(app.root_path, 'instance'), exist_ok=True)

    # Initialize extensions
    db.init_app(app)

    # Register API blueprints
    register_routes(app)

    # Health check route
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'healthy',
            'application': 'DocuIntellect AI',
            'api': 'online',
            'version': '1.0.0'
        })

    # Serve generated reports directly
    @app.route('/reports/<path:filename>')
    def serve_report(filename):
        return send_from_directory(app.config['GENERATED_REPORTS_FOLDER'], filename)

    # Serve built React SPA if dist exists
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_frontend(path):
        if path.startswith('api/') or path.startswith('reports/'):
            return jsonify({'error': 'Not found'}), 404

        index_file = os.path.join(frontend_dist, 'index.html')
        if os.path.exists(index_file):
            target_file = os.path.join(frontend_dist, path)
            if path and os.path.exists(target_file):
                return send_from_directory(frontend_dist, path)
            return send_file(index_file)
        return jsonify({
            'application': 'DocuIntellect AI Backend',
            'status': 'Running',
            'frontend': 'Run `npm run dev` in frontend directory for Vite interface on http://127.0.0.1:5173'
        })

    # Global error handlers
    @app.errorhandler(400)
    def bad_request(e):
        return jsonify({'success': False, 'error': str(e.description or 'Bad Request')}), 400

    @app.errorhandler(413)
    def request_entity_too_large(e):
        return jsonify({'success': False, 'error': 'File payload exceeds maximum allowed limit (25 MB).'}), 413

    @app.errorhandler(500)
    def internal_server_error(e):
        return jsonify({'success': False, 'error': 'Internal server error occurred.'}), 500

    # Auto-initialize demo database on first boot
    init_demo_database(app)

    return app

if __name__ == '__main__':
    app = create_app()
    print("DocuIntellect AI server starting at http://127.0.0.1:5000")
    app.run(host='127.0.0.1', port=5000, debug=False)
