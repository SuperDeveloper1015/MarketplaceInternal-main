import graphene

from app.schema.mutations import Mutation
from app.schema.queries import Query

schema = graphene.Schema(query=Query, mutation=Mutation)
