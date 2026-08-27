from sqlalchemy.orm import Session

from models.space import Space


def create_space(db: Session, space_data: dict):
    space = Space(**space_data)

    db.add(space)
    db.commit()
    db.refresh(space)

    return space


def get_space(db: Session, space_id: int):
    return db.query(Space).filter(Space.id == space_id).first()


def get_spaces(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Space).offset(skip).limit(limit).all()


def update_space(db: Session, space_id: int, space_data: dict):
    space = db.query(Space).filter(Space.id == space_id).first()

    if not space:
        return None

    for key, value in space_data.items():
        if hasattr(space, key):
            setattr(space, key, value)

    db.commit()
    db.refresh(space)

    return space


def delete_space(db: Session, space_id: int):
    space = db.query(Space).filter(Space.id == space_id).first()

    if not space:
        return None

    db.delete(space)
    db.commit()

    return space