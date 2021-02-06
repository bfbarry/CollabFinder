"""${message}

Revision ID: ${up_revision}
Revises: ${down_revision | comma,n}
Create Date: ${create_date}

"""
from alembic import op
import sqlalchemy as sa
${imports if imports else ""}

# revision identifiers, used by Alembic.
revision = ${repr(up_revision)}
down_revision = ${repr(down_revision)}
branch_labels = ${repr(branch_labels)}
depends_on = ${repr(depends_on)}


def upgrade():
   ${upgrades if upgrades else "pass"}
    ## op.drop_column('project','descr')
    ## op.drop_column('project','description')
    
    ## with op.batch_alter_table('project') as batch_op:
    ##     batch_op.drop_column('description')
    ##     batch_op.drop_column('descr')
    
    ## op.drop_column('project', 'description')
    ## op.drop_column('project', 'descr')
    ## op.alter_column('project', 'description', nullable=False, new_column_name='descr')

def downgrade():
    ${downgrades if downgrades else "pass"}
