"""create users table

Revision ID: 0001_create_users_table
Revises:
Create Date: 2026-05-05 00:41:00
"""

from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import ENUM as PgEnum

revision: str = "0001_create_users_table"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.execute(sa.text("DO $$ BEGIN CREATE TYPE userrole AS ENUM ('candidate', 'employer', 'admin'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;"))
    op.execute(sa.text("DO $$ BEGIN CREATE TYPE authprovider AS ENUM ('local', 'google'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;"))

    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("hashed_password", sa.String(length=255), nullable=True),
        sa.Column("role", PgEnum(name="userrole", create_type=False), nullable=False),
        sa.Column("provider", PgEnum(name="authprovider", create_type=False), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_users_email"), "users", ["email"], unique=True)
    op.create_index(op.f("ix_users_id"), "users", ["id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_users_id"), table_name="users")
    op.drop_index(op.f("ix_users_email"), table_name="users")
    op.drop_table("users")
    op.execute(sa.text("DROP TYPE IF EXISTS authprovider"))
    op.execute(sa.text("DROP TYPE IF EXISTS userrole"))
