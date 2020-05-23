class Playlist():
    def __init__(self, id, name, tracks):
        self.id = id
        self.name = name
        self.tracks = []

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "tracks": self.tracks
        }
