import datetime, requests

from functools import reduce
from sqlalchemy import exc
from sqlalchemy.orm import joinedload
from flask import Blueprint, jsonify, request, current_app, Response, abort
from app.models import User, Game
from app.util import get_user, kd_per_day, games_per_day
from app.database import db

api = Blueprint('api', __name__, url_prefix='/api')


@api.route('/')
def home():
    return jsonify(foo='bar')


@api.route('/active_users')
def active_users():
    time = datetime.datetime.now() - datetime.timedelta(minutes=30)
    games = db.session.query(User).filter(datetime.datetime.fromtimestamp(User.lastmodified_total / 1e3) >= time).order_by(User.lastmodified_total.desc()).all()

    serialized_users = list(map(lambda u: u.serialize(), users))


@api.route('/recent_games')
def recent_games():
    time = datetime.datetime.now() - datetime.timedelta(minutes=30)
    games = db.session.query(Game).options(joinedload(Game.user)).order_by(
        Game.time_played.desc()).distinct(Game.user).all()
    
    for game in games:
        current_app.logger.info(game.user)
    
    serialized_recent_games = list(
        map(
            lambda game: dict(
                mode=game.mode,
                playlist=game.playlist,
                username=game.user.username,
                kills=game.kills,
                placement=game.placement,
                time_played=game.time_played), games))

    return jsonify(serialized_recent_games)


@api.route('/users')
def users():
    users = User.query.all()
    serialized_users = list(
        map(lambda user: dict(id=user.id, username=user.username), users))
    return jsonify(serialized_users)


@api.route('/users/<user_id>')
def user(user_id):
    user = get_user(user_id)
    stats = request.args.get('stats')
    stats = (stats == 'true')

    user_data = user.serialize(include_stats=stats)
    return jsonify(user_data)


@api.route('/users/<user_id>/kd')
def kds(user_id):
    user = get_user(user_id)
    mode = request.args.get('m', 'all')

    labels, datasets = kd_per_day(user, mode)

    return jsonify(dict(labels=labels, datasets=datasets))


@api.route('/users/<user_id>/placements')
def placements(user_id):
    user = get_user(user_id)

    return jsonify(
        dict(
            solo=user.placements_solo(),
            duo=user.placements_duo(),
            squad=user.placements_squad(),
        ))


@api.route('/users/<user_id>/game_counts')
def game_counts(user_id):
    user = get_user(user_id)
    mode = request.args.get('m', 'all')

    labels, datasets = games_per_day(user, mode)

    return jsonify(dict(labels=labels, datasets=datasets))


@api.route("/users/<user_id>/games")
def games(user_id):
    user = get_user(user_id)
    mode = request.args.get('m', 'all')

    if mode != 'all':
        games = user.games.filter_by(mode=mode).order_by(
            Game.time_played.desc()).limit(100).all()
    else:
        games = user.games.order_by(Game.time_played.desc()).limit(100).all()

    serialized_games = list(map(lambda g: g.serialize(), games))

    return jsonify(serialized_games)


@api.route("/users/<user_id>/game_records")
def records(user_id):
    user = get_user(user_id)
    solo_record = user.games.filter_by(mode='solo').order_by(
        Game.kills.desc()).first()
    duo_record = user.games.filter_by(mode='duo').order_by(
        Game.kills.desc()).first()
    squad_record = user.games.filter_by(mode='squad').order_by(
        Game.kills.desc()).first()

    return jsonify(
        solo=solo_record.serialize() if solo_record is not None else None,
        duo=duo_record.serialize() if duo_record is not None else None,
        squad=squad_record.serialize() if squad_record is not None else None)


@api.route("/users/<user_id>/time_played")
def time_played(user_id):
    user = get_user(user_id)
    total = round(user.hoursplayed_total, 2)
    hours_solo = round(user.minutesplayed_solo / 60, 2)
    hours_duo = round(user.minutesplayed_duo / 60, 2)
    hours_squad = round(user.minutesplayed_squad / 60, 2)

    return jsonify(
        dict(
            labels=['Solo Hours', 'Duo Hours', 'Squad Hours'],
            datasets=[[hours_solo, hours_duo, hours_squad]]))


@api.route("/new_user", methods=["POST"])
def new_user():
    json = request.get_json()
    if ('uid' not in json):
        abort(Response(response='No UID Received', status=400))

    uid = json.get('uid')

    base = 'https://fortnite-public-api.theapinetwork.com/prod09'
    endpoint = base + '/users/public/br_stats_v2?platform=pc&user_id={}'

    r = requests.get(endpoint.format(uid))
    res_json = r.json()

    if res_json is None or 'error' in json:
        abort(
            Response(
                response='Unable to locate you on Fortniteapi', status=500))

    username = res_json.get('epicName')

    if username is None:
        abort(
            Response(
                response='Unable to locate you on Fortniteapi', status=500))

    try:
        user = User(uid=uid, username=username)
        db.session.add(user)
        db.session.commit()
    except exc.IntegrityError:
        abort(Response(response='This user already exists!', status=500))

    return Response(status=200)