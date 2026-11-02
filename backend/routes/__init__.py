from routes.documents import documents_bp
from routes.analysis import analysis_bp
from routes.qa import qa_bp
from routes.reports import reports_bp
from routes.dashboard import dashboard_bp
from routes.settings import settings_bp

def register_routes(app):
    app.register_blueprint(documents_bp)
    app.register_blueprint(analysis_bp)
    app.register_blueprint(qa_bp)
    app.register_blueprint(reports_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(settings_bp)
