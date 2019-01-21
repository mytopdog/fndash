from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand
from app import create_app, db
from app.models import Game, User

app, _ = create_app()

migrate = Migrate(app, db)

manager = Manager(app)
manager.add_command('db', MigrateCommand)


@manager.command
def runserver():
    app.run(debug=True, host='0.0.0.0', port=5000)


@manager.command
def runworker():
    app.run(debug=False)


@manager.command
def recreate_db():
    """
    Recreates a database. This should only be used once
    when there's a new database instance. This shouldn't be
    used when you migrate your database.
    """
    db.drop_all()
    db.create_all()
    db.session.commit()


@app.shell_context_processor
def make_shell_context():
    return dict(app=app, db=db, migrate=migrate, User=User, Game=Game)


if __name__ == "__main__":
    manager.run()
