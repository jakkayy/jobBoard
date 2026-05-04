"""create applications table

Revision ID: 0004_create_applications_table
Revises: 0003_create_jobs_table
Create Date: 2026-05-05 01:02:00
"""

from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa

revision: str = "0004_create_applications_table"
down_revision: str | None = "0003_create_jobs_table"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

application_status = sa.Enum("pending", "reviewing", "accepted", "rejected", name="applicationstatus")


def upgrade() -> None:
    application_status.create(op.get_bind(), checkfirst=True)

    op.create_table(
        "applications",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("job_id", sa.Integer(), nullable=False),
        sa.Column("candidate_id", sa.Integer(), nullable=False),
        sa.Column("cover_letter", sa.Text(), nullable=True),
        sa.Column("cv_url", sa.String(length=500), nullable=True),
        sa.Column("status", application_status, nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(["candidate_id"], ["users.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["job_id"], ["jobs.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("job_id", "candidate_id", name="uq_job_candidate"),
    )
    op.create_index(op.f("ix_applications_candidate_id"), "applications", ["candidate_id"], unique=False)
    op.create_index(op.f("ix_applications_id"), "applications", ["id"], unique=False)
    op.create_index(op.f("ix_applications_job_id"), "applications", ["job_id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_applications_job_id"), table_name="applications")
    op.drop_index(op.f("ix_applications_id"), table_name="applications")
    op.drop_index(op.f("ix_applications_candidate_id"), table_name="applications")
    op.drop_table("applications")

    application_status.drop(op.get_bind(), checkfirst=True)
