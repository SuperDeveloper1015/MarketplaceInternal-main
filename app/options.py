import dbsettings


class InternalOptions(dbsettings.Group):
    deposits_last_block = dbsettings.IntegerValue()
