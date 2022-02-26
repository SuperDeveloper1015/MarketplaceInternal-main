from functools import wraps

from graphql import GraphQLResolveInfo, GraphQLError


def context(f):
    def decorator(func):
        def wrapper(*args, **kwargs):
            info = next(
                arg for arg in args
                if isinstance(arg, GraphQLResolveInfo)
            )
            return func(info.context, *args, **kwargs)
        return wrapper
    return decorator


def login_required(f):
    @wraps(f)
    @context(f)
    def wrapper(ctx, *args, **kwargs):
        if ctx.profile:
            return f(*args, **kwargs)
        raise GraphQLError('Login required')
    return wrapper
