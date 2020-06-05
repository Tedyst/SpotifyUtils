from SpotifyUtils import db


class Song(db.Model):
    __tablename__ = "songs"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    artist = db.Column(db.String(50))
    lyrics = db.Column(db.String(5000))
    source = db.Column(db.String(10))
    uri = db.Column(db.String(20))
    image = db.Column(db.String(100))
    preview = db.Column(db.String(100))
    last_check = db.Column(db.Integer)

    # Analise info
    analyzed = db.Column(db.Boolean)
    loudness = db.Column(db.String(50000))
    duration = db.Column(db.Integer)
    key = db.Column(db.Integer)
    key_confidence = db.Column(db.Integer)
    mode = db.Column(db.Integer)
    tempo = db.Column(db.Integer)
    tempo_confidence = db.Column(db.Integer)
    time_signature = db.Column(db.Integer)
    time_signature_confidence = db.Column(db.Integer)

    def __init__(self, name, artist, uri, image, preview):
        self.name = name
        self.artist = artist
        self.uri = uri
        self.image = image
        self.preview = preview

    def __json__(self):
        data = {}
        data["name"] = self.name
        data["artist"] = self.artist
        data["lyrics"] = self.lyrics
        data["uri"] = self.uri
        data["image_url"] = self.image
        data["preview_url"] = self.preview
        return data

    @property
    def title(self):
        return self.name + ' - ' + self.artist
