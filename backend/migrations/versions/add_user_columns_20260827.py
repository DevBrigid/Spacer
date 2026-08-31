"""add user columns: full_name, role, updated_at

Revision ID: add_user_columns_20260827
Revises: 4cf118997014
Create Date: 2026-08-27

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "add_user_columns_20260827"
down_revision: Union[str, Sequence[str], None] = "4cf118997014"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Use idempotent SQL so running this migration multiple times is safe
    op.execute("""
    ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name VARCHAR(120);
    ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(32) DEFAULT 'client';
    ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();
    """)


def downgrade() -> None:
    # Drop the columns if they exist
    op.execute("""
    ALTER TABLE users DROP COLUMN IF EXISTS full_name;
    ALTER TABLE users DROP COLUMN IF EXISTS role;
    ALTER TABLE users DROP COLUMN IF EXISTS updated_at;
    """)