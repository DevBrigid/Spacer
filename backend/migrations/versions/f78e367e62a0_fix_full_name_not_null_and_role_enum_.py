"""fix full_name not null and role enum type

Revision ID: f78e367e62a0
Revises: add_user_columns_20260827
Create Date: 2026-08-28 07:47:05.304624

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f78e367e62a0'
down_revision: Union[str, Sequence[str], None] = 'add_user_columns_20260827'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # 1. Backfill any existing NULL full_name rows before enforcing NOT NULL
    op.execute("""
        UPDATE users SET full_name = 'Unknown' WHERE full_name IS NULL;
    """)

    # 2. Enforce NOT NULL on full_name, matching the SQLAlchemy model
    op.execute("""
        ALTER TABLE users ALTER COLUMN full_name SET NOT NULL;
    """)

    # 3. Create the real Postgres ENUM type to match the model
    op.execute("""
        DO $$ BEGIN
            CREATE TYPE user_role AS ENUM ('client', 'admin');
        EXCEPTION
            WHEN duplicate_object THEN null;
        END $$;
    """)

    # 4. Drop the existing default before changing the column type
    op.execute("""
        ALTER TABLE users ALTER COLUMN role DROP DEFAULT;
    """)

    # 5. Convert the existing plain-string role column to the enum type
    op.execute("""
        ALTER TABLE users
        ALTER COLUMN role TYPE user_role
        USING role::user_role;
    """)

    # 6. Re-apply NOT NULL + default now that the type is correct
    op.execute("""
        ALTER TABLE users ALTER COLUMN role SET DEFAULT 'client';
        ALTER TABLE users ALTER COLUMN role SET NOT NULL;
    """)


def downgrade() -> None:
    """Downgrade schema."""
    op.execute("""
        ALTER TABLE users ALTER COLUMN full_name DROP NOT NULL;
        ALTER TABLE users ALTER COLUMN role DROP DEFAULT;
        ALTER TABLE users ALTER COLUMN role DROP NOT NULL;
        ALTER TABLE users ALTER COLUMN role TYPE VARCHAR(32) USING role::text;
        DROP TYPE IF EXISTS user_role;
    """)
