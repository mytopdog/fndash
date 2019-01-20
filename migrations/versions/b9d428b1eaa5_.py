"""empty message

Revision ID: b9d428b1eaa5
Revises: f5b9e19c7045
Create Date: 2019-01-20 22:20:41.592683

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b9d428b1eaa5'
down_revision = 'f5b9e19c7045'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('user', sa.Column('minutesplayed_duo', sa.Integer(), nullable=True))
    op.add_column('user', sa.Column('minutesplayed_solo', sa.Integer(), nullable=True))
    op.add_column('user', sa.Column('minutesplayed_squad', sa.Integer(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('user', 'minutesplayed_squad')
    op.drop_column('user', 'minutesplayed_solo')
    op.drop_column('user', 'minutesplayed_duo')
    # ### end Alembic commands ###
