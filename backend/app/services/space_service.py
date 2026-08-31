from typing import Any
from sqlalchemy.orm import Session

from app.crud import space_crud
from app.models.space import Space


def create_space(db: Session, space_data: dict) -> Space:
	return space_crud.create_space(db, space_data)


def get_space(db: Session, space_id: int) -> Space | None:
	return space_crud.get_space(db, space_id)


def list_spaces(db: Session, skip: int = 0, limit: int = 100):
	return space_crud.get_spaces(db, skip=skip, limit=limit)


def update_space(db: Session, space_id: int, space_data: dict) -> Space | None:
	return space_crud.update_space(db, space_id, space_data)


def delete_space(db: Session, space_id: int) -> Space | None:
	return space_crud.delete_space(db, space_id)

