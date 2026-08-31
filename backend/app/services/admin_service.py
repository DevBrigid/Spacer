from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.crud import user_crud, space_crud
from app.models.user import User


def delete_user(db: Session, user_id: int) -> User | None:
	return user_crud.delete_user(db, user_id)


def update_user_role(db: Session, user_id: int, role: str) -> User | None:
	return user_crud.update_user(db, user_id, {"role": role})


def create_space_for_admin(db: Session, space_data: dict, admin: User):
	# validate required fields for Space
	required = ["title", "description", "location", "capacity", "price_per_hour"]
	for key in required:
		if key not in space_data:
			raise HTTPException(status_code=400, detail=f"{key} is required to create a space")

	data = space_data.copy()
	# ensure owner is set to admin id if not provided
	data.setdefault("ownerId", getattr(admin, "id", None))
	return space_crud.create_space(db, data)

