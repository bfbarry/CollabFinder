"""category in project

Revision ID: a252fc774bbd
Revises: 0813e77d908d
Create Date: 2021-02-05 18:58:18.285288

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a252fc774bbd'
down_revision = '0813e77d908d'
branch_labels = None
depends_on = None


def upgrade():
   # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('project', sa.Column('category', sa.String(length=60), nullable=True))
    # ### end Alembic commands ###
    
    

def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('project', 'category')
    # ### end Alembic commands ###
