from flask import Blueprint, jsonify, request
import polars as pl
from sqlalchemy import delete, insert, select, update

from ..utils.status_code import StatusCode
from ..databases.transactional import init_oltp
from ..databases.analytical import init_olap
from ..models.quantitative import (
    Observation,
    Indicator,
    Construct,
    Relation,
    Analysis,
    Quantitative,
)

quantitative_bp = Blueprint("quantitative", __name__)


# READ all quantitative names
@quantitative_bp.get("/")
def read_quantitatives():
    db = init_oltp()
    with db.session as session:
        quantitative_select = select(Quantitative.id, Quantitative.name)
        quantitative_result = session.execute(quantitative_select).mappings().all()
        quantitative_serialized = {
            "quantitatives": [dict(row) for row in quantitative_result]
        }
        return jsonify(quantitative_serialized), StatusCode.OK


# READ details of a quantitative
@quantitative_bp.get("/<int:quantitative_id>")
def read_quantitative(quantitative_id):
    db = init_oltp()
    with db.session as session:
        quantitative_select = select(Quantitative)
        quantitative_filter = quantitative_select.where(
            Quantitative.id == quantitative_id
        )
        quantitative_result = session.execute(quantitative_filter).scalar()
        return jsonify(quantitative_result), StatusCode.OK


# CREATE a quantitative
@quantitative_bp.post("/")
def create_quantitative():
    request_body = request.get_json()

    db = init_oltp()
    with db.session as session:
        research_id = request_body["research_id"]

        quantitative_insert = (
            insert(Quantitative)
            .values(research_id=research_id, name=request_body["name"])
            .returning(Quantitative.id)
        )
        quantitative_id = session.execute(quantitative_insert).scalar()

        constructs = []
        for e in request_body["constructs"]:
            construct_object = dict(
                quantitative_id=quantitative_id,
                name=e["name"],
                description=e["description"],
            )
            constructs.append(construct_object)
        construct_insert = (
            insert(Construct).values(constructs).returning(Construct.id, Construct.name)
        )
        construct_results = session.execute(construct_insert).all()
        construct_map = dict((name, id) for id, name in construct_results)

        operationalization = {}
        for e in request_body["constructs"]:
            construct_id = construct_map[e["name"]]
            operationalization[construct_id] = [
                indicator["alias"] for indicator in e["indicators"]
            ]

        indicators = []
        for e in request_body["indicators"]:
            construct_id = None
            for key, value in operationalization.items():
                if e["alias"] in value:
                    construct_id = key
            indicator_object = dict(
                quantitative_id=quantitative_id,
                order=e["order"],
                visibility=e["visibility"],
                origin=e["origin"],
                alias=e["alias"],
                type=e["type"],
                role=e["role"],
                construct_id=construct_id,
            )
            indicators.append(indicator_object)
        indicator_insert = insert(Indicator).values(indicators)
        session.execute(indicator_insert)

        relations = []
        for e in request_body["relations"]:
            influencer_id = None
            independent_id = None
            dependent_id = None
            for key, value in construct_map.items():
                if e["influencer_construct"]["name"] == key:
                    influencer_id = value
                if (
                    e["independent_construct"] is not None
                    and e["independent_construct"]["name"] == key
                ):
                    independent_id = value
                if e["dependent_construct"]["name"] == key:
                    dependent_id = value
            relation_object = dict(
                quantitative_id=quantitative_id,
                type=e["type"],
                influencer_construct_id=influencer_id,
                independent_construct_id=independent_id,
                dependent_construct_id=dependent_id,
            )
            relations.append(relation_object)
        relation_insert = insert(Relation).values(relations)
        session.execute(relation_insert)

        session.commit()
        return "", StatusCode.CREATED


# UPDATE properties of a quantitative
@quantitative_bp.put("/<int:quantitative_id>")
def update_quantitative(quantitative_id):
    values = request.get_json()
    values["id"] = quantitative_id

    db = init_oltp()
    with db.session as session:
        quantitative_update = update(Quantitative).values(values)
        session.execute(quantitative_update)
        session.commit()
        return "", StatusCode.NO_CONTENT


# DELETE a quantitative
@quantitative_bp.delete("/<int:quantitative_id>")
def delete_quantitative(quantitative_id):
    db = init_oltp()
    with db.session as session:
        quantitative_delete = delete(Quantitative).where(
            Quantitative.id == quantitative_id
        )
        session.execute(quantitative_delete)
        session.commit()
        return "", StatusCode.NO_CONTENT


# READ a paginated observation
@quantitative_bp.get("/observation/<string:slug>")
def read_observation(slug):
    page = request.args.get("page", default=1, type=int)

    with init_olap() as connection:
        (count,) = connection.table(slug).count("*").fetchone()
        df = connection.table(slug).limit(page * 5, (page - 1) * 5).pl()
        response = Observation(
            length=count,
            columns=df.columns,
            data=df.to_dicts(),
        )
        return jsonify(response), StatusCode.OK


# UPSERT properties of an observation
@quantitative_bp.patch("/observation")
def create_observation():
    observation_code = request.form.get("observation_code")
    csv_file = request.files.get("csv_file")

    with init_olap() as connection:
        connection.read_csv(csv_file.stream).create(observation_code)
        return "", StatusCode.CREATED


# RUN an analysis
@quantitative_bp.patch("/analysis/<int:analysis_id>")
def run_analysis(analysis_id):
    values = request.get_json()

    db = init_oltp()
    with db.session as session:
        quantitative_select = select(Quantitative.observation_code)
        quantitative_filter = quantitative_select.where(
            Quantitative.id == values["quantitative_id"]
        )
        observation_code = session.execute(quantitative_filter).scalar()

        with init_olap() as connection:
            analysis = (
                connection.table(observation_code).pl().select(pl.exclude(pl.Utf8))
            )
            result = analysis.describe()
            analysis_update = update(Analysis).values(
                id=analysis_id,
                result={"columns": result.columns, "data": result.to_dicts()},
            )
            session.execute(analysis_update)
            session.commit()

    return "", StatusCode.CREATED


# CREATE an analysis
@quantitative_bp.post("/analysis")
def create_analysis():
    request_body = request.get_json()
    values = request_body["analyses"]

    db = init_oltp()
    with db.session as session:
        analysis_insert = insert(Analysis)
        session.execute(analysis_insert, values)
        session.commit()
        return "", StatusCode.CREATED


# UPDATE an analysis
@quantitative_bp.put("/analysis/<int:analysis_id>")
def update_analysis(analysis_id):
    values = request.get_json()
    values["id"] = analysis_id

    db = init_oltp()
    with db.session as session:
        analysis_update = update(Analysis).values(values)
        session.execute(analysis_update)
        session.commit()
        return "", StatusCode.NO_CONTENT


# DELETE an analysis
@quantitative_bp.delete("/analysis/<int:analysis_id>")
def delete_analysis(analysis_id):
    db = init_oltp()
    with db.session as session:
        analysis_delete = delete(Analysis).where(Analysis.id == analysis_id)
        session.execute(analysis_delete)
        session.commit()
        return "", StatusCode.NO_CONTENT


# CREATE bulk of relations
@quantitative_bp.post("/relation")
def create_relations():
    request_body = request.get_json()
    values = request_body["relations"]

    db = init_oltp()
    with db.session as session:
        relations_insert = insert(Relation)
        session.execute(relations_insert, values)
        session.commit()
        return "", StatusCode.CREATED


# UPDATE bulk of relations
@quantitative_bp.put("/relation")
def update_relations():
    request_body = request.get_json()
    values = request_body["relations"]

    db = init_oltp()
    with db.session as session:
        relations_update = update(Relation)
        session.execute(relations_update, values)
        session.commit()
        return "", StatusCode.NO_CONTENT


# DELETE bulk of relations
@quantitative_bp.delete("/relation")
def delete_relations():
    request_body = request.get_json()
    values = request_body["relation_ids"]

    db = init_oltp()
    with db.session as session:
        relations_delete = delete(Relation).where(Relation.id.in_(values))
        session.execute(relations_delete)
        session.commit()
        return "", StatusCode.NO_CONTENT


# CREATE bulk of constructs
@quantitative_bp.post("/construct")
def create_constructs():
    request_body = request.get_json()
    values = request_body["constructs"]

    db = init_oltp()
    with db.session as session:
        constructs_insert = insert(Construct)
        session.execute(constructs_insert, values)
        session.commit()
        return "", StatusCode.CREATED


# UPDATE bulk of constructs
@quantitative_bp.put("/construct")
def update_constructs():
    request_body = request.get_json()
    values = request_body["constructs"]

    db = init_oltp()
    with db.session as session:
        constructs_update = update(Construct)
        session.execute(constructs_update, values)
        session.commit()
        return "", StatusCode.NO_CONTENT


# DELETE bulk of constructs
@quantitative_bp.delete("/construct")
def delete_constructs():
    request_body = request.get_json()
    values = request_body["construct_ids"]

    db = init_oltp()
    with db.session as session:
        constructs_delete = delete(Construct).where(Construct.id.in_(values))
        session.execute(constructs_delete)
        session.commit()
        return "", StatusCode.NO_CONTENT


# UPDATE bulk of indicators
@quantitative_bp.put("/indicator")
def update_indicators():
    request_body = request.get_json()
    values = request_body["indicators"]

    db = init_oltp()
    with db.session as session:
        indicators_update = update(Indicator)
        session.execute(indicators_update, values)
        session.commit()
        return "", StatusCode.NO_CONTENT
