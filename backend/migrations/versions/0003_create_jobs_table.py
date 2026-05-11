"""create jobs table

Revision ID: 0003_create_jobs_table
Revises: 0002_create_profile_tables
Create Date: 2026-05-05 00:56:00
"""

from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import ENUM as PgEnum

revision: str = "0003_create_jobs_table"
down_revision: str | None = "0002_create_profile_tables"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.execute(sa.text("DO $$ BEGIN CREATE TYPE employmenttype AS ENUM ('full_time', 'part_time', 'contract', 'freelance', 'internship'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;"))
    op.execute(sa.text("DO $$ BEGIN CREATE TYPE jobstatus AS ENUM ('draft', 'published', 'closed'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;"))

    op.create_table(
        "jobs",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("employer_id", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("location", sa.String(length=255), nullable=True),
        sa.Column("employment_type", PgEnum(name="employmenttype", create_type=False), nullable=False),
        sa.Column("salary_min", sa.Integer(), nullable=True),
        sa.Column("salary_max", sa.Integer(), nullable=True),
        sa.Column("skills_required", sa.Text(), nullable=True),
        sa.Column("status", PgEnum(name="jobstatus", create_type=False), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(["employer_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_jobs_employer_id"), "jobs", ["employer_id"], unique=False)
    op.create_index(op.f("ix_jobs_id"), "jobs", ["id"], unique=False)
    op.create_index(op.f("ix_jobs_location"), "jobs", ["location"], unique=False)
    op.create_index(op.f("ix_jobs_title"), "jobs", ["title"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_jobs_title"), table_name="jobs")
    op.drop_index(op.f("ix_jobs_location"), table_name="jobs")
    op.drop_index(op.f("ix_jobs_id"), table_name="jobs")
    op.drop_index(op.f("ix_jobs_employer_id"), table_name="jobs")
    op.drop_table("jobs")
    op.execute(sa.text("DROP TYPE IF EXISTS jobstatus"))
    op.execute(sa.text("DROP TYPE IF EXISTS employmenttype"))
