"""Added analyze info

Revision ID: 9a2710acc810
Revises: 2980293e7e01
Create Date: 2020-06-05 10:31:08.224099

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9a2710acc810'
down_revision = '2980293e7e01'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('songs', sa.Column('analyzed', sa.Boolean(), nullable=True))
    op.add_column('songs', sa.Column('duration', sa.Integer(), nullable=True))
    op.add_column('songs', sa.Column('key', sa.Integer(), nullable=True))
    op.add_column('songs', sa.Column('key_confidence', sa.Integer(), nullable=True))
    op.add_column('songs', sa.Column('loudness', sa.String(length=50000), nullable=True))
    op.add_column('songs', sa.Column('mode', sa.Integer(), nullable=True))
    op.add_column('songs', sa.Column('tempo', sa.Integer(), nullable=True))
    op.add_column('songs', sa.Column('tempo_confidence', sa.Integer(), nullable=True))
    op.add_column('songs', sa.Column('time_signature', sa.Integer(), nullable=True))
    op.add_column('songs', sa.Column('time_signature_confidence', sa.Integer(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('songs', 'time_signature_confidence')
    op.drop_column('songs', 'time_signature')
    op.drop_column('songs', 'tempo_confidence')
    op.drop_column('songs', 'tempo')
    op.drop_column('songs', 'mode')
    op.drop_column('songs', 'loudness')
    op.drop_column('songs', 'key_confidence')
    op.drop_column('songs', 'key')
    op.drop_column('songs', 'duration')
    op.drop_column('songs', 'analyzed')
    # ### end Alembic commands ###