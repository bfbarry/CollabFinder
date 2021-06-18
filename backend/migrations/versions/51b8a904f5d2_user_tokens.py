"""user tokens

Revision ID: 51b8a904f5d2
Revises: e1b48319e9a7
Create Date: 2021-06-03 14:17:11.804006

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '51b8a904f5d2'
down_revision = 'e1b48319e9a7'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('user', sa.Column('token', sa.String(length=32), nullable=True))
    op.add_column('user', sa.Column('token_expiration', sa.DateTime(), nullable=True))
    op.create_index(op.f('ix_user_token'), 'user', ['token'], unique=True)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_user_token'), table_name='user')
    op.drop_column('user', 'token_expiration')
    op.drop_column('user', 'token')
    # ### end Alembic commands ###